"use client";
import Image from "next/image";
import Link from "next/link";

const ListBuku = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">Tidak ada data buku 😢</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 justify-items-center">
  {books.map((book, idx) => {
        const coverId = book.cover_id ?? book.cover_i;
        // Prefer an edition (books) when available so the detail page can fetch richer data
        const editionId = book.cover_edition_key ?? (Array.isArray(book.edition_key) ? book.edition_key[0] : null);
        const worksKey = book.key; // e.g. "/works/OL123W"
        const preferredPath = editionId ? `/books/${editionId}` : worksKey ?? null;

        const title = book.title ?? book.title_suggest ?? "Untitled";
        const author =
          book.authors?.[0]?.name ?? (book.author_name ? book.author_name[0] : "Anonim");
        const imgSrc = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : "https://placehold.co/300x400?text=No+Cover";
        const slug = preferredPath ? (preferredPath.startsWith("/") ? preferredPath.slice(1) : preferredPath).replaceAll("/", "-") : null;

        return (
          <div
            key={preferredPath ?? `book-${idx}`}
            className="group relative w-[220px] sm:w-60 md:w-[260px]"
          >
            {slug ? (
              <Link href={`/buku/${slug}`} className="block">
                <article className="relative rounded-xl p-4 bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md hover:-translate-y-1 transition-transform duration-300 w-full">
                  <div
                    className="relative w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-black/10"
                    style={{ aspectRatio: "2 / 3" }}
                  >
                    <Image
                      src={imgSrc}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, (max-width: 1024px) 260px, 260px"
                    />
                  </div>
                  <h2 className="font-semibold mt-3 text-indigo-900 truncate" title={title}>
                    {title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-indigo-200">
                      {author}
                    </span>
                  </div>
                  {/* subtle gradient underline on hover */}
                  <div className="absolute inset-x-6 -bottom-px h-px bg-linear-to-r from-transparent via-indigo-300/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </article>
              </Link>
            ) : (
              <article className="relative rounded-xl p-4 bg-white shadow-sm ring-1 ring-black/5 w-full">
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-black/10"
                  style={{ aspectRatio: "2 / 3" }}
                >
                  <Image
                    src={imgSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, (max-width: 1024px) 260px, 260px"
                  />
                </div>
                <h2 className="font-semibold mt-3 text-indigo-900 truncate" title={title}>
                  {title}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-indigo-200">
                    {author}
                  </span>
                </div>
              </article>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListBuku;
