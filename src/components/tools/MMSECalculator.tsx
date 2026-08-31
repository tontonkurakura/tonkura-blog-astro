"use client";

import { useState } from "react";
import React from "react";
import type { MMSEScores } from "@/types/calculator";

export default function MMSECalculator() {
  const [scores, setScores] = useState<MMSEScores>({
    totalScore: 0,
    time_year: 1,
    time_season: 1,
    time_day: 1,
    time_month: 1,
    time_date: 1,
    place_prefecture: 1,
    place_city: 1,
    place_hospital: 1,
    place_floor: 1,
    place_region: 1,
    recall_1: 1,
    recall_2: 1,
    recall_3: 1,
    calculation_1: 1,
    calculation_2: 1,
    calculation_3: 1,
    calculation_4: 1,
    calculation_5: 1,
    delayed_recall_1: 1,
    delayed_recall_2: 1,
    delayed_recall_3: 1,
    naming_1: 1,
    naming_2: 1,
    repeat_sentence: 1,
    follow_command_1: 1,
    follow_command_2: 1,
    follow_command_3: 1,
    read_follow: 1,
    write_sentence: 1,
    copy_figure: 1,
  });

  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const name = button.getAttribute("data-name") as keyof MMSEScores;
    const value = parseInt(button.value, 10);
    setScores((prevScores) => ({
      ...prevScores,
      [name]: value,
    }));
  };

  const calculateScore = (): number => {
    return Object.values(scores).reduce((acc, curr) => acc + curr, 0);
  };

  // 各カテゴリーのスコアを計算する関数
  const calculateCategoryScores = () => {
    return {
      timeOrientation:
        scores.time_year +
        scores.time_season +
        scores.time_day +
        scores.time_month +
        scores.time_date,
      placeOrientation:
        scores.place_prefecture +
        scores.place_city +
        scores.place_hospital +
        scores.place_floor +
        scores.place_region,
      memory: scores.recall_1 + scores.recall_2 + scores.recall_3,
      attention:
        scores.calculation_1 +
        scores.calculation_2 +
        scores.calculation_3 +
        scores.calculation_4 +
        scores.calculation_5,
      recall:
        scores.delayed_recall_1 +
        scores.delayed_recall_2 +
        scores.delayed_recall_3,
      naming: scores.naming_1 + scores.naming_2,
      repeat: scores.repeat_sentence,
      command:
        scores.follow_command_1 +
        scores.follow_command_2 +
        scores.follow_command_3,
      read: scores.read_follow,
      write: scores.write_sentence,
      copy: scores.copy_figure,
    };
  };

  function ScoreButton({
    name,
    value,
    currentScore,
  }: {
    name: keyof MMSEScores;
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
    if (totalScore > 27) return "none";
    if (totalScore > 23) return "mild";
    if (totalScore >= 20) return "moderate";
    if (totalScore >= 10) return "severe";
    return "critical";
  };

  // 重症度のテキストを取得する関数
  const getSeverityText = () => {
    if (totalScore > 27) return "正常";
    if (totalScore > 23 && totalScore <= 27) return "軽度認知障害(MCI)の疑い";
    if (totalScore >= 20 && totalScore <= 23) return "軽度認知症の疑い";
    if (totalScore >= 10 && totalScore < 20) return "中等度認知症の疑い";
    return "高度認知症の疑い";
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
        Mini-Mental State Examination (MMSE)
      </h3>

      {/* 新しいレイアウト - 質問とボタンを横並びに */}
      <div className="calc-items">
        {/* 時間の見当識 */}
        <div className="calc-item">
          <h4 className="calc-section-title">1. 時間の見当識 (5点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『今年は何年ですか？』</p>
              <p>『今の季節は何ですか？』</p>
              <p>『今日は何曜日ですか？』</p>
              <p>『今日は何月ですか？』</p>
              <p>『今日は何日ですか？』</p>
              <p className="calc-help-text">（各1点）</p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">年：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="time_year"
                    value={0}
                    currentScore={scores.time_year}
                  />
                  <ScoreButton
                    name="time_year"
                    value={1}
                    currentScore={scores.time_year}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">季節：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="time_season"
                    value={0}
                    currentScore={scores.time_season}
                  />
                  <ScoreButton
                    name="time_season"
                    value={1}
                    currentScore={scores.time_season}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">曜日：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="time_day"
                    value={0}
                    currentScore={scores.time_day}
                  />
                  <ScoreButton
                    name="time_day"
                    value={1}
                    currentScore={scores.time_day}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">月：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="time_month"
                    value={0}
                    currentScore={scores.time_month}
                  />
                  <ScoreButton
                    name="time_month"
                    value={1}
                    currentScore={scores.time_month}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">日：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="time_date"
                    value={0}
                    currentScore={scores.time_date}
                  />
                  <ScoreButton
                    name="time_date"
                    value={1}
                    currentScore={scores.time_date}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 場所の見当識 */}
        <div className="calc-item">
          <h4 className="calc-section-title">2. 場所の見当識 (5点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『ここは何県ですか？』</p>
              <p>『ここは何市ですか？』</p>
              <p>『ここは何病院ですか？』</p>
              <p>『ここは何階ですか？』</p>
              <p>『ここは何地方ですか？（例 関東地方）』</p>
              <p className="calc-help-text">（各1点）</p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">県：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="place_prefecture"
                    value={0}
                    currentScore={scores.place_prefecture}
                  />
                  <ScoreButton
                    name="place_prefecture"
                    value={1}
                    currentScore={scores.place_prefecture}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">市：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="place_city"
                    value={0}
                    currentScore={scores.place_city}
                  />
                  <ScoreButton
                    name="place_city"
                    value={1}
                    currentScore={scores.place_city}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">病院：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="place_hospital"
                    value={0}
                    currentScore={scores.place_hospital}
                  />
                  <ScoreButton
                    name="place_hospital"
                    value={1}
                    currentScore={scores.place_hospital}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">階：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="place_floor"
                    value={0}
                    currentScore={scores.place_floor}
                  />
                  <ScoreButton
                    name="place_floor"
                    value={1}
                    currentScore={scores.place_floor}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">地方：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="place_region"
                    value={0}
                    currentScore={scores.place_region}
                  />
                  <ScoreButton
                    name="place_region"
                    value={1}
                    currentScore={scores.place_region}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 即時記憶 */}
        <div className="calc-item">
          <h4 className="calc-section-title">3. 即時記憶 (3点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>検者は物品名３個（相互に無関係）を一秒間に一個ずつ言う。</p>
              <p>その後、被験者に繰り返させる。</p>
              <p className="calc-help-text">
                正答一個につき１点を与える。３例全て言うまで繰り返す。（６回まで）
              </p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">物品1：</span>
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
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">物品2：</span>
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
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">物品3：</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 計算 */}
        <div className="calc-item">
          <h4 className="calc-section-title">4. 計算 (5点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>
                100から順に７を引く（５回まで）。または「フジノヤマ」を逆唱させる。
              </p>
              <p className="calc-help-text">（各1点）</p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">93：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="calculation_1"
                    value={0}
                    currentScore={scores.calculation_1}
                  />
                  <ScoreButton
                    name="calculation_1"
                    value={1}
                    currentScore={scores.calculation_1}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">86：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="calculation_2"
                    value={0}
                    currentScore={scores.calculation_2}
                  />
                  <ScoreButton
                    name="calculation_2"
                    value={1}
                    currentScore={scores.calculation_2}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">79：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="calculation_3"
                    value={0}
                    currentScore={scores.calculation_3}
                  />
                  <ScoreButton
                    name="calculation_3"
                    value={1}
                    currentScore={scores.calculation_3}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">72：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="calculation_4"
                    value={0}
                    currentScore={scores.calculation_4}
                  />
                  <ScoreButton
                    name="calculation_4"
                    value={1}
                    currentScore={scores.calculation_4}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">65：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="calculation_5"
                    value={0}
                    currentScore={scores.calculation_5}
                  />
                  <ScoreButton
                    name="calculation_5"
                    value={1}
                    currentScore={scores.calculation_5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 遅延再生 */}
        <div className="calc-item">
          <h4 className="calc-section-title">5. 遅延再生 (3点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>３で提唱した物品名を再度復唱させる</p>
              <p className="calc-help-text">（各1点）</p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">物品1：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="delayed_recall_1"
                    value={0}
                    currentScore={scores.delayed_recall_1}
                  />
                  <ScoreButton
                    name="delayed_recall_1"
                    value={1}
                    currentScore={scores.delayed_recall_1}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">物品2：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="delayed_recall_2"
                    value={0}
                    currentScore={scores.delayed_recall_2}
                  />
                  <ScoreButton
                    name="delayed_recall_2"
                    value={1}
                    currentScore={scores.delayed_recall_2}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">物品3：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="delayed_recall_3"
                    value={0}
                    currentScore={scores.delayed_recall_3}
                  />
                  <ScoreButton
                    name="delayed_recall_3"
                    value={1}
                    currentScore={scores.delayed_recall_3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 物品呼称 */}
        <div className="calc-item">
          <h4 className="calc-section-title">6. 物品呼称 (2点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『（時計を見せながら）これはなんですか』</p>
              <p>『（鉛筆を見せながら）これはなんですか』</p>
              <p className="calc-help-text">（各1点）</p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">時計：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="naming_1"
                    value={0}
                    currentScore={scores.naming_1}
                  />
                  <ScoreButton
                    name="naming_1"
                    value={1}
                    currentScore={scores.naming_1}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">鉛筆：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="naming_2"
                    value={0}
                    currentScore={scores.naming_2}
                  />
                  <ScoreButton
                    name="naming_2"
                    value={1}
                    currentScore={scores.naming_2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文の復唱 */}
        <div className="calc-item">
          <h4 className="calc-section-title">7. 文の復唱 (1点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>次の文章を繰り返しさせる。</p>
              <p>「みんなで力をあわせて綱を引きます。」</p>
            </div>
            <div className="calc-choice-row">
              <span className="calc-choice-caption">評価：</span>
              <div className="calc-choices">
                <ScoreButton
                  name="repeat_sentence"
                  value={0}
                  currentScore={scores.repeat_sentence}
                />
                <ScoreButton
                  name="repeat_sentence"
                  value={1}
                  currentScore={scores.repeat_sentence}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3段階の命令 */}
        <div className="calc-item">
          <h4 className="calc-section-title">8. 3段階の命令 (3点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『右手にこの紙を持ってください』</p>
              <p>『それを半分に折りたたんでください』</p>
              <p>『それを私に渡してください』</p>
              <p className="calc-help-text">（各1点）</p>
            </div>
            <div className="calc-choices calc-choices--stack">
              <div className="calc-choice-row">
                <span className="calc-choice-caption">紙を持つ：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="follow_command_1"
                    value={0}
                    currentScore={scores.follow_command_1}
                  />
                  <ScoreButton
                    name="follow_command_1"
                    value={1}
                    currentScore={scores.follow_command_1}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">折る：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="follow_command_2"
                    value={0}
                    currentScore={scores.follow_command_2}
                  />
                  <ScoreButton
                    name="follow_command_2"
                    value={1}
                    currentScore={scores.follow_command_2}
                  />
                </div>
              </div>
              <div className="calc-choice-row">
                <span className="calc-choice-caption">渡す：</span>
                <div className="calc-choices">
                  <ScoreButton
                    name="follow_command_3"
                    value={0}
                    currentScore={scores.follow_command_3}
                  />
                  <ScoreButton
                    name="follow_command_3"
                    value={1}
                    currentScore={scores.follow_command_3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 書字命令 */}
        <div className="calc-item">
          <h4 className="calc-section-title">9. 書字命令 (1点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『次の文章を読んでその指示に従ってください。』</p>
              <p>（文章：「目を閉じなさい」）</p>
            </div>
            <div className="calc-choice-row">
              <span className="calc-choice-caption">評価：</span>
              <div className="calc-choices">
                <ScoreButton
                  name="read_follow"
                  value={0}
                  currentScore={scores.read_follow}
                />
                <ScoreButton
                  name="read_follow"
                  value={1}
                  currentScore={scores.read_follow}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 自発書字 */}
        <div className="calc-item">
          <h4 className="calc-section-title">10. 自発書字 (1点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『何か文章を書いてください』</p>
            </div>
            <div className="calc-choice-row">
              <span className="calc-choice-caption">評価：</span>
              <div className="calc-choices">
                <ScoreButton
                  name="write_sentence"
                  value={0}
                  currentScore={scores.write_sentence}
                />
                <ScoreButton
                  name="write_sentence"
                  value={1}
                  currentScore={scores.write_sentence}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 図形模写 */}
        <div className="calc-item">
          <h4 className="calc-section-title">11. 図形模写 (1点)</h4>
          <div className="calc-item-grid">
            <div className="calc-item-label">
              <p>『次の図形を書いてください』</p>
            </div>
            <div className="calc-choice-row">
              <span className="calc-choice-caption">評価：</span>
              <div className="calc-choices">
                <ScoreButton
                  name="copy_figure"
                  value={0}
                  currentScore={scores.copy_figure}
                />
                <ScoreButton
                  name="copy_figure"
                  value={1}
                  currentScore={scores.copy_figure}
                />
              </div>
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
                time_year: 1,
                time_season: 1,
                time_day: 1,
                time_month: 1,
                time_date: 1,
                place_prefecture: 1,
                place_city: 1,
                place_hospital: 1,
                place_floor: 1,
                place_region: 1,
                recall_1: 1,
                recall_2: 1,
                recall_3: 1,
                calculation_1: 1,
                calculation_2: 1,
                calculation_3: 1,
                calculation_4: 1,
                calculation_5: 1,
                delayed_recall_1: 1,
                delayed_recall_2: 1,
                delayed_recall_3: 1,
                naming_1: 1,
                naming_2: 1,
                repeat_sentence: 1,
                follow_command_1: 1,
                follow_command_2: 1,
                follow_command_3: 1,
                read_follow: 1,
                write_sentence: 1,
                copy_figure: 1,
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
      <div className="calc-results">
        <div className="calc-panels">
          <div className="calc-panel">
            <h3 className="calc-panel__title">
              カテゴリー別スコア
            </h3>
            <div className="calc-rows">
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.timeOrientation, 5)}
              >
                <span
                  className="calc-row__name"
                >
                  時間の見当識:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.timeOrientation}/5
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.placeOrientation, 5)}
              >
                <span
                  className="calc-row__name"
                >
                  場所の見当識:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.placeOrientation}/5
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.memory, 3)}
              >
                <span
                  className="calc-row__name"
                >
                  即時記憶:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.memory}/3
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.attention, 5)}
              >
                <span
                  className="calc-row__name"
                >
                  計算:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.attention}/5
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.recall, 3)}
              >
                <span
                  className="calc-row__name"
                >
                  遅延再生:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.recall}/3
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.naming, 2)}
              >
                <span
                  className="calc-row__name"
                >
                  物品呼称:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.naming}/2
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.repeat, 1)}
              >
                <span
                  className="calc-row__name"
                >
                  文の復唱:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.repeat}/1
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.command, 3)}
              >
                <span
                  className="calc-row__name"
                >
                  3段階命令:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.command}/3
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.read, 1)}
              >
                <span
                  className="calc-row__name"
                >
                  読字・理解:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.read}/1
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.write, 1)}
              >
                <span
                  className="calc-row__name"
                >
                  文章作成:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.write}/1
                </span>
              </div>
              <div
                className="calc-row" data-state={getCategoryState(categoryScores.copy, 1)}
              >
                <span
                  className="calc-row__name"
                >
                  図形模写:
                </span>
                <span
                  className="calc-row__value"
                >
                  {categoryScores.copy}/1
                </span>
              </div>
            </div>
          </div>

          <div className="calc-panel calc-panel--wide">
            <h3 className="calc-panel__title">重症度分類</h3>
            <div className="calc-rows">
              <div
                className={`calc-card ${totalScore > 27 ? "is-current" : ""}`}
              >
                <span className="calc-strong">28-30点:</span> 正常
              </div>
              <div
                className={`calc-card ${totalScore > 23 && totalScore <= 27 ? "is-current" : ""}`}
              >
                <span className="calc-strong">24-27点:</span>{" "}
                軽度認知障害(MCI)の疑い（感度45-60%、特異度65-90%）
              </div>
              <div
                className={`p-2 rounded ${
                  totalScore <= 23
                    ? "bg-red-50 text-red-800 font-medium"
                    : "bg-gray-50"
                }`}
              >
                <div>
                  <span className="calc-strong">23点以下:</span>{" "}
                  認知症の疑い（感度81％、特異度89%）
                </div>
                <div className="calc-substack">
                  <div
                    className={`p-2 rounded ${
                      totalScore >= 20 && totalScore <= 23
                        ? "bg-yellow-100 text-yellow-900 font-medium border-l-4 border-yellow-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="calc-strong">20-23点:</span>{" "}
                    軽度認知症の疑い
                  </div>
                  <div
                    className={`p-2 rounded ${
                      totalScore >= 10 && totalScore < 20
                        ? "bg-orange-200 text-orange-900 font-medium border-l-4 border-orange-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="calc-strong">10-19点:</span>{" "}
                    中等度認知症の疑い
                  </div>
                  <div
                    className={`p-2 rounded ${
                      totalScore < 10
                        ? "bg-red-200 text-red-900 font-medium border-l-4 border-red-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="calc-strong">0-9点:</span>{" "}
                    高度認知症の疑い
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
  );
}
