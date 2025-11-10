import ListBuku from "./components/ListBuku";
import Search from "./components/Search";
import Navbar from "./components/Navbar";

export default async function Home() {
  const res = await fetch(
    "https://openlibrary.org/subjects/fantasy.json?limit=12",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Gagal ambil data buku!");
  }

  const data = await res.json();

  return (
    <main className="relative mx-auto max-w-7xl px-6 py-10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-indigo-400/30 blob" />
      <div className="pointer-events-none absolute top-24 -right-10 h-36 w-36 rounded-full bg-fuchsia-400/30 blob" style={{ animationDelay: '2s' }} />

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          <span className="bg-linear-to-r from-indigo-700 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">
            📚 Koleksi Buku Fantasy
          </span>
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Jelajahi cerita-cerita penuh imajinasi. Cari, temukan, dan nikmati rekomendasi buku fantasy pilihan.
        </p>
      </section>

      {/* Search panel */}
      <section className="glass rounded-2xl p-4 sm:p-5">
        <Search initialBooks={data.works} />
      </section>

      {/* Recommendations */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-indigo-800">Rekomendasi</h2>
        </div>
        <ListBuku books={data.works} />
      </section>
    </main>
  );
}
