---
title: 見本記事（スキーマ検証用のテンプレート）
description: この記事は実際の解説ではなく、frontmatter の項目とページの描画を確かめるために置いている見本である。
pubDate: 2026-08-21
draft: true
category: misc
tags:
  - template
  - meta
sources:
  - title: Astro / Content collections
    url: https://docs.astro.build/en/guides/content-collections/
    kind: docs
  - title: anthropics/claude-code-action
    url: https://github.com/anthropics/claude-code-action
    kind: repo
related: []
---

> **これは実際の記事ではない。** frontmatter の項目と本文テンプレの描画を確かめるために置いている見本である。一覧からは除外され、`draft: true` なので本番ビルドにも出ない。削除するとコレクションが空になり、スキーマの型崩れに気づけなくなるため残しておくこと。

## 3行まとめ

- 疑問への答えを3行で書く。ここだけ読んで用が足りる状態にする。
- 断定できることと、できないことを分ける。不確かなら「〜と考えられる」と書く。
- 数値を入れるなら出典が要る。`sources` にないことは書かない。

## （論理の最初の一歩を見出しにする）

基礎から積み上げる。用語は初出で英語を併記する。例：安静時機能的結合（resting-state functional connectivity, rsFC）。見出しは定型ではなく、その記事の論理に合わせて付ける。疑問形でもよい。

## （次の一歩）

前の節で定義した用語を使って次を説明する。読者が知らない状態から辿れる順に並べること。結論から逆算した順にしない。

## 実務上の注意

よくある誤解、パラメータを選ぶときの判断材料、落とし穴。数値や閾値を書くときは必ず出典を伴わせる。

---

**この見本について。** 「この疑問が生じる場面」という節は作らない（蛇足になる）。3行まとめの前後に前置きや繋ぎの一文を置かない。語りの接続（「ここで直感に反することが起きる」「言い換えると」）を使わず淡々と書く。`出典` と `関連する記事` という H2 も本文で使わない（ページ側が自動で出す）。出典は frontmatter の `sources` に入れ、本文に引用マーカーを置かない。`kind` が `docs` か `paper` のもの（一次資料）が最低1件ないとビルドが落ちる。
