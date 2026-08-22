---
title: BOLD 信号は何を測っているのか
description: fMRI が測っているのは神経活動そのものではなく、脱酸素化ヘモグロビンの増減に伴う MR 信号の変化である。その仕組みと、神経活動との対応、解析や結果の記述で気をつける点を整理する。
pubDate: 2026-08-22
draft: true
category: methods
tags:
  - fMRI
  - BOLD
  - 血行動態
  - 神経血管カップリング
sources:
  - title: "Pauling L, Coryell CD. The Magnetic Properties and Structure of Hemoglobin, Oxyhemoglobin and Carbonmonoxyhemoglobin. Proc Natl Acad Sci U S A. 1936;22(4):210-6."
    url: https://doi.org/10.1073/pnas.22.4.210
    kind: paper
  - title: "Ogawa S, et al. Brain magnetic resonance imaging with contrast dependent on blood oxygenation. Proc Natl Acad Sci U S A. 1990;87(24):9868-72."
    url: https://doi.org/10.1073/pnas.87.24.9868
    kind: paper
  - title: "Fox PT, Raichle ME. Focal physiological uncoupling of cerebral blood flow and oxidative metabolism during somatosensory stimulation in human subjects. Proc Natl Acad Sci U S A. 1986;83(4):1140-4."
    url: https://doi.org/10.1073/pnas.83.4.1140
    kind: paper
  - title: "Kwong KK, et al. Dynamic magnetic resonance imaging of human brain activity during primary sensory stimulation. Proc Natl Acad Sci U S A. 1992;89(12):5675-9."
    url: https://doi.org/10.1073/pnas.89.12.5675
    kind: paper
  - title: "Drew PJ. Vascular and neural basis of the BOLD signal. Curr Opin Neurobiol. 2019;58:61-9."
    url: https://doi.org/10.1016/j.conb.2019.06.004
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
related:
  - mri-signal-basics
fromIssue: 3
---

## 3行まとめ

- fMRI が測っているのは神経活動そのものではなく、脱酸素化ヘモグロビンの増減が引き起こす MR 信号の変化である。
- 活動した部位で信号が上がるのは、血流の増加が酸素消費の増加を大きく上回り、静脈血の酸素化がかえって進むためである。
- BOLD が反映しているのは、その領域が出す発火出力よりも、そこに入ってくる入力と領域内での処理である。

## 血液の磁気的性質は酸素化で変わる

ヘモグロビン（hemoglobin, Hb）は赤血球の中にあるタンパク質で、肺で取り込んだ酸素を末梢の組織へ運ぶ。1分子は4つのヘムを持ち、各ヘムの中心に鉄イオンが1個ある。酸素はこの鉄イオンに結合する。酸素が結合していれば酸素化ヘモグロビン（oxyhemoglobin, oxyHb）、手放していれば脱酸素化ヘモグロビン（deoxyhemoglobin, deoxyHb）である。

物質を磁場の中に置くと、その物質自身もわずかに磁化する。どれだけ磁化するかを表す量が磁化率（magnetic susceptibility）である。磁化率が負の物質は外部磁場を打ち消す向きに磁化する。反磁性体（diamagnetic）と呼ばれるもので、水をはじめ生体組織の大部分がこれにあたる。逆に磁化率が正の物質は外部磁場と同じ向きに磁化して周囲の磁場を局所的に強め、対を作っていない電子（不対電子）を持つ原子や分子でこの常磁性（paramagnetic）が現れる。

