import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/content/neurology");

export interface TreeNode {
  name: string; // スラッグ（英小文字）。order.json との照合と並べ替えに使う
  label?: string; // 表示名（日本語）。葉は frontmatter title、枝は order.json の label
  slug?: string; // 葉（.md）のときの entry.id
  children: TreeNode[];
}

/** order.json を読む。order は拡張子 .md を落として比較する。 */
function readOrderFile(dirRel: string): { label?: string; order: string[] } {
  const f = path.join(ROOT, dirRel, "order.json");
  if (!fs.existsSync(f)) return { order: [] };
  try {
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    return {
      label: j.label,
      order: ((j.order ?? []) as string[]).map((n) => n.replace(/\.md$/, "")),
    };
  } catch {
    return { order: [] };
  }
}

function readOrder(dirRel: string): string[] {
  return readOrderFile(dirRel).order;
}

/**
 * ディレクトリの表示名。
 *
 * ファイル名・ディレクトリ名を英小文字スラッグに統一したとき、日本語の表示名を
 * 各 order.json の label に退避した。無ければスラッグをそのまま出す。
 */
export function sectionLabel(dirRel: string): string {
  return readOrderFile(dirRel).label ?? dirRel;
}

/** order.json を反映して子を並べ替える。定義に無いものは後ろに五十音順で。 */
function sortChildren(children: TreeNode[], dirRel: string): TreeNode[] {
  const order = readOrder(dirRel);
  const rank = (n: string) => {
    const i = order.indexOf(n);
    return i === -1 ? order.length : i;
  };
  return [...children].sort((a, b) => {
    const d = rank(a.name) - rank(b.name);
    return d !== 0 ? d : a.name.localeCompare(b.name, "ja");
  });
}

/** 神経内科ノートのツリーを構築する（ディレクトリ＝枝、.md＝葉）。 */
export async function buildNeurologyTree(): Promise<TreeNode[]> {
  const entries = await getCollection("neurology");
  const root: TreeNode = { name: "", children: [] };

  for (const entry of entries) {
    const parts = entry.id.split("/");
    let node = root;
    parts.forEach((part, i) => {
      const isLeaf = i === parts.length - 1;
      let child = node.children.find((c) => c.name === part);
      if (!child) {
        // name はスラッグ（並べ替えと照合に使う）。label が実際の表示名。
        child = { name: part, children: [] };
        node.children.push(child);
      }
      if (isLeaf) {
        child.slug = entry.id;
        child.label = entry.data.title ?? part;
      } else {
        child.label ??= sectionLabel(parts.slice(0, i + 1).join("/"));
      }
      node = child;
    });
  }

  // 各階層を order.json で並べ替える
  const sortRec = (node: TreeNode, dirRel: string) => {
    node.children = sortChildren(node.children, dirRel);
    for (const c of node.children) {
      if (c.children.length) sortRec(c, dirRel ? `${dirRel}/${c.name}` : c.name);
    }
  };
  sortRec(root, "");

  return root.children;
}
