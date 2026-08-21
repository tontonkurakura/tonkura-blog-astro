import { defineCollection, reference, z } from "astro:content";
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

// 疑問駆動パイプライン（GitHub Issue → Claude Code Action → PR）が書く、
// 神経画像解析の方法論記事。疑問 1 つ = 記事 1 本。
//
// blog と別コレクションにしている理由:
// 既存 blog の 6 本は出典リストを持たない個人ノートで、sources.min(2) を課すと
// 全部落ちる。厳しさの違うものを同居させると「出典ゼロを CI で落とす」という
// この仕組みの要が成立しない。
//
// ファイルは {Issue番号}-{英語スラッグ}.md のフラット配置で、category を
// パスに含めない。分類し直したときに URL と related の両方が壊れるため。
const imaging = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/imaging" }),
  schema: z.object({
    title: z.string().min(8).max(60),
    description: z.string().min(40).max(160),
    pubDate: z.coerce.date(),
    // Claude は必ず true で出す。外すのは人の手。
    // merge = 保存、draft を外す = 公開、の 2 段にするための鍵。
    draft: z.boolean().default(true),
    category: z.enum(["methods", "tools", "stats", "misc"]),
    tags: z.array(z.string()).min(2).max(6),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          kind: z.enum(["docs", "paper", "repo", "web"]),
        }),
      )
      .min(2)
      // 「一次資料（公式ドキュメント or 原著）を最低 1 件当たる」をプロンプト頼みに
      // せず、ここで落とす。二次情報だけで書かれた記事はビルドを通さない。
      .refine((list) => list.some((s) => s.kind === "docs" || s.kind === "paper"), {
        message:
          "sources に kind が docs か paper のもの（一次資料）が最低 1 件必要です",
      }),
    // reference() はスキーマ検証の時点では形しか見ない（存在確認はしない）。
    // 実在チェックは src/pages/imaging/[...slug].astro で明示的に行う。
    related: z.array(reference("imaging")).default([]),
    fromIssue: z.number().int().positive().optional(),
  }),
});

export const collections = { blog, wiki, database, neurology, imaging };
