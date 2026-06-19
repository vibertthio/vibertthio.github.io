import react from "@vitejs/plugin-react";
import { marked } from "marked";
import { defineConfig } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(rootDir, "posts");
const siteUrl = "https://vibertthio.com";

const virtualModuleId = "virtual:posts";
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMarkdownFile(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  return {
    data: YAML.parse(match[1]) || {},
    content: match[2],
  };
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFrom(markdown) {
  const firstBlock = markdown.split(/\n\s*\n/).find((block) => block.trim());
  return firstBlock ? stripMarkdown(firstBlock).slice(0, 220) : "";
}

async function readEntries() {
  const filenames = (await fs.readdir(postsDir))
    .filter((filename) => filename.endsWith(".md") && !filename.startsWith("_"))
    .sort();

  const entries = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(postsDir, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const { data, content } = parseMarkdownFile(raw);
      const markdown = content.trim();
      const slug = data.slug || filename.replace(/\.md$/, "");
      const type = data.type || "post";
      const tags = normalizeList(data.tags).filter((tag) => tag !== type);
      const references = Array.isArray(data.references)
        ? data.references
            .map((reference) => ({
              label: reference.label,
              url: reference.url,
            }))
            .filter((reference) => reference.label && reference.url)
        : [];

      return {
        slug,
        title: data.title || "",
        date: data.date ? String(data.date).slice(0, 10) : "",
        type,
        tags,
        summary: data.summary || excerptFrom(markdown),
        url: data.url || "",
        references,
        html: marked.parse(markdown, { async: false }),
      };
    }),
  );

  return entries
    .filter((entry) => entry.slug && entry.date)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderRss(entries) {
  const items = entries
    .map((entry) => {
      const title = entry.title || entry.summary || entry.slug;
      const link = `${siteUrl}/#/p/${encodeURIComponent(entry.slug)}`;
      return `
        <item>
          <title>${escapeXml(title)}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate>
          <description>${escapeXml(entry.summary)}</description>
        </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>vibertthio</title>
    <link>${siteUrl}</link>
    <description>Projects, writing, and notes from Vibert Thio.</description>${items}
  </channel>
</rss>`;
}

function postsPlugin() {
  return {
    name: "posts-from-markdown",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
      return null;
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return null;

      const filenames = (await fs.readdir(postsDir)).filter((filename) => filename.endsWith(".md"));
      filenames.forEach((filename) => {
        this.addWatchFile(path.join(postsDir, filename));
      });

      const entries = await readEntries();
      return `export const ENTRIES = ${JSON.stringify(entries)};`;
    },
    configureServer(server) {
      server.watcher.add(postsDir);

      const reloadPosts = (file) => {
        if (!file.endsWith(".md")) return;

        const postsModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (postsModule) server.moduleGraph.invalidateModule(postsModule);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", reloadPosts);
      server.watcher.on("change", reloadPosts);
      server.watcher.on("unlink", reloadPosts);

      server.middlewares.use("/rss.xml", async (_request, response) => {
        response.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
        response.end(renderRss(await readEntries()));
      });
    },
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "rss.xml",
        source: renderRss(await readEntries()),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), postsPlugin()],
});
