# Simple Calendar

A simple, lightweight calendar application for marking days with symbols and colors.

## Current Status: Phase 1 Complete ✅

### Implemented Features:
- ✅ Full year calendar view (months as rows, days as columns)
- ✅ Compact grid layout with small, closely spaced squares
- ✅ Symbol palette at the top with cross symbols and additional symbols
- ✅ Year navigation (previous/next year buttons)
- ✅ Today highlighting
- ✅ Symbol insertion with click-to-add functionality
- ✅ Keyboard shortcuts for all symbols (Ctrl+1-0, Ctrl+Q-P)
- ✅ Basic localStorage integration
- ✅ Print-friendly layout (landscape orientation)
- ✅ Basic export functionality (JSON)
- ✅ Clean, modern UI design

### File Structure:
```
simple-calendar/
├── index.html          # Main HTML structure
├── css/
│   ├── main.css        # Main styles
│   └── print.css       # Print-specific styles
├── js/
│   ├── app.js          # Main application controller
│   └── calendar.js     # Calendar functionality
└── README.md           # This file
```

## How to Use:

1. **Open the application**: Open `index.html` in any modern web browser
2. **Navigate years**: Use the ← → buttons or Ctrl+Left/Right arrow keys
3. **Select symbols**: Click on symbol palette buttons or use keyboard shortcuts
4. **Add symbols to dates**: Click on a calendar cell to add the selected symbol
5. **Export data**: Click "Export JSON" to download your calendar data
6. **Print**: Click "Print" or use Ctrl+P to print the calendar

## Symbol Palette:

- **Cross Symbols**: ✖ (large full), ✖ (large dim), ✕ (medium full), ✕ (medium dim), × (small full)
- **Additional Symbols**: ●, ▲, ■, ◆, ★
- **Custom Symbols**: A, B, C, D, E, F, G, H, I, J
- **Keyboard Shortcuts**: Ctrl+1-0 for cross/additional symbols, Ctrl+Q-P for custom symbols

## Current Limitations:

- No auto-save functionality (Phase 4)
- No custom symbol management (add/edit/remove)
- No auto-advance after symbol insertion
- No data import functionality

## Next Steps (Phase 2):

- Add auto-advance functionality after symbol insertion
- Implement custom symbol management (add/edit/remove)
- Add data import functionality
- Implement auto-save functionality

## Browser Compatibility:

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Development:

This is a vanilla HTML/CSS/JavaScript application with no external dependencies. Simply open `index.html` in a browser to run.

## Data Storage:

Calendar data is automatically saved to browser's localStorage. Data persists between browser sessions.
