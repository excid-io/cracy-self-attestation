import { saveQuestionState, loadQuestionState } from "./storage.js";

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

    // Links: [label](#target) — label may already contain <strong>...</strong>
    html = html.replace(/\[(.+?)\]\((#[^)]+)\)/g, '<a href="$2">$1</a>');

    return html;
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

export function renderQuestions(params) {
    const container = params.container;
    const questions = params.questions;
    const setId = params.setId;
    const progressFillEl = params.progressFillEl;
    const progressTextEl = params.progressTextEl;
    const topTitle = params.topTitle || null;

    container.innerHTML = "";

    // LEVEL 1 TITLE
    if (topTitle) {
        const topEl = document.createElement("div");
        topEl.className = "section-title top-level-section-title";
        topEl.textContent = topTitle;
        container.appendChild(topEl);
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

    questions.forEach((q) => {
        // Determine levels:
        // - JSON model: use sectionLevel2/3
        // - Markdown sets: fall back to "section" as level 2
        const level2 = q.sectionLevel2 !== undefined
            ? q.sectionLevel2
            : (q.section || null);
        const level3 = q.sectionLevel3 !== undefined
            ? q.sectionLevel3
            : null;

        // LEVEL 2 HEADING (e.g. "EARLY WARNING REPORTING")
        if (level2 && level2 !== currentLevel2) {
            currentLevel2 = level2;
            currentLevel3 = null;

            // Avoid duplicating the top title if it's the same string
            if (!topTitle || level2 !== topTitle) {
                const h2 = document.createElement("div");
                h2.className = "section-title section-title-level2";
                h2.textContent = level2;
                container.appendChild(h2);
            }
        }

        // LEVEL 3 HEADING (e.g. a ### section inside Part I)
        if (level3 && level3 !== currentLevel3) {
            currentLevel3 = level3;

            const h3 = document.createElement("div");
            h3.className = "section-title section-title-level3";
            h3.textContent = level3;
            container.appendChild(h3);
        }

        const card = document.createElement("div");
        card.className = "question-card";
        card.id = q.id; 

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
        // DETAILS (nested bullets or indented explanations)
        //
        if (q.details && q.details.length > 0)
        {
            const detailsList = document.createElement("ul");
            detailsList.className = "question-details";

            q.details.forEach(
                (detailLine) => {
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
        // STATUS CONTROLS (Done, In Progress, Not Done)
        //
        const statusWrapper = document.createElement("div");
        statusWrapper.className = "status-controls";

        // Done (checkbox)
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = q.id;
        checkbox.className = "status-done";

        // In Progress button
        const progressBtn = document.createElement("button");
        progressBtn.className = "status-progress";
        progressBtn.textContent = "In Progress";

        // Not Done button
        const notDoneBtn = document.createElement("button");
        notDoneBtn.className = "status-notdone";
        notDoneBtn.textContent = "Not Done";

        statusWrapper.appendChild(checkbox);
        statusWrapper.appendChild(progressBtn);
        statusWrapper.appendChild(notDoneBtn);

        //
        // LOAD STORED STATE (status + notes)
        //
        let status;
        if (stored.status)
        {
            status = stored.status;
        }
        else if (stored.checked)   // backward compatibility with old schema
        {
            status = "done";
        }
        else
        {
            status = "notdone";
        }

        applyStatus(card, badge, checkbox, status);

        //
        // EVENT HANDLERS
        //
        checkbox.addEventListener("change", () =>
        {
            const newStatus = checkbox.checked ? "done" : "notdone";

            const state =
            {
                status: newStatus,
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            applyStatus(card, badge, checkbox, newStatus);
            updateProgress(container, progressFillEl, progressTextEl);
        });

        progressBtn.addEventListener("click", () =>
        {
            const state =
            {
                status: "progress",
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            applyStatus(card, badge, checkbox, "progress");
            updateProgress(container, progressFillEl, progressTextEl);
        });

        notDoneBtn.addEventListener("click", () =>
        {
            const state =
            {
                status: "notdone",
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            applyStatus(card, badge, checkbox, "notdone");
            updateProgress(container, progressFillEl, progressTextEl);
        });

        notes.addEventListener("input", () =>
        {
            // Keep current status, just update notes
            const state =
            {
                status: status,
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            // status/colours do not change just by typing notes
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

function applyStatus(card, badge, checkbox, status)
{
    card.classList.remove("answered", "inprogress", "notdone");

    const dot = badge.querySelector(".badge-dot");
    const label = badge.querySelector("span:nth-child(2)");

    checkbox.checked = (status === "done");

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

document.addEventListener("click", (ev) => {
    const link = ev.target.closest("a[href^='#']");
    if (!link) return;

    const targetId = link.getAttribute("href").substring(1);
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    //ev.preventDefault(); // stop default jump

    //const scrollContainer = document.querySelector(".main") || document.documentElement;

    //// Geometry relative to the scroll container
    //const containerRect = scrollContainer.getBoundingClientRect();
    //const targetRect = targetEl.getBoundingClientRect();

    //const currentScroll = scrollContainer.scrollTop;
    //const offsetInside = targetRect.top - containerRect.top;

    //// How far from the top you want the card to appear
    //const desiredOffsetFromTop = 120; // px (tweak to taste)

    //const newScrollTop = currentScroll + offsetInside - desiredOffsetFromTop;

    //scrollContainer.scrollTo({
    //    top: newScrollTop,
    //    behavior: "smooth",
    //});

    // Temporary highlight
    targetEl.classList.add("flash-highlight");
    setTimeout(() => targetEl.classList.remove("flash-highlight"), 1300);
});