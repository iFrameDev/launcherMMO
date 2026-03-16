import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';

type GameState = 'loading' | 'not-installed' | 'update-available' | 'ready' | 'downloading' | 'extracting' | 'error';

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export function GamePanel() {
  const { showToast } = useToast();
  const [state, setState] = useState<GameState>('loading');
  const [localVersion, setLocalVersion] = useState<string | null>(null);
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const [installPath, setInstallPath] = useState<string | null>(null);
  const [progress, setProgress] = useState({ percent: 0, speed: 0, transferred: 0, total: 0 });

  // Check game status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  // Listen for download/extract progress
  useEffect(() => {
    window.launcher.onGameProgress((p) => {
      switch (p.stage) {
        case 'downloading':
          setState('downloading');
          setProgress({ percent: p.percent, speed: p.speed, transferred: p.transferred, total: p.total });
          break;
        case 'extracting':
          setState('extracting');
          setProgress((prev) => ({ ...prev, percent: p.percent }));
          break;
        case 'done':
          setState('ready');
          checkStatus();
          showToast('Jeu installé avec succès !', 'success');
          break;
        case 'error':
          setState('error');
          showToast('Erreur: ' + p.message, 'error');
          break;
      }
    });
  }, []);

  async function checkStatus() {
    try {
      const status = await window.launcher.gameStatus();
      setInstallPath(status.installPath);
      setLocalVersion(status.localVersion);
      setRemoteVersion(status.remoteVersion);

      if (!status.installed) {
        setState('not-installed');
      } else if (status.needsUpdate) {
        setState('update-available');
      } else {
        setState('ready');
      }
    } catch {
      setState('error');
    }
  }

  const defaultPath = 'C:\\Games\\Social Life';
  const [selectedPath, setSelectedPath] = useState(defaultPath);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  async function handleInstallClick() {
    setShowInstallPrompt(true);
  }

  async function handleChangePath() {
    const path = await window.launcher.chooseInstallPath();
    if (path) {
      // Ajoute automatiquement le sous-dossier Social Life si pas déjà présent
      if (!path.toLowerCase().endsWith('social life')) {
        setSelectedPath(path.replace(/[\\/]$/, '') + '\\Social Life');
      } else {
        setSelectedPath(path);
      }
    }
  }

  async function handleConfirmInstall() {
    setShowInstallPrompt(false);
    setInstallPath(selectedPath);
    setState('downloading');
    await window.launcher.installGame(selectedPath);
  }

  async function handleUpdate() {
    if (!installPath) return;
    setState('downloading');
    await window.launcher.installGame(installPath);
  }

  async function handlePlay() {
    try {
      await window.launcher.launch();
      showToast('Jeu lancé !', 'success');
    } catch (e: any) {
      showToast(e?.message ?? 'Impossible de lancer le jeu', 'error');
    }
  }

  // Button config based on state
  const buttonConfig = {
    'loading': { label: 'Chargement...', disabled: true, onClick: () => {} },
    'not-installed': { label: 'INSTALLER', disabled: false, onClick: handleInstallClick },
    'update-available': { label: 'METTRE À JOUR', disabled: false, onClick: handleUpdate },
    'ready': { label: 'JOUER', disabled: false, onClick: handlePlay },
    'downloading': { label: 'TÉLÉCHARGEMENT...', disabled: true, onClick: () => {} },
    'extracting': { label: 'INSTALLATION...', disabled: true, onClick: () => {} },
    'error': { label: 'RÉESSAYER', disabled: false, onClick: checkStatus },
  };

  const btn = buttonConfig[state];

  return (
    <div className="h-full relative">
      {/* Full screen artwork */}
      <div className="absolute inset-0 bg-cover bg-center brightness-[1.8]" style={{ backgroundImage: "url('./images/image.png')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-800/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/30 to-transparent" />

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-end p-8 pb-10">
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

            {/* Version info */}
            {localVersion && (
              <p className="mt-3 text-[11px] text-white/25">Version installée : {localVersion}</p>
            )}
          </div>

          {/* Action button + progress */}
          <div className="flex flex-col items-end gap-3 min-w-[200px]">
            <button
              onClick={btn.onClick}
              disabled={btn.disabled}
              className={`rounded-xl px-12 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                state === 'not-installed'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-emerald-500/25 hover:shadow-emerald-500/40'
                  : state === 'update-available'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25 hover:shadow-amber-500/40'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25 hover:shadow-sky-500/40'
              } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {btn.label}
            </button>

            {/* Progress bar */}
            {(state === 'downloading' || state === 'extracting') && (
              <div className="w-full">
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.round(progress.percent)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-white/40">
                    {state === 'downloading'
                      ? `${formatBytes(progress.transferred)} / ${formatBytes(progress.total)}`
                      : 'Extraction des fichiers...'
                    }
                  </span>
                  <span className="text-[10px] text-white/40">
                    {state === 'downloading' && progress.speed > 0
                      ? `${formatBytes(progress.speed)}/s`
                      : `${Math.round(progress.percent)}%`
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Install prompt modal */}
      {showInstallPrompt && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[420px] rounded-2xl bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] shadow-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
            <div className="p-6">
              <h3 className="text-lg font-bold mb-1">Installer Social Life</h3>
              <p className="text-xs text-white/40 mb-5">Choisissez le dossier d'installation</p>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white/70 truncate">
                  {selectedPath}
                </div>
                <button
                  onClick={handleChangePath}
                  className="flex-shrink-0 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.08] px-4 py-3 text-xs font-medium transition-colors"
                >
                  Modifier
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] py-3 text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmInstall}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Installer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
