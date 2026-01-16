// Configuration for Kokurikulum Dashboard
const CONFIG = {
    // Google Sheets Configuration
    SPREADSHEET_ID: '105qafZc_5ct49TIfptPeQbSWzos9GDpc8sRiHaRcKo8',
    API_KEY: 'YOUR_GOOGLE_API_KEY_HERE', // Replace with your Google Sheets API key

    // Sheet Names and Ranges
    SHEETS: {
        MASTER_DATA: 'MAKLUMAT KO 2026',
        ATTENDANCE_KELAB: 'KEHADIRAN KELAB PERSATUAN',
        ATTENDANCE_UNIT: 'KEHADIRAN UNIT BERUNIFORM',
        ATTENDANCE_SUKAN: 'KEHADIRAN SUKAN PERMAINAN',
        ATTENDANCE_RUMAH: 'KEHADIRAN RUMAH SUKAN'
    },

    // Categories
    CATEGORIES: {
        TINGKATAN: ['1', '2', '3', '4', '5'],
        UNIT_BERUNIFORM: [
            'KADET REMAJA SEKOLAH',
            'KOR KADET POLIS',
            'PERSEKUTUAN PENGAKAP MALAYSIA',
            'BULAN SABIT MERAH MALAYSIA'
        ],
        KELAB: [
            'STEM / SOLAR',
            'DOKTOR MUDA',
            'KEMAHIRAN AL-QURAN',
            'ICT / KOMPUTER'
        ],
        SUKAN: [
            'BOLA SEPAK',
            'BOLA TAMPAR',
            'CATUR',
            'BADMINTON'
        ],
        RUMAH_SUKAN: [
            { name: 'MARIKH', color: '#ef4444' },      // Red
            { name: 'MUSYTARI', color: '#3b82f6' },    // Blue
            { name: 'NEPTUNE', color: '#eab308' },     // Yellow
            { name: 'KEJORA', color: '#22c55e' }       // Green
        ]
    },

    // Auto-save settings
    AUTO_SAVE: {
        DEBOUNCE_DELAY: 2000, // 2 seconds
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000 // 1 second
    },

    // Application settings
    APP: {
        TITLE: 'Dashboard Kokurikulum',
        SCHOOL_NAME: 'SMK TUANKU LAILATUL SHAHREEN',
        MOTTO: 'FOCUS TO BE THE FIRST',
        YEAR: '2026'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
