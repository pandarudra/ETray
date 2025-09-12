import { app as r, ipcMain as a, BrowserWindow as c } from "electron";
import { fileURLToPath as w } from "node:url";
import e from "node:path";
import o from "fs/promises";
const l = e.join(r.getPath("userData"), "env-keys.json"), d = e.dirname(w(import.meta.url));
process.env.APP_ROOT = e.join(d, "..");
const i = process.env.VITE_DEV_SERVER_URL, P = e.join(process.env.APP_ROOT, "dist-electron"), p = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? e.join(process.env.APP_ROOT, "public") : p;
let t;
function u() {
  t = new c({
    icon: e.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: e.join(d, "preload.mjs")
    }
  }), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i ? t.loadURL(i) : t.loadFile(e.join(p, "index.html"));
}
async function f() {
  try {
    const n = await o.readFile(l, "utf-8");
    return JSON.parse(n);
  } catch {
    return [];
  }
}
async function E(n) {
  await o.writeFile(l, JSON.stringify(n, null, 2));
}
a.handle("load-env-keys", async () => await f());
a.handle("save-env-keys", async (n, s) => (await E(s), !0));
const _ = e.join(r.getPath("userData"), "pin.dat");
a.handle("get-pin", async () => {
  try {
    return await o.readFile(_, "utf-8");
  } catch {
    return null;
  }
});
a.handle("set-pin", async (n, s) => {
  try {
    return await o.writeFile(_, s), !0;
  } catch {
    return !1;
  }
});
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), t = null);
});
r.on("activate", () => {
  c.getAllWindows().length === 0 && u();
});
r.whenReady().then(u);
export {
  P as MAIN_DIST,
  p as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
