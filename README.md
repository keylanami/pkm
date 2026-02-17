# 🚀 Sistem Manajemen Keuangan & HPP UMKM (PKM-KC)

![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![React](https://img.shields.io/badge/React-19-blue) ![Mongoose](https://img.shields.io/badge/Mongoose-9.1-880000) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC)

Aplikasi berbasis web **Fullstack** yang dirancang untuk membantu UMKM dalam mencatat transaksi keuangan, menghitung Harga Pokok Penjualan (HPP) secara otomatis, memantau laba/rugi melalui dashboard interaktif, dan mengelola pengingat tagihan.

Dibuat sebagai bagian dari **Program Kreativitas Mahasiswa - Karsa Cipta (PKM-KC)**.

---

## 🌟 Fitur Utama

### 1. 🔐 Autentikasi Aman
- Register & Login pengguna.
- Keamanan menggunakan **JWT (JSON Web Token)**.
- Token disimpan di **HTTP-Only Cookies** (aman dari serangan XSS).
- Password terenkripsi menggunakan **Bcrypt**.

### 2. 📊 Dashboard Interaktif
- Ringkasan total pemasukan, pengeluaran, dan laba bersih secara *real-time*.
- **Trend Analysis**: Persentase kenaikan/penurunan performa dibandingkan bulan lalu.
- Visualisasi data menggunakan grafik batang dan diagram lingkaran (*Recharts*).

### 3. 💰 Kalkulator HPP (Harga Pokok Penjualan)
- Hitung modal per unit produk secara rinci.
- Komponen biaya: Bahan Baku, Tenaga Kerja, dan Overhead.
- **Auto-Sync**: Hasil perhitungan HPP otomatis tersimpan ke Master Data Produk untuk referensi kasir.

### 4. 🧾 Pencatatan Transaksi
- Input pemasukan (Penjualan, Modal, Pinjaman) dan pengeluaran (Bahan Baku, Operasional).
- Pilihan produk otomatis muncul dari database HPP.
- Riwayat transaksi yang rapi dan mudah difilter per periode.

### 5. 🔔 Reminder Tagihan
- Fitur pengingat untuk tagihan rutin atau utang piutang.
- Status aktif/non-aktif yang bisa diubah.

---

## 🛠️ Teknologi yang Digunakan

* **Core Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
* **UI Library**: [React 19.2.3](https://react.dev/)
* **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9.1.5](https://mongoosejs.com/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`)
* **HTTP Client**: [Axios 1.13.5](https://axios-http.com/)
* **Charts**: [Recharts 3.7.0](https://recharts.org/)
* **Icons**: [Heroicons 2.2.0](https://heroicons.com/)
* **Auth**: JWT & Bcryptjs

---

## 🚀 Cara Menjalankan (Localhost)

Ikuti langkah ini untuk menjalankan aplikasi di komputer lokal kamu.

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/nama-repo.git](https://github.com/username-kamu/nama-repo.git)
cd nama-repo