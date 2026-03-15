import { useState, useEffect } from 'react';

type UpdaterState = {
  isUpdating: boolean;
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
  downloaded: boolean;
  error: string | null;
};

export function useUpdater() {
  const [state, setState] = useState<UpdaterState>({
    isUpdating: false,
    percent: 0,
    transferred: 0,
    total: 0,
    bytesPerSecond: 0,
    downloaded: false,
    error: null,
  });

  useEffect(() => {
    window.launcher.onUpdaterEvent((event) => {
      switch (event.type) {
        case 'update-available':
          setState((s) => ({ ...s, isUpdating: true, error: null }));
          break;
        case 'download-progress':
          setState((s) => ({
            ...s,
            isUpdating: true,
            percent: event.percent,
            transferred: event.transferred,
            total: event.total,
            bytesPerSecond: event.bytesPerSecond,
          }));
          break;
        case 'update-downloaded':
          setState((s) => ({ ...s, downloaded: true, percent: 100 }));
          break;
        case 'error':
          setState((s) => ({ ...s, isUpdating: false, error: event.message }));
          break;
      }
    });
  }, []);

  return state;
}
