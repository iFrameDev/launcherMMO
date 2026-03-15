import { useEffect, useState } from 'react';

export function TitleBar() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    window.launcher.getVersion().then((v) => setVersion(`v${v}`)).catch(() => {});
  }, []);

  return (
    <div className="h-12 flex items-center justify-between px-5 select-none flex-shrink-0 bg-white/[0.02]" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 grid place-items-center rounded-md bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-[10px]">S</div>
        <span className="text-xs font-semibold text-white/80 tracking-wide">SOCIAL LIFE</span>
        <span className="text-[10px] text-white/30">{version}</span>
      </div>
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button onClick={() => window.launcher.minimize()} className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors" aria-label="Minimize">
          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="9" width="14" height="2" rx="1" /></svg>
        </button>
        <button onClick={() => window.launcher.close()} className="h-8 w-8 grid place-items-center rounded-md hover:bg-red-500/80 hover:text-white text-white/40 transition-colors" aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
