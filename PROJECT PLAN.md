# Simple Calendar Program - Project Plan

## Project Overview
A simple, lightweight calendar application that displays months/years in a grid format where users can add short symbols (1-3 characters) to mark specific days. The application focuses on simplicity, keyboard shortcuts, and easy data export.

## Core Features

### 1. Calendar Display
- **Grid Layout**: Full month view in a traditional calendar grid format
- **Year View**: Optional full year view showing all 12 months
- **Navigation**: Easy month/year navigation with arrow keys or buttons
- **Responsive Design**: Works on desktop and tablet devices

### 2. Symbol System
- **Symbol Palette**: Visual palette of clickable symbols with background colors
- **Cross Symbols**: Primary symbol set with 5 distinct sizes and opacity levels
  - Large Cross: ✖ (full opacity)
  - Large Dim Cross: ✖ (50% opacity)
  - Medium Cross: ✕ (full opacity)
  - Medium Dim Cross: ✕ (50% opacity)
  - Small Cross: × (full opacity)
- **Background Colors**: Each symbol has an associated background color for the calendar cell
- **Additional Symbols**: Secondary symbols like ●, ▲, ■, ◆, etc.
- **Unicode Support**: Full emoji support (😊, 🎉, 💡, etc.)
- **Custom Symbols**: Allow users to add their own character symbols
- **Multiple Symbols**: Support for multiple symbols per day (up to 3 characters total)

### 3. Input Methods
- **Mouse/Touch**: Click on symbol palette, then click on calendar cell
- **Keyboard Shortcuts**: Ctrl+1, Ctrl+2, etc. for quick symbol insertion
- **Auto-advance**: After palette selection, automatically move to next day
- **Direct Typing**: Allow direct typing of 1-3 characters in cells

### 4. Data Management
- **Local Storage**: Save calendar data and symbol palette separately in browser's local storage
- **Auto-Save**: Automatically save calendar data to localStorage periodically (every 30 seconds or on changes)
- **JSON Export**: Export only calendar data (not symbol palette) as JSON file
- **Data Import**: Import previously exported calendar JSON files
- **Symbol Management**: Symbol palette stored separately and persists across calendar imports
- **Backup/Restore**: Easy backup and restore functionality for both calendar and symbols

### 5. Export & Print
- **JSON Export**: Calendar data export (symbols remain in localStorage)
- **Print Layout**: Optimized print-friendly layout
- **PDF Export**: Future enhancement for PDF generation
- **Print Preview**: Preview before printing

## Technical Specifications

### Technology Stack
**Primary: HTML5 + CSS3 + Vanilla JavaScript**
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: CSS Grid/Flexbox for responsive layout
- **Storage**: LocalStorage API for data persistence
- **Export**: File API for JSON export
- **Print**: CSS Print Media Queries
- **Deployment**: Can run as web app in any browser

**Optional: Electron Wrapper**
- **Desktop App**: Package the web app as a standalone desktop application
- **File System Access**: Better file handling for exports/imports
- **Native Features**: System tray, native file dialogs
- **Dual Deployment**: Same codebase works as both web app and desktop app

### Data Structure

**Calendar Data (Exported JSON):**
```javascript
{
  "calendarData": {
    "2024": {
      "01": {
        "15": [{"symbol": "×", "color": "#ff6b6b"}],
        "16": [{"symbol": "✕", "color": "#4ecdc4"}],
        "20": [{"symbol": "●", "color": "#45b7d1"}]
      }
    }
  },
  "settings": {
    "autoAdvance": true,
    "maxSymbolsPerDay": 3
  }
}
```

