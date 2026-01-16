// ===================================
// KOKURIKULUM DASHBOARD - CORE APP
// Google Sheets Integration & Data Management
// ===================================

// Global state
let masterData = [];
let attendanceData = {
    kelab: [],
    unit: [],
    sukan: [],
    rumah: []
};

// ===================================
// GOOGLE SHEETS API FUNCTIONS
// ===================================

/**
 * Load data from Google Sheets
 */
async function loadFromGoogleSheets(sheetName) {
    try {
        const range = `${sheetName}!A1:Z1000`; // Adjust range as needed
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return parseSheetData(data.values);
    } catch (error) {
        console.error(`Error loading ${sheetName}:`, error);

        // Fallback to local storage if available
        const cached = localStorage.getItem(`cached_${sheetName}`);
        if (cached) {
            console.log(`Using cached data for ${sheetName}`);
            return JSON.parse(cached);
        }

        throw error;
    }
}

/**
 * Parse sheet data into array of objects
 */
function parseSheetData(values) {
    if (!values || values.length === 0) {
        return [];
    }

    const headers = values[0].map(h => h.trim().toUpperCase().replace(/\s+/g, '_'));
    const data = [];

    for (let i = 1; i < values.length; i++) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[i][j] || '';
        }
        data.push(row);
    }

    return data;
}

/**
 * Load master data (student information)
 */
async function loadMasterData() {
    try {
        const data = await loadFromGoogleSheets(CONFIG.SHEETS.MASTER_DATA);
        masterData = data;

        // Cache data
        localStorage.setItem(`cached_${CONFIG.SHEETS.MASTER_DATA}`, JSON.stringify(data));

        return data;
    } catch (error) {
        console.error('Error loading master data:', error);
        return [];
    }
}

/**
 * Load attendance data for a specific category
 */
async function loadAttendanceData(category) {
    try {
        let sheetName;
        switch (category) {
            case 'kelab':
                sheetName = CONFIG.SHEETS.ATTENDANCE_KELAB;
                break;
            case 'unit':
                sheetName = CONFIG.SHEETS.ATTENDANCE_UNIT;
                break;
            case 'sukan':
                sheetName = CONFIG.SHEETS.ATTENDANCE_SUKAN;
                break;
            case 'rumah':
                sheetName = CONFIG.SHEETS.ATTENDANCE_RUMAH;
                break;
            default:
                throw new Error('Invalid category');
        }

        const data = await loadFromGoogleSheets(sheetName);
        attendanceData[category] = data;

        // Cache data
        localStorage.setItem(`cached_${sheetName}`, JSON.stringify(data));

        return data;
    } catch (error) {
        console.error(`Error loading attendance data for ${category}:`, error);
        return [];
    }
}

// ===================================
// DATA FILTERING & SORTING
// ===================================

/**
 * Filter data based on criteria
 */
function filterData(data, filters) {
    return data.filter(row => {
        for (const [key, value] of Object.entries(filters)) {
            if (value && value !== 'all') {
                const rowValue = row[key.toUpperCase()] || row[key];
                if (rowValue !== value) {
                    return false;
                }
            }
        }
        return true;
    });
}

/**
 * Search data across all fields
 */
function searchData(data, query) {
    if (!query) return data;

    const lowerQuery = query.toLowerCase();
    return data.filter(row => {
        return Object.values(row).some(value =>
            String(value).toLowerCase().includes(lowerQuery)
        );
    });
}

/**
 * Sort data by column
 */
function sortData(data, column, ascending = true) {
    return [...data].sort((a, b) => {
        const aVal = a[column] || '';
        const bVal = b[column] || '';

        // Try numeric comparison first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        const comparison = String(aVal).localeCompare(String(bVal));
        return ascending ? comparison : -comparison;
    });
}

// ===================================
// TABLE RENDERING
// ===================================

/**
 * Render data table
 */
function renderTable(data, containerId, columns = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">Tiada data tersedia</p>';
        return;
    }

    // Use all columns if not specified
    if (!columns) {
        columns = Object.keys(data[0]);
    }

    let html = '<div class="table-container"><table>';

    // Header
    html += '<thead><tr>';
    columns.forEach(col => {
        html += `<th data-column="${col}" onclick="handleSort('${col}')">${formatColumnName(col)} ▼</th>`;
    });
    html += '</tr></thead>';

    // Body
    html += '<tbody>';
    data.forEach(row => {
        html += '<tr>';
        columns.forEach(col => {
            const value = row[col] || '-';
            html += `<td>${escapeHtml(value)}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';

    html += '</table></div>';
    container.innerHTML = html;
}

/**
 * Format column name for display
 */
function formatColumnName(name) {
    return name
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// FILTER UI HELPERS
// ===================================

/**
 * Populate filter dropdown
 */
function populateFilter(selectId, values, placeholder = 'Semua') {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="all">${placeholder}</option>`;

    const uniqueValues = [...new Set(values.filter(Boolean))].sort();
    uniqueValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

/**
 * Get unique values from data column
 */
function getUniqueValues(data, column) {
    return [...new Set(data.map(row => row[column]).filter(Boolean))];
}

// ===================================
// EXPORT FUNCTIONS
// ===================================

/**
 * Export data to CSV
 */
function exportToCSV(data, filename = 'data.csv') {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    downloadFile(csv, filename, 'text/csv');
}

/**
 * Download file helper
 */
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'save-indicator show';
    notification.classList.add(type);

    let icon = '📢';
    if (type === 'success' || type === 'saved') icon = '✓';
    if (type === 'error') icon = '✗';
    if (type === 'saving') icon = '<div class="spinner"></div>';

    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Format date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize app
 */
async function initApp() {
    try {
        // Check if API key is configured
        if (CONFIG.API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
            console.warn('Google Sheets API key not configured. Using demo mode.');
            showNotification('Mod Demo: Sila konfigurasikan API key untuk sambungan sebenar', 'warning');
            return;
        }

        // Load initial data
        await loadMasterData();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Ralat memuatkan data. Sila semak sambungan.', 'error');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
