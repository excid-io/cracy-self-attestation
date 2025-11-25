import { QUESTION_SETS } from "./config.js";
import { parseQuestionsFromMarkdown } from "./parser.js";
import { renderSetSelector, renderQuestions } from "./ui.js";
import { buildMachineReadableModel, downloadModelAsFile } from "./export.js";

const setSelect = document.getElementById("setSelect");
const questionsContainer = document.getElementById("questionsContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const exportButton = document.getElementById("exportButton");

let currentQuestions = [];
let currentSet = null;

async function loadMarkdownSet(set)
{
    currentSet = set;
    currentQuestions = [];

    questionsContainer.innerHTML = "<p>Loading questions…</p>";
    progressFill.style.width = "0%";
    progressText.textContent = "0 / 0 answered";

    try
    {
        const res = await fetch(set.file);
        if (!res.ok)
        {
            throw new Error(`Failed to load ${set.file}`);
        }

        const text = await res.text();
        const questions = parseQuestionsFromMarkdown(text, set.id);

        currentQuestions = questions;

        renderQuestions(
        {
            container: questionsContainer,
            questions: questions,
            setId: set.id,
            progressFillEl: progressFill,
            progressTextEl: progressText
        });
    }
    catch (err)
    {
        console.error(err);
        questionsContainer.innerHTML = `<p style="color:#fca5a5;">Error loading ${set.file}: ${err.message}</p>`;
    }
}

function handleExportClicked()
{
    if (!currentSet || currentQuestions.length === 0)
    {
        console.warn("No question set loaded; nothing to export.");
        return;
    }

    const model = buildMachineReadableModel(currentQuestions, currentSet.id);
    const fileName = `${currentSet.id}_questions_with_answers.json`;

    downloadModelAsFile(model, fileName);
}

renderSetSelector(setSelect, QUESTION_SETS, loadMarkdownSet);

if (QUESTION_SETS.length > 0)
{
    setSelect.value = QUESTION_SETS[0].id;
    loadMarkdownSet(QUESTION_SETS[0]);
}

exportButton.addEventListener("click", handleExportClicked);
