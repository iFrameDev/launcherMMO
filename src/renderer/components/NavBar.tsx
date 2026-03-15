import type { View } from '../App';

type NavBarProps = {
  activeView: View;
  onNavigate: (view: View) => void;
};

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  {
    id: 'game',
    label: 'Accueil',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-8 9 8" /><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" /></svg>,
  },
  {
    id: 'store',
    label: 'Boutique',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  },
  {
    id: 'friends',
    label: 'Amis',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4" /><path d="M3 21a6 6 0 0 1 12 0" /><path d="M17 11a4 4 0 1 0 0-8" /><path d="M21 21a6 6 0 0 0-4-5.65" /></svg>,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  },
];

export function NavBar({ activeView, onNavigate }: NavBarProps) {
  return (
    <nav className="h-14 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`group relative h-12 w-12 grid place-items-center rounded-xl transition-all duration-200 ${
              activeView === item.id
                ? 'text-white'
                : 'text-white/35 hover:text-white/70'
            }`}
            aria-label={item.label}
          >
            {item.icon}
            {/* Tooltip */}
            <div className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black/80 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {item.label}
            </div>
          </button>
        ))}
      </div>

      {/* Profile */}
      <button
        onClick={() => onNavigate('profile')}
        className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1 transition-all"
      >
        <span className="text-xs text-white/60">iFrame</span>
        <div className={`h-7 w-7 rounded-full grid place-items-center bg-gradient-to-br from-sky-400 to-blue-600 ring-2 transition-all ${activeView === 'profile' ? 'ring-sky-500' : 'ring-white/10'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>
        </div>
      </button>
    </nav>
  );
}
