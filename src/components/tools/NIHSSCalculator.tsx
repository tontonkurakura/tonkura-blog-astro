"use client";

import { useState } from "react";
import React from "react";
import type { NIHSSScores } from "@/types/calculator";

export default function NIHSSCalculator() {
  const [scores, setScores] = useState<NIHSSScores>({
    totalScore: 0,
    consciousness_level: 0,
    consciousness_questions: 0,
    consciousness_commands: 0,
    gaze: 0,
    visual_fields: 0,
    facial_palsy: 0,
    left_arm_motor: 0,
    right_arm_motor: 0,
    left_leg_motor: 0,
    right_leg_motor: 0,
    limb_ataxia: 0,
    sensory: 0,
    language: 0,
    dysarthria: 0,
    neglect: 0,
  });

  // Nボタンが選択されているかどうかを追跡する状態
  const [nSelected, setNSelected] = useState<{
    left_arm_motor: boolean;
    right_arm_motor: boolean;
    left_leg_motor: boolean;
    right_leg_motor: boolean;
    limb_ataxia: boolean;
  }>({
    left_arm_motor: false,
    right_arm_motor: false,
    left_leg_motor: false,
    right_leg_motor: false,
    limb_ataxia: false,
  });

  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const name = button.getAttribute("data-name") as keyof NIHSSScores;
    const value = parseInt(button.value, 10);
    const isN = button.getAttribute("data-is-n") === "true";

    // Nボタンの状態を更新
    if (
      name === "left_arm_motor" ||
      name === "right_arm_motor" ||
      name === "left_leg_motor" ||
      name === "right_leg_motor" ||
      name === "limb_ataxia"
    ) {
      // Nボタンがクリックされた場合
      if (isN) {
        // Nボタンを選択状態にし、スコアを0に設定
        setNSelected((prev) => ({
          ...prev,
          [name]: true,
        }));
        setScores((prevScores) => ({
          ...prevScores,
          [name]: 0,
        }));
      } else {
        // 通常のスコアボタンがクリックされた場合、Nボタンの選択を解除
        setNSelected((prev) => ({
          ...prev,
          [name]: false,
        }));
        setScores((prevScores) => ({
          ...prevScores,
          [name]: value,
        }));
      }
    } else {
      // Nボタンがない項目の場合は通常通り処理
      setScores((prevScores) => ({
        ...prevScores,
        [name]: value,
      }));
    }
  };

  // 全ての選択をリセットする関数
  const handleReset = () => {
    setScores({
      totalScore: 0,
      consciousness_level: 0,
      consciousness_questions: 0,
      consciousness_commands: 0,
      gaze: 0,
      visual_fields: 0,
      facial_palsy: 0,
      left_arm_motor: 0,
      right_arm_motor: 0,
      left_leg_motor: 0,
      right_leg_motor: 0,
      limb_ataxia: 0,
      sensory: 0,
      language: 0,
      dysarthria: 0,
      neglect: 0,
    });
    setNSelected({
      left_arm_motor: false,
      right_arm_motor: false,
      left_leg_motor: false,
      right_leg_motor: false,
      limb_ataxia: false,
    });
  };

  const calculateScore = (): number => {
    return (
      scores.consciousness_level +
      scores.consciousness_questions +
      scores.consciousness_commands +
      scores.gaze +
      scores.visual_fields +
      scores.facial_palsy +
      scores.left_arm_motor +
      scores.right_arm_motor +
      scores.left_leg_motor +
      scores.right_leg_motor +
      scores.limb_ataxia +
      scores.sensory +
      scores.language +
      scores.dysarthria +
      scores.neglect
    );
  };

  // 各カテゴリーのスコアを計算する関数
  const calculateCategoryScores = () => {
    return {
      consciousness_level: scores.consciousness_level, // 1a. 意識水準
      consciousness_questions: scores.consciousness_questions, // 1b. 意識水準-質問
      consciousness_commands: scores.consciousness_commands, // 1c. 意識水準-従命
      gaze: scores.gaze, // 2. 最良の注視
      visual_fields: scores.visual_fields, // 3. 視野
      facial_palsy: scores.facial_palsy, // 4. 顔面麻痺
      left_arm_motor: scores.left_arm_motor, // 5-1. 上肢の運動（左）
      right_arm_motor: scores.right_arm_motor, // 5-2. 上肢の運動（右）
      left_leg_motor: scores.left_leg_motor, // 6-1. 下肢の運動（左）
      right_leg_motor: scores.right_leg_motor, // 6-2. 下肢の運動（右）
      limb_ataxia: scores.limb_ataxia, // 7. 運動失調
      sensory: scores.sensory, // 8. 感覚
      language: scores.language, // 9. 最良の言語
      dysarthria: scores.dysarthria, // 10. 構音障害
      neglect: scores.neglect, // 11. 消去現象と注意障害
    };
  };

  // 選択された項目数を計算
  const calculateSelectedItems = (): number => {
    let count = 0;
    Object.entries(scores).forEach(([key, value]) => {
      // Nが選択されている場合はカウントしない
      if (
        (key === "left_arm_motor" ||
          key === "right_arm_motor" ||
          key === "left_leg_motor" ||
          key === "right_leg_motor" ||
          key === "limb_ataxia") &&
        nSelected[key as keyof typeof nSelected]
      ) {
        // Nが選択されている場合はカウントしない
        return;
      }

      // スコアが0より大きい場合はカウント
      if (value > 0) count++;
    });
    return count;
  };

  function ScoreButton({
    name,
    value,
    currentScore,
    label,
    isN = false,
  }: {
    name: keyof NIHSSScores;
    value: number;
    currentScore: number;
    label?: string;
    isN?: boolean;
  }) {
    // Nが選択されているかどうかを確認
    const isNSelected =
      name in nSelected && nSelected[name as keyof typeof nSelected];

    // ボタンがアクティブかどうかを判断
    const isActive = isN ? isNSelected : currentScore === value && !isNSelected;

    return (
      <button
        data-name={name}
        value={value}
        data-is-n={isN}
        onClick={handleChange}
        className={`calc-choice ${isActive ? "is-active" : ""}`}
      >
        {label || value}
      </button>
    );
  }

  const totalScore = calculateScore();
  const categoryScores = calculateCategoryScores();
  const selectedItems = calculateSelectedItems();

  // スコアに基づいて色を決定する関数
  const getScoreLevel = () => {
    if (totalScore === 0) return "none";
    if (totalScore <= 4) return "mild";
    if (totalScore <= 15) return "moderate";
    if (totalScore <= 20) return "severe";
    return "critical";
  };

  // 重症度のテキストを取得する関数
  const getSeverityText = () => {
    if (totalScore === 0) return "脳卒中症状なし";
    if (totalScore >= 1 && totalScore <= 4) return "軽症脳卒中";
    if (totalScore >= 5 && totalScore <= 15) return "中等度脳卒中";
    if (totalScore >= 16 && totalScore <= 20) return "中等度～重症脳卒中";
    return "重症脳卒中";
  };

  // カテゴリーごとのスコアの重みを段階名で返す（配色は calculator.css）
  const getCategoryState = (score: number, maxScore: number) => {
    if (score === 0) return "";
    const ratio = score / maxScore;
    if (ratio <= 0.4) return "";
    if (ratio <= 0.7) return "severe";
    return "critical";
  };

  return (
    <div className="calc" data-level={getScoreLevel()}>
      <div className="calc-items">
        {/* 1a. 意識水準 */}
        <div>
          <label className="calc-label">
            1a. 意識水準
            <div className="calc-help">
              <div className="calc-help-text">
                0：完全覚醒
                <br />
                1：簡単な刺激で覚醒
                <br />
                2：繰り返し刺激、強い刺激で覚醒
                <br />
                3：完全に無反応
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="consciousness_level"
              value={0}
              currentScore={scores.consciousness_level}
            />
            <ScoreButton
              name="consciousness_level"
              value={1}
              currentScore={scores.consciousness_level}
            />
            <ScoreButton
              name="consciousness_level"
              value={2}
              currentScore={scores.consciousness_level}
            />
            <ScoreButton
              name="consciousness_level"
              value={3}
              currentScore={scores.consciousness_level}
            />
          </div>
        </div>

        {/* 1b. 意識障害―質問 */}
        <div>
          <label className="calc-label">
            1b. 意識障害―質問（今月の月名及び年齢）
            <div className="calc-help">
              <div className="calc-help-text">
                0：両方正解
                <br />
                1：片方正解
                <br />
                2：両方不正解
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="consciousness_questions"
              value={0}
              currentScore={scores.consciousness_questions}
            />
            <ScoreButton
              name="consciousness_questions"
              value={1}
              currentScore={scores.consciousness_questions}
            />
            <ScoreButton
              name="consciousness_questions"
              value={2}
              currentScore={scores.consciousness_questions}
            />
          </div>
        </div>

        {/* 1c. 意識障害―従命 */}
        <div>
          <label className="calc-label">
            1c. 意識障害―従命（開閉眼、「手を握る・開く」）
            <div className="calc-help">
              <div className="calc-help-text">
                0：両方可
                <br />
                1：片方可
                <br />
                2：両方不可
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="consciousness_commands"
              value={0}
              currentScore={scores.consciousness_commands}
            />
            <ScoreButton
              name="consciousness_commands"
              value={1}
              currentScore={scores.consciousness_commands}
            />
            <ScoreButton
              name="consciousness_commands"
              value={2}
              currentScore={scores.consciousness_commands}
            />
          </div>
        </div>

        {/* 2. 最良の注視 */}
        <div>
          <label className="calc-label">
            2. 最良の注視
            <div className="calc-help">
              <div className="calc-help-text">
                0：正常
                <br />
                1：部分的注視麻痺
                <br />
                2：完全注視麻痺
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton name="gaze" value={0} currentScore={scores.gaze} />
            <ScoreButton name="gaze" value={1} currentScore={scores.gaze} />
            <ScoreButton name="gaze" value={2} currentScore={scores.gaze} />
          </div>
        </div>

        {/* 3. 視野 */}
        <div>
          <label className="calc-label">
            3. 視野
            <div className="calc-help">
              <div className="calc-help-text">
                0：視野欠損なし
                <br />
                1：部分的半盲
                <br />
                2：完全半盲
                <br />
                3：両側性半盲
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="visual_fields"
              value={0}
              currentScore={scores.visual_fields}
            />
            <ScoreButton
              name="visual_fields"
              value={1}
              currentScore={scores.visual_fields}
            />
            <ScoreButton
              name="visual_fields"
              value={2}
              currentScore={scores.visual_fields}
            />
            <ScoreButton
              name="visual_fields"
              value={3}
              currentScore={scores.visual_fields}
            />
          </div>
        </div>

        {/* 4. 顔面麻痺 */}
        <div>
          <label className="calc-label">
            4. 顔面麻痺
            <div className="calc-help">
              <div className="calc-help-text">
                0：正常
                <br />
                1：軽度の麻痺
                <br />
                2：部分的麻痺
                <br />
                3：完全麻痺
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="facial_palsy"
              value={0}
              currentScore={scores.facial_palsy}
            />
            <ScoreButton
              name="facial_palsy"
              value={1}
              currentScore={scores.facial_palsy}
            />
            <ScoreButton
              name="facial_palsy"
              value={2}
              currentScore={scores.facial_palsy}
            />
            <ScoreButton
              name="facial_palsy"
              value={3}
              currentScore={scores.facial_palsy}
            />
          </div>
        </div>

        {/* 5-1. 上肢の運動（左） */}
        <div>
          <label className="calc-label">
            5-1. 上肢の運動（左）※仰臥位のときは45度挙上
            <div className="calc-help">
              <div className="calc-help-text">
                0：90度を10秒間保持可能（下垂なし）
                <br />
                1：90度を保持できるが、10秒以内に下垂
                <br />
                2：90度の挙上または保持ができない
                <br />
                3：重力に抗して動かない
                <br />
                4：全く動きがみられない
                <br />
                N：切断、関節癒合
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="left_arm_motor"
              value={0}
              currentScore={scores.left_arm_motor}
              isN={true}
              label="N"
            />
            <ScoreButton
              name="left_arm_motor"
              value={0}
              currentScore={scores.left_arm_motor}
            />
            <ScoreButton
              name="left_arm_motor"
              value={1}
              currentScore={scores.left_arm_motor}
            />
            <ScoreButton
              name="left_arm_motor"
              value={2}
              currentScore={scores.left_arm_motor}
            />
            <ScoreButton
              name="left_arm_motor"
              value={3}
              currentScore={scores.left_arm_motor}
            />
            <ScoreButton
              name="left_arm_motor"
              value={4}
              currentScore={scores.left_arm_motor}
            />
          </div>
        </div>

        {/* 5-2. 上肢の運動（右） */}
        <div>
          <label className="calc-label">
            5-2. 上肢の運動（右）※仰臥位のときは45度挙上
            <div className="calc-help">
              <div className="calc-help-text">
                0：90度を10秒間保持可能（下垂なし）
                <br />
                1：90度を保持できるが、10秒以内に下垂
                <br />
                2：90度の挙上または保持ができない
                <br />
                3：重力に抗して動かない
                <br />
                4：全く動きがみられない
                <br />
                N：切断、関節癒合
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="right_arm_motor"
              value={0}
              currentScore={scores.right_arm_motor}
              isN={true}
              label="N"
            />
            <ScoreButton
              name="right_arm_motor"
              value={0}
              currentScore={scores.right_arm_motor}
            />
            <ScoreButton
              name="right_arm_motor"
              value={1}
              currentScore={scores.right_arm_motor}
            />
            <ScoreButton
              name="right_arm_motor"
              value={2}
              currentScore={scores.right_arm_motor}
            />
            <ScoreButton
              name="right_arm_motor"
              value={3}
              currentScore={scores.right_arm_motor}
            />
            <ScoreButton
              name="right_arm_motor"
              value={4}
              currentScore={scores.right_arm_motor}
            />
          </div>
        </div>

        {/* 6-1. 下肢の運動（左） */}
        <div>
          <label className="calc-label">
            6-1. 下肢の運動（左）
            <div className="calc-help">
              <div className="calc-help-text">
                0：30度を5秒間保持できる（下垂なし）
                <br />
                1：30度を保持できるが、5秒以内に下垂
                <br />
                2：重力に抗して動きがみられる
                <br />
                3：重力に抗して動かない
                <br />
                4：全く動きがみられない
                <br />
                N：切断、関節癒合
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="left_leg_motor"
              value={0}
              currentScore={scores.left_leg_motor}
              isN={true}
              label="N"
            />
            <ScoreButton
              name="left_leg_motor"
              value={0}
              currentScore={scores.left_leg_motor}
            />
            <ScoreButton
              name="left_leg_motor"
              value={1}
              currentScore={scores.left_leg_motor}
            />
            <ScoreButton
              name="left_leg_motor"
              value={2}
              currentScore={scores.left_leg_motor}
            />
            <ScoreButton
              name="left_leg_motor"
              value={3}
              currentScore={scores.left_leg_motor}
            />
            <ScoreButton
              name="left_leg_motor"
              value={4}
              currentScore={scores.left_leg_motor}
            />
          </div>
        </div>

        {/* 6-2. 下肢の運動（右） */}
        <div>
          <label className="calc-label">
            6-2. 下肢の運動（右）
            <div className="calc-help">
              <div className="calc-help-text">
                0：30度を5秒間保持できる（下垂なし）
                <br />
                1：30度を保持できるが、5秒以内に下垂
                <br />
                2：重力に抗して動きがみられる
                <br />
                3：重力に抗して動かない
                <br />
                4：全く動きがみられない
                <br />
                N：切断、関節癒合
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="right_leg_motor"
              value={0}
              currentScore={scores.right_leg_motor}
              isN={true}
              label="N"
            />
            <ScoreButton
              name="right_leg_motor"
              value={0}
              currentScore={scores.right_leg_motor}
            />
            <ScoreButton
              name="right_leg_motor"
              value={1}
              currentScore={scores.right_leg_motor}
            />
            <ScoreButton
              name="right_leg_motor"
              value={2}
              currentScore={scores.right_leg_motor}
            />
            <ScoreButton
              name="right_leg_motor"
              value={3}
              currentScore={scores.right_leg_motor}
            />
            <ScoreButton
              name="right_leg_motor"
              value={4}
              currentScore={scores.right_leg_motor}
            />
          </div>
        </div>

        {/* 7. 運動失調 */}
        <div>
          <label className="calc-label">
            7. 運動失調
            <div className="calc-help">
              <div className="calc-help-text">
                0：なし
                <br />
                1：1肢
                <br />
                2：2肢
                <br />
                N：切断、関節癒合
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="limb_ataxia"
              value={0}
              currentScore={scores.limb_ataxia}
              isN={true}
              label="N"
            />
            <ScoreButton
              name="limb_ataxia"
              value={0}
              currentScore={scores.limb_ataxia}
            />
            <ScoreButton
              name="limb_ataxia"
              value={1}
              currentScore={scores.limb_ataxia}
            />
            <ScoreButton
              name="limb_ataxia"
              value={2}
              currentScore={scores.limb_ataxia}
            />
          </div>
        </div>

        {/* 8. 感覚 */}
        <div>
          <label className="calc-label">
            8. 感覚
            <div className="calc-help">
              <div className="calc-help-text">
                0：障害なし
                <br />
                1：軽度から中等度
                <br />
                2：重度から完全
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="sensory"
              value={0}
              currentScore={scores.sensory}
            />
            <ScoreButton
              name="sensory"
              value={1}
              currentScore={scores.sensory}
            />
            <ScoreButton
              name="sensory"
              value={2}
              currentScore={scores.sensory}
            />
          </div>
        </div>

        {/* 9. 最良の言語 */}
        <div>
          <label className="calc-label">
            9. 最良の言語
            <div className="calc-help">
              <div className="calc-help-text">
                0：失語なし
                <br />
                1：軽度から中等度
                <br />
                2：重度の失語
                <br />
                3：無言、全失語
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="language"
              value={0}
              currentScore={scores.language}
            />
            <ScoreButton
              name="language"
              value={1}
              currentScore={scores.language}
            />
            <ScoreButton
              name="language"
              value={2}
              currentScore={scores.language}
            />
            <ScoreButton
              name="language"
              value={3}
              currentScore={scores.language}
            />
          </div>
        </div>

        {/* 10. 構音障害 */}
        <div>
          <label className="calc-label">
            10. 構音障害
            <div className="calc-help">
              <div className="calc-help-text">
                0：正常
                <br />
                1：軽度から中等度
                <br />
                2：重度
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="dysarthria"
              value={0}
              currentScore={scores.dysarthria}
            />
            <ScoreButton
              name="dysarthria"
              value={1}
              currentScore={scores.dysarthria}
            />
            <ScoreButton
              name="dysarthria"
              value={2}
              currentScore={scores.dysarthria}
            />
          </div>
        </div>

        {/* 11. 消去現象と注意障害 */}
        <div>
          <label className="calc-label">
            11. 消去現象と注意障害
            <div className="calc-help">
              <div className="calc-help-text">
                0：異常なし
                <br />
                1：視覚、触覚、聴覚、視空間、または自己身体に対する不注意、あるいは1つの感覚様式で2点同時刺激に対する消去現象
                <br />
                2：重度の半側不注意あるいは2つ以上の感覚様式に対する半側不注意
              </div>
            </div>
          </label>
          <div className="calc-choices">
            <ScoreButton
              name="neglect"
              value={0}
              currentScore={scores.neglect}
            />
            <ScoreButton
              name="neglect"
              value={1}
              currentScore={scores.neglect}
            />
            <ScoreButton
              name="neglect"
              value={2}
              currentScore={scores.neglect}
            />
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
          <span className="calc-bar__ref">/42</span>
        </div>
        <div className="calc-bar__side">
          <div className="calc-chip">
            <span>{selectedItems}/15 項目選択済み</span>
          </div>
          <button
            onClick={handleReset}
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
        {/* 重症度分類（上部に配置） */}
        <div className="calc-panel">
          <h3 className="calc-panel__title">重症度分類</h3>
          <div className="calc-cards">
            <div
              className={`calc-card ${totalScore === 0 ? "is-current" : ""}`}
            >
              <div className="calc-card__title">
                0点
                <br />
                No stroke symptoms
              </div>
              <div className="calc-card__text">（脳卒中症状なし）</div>
            </div>
            <div
              className={`calc-card ${totalScore >= 1 && totalScore <= 4 ? "is-current" : ""}`}
            >
              <div className="calc-card__title">
                1-4点
                <br />
                Minor stroke
              </div>
              <div className="calc-card__text">（軽症脳卒中）</div>
            </div>
            <div
              className={`calc-card ${totalScore >= 5 && totalScore <= 15 ? "is-current" : ""}`}
            >
              <div className="calc-card__title">
                5-15点
                <br />
                Moderate stroke
              </div>
              <div className="calc-card__text">（中等度脳卒中）</div>
            </div>
            <div
              className={`calc-card ${totalScore >= 16 ? "is-current" : ""}`}
            >
              <div className="calc-card__title">
                16点以上
                <br />
                Severe stroke
              </div>
              <div className="calc-card__text">（重症脳卒中）</div>
            </div>
          </div>
        </div>

        {/* カテゴリー別スコア */}
        <div className="calc-panel">
          <h3 className="calc-panel__title">カテゴリー別スコア</h3>
          <div className="calc-columns">
            <div className="calc-column">
              {[
                { key: "consciousness_level", label: "1a. 意識水準", max: 3 },
                {
                  key: "consciousness_questions",
                  label: "1b. 意識水準-質問",
                  max: 2,
                },
                {
                  key: "consciousness_commands",
                  label: "1c. 意識水準-従命",
                  max: 2,
                },
                { key: "gaze", label: "2. 最良の注視", max: 2 },
                { key: "visual_fields", label: "3. 視野", max: 3 },
              ].map((item) => (
                <div
                  key={item.key}
                  className="calc-row" data-state={getCategoryState(categoryScores[item.key as keyof typeof categoryScores], item.max)}
                >
                  <span
                    className="calc-row__name"
                  >
                    {item.label}
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores[item.key as keyof typeof categoryScores]}/
                    {item.max}
                  </span>
                </div>
              ))}
            </div>
            <div className="calc-column">
              {[
                { key: "facial_palsy", label: "4. 顔面麻痺", max: 3 },
                {
                  key: "left_arm_motor",
                  label: "5-1. 上肢の運動（左）",
                  max: 4,
                },
                {
                  key: "right_arm_motor",
                  label: "5-2. 上肢の運動（右）",
                  max: 4,
                },
                {
                  key: "left_leg_motor",
                  label: "6-1. 下肢の運動（左）",
                  max: 4,
                },
                {
                  key: "right_leg_motor",
                  label: "6-2. 下肢の運動（右）",
                  max: 4,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="calc-row" data-state={getCategoryState(categoryScores[item.key as keyof typeof categoryScores], item.max)}
                >
                  <span
                    className="calc-row__name"
                  >
                    {item.label}
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores[item.key as keyof typeof categoryScores]}/
                    {item.max}
                  </span>
                </div>
              ))}
            </div>
            <div className="calc-column">
              {[
                { key: "limb_ataxia", label: "7. 運動失調", max: 2 },
                { key: "sensory", label: "8. 感覚", max: 2 },
                { key: "language", label: "9. 最良の言語", max: 3 },
                { key: "dysarthria", label: "10. 構音障害", max: 2 },
                { key: "neglect", label: "11. 消去現象と注意障害", max: 2 },
              ].map((item) => (
                <div
                  key={item.key}
                  className="calc-row" data-state={getCategoryState(categoryScores[item.key as keyof typeof categoryScores], item.max)}
                >
                  <span
                    className="calc-row__name"
                  >
                    {item.label}
                  </span>
                  <span
                    className="calc-row__value"
                  >
                    {categoryScores[item.key as keyof typeof categoryScores]}/
                    {item.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