ヘモグロビンの磁気的性質を測定した研究により、oxyHb は磁気モーメントを持たず反磁性であること、deoxyHb は常磁性であることが示された[1](#ref-1)。鉄イオンに酸素が結合すると電子が対を作り、不対電子が消えるからである。

血液の磁化率はその中に含まれる deoxyHb の量で決まり、deoxyHb が多い血液ほど、周囲の組織より常磁性の側に寄っていく。

## BOLD 信号とは何か

血管の中に deoxyHb があると血管の内側と外側で磁化率が食い違い、この食い違いが血管の周囲に微小な磁場の乱れを作る。乱れは血管の壁で止まらず、外の組織にも及ぶ。

磁場が乱れた領域では、そこにある水分子の水素原子核が場所ごとに違う速さで回転し、位相が速くばらける。実効的な横緩和時間 T2\* が短くなり、グラディエントエコー（gradient echo, GE）法で撮った画像ではその領域の信号が下がる。MR 信号が位相の揃いで決まる仕組みと、GE 法が磁場の乱れに敏感である理由は [MRI の信号はどこから来るのか](/imaging/mri-signal-basics) で扱っている。

deoxyHb が多いほど信号は低く、少ないほど信号は高い。血液の酸素化の状態に依存するこの信号変化が、血中酸素濃度依存（blood oxygenation level-dependent, BOLD）信号である。MRI で脳の機能を調べる手法が機能的磁気共鳴画像法（functional MRI, fMRI）であり、そこで標準的に撮られているのがこの BOLD 信号にあたる。

deoxyHb はもともと血液の中にあるので、外から投与する造影剤と違って BOLD 撮像に造影剤は要らない。高磁場と GE 法によってこの内因性の造影効果を強調すると、血液酸素化のレベルを反映した脳微小血管の画像が得られる。これはラットの脳で最初に示された[2](#ref-2)。

## なぜ活動すると信号が上がるのか

神経活動が増えれば酸素消費も増えるのだから、deoxyHb が増えて信号は下がりそうに見える。実際は逆である。

ヒトの体性感覚刺激を用いた陽電子放射断層撮影（positron emission tomography, PET）の研究では、局所脳血流の増加が平均 29% だったのに対し、組織の代謝率の増加は平均 5% にとどまった[3](#ref-3)。血流の増加が酸素消費の増加を大きく上回るため、静脈側の血液はかえって酸素化が進む。deoxyHb の濃度が下がり、T2\* が延び、GE 画像の信号が上がる。

BOLD で明るくなる場所は、酸素を使っている場所というより、血流が過剰に供給されている場所である。

## どれだけ、いつ変化するのか

変化は小さく、遅い。ヒトの一次視覚野を 8 Hz の点滅刺激で賦活した初期の研究では、GE 法での信号上昇は 1.8 ± 0.8%、立ち上がりの時定数は 4.4 ± 2.2 秒だった[4](#ref-4)。数パーセント以下の変化が、秒のオーダーで遅れて現れる。

血管側の応答も一様ではない。動脈は神経活動の増加から 1 秒以内に能動的に拡張するのに対し、静脈の拡張は受動的で、数十秒にわたって続く[5](#ref-5)。BOLD はこの血管網全体の応答の総和を見ている。

遅れた応答を統計モデルで扱うために使うのが、血行動態応答関数（hemodynamic response function, HRF）である。ごく短い神経活動が1回起きたとき、BOLD がどう立ち上がってどう戻るか、その形を表した関数である。

HRF から実際の刺激系列に対する予測波形を組み立てる手続きが、畳み込み（convolution）である。刺激が起きた各時刻に HRF のコピーを置き、それらを足し合わせる。これで、刺激系列から予測される BOLD の時間波形が得られる。

この手続きが成り立つには、系が線形時不変（linear time-invariant, LTI）であることが要る。線形とは、刺激の強さを2倍にすれば応答も2倍になり、2つの刺激を同時に与えたときの応答がそれぞれの応答の和になることを指す。時不変とは、刺激を与える時刻をずらせば応答も同じだけずれ、形そのものは変わらないことを指す。

ヒト V1 での検証により、BOLD 応答は刺激の時間構造と強度に対して、線形時不変系として近似してよいことが示された[6](#ref-6)。畳み込みで作った予測波形を説明変数とし、画像の各単位（voxel, ボクセル）で観測された時系列を回帰する枠組みが一般線形モデル（general linear model, GLM）である。標準的な解析はこの線形近似の上に成り立っており、近似が崩れる条件では手続きの前提も崩れる。

## 神経活動の何に対応しているのか

血流を動かしている神経活動のうち、BOLD がどの側面に対応するかは、電気生理との同時記録で調べられている。

電極で記録される信号は、周波数帯で分けて扱われる。高い周波数の成分を取り出すと、電極の近傍にあるニューロンが発する活動電位を捉えられる。多ユニット発火活動（multi-unit activity, MUA）と呼ばれるこの成分は、その領域が出力として送り出している信号にあたる。

一方、低い周波数の成分は局所電場電位（local field potential, LFP）で、シナプスに入ってきた入力が作る電流と、領域内での処理に伴う電位変化が主に反映される。

サルの視覚野で電気生理と BOLD を同時記録した研究では、MUA よりも LFP のほうが BOLD をよく説明した[7](#ref-7)。BOLD が映しているのは、その領域が出す発火出力よりも、その領域に入ってくる入力と領域内での処理だと考えられる。

ある領域の BOLD が上がったとき、そこのニューロンが盛んに発火しているとは限らない。入力を受けて処理しているが出力は出していない、という状態でも BOLD は上がりうる。

## BOLD から言えること、言えないこと

fMRI から言えるのは「この条件で BOLD 信号が有意に増加した」までであり、「この領域のニューロンが発火した」ではない[8](#ref-8)。両者は食い違いうるので、「活動」と「BOLD 変化」を書き分けるかどうかは単なる言葉遣いの問題ではない。

時間分解能も撮像の設定だけでは決まらない。撮像間隔（repetition time, TR）を短くすればサンプリングは細かくなるが、血行動態そのものが持つ秒オーダーの遅れは縮まない。数百ミリ秒差の神経事象を分離したい場合、TR ではなく実験デザインで解く問題になる。

空間的な位置は血管網に引きずられる。拡張応答は細動脈から静脈まで血管網全体に分布している[5](#ref-5)。BOLD のピークがどこに立つかは、神経活動の分布だけでなく、その場の血管構造にも依存する。

信号欠損も BOLD の感度と同じ物理から来る。副鼻腔や側頭骨の近傍では空気と組織の磁化率差が大きく、GE 法ではその付近の信号が落ちる。前頭眼窩野や下側頭葉を扱う研究では、この欠損が結果を左右する。

そして神経活動と血行動態の結合は定数ではない。行動状態や脳領域によっては、両者の結合が弱くなることも、符号が逆転することもある。神経活動から BOLD への変換を、どこでも同じ固定の関数として扱ってよいわけではない。
