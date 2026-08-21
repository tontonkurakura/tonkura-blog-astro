import { getCollection, getEntries, type CollectionEntry } from "astro:content";

/** 見本記事の id。wiki の q-000 と同じ役割で、スキーマの型崩れに気づくために置く。 */
export const TEMPLATE_ID = "000-template";

export type ImagingPost = CollectionEntry<"imaging">;

/**
 * 下書きをビルドに含めるか。
 *
 *   本番（Vercel）      … 含めない。merge = 保存、draft を外す = 公開、の 2 段にする。
 *   CI の検証ビルド     … INCLUDE_DRAFTS=1 を立てて含める。
 *   ローカルの dev      … 含める。書いている途中のものが見えないと困る。
 *
 * CI で含めるのが要点。下書きページが一度も描画されないと、related の壊れリンクや
 * Markdown の破綻を検証がすり抜けてしまう。PR の中身は必ず下書きなので、
 * 本番と同じ条件でビルドしても意味がない。
 */
export const includeDrafts =
  import.meta.env.INCLUDE_DRAFTS === "1" || import.meta.env.DEV;

/** 見本を除いた記事。新しい順。draft の扱いは includeDrafts に従う。 */
export async function getImagingPosts(): Promise<ImagingPost[]> {
  const all = await getCollection("imaging", ({ data }) =>
    includeDrafts ? true : !data.draft,
  );
  return all
    .filter((e) => e.id !== TEMPLATE_ID)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * related を解決する。存在しない slug があればビルドを止める。
 *
 * reference() はスキーマ検証の時点では形しか見ておらず、実在は確かめない。
 * 存在しない id を getEntries() に渡すと console.warn を出して undefined を
 * 返すだけで、ビルドは緑のまま通る（astro/dist/content/runtime.js:129）。
 * Claude が実在しない slug を related に書いたときに気づけないので、ここで落とす。
 */
export async function resolveRelated(post: ImagingPost): Promise<ImagingPost[]> {
  const refs = post.data.related;
  if (refs.length === 0) return [];

  const resolved = await getEntries(refs);
  const missing = refs
    .filter((_, i) => resolved[i] === undefined)
    .map((r) => r.id);

  if (missing.length > 0) {
    throw new Error(
      `[imaging] ${post.id}: related に存在しない記事があります → ${missing.join(", ")}\n` +
        `src/content/imaging/ にあるファイル名（拡張子なし）を書いてください。`,
    );
  }

  return resolved as ImagingPost[];
}

export const CATEGORY_LABEL: Record<ImagingPost["data"]["category"], string> = {
  methods: "手法",
  tools: "ツール",
  stats: "統計",
  misc: "その他",
};

export const KIND_LABEL: Record<"docs" | "paper" | "repo" | "web", string> = {
  docs: "公式ドキュメント",
  paper: "論文",
  repo: "リポジトリ",
  web: "Web",
};
