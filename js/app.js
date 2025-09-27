/**
 * Main application controller for Simple Calendar App
 * Handles app initialization and coordination between modules
 */

class SimpleCalendarApp {
    constructor() {
        this.calendar = null;
        this.symbolPalette = null;
        this.dataManager = null;
        this.autoSave = null;
        
        this.init();
    }

    init() {
        console.log('Simple Calendar App initializing...');
        
        // Initialize modules
        this.initializeModules();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Load initial data
        this.loadInitialData();
        
        console.log('Simple Calendar App initialized successfully');
    }

    initializeModules() {
        // Calendar module is initialized in calendar.js
        // Other modules will be added in subsequent phases
        console.log('Modules initialized');
    }

    setupGlobalEventListeners() {
        // Keyboard shortcuts (basic implementation for Phase 1)
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveBeforeUnload();
        });

        // Visibility change (auto-save when tab becomes hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.autoSaveData();
            }
        });
    }

    handleKeyboardShortcuts(event) {
        // Number shortcuts (0-5) - direct key presses
        if (event.key >= '0' && event.key <= '5') {
            event.preventDefault();
            this.selectNumberByShortcut(`Nummer ${event.key}`);
            return;
        }

        // Space bar acts as 0
        if (event.key === ' ') {
            event.preventDefault();
            this.selectNumberByShortcut('Nummer 0');
            return;
        }

        if (event.ctrlKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    this.exportData();
                    break;
                case 'p':
                    event.preventDefault();
                    window.print();
                    break;
            }
        }


        // Delete key - clear current cell
        if (event.key === 'Delete') {
            event.preventDefault();
            if (window.calendar) {
                window.calendar.clearSelectedCell();
            }
        }

        // Backspace key - clear current cell and go back
        if (event.key === 'Backspace') {
            event.preventDefault();
            if (window.calendar) {
                window.calendar.backAndClear();
            }
        }

        // Arrow key navigation (when no modifier keys)
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    if (window.calendar) {
                        window.calendar.navigateCell('up');
                    }
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (window.calendar) {
                        window.calendar.navigateCell('down');
                    }
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    if (window.calendar) {
                        window.calendar.navigateCell('left');
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if (window.calendar) {
                        window.calendar.navigateCell('right');
                    }
                    break;
            }
        }
    }

    selectNumberByShortcut(shortcut) {
        const numberBtn = document.querySelector(`[title*="${shortcut}"]`);
        if (numberBtn && window.calendar) {
            window.calendar.selectNumber(numberBtn);
        }
    }

    loadInitialData() {
        // Load calendar data from localStorage
        console.log('Loading initial data...');
        
        // Calendar data is loaded in calendar.js
        // Symbol palette will be loaded in Phase 2
        
        console.log('Initial data loaded');
    }

    saveBeforeUnload() {
        // Save data before page unload
        if (window.calendar) {
            window.calendar.saveCalendarData();
        }
        console.log('Data saved before unload');
    }

    autoSaveData() {
        // Auto-save functionality (basic implementation for Phase 1)
        if (window.calendar) {
            window.calendar.saveCalendarData();
            console.log('Auto-save completed');
        }
    }

    exportData() {
        // Basic export functionality for Phase 1
        if (window.calendar) {
            const data = {
                calendarData: window.calendar.calendarData,
                settings: {
                    autoAdvance: true
                },
                exportDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `simple-journal-${new Date().toISOString().replace(/[:.]/g, '-').replace('Z', '').replace(/-\d{3}$/, '')}.json`;
            link.click();
            
            console.log('Calendar data exported');
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Simple notification system (can be enhanced later)
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create a simple toast notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#4ecdc4' : '#45b7d1'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Method to be called by other modules
    getCalendar() {
        return window.calendar;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SimpleCalendarApp();
});
