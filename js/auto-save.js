/**
 * Auto-save functionality for Simple Calendar App
 * Handles periodic saving and change-based saving with debouncing
 */

class AutoSave {
    constructor(calendar) {
        this.calendar = calendar;
        this.saveInterval = 30000; // 30 seconds
        this.debounceDelay = 1000; // 1 second
        this.debounceTimer = null;
        this.isEnabled = true;
        this.saveStatusElement = null;
        
        this.init();
    }

    init() {
        this.createSaveStatusIndicator();
        this.startPeriodicSave();
        this.setupChangeListeners();
    }

    createSaveStatusIndicator() {
        // Create a subtle save status indicator
        this.saveStatusElement = document.createElement('div');
        this.saveStatusElement.className = 'auto-save-status';
        this.saveStatusElement.textContent = 'Saved';
        document.body.appendChild(this.saveStatusElement);
    }

    startPeriodicSave() {
        if (!this.isEnabled) return;
        
        setInterval(() => {
            this.saveData();
        }, this.saveInterval);
    }

    setupChangeListeners() {
        // Listen for calendar data changes
        if (this.calendar) {
            // Override the calendar's save method to trigger auto-save
            const originalSave = this.calendar.saveCalendarData.bind(this.calendar);
            this.calendar.saveCalendarData = () => {
                originalSave();
                this.showSaveStatus();
            };
        }
    }

    saveData() {
        if (!this.isEnabled || !this.calendar) return;
        
        try {
            this.calendar.saveCalendarData();
            this.calendar.saveScrollPosition();
            console.log('Auto-save completed');
        } catch (error) {
            console.error('Auto-save failed:', error);
            this.showSaveStatus('error');
        }
    }

    debouncedSave() {
        if (!this.isEnabled) return;
        
        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        // Set new timer
        this.debounceTimer = setTimeout(() => {
            this.saveData();
        }, this.debounceDelay);
    }

    showSaveStatus(type = 'success') {
        if (!this.saveStatusElement) return;
        
        const colors = {
            success: '#4ecdc4',
            error: '#ff6b6b',
            saving: '#feca57'
        };
        
        const messages = {
            success: 'Saved',
            error: 'Save Failed',
            saving: 'Saving...'
        };
        
        this.saveStatusElement.style.backgroundColor = colors[type];
        this.saveStatusElement.textContent = messages[type];
        this.saveStatusElement.style.opacity = '1';
        
        // Hide after 2 seconds (except for errors)
        if (type !== 'error') {
            setTimeout(() => {
                this.saveStatusElement.style.opacity = '0';
            }, 2000);
        }
    }

    // Method to be called when calendar data changes
    onDataChange() {
        this.debouncedSave();
    }

    // Enable/disable auto-save
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (enabled) {
            this.startPeriodicSave();
        }
    }

    // Handle localStorage quota errors
    handleStorageError(error) {
        console.error('Storage error:', error);
        this.showSaveStatus('error');
        
        // Try to clear old data if quota exceeded
        if (error.name === 'QuotaExceededError') {
            this.clearOldData();
        }
    }

    clearOldData() {
        try {
            // Keep only last 5 years of data
            const currentYear = new Date().getFullYear();
            const cutoffYear = currentYear - 5;
            
            if (this.calendar && this.calendar.calendarData) {
                const data = this.calendar.calendarData;
                const keysToRemove = [];
                
                for (const key in data) {
                    const year = parseInt(key.split('-')[0]);
                    if (year < cutoffYear) {
                        keysToRemove.push(key);
                    }
                }
                
                keysToRemove.forEach(key => {
                    delete data[key];
                });
                
                this.calendar.saveCalendarData();
                console.log(`Cleared ${keysToRemove.length} old entries`);
            }
        } catch (error) {
            console.error('Failed to clear old data:', error);
        }
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            let totalSize = 0;
            for (const key in localStorage) {
                if (key.startsWith('simpleCalendar')) {
                    totalSize += localStorage[key].length;
                }
            }
            
            return {
                totalSize: totalSize,
                totalSizeKB: Math.round(totalSize / 1024),
                quota: navigator.storage ? navigator.storage.estimate() : null
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return null;
        }
    }
}

// Export for use in other modules
window.AutoSave = AutoSave;
