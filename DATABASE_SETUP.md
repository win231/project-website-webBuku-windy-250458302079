# Setup Database untuk Fitur Komentar

## Langkah-langkah Setup:

### 1. Install MySQL
Pastikan MySQL sudah terinstall di komputer Anda. Jika belum, download dari: https://dev.mysql.com/downloads/installer/

### 2. Buat Database
Buka MySQL Command Line atau MySQL Workbench, lalu jalankan:

```sql
CREATE DATABASE webfilm;
```

### 3. Update Konfigurasi Database
Edit file `.env` dan sesuaikan dengan kredensial MySQL Anda:

```env
DATABASE_URL="mysql://username:password@localhost:3306/webfilm"
```

Ganti:
- `username` dengan username MySQL Anda (default: root)
- `password` dengan password MySQL Anda

### 4. Generate Prisma Client
Jalankan perintah berikut untuk generate Prisma client:

```bash
npx prisma generate
```

### 5. Jalankan Migrasi Database
Jalankan perintah berikut untuk membuat tabel di database:

```bash
npx prisma migrate dev --name init
```

Perintah ini akan membuat tabel `User` dan `Comment` di database.

### 6. (Opsional) Lihat Database dengan Prisma Studio
Untuk melihat data di database dengan GUI:

```bash
npx prisma studio
```

### 7. Jalankan Aplikasi
```bash
npm run dev
```

## Fitur yang Tersedia:

### 1. Autentikasi User
- **Register**: `/auth/register` - Daftar akun baru
- **Login**: `/auth/login` - Login ke akun yang sudah ada
- **Logout**: Tombol logout di navbar (setelah login)

### 2. Komentar
- User harus login untuk bisa berkomentar
- Setiap user hanya bisa menghapus komentarnya sendiri
- Komentar ditampilkan di halaman detail buku (`/buku/[id]`)
- Komentar tersimpan per buku (berdasarkan bookId dari OpenLibrary)

## Struktur Database:

### Tabel User
- id (String, primary key)
- name (String)
- email (String, unique)
- password (String, hashed)
- createdAt (DateTime)
- updatedAt (DateTime)

### Tabel Comment
- id (String, primary key)
- content (Text)
- bookId (String) - ID buku dari OpenLibrary
- userId (String, foreign key ke User)
- createdAt (DateTime)
- updatedAt (DateTime)

## Troubleshooting:

### Error: Can't connect to MySQL server
- Pastikan MySQL service sudah berjalan
- Cek username, password, dan port di `.env`

### Error: Unknown database 'webfilm'
- Jalankan `CREATE DATABASE webfilm;` di MySQL

### Error: P1001 - Can't reach database server
- Pastikan MySQL berjalan di port 3306
- Cek firewall atau antivirus yang mungkin memblokir koneksi

### Error saat migrate
- Hapus folder `prisma/migrations` jika ada
- Jalankan ulang `npx prisma migrate dev --name init`

## Keamanan:

⚠️ **PENTING untuk Production:**
1. Ganti `NEXTAUTH_SECRET` di `.env` dengan string random yang aman
2. Gunakan password MySQL yang kuat
3. Jangan commit file `.env` ke git
4. Aktifkan SSL untuk koneksi database di production
