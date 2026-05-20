"use strict";

(function initCopyGeminiContent() {
  const CONTENT_VERSION = "1.0.0";

  if (window.__copyGeminiContentVersion === CONTENT_VERSION) {
    return;
  }

  window.__copyGeminiContentInstalled = true;
  window.__copyGeminiContentVersion = CONTENT_VERSION;

  const GET_TEXT_MESSAGE = "copy-gemini-get-text";

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (!message || message.type !== GET_TEXT_MESSAGE) {
      return;
    }

    const selectedText = getSelectedText();
    sendResponse({ text: selectedText });
  });

  function getSelectedTextFromInput(element) {
    const tag = element && element.tagName ? element.tagName.toLowerCase() : "";
    const supportsSelection = tag === "textarea" || (tag === "input" && /^(text|search|url|email|tel|password)$/i.test(element.type || "text"));

    if (!supportsSelection || typeof element.selectionStart !== "number" || typeof element.selectionEnd !== "number") {
      return "";
    }

    if (element.selectionEnd <= element.selectionStart) {
      return "";
    }

    return element.value.slice(element.selectionStart, element.selectionEnd);
  }

  function getSelectedText() {
    // First check if text is selected in an input field
    const activeElementText = getSelectedTextFromInput(document.activeElement);

    if (activeElementText.trim()) {
      return activeElementText.trim();
    }

    // Otherwise get selected text from page
    const selection = window.getSelection ? window.getSelection() : null;
    return selection ? selection.toString().trim() : "";
  }

})();
