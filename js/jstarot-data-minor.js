/* ==========================================================================
   天下第一塔羅牌 - 56張小阿爾克那完整資料庫 (js/tarot-data-minor.js)
   支援圖片檔名「w_1.webp」~「p_14.webp」無腦替換！
   ========================================================================== */

const TAROT_SUITS_CONFIG = [
  { prefix: "w", nameEn: "Wands", nameZh: "權杖", icon: "🪄", element: "火元素 (Action & Passion)" },
  { prefix: "c", nameEn: "Cups", nameZh: "聖盃", icon: "🍷", element: "水元素 (Emotion & Intuition)" },
  { prefix: "s", nameEn: "Swords", nameZh: "寶劍", icon: "🗡️", element: "風元素 (Intellect & Conflict)" },
  { prefix: "p", nameEn: "Pentacles", nameZh: "星幣", icon: "🪙", element: "土元素 (Wealth & Material)" }
];

const TAROT_RANKS_CONFIG = [
  { index: 1, num: "Ace", zh: "一", up: ["新起源", "潛能爆發", "靈感點燃"], rev: ["起步受阻", "能量耗盡", "時機未到"] },
  { index: 2, num: "2", zh: "二", up: ["規劃未來", "抉擇", "合作共識"], rev: ["猶豫不決", "失衡", "溝通脫節"] },
  { index: 3, num: "3", zh: "三", up: ["成果初顯", "團隊合作", "拓展遠景"], rev: ["進度延誤", "內部矛盾", "孤立無援"] },
  { index: 4, num: "4", zh: "四", up: ["穩定安居", "鞏固基礎", "慶祝安康"], rev: ["不穩定", "不安現狀", "過度保守"] },
  { index: 5, num: "5", zh: "五", up: ["競爭挑戰", "利益衝突", "混亂考驗"], rev: ["化解爭端", "達成和解", "避開鋒芒"] },
  { index: 6, num: "6", zh: "六", up: ["勝利榮耀", "獲得認可", "順利推進"], rev: ["短暫挫折", "缺乏肯定", "虛榮驕傲"] },
  { index: 7, num: "7", zh: "七", up: ["堅守陣地", "捍衛立場", "不屈毅力"], rev: ["力不從心", "放棄抵抗", "壓力過重"] },
  { index: 8, num: "8", zh: "八", up: ["快速推進", "訊息傳遞", "果斷行動"], rev: ["訊息誤導", "阻礙延誤", "急躁衝動"] },
  { index: 9, num: "9", zh: "九", up: ["堅持到底", "最後防線", "累積實力"], rev: ["筋疲力盡", "過度防備", "頑固抗拒"] },
  { index: 10, num: "10", zh: "十", up: ["責任重擔", "極限考驗", "階段終點"], rev: ["卸下重負", "學會分擔", "崩潰瓦解"] },
  { index: 11, num: "Page", zh: "侍者", up: ["好奇學習", "新鮮訊息", "熱情探索"], rev: ["不成熟", "假消息", "缺乏定性"] },
  { index: 12, num: "Knight", zh: "騎士", up: ["勇往直前", "無畏衝刺", "行動派"], rev: ["魯莽衝動", "缺乏耐性", "後勁不足"] },
  { index: 13, num: "Queen", zh: "王后", up: ["自信魅力", "溫暖滋養", "獨立智慧"], rev: ["情緒化", "嫉妒控制", "內心匱乏"] },
  { index: 14, num: "King", zh: "國王", up: ["成熟領導", "掌控大局", "權威專業"], rev: ["專制獨裁", "嚴苛冷酷", "濫用權力"] }
];

const TAROT_MINOR_DB = (function () {
  const db = [];

  TAROT_SUITS_CONFIG.forEach((suit) => {
    TAROT_RANKS_CONFIG.forEach((rank) => {
      const isZhName = `${suit.nameZh}${rank.zh}`;
      const isEnName = `${rank.num} of ${suit.nameEn}`;
      const imgPath = `assets/images/cards/${suit.prefix}_${rank.index}.webp`;

      db.push({
        id: `${suit.nameEn.toLowerCase()}_${rank.num.toLowerCase()}`,
        nameEn: isEnName,
        nameZh: isZhName,
        suit: suit.nameEn,
        element: suit.element,
        icon: suit.icon,
        image: imgPath,
        uprightKeywords: rank.up,
        reversedKeywords: rank.rev,
        uprightEn: `The ${isEnName} channels active ${suit.element} in the ${rank.zh} stage, emphasizing ${rank.up.join(", ")}.`,
        uprightZh: `【${isZhName}】正位：展現出${suit.element}的順暢能量，關鍵聚焦於：${rank.up.join("、")}。`,
        reversedEn: `Reversed ${isEnName} cautions friction or blockages in ${suit.element} areas: ${rank.rev.join(", ")}.`,
        reversedZh: `【${isZhName}】逆位：提醒留意${suit.element}領域的能量停滯或考驗：${rank.rev.join("、")}。`
      });
    });
  });

  return db;
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = TAROT_MINOR_DB;
}