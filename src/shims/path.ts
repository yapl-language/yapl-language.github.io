// Tiny path shim for browser
export function resolve(...parts: string[]): string {
  const base: string[] = [];
  for (const part of parts) {
    const segs = part.split("/");
    for (const s of segs) {
      if (!s || s === ".") continue;
      if (s === "..") base.pop();
      else base.push(s);
    }
  }
  return "/" + base.join("/");
}

export function dirname(p: string): string {
  const segs = p.split("/");
  segs.pop();
  return segs.length <= 1 ? "/" : segs.join("/");
}

export default { resolve, dirname };
