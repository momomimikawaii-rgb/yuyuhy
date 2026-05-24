import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Sparkles, Copy, CheckCircle2, AlertCircle, Globe2, Waves, Film, Train, PawPrint, Info, Shirt, Heart, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import "./style.css";

const sisterSiteUrl = "https://yuyupm.vercel.app/";
const heroImageUrl = "/top.png";

const identityRule = `アップロードされたペットの顔・表情・毛色・模様・目の形・鼻と口まわり・耳の位置・毛並み・体格を最優先で保持してください。
犬・猫・ハムスターなど、元写真のペットの種類と本人らしさを守り、別の子に変えないでください。
可愛く整える場合も、元写真の本人らしさを崩さないことを最重要にしてください。
白目・まつ毛・別の口元・別犬風の丸顔など、元写真にない要素は勝手に追加しないでください。`;

const dreamRule = `現実そのままではなく、夢の中のように美しく理想化された風景にしてください。
雑多な現実感、生活感、汚れ、暗さ、混雑、観光客、不要な看板、古びた質感は避けてください。
その場所がいちばん美しく見える光、色、空気感で仕上げてください。
ペットが本来入れない場所でも、夢の世界として自然に存在しているようにしてください。
ペットの顔が主役としてはっきり見える構図にしてください。
背景や小物を盛りすぎて、ペット本人が埋もれないようにしてください。`;

const darkDogRule = `黒い子・濃い茶色の子・グレー系の子でも、背景や全体の色調を暗く引きずらないでください。
ペット本来の毛色は保ちつつ、背景は選んだ世界観どおり明るく、透明感と清潔感のある色合いを維持してください。`;

const movieRule = `このカテゴリでは、アップロードされたペット写真は顔・毛色・模様・耳・目・鼻・口元・表情・毛並みの参考としてのみ使用してください。
元写真の体型、ポーズ、四足姿勢はコピーしないでください。
体は固定された可愛いマスコット人形風の直立ボディにしてください。
小さなぬいぐるみのような二足立ちで、背筋はまっすぐ。
腰を後ろに突き出した姿勢、犬同士が不自然に密着する姿勢、交尾のように見える姿勢は禁止です。
服や衣装で体型を自然に隠し、顔だけを本人らしく差し替えてください。
実在映画のロゴやタイトルは再現せず、架空タイトルとして扱ってください。`;

const animalRule = `動物たちはリアル寄りの質感を保ちながらも、夢の世界のように理想化された美しい姿で表現してください。
汚れ・泥・黄ばみ・濡れて束になった毛・野生の荒々しさ・獣臭さは不要です。
白熊は美しい純白のふわふわした毛並みで、大きくても優しく穏やかな雰囲気にしてください。
アザラシは小さく丸い白い赤ちゃんアザラシ（ごまちゃん風）として表現してください。
ペンギンは可愛らしく整った姿で、暗すぎたり汚れた印象にしないでください。`;

