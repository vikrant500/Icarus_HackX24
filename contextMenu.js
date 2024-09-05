chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizeText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: summarizeSelectedText,
            args: [info.selectionText]
        });
    }
});

async function summarizeSelectedText(selectedText) {
    const API_KEY = "YOUR_API_KEY_HERE";
    const prompt = `summarize this: '${selectedText}' in short`;

    const response = await fetch("https://api.generativeai.google.com/v1/models/gemini-1.5-flash:generateText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    const summary = data.choices[0].text;

    document.execCommand("insertText", false, summary);
}