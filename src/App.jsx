import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Sparkles, Copy, CheckCircle2, AlertCircle, Globe2, Waves, Film, Train, PawPrint, Info, Shirt, Heart, Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";
import "./style.css";

const sisterSiteUrl = "https://yuyupm.vercel.app/";
const heroImageUrl = "/top.png";

const identityRule = `アップロードされたペットの顔・表情・毛色・模様・目の形・鼻と口まわり・耳の位置・毛並み・体格を最優先で保持してください。
犬・猫・ハムスターなど、元写真のペットの種類と本人らしさを守り、別の子に変えないでください。
可愛く整える場合も、元写真の本人らしさを崩さないことを最重要にしてください。
白目・まつ毛・別の口元・別犬風の丸顔など、元写真にない要素は勝手に追加しないでください。`;
const dreamRule = `現実そのままではなく、夢の中のように美しく理想化された風景にしてください。
雑多な現実感、生活感、汚れ、暗さ、混雑、観光客、不要な看板、古びた質感は避けてください。
ペットが本来入れない場所でも、夢の世界として自然に存在しているようにしてください。
ペットの顔が主役としてはっきり見える構図にしてください。
背景や小物を盛りすぎて、ペット本人が埋もれないようにしてください。`;
const travelRule = `旅行カテゴリは「夢の観光ポスター構図」で作ってください。
場所らしさが分かる背景量と、ペットの顔がちゃんと見える距離の両方を優先してください。
近すぎてただの壁や階段にならず、遠すぎてペットが豆粒にならないようにしてください。
現実の建物配置を完全再現する必要はありません。色合い・建物の特徴・空気感は守りつつ、ペットが一番可愛く見えるように夢世界として再構成してください。
各場所がいちばん素敵に見えるカメラ位置、見下ろし、見上げ、運河沿い、石畳の奥行き、遠景広めなどを自動で選んでください。`;
const movieRule = `映画ポスター風カテゴリでは、アップロードされたペット写真は顔・毛色・模様・耳・目・鼻・口元・表情・毛並みの参考としてのみ使用してください。
元写真の体型、ポーズ、四足姿勢はコピーしないでください。
体は固定された可愛いマスコット人形風の直立ボディにしてください。
腰を後ろに突き出した姿勢、犬同士が不自然に密着する姿勢、交尾のように見える姿勢は禁止です。
服や衣装で体型を自然に隠し、顔だけを本人らしく差し替えてください。
実在映画のロゴやタイトルは再現せず、架空タイトルとして扱ってください。`;
const animalRule = `一緒にいる動物たちはリアル寄りの質感を保ちながらも、夢の世界のように理想化された美しい姿で表現してください。
汚れ・泥・黄ばみ・濡れて束になった毛・野生の荒々しさ・獣臭さは不要です。
猛獣や大型動物も怖くせず、清潔で優しく、ぬいぐるみのような愛らしさを少し加えてください。
キリン・馬・シマウマ・象などは、首や脚を長くしすぎず、丸く可愛いぬいぐるみ寄りの体型にしてください。
恐竜は怖くせず、歯や爪を強調せず、子ども向け絵本のような優しいぬいぐるみ恐竜にしてください。`;
const kigurumiRule = `きぐるみを選んだ場合、首から下は完全に丸いぬいぐるみ体型にしてください。
元写真の体型・ポーズ・4本脚姿勢は参照しすぎず、ころころした赤ちゃんぬいぐるみのように、丸い胴体、短い手足、やわらかいシルエットにしてください。
手先・足先まで全部きぐるみで覆い、元の手足や肉球や足先を出さないでください。
理想は、ぬいぐるみの顔部分だけをくり抜いて、そこからペット本人の顔だけが見えている状態です。
顔・表情・目・鼻・口元・耳・毛色・模様は元写真の本人らしさを最優先で保持してください。
きぐるみの毛質は、安っぽい化繊・スポンジ・舞台衣装・ビニール感ではなく、高級感のあるふわふわのフェイクファー、抱きしめたくなるベビーぬいぐるみの質感にしてください。`;
const darkDogRule = `黒い子・濃い茶色の子・グレー系の子でも、背景や全体の色調を暗く引きずらないでください。
ペット本来の毛色は保ちつつ、背景は選んだ世界観どおり明るく、透明感と清潔感のある色合いを維持してください。`;

const opt = arr => arr.map(([id,label,prompt,extra]) => ({id,label,prompt,...(extra||{})}));
const lightOptions = opt([
 ["auto","おまかせ","選んだ世界観に一番似合う光へ自動調整してください。"],
 ["day","明るい昼","明るい昼の自然光で、全体を晴れやかに見せてください。"],
 ["sunset","夕方","美しい夕方の光で、暗くなりすぎず、温かく幻想的にしてください。"],
 ["night","夜でも顔明るく","夜景や暗い場面でも、ペットの顔はやわらかく明るく見えるようにしてください。"]
]);

