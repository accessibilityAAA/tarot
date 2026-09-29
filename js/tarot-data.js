/* ==========================================================================
   Astraea AI Tarot - 78 Cards Complete Database & SVG Pattern (js/tarot-data.js)
   ========================================================================== */

// 1. 78 張完整偉特塔羅牌資料 (22大牌 + 56小牌)
const TAROT_CARDS_DB = (function() {
  const db = [];

  const majorNames = [
    { nameEn: 'The Fool', nameZh: '愚者', icon: '🃏' },
    { nameEn: 'The Magician', nameZh: '魔術師', icon: '🪄' },
    { nameEn: 'The High Priestess', nameZh: '女祭司', icon: '🌙' },
    { nameEn: 'The Empress', nameZh: '皇后', icon: '👑' },
    { nameEn: 'The Emperor', nameZh: '皇帝', icon: '🏛️' },
    { nameEn: 'The Hierophant', nameZh: '教皇', icon: '🔔' },
    { nameEn: 'The Lovers', nameZh: '戀人', icon: '💕' },
    { nameEn: 'The Chariot', nameZh: '戰車', icon: '🛡️' },
    { nameEn: 'Strength', nameZh: '力量', icon: '🦁' },
    { nameEn: 'The Hermit', nameZh: '隱士', icon: '🕯️' },
    { nameEn: 'Wheel of Fortune', nameZh: '命運之輪', icon: '🎡' },
    { nameEn: 'Justice', nameZh: '正義', icon: '⚖️' },
    { nameEn: 'The Hanged Man', nameZh: '倒吊人', icon: '🙃' },
    { nameEn: 'Death', nameZh: '死神', icon: '🥀' },
    { nameEn: 'Temperance', nameZh: '節制', icon: '🕊️' },
    { nameEn: 'The Devil', nameZh: '惡魔', icon: '🔥' },
    { nameEn: 'The Tower', nameZh: '高塔', icon: '⚡' },
    { nameEn: 'The Star', nameZh: '星星', icon: '⭐' },
    { nameEn: 'The Moon', nameZh: '月亮', icon: '🌕' },
    { nameEn: 'The Sun', nameZh: '太陽', icon: '☀️' },
    { nameEn: 'Judgement', nameZh: '審判', icon: '🎺' },
    { nameEn: 'The World', nameZh: '世界', icon: '🌍' }
  ];

  majorNames.forEach((item, index) => {
    db.push({
      id: `major_${index}`,
      nameEn: item.nameEn,
      nameZh: item.nameZh,
      icon: item.icon,
      uprightEn: `${item.nameEn} brings powerful breakthrough, clarity, and guidance.`,
      uprightZh: `【${item.nameZh}】正位能量：帶來強大的靈性啟示、關鍵轉折與明確方向。`,
      reversedEn: `${item.nameEn} reversed suggests internal hesitation or timing adjustment.`,
      reversedZh: `【${item.nameZh}】逆位提醒：留意內在的心靈障礙、焦慮情緒或時機調適。`
    });
  });

  const suits = [
    { nameEn: 'Wands', nameZh: '權杖', icon: '🪄' },
    { nameEn: 'Cups', nameZh: '聖杯', icon: '🍷' },
    { nameEn: 'Swords', nameZh: '寶劍', icon: '🗡️' },
    { nameEn: 'Pentacles', nameZh: '錢幣', icon: '🪙' }
  ];

  const ranks = [
    { num: 'Ace', zh: '一' }, { num: '2', zh: '二' }, { num: '3', zh: '三' },
    { num: '4', zh: '四' }, { num: '5', zh: '五' }, { num: '6', zh: '六' },
    { num: '7', zh: '七' }, { num: '8', zh: '八' }, { num: '9', zh: '九' },
    { num: '10', zh: '十' }, { num: 'Page', zh: '侍者' }, { num: 'Knight', zh: '騎士' },
    { num: 'Queen', zh: '王后' }, { num: 'King', zh: '國王' }
  ];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      db.push({
        id: `${suit.nameEn}_${rank.num}`,
        nameEn: `${rank.num} of ${suit.nameEn}`,
        nameZh: `${suit.nameZh}${rank.zh}`,
        icon: suit.icon,
        uprightEn: `Focus on ${suit.nameEn} energy: practical actions and clear intentions.`,
        uprightZh: `【${suit.nameZh}${rank.zh}】正位：代表具體的行動力、情緒契合與能量運轉。`,
        reversedEn: `Reversed ${suit.nameEn} indicates internal hesitation or reassessment needed.`,
        reversedZh: `【${suit.nameZh}${rank.zh}】逆位：提醒留意過度內耗、溝通障礙或需要重新評估。`
      });
    });
  });

  return db;
})();

// 2. 精緻歐美宇宙星盤 SVG 牌背 Pattern
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

// 🌟 3. 未翻牌（暗牌狀態）：只顯示神秘牌背與數字徽章
function renderHiddenCardHtml(index) {
  return `
    <div class="card-render-box" style="padding:0; border-color:#f59e0b;">
      <div class="card-number-badge">${index + 1}</div>
      ${getCosmicDeckBackSvg()}
    </div>
  `;
}

// 🌟 4. 已翻牌（明牌狀態）：展示塔羅圖面與正逆位
function renderNativeCardHtml(card, isReversed, isZh, index) {
  const name = isZh ? card.nameZh : card.nameEn;
  const status = isReversed ? (isZh ? '逆位' : 'Reversed') : (isZh ? '正位' : 'Upright');
  const statusBg = isReversed ? '#ef4444' : '#10b981';

  return `
    <div class="card-render-box ${isReversed ? 'card-reversed' : ''}">
      <div class="card-number-badge">${index + 1}</div>
      <div style="font-size: 0.65rem; color: #f59e0b; font-weight: 800; letter-spacing: 0.5px;">ASTRAEA</div>
      <div style="font-size: 2rem; margin: 0.1rem 0;">${card.icon}</div>
      <div style="font-size: 0.8rem; font-weight: 800; text-align: center; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
        ${name}
      </div>
      <div style="font-size: 0.65rem; color: #ffffff; font-weight: bold; background: ${statusBg}; padding: 1px 6px; border-radius: 8px;">
        ${status}
      </div>
    </div>
  `;
}