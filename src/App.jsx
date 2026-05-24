import { useMemo, useState } from "react";

const categories = [
  {
    id: "travel",
    label: "夢の世界旅行",
    templates: [
      {
        id: "mykonos",
        label: "夢のミコノス島フォト",
        image: "/mykonos.png",
        prompt: "夢のように美しいミコノス島風の白い街並み。白と青、透明感のある海、理想化された地中海リゾート。禿山や雑多な観光感は不要。",
      },
      {
        id: "kyoto",
        label: "夢の京都",
        prompt: "理想化された美しい京都。石畳、和の建築、上品な光。観光客の混雑や雑多感は不要。",
      },
    ],
  },
  {
    id: "summer",
    label: "夏・海・水中",
    templates: [
      {
        id: "beach",
        label: "夢のビーチ",
        prompt: "透明感のある夏の海。白い砂浜、ターコイズブルーの海、強い夏の光。",
      },
      {
        id: "underwater",
        label: "夢の水中世界",
        prompt: "幻想的で明るい水中世界。サンゴ礁、光、水泡、夢の海。",
      },
    ],
  },
  {
    id: "movie",
    label: "映画ポスター風",
    templates: [
      {
        id: "titanic",
        label: "豪華客船ロマンス風",
        image: "/titanic.png",
        prompt: "豪華客船を舞台にしたロマンス映画ポスター風。体型と構図は固定、顔だけ本人化。",
      },
    ],
  },
];

const outfits = [
  "服なし",
  "おまかせ",
  "フリル水着",
  "浴衣",
  "振袖着物（友禅）",
  "レトロ旅行服",
];

const basePrompt = `【最優先：ペット本人の保持】
アップロードされたペットの顔・表情・毛色・模様・目・鼻・口元・耳・毛並みを最優先で保持してください。
別の子に変えないでください。

【共通】
現実そのままではなく、夢のように美しく理想化された風景にしてください。
汚れ、生活感、暗さ、雑多感は不要です。`;

export default function App() {
  const [categoryId, setCategoryId] = useState("travel");
  const [templateId, setTemplateId] = useState("mykonos");
  const [outfit, setOutfit] = useState("おまかせ");

  const category = categories.find((c) => c.id === categoryId);
  const template =
    category.templates.find((t) => t.id === templateId) ||
    category.templates[0];

  const prompt = useMemo(() => {
    return `${basePrompt}

【世界観】
${template.prompt}

【服】
${outfit}

【仕上げ】
高品質、透明感、清潔感、夢の世界、可愛いペットポートレート。`;
  }, [template, outfit]);

  return (
    <div className="app">
      <header className="hero">
        <img src="/top.png" alt="top" className="heroImage" />

        <div className="sisterBox">
          <span>🌸 姉妹サイト 🌸</span>

          <a
            href="https://yuyupm.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ゆゆ姫の夢かわプロンプト工房はこちら
          </a>
        </div>
      </header>

      <main className="main">
        <section className="card intro">
          <h1>ゆゆママの夢プロンプト工房（汎用版）</h1>

          <p>
            世界旅行、夏、映画ポスター風など、
            夢のようなペット画像プロンプトを作る工房です。
          </p>
        </section>

        <section className="grid">
          <div className="card left">
            <h2>1. カテゴリ</h2>

            <div className="buttonGrid">
              {categories.map((item) => (
                <button
                  key={item.id}
                  className={categoryId === item.id ? "active" : ""}
                  onClick={() => {
                    setCategoryId(item.id);
                    setTemplateId(item.templates[0].id);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <h2>2. テンプレ</h2>

            <div className="buttonGrid">
              {category.templates.map((item) => (
                <button
                  key={item.id}
                  className={templateId === item.id ? "active" : ""}
                  onClick={() => setTemplateId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {template.image && (
              <img
                src={template.image}
                alt={template.label}
                className="preview"
              />
            )}

            <h2>3. 服</h2>

            <select
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
            >
              {outfits.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="card right">
            <div className="outputHeader">
              <h2>生成プロンプト</h2>

              <button
                onClick={() => navigator.clipboard.writeText(prompt)}
              >
                コピー
              </button>
            </div>

            <textarea value={prompt} readOnly />
          </div>
        </section>
      </main>
    </div>
  );
}
