import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 全コンテンツを Astro リポジトリ内（src/content/）に取り込み、自己完結させた。
// デプロイ先には旧リポジトリが無いため、外部参照だと空になる。

// ブログ記事（.md）
const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().default(""),
    lastmod: z.coerce.date().optional(),
  }),
});

// 高次脳機能部 wiki の問い。
// 元は .mdx だが JSX は一切使っておらず、<url> 自動リンクなど Markdown 記法を含む。
// MDX パーサは <url> を JSX と誤認して弾くため、.md として扱う（移行では拡張子を
// .mdx → .md に変えるだけでよい。中身は無改変）。
const wiki = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/wiki" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["map", "empirical", "hybrid"]),
    status: z.enum(["open", "mapped", "evidenced"]),
    domain: z.array(z.string()).default([]),
    sessions: z
      .array(
        z.object({
          n: z.number(),
          at: z.string(),
          date: z.string().optional(),
        }),
      )
      .default([]),
    depends_on: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    refs: z.array(z.string()).default([]),
    updated: z.coerce.date().nullable().optional(),
  }),
});

// 高次脳機能データベース（症候の事典）。.md でネスト構造 {category}/{id}.md。
// frontmatter は lastmod のみで、タイトルは本文 H1・分類は src/data の定義が持つ。
const database = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/database",
  }),
  schema: z.object({
    lastmod: z.coerce.date().optional(),
  }),
});

// 神経内科ノート。ツリー構造の .md（321本）＋同居画像。
// 画像が相対パスで埋め込まれているため、content ごと Astro 内へ取り込んでいる。
const neurology = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/neurology" }),
  schema: z.object({
    lastmod: z.coerce.date().optional(),
    last_edited: z.coerce.date().optional(),
  }),
});

export const collections = { blog, wiki, database, neurology };
