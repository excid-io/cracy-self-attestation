import { saveQuestionState, loadQuestionState } from "./storage.js";

function renderSectionDescriptionBlock(container, text)
{
    if (!text || !text.trim()) return;

    const wrapper = document.createElement("div");
    wrapper.className = "section-description";

    const body = document.createElement("div");
    body.className = "section-description-body";

    // NEW: full-ish markdown support for subsection descriptions
    body.innerHTML = renderMarkdownBlocks(text);

    wrapper.appendChild(body);
    container.appendChild(wrapper);
}

export function renderSetSelector(selectEl, sets, onChange)
{
    selectEl.innerHTML = "";

    sets.forEach((set) =>
    {
        const opt = document.createElement("option");
        opt.value = set.id;
        opt.textContent = set.name;
        selectEl.appendChild(opt);
    });

    selectEl.addEventListener("change", () =>
    {
        const selectedSet = sets.find(s => s.id === selectEl.value);
        if (selectedSet)
        {
            onChange(selectedSet);
        }
    });
}

function renderMarkdownInline(text)
{
    // Escape HTML first
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic: *text*
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Cross-set links: [label](set:some-set-id#optional-question-id)
    html = html.replace(
        /\[(.+?)\]\(set:([^)#]+)(#[^)]+)?\)/g,
        (match, label, setId, hash) =>
        {
            const questionId = hash ? hash.substring(1) : "";
            const extra = questionId
                ? ` data-target-question="${questionId}"`
                : "";
            return `<a href="#" data-set-id="${setId}"${extra}>${label}</a>`;
        }
    );

    // Internal links inside the same set: [label](#target)
    html = html.replace(/\[(.+?)\]\((#[^)]+)\)/g, '<a href="$2">$1</a>');

    return html;
}

function renderMarkdownBlocks(text)
{
    if (!text) return "";

    const lines = text.split(/\r?\n/);
    const out = [];
    let inList = false;

    function closeList()
    {
        if (inList)
        {
            out.push("</ul>");
            inList = false;
        }
    }

    for (const raw of lines)
    {
        const line = raw.replace(/\s+$/, ""); // trim right
        const trimmed = line.trim();

        // Blank line → separates blocks
        if (!trimmed)
        {
            closeList();
            continue;
        }

        // Headings: #, ##, ### ...
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch)
        {
            closeList();
            const level = headingMatch[1].length;
            const content = headingMatch[2].trim();
            out.push(
                `<h${level}>${renderMarkdownInline(content)}</h${level}>`
            );
            continue;
        }

        // Blockquote: > text
        const quoteMatch = trimmed.match(/^>\s+(.*)$/);
        if (quoteMatch)
        {
            closeList();
            const content = quoteMatch[1].trim();
            out.push(
                `<blockquote>${renderMarkdownInline(content)}</blockquote>`
            );
            continue;
        }

        // Unordered list item: - item or * item
        const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
        if (listMatch)
        {
            const itemText = listMatch[1].trim();
            if (!inList)
            {
                inList = true;
                out.push("<ul>");
            }
            out.push(`<li>${renderMarkdownInline(itemText)}</li>`);
            continue;
        }

        // Fallback: normal paragraph
        closeList();
        out.push(`<p>${renderMarkdownInline(trimmed)}</p>`);
    }

    // Close any open list at EOF
    closeList();

    return out.join("");
}

function escapeRegExp(str)
{
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replace occurrences of **Title** with markdown links
 * [**Title**](#question-id) when Title matches a known question title.
 */
function linkifyQuestionRefs(markdownText, titleIndex, selfId)
{
    if (!markdownText) return markdownText;

    let result = markdownText;

    titleIndex.forEach(
        (id, title) => {
            // Optionally skip linking to the same question (self reference)
            if (id === selfId) return;

            const pattern = new RegExp
            (
                `\\*\\*${escapeRegExp(title)}\\*\\*`,
                "g"
            );

            result = result.replace
            (
                pattern,
                `[**${title}**](#${id})`
            );
        }
    );

    return result;
}

export function renderQuestions(params)
{
    const container = params.container;
    const questions = params.questions;
    const setId = params.setId;
    const progressFillEl = params.progressFillEl;
    const progressTextEl = params.progressTextEl;
    const topTitle = params.topTitle || null;
    const sectionDescriptions = params.sectionDescriptions || null;

    ensureInfoPopupElements();

    container.innerHTML = "";

    // LEVEL 1: TOP TITLE
    if (topTitle)
    {
        const topEl = document.createElement("div");
        topEl.className = "section-title top-level-section-title";
        topEl.textContent = topTitle;
        container.appendChild(topEl);

        // Optional: description attached to the top-level section
        if (sectionDescriptions)
        {
            const topDesc = sectionDescriptions[`level1:${topTitle}`];
            if (topDesc)
            {
                renderSectionDescriptionBlock(container, topDesc);
            }
        }
    }

    if (params.setDescription && params.setDescription.trim().length > 0)
    {
        const wrapper = document.createElement("div");
        wrapper.className = "set-description";

        const header = document.createElement("div");
        header.className = "set-description-header";
        header.textContent = "Description";

        const body = document.createElement("div");
        body.className = "set-description-body";
        body.innerHTML = renderMarkdownBlocks(params.setDescription.trim());

        wrapper.appendChild(header);
        wrapper.appendChild(body);
        container.appendChild(wrapper);
    }

    const titleIndex = new Map();
    questions.forEach(
        (q) => {
            if (q.title)
            {
                titleIndex.set(q.title.trim(), q.id);
            }
        }
    );

    // Track last seen headings
    let currentLevel2 = null;
    let currentLevel3 = null;

    questions.forEach((q) =>
    {
        const level2 = q.sectionLevel2 !== undefined
            ? q.sectionLevel2
            : (q.section || null);
        const level3 = q.sectionLevel3 !== undefined
            ? q.sectionLevel3
            : null;

        // LEVEL 2 HEADING
        if (level2 && level2 !== currentLevel2)
        {
            currentLevel2 = level2;
            currentLevel3 = null;

            if (!topTitle || level2 !== topTitle)
            {
                const h2 = document.createElement("div");
                h2.className = "section-title section-title-level2";
                h2.textContent = level2;
                container.appendChild(h2);
            }

            // Description for this level-2 section
            if (sectionDescriptions)
            {
                const key = `level2:${level2}`;
                const desc = sectionDescriptions[key];
                if (desc)
                {
                    renderSectionDescriptionBlock(container, desc);
                }
            }
        }

        // LEVEL 3 HEADING
        if (level3 && level3 !== currentLevel3)
        {
            currentLevel3 = level3;

            const h3 = document.createElement("div");
            h3.className = "section-title section-title-level3";
            h3.textContent = level3;
            container.appendChild(h3);

            // Description for this level-3 section (needs parent + child)
            if (sectionDescriptions && currentLevel2)
            {
                const key3 = `level3:${currentLevel2}>${level3}`;
                const desc3 = sectionDescriptions[key3];
                if (desc3)
                {
                    renderSectionDescriptionBlock(container, desc3);
                }
            }
        }

        const card = document.createElement("div");
        card.className = "question-card";
        card.id = q.id;
        card.style.position = "relative";

        //
        // CONTENT AREA
        //
        const content = document.createElement("div");
        content.className = "question-content";

        //
        // MAIN QUESTION TEXT
        //
        const textEl = document.createElement("div");
        textEl.className = "question-text";

        // Linkify references in the main question text
        const linkedText = linkifyQuestionRefs(q.text || "", titleIndex, q.id);

        if (q.title)
        {
            textEl.innerHTML = `<strong>${renderMarkdownInline(q.title)}:</strong> ${renderMarkdownInline(linkedText)}`;
        }
        else
        {
            textEl.innerHTML = renderMarkdownInline(linkedText);
        }

        content.appendChild(textEl);

        //
        // BADGE (status label)
        //
        const badge = document.createElement("span");
        badge.className = "badge";

        const dot = document.createElement("span");
        dot.className = "badge-dot pending";

        const label = document.createElement("span");
        label.textContent = "Not done";

        badge.appendChild(dot);
        badge.appendChild(label);

        content.appendChild(badge);

        //
        // OPTIONAL INFO BUTTON (opens popup with q.info)
        //
        if (q.info && q.info.trim().length > 0)
        {
            const infoBtn = document.createElement("button");
            infoBtn.type = "button";
            infoBtn.className = "info-button";
            infoBtn.innerHTML = "💡";

            infoBtn.addEventListener("click", () =>
            {
                const linkedInfo = linkifyQuestionRefs(q.info || "", titleIndex, q.id);
                const html = linkedInfo
                    .split("\n")
                    .map(p => `<p>${renderMarkdownInline(p)}</p>`)
                    .join("");
                openInfoPopup(q.title || "Info", html);
            });

            content.appendChild(infoBtn);
        }

        //
        // DETAILS (nested bullets or indented explanations)
        //
        if (q.details && q.details.length > 0)
        {
            const detailsList = document.createElement("ul");
            detailsList.className = "question-details";

            q.details.forEach(
                (detailLine) =>
                {
                    const li = document.createElement("li");
                    const linkedDetail = linkifyQuestionRefs(detailLine || "", titleIndex, q.id);
                    li.innerHTML = renderMarkdownInline(linkedDetail);
                    detailsList.appendChild(li);
                }
            );

            content.appendChild(detailsList);
        }

        //
        // NOTES AREA
        //
        const stored = loadQuestionState(setId, q.id) || {};
        const notes = document.createElement("textarea");
        notes.className = "notes";
        notes.placeholder = "Optional notes / where this is documented…";
        notes.value = stored.notes || "";

        content.appendChild(notes);

        //
        // STATUS CONTROLS (Done / In progress / Not done / Not applicable)
        //
        const statusWrapper = document.createElement("div");
        statusWrapper.className = "status-controls";

        function makeStatusOption(value, labelText, extraClass)
        {
            const labelEl = document.createElement("label");
            labelEl.className = `status-option ${extraClass || ""}`;

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `status-${q.id}`;
            input.value = value;
            input.className = "status-radio-input";

            const circle = document.createElement("span");
            circle.className = "status-radio";

            const text = document.createElement("span");
            text.className = "status-label";
            text.textContent = labelText;

            labelEl.appendChild(input);
            labelEl.appendChild(circle);
            labelEl.appendChild(text);

            return { labelEl, input };
        }

        const doneOpt     = makeStatusOption("done",     "Done",         "status-option-done");
        const progressOpt = makeStatusOption("progress", "In progress",  "status-option-progress");
        const notDoneOpt  = makeStatusOption("notdone",  "Not done",     "status-option-notdone");

        statusWrapper.appendChild(doneOpt.labelEl);
        statusWrapper.appendChild(progressOpt.labelEl);
        statusWrapper.appendChild(notDoneOpt.labelEl);

        let naOpt = null;
        if (q.allow_na)
        {
            naOpt = makeStatusOption("na", "Not applicable", "status-option-na");
            statusWrapper.appendChild(naOpt.labelEl);
        }

        //
        // LOAD STORED STATE (status + notes)
        //
        let status;
        if (stored.status)
        {
            status = stored.status;
        }
        else if (stored.checked) // backward compatibility
        {
            status = "done";
        }
        else
        {
            status = "notdone";
        }

        // Reflect in radios
        doneOpt.input.checked     = (status === "done");
        progressOpt.input.checked = (status === "progress");
        notDoneOpt.input.checked  = (status === "notdone");
        if (naOpt)
        {
            naOpt.input.checked = (status === "na");
        }

        function updateSelectedClasses()
        {
            [doneOpt, progressOpt, notDoneOpt, naOpt].forEach(opt =>
            {
                if (!opt) return;
                if (opt.input.checked)
                {
                    opt.labelEl.classList.add("status-option-selected");
                }
                else
                {
                    opt.labelEl.classList.remove("status-option-selected");
                }
            });
        }

        applyStatus(card, badge, status);
        updateSelectedClasses();

        function setStatus(newStatus)
        {
            status = newStatus;

            const state =
            {
                status: newStatus,
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            applyStatus(card, badge, newStatus);
            updateSelectedClasses();
            updateProgress(container, progressFillEl, progressTextEl);
        }

        // Hook up radios
        doneOpt.input.addEventListener("change", () => setStatus("done"));
        progressOpt.input.addEventListener("change", () => setStatus("progress"));
        notDoneOpt.input.addEventListener("change", () => setStatus("notdone"));
        if (naOpt)
        {
            naOpt.input.addEventListener("change", () => setStatus("na"));
        }

        notes.addEventListener("input", () =>
        {
            // Keep current status, just update notes
            const state =
            {
                status: status,
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
        });

        //
        // ASSEMBLE CARD
        //
        card.appendChild(statusWrapper);
        card.appendChild(content);

        container.appendChild(card);
    });

    //
    // INITIAL PROGRESS UPDATE
    //
    updateProgress(container, progressFillEl, progressTextEl);
}

function applyStatus(card, badge, status)
{
    card.classList.remove("answered", "inprogress", "notdone", "na");

    const dot = badge.querySelector(".badge-dot");
    const label = badge.querySelector("span:nth-child(2)");

    if (status === "done")
    {
        card.classList.add("answered");
        dot.classList.remove("pending");
        label.textContent = "Done";
    }
    else if (status === "progress")
    {
        card.classList.add("inprogress");
        dot.classList.remove("pending");
        label.textContent = "In progress";
    }
    else if (status === "na")
    {
        card.classList.add("na");
        dot.classList.remove("pending");
        label.textContent = "Not applicable";
    }
    else
    {
        card.classList.add("notdone");
        dot.classList.add("pending");
        label.textContent = "Not done";
    }
}

export function updateProgress(container, progressFillEl, progressTextEl)
{
    const cards = Array.from(container.querySelectorAll(".question-card"));
    const total = cards.length;

    let done = 0;
    let progress = 0;
    let notdone = 0;

    cards.forEach((card) =>
    {
        if (card.classList.contains("answered"))
        {
            done++;
        }
        else if (card.classList.contains("inprogress"))
        {
            progress++;
        }
        else
        {
            notdone++;
        }
    });

    const pct = (total == 0) ? 0 : (done / total) * 100.0;
    progressFillEl.style.width = `${pct.toFixed(1)}%`;

    progressTextEl.textContent =
        `${done} done | ${progress} in progress | ${notdone} not done`;
}

document.addEventListener("click", (ev) =>
{
    const link = ev.target.closest("a[href^='#']");
    if (!link) return;

    const targetId = link.getAttribute("href").substring(1);
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    targetEl.classList.add("flash-highlight");
    setTimeout(() => targetEl.classList.remove("flash-highlight"), 1300);
});

// ===== INFO POPUP (for per-question explanatory text) =====

function ensureInfoPopupElements()
{
    let overlay = document.getElementById("infoOverlay");
    if (!overlay)
    {
        overlay = document.createElement("div");
        overlay.id = "infoOverlay";
        overlay.className = "info-overlay hidden";
        document.body.appendChild(overlay);

        overlay.addEventListener("click", closeInfoPopup);
    }

    let popup = document.getElementById("infoPopup");
    if (!popup)
    {
        popup = document.createElement("div");
        popup.id = "infoPopup";
        popup.className = "info-popup hidden";
        popup.innerHTML = `
            <div class="info-popup-header">
                <span id="infoPopupTitle"></span>
                <button type="button" id="infoPopupClose" class="info-popup-close">&times;</button>
            </div>
            <div class="info-popup-body" id="infoPopupBody"></div>
        `;
        document.body.appendChild(popup);

        const closeBtn = popup.querySelector("#infoPopupClose");
        closeBtn.addEventListener("click", closeInfoPopup);
    }
}

function openInfoPopup(title, htmlBody)
{
    ensureInfoPopupElements();
    const overlay = document.getElementById("infoOverlay");
    const popup = document.getElementById("infoPopup");
    const titleEl = document.getElementById("infoPopupTitle");
    const bodyEl = document.getElementById("infoPopupBody");

    titleEl.textContent = title || "Info";
    bodyEl.innerHTML = htmlBody;

    overlay.classList.remove("hidden");
    popup.classList.remove("hidden");
}

function closeInfoPopup()
{
    const overlay = document.getElementById("infoOverlay");
    const popup = document.getElementById("infoPopup");
    if (overlay) overlay.classList.add("hidden");
    if (popup) popup.classList.add("hidden");
}

// Optional: close on Esc
document.addEventListener("keydown", (ev) =>
{
    if (ev.key === "Escape")
    {
        closeInfoPopup();
    }
});
