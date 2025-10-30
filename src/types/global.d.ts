import type { LauncherAPI } from '../preload';

declare global {
  interface Window {
    launcher: LauncherAPI;
  }
}

export {};



