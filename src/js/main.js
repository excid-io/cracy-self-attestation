import { QUESTION_SETS } from "./config.js";
import { parseQuestionsFromMarkdown } from "./parser.js";
import { renderSetSelector, renderQuestions } from "./ui.js";

console.log(QUESTION_SETS);

const setSelect = document.getElementById("setSelect");
const questionsContainer = document.getElementById("questionsContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

async function loadMarkdownSet(set) 
{
    questionsContainer.innerHTML = "<p>Loading questions…</p>";
    progressFill.style.width = "0%";
    progressText.textContent = "0 / 0 answered";

    try 
    {
        const res = await fetch(set.file);
        if (!res.ok) throw new Error(`Failed to load ${set.file}`);
        const text = await res.text();

        const questions = parseQuestionsFromMarkdown(text, set.id);
        console.log(questions);
        renderQuestions
        (
            {
                container: questionsContainer,
                questions,
                setId: set.id,
                progressFillEl: progressFill,
                progressTextEl: progressText
            }
        );
    } 
    catch (err) 
    {
        console.error(err);
        questionsContainer.innerHTML = `<p style="color:#fca5a5;">Error loading ${set.file}: ${err.message}</p>`;
    }
}

renderSetSelector(setSelect, QUESTION_SETS, loadMarkdownSet);

if (QUESTION_SETS.length > 0) 
{
    setSelect.value = QUESTION_SETS[0].id;
    loadMarkdownSet(QUESTION_SETS[0]);
}
