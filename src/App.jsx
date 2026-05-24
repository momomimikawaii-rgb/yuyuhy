const recommendedTemplates = [
  {
    id: "mykonos",
    title: "夢のミコノス島フォト",
    image: "/mykonos.png",
    badge: "旅行・夏",
    description:
      "白と青の街並み、きらめく海、理想化された夢の地中海リゾート。服は自由に選べる通常テンプレです。",
  },
  {
    id: "titanic",
    title: "豪華客船ロマンス風ポスター",
    image: "/titanic.png",
    badge: "映画ポスター",
    description:
      "構図・服・体型は固定。アップロード写真から顔・耳・毛色・手の色合いだけを反映する特殊テンプレです。",
  },
];

const categories = [
  {
    title: "夏・海系",
    text: "海、花火、水中、川遊び、浮き輪、水上スキー、スイカ、アイスなど。明るく透明感のある夢の夏。",
  },
  {
    title: "夢の世界旅行",
    text: "ミコノス島、モンサンミッシェル、ベネチア、京都など。現実の混雑や汚れをなくした理想の旅写真。",
  },
  {
    title: "乗り物系",
    text: "SL、レトロ飛行機、気球、サイドカーなど。ペットサイズの絵本みたいな乗り物世界。",
  },
  {
    title: "映画ポスター風",
    text: "架空タイトルで作る名シーン風ポスター。顔だけ本人化、体は固定テンプレで事故を防ぎます。",
  },
  {
    title: "動物さんと一緒",
    text: "白熊、茶熊、ごまちゃん、ペンギン、イルカ、オルカなど。怖くせず、綺麗で優しい夢の動物たち。",
  },
  {
    title: "うちの子インフォグラフィック",
    text: "名前・性格・好きなもの・チャームポイントを入れて、自分の子だけの可愛い図鑑風に。",
  },
];

const promptRules = [
  "ペット本人の顔・表情・毛色・模様・目・鼻・口元・耳・毛並みを最優先で保持します。",
  "現実そのままではなく、夢のように美しく理想化された風景にします。",
  "汚れ・生活感・混雑・暗さ・ごちゃつきは避けます。",
  "黒い子や濃い色の子でも、背景の明るさを暗く引きずらないようにします。",
  "1個選択カテゴリと自由入力は重複させず、自由入力がある場合は自由入力を優先します。",
  "映画ポスター風だけは、体型やポーズを参照せず、顔と毛色だけを本人化します。",
];

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <img
          src="/top.png"
          alt="ゆゆママの夢プロンプト工房（汎用版）"
          className="heroImage"
        />

        <div className="sisterBox">
          <span className="sisterLabel">姉妹サイト</span>
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
        <section className="intro card">
          <p className="eyebrow">Yuyu Mama Dream Prompt Studio</p>
          <h1>ゆゆママの夢プロンプト工房（汎用版）</h1>
          <p>
            うちの子を主役に、世界旅行・夏の海・乗り物・映画ポスター風など、
            夢のように美しい画像プロンプトを作るための工房です。
          </p>
          <p>
            現実のごちゃごちゃではなく、透明感・清潔感・理想化された
            “うちの子の夢世界” を大切にします。
          </p>
        </section>

        <section className="section">
          <div className="sectionHeader">
            <p className="eyebrow">Recommended</p>
            <h2>おすすめテンプレ</h2>
          </div>

          <div className="templateGrid">
            {recommendedTemplates.map((template) => (
              <article className="templateCard" key={template.id}>
                <img src={template.image} alt={template.title} />
                <div className="templateBody">
                  <span className="badge">{template.badge}</span>
                  <h3>{template.title}</h3>
                  <p>{template.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="sectionHeader">
            <p className="eyebrow">Categories</p>
            <h2>初期カテゴリ</h2>
          </div>

          <div className="categoryGrid">
            {categories.map((category) => (
              <article className="smallCard" key={category.title}>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section card rules">
          <p className="eyebrow">Core Rules</p>
          <h2>この工房の共通ルール</h2>
          <ul>
            {promptRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
