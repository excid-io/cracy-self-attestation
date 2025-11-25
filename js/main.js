import { QUESTION_SETS } from "./config.js";
import { parseQuestionsFromMarkdown, parseQuestionsFromModelJson } from "./parser.js";
import { renderSetSelector, renderQuestions } from "./ui.js";
import { buildMachineReadableModel, downloadModelAsFile } from "./export.js";

const setSelect = document.getElementById("setSelect");
const questionsContainer = document.getElementById("questionsContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const exportButton = document.getElementById("exportButton");

let currentQuestions = [];
let currentSet = null;
let currentTopTitle = null;

async function loadQuestionSet(set)
{
    currentSet = set;
    currentQuestions = [];
    currentTopTitle = null;

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

        const raw = await res.text();
        let questions;
        let topTitle = null;

        if (set.file.endsWith(".md"))
        {
            questions = parseQuestionsFromMarkdown(raw, set.id);
            // for markdown we could also pull the first "# ..." as topTitle
            // but for now we leave it null so behavior stays as before
        }
        else if (set.file.endsWith(".json"))
        {
            const model = JSON.parse(raw);
            const parsed = parseQuestionsFromModelJson(model, set.id);
            questions = parsed.questions;
            topTitle = parsed.topTitle;
        }
        else
        {
            throw new Error(`Unsupported file type: ${set.file}`);
        }

        currentQuestions = questions;
        currentTopTitle = topTitle;

        renderQuestions({
            container: questionsContainer,
            questions,
            setId: set.id,
            progressFillEl: progressFill,
            progressTextEl: progressText,
            topTitle
        });
    }
    catch (err)
    {
        console.error(err);
        questionsContainer.innerHTML =
            `<p style="color:#fca5a5;">Error loading ${set.file}: ${err.message}</p>`;
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

// Use the new loader for both md and json sets
renderSetSelector(setSelect, QUESTION_SETS, loadQuestionSet);

if (QUESTION_SETS.length > 0)
{
    setSelect.value = QUESTION_SETS[0].id;
    loadQuestionSet(QUESTION_SETS[0]);
}

exportButton.addEventListener("click", handleExportClicked);
