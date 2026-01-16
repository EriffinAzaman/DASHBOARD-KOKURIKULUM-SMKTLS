// ===================================
// ATTENDANCE TRACKING MODULE
// Auto-save, Real-time Sync, 12 Sessions
// ===================================

let currentTab = 'kelab';
let attendanceDataByTab = {
    kelab: [],
    unit: [],
    sukan: [],
    rumah: []
};
let filteredAttendanceData = [];
let saveQueue = [];
let isSaving = false;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    // Get tab from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['kelab', 'unit', 'sukan', 'rumah'].includes(tabParam)) {
        currentTab = tabParam;
        switchTab(tabParam);
    }

    // Load all attendance data
    await loadAllAttendanceData();
});

/**
 * Load all attendance data for all tabs
 */
async function loadAllAttendanceData() {
    try {
        showNotification('Memuatkan data kehadiran...', 'info');

        // Load data for all categories
        await Promise.all([
            loadAttendanceData('kelab'),
            loadAttendanceData('unit'),
            loadAttendanceData('sukan'),
            loadAttendanceData('rumah')
        ]);

        // Store data
        attendanceDataByTab.kelab = attendanceData.kelab;
        attendanceDataByTab.unit = attendanceData.unit;
        attendanceDataByTab.sukan = attendanceData.sukan;
        attendanceDataByTab.rumah = attendanceData.rumah;

        // Populate filters
        populateAttendanceFilters();

        // Render current tab
        renderAttendanceTable(currentTab);

        showNotification('Data berjaya dimuatkan!', 'success');
    } catch (error) {
        console.error('Error loading attendance data:', error);
        showNotification('Ralat memuatkan data. Menggunakan data demo.', 'warning');

        // Use demo data
        useDemoData();
    }
}

/**
 * Use demo data when API is not available
 */
function useDemoData() {
    // Create demo data for each category
    const demoStudents = [
        { nama: 'Ahmad bin Ali', kelas: '4 DINAMIK' },
        { nama: 'Siti binti Hassan', kelas: '4 DINAMIK' },
        { nama: 'Kumar a/l Rajan', kelas: '5 BESTARI' },
        { nama: 'Nurul binti Ibrahim', kelas: '5 BESTARI' },
        { nama: 'Lee Wei Ming', kelas: '4 CEMERLANG' }
    ];

    const categories = {
        kelab: ['STEM / SOLAR', 'DOKTOR MUDA', 'ICT / KOMPUTER'],
        unit: ['KADET REMAJA SEKOLAH', 'KOR KADET POLIS', 'BULAN SABIT MERAH MALAYSIA'],
        sukan: ['BOLA SEPAK', 'BADMINTON', 'CATUR'],
        rumah: ['MARIKH', 'KEJORA', 'NEPTUNE', 'MUSYTARI']
    };

    Object.keys(categories).forEach(tab => {
        attendanceDataByTab[tab] = demoStudents.map((student, idx) => {
            const row = {
                NAMA: student.nama,
                KELAS: student.kelas,
                CATEGORY: categories[tab][idx % categories[tab].length]
            };

            // Add random attendance
            for (let i = 1; i <= 12; i++) {
                const rand = Math.random();
                row[`P${i}`] = rand > 0.3 ? '✓' : (rand > 0.1 ? '✗' : '');
            }

            return row;
        });
    });

    populateAttendanceFilters();
    renderAttendanceTable(currentTab);
}

// ===================================
// TAB SWITCHING
// ===================================

/**
 * Switch between attendance tabs
 */
