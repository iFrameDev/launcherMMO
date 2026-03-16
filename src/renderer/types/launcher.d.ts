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
  gameStatus: () => Promise<GameStatus>;
  chooseInstallPath: () => Promise<string | null>;
  installGame: (installPath: string) => Promise<{ ok: boolean; version?: string; reason?: string }>;
  onGameProgress: (callback: (progress: GameProgress) => void) => void;
};

declare global {
  interface Window {
    launcher: LauncherAPI;
  }
}
