/* ==========================================================================
   SITAROT - App Core Controller (js/app.js)
   包含社群籤詩圖卡生成、AdSense 廣告佈局、合規條款 Modal 與全卡牌圖面精美渲染
   ========================================================================== */

let currentSpread = 1;
let drawnCards = [];
let currentDeckPool = [];
let toastTimer = null;

(function applyThemeAndFontImmediately() {
  const savedTheme = localStorage.getItem('sitarot_theme') || localStorage.getItem('tarot_theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    document.body.classList.add('light-mode');
  }

  const savedFont = localStorage.getItem('sitarot_large_font');
  if (savedFont === 'true') {
    document.documentElement.classList.add('large-mode');
    document.body.classList.add('large-mode');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  syncThemeState();
  syncFontState();
  
  const langSelect = document.getElementById('lang-select');
  if (langSelect && typeof currentLang !== 'undefined') {
    langSelect.value = currentLang;
  }

  applyLanguageUI();
  initStepFlow();

  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const spreadParam = urlParams.get('spread');

  if (qParam) {
    const queryInput = document.getElementById('user-query');
    if (queryInput) queryInput.value = decodeURIComponent(qParam);
  }

  if (spreadParam) {
    const count = parseInt(spreadParam, 10);
    if ([1, 3, 5].includes(count)) selectSpread(count);
  }

  window.addEventListener('resize', () => {
    initFanDeck();
  });
});

function toggleDarkMode() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  document.body.classList.toggle('light-mode', isLight);

  const modeVal = isLight ? 'light' : 'dark';
  localStorage.setItem('sitarot_theme', modeVal);
  localStorage.setItem('tarot_theme', modeVal);
  updateThemeBtn();
}

function syncThemeState() {
  const saved = localStorage.getItem('sitarot_theme') || localStorage.getItem('tarot_theme');
  const isLight = saved === 'light';
  
  document.documentElement.classList.toggle('light-mode', isLight);
  document.body.classList.toggle('light-mode', isLight);
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (btn) {
    const isLight = document.documentElement.classList.contains('light-mode');
    btn.innerText = isLight ? '🌙 Dark' : '☀️ Light';
  }
}

function switchLanguage(lang) {
  if (typeof currentLang !== 'undefined') {
    currentLang = lang;
  } else {
    window.currentLang = lang;
  }
  localStorage.setItem('tarot_lang', lang);
  applyLanguageUI();

  if (drawnCards.filter(c => c != null).length === currentSpread && document.getElementById('result-two-column-wrapper').style.display !== 'none') {
    generateAIReading();
  }
}

function applyLanguageUI() {
  const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
  const dict = (typeof I18N_DICT !== 'undefined') ? I18N_DICT : {};
  const t = dict[langKey] || dict['zh-TW'] || {};
  
  const queryLabel = document.getElementById('user-query-label');
  if (queryLabel && t.inputLabel) queryLabel.innerText = t.inputLabel;

  const queryInput = document.getElementById('user-query');
  if (queryInput && t.placeholder) queryInput.placeholder = t.placeholder;

  const mapIds = {
    'tag-love': t.tagLove,
    'tag-career': t.tagCareer,
    'tag-fortune': t.tagFortune,
    'tag-universe': t.tagUniverse,
    'btn-spread-1': t.btnSpread1,
    'btn-spread-3': t.btnSpread3,
    'btn-spread-5': t.btnSpread5,
    'btn-submit-query': t.btnSubmit,
    'btn-redraw-action': t.btnReDraw,
    'btn-save-journal': t.btnSave
  };

  Object.keys(mapIds).forEach(id => {
    const el = document.getElementById(id);
    if (el && mapIds[id]) el.innerText = mapIds[id];
  });

  updateSubmitBtnState();
  updateStatusNotice();
}

function toggleLargeFont() {
  const isLarge = document.documentElement.classList.toggle('large-mode');
  document.body.classList.toggle('large-mode', isLarge);
  localStorage.setItem('sitarot_large_font', isLarge ? 'true' : 'false');
  initFanDeck();
}

