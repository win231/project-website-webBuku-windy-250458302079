import { notFound } from "next/navigation";
import BookDetailClient from "@/app/components/BookDetailClient";
import BookErrorUI from "@/app/components/BookErrorUI";

export const dynamic = "force-dynamic";

function decodeSlugToPath(slug) {
  if (!slug) return null;
  const [type, rest] = slug.split("-", 2);
  if (!type || !rest) return null;
  if (type !== "works" && type !== "books") return null;
  return `/${type}/${rest}`;
}

async function fetchJSON(url, retries = 3, delay = 1000, timeout = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const res = await fetch(url, { 
        cache: "no-store",
        next: { revalidate: 0 },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        return res.json();
      }
      
      // Jika 503 atau 429 (rate limit), coba lagi
      if (res.status === 503 || res.status === 429) {
        if (i < retries - 1) {
          console.log(`Retry ${i + 1}/${retries} for ${url} (status: ${res.status})`);
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      
      throw new Error(`Fetch failed: ${res.status}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Request timeout after ${timeout}ms`);
      }
      
      if (i === retries - 1) {
        throw error;
      }
      console.log(`Retry ${i + 1}/${retries} due to error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

function mapLanguageCodeToName(code) {
  const map = {
    eng: "English",
    en: "English",
    ind: "Indonesian",
    ina: "Indonesian",
    id: "Indonesian",
    msa: "Malay",
    spa: "Spanish",
    es: "Spanish",
    fra: "French",
    fre: "French",
    fr: "French",
    deu: "German",
    ger: "German",
    de: "German",
    ita: "Italian",
    it: "Italian",
    por: "Portuguese",
    pt: "Portuguese",
    nld: "Dutch",
    dut: "Dutch",
    nl: "Dutch",
    rus: "Russian",
    ru: "Russian",
    jpn: "Japanese",
    ja: "Japanese",
    kor: "Korean",
    ko: "Korean",
    zho: "Chinese",
    chi: "Chinese",
    zh: "Chinese",
    hin: "Hindi",
    hi: "Hindi",
    ara: "Arabic",
    ar: "Arabic",
    tur: "Turkish",
    tr: "Turkish",
    vie: "Vietnamese",
    vi: "Vietnamese",
    tha: "Thai",
    th: "Thai",
  };
  return map[code?.toLowerCase?.()] || code?.toUpperCase?.() || code || "";
}

function getDescription(desc) {
  if (!desc) return null;
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc.value) return desc.value;
  return null;
}

function coverUrlFromDetails(details) {
  const coverId = details?.covers?.[0];
  if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  return "https://placehold.co/600x800?text=No+Cover";
}

async function getAuthors(details) {
  const raw = Array.isArray(details?.authors) ? details.authors : [];
  const keys = raw
    .map((a) => a?.author?.key || a?.key)
    .filter(Boolean)
    .slice(0, 6);

  if (!keys.length) return [];

  const authors = await Promise.all(
    keys.map(async (k) => {
      try {
        const data = await fetchJSON(`https://openlibrary.org${k}.json`);
        return { key: k, name: data?.name ?? "Anonim" };
      } catch {
        return { key: k, name: "Anonim" };
      }
    })
  );
  return authors;
}

export default async function BookDetail({ params }) {
  const { id: slug } = await params;
  const path = decodeSlugToPath(slug);

  if (!path) {
    return notFound();
  }

  const apiUrl = `https://openlibrary.org${path}.json`;
  
  let details;
  try {
    details = await fetchJSON(apiUrl);
  } catch (error) {
    console.error("Error fetching book details:", error);
    return <BookErrorUI message={`API Error: ${error.message}`} />;
  }

  const isWork = path.startsWith("/works/");
  const title = details?.title ?? "Untitled";
  const description = getDescription(details?.description) ?? "Tidak ada deskripsi.";
  
  let subjects = details?.subjects || [];
  if (!Array.isArray(subjects)) subjects = [];
  subjects = subjects
    .filter(s => typeof s === 'string' || (s && typeof s === 'object'))
    .map(s => typeof s === 'string' ? s : (s?.name || String(s)))
    .slice(0, 12);
  
  const firstPublish =
    details?.first_publish_date ||
    details?.publish_date ||
    details?.created?.value?.slice(0, 10);
  const numberOfPages = details?.number_of_pages || details?.pagination || null;

  const authors = await getAuthors(details);
  const coverUrl = coverUrlFromDetails(details);
  const externalHref = `https://openlibrary.org${path}`;

  // Data Detail tambahan untuk edition/work atau buku
  const publishers = Array.isArray(details?.publishers)
    ? details.publishers
    : details?.publishers
    ? [details.publishers]
    : [];

  const publishPlaces = Array.isArray(details?.publish_places)
    ? details.publish_places
    : details?.publish_places
    ? [details.publish_places]
    : [];

  const series = Array.isArray(details?.series)
    ? details.series
    : details?.series
    ? [details.series]
    : [];

  const languages = Array.isArray(details?.languages)
    ? details.languages
        .map((l) => (typeof l?.key === "string" ? l.key.split("/").pop() : null))
        .filter(Boolean)
        .map((code) => mapLanguageCodeToName(code))
    : [];

  const isbn10 = Array.isArray(details?.isbn_10) ? details.isbn_10 : [];
  const isbn13 = Array.isArray(details?.isbn_13) ? details.isbn_13 : [];

  // Data Detail tambahan untuk edition/work atau buku
  const firstSentence = getDescription(details?.first_sentence);
  const notes = getDescription(details?.notes);
  const copyrightDate = details?.copyright_date || null;
  const physicalFormat = details?.physical_format || null;
  const physicalDimensions = details?.physical_dimensions || null;
  const weight = details?.weight || null;
  const editionName = details?.edition_name || null;
  const lccn = Array.isArray(details?.lccn) ? details.lccn : details?.lccn ? [details.lccn] : [];
  const oclc = Array.isArray(details?.oclc_numbers)
    ? details.oclc_numbers
    : details?.oclc_numbers
    ? [details.oclc_numbers]
    : [];
  const dewey = Array.isArray(details?.dewey_decimal_class)
    ? details.dewey_decimal_class
    : details?.dewey_decimal_class
    ? [details.dewey_decimal_class]
    : [];
  const contributors = Array.isArray(details?.contributors) ? details.contributors : [];
  const identifiers = details?.identifiers || {};

  const book = {
    title,
    subtitle: details?.subtitle || null,
    description,
    subjects,
    first_publish_year: firstPublish,
    number_of_pages: numberOfPages,
    covers: details?.covers,
    cover_id: Array.isArray(details?.covers) ? details.covers[0] : undefined,
    authors: authors.map((a) => ({ name: a.name })),
    // extra fields
    publish_date: details?.publish_date || details?.first_publish_date || null,
    publishers,
    publish_places: publishPlaces,
    series,
    languages,
    isbn_10: isbn10,
    isbn_13: isbn13,
    first_sentence: firstSentence,
    notes,
    copyright_date: copyrightDate,
    physical_format: physicalFormat,
    physical_dimensions: physicalDimensions,
    weight,
    edition_name: editionName,
    lccn,
    oclc_numbers: oclc,
    dewey_decimal_class: dewey,
    contributors,
    identifiers,
    by_statement: details?.by_statement || null,
    key: details?.key || path,
    openlibrary_url: externalHref,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <BookDetailClient book={book} bookKey={path} />
    </main>
  );
}
