# mymoney 💰

**mymoney** adalah aplikasi manajemen keuangan full-stack modern yang dibangun dengan Next.js 14. Aplikasi ini membantu pengguna melacak pendapatan, pengeluaran, menetapkan target keuangan, dan memvisualisasikan kesehatan finansial mereka dengan grafik yang intuitif dan antarmuka pengguna yang premium.

## ✨ Fitur Utama

- **Dashboard**: Ringkasan total saldo, pendapatan, dan pengeluaran dengan akses cepat ke transaksi terbaru.
- **Manajemen Transaksi**: Operasi CRUD lengkap untuk pendapatan dan pengeluaran dengan dukungan dompet dan kategori.
- **Target Keuangan (Goals)**: Tetapkan target tabungan, lacak kemajuan dengan progress bar, dan kelola transaksi khusus target.
- **Statistik Lanjutan**: Visualisasikan tren keuangan bulanan/tahunan menggunakan grafik interaktif.
- **Dukungan Multi-Dompet**: Kelola beberapa akun (Tunai, Bank, E-Wallet) dengan pengaturan saldo awal.
- **Kategori Dinamis**: Kategorikan pengeluaran Anda dengan ikon kustom dan tipe kategori.
- **Keamanan**: Sistem autentikasi yang kuat dengan hashing password dan manajemen sesi.
- **Multi-Tenancy**: Isolasi data lengkap antar pengguna melalui `tenant_id`.
- **Desain Responsif**: Dioptimalkan untuk perangkat desktop dan seluler dengan estetika "glassmorphism" yang premium.

## 🚀 Teknologi

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & Vanilla CSS
- **Validasi**: [Zod](https://zod.dev/)
- **Grafik**: [Recharts](https://recharts.org/)
- **Autentikasi**: [Jose](https://github.com/panva/jose) (JWT/Cookies)
- **Pengujian**: [Playwright](https://playwright.dev/) (E2E)

## 🛠️ Cara Memulai

### Prasyarat

- Node.js 18.x atau versi terbaru
- Instansi database PostgreSQL

### Instalasi

1.  **Clone repositori**:

    ```bash
    git clone https://github.com/AlfinurFitraWijayaR/mymoney.git
    cd mymoney
    ```

2.  **Instal dependensi**:

    ```bash
    npm install
    ```

3.  **Variabel Lingkungan (Environment Variables)**:
    Buat file `.env` di direktori root dan tambahkan baris berikut:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mymoney"
    JWT_SECRET="kunci_rahasia_anda"
    ```

4.  **Setup Database**:

    ```bash
    npm run db:migrate
    npm run db:generate
    npm run db:seed
    ```

5.  **Jalankan aplikasi**:
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🧪 Pengujian (Testing)

Proyek ini menggunakan Playwright untuk pengujian end-to-end.

```bash
# Jalankan semua tes
npm run test:e2e

# Buka UI Playwright
npm run test:e2e:ui

# Debug tes
npm run test:e2e:debug
```

## 📜 Skrip

- `npm run dev`: Menjalankan server pengembangan.
- `npm run build`: Membangun aplikasi untuk produksi.
- `npm run db:seed`: Mengisi database dengan kategori bawaan.
- `npm run db:studio`: Membuka Prisma Studio untuk melihat data.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.
