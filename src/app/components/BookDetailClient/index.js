"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import DetailPage from "@/app/pages/DetailPage";
import CommentSection from "@/app/components/CommentSection";

export default function BookDetailClient({ book, bookKey }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      {/* Navbar dengan info user */}
      <header className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white/90 px-5 py-3 sm:py-4 shadow">
        <button
          onClick={() => router.push("/")}
          className="text-base font-semibold text-indigo-700 hover:text-indigo-900"
        >
          ← Beranda
        </button>
        <div className="text-base sm:text-lg font-semibold text-slate-800">Detail Buku</div>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">
                Halo, {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <DetailPage book={book} />

      {/* Section Komentar */}
      <CommentSection bookId={bookKey} />
    </>
  );
}
