importScripts("./extpay.js", "./contextMenu.js");

var extpay = ExtPay("icarus-dev");
extpay.startBackground();


var extpay = ExtPay("icarus-dev");
extpay.startBackground();

const trackedSites = ["youtube.com", "reddit.com", "instagram.com", "tiktok.com"];
let siteTimers = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        const url = new URL(tab.url);
        const hostname = url.hostname;

        if (trackedSites.some(site => hostname.includes(site))) {
            if (!siteTimers[tabId]) {
                siteTimers[tabId] = setInterval(() => {
                    chrome.storage.sync.get(['userScore'], function (data) {
                        let userScore = data.userScore || 0;

                        if (userScore > 0) {
                            userScore = Math.max(0, userScore - 25);
                            chrome.storage.sync.set({ userScore: userScore });
                        } else {
                            chrome.tabs.sendMessage(tabId, { action: "alertBreak" });
                        }
                    });
                }, 10 * 60 * 1000); // 10 minutes
            }
        } else {
            if (siteTimers[tabId]) {
                clearInterval(siteTimers[tabId]);
                delete siteTimers[tabId];
            }
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (siteTimers[tabId]) {
        clearInterval(siteTimers[tabId]);
        delete siteTimers[tabId];
    }
});

function modifyDOM(action, boldPercent, skipWords, opacityLevel, color) {
    var elements = document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,span.wrapped-text");
    elements.forEach(function (elem) {
        if (!elem.classList.contains("note-anchor")) {
            if (action === "increase") {
                elem.style.lineHeight = parseFloat(getComputedStyle(elem).lineHeight) + 3 + "px";
            } else if (action === "decrease") {
                elem.style.lineHeight = parseFloat(getComputedStyle(elem).lineHeight) - 3 + "px";
            } else if (action === "toggleBold") {
                var words = elem.innerText.split(" ");
                var newContent = "";
                var skipCounter = 0;
                words.forEach(function (word, index) {
                    var boldCharCount = Math.floor(word.length * boldPercent);
                    if (skipCounter === 0) {
                        newContent +=
                            '<b style="color:' +
                            color +
                            '">' +
                            word.substr(0, boldCharCount) +
                            '</b><span style="opacity:' +
                            opacityLevel +
                            '">' +
                            word.substr(boldCharCount) +
                            "</span> ";
                        skipCounter = skipWords;
                    } else {
                        newContent += '<span style="opacity:' + opacityLevel + '">' + word + "</span> ";
                        skipCounter--;
                    }
                });
                elem.innerHTML = newContent;
            } else if (action === "untoggleBold") {
                elem.innerHTML = elem.innerText;
            }
        }
    });
}
const API_KEY = "YOUR_API_KEY_HERE";

async function generateContent(prompt) {
    const response = await fetch("https://api.generativeai.google.com/v1/models/gemini-1.5-flash:generateText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.choices[0].text;
}
// Add this code to create the context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize Selected Text",
        contexts: ["selection"] // This ensures it appears when text is selected
    });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizeText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: generateContent,
            args: [info.selectionText]
        });
    }
});
