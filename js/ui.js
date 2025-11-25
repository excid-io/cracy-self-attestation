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
    // Very small, unsafe-for-untrusted-input markdown renderer.
    // Escape HTML first
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic: *text*
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    return html;
}

export function renderQuestions(params)
{
    const container = params.container;
    const questions = params.questions;
    const setId = params.setId;
    const progressFillEl = params.progressFillEl;
    const progressTextEl = params.progressTextEl;

    container.innerHTML = "";

    let currentSection = null;

    questions.forEach((q) =>
    {
        //
        // SECTION HEADER
        //
        if (q.section && q.section !== currentSection)
        {
            currentSection = q.section;

            const sectionEl = document.createElement("div");
            sectionEl.className = "section-title";
            sectionEl.textContent = currentSection;

            container.appendChild(sectionEl);
        }

        //
        // QUESTION CARD
        //
        const card = document.createElement("div");
        card.className = "question-card";

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

        if (q.title)
        {
            textEl.innerHTML = `<strong>${renderMarkdownInline(q.title)}:</strong> ${renderMarkdownInline(q.text)}`;
        }
        else
        {
            textEl.innerHTML = renderMarkdownInline(q.text);
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

            q.details.forEach((detailLine) =>
            {
                const li = document.createElement("li");
                li.innerHTML = renderMarkdownInline(detailLine);
                detailsList.appendChild(li);
            });

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
        card.appendChild(statusWrapper);   // <-- buttons live here (instead of checkboxWrapper)
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