function syncFontState() {
  const isLarge = localStorage.getItem('sitarot_large_font') === 'true';
  document.documentElement.classList.toggle('large-mode', isLarge);
  document.body.classList.toggle('large-mode', isLarge);
}

function initStepFlow() {
  const queryInput = document.getElementById('user-query');
  if (queryInput) {
    queryInput.addEventListener('focus', () => {
      if (typeof TarotAudio !== 'undefined' && TarotAudio.init) TarotAudio.init();
    });
  }

  initFanDeck();
  initSlots();
  updateSubmitBtnState();
}

function selectSpread(count) {
  currentSpread = count;
  drawnCards = [];

  [1, 3, 5].forEach(num => {
    const btn = document.getElementById(`btn-spread-${num}`);
    if (btn) {
      if (num === count) {
        btn.classList.add('active');
        btn.style.background = 'var(--primary-purple)';
        btn.style.color = '#ffffff';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-main)';
      }
    }
  });

  document.getElementById('result-two-column-wrapper').style.display = 'none';
  document.getElementById('re-draw-btn-box').style.display = 'none';

  initFanDeck();
  initSlots();
  updateSubmitBtnState();
}

function handleQuerySubmit() {
  const queryInput = document.getElementById('user-query');
  const userText = queryInput ? queryInput.value.trim() : '';

  if (!userText) {
    const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
    const dict = (typeof I18N_DICT !== 'undefined') ? I18N_DICT : {};
    const t = dict[langKey] || {};
    showToast(t.placeholder || '⚠️ 請先選擇或輸入問題！');
    if (queryInput) queryInput.focus();
    return;
  }

  document.getElementById('setup-action-box').style.display = 'none';
  unlockStep2();
}

function unlockStep2() {
  const fanDeckWrapper = document.getElementById('fan-deck-stage-wrapper');
  const slotsGrid = document.getElementById('slots-grid');
  const divBox = document.getElementById('start-divination-btn-box');

  [fanDeckWrapper, slotsGrid, divBox].forEach(el => {
    if (el) {
      el.style.display = 'block';
      el.classList.remove('step-section-hidden');
      el.classList.add('step-section-visible');
    }
  });

  if (slotsGrid) slotsGrid.style.display = 'flex';

  initFanDeck();
  initSlots();
  updateSubmitBtnState();
}

function updateSubmitBtnState() {
  const submitBtn = document.getElementById('btn-submit-divination');
  if (!submitBtn) return;

  const validDrawnCount = drawnCards.filter(c => c != null).length;
  const remaining = currentSpread - validDrawnCount;

  const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
  const dict = (typeof I18N_DICT !== 'undefined') ? I18N_DICT : {};
  const t = dict[langKey] || {};

  if (remaining > 0) {
    submitBtn.className = 'btn-gold btn-gold-disabled';
    submitBtn.disabled = true;
    const template = t.needMore || '🔮 請先點擊卡牌抽牌 (還差 {x} 張)';
    submitBtn.innerText = template.replace('{x}', remaining);
  } else {
    submitBtn.className = 'btn-gold btn-gold-ready';
    submitBtn.disabled = false;
    submitBtn.innerText = t.readyText || '🔮 牌陣已就緒！點擊開啟 SITAROT 超級解讀';
  }
}

function fillQuestion(type) {
  const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
  const dict = (typeof I18N_DICT !== 'undefined') ? I18N_DICT : {};
  const t = dict[langKey] || {};
  const map = { 
    love: t.tagLove || '💕 感情心態', 
    career: t.tagCareer || '💼 職涯抉擇', 
    fortune: t.tagFortune || '🪙 財運分析', 
    universe: t.tagUniverse || '✨ 宇宙指引' 
  };
  const input = document.getElementById('user-query');
  if (input) input.value = map[type] || '';
}

function showToast(msg) {
  const box = document.getElementById('toast-banner-box');
  if (!box) return;  
  box.innerText = msg;
  box.style.display = 'block';

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { box.style.display = 'none'; }, 3500);
}