function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tab}`).classList.add('active');

    // Render table for current tab
    renderAttendanceTable(tab);
}

// ===================================
// FILTER MANAGEMENT
// ===================================

/**
 * Populate filter dropdowns for all tabs
 */
function populateAttendanceFilters() {
    // Kelab filter
    const kelabCategories = getUniqueValues(attendanceDataByTab.kelab, 'CATEGORY');
    populateFilter('filterKelab', kelabCategories, 'Semua Kelab');

    // Unit filter
    const unitCategories = getUniqueValues(attendanceDataByTab.unit, 'CATEGORY');
    populateFilter('filterUnit', unitCategories, 'Semua Unit');

    // Sukan filter
    const sukanCategories = getUniqueValues(attendanceDataByTab.sukan, 'CATEGORY');
    populateFilter('filterSukan', sukanCategories, 'Semua Sukan');

    // Rumah filter
    const rumahCategories = getUniqueValues(attendanceDataByTab.rumah, 'CATEGORY');
    populateFilter('filterRumah', rumahCategories, 'Semua Rumah');
}

/**
 * Filter attendance data
 */
function filterAttendance(tab) {
    const filterId = `filter${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
    const filterValue = document.getElementById(filterId).value;

    if (filterValue === 'all') {
        filteredAttendanceData = [...attendanceDataByTab[tab]];
    } else {
        filteredAttendanceData = attendanceDataByTab[tab].filter(row =>
            row.CATEGORY === filterValue
        );
    }

    renderAttendanceTable(tab);
}

// ===================================
// TABLE RENDERING
// ===================================

/**
 * Render attendance table
 */
