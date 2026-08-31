import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { getCollection, type CollectionEntry } from "astro:content";
import { getImagingPosts } from "./imaging";

export interface RecentItem {
  title: string;
  href: string;
  section: string;
  date: Date;
}

/**
 * 最近書いたもの。項目ごとに意味のある日付を持つコレクションだけを混ぜる。
 *
 * 移行で一括して同じ日付が入ってしまったものは使わない。使うと、その日付で全部が
 * 埋まってフィードとして機能しない。
 * - wiki の updated は 11 本すべて 2026-07-19。代わりに sessions の開催日を使う。
 *   こちらは勉強会が実際に開かれた日で、項目ごとの実体がある
 * - neurology の lastmod も 261 本が 2026-07。Obsidian 由来の last_edited
 *   （2021〜2025）を使う
 * - database は lastmod（90 本すべて 2026-07）しか無いので、フィードに出さない
 */
export async function getRecent(limit = 8, perTypeCap = 6): Promise<RecentItem[]> {
  const [blog, wiki, neurology, imaging] = await Promise.all([
    getCollection("blog"),
    getCollection("wiki"),
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

  for (const e of wiki) {
    const date = sessionDate(e);
    if (e.data.id === "q-000" || !date) continue;
    items.push({
      title: e.data.title,
      href: `/wiki/${e.data.id}`,
      section: "Wiki",
      date,
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

  // 種別ごとに上限を設ける。wiki の10問は同じ勉強会（2026-07-10）の産物で日付が揃うため、
  // 素直に日付順に並べると先頭10行が同じ日付・同じ種別で埋まる。
  const seen = new Map<string, number>();
  return items
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter((i) => {
      const n = (seen.get(i.section) ?? 0) + 1;
      seen.set(i.section, n);
      return n <= perTypeCap;
    })
    .slice(0, limit);
}

/** 問いが出た勉強会の日。複数あるときは最後の回を採る。 */
function sessionDate(e: CollectionEntry<"wiki">): Date | null {
  const dates = (e.data.sessions ?? [])
    .map((s) => s.date)
    .filter((d): d is string => Boolean(d))
    .sort();
  const last = dates.at(-1);
  return last ? new Date(last) : null;
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export type WritingType = "Wiki" | "Notes" | "Blog" | "Imaging";

export interface WritingItem {
  title: string;
  href: string;
  type: WritingType;
  date: Date | null;
}

/**
 * 文章4種を1つの索引にまとめる。コレクションは分けたまま、入口だけ束ねる。
 * 日付を持たない項目は末尾に回す（今のところ該当はない）。
 */
export async function getWritingIndex(): Promise<WritingItem[]> {
  const [blog, wiki, neurology, imaging] = await Promise.all([
    getCollection("blog"),
    getCollection("wiki"),
    getCollection("neurology"),
    getImagingPosts(),
  ]);

  const items: WritingItem[] = [
    ...blog.map((e) => ({
      title: e.data.title,
      href: `/blog/${e.id}`,
      type: "Blog" as const,
      date: e.data.date,
    })),
    ...wiki
      .filter((e) => e.data.id !== "q-000")
      .map((e) => ({
        title: e.data.title,
        href: `/wiki/${e.data.id}`,
        type: "Wiki" as const,
        date: sessionDate(e),
      })),
    ...neurology
      .filter((e) => e.data.title)
      .map((e) => ({
        title: e.data.title as string,
        href: `/neurology/${e.id}`,
        type: "Notes" as const,
        date: e.data.last_edited ?? null,
      })),
    ...imaging.map((e) => ({
      title: e.data.title,
      href: `/imaging/${e.id}`,
      type: "Imaging" as const,
      date: e.data.pubDate,
    })),
  ];

  return items.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
}

export interface Photo {
  src: string;
  description: string;
  date: Date;
}

/**
 * 撮影日の新しい順。日付は photos.yaml の date（EXIF の DateTimeOriginal 由来）。
 * 同じ日に撮った分は1枚に絞る。新しい順に素直に採ると、同じ日の同じ被写体が並ぶ。
 */
export async function getRecentPhotos(limit = 3): Promise<Photo[]> {
  const meta = (yaml.load(
    fs.readFileSync(path.resolve("src/data/photos.yaml"), "utf-8"),
  ) ?? {}) as Record<
    string,
    { description?: string; date?: string | Date } | null
  >;
  const existing = new Set(fs.readdirSync(path.resolve("public/images")));

  return Object.entries(meta)
    .filter(([name, v]) => existing.has(name) && v?.date)
    .map(([name, v]) => ({
      src: `/images/${encodeURIComponent(name)}`,
      description: v?.description ?? "",
      date: new Date(v!.date as string | Date),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter((p, i, all) => {
      const day = (d: Date) => d.toISOString().slice(0, 10);
      return all.findIndex((o) => day(o.date) === day(p.date)) === i;
    })
    .slice(0, limit);
}
