import type { View } from '../App';

type NavBarProps = {
  activeView: View;
  onNavigate: (view: View) => void;
};

const navItems: { id: View; label: string }[] = [
  { id: 'game', label: 'Accueil' },
  { id: 'store', label: 'Boutique' },
  { id: 'friends', label: 'Amis' },
  { id: 'settings', label: 'Paramètres' },
];

export function NavBar({ activeView, onNavigate }: NavBarProps) {
  return (
    <nav className="h-10 flex items-center justify-between px-6 bg-white/[0.04] backdrop-blur-md border-b border-white/[0.06] flex-shrink-0">
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeView === item.id
                ? 'text-white bg-white/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {item.label}
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
