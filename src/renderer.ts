const $ = (sel: string) => document.querySelector(sel) as HTMLElement | null;

function setText(sel: string, text: string) {
  const el = $(sel);
  if (el) el.textContent = text;
}

function setShellVisible(visible: boolean) {
  const shell = document.getElementById('shell');
  if (!shell) return;
  if (visible) shell.classList.remove('hidden');
  else shell.classList.add('hidden');
}

function hidePanel(el: HTMLElement | null) {
  if (!el) return;
  el.classList.add('hidden');
}

function showPanel(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove('hidden');
}

// --- Toast notification system ---
function showToast(message: string, type: 'info' | 'success' | 'error' = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const colors = {
    info: 'border-violet-500/50 bg-violet-500/20',
    success: 'border-emerald-500/50 bg-emerald-500/20',
    error: 'border-red-500/50 bg-red-500/20',
  };

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[type]} backdrop-blur-md text-sm text-white/90 shadow-lg transition-all duration-300 translate-x-full opacity-0`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
  });

  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return toast;
}

// --- Sidebar active state ---
let activeNavId = 'btnHome';

function setActiveNav(btnId: string) {
  activeNavId = btnId;
  ['btnHome', 'btnCommunity', 'btnSettings'].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (id === btnId) {
      btn.classList.add('bg-white/15');
    } else {
      btn.classList.remove('bg-white/15');
    }
  });
}

function showOnly(id: string) {
  const home = document.getElementById('homePanel');
  const settings = document.getElementById('settingsPanel');
  const login = document.getElementById('loginPanel');
  const friends = document.getElementById('friendsPanel');
  [home, settings, login, friends].forEach(hidePanel);
  const target = document.getElementById(id);
  showPanel(target);
  if (id === 'loginPanel') setShellVisible(false); else setShellVisible(true);
}

// --- Update progress bar ---
function setDownloadProgress(percent: number) {
  const bar = document.getElementById('downloadBar');
  const container = document.getElementById('downloadContainer');
  const label = document.getElementById('downloadLabel');
  if (bar) bar.style.width = `${Math.round(percent)}%`;
  if (container) container.classList.remove('hidden');
  if (label) label.textContent = `${Math.round(percent)}%`;
}

function hideDownloadBar() {
  const container = document.getElementById('downloadContainer');
  if (container) container.classList.add('hidden');
}

async function init() {
  setShellVisible(false);
  showOnly('loginPanel');

  const cfg = await window.launcher.getConfig();
  if (cfg.gameExecutablePath) {
    setText('#pathLabel', cfg.gameExecutablePath);
    ($('#playBtn') as HTMLButtonElement | null)?.removeAttribute('disabled');
  }
  if (cfg.launchArgs) {
    const input = document.getElementById('argsInput') as HTMLInputElement | null;
    if (input) input.value = cfg.launchArgs;
  }

  // Login with loading feedback
  $('#loginSubmit')?.addEventListener('click', () => {
    const btn = $('#loginSubmit') as HTMLButtonElement | null;
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = 'Connexion...';
    setTimeout(() => {
      showOnly('homePanel');
      setActiveNav('btnHome');
      btn.disabled = false;
      btn.textContent = 'Se connecter';
    }, 800);
  });

  // Display app version
  try {
    const v = await window.launcher.getVersion();
    const verEl = document.getElementById('appVersion');
    if (verEl) verEl.textContent = `v${v}`;
  } catch {}

  // Settings: choose executable
  $('#chooseBtn')?.addEventListener('click', async () => {
    try {
      const chosen = await window.launcher.chooseExecutable();
      if (!chosen) return;
      await window.launcher.setConfig({ gameExecutablePath: chosen });
      setText('#pathLabel', chosen);
      ($('#playBtn') as HTMLButtonElement | null)?.removeAttribute('disabled');
      showToast('Chemin du jeu enregistré', 'success');
    } catch (e) {
      showToast('Erreur lors de la sélection du fichier', 'error');
    }
  });

  // Settings: save args
  $('#saveArgsBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('argsInput') as HTMLInputElement | null;
    await window.launcher.setConfig({ launchArgs: input?.value ?? '' });
    showToast('Arguments sauvegardés', 'success');
  });

  // Play button
  $('#playBtn')?.addEventListener('click', async () => {
    try {
      const input = document.getElementById('argsInput') as HTMLInputElement | null;
      await window.launcher.launch(input?.value ?? '');
      showToast('Jeu lancé !', 'success');
    } catch (e: any) {
      showToast(e?.message ?? 'Impossible de lancer le jeu', 'error');
    }
  });

  // Sidebar nav with active state
  $('#btnSettings')?.addEventListener('click', () => {
    showOnly('settingsPanel');
    setActiveNav('btnSettings');
  });
  $('#btnHome')?.addEventListener('click', () => {
    showOnly('homePanel');
    setActiveNav('btnHome');
  });
  $('#btnCommunity')?.addEventListener('click', () => {
    showOnly('friendsPanel');
    setActiveNav('btnCommunity');
  });

  // Window controls
  $('#winMin')?.addEventListener('click', () => window.launcher.minimize());
  $('#winClose')?.addEventListener('click', () => window.launcher.close());

  // Check for updates button in settings
  $('#checkUpdateBtn')?.addEventListener('click', async () => {
    showToast('Recherche de mises à jour...', 'info');
    try {
      const res = await window.launcher.checkForUpdates();
      if (!res.ok) {
        showToast(res.reason === 'dev' ? 'Auto-update désactivé en mode développement' : 'Erreur: ' + res.reason, 'error');
      }
    } catch {
      showToast('Impossible de vérifier les mises à jour', 'error');
    }
  });

  // Updater events — full screen overlay
  const updateOverlay = document.getElementById('updateOverlay');
  const updateProgressBar = document.getElementById('updateProgressBar');
  const updatePercent = document.getElementById('updatePercent');
  const updateStatus = document.getElementById('updateStatus');

  function showUpdateOverlay() {
    if (updateOverlay) updateOverlay.classList.remove('hidden');
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  window.launcher.onUpdaterEvent((event) => {
    switch (event.type) {
      case 'update-available':
        showUpdateOverlay();
        break;

      case 'download-progress': {
        showUpdateOverlay();
        const pct = Math.round(event.percent);
        if (updateProgressBar) updateProgressBar.style.width = `${pct}%`;
        if (updatePercent) updatePercent.textContent = `${pct}%`;
        if (updateStatus) {
          const speed = formatBytes(event.bytesPerSecond) + '/s';
          const downloaded = formatBytes(event.transferred);
          const total = formatBytes(event.total);
          updateStatus.textContent = `${downloaded} / ${total} — ${speed}`;
        }
        setDownloadProgress(event.percent);
        break;
      }

      case 'update-downloaded':
        hideDownloadBar();
        if (updateProgressBar) updateProgressBar.style.width = '100%';
        if (updatePercent) updatePercent.textContent = '100%';
        if (updateStatus) updateStatus.textContent = 'Installation en cours...';
        setTimeout(() => {
          window.launcher.quitAndInstall();
        }, 2000);
        break;

      case 'error':
        if (updateOverlay) updateOverlay.classList.add('hidden');
        showToast('Erreur de mise à jour: ' + event.message, 'error');
        break;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
