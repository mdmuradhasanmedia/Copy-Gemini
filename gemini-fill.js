"use strict";

(function initGeminiFill() {
  // Avoid running multiple times
  if (window.__geminiQuickFillInstalled) {
    return;
  }
  window.__geminiQuickFillInstalled = true;

  const MAX_WAIT_TIME = 10000; // 10 seconds
  const RETRY_INTERVAL = 200; // 200ms

  function findInputField() {
    // Try different selectors for Gemini input field
    const selectors = [
      'textarea[aria-label*="Message"], textarea[aria-label*="message"]',
      'textarea[placeholder*="Message"], textarea[placeholder*="message"]',
      'textarea[data-testid="input"], input[data-testid="input"]',
      'div[contenteditable="true"]',
      'textarea',
      'input[type="text"]'
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        // Check if element is visible and in viewport
        if (el.offsetParent !== null && !el.disabled) {
          return el;
        }
      }
    }

    return null;
  }

  function findSendButton() {
    // Try different selectors for send button
    const selectors = [
      'button[aria-label*="Send"], button[aria-label*="send"]',
      'button[aria-label*="submit"], button[aria-label*="Submit"]',
      'button[title*="Send"], button[title*="send"]',
      'button[data-testid="send"], button[data-testid="submit"]',
      'button:has(svg[viewBox*="send"]), button:has(svg[viewBox*="arrow"])',
      'form button[type="submit"]',
      'button[type="submit"]'
    ];

    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          // Check if button is visible and not disabled
          if (el.offsetParent !== null && !el.disabled) {
            return el;
          }
        }
      } catch (e) {
        // Skip invalid selectors
        continue;
      }
    }

    // Fallback: look for any visible button near the input
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (btn.offsetParent !== null && !btn.disabled) {
        const text = btn.textContent.toLowerCase();
        if (text.includes("send") || text.includes("submit") || text.includes("enter")) {
          return btn;
        }
      }
    }

    return null;
  }

  function fillInputField(inputField, text) {
    try {
      if (inputField.tagName === "TEXTAREA" || inputField.tagName === "INPUT") {
        // For textarea and input elements
        inputField.value = text;
        inputField.textContent = text;
      } else if (inputField.contentEditable === "true") {
        // For contenteditable divs
        inputField.textContent = text;
        inputField.innerText = text;
      }

      // Trigger input events
      inputField.dispatchEvent(new Event("input", { bubbles: true }));
      inputField.dispatchEvent(new Event("change", { bubbles: true }));
      inputField.focus();

      // Wait a bit then submit
      setTimeout(submitForm, 300);

      return true;
    } catch (err) {
      console.warn("Copy Gemini: could not fill input", err);
      return false;
    }
  }

  function submitForm() {
    try {
      // Find and click the send button
      const sendButton = findSendButton();
      if (sendButton) {
        console.log("Copy Gemini: clicking send button");
        sendButton.click();
        return true;
      }

      // If no button found, try pressing Enter
      const inputField = findInputField();
      if (inputField) {
        console.log("Copy Gemini: pressing Enter");
        inputField.dispatchEvent(new KeyboardEvent("keydown", { 
          key: "Enter", 
          code: "Enter", 
          keyCode: 13,
          which: 13,
          bubbles: true 
        }));
        inputField.dispatchEvent(new KeyboardEvent("keyup", { 
          key: "Enter", 
          code: "Enter", 
          keyCode: 13,
          which: 13,
          bubbles: true 
        }));
        return true;
      }

      console.warn("Copy Gemini: could not find send button or input field");
      return false;
    } catch (err) {
      console.warn("Copy Gemini: could not submit form", err);
      return false;
    }
  }

  function waitForInputField(callback) {
    let elapsedTime = 0;

    const checkForInput = function() {
      const inputField = findInputField();

      if (inputField) {
        callback(inputField);
        return;
      }

      elapsedTime += RETRY_INTERVAL;
      if (elapsedTime < MAX_WAIT_TIME) {
        setTimeout(checkForInput, RETRY_INTERVAL);
      } else {
        console.warn("Copy Gemini: could not find input field after", MAX_WAIT_TIME, "ms");
      }
    };

    checkForInput();
  }

  function getStoredText(callback) {
    chrome.storage.local.get(["geminiQuickText", "geminiQuickTextTimestamp"], function(items) {
      if (chrome.runtime.lastError) {
        console.warn("Copy Gemini: storage error", chrome.runtime.lastError);
        callback(null);
        return;
      }

      const text = items.geminiQuickText;
      const timestamp = items.geminiQuickTextTimestamp;

      // Check if text is recent (less than 5 minutes old)
      if (text && timestamp && (Date.now() - timestamp) < 5 * 60 * 1000) {
        // Clear the stored text after retrieval
        chrome.storage.local.remove(["geminiQuickText", "geminiQuickTextTimestamp"]);
        callback(text);
      } else {
        callback(null);
      }
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      getStoredText(function(text) {
        if (text) {
          waitForInputField(function(inputField) {
            fillInputField(inputField, text);
          });
        }
      });
    });
  } else {
    getStoredText(function(text) {
      if (text) {
        waitForInputField(function(inputField) {
          fillInputField(inputField, text);
        });
      }
    });
  }
})();
