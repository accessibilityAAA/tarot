/* ==========================================================================
   Astraea AI Tarot - 78 張偉特塔羅牌完整資料庫 (js/tarot-data.js)
   內建 78 張全牌義 + 自動宇宙牌背 SVG + 支援檔名「00.webp」~「21.webp」無腦替換
   ========================================================================== */

// 1. 生成精美歐美宇宙星盤 SVG 牌背 (解決圖檔遺漏導致卡牌空白的根本問題)
function getCosmicDeckBackSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160" width="100%" height="100%">
      <rect width="100%" height="100%" fill="url(#bgGrad)" stroke="#f59e0b" stroke-width="3"/>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b0764"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="148" fill="none" stroke="#c084fc" stroke-width="1" stroke-dasharray="3,2" opacity="0.8"/>
      <circle cx="50" cy="80" r="28" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.85"/>
      <circle cx="50" cy="80" r="20" fill="none" stroke="#c084fc" stroke-width="1"/>
      <path d="M50 56 L50 104 M26 80 L74 80 M33 63 L67 97 M33 97 L67 63" stroke="#f59e0b" stroke-width="1" opacity="0.75"/>
      <polygon points="50,72 53,78 60,80 53,82 50,88 47,82 40,80 47,78" fill="#fef08a"/>
    </svg>
  `;
}

// 2. 78 張卡牌資料庫
const TAROT_CARDS_DB = (function () {
  const db = [];

  // 大阿爾克那 Major Arcana (22張)
  const majorList = [
    { num: "00", en: "The Fool", zh: "愚者", icon: "🃏", up: "新開始、無畏冒險、純真信賴", rev: "輕率冒失、盲目衝動、逃避責任" },
    { num: "01", en: "The Magician", zh: "魔術師", icon: "🪄", up: "創造力、資源整合、顯化能力", rev: "投機取巧、操弄人心、意志薄弱" },
    { num: "02", en: "The High Priestess", zh: "女祭司", icon: "🌙", up: "直覺敏銳、內在智慧、靜心觀察", rev: "忽視直覺、情緒壓抑、表面浮躁" },
    { num: "03", en: "The Empress", zh: "皇后", icon: "👑", up: "豐盛富足、母性滋養、愛與和諧", rev: "過度依賴、創造力阻塞、過度控制" },
    { num: "04", en: "The Emperor", zh: "皇帝", icon: "🏛️", up: "權威領導、嚴謹秩序、穩固架構", rev: "專制獨裁、剛愎自用、規則混亂" },
    { num: "05", en: "The Hierophant", zh: "教皇", icon: "🔔", up: "精神指引、傳統價值、良師益友", rev: "打破陳腐、盲從教條、叛逆創新" },
    { num: "06", en: "The Lovers", zh: "戀人", icon: "💕", up: "靈魂契合、真摯情感、重大選擇", rev: "價值觀衝突、溝通失衡、猶豫不決" },
    { num: "07", en: "The Chariot", zh: "戰車", icon: "🛡️", up: "堅強意志、克服困難、快速推進", rev: "方向失控、情緒衝動、挫折受阻" },
    { num: "08", en: "Strength", zh: "力量", icon: "🦁", up: "柔能克剛、內在勇氣、包容耐心", rev: "自我懷疑、軟弱無力、暴躁失控" },
    { num: "09", en: "The Hermit", zh: "隱士", icon: "🕯️", up: "沉思內省、獨處尋道、燈塔指引", rev: "孤立排外、偏執自私、逃避人群" },
    { num: "10", en: "Wheel of Fortune", zh: "命運之輪", icon: "🎡", up: "命運轉折、幸運契機、順應時勢", rev: "抗拒改變、低潮阻礙、重複錯誤" },
    { num: "11", en: "Justice", zh: "正義", icon: "⚖️", up: "公平公正、客觀理性、因果報應", rev: "不公不義、偏見袒護、逃避責任" },
    { num: "12", en: "The Hanged Man", zh: "倒吊人", icon: "🙃", up: "主動臣服、換位思考、暫停沉澱", rev: "無謂犧牲、拖延逃避、原地踏步" },
    { num: "13", en: "Death", zh: "死神", icon: "🥀", up: "舊事結束、徹底蛻變、全新重生", rev: "恐懼改變、死守舊物、痛苦沉淪" },
    { num: "14", en: "Temperance", zh: "節制", icon: "🕊️", up: "中庸之道、和諧調和、平衡節奏", rev: "極端過度、失去平衡、消耗無度" },
    { num: "15", en: "The Devil", zh: "惡魔", icon: "🔥", up: "物質執著、慾望枷鎖、盲目沉迷", rev: "掙脫枷鎖、意識覺醒、重獲自由" },
    { num: "16", en: "The Tower", zh: "高塔", icon: "⚡", up: "突發衝擊、幻滅崩解、徹底覺醒", rev: "災難延後、掩耳盜鈴、恐懼瓦解" },
    { num: "17", en: "The Star", zh: "星星", icon: "⭐", up: "希望曙光、靈魂療癒、靈感泉湧", rev: "失去信心、絕望沮喪、悲觀自憐" },
    { num: "18", en: "The Moon", zh: "月亮", icon: "🌕", up: "潛意識不安、迷霧幻象、直覺考驗", rev: "撥雲見日、克服恐懼、真相大白" },
    { num: "19", en: "The Sun", zh: "太陽", icon: "☀️", up: "成功光明、喜悅活力、自信熱情", rev: "暫時陰霾、延遲成功、缺乏熱情" },
    { num: "20", en: "Judgement", zh: "審判", icon: "🎺", up: "靈魂召喚、深刻覺醒、重生昇華", rev: "自我批判、猶豫延誤、悔恨糾結" },
    { num: "21", en: "The World", zh: "世界", icon: "🌍", up: "大圓滿、完美結束、成就統合", rev: "未竟之業、臨門一腳、缺乏閉環" }
  ];

  majorList.forEach((item) => {
    db.push({
      id: `major_${parseInt(item.num, 10)}`,
      number: item.num,
      nameEn: item.en,
      nameZh: item.zh,
      icon: item.icon,
      image: `assets/images/cards/${item.num}.webp`, // 支援將圖片命名為 00.webp ~ 21.webp 無腦替換
      uprightEn: `${item.en} brings energy of: ${item.up}.`,
      uprightZh: `【${item.zh}】正位：${item.up}。`,
      reversedEn: `Reversed ${item.en} cautions: ${item.rev}.`,
      reversedZh: `【${item.zh}】逆位：${item.rev}。`
    });
  });

  // 小阿爾克那 Minor Arcana (56張)
  const suits = [
    { prefix: "w", en: "Wands", zh: "權杖", icon: "🪄" },
    { prefix: "c", en: "Cups", zh: "聖盃", icon: "🍷" },
    { prefix: "s", en: "Swords", zh: "寶劍", icon: "🗡️" },
    { prefix: "p", en: "Pentacles", zh: "星幣", icon: "🪙" }
  ];

  const ranks = [
    { idx: 1, num: "Ace", zh: "一", up: "新起源、潛能爆發", rev: "起步受阻、時機未到" },
    { idx: 2, num: "2", zh: "二", up: "規劃未來、抉擇溝通", rev: "猶豫不決、溝通脫節" },
    { idx: 3, num: "3", zh: "三", up: "成果初顯、團隊合作", rev: "進度延誤、內部矛盾" },
    { idx: 4, num: "4", zh: "四", up: "穩定安居、鞏固基礎", rev: "不穩定、不安現狀" },
    { idx: 5, num: "5", zh: "五", up: "競爭挑戰、利益衝突", rev: "化解爭端、達成和解" },
    { idx: 6, num: "6", zh: "六", up: "勝利榮耀、獲得認可", rev: "短暫挫折、缺乏肯定" },
    { idx: 7, num: "7", zh: "七", up: "堅守陣地、捍衛立場", rev: "力不從心、壓力過重" },
    { idx: 8, num: "8", zh: "八", up: "快速推進、訊息傳遞", rev: "訊息誤導、阻礙延誤" },
    { idx: 9, num: "9", zh: "九", up: "堅持到底、累積實力", rev: "筋疲力盡、過度防備" },
    { idx: 10, num: "10", zh: "十", up: "責任重擔、極限考驗", rev: "卸下重負、崩潰瓦解" },
    { idx: 11, num: "Page", zh: "侍者", up: ["好奇學習", "新鮮訊息"], rev: "不成熟、缺乏定性" },
    { idx: 12, num: "Knight", zh: "騎士", up: "勇往直前、無畏衝刺", rev: "魯莽衝動、缺乏耐性" },
    { idx: 13, num: "Queen", zh: "王后", up: "自信魅力、溫暖滋養", rev: "情緒化、嫉妒控制" },
    { idx: 14, num: "King", zh: "國王", up: "成熟領導、掌控大局", rev: "專制獨裁、嚴苛冷酷" }
  ];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      const isZhName = `${suit.zh}${rank.zh}`;
      const isEnName = `${rank.num} of ${suit.en}`;

      db.push({
        id: `${suit.en.toLowerCase()}_${rank.num.toLowerCase()}`,
        nameEn: isEnName,
        nameZh: isZhName,
        icon: suit.icon,
        image: `assets/images/cards/${suit.prefix}_${rank.idx}.webp`, // 支援 w_1.webp ~ p_14.webp 替換
        uprightEn: `${isEnName} (Upright): ${rank.up}.`,
        uprightZh: `【${isZhName}】正位：${rank.up}。`,
        reversedEn: `${isEnName} (Reversed): ${rank.rev}.`,
        reversedZh: `【${isZhName}】逆位：${rank.rev}。`
      });
    });
  });

  return db;
})();

// 未抽牌卡槽渲染 (暗牌狀態)
function renderHiddenCardHtml(index) {
  return `
    <div class="card-render-box" style="padding:0; border-color:#f59e0b;">
      <div class="card-number-badge">${index + 1}</div>
      ${getCosmicDeckBackSvg()}
    </div>
  `;
}

// 翻牌後渲染 (明牌狀態，支援圖片自動載入，失敗則自動用 SVG 備份)
function renderNativeCardHtml(card, isReversed, isZh, index) {
  const name = isZh ? card.nameZh : card.nameEn;
  const status = isReversed ? (isZh ? '逆位' : 'Reversed') : (isZh ? '正位' : 'Upright');
  const statusBg = isReversed ? '#ef4444' : '#10b981';
  const imgUrl = card.image || `assets/images/cards/${card.number || '00'}.webp`;

  return `
    <div class="card-render-box ${isReversed ? 'card-reversed' : ''}">
      <div class="card-number-badge">${index + 1}</div>
      
      <!-- 若圖檔存在則顯示，否則自動轉為 SVG 質感卡牌 -->
      <img src="${imgUrl}" 
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
           alt="${name}" 
           style="width:100%; height:75%; object-fit:cover; border-radius:4px; margin-bottom:0.2rem;">
      
      <div style="display:none; flex-direction:column; align-items:center; justify-content:center; height:75%;">
        <div style="font-size:0.65rem; color:#f59e0b; font-weight:800;">ASTRAEA</div>
        <div style="font-size:1.8rem; margin:0.1rem 0;">${card.icon || '☯️'}</div>
      </div>

      <div style="font-size:0.78rem; font-weight:800; text-align:center; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">
        ${name}
      </div>
      <div style="font-size:0.65rem; color:#ffffff; font-weight:bold; background:${statusBg}; padding:1px 6px; border-radius:8px;">
        ${status}
      </div>
    </div>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TAROT_CARDS_DB, getCosmicDeckBackSvg, renderHiddenCardHtml, renderNativeCardHtml };
}