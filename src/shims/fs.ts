// Minimal fs promises shim backed by a global in-memory map
// Populate window.__YAPL_VFS = new Map<string, string>() with absolute keys like '/vfs/...'
export const promises = {
  async readFile(p: string, _enc: string = "utf8"): Promise<string> {
    const key = typeof p === "string" ? p : String(p);
    const map: Map<string, string> | undefined = (window as any).__YAPL_VFS;
    if (!map) throw new Error("VFS not initialized");
    if (!map.has(key)) throw new Error("File not found: " + key);
    return map.get(key) as string;
  },
};

export default { promises };
