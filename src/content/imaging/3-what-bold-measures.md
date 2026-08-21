---
title: BOLD 信号は何を測っているのか
description: fMRI が測っているのは神経活動そのものではなく、脱酸素化ヘモグロビンの増減に伴う MR 信号の変化である。その仕組みと、解析や結果の記述で気をつける点を整理する。
pubDate: 2026-08-22
draft: true
category: methods
tags:
  - fMRI
  - BOLD
  - 血行動態
  - 神経血管カップリング
sources:
  - title: "Ogawa S, et al. Brain magnetic resonance imaging with contrast dependent on blood oxygenation. Proc Natl Acad Sci U S A. 1990;87(24):9868-72."
    url: https://doi.org/10.1073/pnas.87.24.9868
    kind: paper
  - title: "Fox PT, Raichle ME. Focal physiological uncoupling of cerebral blood flow and oxidative metabolism during somatosensory stimulation in human subjects. Proc Natl Acad Sci U S A. 1986;83(4):1140-4."
    url: https://doi.org/10.1073/pnas.83.4.1140
    kind: paper
  - title: "Kwong KK, et al. Dynamic magnetic resonance imaging of human brain activity during primary sensory stimulation. Proc Natl Acad Sci U S A. 1992;89(12):5675-9."
    url: https://doi.org/10.1073/pnas.89.12.5675
    kind: paper
  - title: "Boynton GM, et al. Linear systems analysis of functional magnetic resonance imaging in human V1. J Neurosci. 1996;16(13):4207-21."
    url: https://doi.org/10.1523/JNEUROSCI.16-13-04207.1996
    kind: paper
  - title: "Logothetis NK, et al. Neurophysiological investigation of the basis of the fMRI signal. Nature. 2001;412(6843):150-7."
    url: https://doi.org/10.1038/35084005
    kind: paper
  - title: "Logothetis NK. What we can do and what we cannot do with fMRI. Nature. 2008;453(7197):869-78."
    url: https://doi.org/10.1038/nature06976
    kind: paper
  - title: "Drew PJ. Vascular and neural basis of the BOLD signal. Curr Opin Neurobiol. 2019;58:61-9."
    url: https://doi.org/10.1016/j.conb.2019.06.004
    kind: paper
related: []
fromIssue: 3
---

## この疑問が生じる場面

神経画像の論文を開くと、脳の断面に赤や黄色のクラスタを重ねた図が必ず出てくる。図の説明にはたいてい「課題中に活動した領域」と書かれている。読む分にはそれで済む。だが自分で解析する側に回ると、この一行が急に重くなる。前処理でどの信号を残すか、統計モデルに何を入れるか、結果をどう記述するかが、あの色が何なのかという理解に全部ぶら下がっているためである。

## 結論

機能的磁気共鳴画像法（functional MRI, fMRI）が測っているのは、神経活動そのものではない。測っているのは、血液中の脱酸素化ヘモグロビン（deoxyhemoglobin, deoxyHb）の量が変わることで生じる MR 信号の変化である。これを血中酸素濃度依存（blood oxygenation level-dependent, BOLD）信号と呼ぶ。神経活動は、血流という中継を一段はさんで間接的に推定されているにすぎない。

さらに踏み込むと、BOLD は神経活動の中でも特定の側面に偏って対応している。サルの視覚野で電気生理と BOLD を同時記録した研究では、多ユニット発火活動（multi-unit activity, MUA）よりも局所電場電位（local field potential, LFP）のほうが BOLD をよく説明した。BOLD が映しているのは、その領域が出す発火出力よりも、その領域に入ってくる入力と領域内での処理だと考えられる。

## 仕組み

### 脱酸素化ヘモグロビンが内因性の造影剤になる

deoxyHb は常磁性を持つ。酸素化ヘモグロビンとの磁化率の差が血管の周囲に微小な磁場の乱れを作り、その中にある水素原子核の位相がばらけていく。結果として横緩和時間 T2* が短くなり、グラディエントエコー（gradient echo, GE）法で撮った画像の信号が下がる。外から投与する造影剤と違い、deoxyHb はもともと血液の中にある。BOLD 撮像に造影剤が要らないのはこのためである。

### 活動すると信号は上がる

ここで直感に反することが起きる。神経活動が増えれば酸素消費も増えるのだから、deoxyHb は増えて信号は下がりそうに思える。実際は逆である。ヒトの体性感覚刺激を用いた PET 研究では、局所脳血流の増加が平均 29% だったのに対し、組織の代謝率の増加は平均 5% にとどまった。血流の増加が酸素消費の増加を大きく上回るため、静脈側の血液はかえって酸素化が進む。deoxyHb の濃度が下がり、T2* が延び、GE 画像の信号が上がる。BOLD で明るくなる場所は、酸素を使っている場所というより、必要以上に血を送られている場所である。

### 応答は遅く、小さい

この変化は速くない。ヒトの一次視覚野を 8 Hz の点滅刺激で賦活した初期の研究では、GE 法での信号上昇は 1.8 ± 0.8%、立ち上がりの時定数は 4.4 ± 2.2 秒だった。数%ではなく 1 桁%であり、秒のオーダーで遅れる。血管側の応答も一様ではない。動脈は神経活動の増加から 1 秒以内に能動的に拡張するのに対し、静脈の拡張は受動的で、数十秒にわたって続く。

### だから畳み込みで扱える

数秒遅れて数%変化する応答を、どう統計モデルに載せるか。ここで使うのが血行動態応答関数（hemodynamic response function, HRF）である。ヒト V1 での検証により、BOLD 応答は刺激の時間構造と強度に対して線形時不変系として近似してよいことが示された。刺激系列を HRF で畳み込み、それを説明変数として一般線形モデル（general linear model, GLM）に入れるという標準的な手続きは、この線形近似の上に成り立っている。逆に言えば、近似が崩れる条件では、この手続きの前提も崩れる。

## 実務上の注意

**「活動」と「BOLD 変化」を書き分ける。** 結果を記述するときに効いてくる。fMRI から言えるのは「この条件で BOLD 信号が有意に増加した」までであり、「この領域のニューロンが発火した」ではない。この区別は言葉遣いの潔癖さの問題ではない。LFP との対応を踏まえれば、賦活が入力や局所処理を反映していて発火出力を伴わない可能性が残るためである。

**時間分解能は TR では決まらない。** 撮像間隔（repetition time, TR）を短くすればサンプリングは細かくなる。しかし血行動態そのものが持つ秒オーダーの遅れは縮まない。数百ミリ秒差の神経事象を BOLD で分離しようとするなら、TR ではなく実験デザインで解く問題になる。

**空間的な位置は血管網に引きずられる。** 拡張応答は細動脈から静脈まで血管網全体に分布しており、BOLD はその総和を見ている。静脈側の応答は受動的で遅い。BOLD のピークがどこに立つかは、神経活動の分布だけでなく、その場の血管構造にも依存する。

**神経活動と血行動態の結合は定数ではない。** 行動状態や脳領域によっては、両者の結合が弱くなることも、符号が逆転することもある。神経活動から BOLD への変換を、どこでも同じ固定の関数として扱ってよいわけではない。
