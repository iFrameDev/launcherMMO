import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { spawn } from 'child_process';

type LauncherConfig = {
  gameExecutablePath?: string;
  launchArgs?: string;
};

let mainWindow: BrowserWindow | null = null;

function getConfigPath(): string {
  const userData = app.getPath('userData');
  const configDir = join(userData);
  try {
    mkdirSync(configDir, { recursive: true });
  } catch {}
  return join(configDir, 'config.json');
}

function readConfig(): LauncherConfig {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) return {};
  try {
    const raw = readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as LauncherConfig;
  } catch {
    return {};
  }
}

function saveConfig(config: LauncherConfig) {
  const configPath = getConfigPath();
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    title: 'PalmLife Launcher',
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  // Remove the default menu (File/Edit/View ...)
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);

  await mainWindow.loadFile(join(app.getAppPath(), 'index.html'));
  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Auto-update: uniquement en build packagé
  if (app.isPackaged) {
    try {
      autoUpdater.autoDownload = true;
      autoUpdater.autoInstallOnAppQuit = false; // on installe immédiatement après le téléchargement

      autoUpdater.on('update-available', () => {
        if (mainWindow) {
          mainWindow.webContents.send('updater:event', { type: 'update-available' });
        }
      });

      autoUpdater.on('download-progress', (progress) => {
        if (mainWindow) {
          mainWindow.webContents.send('updater:event', {
            type: 'download-progress',
            percent: progress.percent,
            transferred: progress.transferred,
            total: progress.total,
            bytesPerSecond: progress.bytesPerSecond,
          });
        }
      });

      autoUpdater.on('update-downloaded', () => {
        if (mainWindow) {
          mainWindow.webContents.send('updater:event', { type: 'update-downloaded' });
        }
        // Installe et redémarre immédiatement une fois l'update téléchargée
        autoUpdater.quitAndInstall(false, true);
      });

      autoUpdater.on('error', (err) => {
        if (mainWindow) {
          mainWindow.webContents.send('updater:event', { type: 'error', message: String(err) });
        }
      });

      // Vérifie au démarrage; pas de notification, on installe directement
      autoUpdater.checkForUpdates();
    } catch (_) {
      // Ignore updater errors in dev
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('config:get', () => {
  return readConfig();
});

ipcMain.handle('config:set', (_evt, config: LauncherConfig) => {
  const current = readConfig();
  const next = { ...current, ...config };
  saveConfig(next);
  return next;
});

ipcMain.handle('dialog:chooseExecutable', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Choisir l\'exécutable de PalmLife',
    properties: ['openFile'],
    filters: [
      { name: 'Exécutables', extensions: process.platform === 'win32' ? ['exe'] : ['*'] },
    ],
  });
  if (canceled || filePaths.length === 0) return null;
  return filePaths[0];
});

ipcMain.handle('game:launch', (_evt, maybeArgs?: string) => {
  const cfg = readConfig();
  if (!cfg.gameExecutablePath || !existsSync(cfg.gameExecutablePath)) {
    throw new Error('Chemin du jeu introuvable. Configurez le chemin d\'abord.');
  }
  const args = (maybeArgs ?? cfg.launchArgs ?? '').trim();
  const splitArgs = args.length > 0 ? args.split(' ') : [];

  // Detach so the launcher can close if needed
  const child = spawn(cfg.gameExecutablePath, splitArgs, {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  return true;
});

ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

// Updater IPCs
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
  autoUpdater.quitAndInstall(false, true);
});

// App info IPC
ipcMain.handle('app:version', () => {
  return app.getVersion();
});



