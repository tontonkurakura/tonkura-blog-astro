"use client";

import { useState, useEffect } from "react";
import React from "react";

interface ValidationError {
  csfIgG?: string;
  csfAlb?: string;
  serumIgG?: string;
  serumAlb?: string;
}

export default function IgGIndexCalculator() {
  const [csfIgG, setCsfIgG] = useState<string>("");
  const [csfAlb, setCsfAlb] = useState<string>("");
  const [serumIgG, setSerumIgG] = useState<string>("");
  const [serumAlb, setSerumAlb] = useState<string>("");
  const [iggIndex, setIggIndex] = useState<string>("");
  const [qAlb, setQAlb] = useState<string>("");
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 入力値の検証
    const newErrors: ValidationError = {};

    if (touched.csfIgG && csfIgG) {
      const value = parseFloat(csfIgG);
      if (isNaN(value) || value < 0 || value > 100) {
        newErrors.csfIgG = "0〜100の範囲で入力してください";
      }
    }

    if (touched.csfAlb && csfAlb) {
      const value = parseFloat(csfAlb);
      if (isNaN(value) || value < 0 || value > 200) {
        newErrors.csfAlb = "0〜200の範囲で入力してください";
      }
    }

    if (touched.serumIgG && serumIgG) {
      const value = parseFloat(serumIgG);
      if (isNaN(value) || value < 0 || value > 5000) {
        newErrors.serumIgG = "0〜5000の範囲で入力してください";
      }
    }

    if (touched.serumAlb && serumAlb) {
      const value = parseFloat(serumAlb);
      if (isNaN(value) || value < 0 || value > 10) {
        newErrors.serumAlb = "0〜10の範囲で入力してください";
      }
    }

    setErrors(newErrors);

    // エラーがなく、すべての値が入力されている場合に計算
    const hasAllValues = csfIgG && csfAlb && serumIgG && serumAlb;
    const hasNoErrors = Object.keys(newErrors).length === 0;

    if (hasAllValues && hasNoErrors) {
      try {
        const serumAlbInMgDl = parseFloat(serumAlb) * 1000;
        const index =
          (parseFloat(csfIgG) * serumAlbInMgDl) /
          (parseFloat(csfAlb) * parseFloat(serumIgG));
        const qAlbValue = parseFloat(csfAlb) / serumAlbInMgDl;

        if (isNaN(index) || !isFinite(index)) {
          setIggIndex("計算エラー");
        } else {
          setIggIndex(index.toFixed(2));
        }

        if (isNaN(qAlbValue) || !isFinite(qAlbValue)) {
          setQAlb("計算エラー");
        } else {
          setQAlb((qAlbValue * 1000).toFixed(2)); // Q-Albを1000倍して表示
        }
      } catch (error) {
        console.error("計算エラー:", error);
        setIggIndex("計算エラー");
        setQAlb("計算エラー");
      }
    } else {
      setIggIndex("");
      setQAlb("");
    }
  }, [csfIgG, csfAlb, serumIgG, serumAlb, touched]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: string
  ) => {
    const value = e.target.value;
    // 数値と小数点のみを許可
    if (value === "" || /^(\d*\.?\d*)$/.test(value)) {
      setter(value);
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getResultLevel = () => {
    if (!iggIndex || iggIndex === "計算エラー") return "none";

    const index = parseFloat(iggIndex);
    if (index >= 0.3 && index <= 0.7) return "none";
    if (index < 0.3) return "mild";
    if (index <= 1.0) return "moderate";
    return "critical";
  };

  // 結果のテキストを取得する関数
  const getResultText = () => {
    if (!iggIndex || iggIndex === "計算エラー") return "計算エラー";

    const index = parseFloat(iggIndex);
    if (index >= 0.3 && index <= 0.7) return "正常範囲";
    if (index < 0.3) return "正常下限以下";
    if (index > 0.7 && index <= 1.0) return "軽度上昇";
    return "明らかな上昇";
  };

  // 基準を外れた値だけ段階名を返す（配色は calculator.css）
  const getResultState = (type: string) => {
    if (type === "iggIndex" && iggIndex && iggIndex !== "計算エラー") {
      const index = parseFloat(iggIndex);
      if (index >= 0.3 && index <= 0.7) return "";
      if (index < 0.3) return "mild";
      if (index <= 1.0) return "moderate";
      return "critical";
    }

    if (type === "qAlb" && qAlb && qAlb !== "計算エラー") {
      const qAlbValue = parseFloat(qAlb);
      if (qAlbValue >= 2.0 && qAlbValue <= 9.0) return "";
      if (qAlbValue < 2.0) return "mild";
      return "critical";
    }

    return "";
  };

  return (
    <div className="calc" data-level={getResultLevel()}>
      <h3 className="calc-title">
        IgG Index Calculator
      </h3>
      <div className="calc-fields">
        <div>
          <label className="calc-label">CSF-IgG (mg/dL):</label>
          <input
            type="text"
            inputMode="decimal"
            value={csfIgG}
            onChange={(e) => handleInputChange(e, setCsfIgG, "csfIgG")}
            onBlur={() => handleBlur("csfIgG")}
            placeholder="0.5-4.0"
            className={`calc-input ${errors.csfIgG ? "has-error" : ""}`}
            aria-invalid={!!errors.csfIgG}
            aria-describedby={errors.csfIgG ? "csfIgG-error" : undefined}
          />
          {errors.csfIgG && (
            <p id="csfIgG-error" className="calc-error">
              {errors.csfIgG}
            </p>
          )}
        </div>
        <div>
          <label className="calc-label">CSF-Alb (mg/dL):</label>
          <input
            type="text"
            inputMode="decimal"
            value={csfAlb}
            onChange={(e) => handleInputChange(e, setCsfAlb, "csfAlb")}
            onBlur={() => handleBlur("csfAlb")}
            placeholder="9-30"
            className={`calc-input ${errors.csfAlb ? "has-error" : ""}`}
            aria-invalid={!!errors.csfAlb}
            aria-describedby={errors.csfAlb ? "csfAlb-error" : undefined}
          />
          {errors.csfAlb && (
            <p id="csfAlb-error" className="calc-error">
              {errors.csfAlb}
            </p>
          )}
        </div>
        <div>
          <label className="calc-label">血清-IgG (mg/dL):</label>
          <input
            type="text"
            inputMode="decimal"
            value={serumIgG}
            onChange={(e) => handleInputChange(e, setSerumIgG, "serumIgG")}
            onBlur={() => handleBlur("serumIgG")}
            placeholder="870-1700"
            className={`calc-input ${errors.serumIgG ? "has-error" : ""}`}
            aria-invalid={!!errors.serumIgG}
            aria-describedby={errors.serumIgG ? "serumIgG-error" : undefined}
          />
          {errors.serumIgG && (
            <p id="serumIgG-error" className="calc-error">
              {errors.serumIgG}
            </p>
          )}
        </div>
        <div>
          <label className="calc-label">血清-Alb (g/dL):</label>
          <input
            type="text"
            inputMode="decimal"
            value={serumAlb}
            onChange={(e) => handleInputChange(e, setSerumAlb, "serumAlb")}
            onBlur={() => handleBlur("serumAlb")}
            placeholder="3.8-5.2"
            className={`calc-input ${errors.serumAlb ? "has-error" : ""}`}
            aria-invalid={!!errors.serumAlb}
            aria-describedby={errors.serumAlb ? "serumAlb-error" : undefined}
          />
          {errors.serumAlb && (
            <p id="serumAlb-error" className="calc-error">
              {errors.serumAlb}
            </p>
          )}
        </div>
      </div>

      {/* フローティングスコア表示 */}
      {iggIndex && qAlb && (
        <div
          className="calc-bar"
        >
          <div className="calc-bar__main">
            <span className="calc-bar__label">IgG Index:</span>
            <span className="calc-bar__value">{iggIndex}</span>
            <span className="calc-bar__ref">(基準値: 0.3-0.7)</span>
          </div>
          <div className="calc-bar__side">
            <div className="calc-chip">
              <span>
                Q-Alb: {qAlb} ×10³ (基準値: 2.0-9.0)
              </span>
            </div>
            <button
              onClick={() => {
                setCsfIgG("");
                setCsfAlb("");
                setSerumIgG("");
                setSerumAlb("");
                setIggIndex("");
                setQAlb("");
                setErrors({});
                setTouched({});
              }}
              className="calc-reset"
            >
              入力をクリア
            </button>
            <div className="calc-bar__verdict">
              {getResultText()}
            </div>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      <div className="calc-results">
        <div className="calc-panels">
          <div className="calc-panel">
            <h3 className="calc-panel__title">計算結果</h3>
            <div className="calc-rows">
              <div
                className="calc-row" data-state={getResultState("iggIndex")}
              >
                <span
                  className="calc-row__name"
                >
                  IgG Index:
                </span>
                <span
                  className="calc-row__value"
                >
                  {iggIndex || "-"}
                </span>
              </div>
              <div
                className="calc-row" data-state={getResultState("qAlb")}
              >
                <span
                  className="calc-row__name"
                >
                  Q-Alb (×10³):
                </span>
                <span
                  className="calc-row__value"
                >
                  {qAlb || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="calc-panel calc-panel--wide">
            <h3 className="calc-panel__title">評価基準</h3>
            <div className="calc-rows">
              <div
                className={`calc-card ${iggIndex && parseFloat(iggIndex) < 0.3 ? "is-current" : ""}`}
              >
                <span className="calc-strong">IgG Index &lt; 0.3:</span>{" "}
                正常下限以下
              </div>
              <div
                className={`calc-card ${iggIndex && parseFloat(iggIndex) >= 0.3 && parseFloat(iggIndex) <= 0.7 ? "is-current" : ""}`}
              >
                <span className="calc-strong">IgG Index 0.3-0.7:</span>{" "}
                正常範囲
              </div>
              <div
                className={`calc-card ${iggIndex && parseFloat(iggIndex) > 0.7 && parseFloat(iggIndex) <= 1.0 ? "is-current" : ""}`}
              >
                <span className="calc-strong">IgG Index 0.7-1.0:</span>{" "}
                軽度上昇
              </div>
              <div
                className={`calc-card ${iggIndex && parseFloat(iggIndex) > 1.0 ? "is-current" : ""}`}
              >
                <span className="calc-strong">IgG Index &gt; 1.0:</span>{" "}
                明らかな上昇（髄腔内IgG産生亢進）
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
                本ツールの利用により生じた如何なる結果についても、当サイトは責任を負いかねます。
              </li></ul>
        </div>
      </div>
    </div>
  );
}
