export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <img
          src="/top.png"
          alt="ゆゆママの夢プロンプト工房（汎用版）"
          className="hero-image"
        />

        <div className="sister-site">
          <p>🌸 姉妹サイト 🌸</p>

          <a
            href="https://yuyupm.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ゆゆ姫の夢かわプロンプト工房はこちら
          </a>
        </div>
      </header>

      <main className="content">
        <section className="intro">
          <h1>ゆゆママの夢プロンプト工房（汎用版）</h1>

          <p>
            うちの子を主役にした、夢のように美しい世界観を作るためのプロンプト工房。
          </p>

          <p>
            現実そのままではなく、透明感・理想化・幻想感を重視した
            “夢の世界” を目指します。
          </p>
        </section>

        <section className="templates">
          <h2>おすすめテンプレ</h2>

          <div className="template-grid">
            <div className="template-card">
              <img src="/mykonos.png" alt="ミコノス島" />

              <h3>夢のミコノス島フォト</h3>

              <p>
                白と青の街並み、輝く海、理想化された夢の地中海リゾート。
              </p>
            </div>

            <div className="template-card">
              <img src="/titanic.png" alt="映画ポスター風" />

              <h3>豪華客船ロマンス風ポスター</h3>

              <p>
                固定構図・固定ボディで、顔と毛色だけを本人化する映画ポスター風テンプレ。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
