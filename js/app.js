/* ==========================================================================
   Astraea AI Tarot - 核心邏輯 (js/app.js)
   實現：漸進式 3 階段引導 (Step 1 輸入 -> Step 2 選擇與抽牌 -> Step 3 亮燈占卜)
   ========================================================================== */

let currentSpread = 1;
let drawnCards = [];
let currentDeckPool = [];
let toastTimer = null;

(function applyThemeImmediately() {
  const savedTheme = localStorage.getItem('tarot_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  } else if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  syncThemeState();
  
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = currentLang;

  applyLanguageUI();
  initStepFlow(); // 初始化步驟監聽器

  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const spreadParam = urlParams.get('spread');
  const cardParam = urlParams.get('card');

  if (qParam) {
    const queryInput = document.getElementById('user-query');
    if (queryInput) {
      queryInput.value = decodeURIComponent(qParam);
      unlockStep2(); // 如果 URL 帶問題自動解鎖 Step 2
    }
  }

  if (spreadParam) {
    const count = parseInt(spreadParam, 10);
    if ([1, 3, 4, 5].includes(count)) selectSpread(count);
  }

  window.addEventListener('resize', () => {
    initFanDeck();
  });
});

// 🌟 初始化步驟監聽器
function initStepFlow() {
  const queryInput = document.getElementById('user-query');
  if (queryInput) {
    // 當使用者開始在輸入框打字時，自動開啟 Step 2
    queryInput.addEventListener('input', () => {
      if (queryInput.value.trim().length > 0) {
        unlockStep2();
      }
    });
  }

  initFanDeck();
  initSlots();
  updateSubmitBtnState();
}

// 🌟 解鎖第二階段：顯示牌陣選擇與展牌區
function unlockStep2() {
  const step2Group = document.querySelector('.spread-btn-group');
  const fanDeckWrapper = document.getElementById('fan-deck-stage-wrapper');
  const slotsGrid = document.getElementById('slots-grid');

  if (step2Group && step2Group.classList.contains('step-section-hidden')) {
    step2Group.classList.remove('step-section-hidden');
    step2Group.classList.add('step-section-visible');
  }

  if (fanDeckWrapper && fanDeckWrapper.classList.contains('step-section-hidden')) {
    fanDeckWrapper.classList.remove('step-section-hidden');
    fanDeckWrapper.classList.add('step-section-visible');
  }

  if (slotsGrid && slotsGrid.classList.contains('step-section-hidden')) {
    slotsGrid.classList.remove('step-section-hidden');
    slotsGrid.classList.add('step-section-visible');
  }
}

// 🌟 動態更新「開始免費占卜」按鈕狀態
function updateSubmitBtnState() {
  const submitBtn = document.getElementById('btn-submit-divination');
  if (!submitBtn) return;

  const validDrawnCount = drawnCards.filter(c => c != null).length;
  const remaining = currentSpread - validDrawnCount;

  if (remaining > 0) {
    submitBtn.className = 'btn-gold btn-gold-disabled';
    submitBtn.innerText = `🔮 請先點擊上方卡牌完成抽牌 (還差 ${remaining} 張)`;
  } else {
    submitBtn.className = 'btn-gold btn-gold-ready';
    submitBtn.innerText = `🔮 牌陣已就緒！點擊開始免費占卜`;
  }
}

function fillQuestion(type) {
  const t = I18N_DICT[currentLang] || I18N_DICT['en'];
  const map = { love: t.tagLove, career: t.tagCareer, fortune: t.tagFortune, universe: t.tagUniverse };
  const input = document.getElementById('user-query');
  if (input) {
    input.value = map[type] || '';
    input.classList.remove('input-error-shake');
    unlockStep2(); // 點擊熱門問題自動開啟 Step 2
  }
}

function toggleDarkMode() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('tarot_theme', isLight ? 'light' : 'dark');
  updateThemeBtn();
}

function syncThemeState() {
  const saved = localStorage.getItem('tarot_theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (btn) {
    const isLight = document.body.classList.contains('light-mode');
    btn.innerText = isLight ? '🌙 Dark' : '☀️ Light';
  }
}

function toggleLargeFont() {
  document.body.classList.toggle('large-mode');
  initFanDeck();
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tarot_lang', lang);
  
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = lang;

  applyLanguageUI();
}

