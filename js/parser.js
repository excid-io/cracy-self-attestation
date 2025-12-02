export function parseQuestionsFromMarkdown(mdText, setId)
{
    const lines = mdText.split(/\r?\n/);
    const questions = [];
    const sectionDescriptionsMap = new Map();

    let currentSection = "";
    let lastQuestion = null;
    let lastHeading = "";
    let pendingDescLines = [];

    function flushPendingDescription()
    {
        if (!lastHeading || pendingDescLines.length === 0) return;

        const desc = pendingDescLines
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(" ");

        if (desc)
        {
            // Treat all markdown headings as "level 2" sections for rendering
            sectionDescriptionsMap.set(`level2:${lastHeading}`, desc);
        }

        pendingDescLines = [];
    }


    for (const rawLine of lines)
    {
        const trimmed = rawLine.trim();

        // Headings (#, ##, ### ...)
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch)
        {
            // We are leaving the previous heading -> store its description, if any
            flushPendingDescription();

            const headingText = headingMatch[2].trim();
            currentSection = headingText;
            lastHeading = headingText;
            lastQuestion = null; // reset grouping on new section
            continue;
        }

        // Main question bullets (any indent):
        // - **Title**: Question text...
        const bulletQuestionMatch = rawLine.match(/^\s*-\s+\*\*(.+?)\*\*:\s*(.*)$/);
        if (bulletQuestionMatch)
        {
            // First question under this heading: freeze any accumulated description
            flushPendingDescription();

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
        if (lastQuestion && rawLine.match(/^\s*-\s+(.*)$/))
        {
            const detailText = rawLine.replace(/^\s*-\s+/, "").trim();
            if (detailText.length > 0)
            {
                const lower = detailText.toLowerCase();
                if (lower.startsWith("na:"))
                {
                    lastQuestion.allow_na = true;
                    // don't add this line to details or info
                    continue;
                }
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
        if (lastQuestion && rawLine.match(/^\s{2,}\S/))
        {
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

        // Section description lines:
        // If we're after a heading and before the first question in that section,
        // treat non-empty lines as subsection description.
        if (lastHeading && !lastQuestion && trimmed.length > 0)
        {
            pendingDescLines.push(trimmed);
        }
        // Blank lines or unrelated content are otherwise ignored
    }

    // Flush description for the last heading at EOF
    flushPendingDescription();

    // Convert Map -> plain object
    const sectionDescriptions = {};
    sectionDescriptionsMap.forEach((v, k) => { sectionDescriptions[k] = v; });

    // For now we don't infer a topTitle from Markdown headings
    return { questions, topTitle: null, sectionDescriptions };
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
    const sectionDescriptions = {};

    if (!model || !Array.isArray(model.sections))
    {
        return { questions, topTitle: null, sectionDescriptions };
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
            return { text: content.trim(), details: [], info: "" };
        }

        let main = null;
        const details = [];
        const infoLines = [];

        for (const raw of lines)
        {
            const t = raw.trim();
            if (!t) continue;

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
            }
            else
            {
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
        }

        return {
            text: main || "",
            details,
            info: infoLines.join("\n")
        };
    }

    function recordDescription(path, description)
    {
        if (!description || !description.trim()) return;
        const desc = description.trim();
        const depth = path.length;

        if (depth === 1)
        {
            sectionDescriptions[`level1:${path[0]}`] = desc;
        }
        else if (depth === 2)
        {
            sectionDescriptions[`level2:${path[1]}`] = desc;
        }
        else if (depth >= 3)
        {
            sectionDescriptions[`level3:${path[1]}>${path[2]}`] = desc;
        }
    }

    function walkNode(node, path)
    {
        const thisTitle = node.title || null;
        const newPath = thisTitle ? [...path, thisTitle] : path;

        // capture description for this node
        if (node.description)
        {
            recordDescription(newPath, node.description);
        }

        const depth = newPath.length;
        const level2 = depth >= 2 ? newPath[1] : null;
        const level3 = depth >= 3 ? newPath[2] : null;

        if (Array.isArray(node.questions))
        {
            node.questions.forEach((q) =>
            {
                const split = splitContentIntoMainAndDetails(q.content || "");

                questions.push({
                    id: q.id || `${setId}-${counter++}`,
                    section: level3 || level2 || thisTitle || "",
                    sectionLevel2: level2,
                    sectionLevel3: level3,
                    title: q.title || "",
                    text: split.text,
                    details: split.details,
                    info: (q.info && q.info.trim()) || split.info || "",
                    allow_na: !!q.allow_na
                });
            });
        }

        if (Array.isArray(node.subsections))
        {
            node.subsections.forEach((sub) => walkNode(sub, newPath));
        }
    }

    rootSections.forEach((sec) => walkNode(sec, []));

    return { questions, topTitle, sectionDescriptions };
}