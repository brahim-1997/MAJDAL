import { existsSync } from "node:fs";
import { join } from "node:path";
import { SOURCES, type ArchiveSource } from "@/content/sources";

/** onFile: the file exists. shown: on file AND not on hold. */
export type ResolvedSource = ArchiveSource & { onFile: boolean; shown: boolean };

/**
 * Checked at build time. An asset is shown only when its file is actually in
 * /public — until then the frame stays empty and says so.
 */
export function resolveSource(id: string): ResolvedSource {
  const s = SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown archive source: ${id}`);
  const onFile = existsSync(join(process.cwd(), "public", s.file));
  return { ...s, onFile, shown: onFile && !s.hold };
}

export function resolveSources(kind?: ArchiveSource["kind"]): ResolvedSource[] {
  return SOURCES.filter((s) => !kind || s.kind === kind).map((s) => resolveSource(s.id));
}
