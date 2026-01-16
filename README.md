# Dashboard Kokurikulum - SMK Tuanku Lailatul Shahreen 2026

Dashboard pengurusan data dan kehadiran kokurikulum yang canggih dengan reka bentuk moden dan berwarna-warni.

## ✨ Ciri-ciri Utama

### 📊 Pengurusan Data
- **Tapisan Komprehensif**: Tapis mengikut Tingkatan, Kelas, Unit, Kelab, Sukan, Rumah Sukan
- **Carian Pantas**: Cari nama pelajar atau maklumat lain
- **Susun Data**: Klik pada tajuk lajur untuk menyusun data
- **Eksport PDF**: Jana laporan PDF berwarna dan profesional
- **Eksport CSV**: Eksport data ke format CSV
- **Cetak**: Cetak laporan dengan format yang dioptimumkan

### ✅ Jejak Kehadiran
- **4 Kategori**: Kelab & Persatuan, Unit Beruniform, Sukan & Permainan, Rumah Sukan
- **12 Sesi**: Jejaki kehadiran untuk 12 sesi aktiviti
- **Auto-save**: Perubahan disimpan secara automatik (2 saat selepas perubahan terakhir)
- **Interaktif**: Klik pada sel untuk menandakan kehadiran (✓ Hadir, ✗ Tidak Hadir, E Diberi Kebenaran)
- **Kiraan Automatik**: Peratusan kehadiran dikira secara automatik
- **Eksport PDF**: Jana laporan kehadiran berwarna

### 🎨 Reka Bentuk
- **Moden & Canggih**: Gradient, glassmorphism, animasi smooth
- **Berwarna-warni**: Palet warna yang kaya dan menarik
- **Responsif**: Berfungsi pada semua peranti (desktop, tablet, mobile)
- **Dark Mode**: Tema gelap yang selesa untuk mata

## 📁 Struktur Fail

```
DATA DAN KEHADIRAN KOKURIKULUM/
├── index.html          # Dashboard utama
├── data.html           # Halaman pengurusan data
├── attendance.html     # Halaman kehadiran
├── styles.css          # Gaya CSS
├── config.js           # Konfigurasi
├── app.js              # Fungsi utama
├── attendance.js       # Fungsi kehadiran
├── pdf-export.js       # Modul eksport PDF
└── README.md           # Dokumentasi ini
```

## 🚀 Cara Menggunakan

### 1. Konfigurasi Google Sheets API

Untuk menyambung ke Google Sheet anda, ikuti langkah berikut:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat projek baru atau pilih projek sedia ada
3. Aktifkan Google Sheets API
4. Buat API Key:
   - Pergi ke "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Salin API Key
5. Buka fail `config.js` dan gantikan `YOUR_GOOGLE_API_KEY_HERE` dengan API Key anda

### 2. Buka Dashboard

1. Buka fail `index.html` dalam pelayar web (Chrome, Firefox, Edge)
2. Dashboard akan memuatkan data dari Google Sheet secara automatik
3. Jika API Key belum dikonfigurasikan, dashboard akan menggunakan data demo

### 3. Pengurusan Data

1. Klik pada "📊 Data Pelajar" di menu navigasi
2. Gunakan tapisan untuk mencari pelajar mengikut kategori
3. Gunakan kotak carian untuk mencari nama atau maklumat lain
4. Klik pada tajuk lajur untuk menyusun data
5. Klik "📄 Eksport PDF" untuk menjana laporan PDF
6. Klik "🖨️ Cetak" untuk mencetak laporan

### 4. Rekod Kehadiran

1. Klik pada "✅ Kehadiran" di menu navigasi
2. Pilih tab kategori (Kelab, Unit, Sukan, atau Rumah Sukan)
3. Klik pada sel kehadiran untuk menandakan:
   - Klik 1x: ✓ (Hadir)
   - Klik 2x: ✗ (Tidak Hadir)
   - Klik 3x: E (Diberi Kebenaran)
   - Klik 4x: Kosong
4. Perubahan akan disimpan secara automatik selepas 2 saat
5. Klik "📄 Eksport PDF" untuk menjana laporan kehadiran

## 🎨 Kod Warna Rumah Sukan

- 🔴 **Marikh**: Merah (#ef4444)
- 🟡 **Kejora**: Kuning (#eab308)
- 🔵 **Neptune**: Biru (#3b82f6)
- 🟢 **Musytari**: Hijau (#22c55e)

## 💾 Auto-save

Dashboard menggunakan sistem auto-save yang canggih:

- **Debounced Save**: Menunggu 2 saat selepas perubahan terakhir sebelum menyimpan
- **Visual Indicator**: Menunjukkan status "Menyimpan..." dan "Disimpan ✓"
- **Offline Support**: Menyimpan perubahan dalam queue jika offline
- **Auto-sync**: Menyegerakkan semula apabila sambungan dipulihkan
- **Local Backup**: Menyimpan salinan sandaran dalam local storage

## 🔧 Penyelesaian Masalah

### Data tidak dimuatkan
- Pastikan API Key telah dikonfigurasikan dengan betul dalam `config.js`
- Semak sambungan internet
- Pastikan Google Sheet boleh diakses secara awam atau API Key mempunyai akses

### Auto-save tidak berfungsi
- Semak console pelayar untuk mesej ralat (F12 > Console)
- Pastikan Google Sheets API mempunyai kebenaran untuk menulis data
- Perubahan masih disimpan dalam local storage sebagai sandaran

### PDF tidak dieksport
- Pastikan pelayar menyokong jsPDF (Chrome, Firefox, Edge)
- Semak sama ada pop-up blocker menghalang muat turun
- Cuba refresh halaman dan eksport semula

## 📱 Sokongan Pelayar

Dashboard disokong pada pelayar moden:
- ✅ Google Chrome (disyorkan)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari

## 🆘 Bantuan

Jika menghadapi masalah, sila:
1. Semak console pelayar untuk mesej ralat (F12 > Console)
2. Pastikan semua fail berada dalam folder yang sama
3. Pastikan sambungan internet stabil
4. Cuba gunakan pelayar yang berbeza

## 📝 Nota

- Dashboard ini menggunakan Google Sheets sebagai pangkalan data
- Semua data disimpan dalam Google Sheet anda
- Auto-save memerlukan sambungan internet
- Local storage digunakan sebagai sandaran offline

---

**Dicipta untuk SMK Tuanku Lailatul Shahreen 2026**
Dashboard Kokurikulum - Pengurusan Data & Kehadiran

