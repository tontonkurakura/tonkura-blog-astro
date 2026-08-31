"use client";

import { useState } from "react";
import React from "react";
import type { HDSRScores } from "@/types/calculator";

export default function HDSRCalculator() {
  const [scores, setScores] = useState<HDSRScores>({
    totalScore: 0,
    age: 1,
    date_weekday: 1,
    date_day: 1,
    date_month: 1,
    date_year: 1,
    location: 2,
    words_1: 1,
    words_2: 1,
    words_3: 1,
    calc_1: 1,
    calc_2: 1,
    calc_3: 0,
    calc_4: 0,
    calc_5: 0,
    reverse_3digit: 1,
    reverse_4digit: 1,
    recall_1: 2,
    recall_2: 2,
    recall_3: 2,
    items_1: 1,
    items_2: 1,
    items_3: 1,
    items_4: 1,
    items_5: 1,
    vegetables: 5,
  });

  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const name = button.getAttribute("data-name") as keyof HDSRScores;
    const value = parseInt(button.value, 10);
    setScores((prevScores) => ({
      ...prevScores,
      [name]: value,
    }));
  };

  const calculateScore = (): number => {
    const dateScore =
      scores.date_weekday +
      scores.date_day +
      scores.date_month +
      scores.date_year;
    const wordsScore = scores.words_1 + scores.words_2 + scores.words_3;
    const calcScore = scores.calc_1 + scores.calc_2;
    const reverseScore = scores.reverse_3digit + scores.reverse_4digit;
    const recallScore = scores.recall_1 + scores.recall_2 + scores.recall_3;
    const itemsScore =
      scores.items_1 +
      scores.items_2 +
      scores.items_3 +
      scores.items_4 +
      scores.items_5;

    return (
      scores.age +
      dateScore +
      scores.location +
      wordsScore +
      calcScore +
      reverseScore +
      recallScore +
      itemsScore +
      scores.vegetables
    );
  };

  // 各カテゴリーのスコアを計算する関数
  const calculateCategoryScores = () => {
    return {
      age: scores.age,
      timeOrientation:
        scores.date_weekday +
        scores.date_day +
        scores.date_month +
        scores.date_year,
      placeOrientation: scores.location,
      immediateRecall: scores.words_1 + scores.words_2 + scores.words_3,
      calculation: scores.calc_1 + scores.calc_2,
      recall: scores.recall_1 + scores.recall_2 + scores.recall_3,
      reverse: scores.reverse_3digit + scores.reverse_4digit,
      items:
        scores.items_1 +
        scores.items_2 +
        scores.items_3 +
        scores.items_4 +
        scores.items_5,
      verbal: scores.vegetables,
    };
  };

  function ScoreButton({
    name,
    value,
    currentScore,
  }: {
    name: keyof HDSRScores;
    value: number;
    currentScore: number;
  }) {
    return (
      <button
        data-name={name}
        value={value}
        onClick={handleChange}
        className={`calc-choice ${currentScore === value ? "is-active" : ""}`}
      >
        {value}
      </button>
    );
  }

  const totalScore = calculateScore();
  const categoryScores = calculateCategoryScores();

  // スコアに基づいて色を決定する関数
  const getScoreLevel = () => {
    if (totalScore > 20) return "none";
    if (totalScore >= 15) return "moderate";
    if (totalScore >= 10) return "severe";
    return "critical";
  };

  // 重症度のテキストを取得する関数
  const getSeverityText = () => {
    if (totalScore > 20) return "正常";
    if (totalScore >= 15 && totalScore <= 20) return "軽症認知症の疑い";
    if (totalScore >= 10 && totalScore < 15) return "中等症認知症の疑い";
    return "重症認知症の疑い";
  };

  // カテゴリーごとのスコアの重みを段階名で返す（配色は calculator.css）
  const getCategoryState = (score: number, maxScore: number) => {
    if (score === maxScore) return "";
    const ratio = score / maxScore;
    if (ratio >= 0.6) return "";
    if (ratio >= 0.3) return "severe";
    return "critical";
  };

  return (
    <div className="calc" data-level={getScoreLevel()}>
      <h3 className="calc-title">
        改訂 長谷川式簡易認知能評価スケール (HDS-R)
      </h3>

      <div className="calc-items">
        <div>
          <label className="calc-label">
            1. 年齢の見当識
            <div className="calc-help">
              『お歳はいくつですか？』
              <div className="calc-help-text">
                （2年までの誤差は正解）
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton name="age" value={0} currentScore={scores.age} />
            <ScoreButton name="age" value={1} currentScore={scores.age} />
          </div>
        </div>

        <div>
          <label className="calc-label">
            2. 時間の見当識
            <div className="calc-help">
              『今日は何年何月何日何曜日ですか？』
              <div className="calc-help-text">（各1点）</div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            <div className="calc-choices">
              <span className="calc-help-text">曜日</span>
              <div className="calc-choices">
                <ScoreButton
                  name="date_weekday"
                  value={0}
                  currentScore={scores.date_weekday}
                />
                <ScoreButton
                  name="date_weekday"
                  value={1}
                  currentScore={scores.date_weekday}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">日</span>
              <div className="calc-choices">
                <ScoreButton
                  name="date_day"
                  value={0}
                  currentScore={scores.date_day}
                />
                <ScoreButton
                  name="date_day"
                  value={1}
                  currentScore={scores.date_day}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">月</span>
              <div className="calc-choices">
                <ScoreButton
                  name="date_month"
                  value={0}
                  currentScore={scores.date_month}
                />
                <ScoreButton
                  name="date_month"
                  value={1}
                  currentScore={scores.date_month}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">年</span>
              <div className="calc-choices">
                <ScoreButton
                  name="date_year"
                  value={0}
                  currentScore={scores.date_year}
                />
                <ScoreButton
                  name="date_year"
                  value={1}
                  currentScore={scores.date_year}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="calc-label">
            3. 場所の見当識
            <div className="calc-help">
              『私たちがいまいるところはどこですか？』
              <div className="calc-help-text">
                （自発的に答えられれば2点、5秒おいて自発的に答えられなければ「ここは家ですか？病院ですか？施設ですか？」とヒントを出し、答えられれば1点）
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="location"
              value={0}
              currentScore={scores.location}
            />
            <ScoreButton
              name="location"
              value={1}
              currentScore={scores.location}
            />
            <ScoreButton
              name="location"
              value={2}
              currentScore={scores.location}
            />
          </div>
        </div>

        <div>
          <label className="calc-label">
            4. 即時記憶
            <div className="calc-help">
              『これから言う3つの言葉を言ってみてください。』
              <div className="calc-help-text">
                系列1:「桜」「猫」「電車」
                <br />
                系列2:「梅」「犬」「自動車」
                <br />
                （各1点）
              </div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            <div className="calc-choices">
              <span className="calc-help-text">1</span>
              <div className="calc-choices">
                <ScoreButton
                  name="words_1"
                  value={0}
                  currentScore={scores.words_1}
                />
                <ScoreButton
                  name="words_1"
                  value={1}
                  currentScore={scores.words_1}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">2</span>
              <div className="calc-choices">
                <ScoreButton
                  name="words_2"
                  value={0}
                  currentScore={scores.words_2}
                />
                <ScoreButton
                  name="words_2"
                  value={1}
                  currentScore={scores.words_2}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">3</span>
              <div className="calc-choices">
                <ScoreButton
                  name="words_3"
                  value={0}
                  currentScore={scores.words_3}
                />
                <ScoreButton
                  name="words_3"
                  value={1}
                  currentScore={scores.words_3}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="calc-label">
            5. 計算
            <div className="calc-help">
              『100から7を順番に引いてください。』
              <div className="calc-help-text">
                （93まで1点、86まで2点。それ以降は不要）
              </div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            <div className="calc-choices">
              <span className="calc-help-text">93</span>
              <div className="calc-choices">
                <ScoreButton
                  name="calc_1"
                  value={0}
                  currentScore={scores.calc_1}
                />
                <ScoreButton
                  name="calc_1"
                  value={1}
                  currentScore={scores.calc_1}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">86</span>
              <div className="calc-choices">
                <ScoreButton
                  name="calc_2"
                  value={0}
                  currentScore={scores.calc_2}
                />
                <ScoreButton
                  name="calc_2"
                  value={1}
                  currentScore={scores.calc_2}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="calc-label">
            6. 数字の逆唱
            <div className="calc-help">
              『これから言う数字を逆から言ってください。』
              <div className="calc-help-text">
                3桁：「6-8-2」（1点）
                <br />
                4桁：「3-5-2-9」（1点）
              </div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            <div className="calc-choices">
              <span className="calc-help-text">2-8-6</span>
              <div className="calc-choices">
                <ScoreButton
                  name="reverse_3digit"
                  value={0}
                  currentScore={scores.reverse_3digit}
                />
                <ScoreButton
                  name="reverse_3digit"
                  value={1}
                  currentScore={scores.reverse_3digit}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">9-2-5-3</span>
              <div className="calc-choices">
                <ScoreButton
                  name="reverse_4digit"
                  value={0}
                  currentScore={scores.reverse_4digit}
                />
                <ScoreButton
                  name="reverse_4digit"
                  value={1}
                  currentScore={scores.reverse_4digit}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="calc-label">
            7. 遅延再生
            <div className="calc-help">
              『先ほど覚えていただいた3つの言葉をもう一度言ってみてください。』
              <div className="calc-help-text">
                （自発的に答えられれば2点、ヒント（植物、動物、乗り物）を与えて正答できれば1点）
              </div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            <div className="calc-choices">
              <span className="calc-help-text">1</span>
              <div className="calc-choices">
                <ScoreButton
                  name="recall_1"
                  value={0}
                  currentScore={scores.recall_1}
                />
                <ScoreButton
                  name="recall_1"
                  value={1}
                  currentScore={scores.recall_1}
                />
                <ScoreButton
                  name="recall_1"
                  value={2}
                  currentScore={scores.recall_1}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">2</span>
              <div className="calc-choices">
                <ScoreButton
                  name="recall_2"
                  value={0}
                  currentScore={scores.recall_2}
                />
                <ScoreButton
                  name="recall_2"
                  value={1}
                  currentScore={scores.recall_2}
                />
                <ScoreButton
                  name="recall_2"
                  value={2}
                  currentScore={scores.recall_2}
                />
              </div>
            </div>
            <div className="calc-choices">
              <span className="calc-help-text">3</span>
              <div className="calc-choices">
                <ScoreButton
                  name="recall_3"
                  value={0}
                  currentScore={scores.recall_3}
                />
                <ScoreButton
                  name="recall_3"
                  value={1}
                  currentScore={scores.recall_3}
                />
                <ScoreButton
                  name="recall_3"
                  value={2}
                  currentScore={scores.recall_3}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="calc-label">
            8. 視覚性記憶
            <div className="calc-help">
              『これから5つの品物を見せます。それを隠しますので何があったか言ってください。』
              <div className="calc-help-text">
                「鉛筆」「時計」「スプーン」「鍵」「歯ブラシ」
                <br />
                （各1点）
              </div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            {["鉛筆", "時計", "スプーン", "鍵", "歯ブラシ"].map(
              (item, index) => (
                <div key={item} className="calc-choices">
                  <span className="calc-help-text">{item}</span>
                  <div className="calc-choices">
                    <ScoreButton
                      name={`items_${index + 1}`}
                      value={0}
                      currentScore={
                        scores[`items_${index + 1}` as keyof HDSRScores]
                      }
                    />
                    <ScoreButton
                      name={`items_${index + 1}`}
                      value={1}
                      currentScore={
                        scores[`items_${index + 1}` as keyof HDSRScores]
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <label className="calc-label">
            9. 語想起
            <div className="calc-help">
              『知っている野菜の名前をできるだけ多く言ってください。』
              <div className="calc-help-text">
                （6個で1点、以降1つにつき1点追加。10個以上で5点）
              </div>
            </div>
          </label>
          <div className="calc-choices calc-choices--stack">
            <div className="calc-choices">
              <div className="calc-choices">
                {[5, 6, 7, 8, 9, 10].map((count) => (
                  <div key={count} className="calc-bar__main">
                    <span className="calc-help-text">
                      {count}個{count === 5 ? "以下" : ""}
                    </span>
                    <ScoreButton
                      name="vegetables"
                      value={Math.max(0, Math.min(5, count - 5))}
                      currentScore={scores.vegetables}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* フローティングスコア表示 */}
        <div
          className="calc-bar"
        >
          <div className="calc-bar__main">
            <span className="calc-bar__label">合計点:</span>
            <span className="calc-bar__value">{totalScore}</span>
            <span className="calc-bar__ref">/30</span>
          </div>
          <div className="calc-bar__side">
            <button
              onClick={() => {
                setScores({
                  totalScore: 0,
                  age: 1,
                  date_weekday: 1,
                  date_day: 1,
                  date_month: 1,
                  date_year: 1,
                  location: 2,
                  words_1: 1,
                  words_2: 1,
                  words_3: 1,
                  calc_1: 1,
                  calc_2: 1,
                  calc_3: 0,
                  calc_4: 0,
                  calc_5: 0,
                  reverse_3digit: 1,
                  reverse_4digit: 1,
                  recall_1: 2,
                  recall_2: 2,
                  recall_3: 2,
                  items_1: 1,
                  items_2: 1,
                  items_3: 1,
                  items_4: 1,
                  items_5: 1,
                  vegetables: 5,
                });
              }}
              className="calc-reset"
            >
              選択をクリア
            </button>
            <div className="calc-bar__verdict">
              {getSeverityText()}
            </div>
          </div>
        </div>

        {/* カテゴリー別スコアと評価基準 */}
        <div>
          <div className="calc-panels">
            <div className="calc-panel">
              <h3 className="calc-panel__title">
                カテゴリー別スコア
              </h3>
              <div className="calc-rows">
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.age, 1)}
                >
                  <span
                    className="calc-row__name"
                  >
                    年齢:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.age}/1
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.timeOrientation, 4)}
                >
                  <span
                    className="calc-row__name"
                  >
                    時間の見当識:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.timeOrientation}/4
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.placeOrientation, 2)}
                >
                  <span
                    className="calc-row__name"
                  >
                    場所の見当識:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.placeOrientation}/2
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.immediateRecall, 3)}
                >
                  <span
                    className="calc-row__name"
                  >
                    即時記憶:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.immediateRecall}/3
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.calculation, 2)}
                >
                  <span
                    className="calc-row__name"
                  >
                    計算:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.calculation}/2
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.recall, 6)}
                >
                  <span
                    className="calc-row__name"
                  >
                    遅延再生:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.recall}/6
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.reverse, 2)}
                >
                  <span
                    className="calc-row__name"
                  >
                    数字の逆唱:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.reverse}/2
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.items, 5)}
                >
                  <span
                    className="calc-row__name"
                  >
                    視覚性記憶:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.items}/5
                  </span>
                </div>
                <div
                  className="calc-row" data-state={getCategoryState(categoryScores.verbal, 5)}
                >
                  <span
                    className="calc-row__name"
                  >
                    語想起:
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores.verbal}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="calc-panel calc-panel--wide">
              <h3 className="calc-panel__title">重症度分類</h3>
              <div className="calc-rows">
                <div
                  className={`calc-card ${totalScore > 20 ? "is-current" : ""}`}
                >
                  <span className="calc-strong">21-30点:</span>{" "}
                  正常（認知症の可能性は低い）
                </div>
                <div
                  className={`p-2 rounded ${
                    totalScore <= 20
                      ? "bg-red-50 text-red-800 font-medium"
                      : "bg-gray-50"
                  }`}
                >
                  <div>
                    <span className="calc-strong">20点以下:</span>{" "}
                    認知症の疑い（感度93％、特異度86％）
                  </div>
                  <div className="calc-substack">
                    <div
                      className={`p-2 rounded ${
                        totalScore >= 15 && totalScore <= 20
                          ? "bg-yellow-100 text-yellow-900 font-medium border-l-4 border-yellow-500"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="calc-strong">15-20点:</span>{" "}
                      軽症認知症の疑い
                    </div>
                    <div
                      className={`p-2 rounded ${
                        totalScore >= 10 && totalScore < 15
                          ? "bg-orange-200 text-orange-900 font-medium border-l-4 border-orange-500"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="calc-strong">10-14点:</span>{" "}
                      中等症認知症の疑い
                    </div>
                    <div
                      className={`p-2 rounded ${
                        totalScore < 10
                          ? "bg-red-200 text-red-900 font-medium border-l-4 border-red-500"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="calc-strong">0-9点:</span>{" "}
                      重症認知症の疑い
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="calc-note">
            <p>※注意事項</p>
          <ul>
            <li>
                  本ツールは、臨床業務で使用されるスコアの計算補助を行うためのものです。
                </li>
                <li>
                  計算結果や重症度判定はあくまで参考所見であり、医学的な診断を保証するものではありません。
                </li>
                <li>
                  症状に関してご不安がある場合は、必ず医師や専門の医療機関にご相談ください。
                </li>
                <li>
                  本ツールの利用により生じた如何なる結果についても、当サイトは責任を負いかねます。
                </li></ul>
          </div>
        </div>
      </div>
    </div>
  );
}
