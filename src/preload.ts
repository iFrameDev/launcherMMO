import { contextBridge, ipcRenderer } from 'electron';

export type UpdaterEvent =
  | { type: 'update-available' }
  | { type: 'download-progress'; percent: number; transferred: number; total: number; bytesPerSecond: number }
  | { type: 'update-downloaded' }
  | { type: 'error'; message: string };

export type LauncherAPI = {
  getConfig: () => Promise<{ gameExecutablePath?: string; launchArgs?: string }>;
  setConfig: (cfg: { gameExecutablePath?: string; launchArgs?: string }) => Promise<any>;
  chooseExecutable: () => Promise<string | null>;
  launch: (args?: string) => Promise<boolean>;
  minimize: () => Promise<void>;
  close: () => Promise<void>;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<any>;
  quitAndInstall: () => Promise<void>;
  onUpdaterEvent: (callback: (event: UpdaterEvent) => void) => void;
};

const api: LauncherAPI = {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (cfg) => ipcRenderer.invoke('config:set', cfg),
  chooseExecutable: () => ipcRenderer.invoke('dialog:chooseExecutable'),
  launch: (args?: string) => ipcRenderer.invoke('game:launch', args),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
  getVersion: () => ipcRenderer.invoke('app:version'),
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  quitAndInstall: () => ipcRenderer.invoke('updater:quitAndInstall'),
  onUpdaterEvent: (callback) => {
    ipcRenderer.on('updater:event', (_e, data) => callback(data));
  },
};

declare global {
  interface Window {
    launcher: LauncherAPI;
  }
}

contextBridge.exposeInMainWorld('launcher', api);
