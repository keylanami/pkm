# 🚀 Sistem Manajemen Keuangan & HPP UMKM (PKM-KC)

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

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

* **Frontend**: [Next.js 14 (App Router)](https://nextjs.org/)
* **Backend**: Next.js API Routes (Serverless Functions)
* **Database**: [MongoDB Atlas](https://www.mongodb.com/) (NoSQL)
* **ODM**: [Mongoose](https://mongoosejs.com/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Charts**: [Recharts](https://recharts.org/)
* **Icons**: [Heroicons](https://heroicons.com/)

---

## 🚀 Cara Menjalankan (Localhost)

Ikuti langkah ini untuk menjalankan aplikasi di komputer lokal kamu.

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/nama-repo.git](https://github.com/username-kamu/nama-repo.git)
cd nama-repo