function applyLanguageUI() {
  const t = I18N_DICT[currentLang] || I18N_DICT['en'];

  const btnWiki = document.getElementById('btn-head-wiki');
  if (btnWiki) btnWiki.innerText = t.btnWiki;

  const btnFont = document.getElementById('btn-head-font');
  if (btnFont) btnFont.innerText = t.btnFont;

  const queryLabel = document.getElementById('user-query-label');
  if (queryLabel && t.inputLabel) {
    queryLabel.innerText = t.inputLabel;
  }

  document.getElementById('brand-title').innerText = t.brandTitle;
  document.getElementById('user-query').placeholder = t.placeholder;
  document.getElementById('btn-submit-divination').innerText = t.btnSubmit;
  document.getElementById('btn-redraw-action').innerText = t.btnReDraw;
  
  document.getElementById('btn-spread-1').innerText = t.btnSpread1;
  document.getElementById('btn-spread-3').innerText = t.btnSpread3;
  document.getElementById('btn-spread-5').innerText = t.btnSpread5;
  
  document.getElementById('tag-love').innerText = t.tagLove;
  document.getElementById('tag-career').innerText = t.tagCareer;
  document.getElementById('tag-fortune').innerText = t.tagFortune;
  document.getElementById('tag-universe').innerText = t.tagUniverse;
  
  updateThemeBtn();
  updateStatusNotice();
  updateSubmitBtnState();
}

function showToast(msg) {
  const box = document.getElementById('toast-banner-box');
  if (!box) return;  
  box.innerText = msg;
  box.style.display = 'block';

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    box.style.display = 'none';
  }, 3500);
}

