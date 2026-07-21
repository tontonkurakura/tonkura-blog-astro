import { visit } from "unist-util-visit";
import path from "node:path";

// 神経内科ノートの Markdown 内にある相対パス画像を、public/neurology-media/
// 配下の絶対パスに書き換える。
//
// 画像は同居の相対参照（assets/x.png や Exported%20image.png）で埋め込まれており、
// かつ原コンテンツに壊れリンクが混じっている。Astro の画像最適化は存在しない画像で
// ビルドを止めてしまうため、root 相対の public パスに寄せて「最適化せず静的配信・
// 壊れリンクは 404（旧レンダラと同じ挙動）」にする。
const MARKER = "/content/neurology/";

export default function remarkNeurologyImages() {
  return (tree, file) => {
    const fp = file.path || file.history?.[0] || "";
    const idx = fp.indexOf(MARKER);
    if (idx === -1) return; // 神経ノート以外は触らない

    const mdRel = fp.slice(idx + MARKER.length); // 例: Diseases/.../封入体筋炎.md
    const mdDir = path.posix.dirname(mdRel);

    visit(tree, "image", (node) => {
      const url = node.url;
      if (!url) return;
      if (/^(https?:)?\/\//.test(url) || url.startsWith("/")) return; // 外部・絶対は対象外

      const decoded = decodeURIComponent(url);
      const joined = path.posix.normalize(path.posix.join(mdDir, decoded));
      node.url = "/neurology-media/" + joined;
    });
  };
}
