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

declare global {
  interface Window {
    launcher: LauncherAPI;
  }
}
