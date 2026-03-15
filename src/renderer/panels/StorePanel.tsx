export function StorePanel() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-black/20 backdrop-blur-md">
      <div className="h-16 w-16 grid place-items-center rounded-2xl bg-white/[0.03] border border-white/5 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/15">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white/50">Boutique</h2>
      <p className="mt-2 text-sm text-white/20 max-w-xs">
        Skins, cosmétiques et objets exclusifs. Bientôt disponible.
      </p>
      <div className="mt-5 px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-300/70 text-[11px] font-medium">
        Prochainement
      </div>
    </div>
  );
}
