import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "components", "lib"];
const validStaticRoutes = new Set(["/", "/experience", "/writing", "/resume", "/#projects"]);
const projectSlugs = ["fault-tolerant-transformer-lab", "distributed-scale-validation-platform", "voicemed-ai"];
for (const slug of projectSlugs) validStaticRoutes.add(`/projects/${slug}`);

async function collect(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry);
    const metadata = await stat(absolute);
    if (metadata.isDirectory()) files.push(...(await collect(absolute)));
    else if (/\.(ts|tsx|md|mdx)$/.test(entry)) files.push(absolute);
  }
  return files;
}

const files = (await Promise.all(sourceRoots.map((directory) => collect(path.join(root, directory))))).flat();
const missing = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/(?:href|canonical):?\s*=?(?:\{|\s)*["'`]([^"'`]+)["'`]/g)) {
    const href = match[1];
    if (href.startsWith("/") && !href.includes("${") && !href.endsWith(".pdf") && !validStaticRoutes.has(href)) {
      missing.push(`${path.relative(root, file)} -> ${href}`);
    }
  }
}

if (missing.length > 0) {
  console.error("Unrecognized internal links:\n" + missing.join("\n"));
  process.exit(1);
}

console.log(`Checked ${files.length} source files; internal route references are recognized.`);
