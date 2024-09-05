// const { GoogleGenerativeAI } = require("@google/generative-ai");
// API_KEY = "AIzaSyAI5tIwUUGkZAAQtvhLOtFmlsmRNKcIomM"

// async function generateContent(prompt) {
//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt1 = `summarise this : '${prompt}' in short`;

//     const result = await model.generateContent(prompt1);
//     console.log(result.response.text());
//     // return result.response.text();
// }

// generateContent("India, officially the Republic of India (ISO: Bhārat Gaṇarājya),[21] is a country in South Asia. It is the seventh-largest country by area; the most populous country with effect from June 2023;[22][23] and from the time of its independence in 1947, the world's most populous democracy.[24][25][26] Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, it shares land borders with Pakistan to the west;[j] China, Nepal, and Bhutan to the north; and Bangladesh and Myanmar to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; its Andaman and Nicobar Islands share a maritime border with Thailand, Myanmar, and Indonesia.");

function getCurrentTabSettingsKey(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTabId = tabs[0].id;
        var settingsKey = "settings_" + currentTabId;
        callback(settingsKey);
    });
}

function updateStorageSettings() {
    getCurrentTabSettingsKey(function (settingsKey) {
        var saveObj = {};
        saveObj[settingsKey] = {
            toggleBoldState: document.getElementById("toggleBold").checked,
            boldRangeValue: boldRange.value,
            opacityRangeValue: opacityRange.value,
            skipRangeValue: skipRange.value,
            boldedColor: colorSelect.value,
        };
        chrome.storage.sync.set(saveObj);
    });
}
function updateUI(isEnabled) {
    // Get references to the slider elements and select element
    var boldRange = document.getElementById("boldRange");
    var skipRange = document.getElementById("skipRange");
    var opacityRange = document.getElementById("opacityRange");
    var colorSelect = document.getElementById("colorSelect");

    // Disable or enable the UI elements based on the checkbox state
    boldRange.disabled = !isEnabled;
    skipRange.disabled = !isEnabled;
    opacityRange.disabled = !isEnabled;
    colorSelect.disabled = !isEnabled;
    document.documentElement.requestFullscreen();
}



// On popup load
document.addEventListener("DOMContentLoaded", function () {
    chrome.identity.getProfileUserInfo({ accountStatus: chrome.identity.AccountStatus.ANY }, function (userInfo) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            document.getElementById("login-popup").hidden = false;
            return;
        }

        if (userInfo.email) {
            document.getElementById("login-popup").hidden = true;
            document.querySelector(".email").innerText = `Signed in as ${userInfo.email}`;
        } else {
            document.getElementById("login-popup").hidden = false;
        }
    });

    getCurrentTabSettingsKey(function (settingsKey) {
        chrome.storage.sync.get(settingsKey, function (data) {
            var settings = data[settingsKey];
            if (settings) {
                // Update the button label based on the checkbox state
                updateButtonLabel(settings.toggleBoldState);
                updateUI(settings.toggleBoldState);
                document.getElementById("toggleBold").checked = settings.toggleBoldState || false;
                document.getElementById("boldRange").value = settings.boldRangeValue || "1";
                document.getElementById("opacityRange").value = settings.opacityRangeValue || "4";
                document.getElementById("skipRange").value = settings.skipRangeValue || "0";
                document.getElementById("colorSelect").value = settings.boldedColor || "black";
            }
        });
    });

    chrome.storage.sync.get('userScore', function (data) {
        document.getElementById('userScore').innerText = data.userScore || 0;
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (changes.userScore) {
            document.getElementById('userScore').innerText = changes.userScore.newValue;
        }
    });
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
                window.location.reload();
            }
        }
    });
}

var timeout;

var colorSelect = document.getElementById("colorSelect");

document.getElementById("increase").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: modifyDOM,
            args: ["increase", 0, 0, 1, colorSelect.value],
        });
    });
});

document.getElementById("decrease").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: modifyDOM,
            args: ["decrease", 0, 0, 1, colorSelect.value],
        });
    });
});

colorSelect.addEventListener("change", function () {
    var boldPercent = (parseInt(boldRange.value) + 1) / 10 + 0.2;
    var wordsToSkip = parseInt(skipRange.value);
    var opacity = parseInt(opacityRange.value) * 0.225 + 0.1;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: modifyDOM,
            args: ["toggleBold", boldPercent, wordsToSkip, opacity, colorSelect.value],
        });
    });
    updateStorageSettings();
});

