"use strict";

const COMMAND_NAMES = new Set([
  "send-to-gemini",
  "close-gemini",
  "show-gemini"
]);

const GET_TEXT_MESSAGE = "copy-gemini-get-text";

// Store the last opened Gemini window ID
let lastGeminiWindowId = null;

chrome.commands.onCommand.addListener(async function(command) {
  if (!COMMAND_NAMES.has(command)) {
    return;
  }

  // Handle close-gemini command
  if (command === "close-gemini") {
    if (lastGeminiWindowId !== null) {
      chrome.windows.remove(lastGeminiWindowId, function() {
        if (chrome.runtime.lastError) {
          console.warn("Copy Gemini: could not close window", chrome.runtime.lastError);
        } else {
          console.log("Copy Gemini: window closed");
          lastGeminiWindowId = null;
        }
      });
    }
    return;
  }

  // Handle show-gemini command
  if (command === "show-gemini") {
    if (lastGeminiWindowId !== null) {
      chrome.windows.update(lastGeminiWindowId, { state: "normal", focused: true }, function() {
        if (chrome.runtime.lastError) {
          console.warn("Copy Gemini: could not show window", chrome.runtime.lastError);
        } else {
          console.log("Copy Gemini: window shown");
        }
      });
    }
    return;
  }

  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs && tabs[0] ? tabs[0] : null;

    if (!tab || !tab.id) {
      openGemini("");
      return;
    }

    // Inject content script and get selected text
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }).catch(() => {});

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: GET_TEXT_MESSAGE });
      openGemini(response && response.text ? response.text : "");
    } catch (err) {
      console.warn("Copy Gemini: could not get selected text", err);
      openGemini("");
    }
  } catch (err) {
    console.warn("Copy Gemini: command handler error", err);
  }
});

chrome.action.onClicked.addListener(async function(tab) {
  if (!tab || !tab.id) {
    openGemini("");
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }).catch(() => {});

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: GET_TEXT_MESSAGE });
      openGemini(response && response.text ? response.text : "");
    } catch (err) {
      console.warn("Copy Gemini: could not get selected text", err);
      openGemini("");
    }
  } catch (err) {
    console.warn("Copy Gemini: action click error", err);
  }
});

function openGemini(selectedText) {
  const geminiUrl = "https://gemini.google.com/app";
  
  // Close existing window if one is open
  if (lastGeminiWindowId !== null) {
    chrome.windows.remove(lastGeminiWindowId, function() {
      if (chrome.runtime.lastError) {
        console.warn("Copy Gemini: could not close existing window", chrome.runtime.lastError);
      }
      // Create new window regardless
      createNewGeminiWindow(geminiUrl, selectedText);
    });
  } else {
    // No existing window, just create new one
    createNewGeminiWindow(geminiUrl, selectedText);
  }
}

function createNewGeminiWindow(geminiUrl, selectedText) {
  // Open Gemini in a new window
  chrome.windows.create({
    url: geminiUrl,
    type: "popup",
    width: 900,
    height: 700
  }, function(window) {
    // Store the window ID for later closing
    if (window) {
      lastGeminiWindowId = window.id;
    }
    
    if (selectedText && selectedText.trim()) {
      // Store selected text in local storage so gemini-fill.js can access it
      chrome.storage.local.set({ 
        "geminiQuickText": selectedText,
        "geminiQuickTextTimestamp": Date.now()
      });
    }
  });
}
