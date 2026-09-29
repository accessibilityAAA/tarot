/* ==========================================================================
   天下第一塔羅牌 - 3D 扇形展牌與物理抽牌引擎 (js/tarot-engine.js)
   支援 PC/Mobile 觸控拖拽、雙向退牌、音效反饋與防破版自適應
   ========================================================================== */

let currentSpreadCount = 1; // 預設牌陣數量
let userDrawnCards = [];    // 已抽出的卡牌資料
let activeDeckPool = [];    // 當前牌堆

// 1. 初始化 3D 弧形扇形牌堆
function render3DFanDeck() {
  const wrapper = document.getElementById('fan-deck-wrapper');
  if (!wrapper) return;

  wrapper.style.display = 'flex';
  wrapper.innerHTML = '';

  // 隨機打亂 78 張牌庫
  const fullDeck = [...TAROT_MAJOR_DB, ...TAROT_MINOR_DB];
  activeDeckPool = fullDeck.sort(() => Math.random() - 0.5);

  // 展現 22 張視覺卡牌形成精美扇形弧度
  const displayCount = 22;
  const isMobile = window.innerWidth <= 600;
  const angleStep = isMobile ? 2.2 : 3.2;
  const xStep = isMobile ? 12 : 18;

  for (let i = 0; i < displayCount; i++) {
    const rot = (i - (displayCount - 1) / 2) * angleStep;
    const transX = (i - (displayCount - 1) / 2) * xStep;

    const card = document.createElement('div');
    card.className = 'fan-card';
    card.id = `fan-card-${i}`;

    const baseTransform = `translateX(${transX}px) rotate(${rot}deg)`;
    card.style.setProperty('--base-transform', baseTransform);
    card.style.transform = baseTransform;
    card.style.zIndex = i;

    // 牌背視覺
    card.innerHTML = getCosmicDeckBackSvg();

    // 拖拽與無障礙屬性
    card.setAttribute('draggable', 'true');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Tarot Card ${i + 1}`);

    // PC 拖拽事件
    card.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', card.id);
      card.style.opacity = '0.5';
    };
    card.ondragend = () => { card.style.opacity = '1'; };

    // 點擊/觸控抽牌
    card.onclick = (e) => {
      e.preventDefault();
      handleDrawCard(card);
    };

    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDrawCard(card);
      }
    };

    wrapper.appendChild(card);
  }

  updateSpreadStatusNotice();
}

// 2. 初始化放置卡槽 (Slots)
function renderSlotBoxes() {
  const grid = document.getElementById('slots-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const midIndex = (currentSpreadCount - 1) / 2;

  for (let i = 0; i < currentSpreadCount; i++) {
    const slotIdx = i;
    const slot = document.createElement('div');
    slot.id = `slot-${i + 1}`;
    slot.className = 'slot-box';
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('role', 'button');
    slot.setAttribute('aria-label', `Card Slot ${i + 1}`);

    // 微幅弧形排列卡槽 (質感加分)
    if (currentSpreadCount > 1) {
      const offset = i - midIndex;
      const rot = offset * 2;
      const transY = Math.abs(offset) * 4;
      slot.style.transform = `translateY(${transY}px) rotate(${rot}deg)`;
    } else {
      slot.style.transform = 'none';
    }

    // 拖拽目標區域事件
    slot.ondragover = (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    };
    slot.ondragleave = () => { slot.classList.remove('drag-over'); };
    slot.ondrop = (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      const cardId = e.dataTransfer.getData('text/plain');
      const cardEl = document.getElementById(cardId);
      if (cardEl && cardEl.style.opacity !== '0') {
        handleDrawCard(cardEl, slotIdx);
      }
    };

    // 點擊卡槽執行「退牌」
    slot.onclick = () => removeCardFromSlot(slotIdx);
    slot.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        removeCardFromSlot(slotIdx);
      }
    };

    const spreadData = typeof TAROT_SPREADS_DB !== 'undefined' ? TAROT_SPREADS_DB[currentSpreadCount] : null;
    const posName = (spreadData && spreadData.positions && spreadData.positions[i]) 
      ? (spreadData.positions[i].name[currentLang] || spreadData.positions[i].name['zh-TW']) 
      : `Card ${i + 1}`;

    slot.innerHTML = `<span style="font-size:0.78rem; color:var(--text-sub); font-weight:bold; text-align:center; padding:0 0.2rem;">${escapeHTML(posName)}</span>`;
    grid.appendChild(slot);
  }
}

// 3. 抽牌核心邏輯
function handleDrawCard(cardEl, targetSlotIdx = null) {
  if (cardEl.style.opacity === '0') return;

  // 尋找目標空卡槽
  let fillIdx = targetSlotIdx;
  if (fillIdx === null) {
    fillIdx = userDrawnCards.findIndex(c => c === null || c === undefined);
    if (fillIdx === -1) {
      for (let i = 0; i < currentSpreadCount; i++) {
        if (!userDrawnCards[i]) { fillIdx = i; break; }
      }
      if (fillIdx === -1) fillIdx = userDrawnCards.length;
    }
  }

  if (userDrawnCards[fillIdx] || fillIdx >= currentSpreadCount) return;

  // 播放抽牌音效
  if (typeof TarotAudio !== 'undefined') {
    TarotAudio.playDraw();
  }

  const randomCard = activeDeckPool.pop() || TAROT_MAJOR_DB[0];
  const isReversed = Math.random() < 0.25; // 25% 機率逆位
  const cardData = { ...randomCard, isReversed, sourceCardId: cardEl.id };

  userDrawnCards[fillIdx] = cardData;

  // 淡出已抽取的牌卡
  cardEl.style.opacity = '0';
  cardEl.style.pointerEvents = 'none';

  // 填入卡槽並執行渲染
  const targetSlot = document.getElementById(`slot-${fillIdx + 1}`);
  if (targetSlot) {
    targetSlot.classList.add('active');
    targetSlot.innerHTML = renderHiddenCardHtml(fillIdx);
  }

  updateSpreadStatusNotice();
}

// 4. 點擊卡槽「退牌」修正邏輯
function removeCardFromSlot(slotIdx) {
  const cardData = userDrawnCards[slotIdx];
  if (!cardData) return;

  if (typeof TarotAudio !== 'undefined') {
    TarotAudio.playDraw();
  }

  // 恢復原展牌區的卡牌顯示
  if (cardData.sourceCardId) {
    const origCard = document.getElementById(cardData.sourceCardId);
    if (origCard) {
      origCard.style.opacity = '1';
      origCard.style.pointerEvents = 'auto';
    }
  }

  userDrawnCards[slotIdx] = null;

  const slotEl = document.getElementById(`slot-${slotIdx + 1}`);
  if (slotEl) {
    slotEl.classList.remove('active');
    const spreadData = typeof TAROT_SPREADS_DB !== 'undefined' ? TAROT_SPREADS_DB[currentSpreadCount] : null;
    const posName = (spreadData && spreadData.positions && spreadData.positions[slotIdx]) 
      ? (spreadData.positions[slotIdx].name[currentLang] || spreadData.positions[slotIdx].name['zh-TW']) 
      : `Card ${slotIdx + 1}`;

    slotEl.innerHTML = `<span style="font-size:0.78rem; color:var(--text-sub); font-weight:bold; text-align:center; padding:0 0.2rem;">${escapeHTML(posName)}</span>`;
  }

  updateSpreadStatusNotice();
}

// 5. 切換牌陣模式
function changeSpreadMode(count) {
  currentSpreadCount = count;
  userDrawnCards = [];

  // 重置結果頁與按鈕
  const resultGrid = document.getElementById('result-two-column-wrapper');
  if (resultGrid) resultGrid.style.display = 'none';

  const redrawBox = document.getElementById('re-draw-btn-box');
  if (redrawBox) redrawBox.style.display = 'none';

  const slotsGrid = document.getElementById('slots-grid');
  if (slotsGrid) slotsGrid.style.display = 'flex';

  render3DFanDeck();
  renderSlotBoxes();
}

// 6. 更新提示狀態文字
function updateSpreadStatusNotice() {
  const t = I18N_DICT[currentLang] || I18N_DICT['zh-TW'];
  const validDrawnCount = userDrawnCards.filter(c => c != null).length;
  const left = currentSpreadCount - validDrawnCount;
  const status = document.getElementById('tarot-hint-status');
  if (!status) return;

  if (left > 0) {
    status.innerText = `${t.drawHint} (${left})`;
  } else {
    status.innerText = t.cardsDrawn;
  }
}

// 7. 生成暗牌 SVG (用於尚未點擊解牌時的卡槽狀態)
function renderHiddenCardHtml(index) {
  return `
    <div class="card-render-box" style="padding:0; border-color:var(--gold-accent);">
      <div class="card-number-badge">${index + 1}</div>
      ${getCosmicDeckBackSvg()}
    </div>
  `;
}

// 8. 生成宇宙星盤 SVG 牌背
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

// 9. 生成明牌 HTML (支援圖片與 Fallback 容錯)[cite: 32]
function renderNativeCardHtml(card, isReversed, isZh, index) {
  const name = isZh ? card.nameZh : card.nameEn;
  const status = isReversed ? (isZh ? '逆位' : 'Reversed') : (isZh ? '正位' : 'Upright');
  const statusBg = isReversed ? '#ef4444' : '#10b981';
  const imgUrl = card.image || `assets/images/cards/${card.number || '00'}.webp`;

  return `
    <div class="card-render-box ${isReversed ? 'card-reversed' : ''}">
      <div class="card-number-badge">${index + 1}</div>
      
      <!-- 支援圖片自動載入，若檔名不存在則自動展示無腦備份圖案 -->
      <img src="${imgUrl}" 
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
           alt="${escapeHTML(name)}" 
           style="width:100%; height:75%; object-fit:cover; border-radius:4px; margin-bottom:0.2rem;">
      
      <div style="display:none; flex-direction:column; align-items:center; justify-content:center; height:75%;">
        <div style="font-size:0.65rem; color:#f59e0b; font-weight:800;">ASTRAEA</div>
        <div style="font-size:1.8rem; margin:0.1rem 0;">${card.icon || '☯️'}</div>
      </div>

      <div style="font-size:0.78rem; font-weight:800; text-align:center; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">
        ${escapeHTML(name)}
      </div>
      <div style="font-size:0.65rem; color:#ffffff; font-weight:bold; background:${statusBg}; padding:1px 6px; border-radius:8px;">
        ${status}
      </div>
    </div>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    render3DFanDeck,
    renderSlotBoxes,
    changeSpreadMode,
    handleDrawCard,
    removeCardFromSlot,
    renderNativeCardHtml
  };
}