const categories = [
  { id:"travel", label:"夢の世界旅行", icon:Globe2, desc:"有名観光地を、うちの子が行ける理想化された夢の旅写真にします。", templates:[
    { id:"mykonos", label:"夢のミコノス島フォト", image:"/mykonos.png", prompt:"夢のように美しいミコノス島風の白い街並み。真っ白な建物、濃いコバルトブルーの丸い屋根、青いドアや窓、白い階段が続く明るい地中海の風景。禿げ山、茶色い岩山、観光客向けの雑多な店、汚れた床、生活感、手入れされていない植栽は目立たせないでください。白と青、透明感のあるターコイズブルーの海、きらめく陽射しを主役にしてください。" },
    { id:"mont", label:"モンサンミッシェル風", prompt:"幻想的で美しいモンサンミッシェル風の夢旅行写真。海に浮かぶ修道院のような壮大な建築、やわらかな光、夢のような空気感。観光客や雑多な現実感は省き、ペットが主役の美しい旅写真にしてください。" },
    { id:"venice", label:"ベネチア風", prompt:"夢のように美しいベネチア風の水辺の街。ゴンドラ、運河、クラシカルな建物、きらめく水面。混雑や生活感は避け、ロマンチックで清潔感のある理想の旅風景にしてください。" },
    { id:"kyoto", label:"京都風", prompt:"美しい京都風の夢旅行写真。石畳、和の建築、庭園、桜や紅葉など、上品で静かな和の空気感。現実の混雑や雑多な観光地感は避け、ペットが主役になる理想化された京都にしてください。" }
  ]},
  { id:"summer", label:"夏・海・水中", icon:Waves, desc:"海、花火、水中、川遊び、浮き輪、スイカ、アイスなどの明るい夏。", templates:[
    { id:"beach", label:"夢のビーチリゾート", prompt:"明るく美しい夢のビーチリゾート。白い砂浜、透明なターコイズブルーの海、青空、きらめく陽射し。現実的な海水浴場ではなく、清潔感のある理想化された夏の海にしてください。" },
    { id:"fireworks", label:"夏の花火", prompt:"美しい夏の夜空に大きな花火が広がる幻想的な風景。夜でもペットの顔は暗くならず、やわらかく明るく見えるようにしてください。人混みや屋台のごちゃごちゃは控えめにし、花火とペットを主役にしてください。" },
    { id:"underwater", label:"水中世界", prompt:"夢のように美しい水中世界。透明な海、色鮮やかな熱帯魚、サンゴ礁、きらめく水面の光。現実的すぎる暗い海中ではなく、明るく幻想的でペットが自然に存在できる海の夢世界にしてください。" },
    { id:"river", label:"川遊び", prompt:"澄んだ川の浅瀬で、水しぶきをあげながら可愛く遊んでいる夏の風景。自然の緑と透明な水を明るく美しく表現してください。泥っぽさ、暗い川、危険な流れは避けてください。" }
  ]},
  { id:"vehicle", label:"乗り物系", icon:Train, desc:"本物再現ではなく、ペットサイズの絵本みたいな夢の乗り物。", templates:[
    { id:"sl", label:"おもちゃのSL", prompt:"ペットサイズの可愛いおもちゃのSL機関車。本物の電車ではなく、絵本の中のようなミニチュア感のある乗り物にしてください。ペットの顔が見えるように、車体に埋もれない構図にしてください。" },
    { id:"retro_airplane", label:"レトロ飛行機", prompt:"ペットサイズの可愛いレトロ飛行機。青空の中を旅しているような、明るく楽しい冒険感。リアルな兵器や危険な航空機ではなく、絵本のような夢の乗り物にしてください。" },
    { id:"balloon", label:"気球", prompt:"ペットが可愛い気球に乗って空を旅している夢のような風景。明るい空、雲、遠くの景色を美しく見せてください。" },
    { id:"sidecar", label:"サイドカー", prompt:"可愛いレトロなサイドカーにペットが乗っている構図。ワイルドすぎず、春風や旅の楽しさを感じる明るい雰囲気にしてください。" }
  ]},
  { id:"movie", label:"映画ポスター風", icon:Film, desc:"構図・服・体型固定。顔と毛色だけ本人化する特殊テンプレ。", templates:[
    { id:"titanic", label:"豪華客船ロマンス風", image:"/titanic.png", prompt:"豪華客船を舞台にしたロマンス映画ポスター風。夕焼け、海、ドラマチックな空、船首を思わせる構図。実在映画名や実在ロゴは使わず、架空映画ポスターとして仕上げてください。" },
    { id:"princess", label:"おとぎ話プリンセス風", prompt:"おとぎ話のプリンセス映画ポスター風。魔法の森、古城、光の粒、ロマンチックで夢のような雰囲気。実在作品や実在キャラクターは再現せず、架空映画ポスターとして仕上げてください。" },
    { id:"magic_school", label:"魔法学校ファンタジー風", prompt:"魔法学校を舞台にしたファンタジー映画ポスター風。古い城、魔法の光、ローブ風衣装、冒険の始まりを感じる構図。実在作品や実在ロゴは再現しないでください。" },
    { id:"pirate", label:"海賊冒険映画風", prompt:"可愛い海賊冒険映画ポスター風。大きな船、宝箱、海、冒険感。怖すぎず、ペット向けに明るく楽しい雰囲気にしてください。" }
  ]},
  { id:"animal", label:"動物さんと一緒", icon:PawPrint, desc:"白熊、茶熊、ごまちゃん、ペンギンなど、綺麗で優しい夢の動物たち。", templates:[
    { id:"polar_bear", label:"白熊さんと一緒", prompt:"美しい純白の白熊さんと一緒にいます。白熊は大きくても優しく穏やかな雰囲気で、汚れ・泥・黄ばみ・濡れて束になった毛は出さないでください。" },
    { id:"brown_bear", label:"茶熊さんと一緒", prompt:"大きくて優しい茶熊さんと仲良く並んでいます。リアル寄りでも怖くせず、ぬいぐるみのような優しい雰囲気にしてください。" },
    { id:"baby_seal", label:"白いごまちゃん", prompt:"小さく丸い白い赤ちゃんアザラシ（ごまちゃん風）が一緒にいます。ぬいぐるみのような愛らしさと透明感を重視してください。リアルすぎる海獣感や怖さは不要です。" },
    { id:"penguins", label:"ペンギンの中に混ざる", prompt:"少数の可愛いペンギンたちの中に、ペットが自然に混ざっています。ペンギンは丸く整った可愛い姿にしてください。不気味な顔、崩れた顔、数が多すぎて主役が埋もれる表現は避けてください。" }
  ]},
  { id:"info", label:"うちの子図鑑", icon:Info, desc:"名前・性格・好きなものを入れて、自分の子だけの図鑑風に。", templates:[
    { id:"profile", label:"うちの子プロフィール図鑑", prompt:"アップロードされたペットを主役にした、可愛いプロフィール図鑑風インフォグラフィック。文字は短く大きく読みやすく、情報を可愛いアイコンや小さなイラストで整理してください。すべてのコマで同じペット本人らしさを保ってください。" }
  ]}
];

