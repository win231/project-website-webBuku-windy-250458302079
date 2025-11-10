# Quick Setup Commands

## 1. Setup Database MySQL (jalankan di MySQL)
```sql
CREATE DATABASE webfilm;
```

## 2. Update .env (edit file .env)
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/webfilm"
NEXTAUTH_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Generate Prisma Client & Migrate Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 4. Run Application
```bash
npm run dev
```

## Test Flow:
1. Buka: http://localhost:3000
2. Klik salah satu buku
3. Di halaman detail, klik "Login"
4. Klik "daftar akun baru"
5. Isi form registrasi
6. Login dengan akun yang baru dibuat
7. Scroll ke bawah di halaman detail buku
8. Tulis komentar dan klik "Kirim Komentar"
9. Komentar akan muncul dan bisa dihapus

## Database Tools:
```bash
# Melihat database dengan GUI
npx prisma studio

# Reset database (hati-hati, menghapus semua data!)
npx prisma migrate reset

# Melihat status migrasi
npx prisma migrate status
```

## Troubleshooting:
```bash
# Jika error "Can't reach database server"
# 1. Pastikan MySQL service running
# 2. Check Task Manager -> Services -> MySQL

# Jika error saat migrate
rm -rf prisma/migrations  # atau hapus folder migrations manual
npx prisma migrate dev --name init

# Reinstall dependencies
rm -rf node_modules
npm install
```
