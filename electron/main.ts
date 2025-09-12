import { app, BrowserWindow, ipcMain } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";

// Define the path for storing environment keys
const ENV_KEYS_FILE = path.join(app.getPath("userData"), "env-keys.json");

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Load environment keys from file
async function loadEnvKeys() {
  try {
    const data = await fs.readFile(ENV_KEYS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save environment keys to file
async function saveEnvKeys(keys: any[]) {
  await fs.writeFile(ENV_KEYS_FILE, JSON.stringify(keys, null, 2));
}

// Setup IPC handlers
ipcMain.handle("load-env-keys", async () => {
  return await loadEnvKeys();
});

ipcMain.handle("save-env-keys", async (_, keys: any[]) => {
  await saveEnvKeys(keys);
  return true;
});

// Handle PIN storage
const PIN_FILE = path.join(app.getPath("userData"), "pin.dat");

ipcMain.handle("get-pin", async () => {
  try {
    const data = await fs.readFile(PIN_FILE, "utf-8");
    return data;
  } catch (error) {
    return null;
  }
});

ipcMain.handle("set-pin", async (_, pin: string) => {
  try {
    await fs.writeFile(PIN_FILE, pin);
    return true;
  } catch (error) {
    return false;
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
