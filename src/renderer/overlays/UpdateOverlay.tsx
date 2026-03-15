import { useEffect } from 'react';
import { useUpdater } from '../hooks/useUpdater';

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function UpdateOverlay() {
  const { isUpdating, percent, transferred, total, bytesPerSecond, downloaded, error } = useUpdater();

  useEffect(() => {
    if (downloaded) {
      const timer = setTimeout(() => window.launcher.quitAndInstall(), 2000);
      return () => clearTimeout(timer);
    }
  }, [downloaded]);

  if (!isUpdating && !error) return null;

  const pct = Math.round(percent);
  const speed = formatBytes(bytesPerSecond) + '/s';
  const status = downloaded
    ? 'Installation en cours...'
    : `${formatBytes(transferred)} / ${formatBytes(total)} — ${speed}`;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="h-14 w-14 mx-auto grid place-items-center rounded-2xl bg-blue-600/80 text-white font-bold text-2xl mb-6">S</div>
        <h2 className="text-xl font-bold text-white mb-2">Mise à jour en cours</h2>
        <p className="text-sm text-white/60 mb-6">{status}</p>
        <div className="w-72 mx-auto">
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-sky-500 transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-white/50 mt-2">{pct}%</p>
        </div>
      </div>
    </div>
  );
}
