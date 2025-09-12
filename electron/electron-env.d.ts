/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer & {
    getStoredPin(): Promise<string | null>;
    setStoredPin(pin: string): Promise<boolean>;
    loadEnvKeys(): Promise<import("../src/types/envTypes").EnvKey[]>;
    saveEnvKeys(
      keys: import("../src/types/envTypes").EnvKey[]
    ): Promise<boolean>;
  };
}
