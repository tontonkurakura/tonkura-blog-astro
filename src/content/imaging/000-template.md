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

## この疑問が生じる場面

読者がどこで詰まったのかを1段落で書く。Issue の「なぜ知りたいか」がそのまま切り口になる。

## 結論

先に答えを書く。ここだけ読んで用が足りる状態にする。

## 仕組み

なぜそうなるのかを説明する。専門用語は初出で英語を併記する。例：安静時機能的結合（resting-state functional connectivity, rsFC）。

## 実務上の注意

よくある誤解、パラメータを選ぶときの判断材料、落とし穴。数値や閾値を書くときは必ず出典を伴わせる。

## 出典

出典は本文に書かず frontmatter の `sources` に入れる。ページ下部に自動で描画される。`kind` が `docs` か `paper` のもの（一次資料）が最低1件ないとビルドが落ちる。
