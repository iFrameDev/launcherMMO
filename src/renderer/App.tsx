import { useState } from 'react';
import { ToastProvider } from './hooks/useToast';
import { TitleBar } from './components/TitleBar';
import { NavBar } from './components/NavBar';
import { ToastContainer } from './components/ToastContainer';
import { UpdateOverlay } from './overlays/UpdateOverlay';
import { LoginPanel } from './panels/LoginPanel';
import { GamePanel } from './panels/GamePanel';
import { StorePanel } from './panels/StorePanel';
import { FriendsPanel } from './panels/FriendsPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { ProfilePanel } from './panels/ProfilePanel';

export type View = 'game' | 'store' | 'friends' | 'settings' | 'profile';

function AppContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>('game');

  return (
    <div className="h-screen overflow-hidden text-white relative bg-transparent">
      <UpdateOverlay />
      <ToastContainer />

      {!loggedIn ? (
        <>
          <div className="relative z-20">
            <TitleBar />
          </div>
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-cover bg-center brightness-[1.8]" style={{ backgroundImage: "url('./images/image.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700/60 via-transparent to-transparent" />
          </div>
          <div className="pt-12 h-full relative z-10">
            <LoginPanel onLogin={() => { setLoggedIn(true); setView('game'); }} />
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col relative">
          <div className="absolute inset-0 -z-10">
            <div className="h-full w-full bg-cover bg-center brightness-[1.8]" style={{ backgroundImage: "url('./images/image.png')" }} />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <TitleBar />
          <NavBar activeView={view} onNavigate={setView} />

          <main className="flex-1 overflow-hidden">
            {view === 'game' && <GamePanel />}
            {view === 'store' && <StorePanel />}
            {view === 'friends' && <FriendsPanel />}
            {view === 'settings' && <SettingsPanel />}
            {view === 'profile' && <ProfilePanel />}
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
