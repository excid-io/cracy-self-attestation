export function parseQuestionsFromMarkdown(mdText, setId)
{
    const lines = mdText.split(/\r?\n/);
    const questions = [];
    let currentSection = "";
    let lastQuestion = null;

    for (const rawLine of lines)
    {
        const trimmed = rawLine.trim();

        // Headings (#, ##, ### ...)
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch)
        {
            currentSection = headingMatch[2].trim();
            lastQuestion = null; // reset grouping on new section
            continue;
        }

        // Main question bullets (any indent):
        // - **Title**: Question text...
        const bulletQuestionMatch = rawLine.match(/^\s*-\s+\*\*(.+?)\*\*:\s*(.*)$/);
        if (bulletQuestionMatch)
        {
            const title = bulletQuestionMatch[1].trim();
            const text = bulletQuestionMatch[2].trim();

            const question = 
            {
                id: `${setId}-${questions.length}`,
                section: currentSection,
                title: title,
                text: text,
                details: [],
                info: ""
            };

            questions.push(question);
            lastQuestion = question;
            continue;
        }

        // Detail sub-bullets (no bold title) that belong to the last question
        // e.g. "    - These can include drawings and schemes"
        if (lastQuestion && rawLine.match(/^\s*-\s+(.*)$/))
        {
            const detailText = rawLine.replace(/^\s*-\s+/, "").trim();
            if (detailText.length > 0)
            {
                // NEW: if this is an info: line, store it in q.info instead of q.details
                const lower = detailText.toLowerCase();
                if (lower.startsWith("info:"))
                {
                    const infoText = detailText.slice(5).trim();
                    if (infoText)
                    {
                        lastQuestion.info = lastQuestion.info
                            ? `${lastQuestion.info}\n${infoText}`
                            : infoText;
                    }
                }
                else
                {
                    lastQuestion.details.push(detailText);
                }
            }
            continue;
        }

        // Indented paragraphs as extra details for the last question
        // e.g. the long explanation lines under "intended purpose"
        if (lastQuestion && rawLine.match(/^\s{2,}\S/))
        {
            // NEW: allow "info:" as indented paragraph too
            const infoMatch = trimmed.match(/^info:\s*(.*)$/i);
            if (infoMatch)
            {
                const infoText = infoMatch[1].trim();
                if (infoText)
                {
                    lastQuestion.info = lastQuestion.info
                        ? `${lastQuestion.info}\n${infoText}`
                        : infoText;
                }
            }
            else
            {
                lastQuestion.details.push(trimmed);
            }
            continue;
        }

        // Blank lines or unrelated content are ignored
    }

    return questions;
}

/**
 * Parse a machine-readable JSON model (as produced by buildMachineReadableModel)
 * back into the same internal `questions` array shape the UI expects.
 *
 * model shape:
 * {
 *   "sections": [
 *     {
 *       "title": "...",
 *       "description": "...",
 *       "questions": [
 *         {
 *           "id": "...",
 *           "title": "...",
 *           "prompt": "...",
 *           "type": "mchoices",
 *           "responses": [...],
 *           "status": "...",
 *           "notes": "..."
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export function parseQuestionsFromModelJson(model, setId)
{
    const questions = [];

    if (!model || !Array.isArray(model.sections))
    {
        return { questions, topTitle: null };
    }

    const rootSections = model.sections;
    const topTitle = rootSections[0]?.title || null;
    let counter = 0;

    function splitContentIntoMainAndDetails(content)
    {
        if (!content) return { text: "", details: [], info: "" };

        const lines = content.split(/\r?\n/);
        if (lines.length === 1)
        {
            // Single-line content: no separate info or details
            return { text: content.trim(), details: [], info: "" };
        }

        let main = null;
        const details = [];
        const infoLines = [];

        for (const raw of lines)
        {
            const t = raw.trim();
            if (!t) continue;

            // NEW: capture info: lines (and "- info:")
            const infoMatch = t.match(/^(-\s*)?info:\s*(.*)$/i);
            if (infoMatch)
            {
                const infoText = (infoMatch[2] || "").trim();
                if (infoText)
                {
                    infoLines.push(infoText);
                }
                continue;
            }

            if (main === null)
            {
                main = t;
                continue;
            }

            const m = t.match(/^-\s*(.*)$/);
            if (m)
            {
                details.push(m[1].trim());
            }
            else
            {
                details.push(t);
            }
        }

        return {
            text: main || "",
            details,
            info: infoLines.join("\n")
        };
    }

    function walkNode(node, path)
    {
        const thisTitle = node.title || null;
        const newPath = thisTitle ? [...path, thisTitle] : path;

        const depth = newPath.length;
        const level2 = depth >= 2 ? newPath[1] : null;
        const level3 = depth >= 3 ? newPath[2] : null;

        if (Array.isArray(node.questions))
        {
            node.questions.forEach((q) => {
                const split = splitContentIntoMainAndDetails(q.content || "");

                questions.push({
                    id: q.id || `${setId}-${counter++}`,
                    section: level3 || level2 || thisTitle || "",
                    sectionLevel2: level2,
                    sectionLevel3: level3,
                    title: q.title || "",
                    text: split.text,
                    details: split.details,
                    info: (q.info && q.info.trim()) || split.info || ""
                });
        });
        }

        if (Array.isArray(node.subsections))
        {
            node.subsections.forEach((sub) => walkNode(sub, newPath));
        }
    }

    rootSections.forEach((sec) => walkNode(sec, []));

    return { questions, topTitle };
}
