import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync, createWriteStream, unlinkSync } from 'fs';
import { spawn } from 'child_process';
import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';
import extract from 'extract-zip';

const GAME_SERVER_URL = 'http://163.172.58.102';
const GAME_EXE_NAME = 'SocialLife.exe';

function log(msg: string) {
  const logPath = join(app.getPath('userData'), 'updater.log');
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { appendFileSync(logPath, line, 'utf-8'); } catch {}
}

type LauncherConfig = {
  gameInstallPath?: string;
  gameVersion?: string;
  launchArgs?: string;
};

let mainWindow: BrowserWindow | null = null;

function getConfigPath(): string {
  const userData = app.getPath('userData');
  try { mkdirSync(userData, { recursive: true }); } catch {}
  return join(userData, 'config.json');
}

function readConfig(): LauncherConfig {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) return {};
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8')) as LauncherConfig;
  } catch {
    return {};
  }
}

function saveConfig(config: LauncherConfig) {
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8');
}

function updateConfig(partial: Partial<LauncherConfig>) {
  const current = readConfig();
  saveConfig({ ...current, ...partial });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    title: 'Social Life Launcher',
    autoHideMenuBar: true,
    frame: false,
    transparent: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#262626',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);

  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

// --- Download helper ---
function downloadFile(url: string, destPath: string, onProgress: (percent: number, transferred: number, total: number, speed: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const getter = url.startsWith('https') ? httpsGet : httpGet;
    getter(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath, onProgress).then(resolve).catch(reject);
          return;
        }
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: HTTP ${res.statusCode}`));
        return;
      }

      const totalSize = parseInt(res.headers['content-length'] || '0', 10);
      let downloaded = 0;
      let lastTime = Date.now();
      let lastDownloaded = 0;

      const file = createWriteStream(destPath);
      res.pipe(file);

      res.on('data', (chunk: Buffer) => {
        downloaded += chunk.length;
        const now = Date.now();
        const elapsed = (now - lastTime) / 1000;
        let speed = 0;
        if (elapsed >= 0.5) {
          speed = (downloaded - lastDownloaded) / elapsed;
          lastTime = now;
          lastDownloaded = downloaded;
        }
        const percent = totalSize > 0 ? (downloaded / totalSize) * 100 : 0;
        onProgress(percent, downloaded, totalSize, speed);
      });

      file.on('finish', () => {
        file.close();
        resolve();
      });

      res.on('error', (err) => {
        file.close();
        try { unlinkSync(destPath); } catch {}
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// --- Fetch manifest ---
function fetchManifest(): Promise<{ version: string; zipUrl: string; zipSize: number }> {
  return new Promise((resolve, reject) => {
    const url = `${GAME_SERVER_URL}/manifest.json`;
    const getter = url.startsWith('https') ? httpsGet : httpGet;
    getter(url, (res) => {
      let data = '';
      res.on('data', (chunk: string) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid manifest'));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // --- Launcher auto-update ---
  log('App started, isPackaged=' + app.isPackaged + ', version=' + app.getVersion());
  if (app.isPackaged) {
    try {
      autoUpdater.autoDownload = true;
      autoUpdater.autoInstallOnAppQuit = false;

      autoUpdater.on('checking-for-update', () => log('Checking for update...'));
      autoUpdater.on('update-not-available', () => log('No update available'));

      autoUpdater.on('update-available', (info) => {
        log('Update available: ' + JSON.stringify(info));
        mainWindow?.webContents.send('updater:event', { type: 'update-available' });
      });

      autoUpdater.on('download-progress', (progress) => {
        log('Download progress: ' + Math.round(progress.percent) + '%');
        mainWindow?.webContents.send('updater:event', {
          type: 'download-progress',
          percent: progress.percent,
          transferred: progress.transferred,
          total: progress.total,
          bytesPerSecond: progress.bytesPerSecond,
        });
      });

      autoUpdater.on('update-downloaded', () => {
        log('Update downloaded');
        mainWindow?.webContents.send('updater:event', { type: 'update-downloaded' });
      });

      autoUpdater.on('error', (err) => {
        log('Updater error: ' + String(err));
        mainWindow?.webContents.send('updater:event', { type: 'error', message: String(err) });
      });

      log('Calling checkForUpdates...');
      autoUpdater.checkForUpdates();
    } catch (e) {
      log('Updater catch error: ' + String(e));
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC: Config ---
ipcMain.handle('config:get', () => readConfig());

ipcMain.handle('config:set', (_evt, config: LauncherConfig) => {
  const current = readConfig();
  const allowed: Partial<LauncherConfig> = {};
  if (config.gameInstallPath !== undefined) allowed.gameInstallPath = config.gameInstallPath;
  if (config.launchArgs !== undefined) allowed.launchArgs = config.launchArgs;
  if (config.gameVersion !== undefined) allowed.gameVersion = config.gameVersion;
  const next = { ...current, ...allowed };
  saveConfig(next);
  return next;
});

// --- IPC: Game status ---
ipcMain.handle('game:status', async () => {
  const cfg = readConfig();
  const installed = !!(cfg.gameInstallPath && existsSync(join(cfg.gameInstallPath, GAME_EXE_NAME)));

  let remoteVersion: string | null = null;
  let needsUpdate = false;
  let zipSize = 0;

  try {
    const manifest = await fetchManifest();
    remoteVersion = manifest.version;
    zipSize = manifest.zipSize || 0;
    if (installed && cfg.gameVersion && manifest.version !== cfg.gameVersion) {
      needsUpdate = true;
    }
  } catch {
    // Server unreachable
  }

  return {
    installed,
    installPath: cfg.gameInstallPath || null,
    localVersion: cfg.gameVersion || null,
    remoteVersion,
    needsUpdate,
    zipSize,
  };
});

// --- IPC: Choose install folder ---
ipcMain.handle('game:chooseInstallPath', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "Choisir le dossier d'installation de Social Life",
    properties: ['openDirectory'],
  });
  if (canceled || filePaths.length === 0) return null;
  return filePaths[0];
});

// --- IPC: Install/Update game ---
ipcMain.handle('game:install', async (_evt, installPath: string) => {
  try {
    const manifest = await fetchManifest();
    const zipUrl = `${GAME_SERVER_URL}/${manifest.zipUrl}`;
    const zipDest = join(app.getPath('temp'), 'sociallife-game.zip');

    // Create install directory
    mkdirSync(installPath, { recursive: true });

    // Download zip
    mainWindow?.webContents.send('game:progress', { stage: 'downloading', percent: 0, speed: 0, transferred: 0, total: 0 });

    await downloadFile(zipUrl, zipDest, (percent, transferred, total, speed) => {
      mainWindow?.webContents.send('game:progress', { stage: 'downloading', percent, transferred, total, speed });
    });

    // Extract zip
    mainWindow?.webContents.send('game:progress', { stage: 'extracting', percent: 0 });

    await extract(zipDest, { dir: installPath });

    mainWindow?.webContents.send('game:progress', { stage: 'extracting', percent: 100 });

    // Cleanup zip
    try { unlinkSync(zipDest); } catch {}

    // Save config
    updateConfig({ gameInstallPath: installPath, gameVersion: manifest.version });

    mainWindow?.webContents.send('game:progress', { stage: 'done' });
    return { ok: true, version: manifest.version };
  } catch (e) {
    mainWindow?.webContents.send('game:progress', { stage: 'error', message: String(e) });
    return { ok: false, reason: String(e) };
  }
});

// --- IPC: Launch game ---
ipcMain.handle('game:launch', (_evt, maybeArgs?: string) => {
  const cfg = readConfig();
  const exePath = cfg.gameInstallPath ? join(cfg.gameInstallPath, GAME_EXE_NAME) : null;

  if (!exePath || !existsSync(exePath)) {
    throw new Error("Le jeu n'est pas installé.");
  }

  const args = (maybeArgs ?? cfg.launchArgs ?? '').trim();
  const splitArgs = args.length > 0 ? args.split(' ') : [];
  const child = spawn(exePath, splitArgs, { detached: true, stdio: 'ignore' });
  child.unref();
  return true;
});

// --- IPC: Window ---
ipcMain.handle('window:minimize', () => mainWindow?.minimize());
ipcMain.handle('window:close', () => mainWindow?.close());

// --- IPC: Launcher updater ---
ipcMain.handle('updater:check', async () => {
  if (!app.isPackaged) return { ok: false, reason: 'dev' };
  try {
    const res = await autoUpdater.checkForUpdates();
    return { ok: true, res };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
});

ipcMain.handle('updater:quitAndInstall', () => {
  if (!app.isPackaged) return;
  autoUpdater.quitAndInstall(true, true);
});

ipcMain.handle('app:version', () => app.getVersion());
