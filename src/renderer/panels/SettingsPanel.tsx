import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';

type SettingsPanelProps = {
  gamePath: string | null;
  launchArgs: string;
  onConfigChange: (cfg: { gameExecutablePath?: string; launchArgs?: string }) => void;
};

export function SettingsPanel({ gamePath, launchArgs, onConfigChange }: SettingsPanelProps) {
  const [args, setArgs] = useState(launchArgs);
  const [version, setVersion] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    window.launcher.getVersion().then((v) => setVersion(v)).catch(() => {});
  }, []);

  const handleChoosePath = async () => {
    try {
      const chosen = await window.launcher.chooseExecutable();
      if (!chosen) return;
      await window.launcher.setConfig({ gameExecutablePath: chosen });
      onConfigChange({ gameExecutablePath: chosen });
      showToast('Chemin du jeu enregistré', 'success');
    } catch {
      showToast('Erreur lors de la sélection', 'error');
    }
  };

  const handleSaveArgs = async () => {
    await window.launcher.setConfig({ launchArgs: args });
    onConfigChange({ launchArgs: args });
    showToast('Arguments sauvegardés', 'success');
  };

  const handleCheckUpdate = async () => {
    showToast('Recherche de mises à jour...', 'info');
    try {
      const res = await window.launcher.checkForUpdates();
      if (!res.ok) {
        showToast(res.reason === 'dev' ? 'Auto-update désactivé en dev' : 'Erreur: ' + res.reason, 'error');
      }
    } catch {
      showToast('Impossible de vérifier les mises à jour', 'error');
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto bg-black/20 backdrop-blur-md">
      <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
      <p className="mt-1 text-sm text-white/40">Configuration du launcher et du jeu</p>

      <div className="mt-8 max-w-lg space-y-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <h3 className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-4">Jeu</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] text-white/30">Chemin de l'exécutable</p>
              <p className="mt-1 text-xs text-white/70 truncate">{gamePath ?? 'Non défini'}</p>
            </div>
            <button onClick={handleChoosePath} className="flex-shrink-0 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 text-[11px] font-medium transition-colors">
              Parcourir
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              placeholder="Arguments de lancement (optionnel)"
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 text-xs outline-none placeholder:text-white/15 focus:border-sky-500/30 transition-all"
            />
            <button onClick={handleSaveArgs} className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 text-[11px] font-medium transition-colors">
              Save
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <h3 className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-4">Launcher</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">Version {version}</p>
              <p className="text-[11px] text-white/25 mt-0.5">Les mises à jour sont automatiques</p>
            </div>
            <button onClick={handleCheckUpdate} className="rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/10 px-4 py-2 text-[11px] font-medium text-sky-300 transition-colors">
              Vérifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
