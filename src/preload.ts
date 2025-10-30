import { contextBridge, ipcRenderer } from 'electron';

export type LauncherAPI = {
  getConfig: () => Promise<{ gameExecutablePath?: string; launchArgs?: string }>;
  setConfig: (cfg: { gameExecutablePath?: string; launchArgs?: string }) => Promise<any>;
  chooseExecutable: () => Promise<string | null>;
  launch: (args?: string) => Promise<boolean>;
  minimize: () => Promise<void>;
  close: () => Promise<void>;
};

const api: LauncherAPI = {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (cfg) => ipcRenderer.invoke('config:set', cfg),
  chooseExecutable: () => ipcRenderer.invoke('dialog:chooseExecutable'),
  launch: (args?: string) => ipcRenderer.invoke('game:launch', args),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
};

declare global {
  interface Window {
    launcher: LauncherAPI;
  }
}

contextBridge.exposeInMainWorld('launcher', api);



