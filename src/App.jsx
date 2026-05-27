import React, { useMemo, useState } from "react";
import { Sparkles, Copy, CheckCircle2, AlertCircle, Globe2, Waves, Film, Train, PawPrint, Info, Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";

const SISTER = "https://yuyupm.yuyu-chan.com";
const HERO = "/top.png";
const UPDATED_AT = "2026/05/28（木） 04:40頃";

const idRule = `アップロードされたペットの顔・表情・毛色・模様・目の形・鼻と口まわり・耳の位置・毛並み・体格を最優先で保持してください。別の子に変えないでください。白目・まつ毛・別の口元など、元写真にない要素は勝手に追加しないでください。`;
const dream = `現実そのままではなく、夢の中のように美しく理想化してください。生活感・汚れ・暗さ・混雑・不要な看板を避け、清潔感・透明感・夢感を大切にしてください。ペットの顔が主役として見える構図にしてください。`;
const darkFix = `黒い子・濃い茶色の子・グレー系の子でも、背景や全体の色調を暗く引きずらないでください。ペット本来の毛色は保ちつつ、背景は選んだ世界観どおり明るく維持してください。`;
const travelRule = `旅行カテゴリは「夢の観光ポスター構図」です。世界旅行は共通固定構図にせず、選んだ場所が一番美しく見える構図へ最適化してください。一本道や壁ドン構図を避け、曲がる道、上へ続く階段、踊り場、奥へ続く小道、街並みの連なり、広場、橋、水路、庭園、建物の重なりなど、その場所に合う奥行き・高低差・背景量を入れてください。場所らしさが分かる背景量と、ペットの顔が見える距離を両立してください。行き止まり、ただの壁、背景不足、犬だけアップは禁止。「先へ行きたくなる感」のある夢の観光ポスター構図にしてください。寺院・教会・宮殿・霊廟などは場所ごとの正しい建築要素として扱い、全地域へ一律には入れないでください。現実の建物配置は完全再現不要です。`;
const movieRule = `映画ポスター風では、元写真の体型・ポーズ・四足姿勢をコピーしないでください。体は可愛いマスコット人形風の直立ボディ。腰が後ろに出た犬の二足立ちは禁止。実在映画名・ロゴは使わず架空映画ポスターとして作ってください。`;
const animalRule = `選んだ動物に最も似合う夢背景を自動生成してください。ペットの高さは画像全体の35〜45％程度を目安にし、相手動物・背景・ギミックも見える少し引き気味の構図にしてください。ただの森・草原・単色背景は禁止。ペットのきぐるみは、ペット本人の毛色ではなく、一緒にいる動物の色・柄・耳・羽・模様に合わせてください。双子・親子・同じ生き物の仲間のようなおそろい感を出してください。相手動物に花冠や飾りがある場合は、ペットにもおそろいで付けてください。猛獣や大型動物も怖くせず、清潔で優しく、ぬいぐるみのような愛らしさを少し加えてください。キリン・馬・シマウマ・象は首や脚を長くしすぎないでください。恐竜は怖くせず絵本のようにしてください。`;
const petSizeRule = `映画ポスター風・インフォグラフィックを除き、世界旅行、動物さんと一緒、夏・海・水中、乗り物系では、ペットの高さを画像全体の35〜45％程度にしてください。ペットをアップにしすぎず、背景・ギミック・世界観がしっかり見える構図にしてください。カレンダーではカレンダー記入欄を除いた実質的な絵エリア基準で35〜45％程度にしてください。`;
const kigurumiRule = `きぐるみは首から下を完全に丸いぬいぐるみ体型にしてください。顔だけ本人が見えている状態にし、手先・足先まできぐるみで覆ってください。高級感のあるふわふわフェイクファーで、安っぽい化繊・スポンジ感は禁止。`;

const opt = (rows) => rows.map(([id,label,prompt,extra]) => ({id,label,prompt,...(extra||{})}));
const by = (arr,id) => arr.find(x=>x.id===id) || arr[0];

const lightOptions = opt([
  ["auto","おまかせ","選んだ世界観に一番似合う光へ自動調整してください。"],
  ["day","明るい昼","明るい昼の自然光で晴れやかにしてください。"],
  ["sunset","夕方","美しい夕方の光で、暗くなりすぎず温かく幻想的にしてください。"],
  ["night","夜でも顔明るく","夜景や暗い場面でもペットの顔はやわらかく明るくしてください。"]
]);

const ratioOptions = opt([
  ["1:1","1:1 正方形","1:1の正方形構図で作成してください。"],
  ["4:5","4:5 縦長","Instagram投稿向けの4:5縦長構図で作成してください。"],
  ["9:16","9:16 縦長","Instagramストーリー・リール向けの9:16縦長構図で作成してください。"],
  ["16:9","16:9 横長","16:9の横長構図で作成してください。"]
]);

const cats = [
  {id:"travel",label:"夢の世界旅行",icon:Globe2,desc:"うちの子と夢の観光ポスター構図。",tpl:opt([
    ["mykonos","ミコノス島風","ギリシャ・ミコノス島風。夢の中で見た理想のミコノス島のように、白い街並み、青い屋根、サンゴ礁ブルー〜ターコイズブルーの海、ブーゲンビリア、強い陽射し、透明感、海面のきらめきを極端に美しく理想化してください。単なる白い家背景ではなく、白い階段、曲がる坂道、上へ続く寺院や青い丸屋根、踊り場、青いドアと窓枠、石畳、白壁の光反射、ピンクのブーゲンビリア、遠くに見えるエーゲ海を入れてください。ペットは曲がった白い階段の踊り場、または奥へ続く白い坂道の前景〜中景に配置。背景には階段の奥行き、青い屋根、白い街並み、海の水平線がたっぷり見える構図。リゾートCMのような発光感、白壁反射、レンズフレア、透明な海、幸福感、観光ポスター感を強めてください。一本道・壁だけ・行き止まり・犬だけアップは禁止。ペットの高さは画像全体の35〜45％程度を目安にしてください。カメラは少し引き気味にし、背景量と顔の見えやすさを両立してください。"],
    ["paris","パリ風","フランス・パリ風。遠景にエッフェル塔、クラシカルな街灯、石畳、淡いクリーム色の建物、花のある上品なカフェ通り。車や人混みは減らし、ペットが前景で可愛く見える距離。パリらしいエレガントな空気感を残した夢の観光ポスター構図。"],
    ["london","ロンドン風","イギリス・ロンドン風。赤い電話ボックス、クラシカルな石造りの街並み、遠景にビッグベン風の時計塔、上品な街灯と石畳。霧で暗くしすぎず、明るく清潔なロンドンの空気。ペットは前景、背景にロンドンらしい象徴が入る構図。"],
    ["alsace","アルザス風","フランス・アルザス地方風。木組みの家、パステル色の壁、花いっぱいの窓辺、細い石畳の小道が奥へ続く絵本のような街並み。家の並びと小道の奥行きが分かる構図で、ペットは前景に可愛く配置。"],
    ["petite","ラ・プチ・ヴェニス風","フランス・コルマールのラ・プチ・ヴェニス風。細い運河、木組みのカラフルな家、窓辺の花飾り、小さな橋、水面の反射。運河を横方向に見せ、ペットは橋やテラス側の前景に配置。水辺と家並みが一緒に分かる構図。"],
    ["romantic","ロマンチック街道風","ドイツ・ロマンチック街道風。中世ヨーロッパの木組みの家、石畳の道、可愛い塔や城壁、花のある窓辺。少しローアングルで石畳の奥行きを出し、ペットが旅の主役に見える夢の観光ポスター構図。"],
    ["mont","モンサンミッシェル風","フランス・モンサンミッシェル風。海に浮かぶ修道院のような壮大な石造建築、干潟や水面、長い参道、淡い光の空。ペットは手前の石畳や水辺側、遠景に建築全体が分かる構図。暗く重くしすぎず幻想的に。"],
    ["venice","ベネチア風","イタリア・ベネチア風。運河、ゴンドラ、アーチ橋、クラシカルな水辺の建物、きらめく水面の反射。ペットは橋の上またはゴンドラ横の前景。運河の奥行きと建物の並びが分かる構図。"],
    ["kyoto","京都風","日本・京都風。石畳の小道、町家や寺院風の和建築、格子戸、庭園、季節の桜または紅葉。観光客や看板を減らし、上品で静かな和の空間。ペットは前景に置き、奥に和建築と庭の奥行きを見せる。"],
    ["castle","ノイシュバンシュタイン城風","ドイツ・ノイシュバンシュタイン城風。白いおとぎ話のような城、尖塔、山と森、明るい空、童話の挿絵のような高台の景色。城は遠景で形が分かるようにし、ペットは前景の草地や小道に配置。"],
    ["taj","タージマハル風","インド・タージマハル風。白大理石の壮麗な建築、大きなドーム、左右対称の庭園、細長い水路と水面反射。ペットは前景中央寄り、建築全体の対称性が分かる美しい構図。"],
    ["bali","バリ島寺院風","インドネシア・バリ島寺院風。湖や水辺に浮かぶ多層屋根の寺院、南国の緑、石の参道、静かな水面反射。湿った暗さや古びた汚れは避け、神秘的で清潔感ある夢の南国寺院にする。"],
    ["uyuni","ウユニ塩湖風","ボリビア・ウユニ塩湖風。鏡のような浅い水面に空と雲が反射する広大な塩湖、水平線まで続く透明な空間。ペットは前景で顔が見えるサイズにし、空と水面反射を大きく見せる超広角風構図。"],
    ["aurora","オーロラの国風","北欧・オーロラの国風。雪原、遠くの針葉樹、夜空に広がる緑や紫のオーロラ、澄んだ空気。夜景でもペットの顔は柔らかく明るく、雪は清潔で透明感ある白にする。"],
    ["burano","ブラーノ島風","イタリア・ブラーノ島風。運河沿いに並ぶ赤・青・黄色・ピンクなど鮮やかな家々、小さな橋、明るい水面反射。少し離れた運河沿い構図で、カラフルな家並みの連なりが分かるようにし、ペットは前景寄り。"],
    ["guanajuato","グアナファト風","メキシコ・グアナファト風。丘に密集するカラフルな家々、坂道、階段、テラス、明るい空。高台から少し見下ろす構図で街全体の色の重なりが分かるようにし、ペットは手前のテラスや石畳に配置。"],
    ["cordoba","コルドバのパティオ風","スペイン・コルドバのパティオ風。スペイン南部アンダルシア地方の白壁の中庭住宅。左右対称の正面固定だけにせず、斜めから見た非対称で可愛いパティオ構図にする。片側には白壁と青い鉢花が多く並び、反対側にはアーチ、小道、窓、アイアン装飾、植物の抜け感を作る。狭い石畳の中庭、白い壁一面の鉢花、青い鉢や色とりどりの鉢、アーチ、2〜3階の吹き抜けの中庭感。建物の高さや奥行きに差をつけ、奥へ続く石畳や小さな入口を見せる。上から光が差し込む明るいヨーロッパ住宅の中庭として表現し、ただの白壁、完全左右対称のステージ背景、謎の鉢植え背景にしない。",{colors:true}],
    ["custom","自由記入の場所","ユーザー指定の場所を夢の観光ポスター構図で理想化。場所以外のギミック・ポーズ・服装指定は無視。",{customPlace:true}]
  ])},
  {id:"summer",label:"夏・海・水中",icon:Waves,desc:"海・花火・水中・夏リゾート。",tpl:opt([
    ["beach","夢のビーチリゾート","白い砂浜、透明なターコイズブルーの海、青空、きらめく陽射し。"],
    ["villa","水上コテージ","透明な海、白い桟橋、美しい水上コテージ、水上ヴィラ、南国リゾート感。生活感・古びた木材・暗い海は禁止。"],
    ["fireworks","夏の花火","夏の夜空に花火。夜でも顔は暗くならず、花火とペットが主役。",{fireworks:true}],
    ["underwater","水中世界","透明な海、熱帯魚、サンゴ礁、きらめく水面光。明るく幻想的。"],
    ["river","川遊び","澄んだ川の浅瀬で可愛く遊ぶ夏風景。泥っぽさや危険な流れは禁止。"]
  ])},
  {id:"vehicle",label:"乗り物系",icon:Train,desc:"ペットサイズの夢の乗り物。",tpl:opt([
    ["sl","おもちゃのSL","ペットサイズの可愛いおもちゃのSL機関車。"],
    ["retro_airplane","レトロ飛行機","可愛いレトロ飛行機。青空を旅する明るい冒険感。"],
    ["balloon","気球","可愛い気球に乗って空を旅する夢風景。"],
    ["sidecar","サイドカー","可愛いレトロなサイドカー。"],
    ["flying_bike","未来の空飛ぶバイク","丸く安全なおもちゃ感のある未来の空飛ぶバイク。"],
    ["flying_car","未来の空飛ぶ車","夢の都市や空を旅する未来の空飛ぶ車。"],
    ["race_cart","おもちゃのレースカート","実在作品に似せず、カラフルで可愛いおもちゃのレースカート。"],
    ["cloud_car","雲の上を走る小さな車","ふわふわ雲の上を小さな可愛い車で走る夢のドライブ。"],
    ["space_car","宇宙船風ミニカー","丸い宇宙船風ミニカーで星空を旅する可愛い宇宙冒険。"],
    ["custom","自由記入の乗り物","ユーザー指定の乗り物をペットサイズで安全で可愛い夢の乗り物として作る。",{customVehicle:true}]
  ])},
  {id:"movie",label:"映画ポスター風",icon:Film,desc:"全部ポスター風。作品ごとに構図・服・体型固定。",tpl:opt([
    ["ship","豪華客船ロマンス映画風","豪華客船の船首デッキで、1枚目のペットが前に立ち両手を左右に大きく広げる。2枚目があれば後ろで優しく支える相手役。夕焼けの海、船首の手すり、豪華客船の煙突を入れる。2枚写真推奨。1枚だけの場合は後ろの相手役は控えめな同種ペットまたはシルエット。"],
    ["nanny","傘をさして空から降りてくる乳母さん風","傘をさして空からふわっと降りてくるクラシカルな乳母さん風映画ポスター。女の子はピンク系、男の子は青系。服・帽子・傘・バッグは同系色で統一。絵本風指定時は街並みを明るいパステルカラーにする。"],
    ["planet","赤いペットの惑星SFポスター風","赤く染まった惑星の空。全体を赤・黒・オレンジ系で統一した終末SF映画ポスター風。画面左下に砂に半分埋もれた巨大な自由の女神像。ペットの顔を中央〜右側に大きく印象的に配置。遠景に荒廃した未来都市、赤い空、惑星、宇宙船。"],
    ["street","アメリカ下町ミュージカル映画風","アメリカの下町ストリート、古いレンガ建物、非常階段、黄色いビートル風レトロ車。ペット3匹でミュージカルダンス。中央の子を大きく、両手を広げ、右足つま先立ち、左足を横に大きく広げる。3枚アップなら1枚目中央、2枚目左、3枚目右。1枚だけなら左右は同じペット種。日本の昭和商店街は禁止。"],
    ["cinderella","ガラスの靴プリンセス映画風","青いキラキラドレスのプリンセス映画ポスター。大きな階段を降りる構図、ドレスの裾が大きく流れる。ガラスの靴とかぼちゃの馬車を小さく入れる。夜空、魔法の光、青白い輝き。"],
    ["ice_princess","氷のプリンセス映画風","青白い氷世界。青い氷ドレス、長い金髪のおさげウィッグが風になびく。氷の城、吹雪、青白い氷の光。前足から雪と氷の魔法が広がる映画ポスター風。"],
    ["magic","魔法学校ファンタジー映画風","1枚目のペットを中央の主役にした魔法学校映画ポスター。人数は3匹。左右の仲間は2枚目・3枚目があれば本人化、1枚だけなら同じペット種でAIが作る。左上または右上に夜の崖上の魔法学校の城、背景または下部に赤黒のレトロな魔法列車。黒い魔法ローブ、主役は丸メガネと杖。"],
    ["pirate","伝説の海賊船長映画風","伝説の海賊船長映画ポスター。赤いバンダナ必須、くるくるしたドレッド風の髪かつら必須、ビーズ飾り、白いシャツ、黒〜焦げ茶のベスト、腰ベルト、海賊コート風。背景に海賊船、夕焼けと嵐空、海、煙、古い港町。"],
    ["subway_wind","地下鉄から風ふいてスカートめくれる映画風","1950年代アメリカ映画ポスター風。白いふわふわドレス姿のペットが地下鉄の通気口の上で、下から吹き上がる風によりスカートがふわっと大きく舞い上がる。横には黄色いスーツと帽子を着た同じペット種の男の子役が驚いたように見上げる。"],
  ])},
  {id:"animal",label:"動物さんと一緒",icon:PawPrint,desc:"動物さんと一緒。色選択も自由記入もOK。",tpl:opt([["friend","動物さんと一緒","選んだ動物さんと仲良く一緒にいる、夢のように可愛い動物フォト。"]])},
  {id:"panel",label:"うちの子パネル",icon:Info,desc:"インフォグラフィック・カレンダー。",tpl:opt([
    ["info","インフォグラフィック","世界に一匹だけの希少動物として紹介する本格インフォグラフィック風パネル。"],
    ["calendar","カレンダー","ペットを主役にした飾りたくなるカレンダーパネル。"]
  ])}
];

const cordobaColors = opt([
  ["yuyu","ゆゆママおすすめ","白壁、コバルトブルーの鉢、ピンクの花を多めにした可愛い配色。"],
  ["colorful","カラフル華やか","白壁に、色々な鉢と赤・ピンク・紫・黄色の花を華やかに飾る。"],
  ["chic","上品シック","白壁、黒い鉄格子、深緑、赤い花少なめの上品で落ち着いた配色。"],
  ["blue","爽やかブルー","白壁、青鉢多め、白・水色・淡ピンクの花を使った爽やかな配色。"]
]);

const genderOptions = opt([["feminine","女の子服","フリル・リボン・ワンピース・可愛い色合いなど、女の子服寄りの服作り方針。"],["masculine","男の子服","シャツ・ベスト・パンツ・スポーティさなど、男の子服寄りの服作り方針。"],["neutral","中性的な服","性別感を強く出しすぎず、ナチュラルで可愛いユニセックス寄りの服作り方針。"]]);
const tasteOptions = opt([["elegant","エレガント","上品でエレガントな服装。"],["sporty","スポーティ","元気でスポーティな服装。"],["casual","カジュアル","自然で可愛いカジュアル服。"],["frill","フリル","フリルを使った可愛い服。"],["lolita","ロリータ","ロリータ風の可愛い服。"],["goth","ゴスロリ","ゴスロリ風の可愛い服。"],["princess","プリンセス","ティアラやリボンが似合う、上品で夢かわいいプリンセス系の服。"]]);

const baseOutfits = opt([["auto","おまかせ","選んだ世界観に似合う服。"],["keep","なし（元写真のまま）","服は新しく追加せず、元写真の服や自然な姿を維持。"]]);
const mykonosOutfits = opt([["swim","水着","服の基本方針に合わせた爽やかで可愛い夏リゾート水着。"],["summer_frill","夏向きフリル付きワンピース","夏向きの軽やかなフリル付きワンピース。"],["summer_sport","夏向きスポーティセットアップ","夏向きのスポーティセットアップ。"],["summer_casual","夏向けカジュアルセットアップ","夏向けカジュアルセットアップ。"]]);
const underwaterOutfits = opt([["water_swim","水着","服の基本方針に合わせた爽やかで可愛い水中・海向け水着。"],["scuba","スキューバダイビングスーツ","明るい海に似合う可愛いスキューバダイビングスーツ。"],["light_dive","軽装ダイビングスーツ","軽やかで可愛い水中探検用ダイビングスーツ。"],["marine_rescue","マリンレスキュー風","水中レスキュー隊のような爽やかで安全そうなマリン服。"],["aqua_explorer","水中探検隊風","夢の水中探検隊のような可愛い服。"]]);
const fireworksOutfits = opt([["yukata","浴衣","服の基本方針に合わせた夏祭り向けの可愛い浴衣。帯と和柄を自然に合わせてください。"]]);

const kyotoOutfits = opt([["furisode","振袖着物（友禅）","華やかな友禅柄の振袖着物。"],["taisho","大正ロマン風着物","大正ロマン風の上品で可愛い着物。"]]);
const vehicleWear = {
  sl: opt([["conductor","車掌服","可愛い車掌服。"],["station","レトロ駅員風","レトロ駅員風の服。"]]),
  retro_airplane: opt([["pilot_jacket","飛行機乗りジャンパー","飛行機乗り風ジャンパー。"],["pilot","パイロット風ジャケット","パイロット風ジャケット。"]]),
  flying_bike: opt([["future","未来風ライダースーツ","未来風のかっこいいライダースーツ。"],["sf","SFジャンプスーツ","SF風ジャンプスーツ。"]]),
  flying_car: opt([["future","未来風ライダースーツ","未来風のかっこいいライダースーツ。"],["sf","SFジャンプスーツ","SF風ジャンプスーツ。"]]),
  space_car: opt([["sf","SFジャンプスーツ","SF風ジャンプスーツ。"],["space","近未来パイロットスーツ","近未来パイロットスーツ。"]])
};
const animalWear = opt([["k_auto","おまかせ（きぐるみ）","一緒にいる動物とおそろいに見える可愛いきぐるみ姿。動物の色・柄・耳・羽・模様・花冠などを合わせ、双子・親子・仲間のように見せる。",{kigurumi:true}],["keep","なし（元写真のまま）","元写真のまま。"]]);

const headBase = opt([["auto","おまかせ","世界観に合う頭装備。"],["keep","なし（元写真のまま）","頭装備は追加せず、元写真のまま。"],["ribbon","リボン","可愛いリボン。"],["frill","フリル帽","可愛いフリル帽。"],["flower","花冠","可愛い花冠。"],["tiara","ティアラ","小さく上品で可愛いティアラ。"]]);
const headSummer = opt([["straw","麦わら帽子","夏らしい麦わら帽子。"]]);
const headUnderwater = opt([["seawalk","シーウォーク風金魚鉢ヘルメット","シーウォークのような丸い透明ヘルメット。顔は見えるようにしてください。"],["clear_helmet","丸型透明ヘルメット","丸い透明潜水ヘルメット。顔は隠しすぎない。"],["future_helmet","未来風透明ヘルメット","未来風の透明ヘルメット。可愛く安全そうに。"]]);

const headVehicle = opt([["goggles","ゴーグル","乗り物や冒険に似合う可愛いゴーグル。"],["pilot_hat","パイロット帽","可愛いパイロット帽。"]]);
const shoes = opt([["auto","おまかせ","世界観に合う靴や足元。"],["keep","なし（元写真のまま）","靴は追加せず元写真の足元を維持。"],["sandals","サンダル","可愛いサンダル。"],["boots","ブーツ","可愛いブーツ。"]]);
const accessories = opt([["auto","おまかせ","世界観に合うアクセサリーをAIが可愛く選ぶ。"],["keep","なし（元写真のまま）","アクセサリーは新しく追加しない。"],["neck","首飾り","可愛い首飾り。"],["bracelet","ブレスレット","小さな可愛いブレスレット。"],["bib","スタイ","可愛いスタイ。"]]);
const colors = opt([["auto","おまかせ","世界観に合わせた色。"],["pink","ピンク系","ピンク系。"],["blue","水色系","水色系。"],["white","白系","白系。"],["lav","ラベンダー系","ラベンダー系。"],["mint","ミント系","ミント系。"],["red","赤系","赤系。"]]);

const under = opt([["auto","おまかせ","選んだ夏・海・水中テーマに一番似合う安全で可愛いギミックをAIが選ぶ。水中世界では透明な海底世界、珊瑚、泡、光、海底ミニチュア空間を優先する。",{block:[]}],["none","なし","",{block:[]}],["turtle","亀の上","大きな海亀の背中に優しく乗る。",{block:["ski","split"]}],["shell","貝の上","真珠のような大きな貝の上。",{block:["ski","split"]}], ["bottle_dome","ドーム型瓶","大きな透明ドーム型のガラス瓶の中に、ペットが座れる小さな夢かわ海底ミニチュア空間を作る。瓶の中は海底神殿・小さな宮殿・深海プリンセス空間のようにし、白砂、パステル珊瑚、貝殻、真珠、宝石、泡、光の粒を入れる。宝石箱のような発光感と高級感を出し、瓶の外側にも神秘的な海底の青い奥行きを見せる。ペットの高さは画像全体の35〜45％程度。",{block:["ski","split","watermelon","ice"]}],["bottle_sand","斜めに砂へ埋まった瓶","海底の白砂へ斜めに埋まっている透明なガラス瓶。横倒しではなく、浅瀬の白砂に斜めに差し込まれて少し埋まった瓶にしてください。瓶の中に、ペットが座れる小さな夢かわ海底ミニチュア空間を作る。浅瀬、白砂、珊瑚礁、泡、貝殻、真珠、光の差し込み、漂流ファンタジー感を入れ、海底で見つけた夢の小瓶のように見せる。背景は明るい浅瀬と透明なサンゴ礁の海。ペットの高さは画像全体の35〜45％程度。",{block:["ski","split","watermelon","ice"]}],["dolphin","イルカの上","優しいイルカの背中。",{block:["ski","split"]}],["orca","オルカの上","優しいオルカの背中。",{block:["ski","split"]}]]);
const summerActs = opt([["none","なし",""],["split","スイカ割り","砂浜など安全な場所でスイカ割り。動物の背中では行わない。"],["watermelon","スイカを食べる","大きなスイカを嬉しそうに食べる。"],["ice","ソーダアイス","水色のソーダアイスを嬉しそうに食べる。"],["ski","水上スキー","透明な海で可愛く水上スキー。"]]);
const fireworksPlaces = opt([["park","遊園地","遊園地から花火を見る。"],["festival","夏祭り","夏祭り会場で花火を見る。"],["shrine","神社の境内","神社の境内から花火を見る。"],["boat","船の上","船の上から花火を見る。"],["beach","ビーチ","ビーチから花火を見る。"]]);
const vibes = opt([["clear","透明感","透明感のある澄んだ仕上がり。"],["dream","夢のよう","夢の中のように幻想的。"],["bright","明るい","明るく晴れやか。"],["clean","清潔感","汚れや生活感のない清潔な仕上がり。"],["book","絵本感","絵本のような優しい世界観。"]]);

const animals = [
 ["duck","あひる"],["raccoon","アライグマ"],["alpaca","アルパカ"],["rabbit","うさぎ",["白","茶","黒"]],["wombat","ウォンバット"],["horse","馬"],["cockatiel","オカメインコ",["白","並"]],["duck2","鴨"],["capybara","カピバラ"],["giraffe","キリン"],["bear","くま",["白","茶","黒"]],["koala","コアラ"],["gorilla","ゴリラ"],["deer","鹿"],["zebra","シマウマ"],["swan","白鳥"],["budgie","セキセイインコ",["黄緑","水色","黄色","白"]],["elephant","象"],["cheetah","チーター"],["tiger","虎"],["dino","恐竜",["ティラノ","トリケラ","ブラキオ","ステゴ"]],["panda","パンダ"],["shoebill","ハシビロコウ"],["hedgehog","ハリネズミ"],["leopard","豹",["黄","黒"]],["sheep","羊"],["meerkat","ミーアキャット"],["goat","ヤギ"],["lion","ライオン"],["redpanda","レッサーパンダ"]
].map(([id,label,colors])=>({id,label,colors}));

const monthThemes = {
 1:"お正月。和室、床の間、正月飾り、梅、障子から朝日、羽子板、鏡餅、金粉。高級感ある可愛い着物、和風の飾り帯、繊細な帯飾り、花の帯結び。男の子は青系の落ち着いた高級和装、女の子はピンク系の華やかな着物。",
 2:"雪遊び。スノーボード、雪の結晶、雪煙、小さい雪だるま。男の子は青系、女の子はピンク系のスノボスーツとゴーグル。女の子は冬服に合うふわふわリボンをつける。",
 3:"ひな祭り。お雛様の祭壇、桃の花、和室、三色団子、甘酒、ひなあられ。淡いピンク系の可愛い和装。豪華すぎず上品。",
 4:"満開の桜。桜トンネル、桜吹雪多め、桜絨毯、青空。春のおでかけ服。女の子は桜色の春服・軽いケープ・春リボン、男の子は生成りや薄ピンクの春色ケープ。マズルに桜の花びらを1枚ちょこんと乗せる。マズルが目立たない子やハムスターは額に花びら。",
 5:"こいのぼりと初夏ピクニック。芝生、ピクニックシート、こいのぼり、シャボン玉。女の子はピンク系春服・ピンクワンピース・リボン。男の子は青系の鎧兜、若武者風、怖くしない、顔を隠さない。",
 6:"梅雨の夢池。カレンダー記入欄を除いた実質的な絵エリア基準で、ペットの高さを35〜45％程度にし、背景の幻想的な池・紫陽花庭園・雨の世界観をしっかり見せる遠景寄り構図。巨大なオオオニバス、睡蓮、水面反射、透明感のある浅い夢池、きらめく雨粒、虹色の水滴演出を描く。紫陽花は背景の左右・奥・橋の周辺にふんわり大量に咲かせ、梅雨の夢世界として華やかにする。体型はシルヴァニアファミリー風の丸く可愛いぬいぐるみ体型。レインコートの帽子は必ずしっかり深めに被る。レインコートは水色・薄紫・ピンク・白を混ぜた紫陽花カラーの夢かわ多色柄。透明素材、レース、花柄、雨粒反射を混ぜる。人間のように傘をさしかける表現は禁止。ふわふわの前足で、大きな睡蓮の葉っぱを自然な葉っぱ傘として片手で持つ。前足は必ず左右2本のみ。3本足・余分な腕・余分な指・人間腕化は禁止。犬らしい自然な骨格を維持し、無理な二足立ちは避ける。全体は『梅雨の妖精』『雨の宝石箱』『紫陽花の夢世界』のような透明感・発光感・幻想感のあるキラキラ空間。",
 7:"ひまわり畑。満開のひまわり、青空、入道雲、夏の風。女の子は黄色いワンピースと黄色いリボン付き麦わら帽子。男の子は麦わら帽子、黄色の帽子帯、首元に黄色いスカーフ。",
 8:"花火大会。多色の大きな花火、ピンク・青・紫・金・虹色系を混ぜた華やかな夜空。花火光でペットをほんのり照らし、暗すぎる夜景は禁止。提灯、金魚すくい、夏祭り小物を少し。男の子は紺色浴衣、女の子はピンク浴衣。",
 9:"秋の甘味と十五夜。栗、かぼちゃ、お芋、お月さま、ススキ、温かい秋色。男の子は落ち着いた秋色の羽織風和装、女の子は淡い秋色の着物風と秋色リボン。成人式の振袖みたいに派手にしない。",
 10:"ハロウィン。基本は紫・オレンジ・黒・金色の光。衣装はミイラ・魔女・パンプキンきぐるみ・吸血鬼・アリス。アリス選択時は水色と白、トランプ、ティーカップ、ティーポット、懐中時計、うさぎ、不思議の国のティーパーティーを基本にする。",
 11:"秋の紅葉。美しい紅葉のベンチで読書。日本風の多彩な紅葉、赤・深紅・橙・黄色・黄土色・茶色・緑・黄緑のグラデーション。単調な海外紅葉にしない。女の子は秋色フリル服、男の子は秋色ニット・ベスト・マフラー。",
 12:"クリスマス。赤いサンタ服で固定。女の子はスカートタイプの赤サンタ服、男の子は通常タイプの赤サンタ服。白いふわふわ高級フェイクファー、雪の結晶、赤い実の飾り、ツリー、プレゼント、大きなクマぬいぐるみ、暖炉、イルミ、雪。"
};

const infoStyles = opt([
  ["rare","希少動物図鑑風","希少動物図鑑のように、本格的な観察記録・分類・特徴欄を持つパネル。"],
  ["zoo","動物園紹介パネル風","動物園の展示紹介パネルのように、分かりやすく親しみやすい説明と見出しを入れる。"],
  ["fantasy","ファンタジー生物図鑑風","魔法世界の生物図鑑のように、少し幻想的で物語性のある紹介パネル。"],
  ["luxury","高級ペット雑誌風","高級ペット雑誌の表紙・特集ページのように、洗練された余白と上品なレイアウト。"],
  ["dreamy","夢かわパネル風","パステルカラー、リボン、星、花、ふわふわした夢かわ背景の紹介パネル。"],
  ["museum","アンティーク博物館ラベル風","古い博物館ラベルや標本紹介のように、アンティーク紙、飾り罫、クラシカルな文字枠を使う。"]
]);

const paper = opt([["sns","通常SNS比率","通常SNS向け。"],["a4","A4","A4印刷向け比率。"],["b5","JIS-B5","JIS-B5印刷向け比率。"],["postcard","はがき","はがきサイズ向け。"]]);
const direction = opt([["portrait","縦","縦向き。"],["landscape","横","横向き。"]]);
const week = ["日","月","火","水","木","金","土"];

function dateKey(y,m,d){ return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function nthMonday(y,m,n){
  let d = new Date(y, m - 1, 1);
  let add = (8 - d.getDay()) % 7;
  return 1 + add + (n - 1) * 7;
}
function springEquinox(y){
  return Math.floor(20.8431 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
}
function autumnEquinox(y){
  return Math.floor(23.2488 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
}
function addHoliday(map,y,m,d,name){ map[dateKey(y,m,d)] = name; }

function japaneseHolidays(y){
  const h = {};
  addHoliday(h,y,1,1,"元日");
  addHoliday(h,y,2,11,"建国記念の日");
  if(y >= 2020) addHoliday(h,y,2,23,"天皇誕生日");
  addHoliday(h,y,3,springEquinox(y),"春分の日");
  addHoliday(h,y,4,29,"昭和の日");
  addHoliday(h,y,5,3,"憲法記念日");
  addHoliday(h,y,5,4,"みどりの日");
  addHoliday(h,y,5,5,"こどもの日");
  addHoliday(h,y,8,11,"山の日");
  addHoliday(h,y,9,autumnEquinox(y),"秋分の日");
  addHoliday(h,y,11,3,"文化の日");
  addHoliday(h,y,11,23,"勤労感謝の日");

  if(y >= 2000) addHoliday(h,y,1,nthMonday(y,1,2),"成人の日");
  else addHoliday(h,y,1,15,"成人の日");

  if(y >= 2003) addHoliday(h,y,7,nthMonday(y,7,3),"海の日");
  else addHoliday(h,y,7,20,"海の日");

  if(y >= 2003) addHoliday(h,y,9,nthMonday(y,9,3),"敬老の日");
  else addHoliday(h,y,9,15,"敬老の日");

  if(y >= 2020) addHoliday(h,y,10,nthMonday(y,10,2),"スポーツの日");
  else if(y >= 2000) addHoliday(h,y,10,nthMonday(y,10,2),"体育の日");
  else addHoliday(h,y,10,10,"体育の日");

  // 東京オリンピック・パラリンピック特例
  if(y === 2020){
    delete h[dateKey(y,7,nthMonday(y,7,3))];
    delete h[dateKey(y,10,nthMonday(y,10,2))];
    delete h[dateKey(y,8,11)];
    addHoliday(h,y,7,23,"海の日");
    addHoliday(h,y,7,24,"スポーツの日");
    addHoliday(h,y,8,10,"山の日");
  }
  if(y === 2021){
    delete h[dateKey(y,7,nthMonday(y,7,3))];
    delete h[dateKey(y,10,nthMonday(y,10,2))];
    delete h[dateKey(y,8,11)];
    addHoliday(h,y,7,22,"海の日");
    addHoliday(h,y,7,23,"スポーツの日");
    addHoliday(h,y,8,8,"山の日");
  }

  // 振替休日
  const keys = Object.keys(h).sort();
  keys.forEach(k=>{
    const [yy,mm,dd] = k.split("-").map(Number);
    const dt = new Date(yy, mm - 1, dd);
    if(dt.getDay() === 0){
      let sub = new Date(yy, mm - 1, dd + 1);
      while(h[dateKey(sub.getFullYear(), sub.getMonth()+1, sub.getDate())]){
        sub = new Date(sub.getFullYear(), sub.getMonth(), sub.getDate()+1);
      }
      h[dateKey(sub.getFullYear(), sub.getMonth()+1, sub.getDate())] = "振替休日";
    }
  });

  // 国民の休日：祝日に挟まれた平日
  const allKeys = Object.keys(h).sort();
  for(let i=0;i<allKeys.length-1;i++){
    const [y1,m1,d1] = allKeys[i].split("-").map(Number);
    const [y2,m2,d2] = allKeys[i+1].split("-").map(Number);
    const a = new Date(y1,m1-1,d1), b = new Date(y2,m2-1,d2);
    const diff = (b-a)/(24*60*60*1000);
    if(diff === 2){
      const mid = new Date(y1,m1-1,d1+1);
      const key = dateKey(mid.getFullYear(), mid.getMonth()+1, mid.getDate());
      if(!h[key] && mid.getDay() !== 0) h[key] = "国民の休日";
    }
  }
  return h;
}

function daysText(y,m){
  const holidays = japaneseHolidays(y);
  const last = new Date(y,m,0).getDate();
  return Array.from({length:last},(_,i)=>{
    const d=i+1;
    const dt = new Date(y,m-1,d);
    const name = holidays[dateKey(y,m,d)];
    return `${d}(${week[dt.getDay()]})${name ? " " + name : ""}`;
  }).join(" / ");
}


function holidaysText(y,m){
  const holidays = japaneseHolidays(y);
  const items = [];
  const last = new Date(y,m,0).getDate();
  for(let d=1; d<=last; d++){
    const name = holidays[dateKey(y,m,d)];
    if(name){
      const w = week[new Date(y,m-1,d).getDay()];
      items.push(`${y}年${m}月${d}日（${w}）は「${name}」です。この日付は赤字、または赤い丸・赤い印で表示してください。祝日名「${name}」を日付の近くに小さく読みやすく入れてください。`);
    }
  }
  return items.length ? items.join("\n") : "この月に日本の祝日はありません。日曜は赤、土曜は青で表示してください。";
}

function Chip({active,disabled,onClick,children}){ return <button type="button" disabled={disabled} className={`chip ${active?"active":""}`} onClick={onClick}>{children}</button>; }
function Section({title,children}){ return <section className="card"><h2>{title}</h2>{children}</section>; }


function movieMood(id){
  const moods = {
    ship: "壮大でロマンチックな豪華客船映画ポスター風。夕焼け、海風、ドラマチックな光。",
    nanny: "明るい空、魔法感、クラシカルで可愛い乳母さん映画ポスター風。街並みは必要に応じてパステルカラー。",
    planet: "赤い終末SF映画ポスター風。壮大で神秘的、赤・黒・オレンジ系。怖すぎず、映画ポスターとして重厚に。",
    street: "レトロアメリカ下町ミュージカル映画ポスター風。躍動感、ダンス、レンガ街、シネマ照明。日本の商店街や絵本風にはしない。",
    cinderella: "青白い魔法の光に包まれたプリンセス映画ポスター風。階段、ドレス、ガラスの靴、かぼちゃ馬車を上品に。",
    ice_princess: "青白い氷世界のファンタジー映画ポスター風。氷の城、吹雪、透明な氷光、冷たい美しさ。暖色やピンクには寄せない。",
    magic: "夜の魔法学校ファンタジー映画ポスター風。青黒い夜、月明かり、魔法の光、城と列車。暗すぎず顔は見える。",
    pirate: "ワイルドで伝説的な海賊アドベンチャー映画ポスター風。夕焼け、嵐空、海賊船、煙、古い港町。",
    subway_wind: "1950年代アメリカ映画ポスター風。レトロなニューヨーク、地下鉄の風、クラシック映画照明。",
  };
  return moods[id] || "選んだ映画テンプレートに合う映画ポスター風の雰囲気で統一してください。";
}
function recommendedVibe(categoryId, templateId){
  const base = "清潔感・透明感・夢感を大切にし、背景を明るく理想化してください。";
  if(categoryId==="travel") return `${base}\n選んだ場所の魅力が一番伝わる観光ポスター風。現実そのままではなく、行きたくなる夢の旅行写真として整える。`;
  if(categoryId==="summer" && templateId==="underwater") return `${base}\n水中でも暗くせず、泡・珊瑚・光の筋・透明な海底ミニチュア感を入れた幻想的で可愛い雰囲気。`;
  if(categoryId==="summer") return `${base}\n夏らしく明るく、爽やかで透明感のあるリゾート感。`;
  if(categoryId==="animal") return `${base}\n相手動物と仲良しに見える、ぬいぐるみ絵本のような優しい雰囲気。`;
  if(categoryId==="vehicle") return `${base}\n乗り物が安全で可愛い夢のアトラクションに見える、楽しい冒険感。`;
  if(categoryId==="panel") return `${base}\n情報が読みやすく、飾りたくなる上品なパネル感。`;
  return `${base}\n選んだテーマに一番似合う可愛い雰囲気。`;
}

function recommendedLight(categoryId, templateId){
  if(categoryId==="movie") return "映画ポスターらしいドラマチックな光。ただしペットの顔は暗くせず、表情と毛並みが見えるようにしてください。";
  if(categoryId==="travel" && templateId==="mykonos") return "白壁に反射する明るい地中海の陽射し、サンゴ礁ブルーの海の反射、軽いレンズフレア。白飛びしすぎず清潔で発光感のある光。";
  if(categoryId==="travel") return "その場所が一番美しく見える明るい観光ポスター光。顔は柔らかく明るく、背景には奥行きが出る自然な陰影。";
  if(categoryId==="summer" && templateId==="underwater") return "水面から差し込む光の筋、泡のきらめき、珊瑚に反射する透明な光。水中でも暗く濁らせない。";
  if(categoryId==="summer" && templateId==="fireworks") return "花火の光で顔をほんのり明るく照らす。夜でも顔を暗くしすぎない。";
  if(categoryId==="animal") return "相手動物とペットの顔がどちらも可愛く見える、柔らかく明るい絵本のような光。";
  return "選んだ世界観に一番似合う明るく清潔な光。顔と毛並みがきれいに見えるようにしてください。";
}


function App(){
  const [modalImage,setModalImage]=useState(null);
  const [cat,setCat]=useState("travel");
  const [tpl,setTpl]=useState({travel:"mykonos",summer:"beach",vehicle:"sl",movie:"ship",animal:"friend",panel:"info"});
  const [rec,setRec]=useState(true), [copied,setCopied]=useState(false);
  const [customPlace,setCustomPlace]=useState(""), [customVehicle,setCustomVehicle]=useState("");
  const [cordoba,setCordoba]=useState("yuyu"), [gender,setGender]=useState("feminine"), [taste,setTaste]=useState("frill"), [outfit,setOutfit]=useState("auto"), [customOutfit,setCustomOutfit]=useState("");
  const [head,setHead]=useState("auto"), [customHead,setCustomHead]=useState("");
  const [shoe,setShoe]=useState("auto"), [customShoe,setCustomShoe]=useState("");
  const [acc,setAcc]=useState([]), [accMode,setAccMode]=useState("auto"), [customAcc,setCustomAcc]=useState("");
  const [color,setColor]=useState("auto"), [customColor,setCustomColor]=useState("");
  const [light,setLight]=useState("auto"), [ratio,setRatio]=useState("4:5"), [rh,setRh]=useState(""), [rw,setRw]=useState("");
  const [underId,setUnder]=useState("auto"), [customGimmick,setCustomGimmick]=useState(""), [summerAct,setSummerAct]=useState("none"), [fwPlace,setFwPlace]=useState("festival");
  const [vibe,setVibe]=useState(["clear","dream","clean"]), [title,setTitle]=useState("");
  const [animal,setAnimal]=useState("panda"), [animalColor,setAnimalColor]=useState(""), [customAnimal,setCustomAnimal]=useState("");
  const [infoStyle,setInfoStyle]=useState("rare");
  const [panel,setPanel]=useState({name:"",nick:"",birthday:"",age:"",sex:"",species:"",personality:"",likes:"",dislikes:"",walk:"",place:"",food:"",charm:"",skill:"",comment:""});
  const [year,setYear]=useState(new Date().getFullYear()), [month,setMonth]=useState(new Date().getMonth()+1), [paperId,setPaper]=useState("sns"), [dir,setDir]=useState("portrait"), [halloween,setHalloween]=useState("魔女");

  const category=by(cats,cat), template=by(category.tpl,tpl[cat]), Icon=category.icon;
  const isPanel=cat==="panel", isInfo=isPanel&&template.id==="info", isCalendar=isPanel&&template.id==="calendar";
  const currentUnder=by(under,underId), blocked=currentUnder.block||[];

  const outfitChoices = useMemo(()=>{
    if(cat==="animal") return animalWear;
    if(cat==="travel"&&template.id==="kyoto") return [...baseOutfits,...kyotoOutfits];
    if(cat==="travel"&&template.id==="mykonos") return [...baseOutfits,...mykonosOutfits];
    if(cat==="summer"&&template.id==="fireworks") return [...baseOutfits,...fireworksOutfits];
    if(cat==="summer"&&template.id==="underwater") return [...baseOutfits,...underwaterOutfits];
    if(cat==="summer") return [...baseOutfits,...mykonosOutfits];
    if(cat==="travel"&&["paris","london","alsace","petite","romantic","venice","mont","castle"].includes(template.id)) return [...baseOutfits, ...opt([["retro","レトロ旅行服","レトロ旅行服。"]])];
    if(cat==="vehicle") return [...baseOutfits, ...(vehicleWear[template.id]||[])];
    return baseOutfits;
  },[cat,template.id]);

  const headChoices = useMemo(()=>{
    let a=[...headBase];
    if(cat==="summer"||template.id==="mykonos") a=[...a,...headSummer];
    if(cat==="summer"&&template.id==="underwater") a=[...a,...headUnderwater];
    if(cat==="vehicle") a=[...a,...headVehicle];
    return a;
  },[cat,template.id]);

  const ratioPrompt = rh&&rw ? `縦${rh}：横${rw}の縦横比で作成してください。` : by(ratioOptions,ratio).prompt;
  const panelText = Object.entries(panel).filter(([,v])=>v.trim()).map(([k,v])=>({name:"名前",nick:"ニックネーム",birthday:"誕生日",age:"年齢",sex:"性別",species:"犬種・動物種",personality:"性格",likes:"好きなもの",dislikes:"苦手なもの",walk:"よく散歩に行く時間",place:"よくいる場所",food:"食べ物の好み",charm:"チャームポイント",skill:"特技",comment:"その他うちの子について"}[k]+`：${v}`)).join("\n");

  const prompt=useMemo(()=>{
    let p=[`【最優先：ペット本人の保持】\n${idRule}`,`【共通：夢化・理想化】\n${dream}`];
    if(cat==="travel") p.push(`【旅行カテゴリ：夢の観光ポスター構図】\n${travelRule}`);
    if(cat==="movie") p.push(`【映画ポスター風の特殊ルール】\n${movieRule}\n映画カテゴリでは共通の雰囲気選択は使わず、選んだ映画テンプレート固有の雰囲気・色・構図を最優先してください。`);
    if(cat==="animal") p.push(`【動物さんの表現】\n${animalRule}`);
    let world = isPanel ? "ペットを主役にした、選択したタイプのうちの子パネル。選択したパネルタイプの雰囲気を最優先してください。" : template.prompt;
    if(template.customPlace&&customPlace) world+=`\n場所：${customPlace}\n※場所名のみ採用し、ポーズ・服・ギミック指定は無視。`;
    if(template.colors) world+=`\n色合い：${by(cordobaColors,cordoba).prompt}`;
    if(template.customVehicle&&customVehicle) world+=`\n乗り物：${customVehicle}`;
    if(template.fireworks) world+=`\n花火を見る場所：${by(fireworksPlaces,fwPlace).prompt}`;
    p.push(`【世界観・背景】\n${world}${cat==="travel" ? `\n\n【世界旅行系 共通演出】
実在の観光地をそのまま再現するのではなく、「夢の中で見た理想の観光ポスター」のように、美しく理想化してください。
旅行雑誌の表紙、高級リゾート広告、夢かわいい観光ポスター、ファンタジー旅行パンフレットのような世界観。
現実感よりも、「ここに行ってみたい」と思わせる憧れ感、透明感、強い陽射し、きらめき、幸福感を優先してください。
空気は澄み、空は鮮やかで、光はきらきら反射し、海・街・花・建物すべてが少し幻想的に美しく見えるようにしてください。
生活感、汚れ、古びた質感、雑多な観光客、曇り空、くすみ色、寂しい雰囲気は避けてください。
ペットは「その世界を旅する主人公」のように、観光ポスターの中心で魅力的に見せてください。\n世界旅行では背景の観光地も主役級に見せてください。ペットを大きくしすぎず、旅行写真・観光ポスターとして街並み・海・建物・空・奥行きが十分に見える構図にしてください。縦長画像では、ペットの高さは画像全体の35〜45％程度を目安にしてください。カメラは少し引き気味にし、ペットだけのアップ写真にしないでください。階段・道・水面・街並み・建物・空などの奥行きが広く見える構図にしてください。背景の情報量をしっかり残し、観光地の空気感も主役級にしてください。ただし豆粒のように小さくしすぎず、顔と服はちゃんと見えるサイズにしてください。横長画像でもペットが画面を占領しないようにし、顔は見えるけれど背景の名所が広く見えるバランスにしてください。ペットの旅行ポートレートではなく、ペットが旅する夢の観光ポスターとして作成してください。` : ""}`);

    if(cat==="movie"){
      p.push("【衣装・体型】\n服・帽子・髪飾り・ハーネス・リードなど、元写真に写っている装備は参考にしないでください。服指定あり、またはおまかせ服の場合は、元写真の服や小物を引き継がず、今回選んだ衣装・帽子・髪飾り・アクセサリーだけで新しく整えてください。ただし、ペット本人の顔・毛色・模様・耳・毛並みは保持してください。\n\n衣装、体型、ポーズ、構図はテンプレート固定。顔、耳、毛色、模様、手の毛色だけ本人化してください。");
      if(title) p.push(`【架空タイトル】\n${title}`);
    } else if(!isPanel){
      const selectedOutfit = by(outfitChoices,outfit);
      const wear = customOutfit
        || (selectedOutfit.id==="auto"
          ? `${by(genderOptions,gender).prompt}\n${by(tasteOptions,taste).prompt}\n選んだ世界観に最も似合う服として、上記の方針で可愛く自動調整してください。`
          : `${by(genderOptions,gender).prompt}\n${selectedOutfit.prompt}`);
      p.push(`【服】\n${wear}`);
      if(cat==="animal" && ((selectedOutfit.kigurumi && !customOutfit) || customOutfit.includes("きぐるみ"))) p.push(`【きぐるみ専用補正】\n${kigurumiRule}`);
      p.push(`【頭装備】\n${customHead||by(headChoices,head).prompt}`);
      p.push(`【靴】\n${customShoe||by(shoes,shoe).prompt}`);
      const ac = customAcc || (accMode==="auto" ? by(accessories,"auto").prompt : accMode==="keep" ? "" : acc.map(id=>by(accessories,id).prompt).filter(Boolean).join("\n"));
      if(ac) p.push(`【アクセサリー】\n${ac}`);
      if(cat==="summer" && template.id==="fireworks" && outfit.startsWith("yukata")) p.push("【服セットの色合い】\n浴衣で選んだ色を最優先してください。追加の服色指定で浴衣の色を上書きしないでください。");
      else p.push(`【服セットの色合い】\n${customColor||by(colors,color).prompt}`);
    }

    if(cat==="summer"){
      if(template.id==="underwater") p.push("【水中世界の禁止事項】\n水中世界では、スイカ割り、スイカを食べる、ソーダアイス、水上スキー、浮き輪を出さないでください。水中に合わない地上・水上遊びを混ぜず、夢かわいい海底世界として作成してください。");
      if(customGimmick) p.push(`【水中・海ギミック】\n${customGimmick}\n自由記入ギミックを優先し、夏の小物・動きは混ぜないでください。`);
      else {
        if(currentUnder.prompt) p.push(`【水中・海ギミック】\n${currentUnder.prompt}`);
        if(template.id!=="underwater" && by(summerActs,summerAct).prompt) p.push(`【夏の小物・動き】\n${by(summerActs,summerAct).prompt}`);
      }
    }

    if(cat==="animal"){
      const a=customAnimal||`${animalColor?animalColor+"の":""}${by(animals,animal).label}`;
      p.push(`【一緒にいる動物】\n${a}と一緒。選んだ動物に最も似合う夢背景を自動生成。ただの森・草原・単色背景は禁止。`);
    }

    if(isInfo) p.push(`【うちの子インフォグラフィック】\nタイプ：${by(infoStyles,infoStyle).label}\n${by(infoStyles,infoStyle).prompt}\n\n${panelText||"入力された情報をもとに作成してください。"}\n学名風の名前はAIがその子らしく可愛く自動生成。空欄項目は無視。選んだタイプに合わせて、自然に言い換えてください。`);
    if(isCalendar) {
      p.push(`【うちの子カレンダー】\n${year}年${month}月のカレンダー。\n月別テーマ：${monthThemes[Number(month)]||"季節感のある可愛いカレンダー。"}\nカレンダー表：${daysText(Number(year),Number(month))}\n\n【カレンダー祝日】\n${holidaysText(Number(year),Number(month))}\n\nカレンダーは日曜開始で、曜日並びは「日・月・火・水・木・金・土」にしてください。カレンダー表は必ず通常の月間カレンダー形式にしてください。日曜始まり、日・月・火・水・木・金・土の7列、週ごとの横並びグリッドで配置してください。日付を縦一列や二列リストにしないでください。曜日ごとの列を崩さず、1週間単位で横に並べてください。曜日・日付・祝日名を創作しないでください。カレンダー表とカレンダー祝日の内容を必ず守ってください。日曜と祝日は赤、土曜は青で表示してください。\nサイズ：${by(paper,paperId).label}、${by(direction,dir).label}向き。`);
      if(Number(month)===6) p.push(`【6月カレンダー事故防止】\nカレンダー記入欄を除いた絵エリア基準でペットの高さは35〜45％程度。人間のような傘をさしかける構図は禁止。睡蓮の葉っぱ傘、深めのレインコート帽子、紫陽花の夢世界、雨粒のきらめきを優先してください。前足は左右2本のみで、余分な手足を追加しないでください。`);
      if(Number(month)===10) p.push(`【ハロウィン衣装】\n服の基本方針：${by(genderOptions,gender).label}\n衣装：${halloween}`);
      if([1,2,5,8,12].includes(Number(month))) p.push(`【服の基本方針による衣装・配色】\n服の基本方針：${by(genderOptions,gender).label}`);
    }

    if(cat==="movie") {
      p.push(`【映画ポスター専用の雰囲気】\n${movieMood(template.id)}\n${darkFix}`);
    } else {
      p.push(`【おすすめの雰囲気】\n${recommendedVibe(cat,template.id)}\n${darkFix}`);
    }
    p.push(`【おすすめの光・明るさ】\n${recommendedLight(cat,template.id)}`);
    if(!(isCalendar && paperId!=="sns")) p.push(`【縦横比】\n${ratioPrompt}`);
    p.push("【仕上げ】\n高品質、可愛いペットポートレート、清潔感、透明感、理想化された夢の世界。");
    return p.join("\n\n");
  },[cat,template,customPlace,customVehicle,cordoba,fwPlace,title,gender,taste,outfit,outfitChoices,customOutfit,head,customHead,shoe,customShoe,acc,accMode,customAcc,color,customColor,customGimmick,currentUnder,summerAct,animal,animalColor,customAnimal,isInfo,isCalendar,infoStyle,panelText,year,month,paperId,dir,halloween,vibe,light,ratioPrompt,headChoices]);

  const copy=async()=>{await navigator.clipboard.writeText(prompt);setCopied(true);setTimeout(()=>setCopied(false),1200)};
  const toggle=(arr,setter,id)=>setter(arr.includes(id)?arr.filter(x=>x!==id):[...arr,id]);

  return <main className="page"><div className="blob blob-pink"/><div className="blob blob-violet"/><div className="blob blob-blue"/><div className="dots"/>
    <div className="container">
      <header className="hero"><div className="badge"><Sparkles size={18}/>Yuyu Mama Dream Prompt Studio</div><h1>ゆゆママの夢プロンプト工房（汎用版）</h1><p className="subtitle">うちの子を主役に、世界旅行・夏の海・乗り物・映画ポスター・うちの子パネルを作る工房です。</p><p className="selected">更新日時：{UPDATED_AT}</p><div className="hero-image"><img src={HERO} alt="top"/></div><a className="sister-link" href={SISTER} target="_blank" rel="noreferrer"><LinkIcon size={16}/>姉妹サイト：ゆゆ姫の夢かわプロンプト工房はこちら</a></header>
      {rec&&<section className="card recommend-card"><div className="card-head"><h2>ゆゆママのお勧め</h2><button className="outline-button" onClick={()=>setRec(false)}><X size={16}/>閉じる</button></div><div className="recommend-grid">{[{t:"夢のミコノス島フォト",img:"/mykonos.png",c:"travel",p:"mykonos",d:"白と青とターコイズの夢リゾート。"},{t:"豪華客船ロマンス風",img:"/titanic.png",c:"movie",p:"ship",d:"顔と毛色だけ本人化する映画ポスター風。"}].map(r=><article className="recommend-item" key={r.t}><img src={r.img} alt={r.t} style={{ cursor:"pointer" }} onClick={() => setModalImage(r.img)}/><div><strong>{r.t}</strong><small>{r.d}</small><button className="main-button mini" onClick={()=>{setCat(r.c);setTpl({...tpl,[r.c]:r.p})}}>このおすすめを使う</button></div></article>)}</div></section>}
      <div className="grid"><section className="left">
        <div className="notice"><strong>この工房の方針</strong><span>清潔感・透明感・夢感を大切にした「うちの子の理想世界」を作ります。</span><button type="button" className="outline-button mini" onClick={()=>{if(window.confirm("すべてリセットしますか？")) window.location.reload();}}>全部リセット</button></div>
        <Section title={<><Sparkles size={19}/>ジャンルを選択</>}><div className="choice-grid">{cats.map(c=>{const I=c.icon;return <button key={c.id} className={`big-choice ${cat===c.id?"active-soft":""}`} onClick={()=>{setCat(c.id);setTpl({...tpl,[c.id]:c.tpl[0].id}); if(c.id==="animal"){setHead("auto");setShoe("auto");setAcc([]);setAccMode("auto");}}}><strong><I size={18}/>{c.label}</strong><span>{c.desc}</span></button>})}</div></Section>
        <Section title={<><Icon size={19}/>テンプレを選択</>}><div className="chips">{category.tpl.map(t=><Chip key={t.id} active={template.id===t.id} onClick={()=>setTpl({...tpl,[cat]:t.id})}>{t.label}</Chip>)}</div>{template.customPlace&&<><p className="selected">※場所のみ記入。ギミック・ポーズ・服装指定は無視されます。</p><input value={customPlace} onChange={e=>setCustomPlace(e.target.value)} placeholder="例：フィレンツェ、モロッコの青い街"/></>}{template.customVehicle&&<><label>乗り物自由記入</label><input value={customVehicle} onChange={e=>setCustomVehicle(e.target.value)} placeholder="例：かぼちゃの馬車"/></>}{template.colors&&<><label>パティオの色合い</label><div className="chips">{cordobaColors.map(x=><Chip key={x.id} active={cordoba===x.id} onClick={()=>setCordoba(x.id)}>{x.label}</Chip>)}</div></>}{template.fireworks&&<><label>花火を見る場所</label><div className="chips">{fireworksPlaces.map(x=><Chip key={x.id} active={fwPlace===x.id} onClick={()=>setFwPlace(x.id)}>{x.label}</Chip>)}</div></>}</Section>

        {cat!=="movie"&&!isPanel&&<Section title="服"><p className="selected">服指定あり・おまかせの場合は、元写真の服・帽子・髪飾り・ハーネスなどを引き継がず、今回選んだ衣装だけで作ります。</p>
          <div className="subhead"><label>服の基本方針</label><button type="button" className="outline-button mini" onClick={()=>setGender("feminine")}>リセット</button></div><div className="chips">{genderOptions.map(g=><Chip key={g.id} active={gender===g.id} onClick={()=>setGender(g.id)}>{g.label}</Chip>)}</div>
          <div className="subhead"><label>服</label><button type="button" className="outline-button mini" onClick={()=>{setCustomOutfit("");setOutfit("auto");setTaste("frill")}}>リセット</button></div>
          <div className="chips">{outfitChoices.map(o=>o.id==="auto"&&cat!=="animal"
            ? <div key={o.id} className={`chip outfit-auto-chip ${!customOutfit&&outfit==="auto"?"active":""}`} onClick={()=>{setCustomOutfit("");setOutfit("auto")}}>
                <span className="auto-chip-main">おまかせ</span>
                <span className="auto-chip-tastes">（{tasteOptions.map(t=><label className="radio-inline" key={t.id} onClick={e=>e.stopPropagation()}><input type="radio" name="taste" checked={taste===t.id} disabled={!!customOutfit||outfit!=="auto"} onChange={()=>{setOutfit("auto");setTaste(t.id)}}/>{t.label}</label>)}）</span>
              </div>
            : <Chip key={o.id} disabled={!!customOutfit} active={!customOutfit&&outfit===o.id} onClick={()=>setOutfit(o.id)}>{o.label}</Chip>)}</div>
          <label>服の自由記入</label><input value={customOutfit} onChange={e=>setCustomOutfit(e.target.value)} placeholder="例：水色チェックのフリルワンピース"/>
          <>
            <div className="subhead"><h2>頭装備</h2><button type="button" className="outline-button mini" onClick={()=>{setCustomHead("");setHead("auto")}}>リセット</button></div><div className="chips">{headChoices.map(h=><Chip key={h.id} disabled={!!customHead} active={head===h.id} onClick={()=>setHead(h.id)}>{h.label}</Chip>)}</div><input value={customHead} onChange={e=>setCustomHead(e.target.value)} placeholder="頭装備の自由記入"/>
            <div className="subhead"><h2>靴</h2><button type="button" className="outline-button mini" onClick={()=>{setCustomShoe("");setShoe("auto")}}>リセット</button></div><div className="chips">{shoes.map(s=><Chip key={s.id} disabled={!!customShoe} active={shoe===s.id} onClick={()=>setShoe(s.id)}>{s.label}</Chip>)}</div><input value={customShoe} onChange={e=>setCustomShoe(e.target.value)} placeholder="靴の自由記入"/>
            <div className="subhead"><h2>アクセサリー</h2><button type="button" className="outline-button mini" onClick={()=>{setAcc([]);setAccMode("auto");setCustomAcc("")}}>リセット</button></div><div className="chips">{accessories.map(a=>a.id==="auto"||a.id==="keep" ? <Chip key={a.id} active={accMode===a.id&&!customAcc} onClick={()=>{setAcc([]);setAccMode(a.id);setCustomAcc("")}}>{a.label}</Chip> : <Chip key={a.id} active={accMode==="select"&&acc.includes(a.id)} onClick={()=>{setAccMode("select");toggle(acc,setAcc,a.id)}}>{a.label}</Chip>)}</div><input value={customAcc} onChange={e=>{setCustomAcc(e.target.value); if(e.target.value) setAccMode("select")}} placeholder="アクセサリー自由記入"/>
            {!(cat==="summer"&&template.id==="fireworks"&&outfit.startsWith("yukata"))&&<><div className="subhead"><h2>服セットの色合い</h2><button type="button" className="outline-button mini" onClick={()=>{setCustomColor("");setColor("auto")}}>リセット</button></div><div className="chips">{colors.map(c=><Chip key={c.id} disabled={!!customColor} active={color===c.id} onClick={()=>setColor(c.id)}>{c.label}</Chip>)}</div><input value={customColor} onChange={e=>setCustomColor(e.target.value)} placeholder="色合い自由記入"/></>}
          </></Section>}
        {cat==="movie"&&<Section title={<><Film size={19}/>架空タイトル</>}><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="例：白雪ゆゆ姫"/></Section>}
        {cat==="summer"&&<Section title={<><Waves size={19}/>夏・水中ギミック</>}><button type="button" className="outline-button mini" onClick={()=>{setCustomGimmick("");setUnder("auto");setSummerAct("none")}}>リセット</button><label>水中・海ギミック</label><div className="chips">{under.map(u=><Chip key={u.id} disabled={!!customGimmick} active={underId===u.id} onClick={()=>{setUnder(u.id);if((u.block||[]).includes(summerAct))setSummerAct("none")}}>{u.label}</Chip>)}</div><label>夏の小物・動き</label><div className="chips">{(template.id==="underwater"?summerActs.filter(s=>s.id==="none"):summerActs).map(s=><Chip key={s.id} disabled={!!customGimmick||blocked.includes(s.id)} active={summerAct===s.id} onClick={()=>setSummerAct(s.id)}>{s.label}</Chip>)}</div><label>ギミック自由記入</label><input value={customGimmick} onChange={e=>setCustomGimmick(e.target.value)} placeholder="例：大きな貝殻のソファ"/></Section>}
        {cat==="animal"&&<Section title={<><PawPrint size={19}/>動物を選択（五十音順）</>}><div className="animal-list">{animals.map(a=><div className="animal-row" key={a.id}><button className={`animal-name ${animal===a.id?"active":""}`} onClick={()=>{setAnimal(a.id);setAnimalColor(a.colors?.[0]||"")}}>{a.label}</button>{a.colors&&<span>{a.colors.map(c=><label className="radio-inline" key={c}><input type="radio" checked={animal===a.id&&animalColor===c} onChange={()=>{setAnimal(a.id);setAnimalColor(c)}}/>{c}</label>)}</span>}</div>)}</div><input value={customAnimal} onChange={e=>setCustomAnimal(e.target.value)} placeholder="自由記入：白いフェネックなど"/></Section>}
        {isInfo&&<Section title="プロフィール情報"><p className="selected">学名風はAIが自動生成。空欄は無効。</p><label>パネルタイプ</label><div className="chips">{infoStyles.map(s=><Chip key={s.id} active={infoStyle===s.id} onClick={()=>setInfoStyle(s.id)}>{s.label}</Chip>)}</div><div className="form-grid">{Object.entries({name:"名前",nick:"ニックネーム",birthday:"誕生日",age:"年齢",sex:"性別",species:"犬種・動物種",personality:"性格",likes:"好きなもの",dislikes:"苦手なもの",walk:"よく散歩に行く時間",place:"よくいる場所",food:"食べ物の好み",charm:"チャームポイント",skill:"特技",comment:"その他うちの子について"}).map(([k,l])=><label key={k}>{l}<input value={panel[k]} onChange={e=>setPanel({...panel,[k]:e.target.value})}/></label>)}</div></Section>}
        {isCalendar&&<Section title="カレンダー設定"><div className="form-grid"><label>年<input type="number" value={year} onChange={e=>setYear(e.target.value)}/></label><label>月<input type="number" min="1" max="12" value={month} onChange={e=>setMonth(e.target.value)}/></label></div><label>服の基本方針</label><div className="chips">{genderOptions.map(g=><Chip key={g.id} active={gender===g.id} onClick={()=>setGender(g.id)}>{g.label}</Chip>)}</div><label>サイズ</label><div className="chips">{paper.map(p=><Chip key={p.id} active={paperId===p.id} onClick={()=>setPaper(p.id)}>{p.label}</Chip>)}</div><label>向き</label><div className="chips">{direction.map(d=><Chip key={d.id} active={dir===d.id} onClick={()=>setDir(d.id)}>{d.label}</Chip>)}</div>{Number(month)===10&&<><label>ハロウィン衣装</label><div className="chips">{["ミイラ","魔女","パンプキンきぐるみ","吸血鬼","アリス"].map(x=><Chip key={x} active={halloween===x} onClick={()=>setHalloween(x)}>{x}</Chip>)}</div></>}</Section>}
        {!(isCalendar && paperId!=="sns")&&<Section title={`縦横比`}><button type="button" className="outline-button mini" onClick={()=>{setRh("");setRw("");setRatio("4:5")}}>リセット</button><div className="chips">{ratioOptions.map(r=><Chip key={r.id} disabled={!!rh||!!rw} active={ratio===r.id} onClick={()=>setRatio(r.id)}>{r.label}</Chip>)}</div><div className="ratio-inputs"><label>縦<input value={rh} onChange={e=>setRh(e.target.value)} placeholder="9"/></label><span>：</span><label>横<input value={rw} onChange={e=>setRw(e.target.value)} placeholder="16"/></label></div></Section>}
      </section><aside className="right"><section className="card result-card"><div className="card-head"><h2><ImageIcon size={19}/>生成プロンプト</h2><button className="main-button" onClick={copy}>{copied?<CheckCircle2 size={16}/>:<Copy size={16}/>} {copied?"コピー済み":"コピー"}</button></div><div className="message warn"><AlertCircle size={16}/>画像生成時は、このプロンプトと一緒にペット写真をアップロードしてください。</div><textarea value={prompt} readOnly/><div className="instagram-follow-card">
          <div className="instagram-title">Instagramも見てね</div>
          <a href="https://www.instagram.com/momomimiyuyu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram momomimiyuyu を開く">
            <img src="/instagram_momomimiyuyu.png" alt="Instagram QRコード" />
          </a>
        </div></section></aside></div>
    </div>
  
{modalImage && (
  <div
    onClick={() => setModalImage(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}
  >
    <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "92vw", maxHeight: "92vh" }}>
      <button
        type="button"
        onClick={() => setModalImage(null)}
        style={{
          position: "absolute",
          top: "-12px",
          right: "-12px",
          border: 0,
          borderRadius: "999px",
          background: "white",
          color: "#7c3aed",
          padding: "8px 12px",
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
        }}
      >
        閉じる
      </button>
      <img
        src={modalImage}
        alt="おすすめ画像"
        style={{
          display: "block",
          maxWidth: "92vw",
          maxHeight: "92vh",
          borderRadius: "24px",
          boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
          background: "white"
        }}
      />
    </div>
  </div>
)}
</main>;
}

export default App;
