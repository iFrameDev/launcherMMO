import { contextBridge, ipcRenderer } from 'electron';

export type UpdaterEvent =
  | { type: 'update-available' }
  | { type: 'download-progress'; percent: number; transferred: number; total: number; bytesPerSecond: number }
  | { type: 'update-downloaded' }
  | { type: 'error'; message: string };

export type GameProgress =
  | { stage: 'downloading'; percent: number; speed: number; transferred: number; total: number }
  | { stage: 'extracting'; percent: number }
  | { stage: 'done' }
  | { stage: 'error'; message: string };

export type GameStatus = {
  installed: boolean;
  installPath: string | null;
  localVersion: string | null;
  remoteVersion: string | null;
  needsUpdate: boolean;
  zipSize: number;
};

export type LauncherAPI = {
  getConfig: () => Promise<{ gameInstallPath?: string; gameVersion?: string; launchArgs?: string }>;
  setConfig: (cfg: { gameInstallPath?: string; launchArgs?: string; gameVersion?: string }) => Promise<any>;
  launch: (args?: string) => Promise<boolean>;
  minimize: () => Promise<void>;
  close: () => Promise<void>;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<any>;
  quitAndInstall: () => Promise<void>;
  onUpdaterEvent: (callback: (event: UpdaterEvent) => void) => void;
  // Game management
  gameStatus: () => Promise<GameStatus>;
  chooseInstallPath: () => Promise<string | null>;
  installGame: (installPath: string) => Promise<{ ok: boolean; version?: string; reason?: string }>;
  onGameProgress: (callback: (progress: GameProgress) => void) => void;
};

const api: LauncherAPI = {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (cfg) => ipcRenderer.invoke('config:set', cfg),
  launch: (args?: string) => ipcRenderer.invoke('game:launch', args),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
  getVersion: () => ipcRenderer.invoke('app:version'),
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  quitAndInstall: () => ipcRenderer.invoke('updater:quitAndInstall'),
  onUpdaterEvent: (callback) => {
    ipcRenderer.on('updater:event', (_e, data) => callback(data));
  },
  // Game management
  gameStatus: () => ipcRenderer.invoke('game:status'),
  chooseInstallPath: () => ipcRenderer.invoke('game:chooseInstallPath'),
  installGame: (installPath: string) => ipcRenderer.invoke('game:install', installPath),
  onGameProgress: (callback) => {
    ipcRenderer.on('game:progress', (_e, data) => callback(data));
  },
};

declare global {
  interface Window {
    launcher: LauncherAPI;
  }
}

contextBridge.exposeInMainWorld('launcher', api);
