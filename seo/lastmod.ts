import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const git = (root: string, args: string[]) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

/// Whether `lastmod` can be trusted: false outside a git checkout and in a shallow clone (Vercel
/// clones shallowly, so every file would share the one commit date and the sitemap would lie).
export function canDateFromGit(root: string): boolean {
  try {
    return git(root, ["rev-parse", "--is-shallow-repository"]) === "false";
  } catch {
    return false;
  }
}

/// Last commit date (YYYY-MM-DD) touching any of the files, or undefined outside a git checkout.
export function gitLastModified(root: string, files: string[]): string | undefined {
  try {
    return git(root, ["log", "-1", "--format=%cs", "--", ...files]) || undefined;
  } catch {
    return undefined;
  }
}

const camelCase = (id: string) => id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/// Source files whose history dates a page: the guide lesson's text, or the module's feature folder.
export function pageSources(root: string, path: string): string[] {
  const [first = "home", ...rest] = path.split("/").filter(Boolean);
  const candidates =
    first === "guide"
      ? [rest.length === 2 ? `src/Language/guides/${camelCase(rest[1])}.ts` : "src/features/guide", "src/Language/guides"]
      : [`src/features/${first}`, `src/features/${first}-lab`];
  return candidates.filter((file) => existsSync(join(root, file))).slice(0, 1);
}
