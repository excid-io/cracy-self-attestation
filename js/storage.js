function storageKey(setId, questionId) 
{
    return `craChecklist:${setId}:${questionId}`;
}

export function saveQuestionState(setId, questionId, state) 
{
    const key = storageKey(setId, questionId);
    localStorage.setItem(key, JSON.stringify(state));
}

export function loadQuestionState(setId, questionId) 
{
    const key = storageKey(setId, questionId);
    const raw = localStorage.getItem(key);
    if (!raw) return { checked: false, notes: "" };
    try 
    {
        return JSON.parse(raw);
    } 
    catch 
    {
        return { checked: false, notes: "" };
    }
}
