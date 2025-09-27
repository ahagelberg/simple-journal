/**
 * Calendar functionality for Simple Calendar App
 * Handles full year calendar grid generation, navigation, and cell management
 */

class Calendar {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.startYear = 1990;
        this.endYear = this.currentYear; // Show up to current year
        this.selectedDate = null;
        this.selectedNumber = null;
        this.calendarData = this.loadCalendarData();
        this.autoSave = null;
        this.autoAdvance = true;
        this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAllYears();
        this.initializeAutoSave();
    }

    initializeAutoSave() {
        // Initialize auto-save after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.autoSave = new AutoSave(this);
        }, 100);
    }

    setupEventListeners() {

        // Number palette buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectNumber(e.target);
            });
        });

        // Action buttons
        document.getElementById('clear-cell-btn').addEventListener('click', () => {
            this.clearSelectedCell();
        });

        document.getElementById('back-cell-btn').addEventListener('click', () => {
            this.backAndClear();
        });

        // Action buttons
        document.getElementById('export-json').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('print-calendar').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('import-json').addEventListener('click', () => {
            this.importData();
        });

        // Settings modal event listeners
        document.getElementById('close-settings').addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Close modal when clicking outside
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                this.closeSettings();
            }
        });
        
        // Add scroll listener to save scroll position
        this.addScrollListener();
    }

    renderAllYears() {
        const container = document.getElementById('calendar-scroll-container');
        container.innerHTML = '';

        // Generate years from startYear to endYear (oldest first, newest last)
        for (let year = this.startYear; year <= this.endYear; year++) {
            this.generateYearSection(container, year);
        }
        
        // Restore scroll position and selected cell after rendering
        setTimeout(() => {
            this.reloadAllCells();
            this.restoreScrollPosition();
            this.restoreSelectedCell();
        }, 100);
    }

    reloadAllCells() {
        // Only load cells that have data (not 0 or empty)
        Object.keys(this.calendarData).forEach(dateKey => {
            const number = this.calendarData[dateKey];
            if (number !== undefined && number !== null && number !== 0) {
                // Parse the date key to get year, month, day
                const [year, month, day] = dateKey.split('-').map(Number);
                this.loadNumbersForDate(year, month - 1, day); // month is 0-indexed in JS
            }
        });
        
        // Calculate and display consecutive zero counts
        this.calculateStreakSpacing();
    }

    calculateStreakSpacing() {
        // Clear all existing count displays first
        document.querySelectorAll('.zero-count').forEach(count => count.remove());
        document.querySelectorAll('.count-display').forEach(cell => cell.classList.remove('count-display'));
        
        // Process all dates chronologically from start to end
        const allDates = this.getAllDatesInOrder();
        let streak = false;
        let previousDay = null;
        
        let inStreak = false;
        let currentStreak = 0;
        for (let i = 0; i < allDates.length; i++) {
            const { year, month, day } = allDates[i];
            const dateKey = this.getDateKey(year, month, day);
            const number = this.calendarData[dateKey];
            const isZero = number === undefined || number === null || number === 0;

            if (isZero) {
                currentStreak++;
                inStreak = false;
            } else if (inStreak) {
                currentStreak++;
            } else {
                inStreak = true;
                if (previousDay) {
                    this.displayZeroCount(previousDay.year, previousDay.month, previousDay.day, currentStreak);
                }
                currentStreak = 1;
            }
            previousDay = { year, month, day };
        }
    }

    getAllDatesInOrder() {
        const allDates = [];
        
        // Generate all dates from startYear to endYear in chronological order
        for (let year = this.startYear; year <= this.endYear; year++) {
            for (let month = 0; month < 12; month++) {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                for (let day = 1; day <= daysInMonth; day++) {
                    allDates.push({ year, month, day });
                }
            }
        }
        
        return allDates;
    }

    displayZeroCount(year, month, day, count) {
        const cell = document.querySelector(`[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
        if (cell) {
            // Remove existing count display
            cell.classList.remove('count-display');
            const existingCount = cell.querySelector('.zero-count');
            if (existingCount) {
                existingCount.remove();
            }
            
            // Add count display
            cell.classList.add('count-display');
            const countElement = document.createElement('div');
            countElement.className = 'zero-count';
            countElement.textContent = count;
            cell.appendChild(countElement);
        }
    }

    generateYearSection(container, year) {
        // Create year section
        const yearSection = document.createElement('div');
        yearSection.className = 'year-section';

        // Create year header
        const yearHeader = document.createElement('div');
        yearHeader.className = 'year-header';
        yearHeader.textContent = year;
        yearSection.appendChild(yearHeader);

        // Create year calendar grid
        const yearGrid = document.createElement('div');
        yearGrid.className = 'year-calendar-grid';
        yearSection.appendChild(yearGrid);

        // Add day headers
        this.addDayHeaders(yearGrid);

        // Add calendar cells
        this.generateYearCalendarCells(yearGrid, year);

        container.appendChild(yearSection);
    }

    addDayHeaders(grid) {
        // Month header
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        monthHeader.textContent = 'Month';
        grid.appendChild(monthHeader);

        // Day headers (1-31)
        for (let day = 1; day <= 31; day++) {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        }
    }

    generateYearCalendarCells(grid, year) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Generate 12 rows (one for each month)
        for (let month = 0; month < 12; month++) {
            // Month label
            const monthLabel = document.createElement('div');
            monthLabel.className = 'month-label';
            monthLabel.textContent = monthNames[month];
            grid.appendChild(monthLabel);

            // Generate 31 cells for each month
            for (let day = 1; day <= 31; day++) {
                const cell = this.createYearCalendarCell(day, month, year);
                grid.appendChild(cell);
            }
        }
    }

    createYearCalendarCell(day, month, year) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        
        // Check if this day exists in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        if (day > daysInMonth) {
            cell.classList.add('invalid-day');
            return cell;
        }

        // Check if this is today
        const today = new Date();
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            cell.classList.add('today');
        }

        // Load numbers for this date (applies classes to cell)
        // This will apply number-0 class if no data exists
        this.loadNumbersForDate(year, month, day);

        // Add click event listener
        cell.addEventListener('click', () => {
            this.selectDate(cell, year, month, day);
        });

        // Add data attributes for easy reference
        cell.dataset.year = year;
        cell.dataset.month = month;
        cell.dataset.day = day;

        return cell;
    }

    loadNumbersForDate(year, month, day) {
        const dateKey = this.getDateKey(year, month, day);
        const number = this.calendarData[dateKey];

        // Find the cell directly
        const cell = document.querySelector(`[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
        
        if (cell) {
            // Remove all number classes and count display
            for (let i = 0; i <= 5; i++) {
                cell.classList.remove(`number-${i}`);
            }
            cell.classList.remove('count-display');
            
            // Apply the number class to the cell itself
            if (number !== undefined && number !== null) {
                // Ensure number is a valid integer between 0-5
                const validNumber = Math.max(0, Math.min(5, parseInt(number) || 0));
                const className = `number-${validNumber}`;
                cell.classList.add(className);
            } else {
                // Empty cells default to 0 (white background)
                cell.classList.add('number-0');
            }
        }
    }

    selectDate(cell, year, month, day) {
        // Remove previous selection
        const previousSelected = document.querySelector('.day-cell.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Add selection to current cell
        cell.classList.add('selected');
        this.selectedDate = { year, month, day, cell };

        // Save scroll position and selected cell
        this.saveScrollPosition();

        console.log(`Selected date: ${year}-${month + 1}-${day}`);
    }

    selectNumber(button) {
        // Remove previous number selection
        const previousSelected = document.querySelector('.number-btn.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Add selection to current number
        button.classList.add('selected');
        
        // Store just the number value
        const number = parseInt(button.dataset.number);
        this.selectedNumber = number;

        console.log(`Selected number: ${number}`);

        // If there's a selected date, automatically add the number to it
        if (this.selectedDate) {
            this.addNumberToDate(
                this.selectedDate.year, 
                this.selectedDate.month, 
                this.selectedDate.day, 
                number
            );
        } else {
            // If no date is selected, show a message
            if (window.app) {
                window.app.showNotification('Please select a date first', 'info');
            }
        }
    }

    getDateKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    loadCalendarData() {
        try {
            const data = localStorage.getItem('simpleCalendarData');
            const parsedData = data ? JSON.parse(data) : {};
            return parsedData;
        } catch (error) {
            console.error('Error loading calendar data:', error);
            return {};
        }
    }



    saveCalendarData() {
        try {
            localStorage.setItem('simpleCalendarData', JSON.stringify(this.calendarData));
        } catch (error) {
            console.error('Error saving calendar data:', error);
        }
    }


    addNumberToDate(year, month, day, number) {
        const dateKey = this.getDateKey(year, month, day);
        
        // Only store non-zero values (0 is the default for empty cells)
        if (number === 0) {
            delete this.calendarData[dateKey];
        } else {
            this.calendarData[dateKey] = number;
        }
        this.saveCalendarData();
        
        // Trigger auto-save
        if (this.autoSave) {
            this.autoSave.onDataChange();
        }
        
        // Apply number class to the cell
        const cell = document.querySelector(`[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
        if (cell) {
            // Remove all existing number classes
            for (let i = 0; i <= 5; i++) {
                cell.classList.remove(`number-${i}`);
            }
            // Apply the new number class
            cell.classList.add(`number-${number}`);
        }
        
        // Recalculate consecutive zeros after data change
        this.calculateStreakSpacing();
        
        // Auto-advance to next day if enabled
        if (this.autoAdvance) {
            this.advanceToNextDay(year, month, day);
        }
    }

    advanceToNextDay(year, month, day) {
        // Calculate next day
        const currentDate = new Date(year, month, day);
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        
        const nextYear = nextDate.getFullYear();
        const nextMonth = nextDate.getMonth();
        const nextDay = nextDate.getDate();
        
        // Check if next day is within our calendar range
        if (nextYear >= this.startYear && nextYear <= this.endYear) {
            // Find and select the next day's cell
            const nextCell = document.querySelector(`[data-year="${nextYear}"][data-month="${nextMonth}"][data-day="${nextDay}"]`);
            if (nextCell) {
                // Remove current selection
                const currentSelected = document.querySelector('.day-cell.selected');
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                }
                
                // Select next day
                nextCell.classList.add('selected');
                this.selectedDate = { year: nextYear, month: nextMonth, day: nextDay, cell: nextCell };
                
                // Scroll to next day if needed
                nextCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    removeSymbolFromDate(year, month, day, symbolIndex) {
        const dateKey = this.getDateKey(year, month, day);
        if (this.calendarData[dateKey] && this.calendarData[dateKey][symbolIndex]) {
            this.calendarData[dateKey].splice(symbolIndex, 1);
            this.saveCalendarData();
            
            // Re-render the specific cell
            const cell = document.querySelector(`[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
            if (cell) {
                this.loadNumbersForDate(year, month, day);
            }
        }
    }

    exportData() {
        const data = {
            calendarData: this.calendarData,
            settings: {
                autoAdvance: this.autoAdvance
            },
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `calendar-${this.currentYear}.json`;
        link.click();
        
        console.log('Calendar data exported');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.loadImportedData(data);
                    } catch (error) {
                        alert('Error importing file: Invalid JSON format');
                        console.error('Import error:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    loadImportedData(data) {
        if (data.calendarData) {
            this.calendarData = data.calendarData;
            this.saveCalendarData();
        }
        
        if (data.settings) {
            this.autoAdvance = data.settings.autoAdvance !== undefined ? data.settings.autoAdvance : true;
        }
        
        // Re-render all calendars
        this.renderAllYears();
        
        // Show success message
        if (window.app) {
            window.app.showNotification('Calendar data imported successfully', 'success');
        }
    }

    openSettings() {
        // Load current settings into modal
        document.getElementById('auto-advance-toggle').checked = this.autoAdvance;
        document.getElementById('auto-save-toggle').checked = this.autoSave ? this.autoSave.isEnabled : true;
        
        // Show modal
        document.getElementById('settings-modal').style.display = 'block';
    }

    closeSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    saveSettings() {
        // Get settings from modal
        this.autoAdvance = document.getElementById('auto-advance-toggle').checked;
        const autoSaveEnabled = document.getElementById('auto-save-toggle').checked;
        
        // Apply auto-save setting
        if (this.autoSave) {
            this.autoSave.setEnabled(autoSaveEnabled);
        }
        
        // Save settings to localStorage
        const settings = {
            autoAdvance: this.autoAdvance,
            autoSaveEnabled: autoSaveEnabled
        };
        localStorage.setItem('simpleCalendarSettings', JSON.stringify(settings));
        
        this.closeSettings();
        
        if (window.app) {
            window.app.showNotification('Settings saved', 'success');
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all calendar data? This action cannot be undone.')) {
            this.calendarData = {};
            this.saveCalendarData();
            this.renderAllYears();
            
            if (window.app) {
                window.app.showNotification('All data cleared', 'success');
            }
        }
    }

    loadSettings() {
        try {
            const settings = localStorage.getItem('simpleCalendarSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.autoAdvance = parsed.autoAdvance !== undefined ? parsed.autoAdvance : true;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    clearSelectedCell() {
        if (!this.selectedDate) {
            if (window.app) {
                window.app.showNotification('Please select a date first', 'info');
            }
            return;
        }

        const { year, month, day } = this.selectedDate;
        const dateKey = this.getDateKey(year, month, day);
        
        // Clear cell (delete entry, default is 0)
        delete this.calendarData[dateKey];
        this.saveCalendarData();
        
        // Trigger auto-save
        if (this.autoSave) {
            this.autoSave.onDataChange();
        }
        
        // Apply number-0 class to the cell
        const cell = document.querySelector(`[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
        if (cell) {
            // Remove all number classes
            for (let i = 0; i <= 5; i++) {
                cell.classList.remove(`number-${i}`);
            }
            // Apply number-0 class
            cell.classList.add('number-0');
        }
        
        console.log(`Cleared cell to 0: ${year}-${month + 1}-${day}`);
    }

    backAndClear() {
        if (!this.selectedDate) {
            if (window.app) {
                window.app.showNotification('Please select a date first', 'info');
            }
            return;
        }

        // Clear current cell
        this.clearSelectedCell();

        // Move back one day
        this.goBackOneDay();
    }

    goBackOneDay() {
        if (!this.selectedDate) return;

        const { year, month, day } = this.selectedDate;
        
        // Calculate previous day
        const currentDate = new Date(year, month, day);
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        
        const prevYear = prevDate.getFullYear();
        const prevMonth = prevDate.getMonth();
        const prevDay = prevDate.getDate();
        
        // Check if previous day is within our calendar range
        if (prevYear >= this.startYear && prevYear <= this.endYear) {
            // Find and select the previous day's cell
            const prevCell = document.querySelector(`[data-year="${prevYear}"][data-month="${prevMonth}"][data-day="${prevDay}"]`);
            if (prevCell) {
                // Remove current selection
                const currentSelected = document.querySelector('.day-cell.selected');
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                }
                
                // Select previous day
                prevCell.classList.add('selected');
                this.selectedDate = { year: prevYear, month: prevMonth, day: prevDay, cell: prevCell };
                
                // Scroll to previous day if needed
                prevCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                console.log(`Moved back to: ${prevYear}-${prevMonth + 1}-${prevDay}`);
            }
        }
    }

    navigateCell(direction) {
        if (!this.selectedDate) {
            // If no date is selected, select today
            const today = new Date();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            const todayDay = today.getDate();
            
            const todayCell = document.querySelector(`[data-year="${todayYear}"][data-month="${todayMonth}"][data-day="${todayDay}"]`);
            if (todayCell) {
                this.selectDate(todayCell, todayYear, todayMonth, todayDay);
            }
            return;
        }

        const { year, month, day } = this.selectedDate;
        let newYear = year;
        let newMonth = month;
        let newDay = day;

        switch (direction) {
            case 'up':
                // Move to same day in previous month
                newMonth--;
                if (newMonth < 0) {
                    newMonth = 11;
                    newYear--;
                }
                // Adjust day if it doesn't exist in the new month
                newDay = this.adjustDayForMonth(newDay, newYear, newMonth);
                break;
            case 'down':
                // Move to same day in next month
                newMonth++;
                if (newMonth > 11) {
                    newMonth = 0;
                    newYear++;
                }
                // Adjust day if it doesn't exist in the new month
                newDay = this.adjustDayForMonth(newDay, newYear, newMonth);
                break;
            case 'left':
                // Move to previous day
                const prevDate = new Date(year, month, day - 1);
                newYear = prevDate.getFullYear();
                newMonth = prevDate.getMonth();
                newDay = prevDate.getDate();
                break;
            case 'right':
                // Move to next day
                const nextDate = new Date(year, month, day + 1);
                newYear = nextDate.getFullYear();
                newMonth = nextDate.getMonth();
                newDay = nextDate.getDate();
                break;
        }

        // Check if new date is within our calendar range
        if (newYear >= this.startYear && newYear <= this.endYear) {
            // Find the target cell
            const targetCell = document.querySelector(`[data-year="${newYear}"][data-month="${newMonth}"][data-day="${newDay}"]`);
            if (targetCell && !targetCell.classList.contains('invalid-day')) {
                // Remove current selection
                const currentSelected = document.querySelector('.day-cell.selected');
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                }
                
                // Select new cell
                targetCell.classList.add('selected');
                this.selectedDate = { year: newYear, month: newMonth, day: newDay, cell: targetCell };
                
                // Scroll to new cell if needed
                targetCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                console.log(`Navigated ${direction} to: ${newYear}-${newMonth + 1}-${newDay}`);
            }
        }
    }

    adjustDayForMonth(day, year, month) {
        // Get the number of days in the target month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // If the day doesn't exist in the target month, use the last day of that month
        if (day > daysInMonth) {
            return daysInMonth;
        }
        
        return day;
    }

    saveScrollPosition() {
        const calendarContainer = document.querySelector('.calendar-container');
        if (calendarContainer) {
            const scrollData = {
                scrollTop: calendarContainer.scrollTop,
                selectedDate: this.selectedDate ? {
                    year: this.selectedDate.year,
                    month: this.selectedDate.month,
                    day: this.selectedDate.day
                } : null
            };
            localStorage.setItem('simpleCalendarScrollPosition', JSON.stringify(scrollData));
        }
    }

    restoreScrollPosition() {
        try {
            const scrollData = localStorage.getItem('simpleCalendarScrollPosition');
            if (scrollData) {
                const data = JSON.parse(scrollData);
                const calendarContainer = document.querySelector('.calendar-container');
                if (calendarContainer && data.scrollTop) {
                    calendarContainer.scrollTop = data.scrollTop;
                }
            }
        } catch (error) {
            console.error('Error restoring scroll position:', error);
        }
    }

    restoreSelectedCell() {
        try {
            const scrollData = localStorage.getItem('simpleCalendarScrollPosition');
            if (scrollData) {
                const data = JSON.parse(scrollData);
                if (data.selectedDate) {
                    const { year, month, day } = data.selectedDate;
                    const cell = document.querySelector(`[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
                    if (cell && !cell.classList.contains('invalid-day')) {
                        this.selectDate(cell, year, month, day);
                        // Scroll to the selected cell
                        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            }
        } catch (error) {
            console.error('Error restoring selected cell:', error);
        }
    }

    addScrollListener() {
        const calendarContainer = document.querySelector('.calendar-container');
        if (calendarContainer) {
            let scrollTimeout;
            calendarContainer.addEventListener('scroll', () => {
                // Debounce scroll saving to avoid too frequent saves
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.saveScrollPosition();
                }, 500);
            });
        }
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
});