const recommendations = [
  { title:"ゆゆママのお勧め：夢のミコノス島フォト", image:"/mykonos.png", categoryId:"travel", templateId:"mykonos", text:"白と青とターコイズの海を、現実より綺麗な夢のリゾートに。" },
  { title:"ゆゆママのお勧め：豪華客船ロマンス風", image:"/titanic.png", categoryId:"movie", templateId:"titanic", text:"構図・体型・衣装は固定。顔と毛色だけ本人化する映画ポスター風。" }
];

const outfits = [
  { id:"none", label:"服なし", prompt:"服は着せず、自然なペットの姿にしてください。" },
  { id:"auto", label:"おまかせ", prompt:"選んだ世界観に似合う服やアクセサリーを自然に合わせてください。" },
  { id:"frill_swimsuit", label:"フリル水着", prompt:"フリル付きの可愛いペット用水着を着せてください。" },
  { id:"marine", label:"マリン風水着", prompt:"白と青を基調にした爽やかなマリン風水着を着せてください。" },
  { id:"yukata", label:"浴衣", prompt:"夏祭りに似合う可愛い浴衣を着せてください。" },
  { id:"heko_yukata", label:"兵児帯つき浴衣", prompt:"ふんわりした兵児帯つきの可愛い浴衣を着せてください。" },
  { id:"furisode", label:"振袖着物（友禅）", prompt:"華やかな友禅柄の振袖着物を着せてください。" },
  { id:"taisho", label:"大正ロマン風着物", prompt:"大正ロマン風の上品で可愛い着物を着せてください。" },
  { id:"retro_travel", label:"レトロ旅行服", prompt:"昔の旅行ポスターのようなレトロで可愛い旅行服を着せてください。" },
  { id:"pilot", label:"パイロット風", prompt:"ゴーグルや帽子を合わせた可愛いパイロット風衣装にしてください。" }
];