const categories = [
 {id:"travel", label:"夢の世界旅行", icon:Globe2, description:"有名観光地を、うちの子が行ける理想化された夢の観光ポスター構図にします。", templates: opt([
  ["mykonos","ミコノス島風","白い階段、真っ白な建物、濃い青い丸屋根、青いドア、ターコイズブルーの海が見える理想化されたミコノス島風。禿山や茶色い岩山、雑多な観光地感は目立たせない。カメラは白い階段の奥行きと海が両方見え、ペットの顔も見える前景〜中景の夢の観光ポスター構図。"],
  ["mont","モンサンミッシェル風","海に浮かぶ修道院のような壮大な建築を、やわらかな光と幻想的な空気で表現。ペットは手前の石畳や水辺側に配置し、遠景に建築全体が分かる夢の観光ポスター構図。"],
  ["venice","ベネチア風","運河、ゴンドラ、クラシカルな建物、きらめく水面のベネチア風。ペットは前景の橋やゴンドラ横に配置し、運河の奥行きと街並みが分かる構図。"],
  ["kyoto","京都風","石畳、和の建築、庭園、桜や紅葉など、上品で静かな京都風。混雑を避け、奥行きある参道や庭を背景に、ペットの顔が見える前景〜中景構図。"],
  ["paris","パリ風","エッフェル塔やクラシカルな街灯、上品なカフェ通りを思わせる夢のパリ風。観光客や車は減らし、遠景に塔や街並みが分かり、ペットは前景で可愛く映る観光ポスター構図。"],
  ["london","ロンドン風","赤い電話ボックス、クラシカルな街並み、ビッグベン風の時計塔、霧ではなく明るく上品なロンドン風。ペットは前景、街の記号が背景に入る構図。"],
  ["alsace","アルザス風","木組みの家、花いっぱいの窓辺、石畳の小道が続くアルザス風。家並みの奥行きが分かる中景構図で、ペットを前景に置く。"],
  ["petite","ラ・プチ・ヴェニス風","運河、花飾り、カラフルで可愛い家並みのラ・プチ・ヴェニス風。運河を横方向に見せ、ペットは橋やテラス側の前景に配置する。"],
  ["romantic","ロマンチック街道風","石畳、絵本のような中世ヨーロッパの街並み、可愛い塔や木組みの家が続くロマンチック街道風。ローアングル気味で奥行きを出し、ペットを旅の主役にする。"],
  ["castle","ノイシュバンシュタイン城風","白く美しいおとぎ話のお城、山や森を理想化した明るい景色。城は遠景で形が分かるようにし、ペットは前景の草地や小道に配置する。"],
  ["taj","タージマハル風","白大理石の壮麗な建築と水面反射を持つタージマハル風。左右対称の美しい構図を保ち、ペットは前景中央寄りで顔が見えるサイズにする。"],
  ["bali","バリ島寺院風","湖や水辺に浮かぶ美しいバリ島寺院風。暗い湿気や古びた感じは避け、神秘的で清潔感ある夢の南国寺院にする。"],
  ["uyuni","ウユニ塩湖風","鏡のような水面に空が映るウユニ塩湖風。超広角の美しい空と反射を見せつつ、ペットは前景で顔が見えるサイズにする。"],
  ["aurora","オーロラの国風","美しいオーロラと雪景色の夢の北国。夜でもペットの顔は明るく、寒々しく汚れた雪ではなく、透明感のある幻想的な世界にする。"],
  ["burano","ブラーノ島風","カラフルな家並みと運河が美しいブラーノ島風。少し離れた運河沿い構図で、家並みの色の連なりが分かるようにし、ペットは前景寄りに配置する。"],
  ["guanajuato","グアナファト風","丘に広がるカラフルな街並みのグアナファト風。高台から少し見下ろす構図で街全体の色が分かるようにし、ペットは手前のテラスや石畳に配置する。"],
  ["cordoba","コルドバのパティオ風","白壁の中庭、アーチ、壁一面の鉢花、石畳が美しいコルドバのパティオ風。ペットは前景〜中景に配置し、中庭の入口アーチと壁いっぱいの鉢花が分かる構図。",{colorPresets:true}],
  ["custom_place","自由記入の場所","ユーザーが指定した場所を、夢の観光ポスター構図で理想化してください。場所以外のギミック・ポーズ・服装指定は無視してください。",{customPlace:true}]
 ])},
 {id:"summer", label:"夏・海・水中", icon:Waves, description:"海、花火、水中、川遊び、浮き輪、スイカ、アイスなどの明るい夏。", templates: opt([
  ["beach","夢のビーチリゾート","明るく美しい夢のビーチリゾート。白い砂浜、透明なターコイズブルーの海、青空、きらめく陽射し。現実的な海水浴場ではなく、清潔感のある理想化された夏の海。"],
  ["fireworks","夏の花火","美しい夏の夜空に大きな花火が広がる幻想的な風景。夜でもペットの顔は暗くならず、花火とペットを主役にする。"],
  ["underwater","水中世界","夢のように美しい水中世界。透明な海、色鮮やかな熱帯魚、サンゴ礁、きらめく水面の光。明るく幻想的でペットが自然に存在できる海の夢世界。"],
  ["river","川遊び","澄んだ川の浅瀬で、水しぶきをあげながら可愛く遊んでいる夏の風景。泥っぽさ、暗い川、危険な流れは避ける。"]
 ])},
 {id:"vehicle", label:"乗り物系", icon:Train, description:"本物再現ではなく、ペットサイズの絵本みたいな夢の乗り物。", templates: opt([
  ["sl","おもちゃのSL","ペットサイズの可愛いおもちゃのSL機関車。本物の電車ではなく、絵本の中のようなミニチュア感のある乗り物。"],
  ["retro_airplane","レトロ飛行機","ペットサイズの可愛いレトロ飛行機。青空の中を旅しているような、明るく楽しい冒険感。"],
  ["balloon","気球","ペットが可愛い気球に乗って空を旅している夢のような風景。"],
  ["sidecar","サイドカー","可愛いレトロなサイドカーにペットが乗っている構図。ワイルドすぎず明るい旅の雰囲気。"],
  ["flying_bike","未来の空飛ぶバイク","未来の空飛ぶバイクにペットが乗る、明るく可愛いSFファンタジー。危険なバイクではなく、丸く安全なおもちゃ感のある乗り物。"],
  ["flying_car","未来の空飛ぶ車","未来の空飛ぶ車にペットが乗る、夢の都市や空を旅する可愛いSF風。ペットサイズで安全そうな丸いデザイン。"],
  ["race_cart","おもちゃのレースカート","実在作品には似せず、カラフルで可愛いおもちゃのレースカートに乗る楽しい構図。"],
  ["cloud_car","雲の上を走る小さな車","ふわふわの雲の上を小さな可愛い車で走る夢のドライブ。"],
  ["space_car","宇宙船風ミニカー","宇宙船のような丸いミニカーに乗って星空を旅する、怖くない可愛い宇宙冒険。"]
 ])},
 {id:"movie", label:"映画ポスター風", icon:Film, description:"構図・服・体型固定。顔と毛色だけ本人化する特殊テンプレ。", templates: opt([
  ["ship","豪華客船ロマンス風","豪華客船を舞台にしたロマンス映画ポスター風。夕焼け、海、ドラマチックな空、船首を思わせる構図。"],
  ["nanny","空飛ぶ魔法の乳母さん風","傘でふわっと空から降りてくる、クラシカルで楽しい魔法の乳母さん風ポスター。実在作品やキャラクターには似せない。"],
  ["planet","ペットの惑星風","遠い惑星を舞台に、ペットたちが主役になった壮大なSF映画ポスター風。実在作品には似せない。"],
  ["street","下町ミュージカル風","夜の下町で仲間と踊るミュージカル映画ポスター風。街灯、レンガ、ダンスの躍動感。実在作品の再現は避ける。"],
  ["princess","おとぎ話プリンセス風","魔法の森、古城、光の粒、ロマンチックで夢のようなおとぎ話プリンセス映画ポスター風。"],
  ["magic","魔法学校ファンタジー風","古い城、魔法の光、ローブ風衣装、冒険の始まりを感じる魔法学校ファンタジー映画ポスター風。"],
  ["pirate","海賊冒険映画風","大きな船、宝箱、海、冒険感のある可愛い海賊冒険映画ポスター風。"],
  ["sf","宇宙SF映画風","星空、宇宙船、光る惑星を背景にした壮大だけど可愛い宇宙SF映画ポスター風。"],
  ["detective","探偵ミステリー風","霧の街、街灯、虫眼鏡、クラシカルな探偵映画ポスター風。怖すぎず上品に。"],
  ["western","西部劇ポスター風","夕焼けの荒野、木造の街並み、帽子と旅の雰囲気の西部劇ポスター風。危険な銃や暴力表現は避ける。"],
  ["theater","ミュージカル劇場風","舞台照明、幕、華やかなショー感のあるミュージカル劇場ポスター風。"]
 ])},
 {id:"animal", label:"動物さんと一緒", icon:PawPrint, description:"好きな動物さんと一緒。色選択や自由記入もできます。", templates: opt([["friend","動物さんと一緒","選んだ動物さんと仲良く一緒にいる、夢のように可愛い動物フォト。"]])},
 {id:"infographic", label:"うちの子インフォグラフィック", icon:Info, description:"希少動物図鑑風の本格インフォグラフィックを作ります。", templates: opt([["rare","希少動物図鑑風","アップロードされたペットを、世界に一匹だけの希少動物として紹介する、本格的で可愛いインフォグラフィック風フォト。"]])}
];

