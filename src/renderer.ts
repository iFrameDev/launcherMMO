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
  el.style.display = 'none';
}

function showPanel(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove('hidden');
  el.style.display = '';
}

function showOnly(id: string) {
  const home = document.getElementById('homePanel');
  const settings = document.getElementById('settingsPanel');
  const login = document.getElementById('loginPanel');
  const friends = document.getElementById('friendsPanel');
  [home, settings, login, friends].forEach(hidePanel);
  const target = document.getElementById(id);
  showPanel(target as HTMLElement | null);
  if (id === 'loginPanel') setShellVisible(false); else setShellVisible(true);
}

async function init() {
  // Start on login-only view
  setShellVisible(false);
  showOnly('loginPanel');

  // Load config early for settings page
  const cfg = await window.launcher.getConfig();
  if (cfg.gameExecutablePath) {
    setText('#pathLabel', cfg.gameExecutablePath);
    ($('#playBtn') as HTMLButtonElement | null)?.removeAttribute('disabled');
  }
  if (cfg.launchArgs) {
    const input = document.getElementById('argsInput') as HTMLInputElement | null;
    if (input) input.value = cfg.launchArgs;
  }

  // Simulated login
  $('#loginSubmit')?.addEventListener('click', () => {
    showOnly('homePanel');
  });

  // Handlers (settings)
  $('#chooseBtn')?.addEventListener('click', async () => {
    const chosen = await window.launcher.chooseExecutable();
    if (!chosen) return;
    await window.launcher.setConfig({ gameExecutablePath: chosen });
    setText('#pathLabel', chosen);
    ($('#playBtn') as HTMLButtonElement | null)?.removeAttribute('disabled');
  });

  $('#saveArgsBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('argsInput') as HTMLInputElement | null;
    await window.launcher.setConfig({ launchArgs: input?.value ?? '' });
    const msg = $('#savedNote');
    if (msg) {
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('hidden'), 1500);
    }
  });

  $('#playBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('argsInput') as HTMLInputElement | null;
    await window.launcher.launch(input?.value ?? '');
  });

  // Sidebar nav
  $('#btnSettings')?.addEventListener('click', () => showOnly('settingsPanel'));
  $('#btnHome')?.addEventListener('click', () => showOnly('homePanel'));
  $('#btnCommunity')?.addEventListener('click', () => showOnly('friendsPanel'));

  // Window controls
  $('#winMin')?.addEventListener('click', () => window.launcher.minimize());
  $('#winClose')?.addEventListener('click', () => window.launcher.close());
}

document.addEventListener('DOMContentLoaded', init);