const underwaterGimmicks = [
  { id:"none", label:"なし", prompt:"" },
  { id:"turtle", label:"亀の上", prompt:"大きな海亀の背中に優しく乗っています。夢のような海中冒険の雰囲気にしてください。" },
  { id:"shell", label:"貝の上", prompt:"真珠のように美しく輝く大きな貝の上に乗っています。貝は幻想的で上品な光沢があり、海のおとぎ話のような雰囲気にしてください。" },
  { id:"bottle", label:"瓶の中", prompt:"透明感のある幻想的なガラス瓶の中にいます。瓶の中は小さな海の世界のように美しく表現してください。" },
  { id:"float", label:"浮き輪", prompt:"可愛い浮き輪に乗って、透明な海にぷかぷか浮かんでいます。" },
  { id:"dolphin", label:"イルカの上", prompt:"優しいイルカの背中に乗って、夢のような海を進んでいます。" },
  { id:"orca", label:"オルカの上", prompt:"優しいオルカの背中に乗って、迫力はありつつも怖くない夢の海の雰囲気にしてください。" }
];

const summerGimmicks = [
  { id:"none", label:"なし", prompt:"" },
  { id:"watermelon_split", label:"スイカ割り", prompt:"砂浜で可愛くスイカ割りをしている夏らしい場面にしてください。" },
  { id:"watermelon", label:"スイカを食べる", prompt:"大きなスイカを嬉しそうに食べている、夏らしく可愛い場面にしてください。" },
  { id:"soda_ice", label:"ソーダアイス", prompt:"夏らしい水色のソーダアイスを嬉しそうに食べています。爽やかで涼しげな雰囲気にしてください。" },
  { id:"water_ski", label:"水上スキー", prompt:"透明な海の上で可愛く水上スキーをしています。元気で爽快な夏のアクション感を出しつつ、怖くならない楽しい雰囲気にしてください。" }
];

const vibeOptions = [
  { id:"clear", label:"透明感", prompt:"透明感のある澄んだ仕上がり。" },
  { id:"dreamy", label:"夢のよう", prompt:"夢の中のように幻想的で美しい雰囲気。" },
  { id:"bright", label:"明るい光", prompt:"明るい自然光で、顔が暗くならないようにしてください。" },
  { id:"clean", label:"清潔感", prompt:"汚れや生活感のない清潔で美しい仕上がり。" },
  { id:"storybook", label:"絵本感", prompt:"絵本の中のような優しい世界観。" }
];

function findById(list, id) {
  return list.find((item) => item.id === id) || list[0];
}

