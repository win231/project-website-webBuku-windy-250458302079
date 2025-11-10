"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
      <div className="text-xl font-bold bg-linear-to-r from-indigo-700 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">
        📚 WebBuku
      </div>
      
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-gray-700 hidden sm:inline">
              Halo, <span className="font-semibold">{session.user.name}</span>
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-4 py-2 text-sm font-medium text-indigo-700 hover:text-indigo-900 border border-indigo-300 hover:border-indigo-400 rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Daftar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
