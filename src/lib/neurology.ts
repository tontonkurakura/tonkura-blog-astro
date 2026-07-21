import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/content/neurology");

export interface TreeNode {
  name: string; // 表示名（ディレクトリ名 or ファイル basename）
  slug?: string; // 葉（.md）のときの entry.id
  children: TreeNode[];
}

/** そのディレクトリの order.json（子の並び順）。拡張子 .md は落として比較する。 */
function readOrder(dirRel: string): string[] {
  const f = path.join(ROOT, dirRel, "order.json");
  if (!fs.existsSync(f)) return [];
  try {
    const arr = JSON.parse(fs.readFileSync(f, "utf8")).order as string[];
    return (arr ?? []).map((n) => n.replace(/\.md$/, ""));
  } catch {
    return [];
  }
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
        child = { name: part, children: [] };
        node.children.push(child);
      }
      if (isLeaf) child.slug = entry.id;
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