function App() {
  const [categoryId, setCategoryId] = useState("travel");
  const [templateIds, setTemplateIds] = useState({ travel:"mykonos", summer:"beach", vehicle:"sl", movie:"titanic", animal:"polar_bear", info:"profile" });
  const [outfitId, setOutfitId] = useState("auto");
  const [customOutfit, setCustomOutfit] = useState("");
  const [underwaterGimmickId, setUnderwaterGimmickId] = useState("none");
  const [summerGimmickId, setSummerGimmickId] = useState("none");
  const [selectedVibeIds, setSelectedVibeIds] = useState(["clear","dreamy","bright"]);
  const [titleText, setTitleText] = useState("");
  const [profileText, setProfileText] = useState("");
  const [copied, setCopied] = useState(false);

  const category = findById(categories, categoryId);
  const template = findById(category.templates, templateIds[categoryId]);
  const outfit = findById(outfits, outfitId);
  const underwater = findById(underwaterGimmicks, underwaterGimmickId);
  const summer = findById(summerGimmicks, summerGimmickId);
  const vibes = selectedVibeIds.map((id) => findById(vibeOptions, id));
  const CategoryIcon = category.icon;

  const prompt = useMemo(() => {
    const parts = [
      "【最優先：ペット本人の保持】\n" + identityRule,
      "【共通：夢化・理想化】\n" + dreamRule
    ];
    if (category.id === "movie") parts.push("【映画ポスター風の特殊ルール】\n" + movieRule);
    if (category.id === "animal") parts.push("【動物さんの表現】\n" + animalRule);
    parts.push("【世界観・背景】\n" + template.prompt);
    if (category.id === "movie") {
      parts.push("【衣装・体型】\n衣装、体型、ポーズ、構図はテンプレート固定です。変更するのは顔、耳、毛色、模様、手の毛色だけにしてください。");
    } else {
      parts.push("【服・アクセサリー】\n" + (customOutfit.trim() || outfit.prompt));
    }
    if (category.id === "summer") {
      if (underwater.prompt) parts.push("【水中・海ギミック】\n" + underwater.prompt);
      if (summer.prompt) parts.push("【夏の小物・動き】\n" + summer.prompt);
    }
    if (vibes.length) parts.push("【色合い・光・雰囲気】\n" + vibes.map(v => v.prompt).join("\n") + "\n" + darkDogRule);
    if (category.id === "movie" && titleText.trim()) parts.push("【架空タイトル】\n「" + titleText.trim() + "」\n短く大きく読みやすく配置してください。実在映画ロゴや実在ブランド風の完全再現は避けてください。");
    if (category.id === "info" && profileText.trim()) parts.push("【プロフィール情報】\n" + profileText.trim() + "\n文字は短く、大きく、読みやすく整理してください。");
    parts.push("【仕上げ】\n高品質、可愛いペットポートレート、清潔感、透明感、理想化された夢の世界。");
    return parts.join("\n\n");
  }, [category, template, outfit, customOutfit, underwater, summer, vibes, titleText, profileText]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const selectRecommendation = (item) => {
    setCategoryId(item.categoryId);
    setTemplateIds((current) => ({ ...current, [item.categoryId]: item.templateId }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleVibe = (id) => {
    setSelectedVibeIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  return (
    <main className="page">
      <div className="blob blob-pink" />
      <div className="blob blob-violet" />
      <div className="blob blob-blue" />
      <div className="dots" />

      <div className="container">
        <header className="hero">
          <div className="badge"><Sparkles size={18} /> Yuyu Mama Dream Prompt Studio</div>
          <h1>ゆゆママの夢プロンプト工房（汎用版）</h1>
          <p className="subtitle">うちの子を主役に、世界旅行・夏の海・乗り物・映画ポスター風など、夢のように美しい画像プロンプトを作る工房です。</p>
          <div className="hero-image"><img src={heroImageUrl} alt="ゆゆママの夢プロンプト工房 トップ画像" /></div>
          <a className="sister-link" href={sisterSiteUrl} target="_blank" rel="noreferrer"><LinkIcon size={16} /> 姉妹サイト：ゆゆ姫の夢かわプロンプト工房はこちら</a>
        </header>

        <section className="card recommend-card">
          <h2><Sparkles size={19} /> ゆゆママのお勧め</h2>
          <div className="recommend-grid">
            {recommendations.map((item) => (
              <button key={item.title} type="button" className="recommend-item" onClick={() => selectRecommendation(item)}>
                <img src={item.image} alt={item.title} />
                <span><strong>{item.title}</strong><small>{item.text}</small></span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid">
          <section className="left">
            <div className="notice"><strong>この工房の方針</strong><span>現実そのままではなく、清潔感・透明感・夢感を大切にした「うちの子の理想世界」を作ります。</span></div>

            <section className="card">
              <h2><Sparkles size={19} /> 1. ジャンルを選択</h2>
              <div className="choice-grid">
                {categories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} className={`big-choice ${category.id === item.id ? "active-soft" : ""}`} type="button" onClick={() => setCategoryId(item.id)}>
                      <strong><Icon size={18} /> {item.label}</strong><span>{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="card">
              <h2><CategoryIcon size={19} /> 2. テンプレを選択</h2>
              <div className="chips">
                {category.templates.map((item) => (
                  <button key={item.id} className={`chip ${template.id === item.id ? "active" : ""}`} type="button" onClick={() => setTemplateIds((cur) => ({ ...cur, [categoryId]: item.id }))}>{item.label}</button>
                ))}
              </div>
              {template.image && <div className="sample-image"><img src={template.image} alt={template.label} /></div>}
            </section>

            {category.id !== "movie" && (
              <section className="card">
                <h2><Shirt size={19} /> 3. 服・アクセサリー</h2>
                <p className="selected">自由入力欄に書いた場合、選択した服は無視して自由入力を優先します。</p>
                <div className="chips">
                  {outfits.map((item) => <button key={item.id} className={`chip ${outfit.id === item.id ? "active" : ""}`} type="button" onClick={() => setOutfitId(item.id)}>{item.label}</button>)}
                </div>
                <label>自由入力</label>
                <input value={customOutfit} onChange={(e) => setCustomOutfit(e.target.value)} placeholder="例：水色チェックのフリルワンピースと大きなリボン" />
              </section>
            )}

            {category.id === "movie" && (
              <section className="card">
                <h2><Film size={19} /> 3. 架空タイトル</h2>
                <p className="selected">映画ポスター風は、服・体型・構図固定。顔と毛色だけ本人化します。</p>
                <label>タイトル</label>
                <input value={titleText} onChange={(e) => setTitleText(e.target.value)} placeholder="例：白雪ゆゆ姫" />
              </section>
            )}

            {category.id === "summer" && (
              <section className="card">
                <h2><Waves size={19} /> 4. 夏・水中ギミック</h2>
                <label>水中・海ギミック</label>
                <div className="chips">{underwaterGimmicks.map((item) => <button key={item.id} className={`chip ${underwater.id === item.id ? "active" : ""}`} type="button" onClick={() => setUnderwaterGimmickId(item.id)}>{item.label}</button>)}</div>
                <label>夏の小物・動き</label>
                <div className="chips">{summerGimmicks.map((item) => <button key={item.id} className={`chip ${summer.id === item.id ? "active" : ""}`} type="button" onClick={() => setSummerGimmickId(item.id)}>{item.label}</button>)}</div>
              </section>
            )}

            {category.id === "info" && (
              <section className="card">
                <h2><Info size={19} /> 3. プロフィール情報</h2>
                <textarea className="profile-textarea" value={profileText} onChange={(e) => setProfileText(e.target.value)} placeholder={`名前：
性格：
好きなもの：
苦手なもの：
チャームポイント：
入れたい一言：`} />
              </section>
            )}

            <section className="card">
              <h2><Heart size={19} /> 雰囲気（3つまで選択可能）</h2>
              {selectedVibeIds.length >= 3 && <div className="message ok"><CheckCircle2 size={16} />雰囲気は3つ選択済みです。変更したい場合は、どれかを外してください。</div>}
              <div className="chips">{vibeOptions.map((item) => <button key={item.id} className={`chip ${selectedVibeIds.includes(item.id) ? "active" : ""}`} type="button" onClick={() => toggleVibe(item.id)}>{item.label}</button>)}</div>
            </section>
          </section>

          <aside className="right">
            <section className="card result-card">
              <div className="card-head">
                <h2><ImageIcon size={19} /> 生成プロンプト</h2>
                <button className="main-button" type="button" onClick={copyPrompt}>{copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}{copied ? "コピー済み" : "コピー"}</button>
              </div>
              <div className="message warn"><AlertCircle size={16} />画像生成時は、このプロンプトと一緒にペット写真をアップロードしてください。</div>
              <textarea value={prompt} readOnly />
            </section>
            <section className="card small-card"><h2><Sparkles size={18} /> メモ</h2><p>まずは80点版として公開し、実際に画像を作りながらカテゴリ・文言・事故防止ルールを育てていく想定です。</p></section>
          </aside>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
