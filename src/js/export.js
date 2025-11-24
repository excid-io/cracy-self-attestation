import { loadQuestionState } from "./storage.js";

// Build machine-readable JSON model including answers and notes.
//
// questions: array from parseQuestionsFromMarkdown()
// setId:     current question-set id ("document", "deliverable", ...)
//
// Output example:
// {
//     "sections": [
//         {
//             "title": "...",
//             "description": "",
//             "questions": [
//                 {
//                     "id": "...",
//                     "title": "...",
//                     "prompt": "...",
//                     "type": "mchoices",
//                     "responses": [ { title, description, type }, ... ],
//                     "status": "answered" | "unanswered",
//                     "checked": true | false,
//                     "notes": "..."
//
//                 }
//             ]
//         }
//     ]
// }
export function buildMachineReadableModel(questions, setId)
{
    const sectionMap = new Map();

    questions.forEach((q) =>
    {
        const sectionTitle =
            (q.section && q.section.length > 0) ? q.section : "General";

        if (!sectionMap.has(sectionTitle))
        {
            sectionMap.set(sectionTitle,
            {
                title: sectionTitle,
                description: "",
                questions: []
            });
        }

        const section = sectionMap.get(sectionTitle);

        // Load state
        const state = loadQuestionState(setId, q.id) || {};
        const status = state.status || "notdone";
        const notes  = state.notes || "";

        section.questions.push(
        {
            id: q.id,
            title: q.title ? q.title : q.text,
            prompt: q.text,
            type: "mchoices",

            responses:
            [
                {
                    title: "Yes",
                    description: "Requirement fully satisfied.",
                    type: "choice"
                },
                {
                    title: "NotDone",
                    description: "Requirement not satisfied.",
                    type: "choice"
                },
                {
                    title: "InProgress",
                    description: "Requirement partially satisfied.",
                    type: "choice"
                }
            ],

            // NEW FIELDS
            status: status,   // "done" | "progress" | "notdone"
            notes: notes
        });
    });

    return {
        sections: Array.from(sectionMap.values())
    };
}

// Trigger a download of the model as a JSON file.
export function downloadModelAsFile(model, fileName)
{
    const json = JSON.stringify(model, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}