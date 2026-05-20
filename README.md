# Copy Gemini - Chrome Extension

A lightweight, keyboard-driven Chrome extension that instantly sends selected text to Google Gemini with a single keystroke.

## Features

✨ **Quick Text Selection** - Select any text on any website and send it to Gemini instantly

🚀 **Auto-Fill & Auto-Submit** - Selected text is automatically filled into Gemini's input field and submitted

⌨️ **Keyboard Shortcuts** - Three simple keyboard commands for complete control:
- **Alt+Shift+U** - Open Gemini with selected text (auto-filled and submitted)
- **Alt+Shift+O** - Show/restore minimized Gemini window
- **Alt+Shift+Y** - Close Gemini window

🔄 **Single Window Mode** - Only one Gemini window open at a time. Opening a new one automatically closes the previous one

🪟 **Minimal & Clean** - No floating panels, no ads, no clutter. Just pure functionality

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `copy-gemini` folder
6. The extension is now ready to use!

## How to Use

### Basic Usage
1. Select any text on a webpage
2. Press **Alt+Shift+U**
3. Gemini opens in a new window with your text auto-filled and sent

### Window Management
- **Alt+Shift+O** - If you minimize Gemini, press this to bring it back
- **Alt+Shift+Y** - Close the Gemini window when done

### Mac Users
Replace Alt with Option:
- **Option+Shift+U** - Open Gemini with selected text
- **Option+Shift+O** - Show minimized Gemini window
- **Option+Shift+Y** - Close Gemini window

## Technical Details

- **Manifest Version**: V3 (latest Chrome extension standard)
- **Permissions**: activeTab, scripting, tabs, storage (minimal required)
- **Window Size**: 900px width × 700px height (optimized for Gemini)
- **Auto-Submit Delay**: 300ms (allows UI to register text before submission)
- **Text Storage**: 5-minute expiration on selected text in local storage

## File Structure

```
copy-gemini-extension/
├── manifest.json        # Extension configuration & permissions
├── background.js        # Window management & command routing
├── content.js          # Text selection capture
├── gemini-fill.js      # Auto-fill & auto-submit logic
└── README.md           # This file
```

## How It Works

1. **Text Capture** - When you press Alt+Shift+U, the extension captures selected text from the current page
2. **Window Creation** - Opens a popup window to gemini.google.com/app
3. **Data Storage** - Stores selected text in Chrome's local storage with timestamp
4. **Auto-Fill** - gemini-fill.js detects the input field and fills it with your text
5. **Auto-Submit** - Automatically clicks send or simulates Enter key press
6. **Window Tracking** - Remembers the Gemini window ID for show/close commands

## Troubleshooting

**Text not auto-filling?**
- Make sure you've selected text before pressing Alt+Shift+U
- Try selecting from a text field (input or textarea) first

**Auto-submit not working?**
- Gemini's UI might have changed. Check browser console for errors
- Try pressing Enter manually in Gemini

**Keyboard shortcut not responding?**
- Verify extension is enabled in `chrome://extensions/`
- Check if another application is using the same shortcut
- Try reloading the extension

## Version History

### v1.0.0
- Initial release
- Alt+Shift+U to open Gemini with selected text
- Auto-fill and auto-submit functionality
- Added window show/restore functionality (Alt+Shift+O)
- Added window close functionality (Alt+Shift+Y)
- Implemented single window mode (closes old window when opening new)

## Privacy

- Your selected text is stored temporarily (5 minutes) in Chrome's local storage
- No data is sent to external servers except Gemini
- Extension has no tracking or analytics
- Fully offline except when communicating with Gemini

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

For issues or feature requests, please refer to the main project repository.

---

**Made for productivity.** Select. Press. Done. 🚀
