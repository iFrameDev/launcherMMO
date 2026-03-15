export function ProfilePanel() {
  return (
    <div className="h-full p-8 overflow-y-auto bg-black/20 backdrop-blur-md">
      <h2 className="text-2xl font-bold tracking-tight">Profil</h2>
      <p className="mt-1 text-sm text-white/40">Votre compte et identité</p>

      <div className="mt-8 flex items-start gap-6">
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 grid place-items-center ring-2 ring-white/5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">iFrame</h3>
          <p className="text-xs text-white/25 mt-1">Membre depuis octobre 2025</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/10">
              <p className="text-[10px] text-white/30">Niveau</p>
              <p className="text-sm font-bold text-sky-300">4</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-white/30">Heures</p>
              <p className="text-sm font-bold text-white/70">127h</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-white/30">Amis</p>
              <p className="text-sm font-bold text-white/70">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-lg space-y-3">
<button className="w-full text-left rounded-lg border border-red-500/10 bg-red-500/[0.03] hover:bg-red-500/10 p-4 text-sm text-red-400 transition-colors">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
