"use client";

import { useRouter } from "next/navigation";

export default function BookErrorUI({ message }) {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Gagal Memuat Data Buku
          </h2>
          <p className="text-red-600 mb-4">
            {message || "OpenLibrary API sedang tidak tersedia atau terlalu lambat. Silakan coba lagi dalam beberapa saat."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Coba Lagi
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🏠 Kembali ke Home
            </button>
          </div>
          <div className="mt-6 pt-4 border-t border-red-200">
            <p className="text-xs text-gray-600">
              Tip: OpenLibrary kadang mengalami downtime. Coba refresh halaman atau kembali beberapa menit lagi.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
