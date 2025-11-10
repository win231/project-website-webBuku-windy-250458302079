"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

// Reusable, clean detail layout without weird overlays or distorted images
// Contract:
// - Props: { book?: any }
// - Accepts OpenLibrary shapes: works/editions/search results
// - Shows cover (keeps aspect ratio), title, authors, description, and basic metadata
export default function DetailPage({ book }) {
    // Defensive extraction to support various OpenLibrary payloads
    const title =
        book?.title ||
        book?.title_suggest ||
        book?.display_title ||
        "Judul tidak tersedia";

    const authors =
        book?.authors?.map((a) => a?.name).filter(Boolean) ||
        (Array.isArray(book?.author_name) ? book.author_name : null) ||
        (book?.by_statement ? [book.by_statement] : null) ||
        [];

    const coverId =
        (Array.isArray(book?.covers) ? book.covers[0] : null) ||
        book?.cover_id ||
        book?.cover_i ||
        null;

    // Build initial image src with fallback logic
    const placeholderImg = "https://placehold.co/600x900?text=No+Cover";
    const initialImgSrc = useMemo(() => {
        if (!coverId) return placeholderImg;
        return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }, [coverId]);

    const [imgSrc, setImgSrc] = useState(initialImgSrc);
    const [imgError, setImgError] = useState(false);

    // Handle image error with proper fallback
    const handleImageError = () => {
        if (!imgError) {
            setImgError(true);
            setImgSrc(placeholderImg);
        }
    };

    const rawDesc =
        (typeof book?.description === "string"
            ? book.description
            : book?.description?.value) ||
        book?.first_sentence ||
        "Belum ada deskripsi untuk buku ini.";

    const firstPublish = book?.first_publish_year || book?.publish_year?.[0] || book?.publish_date || null;
    const pages = book?.number_of_pages || book?.pagination || null;
    
    // Ensure subjects is always an array of strings
    let subjects = book?.subjects || book?.subject || [];
    if (!Array.isArray(subjects)) subjects = [];
    subjects = subjects
        .filter(s => s != null && s !== '')
        .map(s => typeof s === 'string' ? s : (s?.name || String(s)))
        .slice(0, 12);

    // Color variants for subjects and badges (safelisted by being literal strings)
    const colorClasses = [
        "bg-indigo-100 text-indigo-800 ring-indigo-200",
        "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
        "bg-sky-100 text-sky-800 ring-sky-200",
        "bg-amber-100 text-amber-800 ring-amber-200",
        "bg-emerald-100 text-emerald-800 ring-emerald-200",
        "bg-violet-100 text-violet-800 ring-violet-200",
        "bg-rose-100 text-rose-800 ring-rose-200",
        "bg-teal-100 text-teal-800 ring-teal-200",
        "bg-cyan-100 text-cyan-800 ring-cyan-200",
        "bg-pink-100 text-pink-800 ring-pink-200",
        "bg-lime-100 text-lime-800 ring-lime-200",
        "bg-purple-100 text-purple-800 ring-purple-200",
    ];

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <section className="grid gap-8 md:grid-cols-[360px,1fr]">
                {/* Cover - keep aspect ratio, never stretched */}
                <div className="md:justify-self-center">
                    <div className="mx-auto w-full max-w-[360px]">
                        <div className="rounded-2xl p-1.5 bg-linear-to-br from-indigo-200/60 via-fuchsia-200/40 to-sky-200/50">
                            <div
                                className="relative w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
                                style={{ aspectRatio: "2 / 3", minHeight: "450px" }}
                            >
                                <Image
                                    src={imgSrc}
                                    alt={title}
                                    fill
                                    priority
                                    className="object-contain p-2"
                                    sizes="(max-width: 768px) 90vw, 360px"
                                    onError={handleImageError}
                                />
                                {(book?.physical_format || pages) && (
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {book?.physical_format && (
                                            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
                                                {book.physical_format}
                                            </span>
                                        )}
                                        {pages && (
                                            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
                                                {pages} hlm
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Subjects / Tags - Always colorful */}
                    {subjects?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {subjects.map((s, i) => {
                                const colorClass = colorClasses[i % colorClasses.length];
                                return (
                                    <span
                                        key={`subject-${i}-${s}`}
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClass}`}
                                    >
                                        {s}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                        {book?.subtitle && (
                            <p className="mt-1 text-base text-slate-600">{book.subtitle}</p>
                        )}
                    {authors?.length > 0 && (
                        <p className="mt-2 text-slate-600">
                            Oleh: <span className="font-medium">{authors.join(", ")}</span>
                        </p>
                    )}
                        {book?.by_statement && (
                            <p className="mt-1 text-sm text-slate-500">{book.by_statement}</p>
                        )}

                    {/* Quick facts row - colorful badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {firstPublish && (
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[0]}`}>
                                📅 Tahun {firstPublish}
                            </span>
                        )}
                        {Array.isArray(book?.languages) && book.languages[0] && (
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[1]}`}>
                                🌐 {book.languages[0]}
                            </span>
                        )}
                        {pages && (
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[2]}`}>
                                📖 {pages} halaman
                            </span>
                        )}
                        {Array.isArray(book?.publishers) && book.publishers[0] && (
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[3]}`}>
                                🏢 {book.publishers[0]}
                            </span>
                        )}
                        {book?.physical_format && (
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[4]}`}>
                                📦 {book.physical_format}
                            </span>
                        )}
                    </div>

                    {/* Meta */}
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {firstPublish && (
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs text-slate-500">Tahun Terbit</p>
                                <p className="text-sm font-medium text-slate-800">{firstPublish}</p>
                            </div>
                        )}
                        {pages && (
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs text-slate-500">Jumlah Halaman</p>
                                <p className="text-sm font-medium text-slate-800">{pages}</p>
                            </div>
                        )}
                    </div>

                    {/* First sentence highlight */}
                    {book?.first_sentence && (
                        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-sm text-slate-500 mb-1">Kalimat Pertama</p>
                            <blockquote className="text-slate-800 italic leading-relaxed">“{book.first_sentence}”</blockquote>
                        </div>
                    )}

                    {/* Description - plain, no overlay */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-slate-900">Deskripsi</h2>
                        <p className="mt-2 whitespace-pre-line text-slate-700 leading-relaxed">
                            {typeof rawDesc === "string" ? rawDesc : JSON.stringify(rawDesc)}
                        </p>
                    </div>

                    {/* Extra details */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-slate-900">Informasi Lengkap</h2>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {book?.key && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Open Library Key</p>
                                    <p className="text-sm font-medium text-slate-800">{book.key}</p>
                                </div>
                            )}
                            {book?.publish_date && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Publish Date</p>
                                    <p className="text-sm font-medium text-slate-800">{book.publish_date}</p>
                                </div>
                            )}
                            {book?.languages?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Language</p>
                                    <p className="text-sm font-medium text-slate-800">{book.languages.join(", ")}</p>
                                </div>
                            )}
                            {book?.publishers?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Publisher</p>
                                    <p className="text-sm font-medium text-slate-800">{book.publishers.join(", ")}</p>
                                </div>
                            )}
                            {book?.number_of_pages && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Pages</p>
                                    <p className="text-sm font-medium text-slate-800">{book.number_of_pages}</p>
                                </div>
                            )}
                            {book?.publish_places?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Published In</p>
                                    <p className="text-sm font-medium text-slate-800">{book.publish_places.join(", ")}</p>
                                </div>
                            )}
                            {book?.physical_format && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Format</p>
                                    <p className="text-sm font-medium text-slate-800">{book.physical_format}</p>
                                </div>
                            )}
                            {book?.physical_dimensions && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Dimensions</p>
                                    <p className="text-sm font-medium text-slate-800">{book.physical_dimensions}</p>
                                </div>
                            )}
                            {book?.weight && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Weight</p>
                                    <p className="text-sm font-medium text-slate-800">{book.weight}</p>
                                </div>
                            )}
                            {book?.series?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Series</p>
                                    <p className="text-sm font-medium text-slate-800">{book.series.join(", ")}</p>
                                </div>
                            )}
                            {book?.edition_name && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Edition</p>
                                    <p className="text-sm font-medium text-slate-800">{book.edition_name}</p>
                                </div>
                            )}
                            {book?.copyright_date && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Copyright Date</p>
                                    <p className="text-sm font-medium text-slate-800">{book.copyright_date}</p>
                                </div>
                            )}
                            {book?.isbn_10?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">ISBN-10</p>
                                    <p className="text-sm font-medium text-slate-800">{book.isbn_10.join(", ")}</p>
                                </div>
                            )}
                            {book?.isbn_13?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">ISBN-13</p>
                                    <p className="text-sm font-medium text-slate-800">{book.isbn_13.join(", ")}</p>
                                </div>
                            )}
                            {book?.lccn?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">LCCN</p>
                                    <p className="text-sm font-medium text-slate-800">{book.lccn.join(", ")}</p>
                                </div>
                            )}
                            {book?.oclc_numbers?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">OCLC</p>
                                    <p className="text-sm font-medium text-slate-800">{book.oclc_numbers.join(", ")}</p>
                                </div>
                            )}
                            {book?.dewey_decimal_class?.length > 0 && (
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs text-slate-500">Dewey</p>
                                    <p className="text-sm font-medium text-slate-800">{book.dewey_decimal_class.join(", ")}</p>
                                </div>
                            )}
                        </div>
                        {/* Contributors / Identifiers */}
                        {(book?.contributors?.length > 0 || (book?.identifiers && Object.keys(book.identifiers).length > 0)) && (
                            <div className="mt-3 grid grid-cols-1 gap-3">
                                {book?.contributors?.length > 0 && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Contributors</p>
                                        <ul className="mt-1 list-disc pl-5 text-sm text-slate-800">
                                            {book.contributors.map((c, idx) => (
                                                <li key={idx}>{c?.name || "Unknown"}{c?.role ? ` — ${c.role}` : ""}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {book?.identifiers && Object.keys(book.identifiers).length > 0 && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Identifiers</p>
                                        <div className="mt-1 text-sm text-slate-800">
                                            {Object.entries(book.identifiers).map(([k, v]) => (
                                                <div key={k} className="flex gap-2">
                                                    <span className="min-w-28 capitalize text-slate-500">{k.replace(/_/g, " ")}</span>
                                                    <span>{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {book?.openlibrary_url && (
                                            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                                                <p className="text-xs text-slate-500">Open Library URL</p>
                                                <a
                                                    className="text-sm font-medium text-indigo-700 hover:underline break-all"
                                                    href={book.openlibrary_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {book.openlibrary_url}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Call to action */}
                    <div className="mt-6 flex gap-3">
                            <a
                                href={book?.openlibrary_url || "https://openlibrary.org/"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Lihat di OpenLibrary
                        </a>
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </section>

            {/* Empty/Fallback state if no book passed */}
            {!book && (
                <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    Data buku tidak ditemukan. Pastikan komponen ini dipanggil dengan prop "book" dari halaman dinamis.
                </div>
            )}
        </main>
    );
}