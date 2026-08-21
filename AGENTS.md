# tonkura-blog-astro

神経内科・神経画像のノートとブログ。Next.js 版 `tonkura-blog` からの移行版で、まだ本番には出ていない。
移行の判断と切替時の未決事項は `DECISIONS.md` にある。**作業を始める前に読むこと。**

## 開発

```bash
npm run dev        # astro dev
npm run build      # 本番ビルド（draft は出ない）
npm run build:ci   # INCLUDE_DRAFTS=1。下書きも描画する。検証はこちらを使う
npm run lint:text  # textlint（src/content/imaging のみ）
```

Astro 7 / content collections。**スキーマは `src/content.config.ts`**（`src/content/config.ts` は
Astro 4 時代のレガシーパスで、こちらは読まれない。作らないこと）。

## コンテンツの構成

| コレクション | 中身 | 誰が書くか |
|---|---|---|
| `blog` | 個人ノート（6本） | 人 |
| `wiki` | 高次脳機能部の勉強会で出た問い | 人 |
| `database` | 高次脳機能症候の事典 | 人 |
| `neurology` | 神経内科ノート（Obsidian 由来、319本） | 人 |
| `imaging` | **神経画像解析の方法論解説。Issue の疑問 1 つ = 記事 1 本** | Claude が下書きし、人が検証して merge |

以下は `imaging` を書くときの作法である。他のコレクションには適用しない。

## 読者

神経画像解析をやっている（あるいはこれから始める）研究者。
Python と Linux は使えるが、その手法については初心者。

## 文体

- 日本語。**だ・である調**（textlint が混在を落とす）。
- 専門用語は初出で英語を併記する：安静時機能的結合（resting-state functional connectivity, rsFC）
- 「〜と言われています」を使わない。誰がそう言ったのか出典を出す。
- 一人称は「筆者」。

## 構成（1500〜3000字）

1. その疑問が生じる場面を1段落
2. 結論を先に
3. 仕組みの説明
4. 実務上の注意 / よくある誤解

出典は本文に書かない。frontmatter の `sources` に入れる。ページ下部に自動で描画される。

## 禁止

- **絵文字。**
- **出典のない数値・閾値・パラメータ推奨値。**
- 論文の要旨を読んだだけで結論を断定すること。一次資料（公式ドキュメント or 原著）を最低1件は当たる。
- **体験談の捏造。** 実際にやっていないことを「筆者の環境では〜だった」と書かない。
- 未検証の推測を断定形で書くこと。不確かなら「〜と考えられるが、一次資料で確認が必要」と明示する。
- **著作物の転載。** 論文本文・公式ドキュメントの原文を訳して貼らない。引用は必要最小限にとどめ、
  自分の言葉で説明し直す。図表を複製しない。
- **患者情報。このリポジトリは public である。** 症例・画像・所見を書かない。扱うのは方法論の一般解説だけで、
  筆者自身の研究内容も書かない。

## 機械が落とすもの（プロンプトで頑張らなくてよい）

`npm run build:ci` と `npm run lint:text` が CI で走る。次は自動で落ちる：

- `sources` が2件未満
- `sources` に `kind: docs` か `kind: paper` が1件もない（＝一次資料に当たっていない）
- `title` が8〜60字の外、`description` が40〜160字の外
- `tags` が2〜6個の外
- `related` に存在しない記事の slug がある
- だ・である調とですます調の混在、1文120字超、読点5つ以上

## 記事ファイルの置き方

`src/content/imaging/{Issue番号}-{英語スラッグ}.md`（例: `12-fmriprep-confounds.md`）。
フラット配置。**category をパスに含めない** — 分類し直したときに URL と `related` が両方壊れるため。

`draft` は**必ず `true`** で出す。外すのは人の操作である（merge = 保存、draft を外す = 公開）。
`src/content/imaging/000-template.md` が見本。スキーマの型崩れに気づくために置いてあるので削除しない。
