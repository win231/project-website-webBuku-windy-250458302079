# 🎉 Fitur Komentar Sudah Siap!

## ✅ Yang Sudah Dibuat:

### 1. **Database Schema (Prisma)**
- Tabel `User` untuk menyimpan data pengguna
- Tabel `Comment` untuk menyimpan komentar
- Relasi antar tabel sudah di-setup

### 2. **Autentikasi (NextAuth.js)**
- Login dengan email & password
- Register untuk akun baru
- Session management otomatis
- Password di-hash dengan bcrypt

### 3. **API Routes**
- `/api/auth/register` - Registrasi user baru
- `/api/auth/[...nextauth]` - Login/logout dengan NextAuth
- `/api/comments` - CRUD operations untuk komentar
  - GET: Ambil komentar per buku
  - POST: Tambah komentar baru
  - DELETE: Hapus komentar sendiri

### 4. **UI Components**
- Halaman Login (`/auth/login`)
- Halaman Register (`/auth/register`)
- Comment Section di halaman detail buku
- Navbar dengan info user dan tombol logout

## 🚀 Cara Menjalankan:

### Langkah 1: Setup MySQL Database
```bash
# Buka MySQL dan buat database
CREATE DATABASE webfilm;
```

### Langkah 2: Update file .env
Edit `.env` dan sesuaikan dengan kredensial MySQL Anda:
```env
DATABASE_URL="mysql://root:password@localhost:3306/webfilm"
```
Ganti `root` dan `password` sesuai dengan MySQL Anda.

### Langkah 3: Jalankan Migrasi Database
```bash
npx prisma migrate dev --name init
```

### Langkah 4: Jalankan Aplikasi
```bash
npm run dev
```

### Langkah 5: Buka Browser
```
http://localhost:3000
```

## 📝 Cara Menggunakan:

1. **Buka halaman home** → Pilih buku
2. **Masuk ke detail buku** → Scroll ke bawah untuk lihat section komentar
3. **Klik "Login"** di navbar → Login atau register dulu
4. **Setelah login** → Anda bisa menulis komentar
5. **Komentar Anda** → Bisa dihapus dengan tombol "Hapus"

## 🔒 Keamanan:

- Password di-hash dengan bcryptjs (10 rounds)
- Session menggunakan JWT
- API protected dengan NextAuth session
- User hanya bisa hapus komentarnya sendiri
- Validasi input di client dan server side

## 📁 File Penting:

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js  # NextAuth handler
│   │   │   └── register/route.js       # Register API
│   │   └── comments/route.js           # Comments API
│   ├── auth/
│   │   ├── login/page.js               # Halaman login
│   │   └── register/page.js            # Halaman register
│   ├── components/
│   │   ├── AuthProvider.js             # Session provider
│   │   ├── BookDetailClient/index.js   # Client wrapper
│   │   └── CommentSection/index.js     # Komponen komentar
│   └── buku/[id]/page.js               # Halaman detail buku
├── lib/
│   └── prisma.js                       # Prisma client instance
prisma/
└── schema.prisma                       # Database schema
```

## ⚠️ Troubleshooting:

### Error: Can't connect to database
- Pastikan MySQL service berjalan
- Cek kredensial di `.env` sudah benar
- Pastikan database `webfilm` sudah dibuat

### Error: Module not found
```bash
npm install
```

### Error saat migrate
```bash
# Hapus migrations lama dan buat baru
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### Melihat data di database
```bash
npx prisma studio
```

## 🎨 Fitur Tambahan yang Bisa Ditambahkan:

1. ✏️ Edit komentar
2. ❤️ Like/dislike komentar
3. 💬 Reply ke komentar
4. 🔍 Search komentar
5. 📄 Pagination untuk komentar
6. 🖼️ Avatar user
7. 📧 Email verification
8. 🔐 Password reset
9. 👤 Profile page
10. 🛡️ Admin dashboard

Semoga membantu! 🚀