function resetToHome() {
  drawnCards = [];
  document.getElementById('user-query').value = '';
  document.getElementById('user-query').classList.remove('input-error-shake');
  
  document.getElementById('interactive-setup-area').style.display = 'block';
  document.getElementById('fan-deck-stage-wrapper').style.display = 'block';
  document.getElementById('start-divination-btn-box').style.display = 'block';
  document.getElementById('re-draw-btn-box').style.display = 'none';
  document.getElementById('ritual-blessing-notice').style.display = 'none';
  document.getElementById('result-two-column-wrapper').style.display = 'none';
  document.getElementById('slots-grid').style.display = 'flex';

  // 重置回 Step 1 隱藏狀態
  const step2Group = document.querySelector('.spread-btn-group');
  const fanDeckWrapper = document.getElementById('fan-deck-stage-wrapper');
  const slotsGrid = document.getElementById('slots-grid');

  if (step2Group) {
    step2Group.classList.remove('step-section-visible');
    step2Group.classList.add('step-section-hidden');
  }
  if (fanDeckWrapper) {
    fanDeckWrapper.classList.remove('step-section-visible');
    fanDeckWrapper.classList.add('step-section-hidden');
  }
  if (slotsGrid) {
    slotsGrid.classList.remove('step-section-visible');
    slotsGrid.classList.add('step-section-hidden');
  }
  
  initFanDeck();
  initSlots();
  updateSubmitBtnState();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectSpread(count) {
  currentSpread = count;
  drawnCards = [];
  
  [1, 3, 5].forEach(num => {
    const btn = document.getElementById(`btn-spread-${num}`);
    if (btn) {
      const active = (num === count);
      btn.style.background = active ? 'var(--primary-purple)' : 'transparent';
      btn.style.color = active ? '#ffffff' : 'var(--text-main)';
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    }
  });

  document.getElementById('result-two-column-wrapper').style.display = 'none';
  document.getElementById('re-draw-btn-box').style.display = 'none';
  document.getElementById('slots-grid').style.display = 'flex';

  initFanDeck();
  initSlots();
  updateSubmitBtnState();
}

function initFanDeck() {
  const wrapper = document.getElementById('fan-deck-wrapper');
  const stageWrapper = document.getElementById('fan-deck-stage-wrapper');
  if (!wrapper || !stageWrapper) return;

  wrapper.style.display = 'flex';
  wrapper.innerHTML = '';
  
  currentDeckPool = [...TAROT_CARDS_DB].sort(() => Math.random() - 0.5);

  const displayCards = 22;
  const cardBackSvg = getCosmicDeckBackSvg();

  const containerWidth = stageWrapper.clientWidth || 360;
  const isMobile = containerWidth <= 500;

  const availableWidth = Math.min(containerWidth - 20, 420); 
  const cardOverlapX = availableWidth / (displayCards + 1.2); 
  const totalArcAngle = isMobile ? 22 : 28;
  const startAngle = -totalArcAngle / 2;
  const angleStep = totalArcAngle / (displayCards - 1);

  const midIdx = (displayCards - 1) / 2;

  for (let i = 0; i < displayCards; i++) {
    const angle = startAngle + i * angleStep;
    const offsetFromCenter = i - midIdx;
    
    const normOffset = offsetFromCenter / midIdx;
    const transY = Math.pow(normOffset, 2) * (isMobile ? 4 : 8); 
    const transX = offsetFromCenter * cardOverlapX;

    const card = document.createElement('div');
    card.className = 'fan-card';
    card.id = `fan-card-${i}`;
    
    const baseTransform = `translate(${transX}px, ${transY}px) rotate(${angle}deg)`;
    card.style.setProperty('--base-transform', baseTransform);
    card.style.transform = baseTransform;
    card.style.zIndex = i;
    card.innerHTML = cardBackSvg;

    card.setAttribute('draggable', 'true');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Tarot Card ${i + 1}`);

    card.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', card.id);
      card.style.opacity = '0.5';
    };

    card.ondragend = () => { card.style.opacity = '1'; };

    card.onclick = (e) => {
      e.preventDefault();
      drawCard(card);
    };

    wrapper.appendChild(card);
  }

  updateStatusNotice();
}

function initSlots() {
  const grid = document.getElementById('slots-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const midIndex = (currentSpread - 1) / 2;

  for (let i = 0; i < currentSpread; i++) {
    const slotIndex = i;
    const slot = document.createElement('div');
    slot.id = `slot-${i + 1}`;
    slot.className = 'slot-box';
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('role', 'button');
    slot.setAttribute('aria-label', `Card Slot ${i + 1}`);
    
    if (currentSpread > 1) {
      const offset = i - midIndex;
      const rot = offset * 2.5;
      const transY = Math.abs(offset) * 4;
      slot.style.transform = `translateY(${transY}px) rotate(${rot}deg)`;
    } else {
      slot.style.transform = 'none';
    }

    slot.onclick = () => removeCardFromSlot(slotIndex);
    slot.innerHTML = `<span style="font-size:0.8rem; color:var(--text-sub); font-weight:bold;">Card ${i + 1}</span>`;
    grid.appendChild(slot);
  }
}

function updateStatusNotice() {
  const t = I18N_DICT[currentLang] || I18N_DICT['en'];
  const validDrawnCount = drawnCards.filter(c => c != null).length;
  const left = currentSpread - validDrawnCount;
  const status = document.getElementById('tarot-hint-status');
  if (!status) return;

  if (left > 0) {
    status.innerText = `${t.drawHint} (${left})`;
  } else {
    status.innerText = t.cardsDrawn;
  }
}

function drawCard(cardEl, targetSlotIdx = null) {
  if (cardEl.style.opacity === '0') return;

  let fillIdx = targetSlotIdx;
  if (fillIdx === null) {
    fillIdx = drawnCards.findIndex(c => c === null || c === undefined);
    if (fillIdx === -1) {
       for(let i=0; i < currentSpread; i++) {
         if (!drawnCards[i]) { fillIdx = i; break; }
       }
       if (fillIdx === -1) fillIdx = drawnCards.length;
    }
  }

  if (drawnCards[fillIdx] || fillIdx >= currentSpread) return;

  if (typeof TarotAudio !== 'undefined' && TarotAudio.playDraw) {
    TarotAudio.playDraw();
  }

  const randomCard = currentDeckPool.pop() || TAROT_CARDS_DB[0];
  const isReversed = Math.random() < 0.25;
  const cardData = { ...randomCard, isReversed, sourceCardId: cardEl.id };

  drawnCards[fillIdx] = cardData;

  cardEl.style.opacity = '0';
  cardEl.style.pointerEvents = 'none';

  const targetSlot = document.getElementById(`slot-${fillIdx + 1}`);
  if (targetSlot) {
    targetSlot.classList.add('active');
    targetSlot.innerHTML = renderHiddenCardHtml(fillIdx);
  }

  updateStatusNotice();
  updateSubmitBtnState(); // 每次抽牌自動更新按鈕亮燈狀態
}

function removeCardFromSlot(slotIdx) {
  const cardData = drawnCards[slotIdx];
  if (!cardData) return;

  if (cardData.sourceCardId) {
    const origCard = document.getElementById(cardData.sourceCardId);
    if (origCard) {
      origCard.style.opacity = '1';
      origCard.style.pointerEvents = 'auto';
    }
  }

  drawnCards[slotIdx] = null;

  const slotEl = document.getElementById(`slot-${slotIdx + 1}`);
  if (slotEl) {
    slotEl.classList.remove('active');
    slotEl.innerHTML = `<span style="font-size:0.8rem; color:var(--text-sub); font-weight:bold;">Card ${slotIdx + 1}</span>`;
  }

  updateStatusNotice();
  updateSubmitBtnState(); // 移除抽牌時自動更新按鈕狀態
}

function startTarotDivination() {
  const queryInput = document.getElementById('user-query');
  const userText = queryInput ? queryInput.value.trim() : '';

  if (!userText) {
    queryInput.classList.add('input-error-shake');
    showToast(currentLang.startsWith('zh') ? '⚠️ 請先輸入您的困惑，或點擊上方熱門問題！' : '⚠️️ Please type your query or select a topic above!');
    queryInput.focus();
    return;
  }

  const validDrawnCount = drawnCards.filter(c => c != null).length;
  const remaining = currentSpread - validDrawnCount;
  
  if (remaining > 0) {
    showToast(currentLang.startsWith('zh') ? `✨ 還需要抽取 ${remaining} 張牌，請憑直覺點擊卡牌！` : `✨ Please draw ${remaining} more card(s) above!`);
    return;
  }

  if (typeof TarotAudio !== 'undefined' && TarotAudio.playChime) {
    TarotAudio.playChime();
  }

  document.getElementById('start-divination-btn-box').style.display = 'none';
  document.getElementById('fan-deck-stage-wrapper').style.display = 'none';
  
  const blessingNotice = document.getElementById('ritual-blessing-notice');
  if (blessingNotice) blessingNotice.style.display = 'block';

  setTimeout(() => {
    if (blessingNotice) blessingNotice.style.display = 'none';
    generateAIReading();
  }, 1200);
}

// 🌟 AI 故事句庫解讀引擎
function generateAIReading() {
  document.getElementById('interactive-setup-area').style.display = 'none';
  document.getElementById('slots-grid').style.display = 'none';
  
  document.getElementById('re-draw-btn-box').style.display = 'block';
  const resultGrid = document.getElementById('result-two-column-wrapper');
  if (resultGrid) resultGrid.style.display = 'grid';

  const userQuery = document.getElementById('user-query').value.trim() || '通用運勢指引';
  const isZh = currentLang.startsWith('zh');
  const validCards = drawnCards.filter(c => c != null);

  const leftSlotsBox = document.getElementById('result-left-slots');
  if (leftSlotsBox) {
    leftSlotsBox.innerHTML = validCards.map((c, i) => `
      <div class="slot-box active" style="width:70px; height:114px;">
        ${renderNativeCardHtml(c, c.isReversed, isZh, i)}
      </div>
    `).join('');
  }
  
  const posNamesZh = {
    1: ['核心指引'],
    3: ['過去因果脈絡', '現在局勢狀態', '未來發展趨勢'],
    4: ['問題核心關鍵', '當前主要障礙', '行動建言對策', '手邊優勢資源'],
    5: ['當事人的核心狀態', '對選項A/對方的感情態度', '選項A現況/對方當前狀態', '對選項B/對方對我的態度', '最終演變發展結果']
  };

  const currentPosList = posNamesZh[validCards.length] || [];

  const summaryHtml = `
    <div class="cards-detail-list">
      ${validCards.map((c, i) => `
        <div class="card-detail-item">
          <span style="background:#7e22ce; color:#fff; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:bold; flex-shrink:0;">${i + 1}</span>
          <div>
            <div style="font-size:0.72rem; color:var(--text-sub); font-weight:bold;">${currentPosList[i] || `位置 ${i + 1}`}</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">
              ${c.nameZh}
              <span style="font-size:0.7rem; color:${c.isReversed ? '#ef4444' : '#10b981'}; margin-left:4px;">
                ${c.isReversed ? '逆位' : '正位'}
              </span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('cards-summary').innerHTML = summaryHtml;

  let queryCategory = 'general';
  if (/(愛|情|喜歡|他|她|復合|曖昧|真命|對象|伴侶|結婚|單身)/.test(userQuery)) queryCategory = 'love';
  else if (/(工作|換|轉職|事業|主管|公司|創業|求職|升遷|同事)/.test(userQuery)) queryCategory = 'career';
  else if (/(財|錢|投資|收入|股票|賺|富)/.test(userQuery)) queryCategory = 'fortune';

  let readingText = `✨ 【Astraea AI 靈性導師深度解讀】\n\n`;
  readingText += `親愛的心靈探索者，關於您所請示的困惑：「${userQuery}」\n`;
  readingText += `宇宙靈性能量已透過 ${validCards.length} 張牌卡，顯化出您內心真實的心理圖景與能量流向：\n\n`;

  validCards.forEach((c, idx) => {
    const posName = currentPosList[idx] || `位置 ${idx + 1}`;
    const statusText = c.isReversed ? '逆位' : '正位';

    const storyInsight = generateSmartCardStory(c, c.isReversed, queryCategory, posName);
    
    readingText += `📍【${posName}】${c.nameZh}（${statusText}）\n`;
    readingText += `👉 能量洞察：${storyInsight}\n\n`;
  });

  readingText += `🔮 【靈性大師綜合指引與轉化心法】\n`;
  readingText += generateMasterSynthesis(validCards[0], queryCategory, userQuery);

  typewriterEffect('typewriter-text', readingText, 16);

  setTimeout(() => {
    if (resultGrid) resultGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function generateSmartCardStory(card, isReversed, category, positionName) {
  const isUpright = !isReversed;
  const keywords = isUpright ? (card.uprightKeywords || []) : (card.reversedKeywords || []);
  const kwStr = keywords.join('、') || '能量調和中';

  const openings = {
    love: isUpright 
      ? ["在情感關係的能量場中，這張牌呈現出極其清澈且積極的流動。", "這反映出您與對方之間存在著顯著的心靈連結與互動契機。", "牌面顯示內心深處的情感渴望正在逐步顯化。"]
      : ["目前感情能量有所沉澱，提示內心可能隱藏著尚未化解的疑慮或防備。", "這提醒您在情感溝通上暫時出現了思維盲點或情緒壓抑。", "此時不宜過度急躁，能量場提示需要給予彼此更多的理解空間。"],
    career: isUpright
      ? ["在職場與事業格局上，這象徵著主動權與清晰目標的建立。", "這代表您當前的專業能力與努力正處於獲得回饋的上升期。", "牌面展現出強大的行動力與突破現狀的潛在機會。"]
      : ["事業推進過程中暫時遇到了能量瓶頸或方向迷惘。", "這提示您需警惕過度焦慮或盲目擴張帶來的潛在風險。", "當前局勢提醒您先收斂衝動，靜心檢視內在的思維死角。"],
    general: isUpright
      ? ["宇宙能量正順暢地為您鋪路，展現出明確的方向感。", "這反映出您當前的心態具備強大的創造力與信心。", "這張牌為您的內心狀態注入了和諧與定靜的力量。"]
      : ["目前整體能量有所受阻，提示您需要暫緩腳步，收斂外放的精神。", "這是一次寶貴的內省契機，提醒您留意平時忽視的隱性細節。", "牌面提醒您先清理內心的焦慮，重新找回自主的節奏。"]
  };

  const selectedOpenings = openings[category] || openings.general;
  const randomOpening = selectedOpenings[Math.floor(Math.random() * selectedOpenings.length)];

  let posNotice = "";
  if (positionName.includes('障礙') && isUpright) {
    posNotice = "\n【特別提醒：此好牌出現在障礙位，提示您需防範因過度樂觀、盲目自信或沉迷舒適圈而忽視潛在風險。】";
  } else if (positionName.includes('對策') && isReversed) {
    posNotice = "\n【行動建議：逆位出現在對策位，建言您暫時不宜盲目強攻，應優先調整內在心態並解開思維死角。】";
  }

  let detailDesc = isUpright 
    ? (card.uprightZh || `核心關鍵聚焦於「${kwStr}」。請保持信心，展現您清晰的行動力。`)
    : (card.reversedZh || `能量提醒需注意「${kwStr}」帶來的課題。請適度收斂衝動，進行內在調整。`);

  return `${randomOpening} ${detailDesc} ${posNotice}`;
}

function generateMasterSynthesis(firstCard, category, query) {
  const cardName = firstCard ? firstCard.nameZh : '核心牌卡';
  
  const adviceList = [
    `本牌陣以【${cardName}】作為起手核心，精準映照出您當前局勢的真相。正如塔羅牌是一面心靈的鏡子，它映射出您內心深處最真實的渴望與焦慮。`,
    `請記住，未來的發展並非定數，而是您「當下念頭與選擇」的延伸。當您願意為自己的心態帶來一咪咪微小的改變，整個能量場就會隨之轉動！`,
    `建議您保持平靜而覺察的心，不被一時的焦慮所困，明確您真正想要的方向，當下就能創造出您期望的未來。`
  ];

  return adviceList.join('\n');
}

function typewriterEffect(elementId, text, speed) {
  const container = document.getElementById(elementId);
  if (!container) return;

  let i = 0;
  container.innerHTML = '';
  
  const timer = setInterval(() => {
    if (i < text.length) {
      container.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

function switchWikiTab(tabName) {
  const tabs = ['articles', 'cards', 'questions', 'combinations', 'spreads'];
  
  tabs.forEach(name => {
    const btn = document.getElementById(`tab-btn-${name}`);
    const content = document.getElementById(`wiki-tab-${name}`);
    
    if (btn && content) {
      if (name === tabName) {
        btn.style.background = 'var(--primary-purple)';
        btn.style.color = '#ffffff';
        content.style.display = 'block';
      } else {
        btn.style.background = 'rgba(168, 85, 247, 0.15)';
        btn.style.color = 'var(--text-main)';
        content.style.display = 'none';
      }
    }
  });
}

function openPolicyModal(type) {
  const modal = document.getElementById('policy-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  const isZh = currentLang.startsWith('zh');

  if (!modal || !title || !content) return;

  const docs = {
    privacy: {
      titleZh: '🔒 隱私政策 Privacy Policy',
      titleEn: '🔒 Privacy Policy',
      textZh: '我們高度重視您的個人隱私。本占卜應用為匿名娛樂與心靈探索工具，不會未經允許收集您的個人身分資料。您輸入的提問與抽取之卡牌紀錄僅會用於即時解讀計算，不會對外販售或公開。',
      textEn: 'We strictly protect your privacy. This application is designed for personalized spiritual exploration and entertainment. We do not sell or transmit your personal query data to third parties.'
    },
    terms: {
      titleZh: '📜 服務條款 Terms of Service',
      titleEn: '📜 Terms of Service',
      textZh: '歡迎使用 Astraea AI 塔羅占卜服務。本系統所提供之解牌內容係基於象徵學與語意分析生成之指引，僅供心靈啟發與娛樂參考，不可替代專業醫療、法律、財務或心理諮商之建議。',
      textEn: 'By using Astraea AI Tarot, you agree that readings provided are for inspiration and entertainment purposes only, and should not replace professional legal, financial, or medical advice.'
    },
    refund: {
      titleZh: '🪙 退款政策 Refund Policy',
      titleEn: '🪙 Refund Policy',
      textZh: '本網站目前提供免費算牌服務。',
      textEn: 'Free readings are completely open to all users.'
    }
  };

  const doc = docs[type] || docs.privacy;
  title.innerText = isZh ? doc.titleZh : doc.titleEn;
  content.innerText = isZh ? doc.textZh : doc.textEn;

  modal.style.display = 'flex';
}

function closePolicyModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('policy-modal');
  if (modal) modal.style.display = 'none';
}