**Symbol Palette (LocalStorage):**
```javascript
{
  "symbols": {
    "crosses": [
      {"symbol": "✖", "color": "#ff6b6b", "opacity": 1.0, "size": "large", "shortcut": "Ctrl+1"},
      {"symbol": "✖", "color": "#ff6b6b", "opacity": 0.5, "size": "large-dim", "shortcut": "Ctrl+2"},
      {"symbol": "✕", "color": "#4ecdc4", "opacity": 1.0, "size": "medium", "shortcut": "Ctrl+3"},
      {"symbol": "✕", "color": "#4ecdc4", "opacity": 0.5, "size": "medium-dim", "shortcut": "Ctrl+4"},
      {"symbol": "×", "color": "#96ceb4", "opacity": 1.0, "size": "small", "shortcut": "Ctrl+5"}
    ],
    "additional": [
      {"symbol": "●", "color": "#45b7d1", "shortcut": "Ctrl+6"},
      {"symbol": "▲", "color": "#96ceb4", "shortcut": "Ctrl+7"},
      {"symbol": "■", "color": "#feca57", "shortcut": "Ctrl+8"},
      {"symbol": "◆", "color": "#ff9ff3", "shortcut": "Ctrl+9"},
      {"symbol": "★", "color": "#ff6b6b", "shortcut": "Ctrl+0"}
    ],
    "custom": [
      {"symbol": "A", "color": "#a8e6cf", "shortcut": "Ctrl+Q"},
      {"symbol": "B", "color": "#ffd3a5", "shortcut": "Ctrl+W"},
      {"symbol": "C", "color": "#fd9853", "shortcut": "Ctrl+E"},
      {"symbol": "D", "color": "#a8e6cf", "shortcut": "Ctrl+R"},
      {"symbol": "E", "color": "#ffd3a5", "shortcut": "Ctrl+T"},
      {"symbol": "F", "color": "#fd9853", "shortcut": "Ctrl+Y"},
      {"symbol": "G", "color": "#a8e6cf", "shortcut": "Ctrl+U"},
      {"symbol": "H", "color": "#ffd3a5", "shortcut": "Ctrl+I"},
      {"symbol": "I", "color": "#fd9853", "shortcut": "Ctrl+O"},
      {"symbol": "J", "color": "#a8e6cf", "shortcut": "Ctrl+P"}
    ]
  }
}
```

### Auto-Save Implementation
- **Periodic Save**: Save calendar data to localStorage every 30 seconds
- **Change-Based Save**: Save immediately after any symbol insertion/removal
- **Debounced Save**: Prevent excessive saves during rapid changes (debounce 1 second)
- **Save Indicators**: Visual feedback when saving (optional save status indicator)
- **Error Handling**: Graceful handling of localStorage quota limits
- **Recovery**: Load from localStorage on app startup

### File Structure
```
simple-calendar/
├── index.html
├── css/
│   ├── main.css
│   └── print.css
├── js/
│   ├── app.js
│   ├── calendar.js
│   ├── symbol-palette.js
│   ├── data-manager.js
│   ├── auto-save.js
│   └── export.js
├── assets/
│   └── icons/
└── README.md
```

## Implementation Phases

### Phase 1: Core Calendar (Week 1)
- [ ] Basic HTML structure with calendar grid
- [ ] CSS styling for responsive grid layout
- [ ] Month/year navigation
- [ ] Basic cell rendering

### Phase 2: Symbol System (Week 1-2)
- [ ] Symbol palette component
- [ ] Predefined symbol set (crosses + additional)
- [ ] Custom symbol management (add/edit/remove)
- [ ] Cell editing functionality
- [ ] Symbol insertion and display

### Phase 3: Input Methods (Week 2)
- [ ] Keyboard shortcuts implementation
- [ ] Auto-advance functionality
- [ ] Direct typing support
- [ ] Touch/mobile support

### Phase 4: Data Management (Week 2-3)
- [ ] LocalStorage integration (separate calendar and symbol storage)
- [ ] Auto-save functionality (periodic + on-change saving)
- [ ] JSON export/import (calendar data only)
- [ ] Symbol palette persistence
- [ ] Data validation
- [ ] Backup/restore features

### Phase 5: Export & Print (Week 3)
- [ ] Print-friendly CSS
- [ ] Print functionality
- [ ] JSON export refinement (calendar data only)
- [ ] PDF export planning (future)