function renderAttendanceTable(tab) {
    const containerId = `attendanceTable${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
    const container = document.getElementById(containerId);

    if (!container) return;

    // Get data
    const filterValue = document.getElementById(`filter${tab.charAt(0).toUpperCase() + tab.slice(1)}`).value;
    let data = filterValue === 'all' ? attendanceDataByTab[tab] : filteredAttendanceData;

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">Tiada data kehadiran</p>';
        return;
    }

    let html = '<div class="table-container"><table>';

    // Header
    html += '<thead><tr>';
    html += '<th>Nama</th>';
    html += '<th>Kelas</th>';
    html += '<th>Kategori</th>';
    for (let i = 1; i <= 12; i++) {
        html += `<th>P${i}</th>`;
    }
    html += '<th>%</th>';
    html += '</tr></thead>';

    // Body
    html += '<tbody>';
    data.forEach((row, rowIndex) => {
        html += '<tr>';
        html += `<td>${escapeHtml(row.NAMA || '-')}</td>`;
        html += `<td>${escapeHtml(row.KELAS || '-')}</td>`;
        html += `<td>${escapeHtml(row.CATEGORY || '-')}</td>`;

        // Attendance cells
        let presentCount = 0;
        for (let i = 1; i <= 12; i++) {
            const status = row[`P${i}`] || '';
            const cellClass = status === '✓' ? 'present' : (status === '✗' ? 'absent' : (status === 'E' ? 'excused' : ''));

            html += `<td class="attendance-cell ${cellClass}" onclick="toggleAttendance('${tab}', ${rowIndex}, ${i})">`;
            html += `<span class="attendance-status">${status || '-'}</span>`;
            html += '</td>';

            if (status === '✓') presentCount++;
        }

        // Percentage
        const percentage = ((presentCount / 12) * 100).toFixed(0);
        const percentClass = percentage >= 80 ? 'text-success' : (percentage >= 60 ? 'text-warning' : 'text-danger');
        html += `<td class="${percentClass}" style="font-weight: bold;">${percentage}%</td>`;

        html += '</tr>';
    });
    html += '</tbody>';

    html += '</table></div>';
    container.innerHTML = html;

    // Add CSS for attendance cells
    addAttendanceCellStyles();
}

/**
 * Add CSS styles for attendance cells
 */
function addAttendanceCellStyles() {
    if (document.getElementById('attendance-cell-styles')) return;

    const style = document.createElement('style');
    style.id = 'attendance-cell-styles';
    style.textContent = `
        .attendance-cell {
            cursor: pointer;
            text-align: center;
            user-select: none;
            transition: all 0.2s ease;
        }
        .attendance-cell:hover {
            background: rgba(102, 126, 234, 0.2) !important;
            transform: scale(1.1);
        }
        .attendance-cell.present {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            font-weight: bold;
        }
        .attendance-cell.absent {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            font-weight: bold;
        }
        .attendance-cell.excused {
            background: rgba(234, 179, 8, 0.2);
            color: #eab308;
            font-weight: bold;
        }
        .text-success { color: #22c55e; }
        .text-warning { color: #eab308; }
        .text-danger { color: #ef4444; }
    `;
    document.head.appendChild(style);
}

// ===================================
// ATTENDANCE TOGGLING & AUTO-SAVE
// ===================================

/**
 * Toggle attendance status
 */
function toggleAttendance(tab, rowIndex, period) {
    const data = attendanceDataByTab[tab];
    if (!data || !data[rowIndex]) return;

    const row = data[rowIndex];
    const key = `P${period}`;
    const currentStatus = row[key] || '';

    // Cycle through: empty -> ✓ -> ✗ -> E -> empty
    let newStatus;
    if (currentStatus === '') newStatus = '✓';
    else if (currentStatus === '✓') newStatus = '✗';
    else if (currentStatus === '✗') newStatus = 'E';
    else newStatus = '';

    row[key] = newStatus;

    // Re-render table
    renderAttendanceTable(tab);

    // Queue for auto-save
    queueAutoSave(tab, rowIndex, period, newStatus);
}

/**
 * Queue change for auto-save
 */
function queueAutoSave(tab, rowIndex, period, status) {
    saveQueue.push({
        tab,
        rowIndex,
        period,
        status,
        timestamp: Date.now()
    });

    // Debounced save
    debouncedSave();
}

/**
 * Debounced save function
 */
const debouncedSave = debounce(async () => {
    if (saveQueue.length === 0 || isSaving) return;

    isSaving = true;
    showSaveIndicator('saving');

    try {
        // Simulate API call (replace with actual Google Sheets API call)
        await saveToGoogleSheets(saveQueue);

        // Clear queue
        saveQueue = [];

        showSaveIndicator('saved');

        // Store in local storage as backup
        localStorage.setItem('attendance_backup', JSON.stringify(attendanceDataByTab));
    } catch (error) {
        console.error('Error saving attendance:', error);
        showSaveIndicator('error');

        // Retry after delay
        setTimeout(() => {
            if (saveQueue.length > 0) {
                debouncedSave();
            }
        }, CONFIG.AUTO_SAVE.RETRY_DELAY);
    } finally {
        isSaving = false;
    }
}, CONFIG.AUTO_SAVE.DEBOUNCE_DELAY);

/**
 * Save to Google Sheets (placeholder)
 */
async function saveToGoogleSheets(changes) {
    // This is a placeholder - implement actual Google Sheets API write
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Saved changes:', changes);
            resolve();
        }, 500);
    });
}

/**
 * Show save indicator
 */
function showSaveIndicator(status) {
    const indicator = document.getElementById('saveIndicator');
    if (!indicator) return;

    indicator.className = 'save-indicator show ' + status;

    if (status === 'saving') {
        indicator.innerHTML = '<div class="spinner"></div><span>Menyimpan...</span>';
    } else if (status === 'saved') {
        indicator.innerHTML = '<span style="color: var(--success);">✓</span><span>Disimpan</span>';
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    } else if (status === 'error') {
        indicator.innerHTML = '<span style="color: var(--danger);">✗</span><span>Ralat menyimpan</span>';
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }
}

// ===================================
// EXPORT FUNCTIONS
// ===================================

/**
 * Export current tab to PDF
 */
function exportCurrentTabToPDF() {
    const filterValue = document.getElementById(`filter${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`).value;
    const data = filterValue === 'all' ? attendanceDataByTab[currentTab] : filteredAttendanceData;

    if (!data || data.length === 0) {
        showNotification('Tiada data untuk dieksport', 'warning');
        return;
    }

    const categoryNames = {
        'kelab': 'Kelab_Persatuan',
        'unit': 'Unit_Beruniform',
        'sukan': 'Sukan_Permainan',
        'rumah': 'Rumah_Sukan'
    };

    const filename = `Kehadiran_${categoryNames[currentTab]}_${new Date().toISOString().split('T')[0]}.pdf`;
    exportAttendanceToPDF(data, currentTab, filename);
}