function resetToHome() {
  drawnCards = [];
  const queryInput = document.getElementById('user-query');
  if (queryInput) queryInput.value = '';
  
  const setupArea = document.getElementById('interactive-setup-area');
  const setupAction = document.getElementById('setup-action-box');
  if (setupArea) setupArea.style.display = 'block';
  if (setupAction) setupAction.style.display = 'block';
  
  const fanStage = document.getElementById('fan-deck-stage-wrapper');
  const slotsGrid = document.getElementById('slots-grid');
  const startDivBox = document.getElementById('start-divination-btn-box');
  const reDrawBox = document.getElementById('re-draw-btn-box');
  const blessingNotice = document.getElementById('ritual-blessing-notice');
  const resultWrapper = document.getElementById('result-two-column-wrapper');

  if (fanStage) fanStage.style.setProperty('display', 'none', 'important');
  if (slotsGrid) slotsGrid.style.setProperty('display', 'none', 'important');
  if (startDivBox) startDivBox.style.setProperty('display', 'none', 'important');
  if (reDrawBox) reDrawBox.style.setProperty('display', 'none', 'important');
  if (blessingNotice) blessingNotice.style.setProperty('display', 'none', 'important');
  if (resultWrapper) resultWrapper.style.setProperty('display', 'none', 'important');
  
  initFanDeck();
  initSlots();
  updateSubmitBtnState();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initFanDeck() {
  const wrapper = document.getElementById('fan-deck-wrapper');
  const stageWrapper = document.getElementById('fan-deck-stage-wrapper');
  if (!wrapper || !stageWrapper) return;

  wrapper.style.display = 'flex';
  wrapper.innerHTML = '';
  
  currentDeckPool = typeof TAROT_CARDS_DB !== 'undefined' ? [...TAROT_CARDS_DB].sort(() => Math.random() - 0.5) : [];

  const displayCards = 22;
  const cardBackSvg = typeof getCosmicDeckBackSvg === 'function' ? getCosmicDeckBackSvg() : '';

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
  for (let i = 0; i < currentSpread; i++) {
    const slot = document.createElement('div');
    slot.id = `slot-${i + 1}`;
    slot.className = 'slot-box';
    slot.onclick = () => removeCardFromSlot(i);
    slot.innerHTML = `<span style="font-size:0.8rem; color:var(--text-sub); font-weight:bold;">Card ${i + 1}</span>`;
    grid.appendChild(slot);
  }
}

function updateStatusNotice() {
  const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
  const dict = (typeof I18N_DICT !== 'undefined') ? I18N_DICT : {};
  const t = dict[langKey] || {};
  
  const validDrawnCount = drawnCards.filter(c => c != null).length;
  const left = currentSpread - validDrawnCount;
  const status = document.getElementById('tarot-hint-status');
  if (!status) return;

  if (left > 0) {
    status.innerText = `${t.drawHint || '請點擊卡牌抽牌'} (${left})`;
  } else {
    status.innerText = t.cardsDrawn || '牌陣已完成！點擊下方按鈕開始解讀';
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

  const randomCard = currentDeckPool.pop() || (typeof TAROT_CARDS_DB !== 'undefined' ? TAROT_CARDS_DB[0] : { nameZh: "愚者", nameEn: "The Fool" });
  const isReversed = Math.random() < 0.25;
  const cardData = { ...randomCard, isReversed, sourceCardId: cardEl.id };

  drawnCards[fillIdx] = cardData;

  cardEl.style.opacity = '0';
  cardEl.style.pointerEvents = 'none';

  const targetSlot = document.getElementById(`slot-${fillIdx + 1}`);
  if (targetSlot) {
    targetSlot.classList.add('active');
    if (typeof renderHiddenCardHtml === 'function') {
      targetSlot.innerHTML = renderHiddenCardHtml(fillIdx);
    }
  }

  updateStatusNotice();
  updateSubmitBtnState();
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
  updateSubmitBtnState();
}

function startTarotDivination() {
  const queryInput = document.getElementById('user-query');
  const userText = queryInput ? queryInput.value.trim() : '';

  if (!userText) {
    showToast('⚠️ 請先輸入您的困惑！');
    if (queryInput) queryInput.focus();
    return;
  }

  const validCards = drawnCards.filter(c => c != null);
  if (validCards.length < currentSpread) {
    showToast(`✨ 還需要抽取卡牌！`);
    return;
  }

  if (typeof TarotAudio !== 'undefined' && TarotAudio.playChime) TarotAudio.playChime();

  const setupArea = document.getElementById('interactive-setup-area');
  const fanStage = document.getElementById('fan-deck-stage-wrapper');
  const slotsGrid = document.getElementById('slots-grid');
  const divinationBox = document.getElementById('start-divination-btn-box');

  if (setupArea) setupArea.style.setProperty('display', 'none', 'important');
  if (fanStage) fanStage.style.setProperty('display', 'none', 'important');
  if (slotsGrid) slotsGrid.style.setProperty('display', 'none', 'important');
  if (divinationBox) divinationBox.style.setProperty('display', 'none', 'important');
  
  generateAIReading();
}

// 🌟 核心修復：高質感卡牌畫面繪製 (顯現牌名、序號、正逆位標籤與星空質感)
function generateAIReading() {
  document.getElementById('re-draw-btn-box').style.display = 'block';
  const resultGrid = document.getElementById('result-two-column-wrapper');
  if (resultGrid) resultGrid.style.display = 'grid';

  const userQuery = document.getElementById('user-query').value.trim() || '通用運勢指引';
  const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
  const validCards = drawnCards.filter(c => c != null);

  const leftSlotsBox = document.getElementById('result-left-slots');
  if (leftSlotsBox) {
    leftSlotsBox.innerHTML = validCards.map((c, i) => {
      const cardName = c.nameZh || c.nameEn || "塔羅牌";
      const isRev = c.isReversed;
      const statusText = isRev ? "逆位 🌙" : "正位 ☀️";
      const statusColor = isRev ? "#f43f5e" : "#10b981";
      const transformCss = isRev ? "transform: rotate(180deg);" : "";

      return `
        <div class="result-card-item" style="display: flex; flex-direction: column; align-items: center; margin-bottom: 0.8rem;">
          <div style="width: 72px; height: 115px; background: linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%); border: 1.5px solid #f59e0b; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between; padding: 0.4rem; box-sizing: border-box; position: relative; overflow: hidden;">
            <div style="font-size: 0.65rem; color: #a855f7; font-weight: bold; text-align: left;">${i + 1}</div>
            
            <div style="text-align: center; ${transformCss} transition: transform 0.3s ease;">
              <div style="font-size: 1.2rem; margin-bottom: 0.2rem;">✨</div>
              <div style="font-size: 0.72rem; color: #fef08a; font-weight: bold; line-height: 1.2;">${cardName}</div>
            </div>

            <div style="font-size: 0.58rem; color: ${statusColor}; font-weight: bold; text-align: center; background: rgba(0,0,0,0.4); border-radius: 4px; padding: 1px 0;">
              ${statusText}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof AIReaderEngine !== 'undefined' && typeof AIReaderEngine.requestReading === 'function') {
    AIReaderEngine.requestReading(validCards, userQuery, currentSpread, langKey, 'typewriter-text');
  } else if (typeof fallbackDirectReading === 'function') {
    fallbackDirectReading(validCards, userQuery, currentSpread, 'typewriter-text');
  }

  setTimeout(() => {
    if (resultGrid) {
      const headerOffset = 90;
      const elementPosition = resultGrid.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  }, 50);
}

// 🌟 社群分享卡片生成
function generateShareCard() {
  const modal = document.getElementById('share-card-modal');
  const queryEl = document.getElementById('share-card-query');
  const cardsEl = document.getElementById('share-card-cards');
  const quoteEl = document.getElementById('share-card-quote');

  const queryText = document.getElementById('user-query').value.trim() || '通用運勢指引';
  const validCards = drawnCards.filter(c => c != null);

  if (queryEl) queryEl.innerText = `問：「${queryText}」`;
  
  if (cardsEl) {
    cardsEl.innerHTML = validCards.map(c => `
      <div style="background: rgba(255,255,255,0.1); border: 1px solid #f59e0b; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.78rem;">
        ${c.nameZh || c.nameEn} (${c.isReversed ? '逆位' : '正位'})
      </div>
    `).join('');
  }

  if (quoteEl) {
    const mainQuotes = [
      "「答案早已在你心中，允許迷霧存在，光自然會透進來。」",
      "「當你不再被恐懼牽著走，局勢的解答早已悄然浮現。」",
      "「接納當下的能量脈絡，你永遠握有重塑命運的主導權。」"
    ];
    quoteEl.innerText = mainQuotes[Math.floor(Math.random() * mainQuotes.length)];
  }

  if (modal) modal.style.display = 'flex';
}

function closeShareModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('share-card-modal');
  if (modal) modal.style.display = 'none';
}

function saveToTarotJournal() {
  const query = document.getElementById('user-query').value.trim();
  const readingText = document.getElementById('typewriter-text').innerText;
  
  if (!readingText) return;

  const journalItem = {
    id: Date.now(),
    date: new Date().toLocaleDateString('zh-TW'),
    query: query,
    cards: drawnCards.map(c => ({ name: c.nameZh || c.nameEn, reversed: c.isReversed }))
  };

  const history = JSON.parse(localStorage.getItem('sitarot_journal') || '[]');
  history.unshift(journalItem);
  localStorage.setItem('sitarot_journal', JSON.stringify(history));

  const dict = typeof I18N_DICT !== 'undefined' ? I18N_DICT : {};
  const langKey = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
  const t = dict[langKey] || {};
  showToast(t.btnSave || '✨ 已保存至日誌！');
}

function switchWikiTab(tabName) {
  ['articles', 'cards', 'questions', 'combinations', 'spreads'].forEach(name => {
    const btn = document.getElementById(`tab-btn-${name}`);
    const content = document.getElementById(`wiki-tab-${name}`);
    if (btn && content) {
      btn.classList.toggle('active', name === tabName);
      content.style.display = name === tabName ? 'block' : 'none';
    }
  });
}

function openPolicyModal(type) {
  const modal = document.getElementById('policy-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');

  if (!modal || !title || !content) return;

  if (type === 'privacy') {
    title.innerText = '隱私政策 (Privacy Policy)';
    content.innerHTML = `
      <p>SITAROT 非常重視您的個人隱私。本政策說明我們如何處理資訊：</p>
      <h4 style="margin-top:0.8rem; color:#f59e0b;">1. 資訊收集與 Cookie</h4>
      <p>我們使用 Cookie 來記住您的偏好設定（如主題與大字體）。第三廠商（包括 Google）會使用 Cookie 根據您先前造訪我們或其他網站的紀錄來投放廣告。</p>
      <h4 style="margin-top:0.8rem; color:#f59e0b;">2. Google AdSense 廣告聲明</h4>
      <p>Google 使用廣告 Cookie，因此其與合作夥伴能根據使用者對本站及/或網網際網路上其他網站的造訪紀錄，向使用者投放廣告。您可造訪 <a href="https://adssettings.google.com" target="_blank" style="color:#a855f7;">廣告設定</a> 來停用個人化廣告。</p>
      <h4 style="margin-top:0.8rem; color:#f59e0b;">3. 塔羅占卜紀錄</h4>
      <p>您的占卜問題與保存的「靈魂日誌」僅儲存在您的本機瀏覽器（Local Storage）中，我們不會在伺服器收集您的私密對話。</p>
    `;
  } else {
    title.innerText = '服務條款 (Terms of Service)';
    content.innerHTML = `
      <p>歡迎使用 SITAROT：</p>
      <h4 style="margin-top:0.8rem; color:#f59e0b;">1. 服務性質說明</h4>
      <p>SITAROT 為心靈對話與靈感探索工具，解讀結果僅供心理投射與思考參考，不構成任何醫療、法律或財務上的專業建議。</p>
      <h4 style="margin-top:0.8rem; color:#f59e0b;">2. 智慧財產權</h4>
      <p>本網站之介面設計、牌陣演算法與專題文章版權均屬 SITAROT 所有。</p>
    `;
  }

  modal.style.display = 'flex';
}

function closePolicyModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('policy-modal');
  if (modal) modal.style.display = 'none';
}