### Phase 6: Polish & Testing (Week 3-4)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] User experience improvements

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────────┐
│ [←] January 2024 [→]    [Year View]     │
├─────────────────────────────────────────┤
│ Sun Mon Tue Wed Thu Fri Sat             │
├─────────────────────────────────────────┤
│    1   2   3   4   5   6   7            │
│  8×  9   10  11  12  13  14            │
│ 15✕ 16● 17  18  19  20✖ 21            │
│ 22  23  24  25  26  27  28            │
│ 29  30  31                             │
├─────────────────────────────────────────┤
│ Cross Symbols (Primary):                │
│ [✖] [✖] [✕] [✕] [×]                    │
│ Large Large Medium Medium Small         │
│ Full  Dim   Full  Dim   Full            │
│ Ctrl+1 Ctrl+2 Ctrl+3 Ctrl+4 Ctrl+5     │
├─────────────────────────────────────────┤
│ Additional Symbols:                     │
│ [●] [▲] [■] [◆] [★]                    │
│ Ctrl+6 Ctrl+7 Ctrl+8 Ctrl+9 Ctrl+0     │
├─────────────────────────────────────────┤
│ Custom Symbols:                         │
│ [A] [B] [C] [D] [E] [F] [G] [H] [I] [J] │
│ Ctrl+Q Ctrl+W Ctrl+E Ctrl+R Ctrl+T...   │
│ [+ Add Custom] [Edit] [Remove]          │
├─────────────────────────────────────────┤
│ [Export JSON] [Print] [Settings]        │
└─────────────────────────────────────────┘
```

### Color Scheme
- **Background**: Light gray (#f5f5f5)
- **Calendar Grid**: White cells with subtle borders
- **Today**: Highlighted in light blue
- **Symbol Backgrounds**: Each symbol has its own background color and opacity
  - ✖ Large Full (Ctrl+1): Light red (#ff6b6b) - 100% opacity
  - ✖ Large Dim (Ctrl+2): Light red (#ff6b6b) - 50% opacity
  - ✕ Medium Full (Ctrl+3): Light teal (#4ecdc4) - 100% opacity
  - ✕ Medium Dim (Ctrl+4): Light teal (#4ecdc4) - 50% opacity
  - × Small Full (Ctrl+5): Light green (#96ceb4) - 100% opacity
- **Palette**: Colorful buttons with hover effects matching symbol colors

## Keyboard Shortcuts
- **Ctrl+1-5**: Insert cross symbols (✖ large full, ✖ large dim, ✕ medium full, ✕ medium dim, × small full)
- **Ctrl+6-0**: Insert additional symbols (●, ▲, ■, ◆, ★)
- **Ctrl+Q-P**: Insert custom symbols (A, B, C, D, E, F, G, H, I, J)
- **Arrow Keys**: Navigate between calendar cells
- **Enter**: Edit current cell directly
- **Escape**: Cancel editing
- **Ctrl+S**: Save/export data
- **Ctrl+P**: Print calendar

## Future Enhancements
1. **PDF Export**: Using libraries like jsPDF
2. **Cloud Sync**: Google Drive/Dropbox integration
3. **Themes**: Multiple color themes
4. **Categories**: Color-coded symbol categories
5. **Statistics**: Monthly/yearly symbol usage stats
6. **Mobile App**: React Native or PWA version
7. **Collaboration**: Multi-user calendar sharing

## Success Criteria
- [ ] User can view and navigate calendar months/years
- [ ] User can add 1-3 character symbols to any day
- [ ] Keyboard shortcuts work for quick symbol insertion
- [ ] Auto-advance moves to next day after symbol insertion
- [ ] Calendar data persists between sessions
- [ ] JSON export/import works correctly
- [ ] Print layout is clean and readable
- [ ] Application works on desktop and mobile browsers
- [ ] Performance is smooth with large datasets

## Risk Mitigation
- **Browser Compatibility**: Test on major browsers, use polyfills if needed
- **Mobile Performance**: Optimize for touch devices, test on various screen sizes
- **Data Loss**: Implement auto-save (periodic + on-change) and backup features
- **Unicode Support**: Test emoji rendering across different systems
- **Print Quality**: Ensure symbols are visible when printed
- **Auto-Save Reliability**: Handle localStorage quota limits and save failures gracefully

## Timeline
- **Total Duration**: 3-4 weeks
- **MVP (Minimum Viable Product)**: 2 weeks
- **Full Feature Set**: 3-4 weeks
- **Testing & Polish**: 1 week

This project plan provides a solid foundation for building a simple yet powerful calendar application that meets all the specified requirements while maintaining room for future enhancements.
