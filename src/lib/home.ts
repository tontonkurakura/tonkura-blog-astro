import { getCollection } from "astro:content";
import { getImagingPosts } from "./imaging";

export interface RecentItem {
  title: string;
  href: string;
  section: string;
  date: Date;
}

/** 各セクションの件数。imaging は下書きを除いた数（本番ビルドでは 0 になりうる）。 */
export async function getCounts() {
  const [blog, wiki, database, neurology, imaging] = await Promise.all([
    getCollection("blog"),
    getCollection("wiki"),
    getCollection("database"),
    getCollection("neurology"),
    getImagingPosts(),
  ]);
  return {
    blog: blog.length,
    wiki: wiki.filter((e) => e.data.id !== "q-000").length,
    database: database.filter((e) => !e.id.startsWith("_")).length,
    neurology: neurology.length,
    imaging: imaging.length,
  };
}

/**
 * 最近書いたもの。項目ごとに意味のある日付を持つコレクションだけを混ぜる。
 *
 * 移行で一括して同じ日付が入ってしまったものは除く。入れると、その日付で全部が
 * 埋まってフィードとして機能しない。
 * - wiki の updated は 11 本すべて 2026-07-19
 * - database の lastmod は 90 本すべて 2026-07
 * - neurology の lastmod も 261 本が 2026-07。こちらは Obsidian 由来の
 *   last_edited（2021〜2025）が別にあるので、そちらを使う
 */
export async function getRecent(limit = 8): Promise<RecentItem[]> {
  const [blog, neurology, imaging] = await Promise.all([
    getCollection("blog"),
    getCollection("neurology"),
    getImagingPosts(),
  ]);

  const items: RecentItem[] = [];

  for (const e of blog) {
    items.push({
      title: e.data.title,
      href: `/blog/${e.id}`,
      section: "Blog",
      // lastmod は移行で一括して入った 2026-07-21 なので、書いた日である date を使う
      date: e.data.date,
    });
  }

  for (const e of neurology) {
    const date = e.data.last_edited;
    if (!date || !e.data.title) continue;
    items.push({
      title: e.data.title,
      href: `/neurology/${e.id}`,
      section: "Notes",
      date,
    });
  }

  for (const e of imaging) {
    items.push({
      title: e.data.title,
      href: `/imaging/${e.id}`,
      section: "Imaging",
      date: e.data.pubDate,
    });
  }

  return items
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
