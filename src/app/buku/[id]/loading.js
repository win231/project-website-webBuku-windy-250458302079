export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] gap-6 items-start">
        <div className="glass rounded-2xl p-3">
          <div className="h-[440px] rounded-xl bg-slate-200 animate-pulse" />
          <div className="mt-4 flex gap-3">
            <div className="h-10 w-40 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-10 w-28 rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-10 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-6 w-1/2 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-24 w-full bg-slate-200 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
