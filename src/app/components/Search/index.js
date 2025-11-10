"use client";
import { useState } from "react";
import ListBuku from "../ListBuku";

const Search = ({ initialBooks = [] }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(initialBooks);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchCount, setSearchCount] = useState(0);

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query.trim()) {
            setResults(initialBooks);
            setSearchCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=24`
            );
            if (!res.ok) throw new Error("Gagal mencari buku");
            const data = await res.json();

            const mapped = data.docs.map((doc) => ({
                key: doc.key ?? doc.cover_edition_key ?? doc.edition_key?.[0],
                cover_id: doc.cover_i,
                title: doc.title,
                authors: doc.author_name ? doc.author_name.map((n) => ({ name: n })) : [],
            }));

            setResults(mapped);
            setSearchCount(data.numFound || mapped.length);
        } catch (err) {
            setError(err.message || "Terjadi kesalahan");
            setSearchCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setQuery("");
        setResults(initialBooks);
        setError(null);
        setSearchCount(0);
    };

    return (
        <div className="mb-8">
            {/* Search Header */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                    🔍 <span className="bg-linear-to-r from-indigo-600 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">Cari Buku</span>
                </h2>
                <p className="text-sm text-slate-600">Temukan buku favorit Anda dari jutaan koleksi</p>
            </div>

            {/* Search Form  */}
            <form onSubmit={handleSearch} className="relative mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Input with gradient border */}
                    <div className="flex-1 relative group">
                        <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-400 via-fuchsia-400 to-sky-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                🔎
                            </span>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari judul, penulis, ISBN, atau kata kunci..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400 transition-all duration-200 text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3.5 bg-linear-to-r from-indigo-600 via-fuchsia-600 to-sky-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="hidden sm:inline">Mencari...</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Cari</span>
                                </>
                            )}
                        </button>
                        
                        {query && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-3.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center gap-2"
                                title="Reset pencarian"
                            >
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Pesan Search */}
            <div className="min-h-6 mb-4">
                {loading && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-indigo-50 via-fuchsia-50 to-sky-50 border border-indigo-200">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <p className="text-sm font-medium text-indigo-800">Sedang mencari buku untuk Anda...</p>
                    </div>
                )}
                
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                        <span className="text-xl">⚠️</span>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                            <p className="text-xs text-red-600 mt-0.5">Silakan coba lagi dengan kata kunci yang berbeda</p>
                        </div>
                    </div>
                )}

                {!loading && !error && query && searchCount > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">✨</span>
                            <div>
                                <p className="text-sm font-semibold text-emerald-800">
                                    Ditemukan {searchCount.toLocaleString()} hasil
                                </p>
                                <p className="text-xs text-emerald-600">untuk "{query}"</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200">
                            {results.length} ditampilkan
                        </span>
                    </div>
                )}

                {!loading && !error && query && searchCount === 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-xl">🤔</span>
                        <div>
                            <p className="text-sm font-medium text-amber-800">Tidak ada hasil ditemukan</p>
                            <p className="text-xs text-amber-600">Coba gunakan kata kunci yang berbeda atau lebih umum</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Hasilnya */}
            <ListBuku books={results} />
        </div>
    );
};

export default Search;