const recommendations = [
 {title:"ゆゆママのお勧め：夢のミコノス島フォト", image:"/mykonos.png", categoryId:"travel", templateId:"mykonos", text:"白と青とターコイズの海を、現実より綺麗な夢のリゾートに。"},
 {title:"ゆゆママのお勧め：豪華客船ロマンス風", image:"/titanic.png", categoryId:"movie", templateId:"ship", text:"構図・体型・衣装は固定。顔と毛色だけ本人化する映画ポスター風。"}
];
const cordobaColors = opt([
 ["yuyu","ゆゆママおすすめ","白壁、コバルトブルーの鉢、ピンクの花を多めにした可愛い配色。"],
 ["colorful","カラフル華やか","白壁に、色々な鉢と赤・ピンク・紫・黄色の花を華やかに飾る。"],
 ["chic","上品シック","白壁、黒い鉄格子、深緑、赤い花少なめの上品で落ち着いた配色。"],
 ["blue","爽やかブルー","白壁、青鉢多め、白・水色・淡ピンクの花を使った爽やかな配色。"]
]);
const commonOutfits = opt([
 ["keep","なし（元写真のまま）","服は新しく追加せず、元写真の服や自然な姿を維持してください。"],
 ["auto","おまかせ","選んだ世界観に似合う服を自然に合わせてください。"],
 ["travel","レトロ旅行服","昔の旅行ポスターのようなレトロで可愛い旅行服を着せてください。"]
]);
const outfitSet={
 travel:[...commonOutfits,...opt([["furisode","振袖着物（友禅）","華やかな友禅柄の振袖着物を着せてください。"],["taisho","大正ロマン風着物","大正ロマン風の上品で可愛い着物を着せてください。"]])],
 summer:opt([["keep","なし（元写真のまま）","服は新しく追加せず、元写真の服や自然な姿を維持してください。"],["auto","おまかせ","夏の世界観に似合う服を自然に合わせてください。"],["frill","フリル水着","フリル付きの可愛いペット用水着を着せてください。"],["marine","マリン風水着","白と青を基調にした爽やかなマリン風水着を着せてください。"],["yukata","浴衣","夏祭りに似合う可愛い浴衣を着せてください。"],["heko","兵児帯つき浴衣","ふんわりした兵児帯つきの可愛い浴衣を着せてください。"]]),
 vehicle:[...commonOutfits,...opt([["pilot","パイロット風","ゴーグルや帽子を合わせた可愛いパイロット風衣装にしてください。"]])],
 animal:opt([["k_auto","おまかせ（きぐるみ）","選んだ動物に合わせた可愛いきぐるみ姿にしてください。",{kigurumi:true}],["keep","なし（元写真のまま）","服は新しく追加せず、元写真の服や自然な姿を維持してください。"],["kigurumi","きぐるみ","選んだ動物モチーフの可愛いきぐるみ姿にしてください。",{kigurumi:true}]])
};
const headOptions=opt([["keep","なし（元写真のまま）","頭装備は追加せず、元写真のままにしてください。"],["auto","おまかせ","世界観に合う頭装備を自然に合わせてください。"],["ribbon","リボン","可愛いリボンをつけてください。"],["frill","フリル帽","可愛いフリル帽をつけてください。"],["straw","麦わら帽子","夏らしい麦わら帽子をつけてください。"],["flower_crown","花冠","可愛い花冠をつけてください。"],["crown","王冠","小さな可愛い王冠をつけてください。"],["goggles","ゴーグル","乗り物や冒険に似合う可愛いゴーグルをつけてください。"]]);
const shoes=opt([["keep","なし（元写真のまま）","靴は追加せず、元写真の足元を維持してください。"],["auto","おまかせ","世界観に合う靴や足元にしてください。"],["sandals","サンダル","可愛いサンダルを履かせてください。"],["boots","ブーツ","可愛いブーツを履かせてください。"],["ballet","バレエシューズ","上品で可愛いバレエシューズを履かせてください。"]]);
const accessories=opt([["neck","首飾り","可愛い首飾りをつけてください。"],["pearl","パール","上品なパールアクセサリーをつけてください。"],["bracelet","ブレスレット","小さな可愛いブレスレットをつけてください。"],["bib","スタイ","可愛いスタイをつけてください。"],["flower","花飾り","小さな花飾りを自然につけてください。"],["bag","小さなバッグ","小さな可愛いバッグを添えてください。"]]);
const outfitColors=opt([["auto","おまかせ","服セットの色合いは世界観に合わせておまかせにしてください。"],["pink","ピンク系","服セットの色合いはピンク系でまとめてください。"],["blue","水色系","服セットの色合いは水色系でまとめてください。"],["white","白系","服セットの色合いは白系でまとめてください。"],["lavender","ラベンダー系","服セットの色合いはラベンダー系でまとめてください。"],["mint","ミント系","服セットの色合いはミント系でまとめてください。"],["red","赤系","服セットの色合いは赤系でまとめてください。"]]);
const underwater=opt([["none","なし","",{block:[]}],["turtle","亀の上","大きな海亀の背中に優しく乗っています。夢のような海中冒険の雰囲気にしてください。",{block:["ski"]}],["shell","貝の上","真珠のように美しく輝く大きな貝の上に乗っています。",{block:["ski","split"]}],["bottle","瓶の中","透明感のある幻想的なガラス瓶の中にいます。",{block:["ski","split"]}],["float","浮き輪","可愛い浮き輪に乗って、透明な海にぷかぷか浮かんでいます。",{block:[]}],["dolphin","イルカの上","優しいイルカの背中に乗って、夢のような海を進んでいます。",{block:["ski"]}],["orca","オルカの上","優しいオルカの背中に乗って、怖くない夢の海の雰囲気にしてください。",{block:["ski"]}]]);
const summerG=opt([["none","なし",""] ,["split","スイカ割り","砂浜で可愛くスイカ割りをしている夏らしい場面にしてください。"],["watermelon","スイカを食べる","大きなスイカを嬉しそうに食べている、夏らしく可愛い場面にしてください。"],["ice","ソーダアイス","夏らしい水色のソーダアイスを嬉しそうに食べています。"],["ski","水上スキー","透明な海の上で可愛く水上スキーをしています。"]]);
const vibes=opt([["clear","透明感","透明感のある澄んだ仕上がり。"],["dream","夢のよう","夢の中のように幻想的で美しい雰囲気。"],["bright","明るい","明るく晴れやかな雰囲気。"],["clean","清潔感","汚れや生活感のない清潔で美しい仕上がり。"],["book","絵本感","絵本の中のような優しい世界観。"]]);
const animals=[
 ["duck","あひる"],["raccoon","アライグマ"],["alpaca","アルパカ"],["rabbit","うさぎ",["白","茶","黒"]],["wombat","ウォンバット"],["horse","馬"],["cockatiel","オカメインコ",["白","並"]],["duck2","鴨"],["capybara","カピバラ"],["giraffe","キリン"],["bear","くま",["白","茶","黒"]],["koala","コアラ"],["gorilla","ゴリラ"],["deer","鹿"],["zebra","シマウマ"],["swan","白鳥"],["budgie","セキセイインコ",["黄緑","水色","黄色","白"]],["elephant","象"],["cheetah","チーター"],["tiger","虎"],["dino","恐竜",["ティラノ","トリケラ","ブラキオ","ステゴ"]],["panda","パンダ"],["shoebill","ハシビロコウ"],["hedgehog","ハリネズミ"],["leopard","豹",["黄","黒"]],["sheep","羊"],["meerkat","ミーアキャット"],["goat","ヤギ"],["lion","ライオン"],["redpanda","レッサーパンダ"]
].map(([id,label,colors])=>({id,label,colors}));
const by=(arr,id)=>arr.find(x=>x.id===id)||arr[0];

