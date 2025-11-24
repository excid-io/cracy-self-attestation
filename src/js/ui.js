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
        // CHECKBOX WRAPPER + CHECKBOX
        //
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "checkbox-wrapper";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = q.id;

        const stored = loadQuestionState(setId, q.id);

        if (stored.checked)
        {
            checkbox.checked = true;
            card.classList.add("answered");
        }

        checkboxWrapper.appendChild(checkbox);

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
            textEl.innerHTML = `<strong>${q.title}:</strong> ${q.text}`;
        }
        else
        {
            textEl.textContent = q.text;
        }

        content.appendChild(textEl);

        //
        // BADGE (Answered / Pending)
        //
        const badge = document.createElement("span");
        badge.className = "badge";

        const dot = document.createElement("span");
        dot.className = "badge-dot";

        if (stored.checked || (stored.notes && stored.notes.length > 0))
        {
            dot.classList.remove("pending");
        }
        else
        {
            dot.classList.add("pending");
        }

        const label = document.createElement("span");
        if (stored.checked || (stored.notes && stored.notes.length > 0))
        {
            label.textContent = "Answered";
        }
        else
        {
            label.textContent = "Pending";
        }

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
        const notes = document.createElement("textarea");
        notes.className = "notes";
        notes.placeholder = "Optional notes / where this is documented…";
        notes.value = stored.notes || "";

        content.appendChild(notes);

        //
        // EVENT HANDLERS
        //
        checkbox.addEventListener("change", () =>
        {
            const state =
            {
                checked: checkbox.checked,
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            updateCardAnsweredState(card, badge, state);
            updateProgress(container, progressFillEl, progressTextEl);
        });

        notes.addEventListener("input", () =>
        {
            const state =
            {
                checked: checkbox.checked || notes.value.trim().length > 0,
                notes: notes.value.trim()
            };

            saveQuestionState(setId, q.id, state);
            updateCardAnsweredState(card, badge, state);
            updateProgress(container, progressFillEl, progressTextEl);
        });

        //
        // ASSEMBLE CARD
        //
        card.appendChild(checkboxWrapper);
        card.appendChild(content);

        container.appendChild(card);
    });

    //
    // INITIAL PROGRESS UPDATE
    //
    updateProgress(container, progressFillEl, progressTextEl);
}

function updateCardAnsweredState(card, badge, state)
{
    const dot = badge.querySelector(".badge-dot");
    const label = badge.querySelector("span:nth-child(2)");

    const answered = state.checked || (state.notes && state.notes.length > 0);

    if (answered)
    {
        card.classList.add("answered");
        dot.classList.remove("pending");
        label.textContent = "Answered";
    }
    else
    {
        card.classList.remove("answered");
        dot.classList.add("pending");
        label.textContent = "Pending";
    }
}

export function updateProgress(container, progressFillEl, progressTextEl)
{
    const cards = Array.from(container.querySelectorAll(".question-card"));
    const total = cards.length;

    let answered = 0;

    cards.forEach((card) =>
    {
        const checkbox = card.querySelector("input[type='checkbox']");
        const notes = card.querySelector(".notes");

        if (checkbox.checked || notes.value.trim().length > 0)
        {
            answered += 1;
        }
    });

    const pct = (total === 0) ? 0 : (answered / total) * 100.0;
    progressFillEl.style.width = `${pct.toFixed(1)}%`;
    progressTextEl.textContent = `${answered} / ${total} answered`;
}
