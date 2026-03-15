import { useState } from 'react';

const friends = [
  { name: 'Skorgrim', status: 'En jeu — Social Life', online: true },
  { name: 'Ghost', status: 'Hors ligne — il y a 3h', online: false },
  { name: 'boss', status: 'Hors ligne — il y a 2j', online: false },
];

export function FriendsPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const friend = friends.find((f) => f.name === selected);

  return (
    <div className="h-full p-8 overflow-y-auto bg-black/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Amis</h2>
          <p className="mt-1 text-sm text-white/40">
            <span className="text-emerald-400">{friends.filter((f) => f.online).length} en ligne</span> · {friends.length} amis
          </p>
        </div>
        <button className="rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-2 text-xs font-medium transition-colors">
          Ajouter un ami
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-[calc(100%-90px)]">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 space-y-1 overflow-y-auto">
          {friends.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelected(f.name)}
              className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                selected === f.name ? 'bg-sky-500/10 border border-sky-500/15' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400/80 to-blue-600/80 grid place-items-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg></div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black/50 ${f.online ? 'bg-emerald-400' : 'bg-white/15'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">{f.name}</p>
                <p className={`text-[11px] ${f.online ? 'text-emerald-400/70' : 'text-white/25'}`}>{f.status}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] flex flex-col items-center justify-center text-center p-6">
          {friend ? (
            <>
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 grid place-items-center ring-2 ring-white/5 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>
              </div>
              <h3 className="text-lg font-bold">{friend.name}</h3>
              <p className={`text-xs mt-1 ${friend.online ? 'text-emerald-400' : 'text-white/30'}`}>{friend.status}</p>
              <div className="flex gap-2 mt-5">
                <button className="rounded-lg bg-sky-500/10 border border-sky-500/15 hover:bg-sky-500/20 px-4 py-2 text-xs font-medium text-sky-300 transition-colors">
                  Message
                </button>
                <button className="rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-2 text-xs font-medium transition-colors">
                  Inviter
                </button>
              </div>
            </>
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10 mb-3">
                <circle cx="9" cy="7" r="4" /><path d="M3 21a6 6 0 0 1 12 0" />
              </svg>
              <h3 className="text-sm font-medium text-white/30">Sélectionnez un ami</h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