function App(){
 const [cat,setCat]=useState("travel");
 const [tpl,setTpl]=useState({travel:"mykonos",summer:"beach",vehicle:"sl",movie:"ship",animal:"friend",infographic:"rare"});
 const [hideRec,setHideRec]=useState(false),[copied,setCopied]=useState(false);
 const [customPlace,setCustomPlace]=useState(""),[cordoba,setCordoba]=useState("yuyu");
 const [outfitId,setOutfitId]=useState("auto"),[customOutfit,setCustomOutfit]=useState("");
 const [headId,setHeadId]=useState("auto"),[customHead,setCustomHead]=useState("");
 const [shoeId,setShoeId]=useState("keep"),[customShoe,setCustomShoe]=useState("");
 const [accIds,setAccIds]=useState([]),[customAcc,setCustomAcc]=useState("");
 const [colorId,setColorId]=useState("auto"),[customColor,setCustomColor]=useState("");
 const [lightId,setLightId]=useState("auto");
 const [underId,setUnderId]=useState("none"),[summerId,setSummerId]=useState("none");
 const [vibeIds,setVibeIds]=useState(["clear","dream","clean"]),[title,setTitle]=useState("");
 const [animalId,setAnimalId]=useState("panda"),[animalColor,setAnimalColor]=useState(""),[customAnimal,setCustomAnimal]=useState("");
 const [profile,setProfile]=useState("");
 const category=by(categories,cat), template=by(category.templates,tpl[cat]);
 const outfitList=outfitSet[cat]||commonOutfits, outfit=by(outfitList,outfitId), isK=!!outfit.kigurumi;
 const head=by(headOptions,headId), shoe=by(shoes,shoeId), col=by(outfitColors,colorId), li=by(lightOptions,lightId), un=by(underwater,underId), su=by(summerG,summerId), animal=by(animals,animalId), Icon=category.icon;
 const prompt=useMemo(()=>{
  const p=[`【最優先：ペット本人の保持】\n${identityRule}`,`【共通：夢化・理想化】\n${dreamRule}`];
  if(cat==="travel")p.push(`【旅行カテゴリ：夢の観光ポスター構図】\n${travelRule}`);
  if(cat==="movie")p.push(`【映画ポスター風の特殊ルール】\n${movieRule}`);
  if(cat==="animal")p.push(`【動物さんの表現】\n${animalRule}`);
  let world=template.prompt;
  if(template.customPlace&&customPlace.trim())world+=`\n場所：${customPlace.trim()}\n※自由記入は場所名としてのみ扱い、ギミック・ポーズ・服装指定は無視してください。`;
  if(template.id==="cordoba")world+=`\n色合い：${by(cordobaColors,cordoba).prompt}`;
  p.push(`【世界観・背景】\n${world}`);
  if(cat==="movie")p.push("【衣装・体型】\n衣装、体型、ポーズ、構図はテンプレート固定です。変更するのは顔、耳、毛色、模様、手の毛色だけにしてください。");
  else if(cat!=="infographic"){
    p.push(`【服】\n${customOutfit.trim()||outfit.prompt}`);
    if(isK)p.push(`【きぐるみ専用補正】\n${kigurumiRule}`);
    else{
      p.push(`【頭装備】\n${customHead.trim()||head.prompt}`);
      p.push(`【靴】\n${customShoe.trim()||shoe.prompt}`);
      const ac=[...accIds.map(id=>by(accessories,id).prompt),customAcc.trim()].filter(Boolean).join("\n");
      if(ac)p.push(`【アクセサリー】\n${ac}`);
      p.push(`【服セットの色合い】\n${customColor.trim()||col.prompt}`);
    }
  }
  if(cat==="summer"){if(un.prompt)p.push(`【水中・海ギミック】\n${un.prompt}`);if(su.prompt)p.push(`【夏の小物・動き】\n${su.prompt}`);}
  if(cat==="animal"){const a=customAnimal.trim()||`${animalColor?animalColor+"の":""}${animal.label}`;p.push(`【一緒にいる動物】\n${a}と一緒にいます。怖くせず、清潔で優しい夢の動物さんとして表現してください。`);}
  if(cat==="infographic")p.push(`【インフォグラフィック情報】\n${profile.trim()||"名前、性格、好きなもの、苦手なもの、よく目撃される時間、よく目撃される場所、食性、チャームポイント、豆知識などを、飼い主から聞いた情報として整理してください。学名風の名前はAIがその子らしく可愛く自動で作ってください。"}\n希少動物図鑑風に、入力された情報を自然に言い換えてください。例：「よく散歩に行く時間」は「よく目撃される時間」のように表現してください。文字は大きく読みやすく、情報量は本格的に、でもごちゃつきすぎないようにしてください。`);
  p.push(`【光・明るさ】\n${li.prompt}`);
  p.push(`【雰囲気】\n${vibeIds.map(id=>by(vibes,id).prompt).join("\n")}\n${darkDogRule}`);
  if(cat==="movie"&&title.trim())p.push(`【架空タイトル】\n「${title.trim()}」\n短く大きく読みやすく配置してください。実在映画ロゴや実在ブランド風の完全再現は避けてください。`);
  p.push("【仕上げ】\n高品質、可愛いペットポートレート、清潔感、透明感、理想化された夢の世界。");
  return p.join("\n\n");
 },[cat,template,customPlace,cordoba,outfit,customOutfit,isK,head,customHead,shoe,customShoe,accIds,customAcc,col,customColor,un,su,animal,animalColor,customAnimal,profile,li,vibeIds,title]);
 const copy=async(text=prompt)=>{await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1400)};
 const toggleAcc=id=>setAccIds(cur=>cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]);
 const toggleVibe=id=>setVibeIds(cur=>cur.includes(id)?cur.filter(x=>x!==id):cur.length>=3?cur:[...cur,id]);
 const changeCat=id=>{setCat(id);const list=outfitSet[id]||commonOutfits;setOutfitId(list.find(x=>x.id==="auto")?.id||list[0].id);};
 const recommendationPrompt=r=>{const rc=by(categories,r.categoryId),rt=by(rc.templates,r.templateId);const arr=[`【最優先：ペット本人の保持】\n${identityRule}`,`【共通：夢化・理想化】\n${dreamRule}`];if(r.categoryId==="travel")arr.push(`【旅行カテゴリ：夢の観光ポスター構図】\n${travelRule}`);if(r.categoryId==="movie")arr.push(`【映画ポスター風の特殊ルール】\n${movieRule}`);arr.push(`【世界観・背景】\n${rt.prompt}`);if(r.categoryId==="movie")arr.push("【衣装・体型】\n衣装、体型、ポーズ、構図はテンプレート固定です。変更するのは顔、耳、毛色、模様、手の毛色だけにしてください。");arr.push(`【光・明るさ】\n${li.prompt}`);arr.push(`【雰囲気】\n${vibeIds.map(id=>by(vibes,id).prompt).join("\n")}\n${darkDogRule}`);arr.push("【仕上げ】\n高品質、可愛いペットポートレート、清潔感、透明感、理想化された夢の世界。");return arr.join("\n\n")};
 const selectRec=r=>{setCat(r.categoryId);setTpl(cur=>({...cur,[r.categoryId]:r.templateId}));copy(recommendationPrompt(r));};
 const blocked=un.block||[];
 return <main className="page"><div className="blob blob-pink"/><div className="blob blob-violet"/><div className="blob blob-blue"/><div className="dots"/><div className="container">
  <header className="hero"><div className="badge"><Sparkles size={18}/>Yuyu Mama Dream Prompt Studio</div><h1>ゆゆママの夢プロンプト工房（汎用版）</h1><p className="subtitle">うちの子を主役に、世界旅行・夏の海・乗り物・映画ポスター風など、夢のように美しい画像プロンプトを作る工房です。</p><div className="hero-image"><img src={heroImageUrl} alt="トップ画像"/></div><a className="sister-link" href={sisterSiteUrl} target="_blank" rel="noreferrer"><LinkIcon size={16}/>姉妹サイト：ゆゆ姫の夢かわプロンプト工房はこちら</a></header>
  {!hideRec&&<section className="card recommend-card"><div className="card-head"><h2><Sparkles size={19}/>ゆゆママのお勧め</h2><button className="outline-button" onClick={()=>setHideRec(true)}><X size={16}/>閉じる</button></div><div className="recommend-grid">{recommendations.map(r=><article className="recommend-item" key={r.title}><img src={r.image} alt={r.title}/><div><strong>{r.title}</strong><small>{r.text}</small><button className="main-button mini" onClick={()=>selectRec(r)}>このおすすめを使う</button></div></article>)}</div></section>}
  <div className="grid"><section className="left"><div className="notice"><strong>この工房の方針</strong><span>清潔感・透明感・夢感を大切にした「うちの子の理想世界」を作ります。</span></div>
  <section className="card"><h2><Sparkles size={19}/>1. ジャンルを選択</h2><div className="choice-grid">{categories.map(c=>{const I=c.icon;return <button className={`big-choice ${cat===c.id?"active-soft":""}`} onClick={()=>changeCat(c.id)} key={c.id}><strong><I size={18}/>{c.label}</strong><span>{c.description}</span></button>})}</div></section>
  <section className="card"><h2><Icon size={19}/>2. テンプレを選択</h2><div className="chips">{category.templates.map(t=><button className={`chip ${template.id===t.id?"active":""}`} onClick={()=>setTpl(cur=>({...cur,[cat]:t.id}))} key={t.id}>{t.label}</button>)}</div>{template.customPlace&&<><label>自由記入欄</label><p className="selected">※場所のみ記入してください。ギミック・ポーズ・服装指定などは無視されます。</p><input value={customPlace} onChange={e=>setCustomPlace(e.target.value)} placeholder="例：フィレンツェ、ドバイ、モロッコの青い街"/></>}{template.id==="cordoba"&&<><label>パティオの色合い</label><div className="chips">{cordobaColors.map(x=><button className={`chip ${cordoba===x.id?"active":""}`} onClick={()=>setCordoba(x.id)} key={x.id}>{x.label}</button>)}</div></>}</section>
  {cat!=="movie"&&cat!=="infographic"&&<section className="card"><h2><Shirt size={19}/>3. 服</h2><p className="selected">自由入力欄に書いた場合、服の選択肢は無効になります。「なし」は裸ではなく元写真のままです。</p><div className="chips">{outfitList.map(o=><button disabled={!!customOutfit.trim()} className={`chip ${outfit.id===o.id?"active":""}`} onClick={()=>setOutfitId(o.id)} key={o.id}>{o.label}</button>)}</div><label>服の自由記入</label><input value={customOutfit} onChange={e=>setCustomOutfit(e.target.value)} placeholder="例：水色チェックのフリルワンピース"/>{!isK&&<><h2>4. 頭装備</h2><p className="selected">頭装備は1つだけ選べます。自由入力欄に書いた場合、選択肢は無効になります。</p><div className="chips">{headOptions.map(h=><button disabled={!!customHead.trim()} className={`chip ${head.id===h.id?"active":""}`} onClick={()=>setHeadId(h.id)} key={h.id}>{h.label}</button>)}</div><label>頭装備の自由記入</label><input value={customHead} onChange={e=>setCustomHead(e.target.value)} placeholder="例：大きな水色チェックのリボン"/><h2>5. 靴</h2><p className="selected">靴は1つだけ選べます。自由入力欄に書いた場合、選択肢は無効になります。</p><div className="chips">{shoes.map(s=><button disabled={!!customShoe.trim()} className={`chip ${shoe.id===s.id?"active":""}`} onClick={()=>setShoeId(s.id)} key={s.id}>{s.label}</button>)}</div><label>靴の自由記入</label><input value={customShoe} onChange={e=>setCustomShoe(e.target.value)} placeholder="例：白い小さなサンダル"/><h2>6. アクセサリー</h2><p className="selected">アクセサリーは複数選択OK。自由記入も同時に反映されます。</p><div className="chips">{accessories.map(a=><button className={`chip ${accIds.includes(a.id)?"active":""}`} onClick={()=>toggleAcc(a.id)} key={a.id}>{a.label}</button>)}</div><label>アクセサリー自由記入</label><input value={customAcc} onChange={e=>setCustomAcc(e.target.value)} placeholder="例：小さなブレスレット、首元の花飾り"/><h2>7. 服セットの色合い</h2><p className="selected">自由入力欄に書いた場合、色合いの選択肢は無効になります。</p><div className="chips">{outfitColors.map(c=><button disabled={!!customColor.trim()} className={`chip ${col.id===c.id?"active":""}`} onClick={()=>setColorId(c.id)} key={c.id}>{c.label}</button>)}</div><label>色合い自由記入</label><input value={customColor} onChange={e=>setCustomColor(e.target.value)} placeholder="例：白とティファニーブルー"/></>}</section>}
  {cat==="movie"&&<section className="card"><h2><Film size={19}/>3. 架空タイトル</h2><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="例：白雪ゆゆ姫"/></section>}
  {cat==="summer"&&<section className="card"><h2><Waves size={19}/>8. 夏・水中ギミック</h2><label>水中・海ギミック</label><div className="chips">{underwater.map(u=><button className={`chip ${un.id===u.id?"active":""}`} onClick={()=>{setUnderId(u.id);if((u.block||[]).includes(summerId))setSummerId("none")}} key={u.id}>{u.label}</button>)}</div><label>夏の小物・動き</label><div className="chips">{summerG.map(s=><button disabled={blocked.includes(s.id)} className={`chip ${su.id===s.id?"active":""}`} onClick={()=>setSummerId(s.id)} key={s.id}>{s.label}</button>)}</div></section>}
  {cat==="animal"&&<section className="card"><h2><PawPrint size={19}/>8. 動物を選択</h2><div className="animal-list">{animals.map(a=><div className="animal-row" key={a.id}><button className={`animal-name ${animal.id===a.id?"active":""}`} onClick={()=>{setAnimalId(a.id);setAnimalColor(a.colors?.[0]||"")}}>{a.label}</button>{a.colors&&<span>{a.colors.map(color=><label className="radio-inline" key={color}><input type="radio" checked={animal.id===a.id&&animalColor===color} onChange={()=>{setAnimalId(a.id);setAnimalColor(color)}}/>{color}</label>)}</span>}</div>)}</div><label>自由記入</label><input value={customAnimal} onChange={e=>setCustomAnimal(e.target.value)} placeholder="例：白いフェネック、小さなユニコーン"/></section>}
  {cat==="infographic"&&<section className="card"><h2><Info size={19}/>3. プロフィール情報</h2><p className="selected">学名風の名前はAIが自動でつけます。入力内容は希少動物図鑑風に言い換えます。</p><textarea className="profile-textarea" value={profile} onChange={e=>setProfile(e.target.value)} placeholder={`名前：\n犬種・動物種：\n性別：\n年齢・誕生日：\n性格：\n好きなもの：\n苦手なもの：\nよく散歩に行く時間：\nよくいる場所：\n食べ物の好み：\nチャームポイント：\n特技：\n飼い主から一言：`}/></section>}
  <section className="card"><h2><Heart size={19}/>{cat==="summer"||cat==="animal"?"9":cat==="movie"||cat==="infographic"?"4":"8"}. 雰囲気（3つまで選択可能）</h2><div className="chips">{vibes.map(v=><button className={`chip ${vibeIds.includes(v.id)?"active":""}`} onClick={()=>toggleVibe(v.id)} key={v.id}>{v.label}</button>)}</div><label>光・明るさ</label><div className="chips">{lightOptions.map(l=><button className={`chip ${li.id===l.id?"active":""}`} onClick={()=>setLightId(l.id)} key={l.id}>{l.label}</button>)}</div></section>
  </section><aside className="right"><section className="card result-card"><div className="card-head"><h2><ImageIcon size={19}/>生成プロンプト</h2><button className="main-button" onClick={()=>copy()}>{copied?<CheckCircle2 size={16}/>:<Copy size={16}/>} {copied?"コピー済み":"コピー"}</button></div><div className="message warn"><AlertCircle size={16}/>画像生成時は、このプロンプトと一緒にペット写真をアップロードしてください。</div><textarea value={prompt} readOnly/></section></aside></div>
 </div></main>;
}
createRoot(document.getElementById("root")).render(<App/>);
