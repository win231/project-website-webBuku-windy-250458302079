import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-extrabold mb-2">
        <span className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">Buku tidak ditemukan</span>
      </h1>
      <p className="text-slate-600 mb-6">Coba cari judul lain atau kembali ke halaman utama.</p>
      <Link href="/" className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Kembali</Link>
    </main>
  );
}
