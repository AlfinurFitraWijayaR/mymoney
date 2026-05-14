# Dokumentasi Teknis mymoney

Dokumen ini memberikan gambaran mendalam tentang arsitektur, model data, dan detail implementasi aplikasi **mymoney**.

---

## 🏗️ Gambaran Arsitektur

Aplikasi ini dibangun menggunakan **Next.js 14** dengan arsitektur **App Router**. Proyek ini memanfaatkan **React Server Components (RSC)** untuk pengambilan data dan **Server Actions** untuk mutasi data, memberikan jembatan yang aman dan efisien antara klien dan database.

### Prinsip Utama
-   **Server-First**: Sebagian besar pengambilan data dilakukan di server untuk meminimalkan ukuran bundle sisi klien dan meningkatkan SEO.
-   **Keamanan Tipe (Type Safety)**: Keamanan tipe end-to-end menggunakan TypeScript dan tipe yang dihasilkan oleh Prisma.
-   **UI Modular**: Komponen yang dapat digunakan kembali disimpan di direktori `components/`, mengikuti pemisahan tanggung jawab yang bersih.
-   **Keamanan**: Autentikasi dan otorisasi ditangani melalui middleware sisi server dan token JWT yang terenkripsi (jose).

---

## 📂 Struktur Proyek

```text
├── app/                  # Next.js App Router (Routes & Halaman)
│   ├── (auth)/           # Rute autentikasi (Login/Register)
│   ├── dashboard/        # Halaman ringkasan utama
│   ├── transactions/     # Riwayat dan manajemen transaksi
│   ├── targets/          # Target keuangan (Goals)
│   ├── statistics/       # Visualisasi data
│   └── profile/          # Pengaturan pengguna dan setup dompet
├── components/           # Komponen React bersama
│   ├── ui/               # Komponen UI dasar (Modal, Tombol, dll.)
│   ├── layout/           # Tata letak global (Sidebar, NavBottom)
│   ├── transaction/      # Komponen khusus transaksi
│   └── ...               # Komponen khusus fitur lainnya
├── lib/                  # Logika inti dan utilitas
│   ├── actions/          # Server Actions (Mutasi)
│   ├── auth.ts           # Logika autentikasi
│   ├── prisma.ts         # Singleton client Prisma
│   └── validations.ts    # Skema Zod untuk validasi formulir
├── prisma/               # Skema database dan migrasi
└── e2e/                  # Pengujian end-to-end Playwright
```

---

## 💾 Model Data (Prisma)

Aplikasi ini menggunakan **PostgreSQL**. Berikut adalah entitas utamanya:

-   **User**: Menyimpan kredensial pengguna, peran (ADMIN/MEMBER), dan alias opsional.
-   **Wallet**: Mewakili akun keuangan (CASH, BANK, EWALLET). Terikat pada `tenant_id`.
-   **Category**: Mengategorikan transaksi (INCOME/EXPENSE). Mencakup nama dan kode ikon SVG.
-   **Transaction**: Entitas inti yang mencatat pergerakan uang. Terhubung ke Dompet, Kategori, dan secara opsional ke Target Keuangan.
-   **FinancialGoal**: Mewakili target tabungan dengan tenggat waktu dan jumlah target.

### Multi-Tenancy
Setiap record (kecuali untuk default sistem) ditandai dengan `tenant_id`. Hal ini memastikan bahwa pengguna hanya dapat mengakses dan mengubah data mereka sendiri, memberikan lingkungan multi-tenant yang kuat.

---

## 🔐 Autentikasi & Otorisasi

-   **Manajemen Sesi**: Ditangani melalui cookie `session` yang berisi JWT terenkripsi.
-   **Middleware**: Melindungi rute dengan memeriksa keberadaan dan validitas cookie sesi.
-   **Server Actions**: Semua tindakan sensitif (misalnya, `createTransaction`) memanggil `requireAuth()` untuk memastikan pengguna terautentikasi dan memberikan otorisasi pada `tenant_id` tertentu.

---

## 📈 Detail Implementasi Fitur

### 1. Transaksi & Revert Saldo
Ketika transaksi dibuat atau dihapus, saldo dompet terkait diperbarui secara otomatis dalam transaksi Prisma untuk memastikan atomisitas. Jika transaksi terhubung ke **Target Keuangan**, menghapusnya juga akan mengembalikan jumlah saldo yang tersimpan pada target tersebut.

### 2. Statistik
Halaman statistik menggunakan **Recharts** untuk menampilkan data. Data diagregasi di server menggunakan fungsi `groupBy` dan `_sum` milik Prisma, kemudian diteruskan ke komponen grafik di sisi klien.

### 3. Setup Dompet
Pengguna dapat melakukan pengaturan saldo awal satu kali untuk dompet default mereka (CASH, BANK, E-WALLET) melalui halaman profil. Setelah saldo lebih besar dari nol, opsi pengaturan akan dikunci untuk mencegah reset yang tidak disengaja.

---

## 🧪 Strategi Pengujian (Testing)

Proyek ini mengimplementasikan rangkaian pengujian E2E yang komprehensif menggunakan **Playwright**:
-   **Alur Autentikasi**: Menguji login, registrasi, dan logout.
-   **Operasi CRUD**: Memverifikasi bahwa transaksi, kategori, dan target dikelola dengan benar.
-   **Responsivitas**: Memastikan UI bekerja dengan sempurna pada viewport seluler.
-   **Penanganan Kesalahan**: Menguji validasi formulir dan pengalihan akses yang tidak sah.

---

## 🚀 Rencana Pengembangan Masa Depan
-   [ ] Dukungan untuk transaksi berulang.
-   [ ] Ekspor data ke CSV/PDF.
-   [ ] Konversi mata uang real-time.
-   [ ] Notifikasi Push di seluler.
