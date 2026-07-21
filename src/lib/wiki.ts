import { getCollection, type CollectionEntry } from "astro:content";

export const TEMPLATE_ID = "q-000";

export type WikiEntry = CollectionEntry<"wiki">;

/** frontmatter の id（q-003）→ エントリの対応。ルーティングとリンクに使う。 */
export async function getWikiById(): Promise<Map<string, WikiEntry>> {
  const all = await getCollection("wiki");
  return new Map(all.map((e) => [e.data.id, e]));
}

/** 見本（q-000）を除いた実際の問い。id 昇順。 */
export async function getRealQuestions(): Promise<WikiEntry[]> {
  const all = await getCollection("wiki");
  return all
    .filter((e) => e.data.id !== TEMPLATE_ID)
    .sort((a, b) => a.data.id.localeCompare(b.data.id));
}

/** この問いを depends_on / related から指している問い（逆リンク）。 */
export function backlinksFor(id: string, all: WikiEntry[]): WikiEntry[] {
  return all
    .filter((e) => e.data.id !== id)
    .filter(
      (e) => e.data.depends_on.includes(id) || e.data.related.includes(id),
    )
    .sort((a, b) => a.data.id.localeCompare(b.data.id));
}
