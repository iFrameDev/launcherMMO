import { useToast } from '../hooks/useToast';

type GamePanelProps = {
  gamePath: string | null;
};

export function GamePanel({ gamePath }: GamePanelProps) {
  const { showToast } = useToast();

  const handlePlay = async () => {
    try {
      await window.launcher.launch();
      showToast('Jeu lancé !', 'success');
    } catch (e: any) {
      showToast(e?.message ?? 'Impossible de lancer le jeu', 'error');
    }
  };

  return (
    <div className="h-full relative">
      {/* Full screen artwork */}
      <div className="absolute inset-0 bg-cover bg-center brightness-[1.8]" style={{ backgroundImage: "url('./images/image.png')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-800/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/30 to-transparent" />

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-end p-8 pb-10">
        {/* Game title & info */}
        <div className="flex items-end justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/60">2,975 joueurs en ligne</span>
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight leading-none">
              SOCIAL LIFE
            </h1>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md">
              La simulation de vie multijoueur où vos choix façonnent une ville vivante. Métiers, relations, économie et événements en temps réel.
            </p>

            {/* News ticker */}
            <div className="mt-6 flex items-center gap-3">
              <span className="px-2 py-1 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-semibold uppercase">Nouveau</span>
              <span className="text-xs text-white/60">Patch 0.2 — Nouveaux métiers disponibles</span>
            </div>
          </div>

          {/* Play button */}
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={handlePlay}
              disabled={!gamePath}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-70 disabled:cursor-not-allowed px-12 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/25 transition-all duration-200 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              JOUER
            </button>
            {!gamePath && (
              <span className="text-[10px] text-white/30">Configurez le chemin dans Paramètres</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