var boldRange = document.getElementById("boldRange");
boldRange.addEventListener("input", function () {
    var value = this.value;
    var boldPercent = (parseInt(value) + 1) / 10 + 0.2;
    var wordsToSkip = parseInt(skipRange.value);
    var opacity = parseInt(opacityRange.value) * 0.225 + 0.1;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
        if (document.getElementById("toggleBold").checked) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currentTab = tabs[0];
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    func: modifyDOM,
                    args: ["toggleBold", boldPercent, wordsToSkip, opacity, colorSelect.value],
                });
            });
        }
    }, 500);
    updateStorageSettings();
});

var skipRange = document.getElementById("skipRange");
skipRange.addEventListener("input", function () {
    var value = this.value;
    var wordsToSkip = parseInt(value);
    var boldPercent = (parseInt(boldRange.value) + 1) / 10 + 0.2;
    var opacity = parseInt(opacityRange.value) * 0.225 + 0.1;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
        if (document.getElementById("toggleBold").checked) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currentTab = tabs[0];
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    func: modifyDOM,
                    args: ["toggleBold", boldPercent, wordsToSkip, opacity, colorSelect.value],
                });
            });
        }
    }, 500);
    updateStorageSettings();
});

var opacityRange = document.getElementById("opacityRange");
opacityRange.addEventListener("input", function () {
    var value = this.value;
    var opacity = parseInt(value) * 0.225 + 0.1;
    var boldPercent = (parseInt(boldRange.value) + 1) / 10 + 0.2;
    var wordsToSkip = parseInt(skipRange.value);

    clearTimeout(timeout);
    timeout = setTimeout(function () {
        if (document.getElementById("toggleBold").checked) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currentTab = tabs[0];
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    func: modifyDOM,
                    args: ["toggleBold", boldPercent, wordsToSkip, opacity, colorSelect.value],
                });
            });
        }
    }, 500);
    updateStorageSettings();
});

// Function to update the button label based on the checkbox state
function updateButtonLabel(isEnabled) {
    var buttonSpan = document.querySelector(".button span");
    var toggleBoldCheckbox = document.getElementById("toggleBold");

    if (isEnabled) {
        buttonSpan.innerText = "Disable Reading Mode";
        toggleBoldCheckbox.checked = true;
        document.querySelector(".button").classList.add("pressed");
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    } else {
        buttonSpan.innerText = "Enable Reading Mode";
        toggleBoldCheckbox.checked = false;
        document.querySelector(".button").classList.remove("pressed");
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}

// Add a change event listener to the toggleBold checkbox
document.getElementById("toggleBold").addEventListener("change", function (event) {
    var boldPercent = (parseInt(boldRange.value) + 1) / 10 + 0.2;
    var wordsToSkip = parseInt(skipRange.value);
    var opacity = parseInt(opacityRange.value) * 0.225 + 0.1;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (event.target.checked) {
            // Use event.target.checked here
            console.log("checked");
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                func: modifyDOM,
                args: ["toggleBold", boldPercent, wordsToSkip, opacity, colorSelect.value],
            });
        } else {
            console.log("unchecked");
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                func: modifyDOM,
                args: ["untoggleBold", 0, 0, 1, colorSelect.value],
            });
        }
    });
    updateStorageSettings();
    updateUI(event.target.checked);
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the toggleBold checkbox element
    const toggleBoldCheckbox = document.getElementById("toggleBold");

    // Get the button element
    const button = document.querySelector(".button");

    // Get the span element inside the button
    const buttonSpan = document.querySelector(".button span");

    // Add a change event listener to the toggleBold checkbox
    toggleBoldCheckbox.addEventListener("change", function () {
        if (toggleBoldCheckbox.checked) {
            // If checked, set the text to "Disable Reading Mode"
            buttonSpan.innerText = "Disable Reading Mode";
            // Add a class to make the button look pressed in
            button.classList.add("pressed");
        } else {
            // If unchecked, set the text to "Enable Reading Mode"
            buttonSpan.innerText = "Enable Reading Mode";
            // Remove the class to reset the button appearance
            button.classList.remove("pressed");
        }
    });
});