/* ==========================================================================
   Astraea AI Tarot - 核心邏輯 (js/app.js)
   實現：自然彩帶弧形展牌 (Arc Ribbon Deck)、多牌完整解讀、牌陣坑位語意、自動置中、多語系、Wiki Tabs 與 URL 參數解析
   ========================================================================== */

let currentSpread = 1;
let drawnCards = [];
let currentDeckPool = [];
let toastTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  syncThemeState();
  
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = currentLang;

  applyLanguageUI();
  initFanDeck();
  initSlots();

  // 全能 URL 參數解析器 (?q=...&spread=...&card=...)
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const spreadParam = urlParams.get('spread');
  const cardParam = urlParams.get('card');

  if (qParam) {
    const queryInput = document.getElementById('user-query');
    if (queryInput) queryInput.value = decodeURIComponent(qParam);
  }

  if (spreadParam) {
    const count = parseInt(spreadParam, 10);
    if ([1, 3, 4, 5].includes(count)) selectSpread(count);
  }

  if (cardParam && typeof TAROT_CARDS_DB !== 'undefined') {
    const foundCard = TAROT_CARDS_DB.find(c => c.id === cardParam || c.number === parseInt(cardParam, 10));
    if (foundCard) {
      const queryInput = document.getElementById('user-query');
      if (queryInput && !queryInput.value) {
        const isZh = currentLang.startsWith('zh');
        queryInput.value = isZh ? `請幫我深度解讀【${foundCard.nameZh}】牌對我當前運勢的啟示` : `Deep interpretation for ${foundCard.nameEn}`;
      }
    }
  }

  window.addEventListener('resize', () => {
    initFanDeck();
  });
});

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
}

function fillQuestion(type) {
  const t = I18N_DICT[currentLang] || I18N_DICT['en'];
  const map = { love: t.tagLove, career: t.tagCareer, fortune: t.tagFortune, universe: t.tagUniverse };
  const input = document.getElementById('user-query');
  if (input) {
    input.value = map[type] || '';
    input.classList.remove('input-error-shake');
  }
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
  
  initFanDeck();
  initSlots();

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
}

function initFanDeck() {
  const wrapper = document.getElementById('fan-deck-wrapper');
  if (!wrapper) return;

  wrapper.style.display = 'flex';
  wrapper.innerHTML = '';
  
  currentDeckPool = [...TAROT_CARDS_DB].sort(() => Math.random() - 0.5);

  const screenWidth = window.innerWidth;
  const displayCards = 22;
  const cardBackSvg = getCosmicDeckBackSvg();

  const isMobile = screenWidth <= 600;
  const totalArcAngle = isMobile ? 42 : 54;
  const startAngle = -totalArcAngle / 2;
  const angleStep = totalArcAngle / (displayCards - 1);
  const cardOverlapX = isMobile ? 18 : 22;

  const midIdx = (displayCards - 1) / 2;

  for (let i = 0; i < displayCards; i++) {
    const angle = startAngle + i * angleStep;
    const offsetFromCenter = i - midIdx;
    
    const normOffset = offsetFromCenter / midIdx;
    const transY = Math.pow(normOffset, 2) * (isMobile ? 18 : 28);
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
    
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        drawCard(card);
      }
    };

    wrapper.appendChild(card);
  }

  updateStatusNotice();

  setTimeout(() => {
    const stageWrapper = document.getElementById('fan-deck-stage-wrapper');
    if (stageWrapper) {
      stageWrapper.scrollLeft = (stageWrapper.scrollWidth - stageWrapper.clientWidth) / 2;
    }
  }, 50);
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
        drawCard(cardEl, slotIndex);
      }
    };

    slot.onclick = () => removeCardFromSlot(slotIndex);
    slot.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        removeCardFromSlot(slotIndex);
      }
    };

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
}

function removeCardFromSlot(slotIdx) {
  const cardData = drawnCards[slotIdx];
  if (!cardData) return;

  if (typeof TarotAudio !== 'undefined' && TarotAudio.playDraw) {
    TarotAudio.playDraw();
  }

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
}

function startTarotDivination() {
  const queryInput = document.getElementById('user-query');
  const userText = queryInput ? queryInput.value.trim() : '';

  if (!userText) {
    queryInput.classList.add('input-error-shake');
    showToast(currentLang.startsWith('zh') ? '⚠️ 請先輸入您的困惑，或點擊下方推薦問題！' : '⚠️ Please type your query or select a topic above!');
    queryInput.focus();
    return;
  }
  queryInput.classList.remove('input-error-shake');

  const validDrawnCount = drawnCards.filter(c => c != null).length;
  const remaining = currentSpread - validDrawnCount;
  
  if (remaining > 0) {
    showToast(currentLang.startsWith('zh') ? `✨ 還需要抽取 ${remaining} 張牌，請憑直覺點擊卡牌！` : `✨ Please draw ${remaining} more card(s) above!`);
    const deckWrapper = document.getElementById('fan-deck-stage-wrapper');
    if (deckWrapper) {
      deckWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

// 🌟 靈性解讀核心：結合牌陣坑位語意與正逆位特別解析
function generateAIReading() {
  document.getElementById('interactive-setup-area').style.display = 'none';
  document.getElementById('slots-grid').style.display = 'none';
  
  document.getElementById('re-draw-btn-box').style.display = 'block';
  const resultGrid = document.getElementById('result-two-column-wrapper');
  if (resultGrid) resultGrid.style.display = 'grid';

  const userQuery = document.getElementById('user-query').value.trim() || '通用運勢指引';
  const isZh = currentLang.startsWith('zh');

  const validCards = drawnCards.filter(c => c != null);

  // 1. 渲染左側卡槽
  const leftSlotsBox = document.getElementById('result-left-slots');
  if (leftSlotsBox) {
    leftSlotsBox.innerHTML = validCards.map((c, i) => `
      <div class="slot-box active" style="width:70px; height:114px;">
        ${renderNativeCardHtml(c, c.isReversed, isZh, i)}
      </div>
    `).join('');
  }
  
  // 2. 匹配牌陣位置定義[cite: 12]
  const posNamesZh = {
    1: ['核心指引'],
    3: ['過去因果脈絡', '現在局勢狀態', '未來發展趨勢'],
    4: ['問題核心關鍵', '當前主要障礙', '行動建言對策', '手邊優勢資源'],
    5: ['當事人的核心狀態', '對選項A/對方的感情態度', '選項A現況/對方當前狀態', '對選項B/對方對我的態度', '最終演變發展結果']
  };

  const posNamesEn = {
    1: ['Core Guidance'],
    3: ['Past Context', 'Present Situation', 'Future Trend'],
    4: ['Core Issue', 'Main Obstacle', 'Action Advice', 'Available Resources'],
    5: ['Your Current State', 'Attitude Towards A/Partner', 'Option A / Partner State', 'Attitude Towards B/Partner View', 'Potential Outcome']
  };

  const currentPosList = (isZh ? posNamesZh[validCards.length] : posNamesEn[validCards.length]) || [];

  // 3. 渲染左側詳細清單
  const summaryHtml = `
    <div class="cards-detail-list">
      ${validCards.map((c, i) => `
        <div class="card-detail-item">
          <span style="background:#7e22ce; color:#fff; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:bold; flex-shrink:0;">${i + 1}</span>
          <div>
            <div style="font-size:0.72rem; color:var(--text-sub); font-weight:bold;">${currentPosList[i] || `位置 ${i + 1}`}</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">
              ${isZh ? c.nameZh : c.nameEn}
              <span style="font-size:0.7rem; color:${c.isReversed ? '#ef4444' : '#10b981'}; margin-left:4px;">
                ${c.isReversed ? (isZh ? '逆位' : 'Rev') : (isZh ? '正位' : 'Up')}
              </span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('cards-summary').innerHTML = summaryHtml;

  // 4. 動態生成全張數詳細解讀[cite: 12]
  let readingText = "";

  if (isZh) {
    readingText = `親愛的心靈探索者，針對您請示的問題：「${userQuery}」，宇宙能量已透過 ${validCards.length} 張牌陣為您對照內心真實景象[cite: 12]：\n\n`;
    
    validCards.forEach((c, idx) => {
      const posName = currentPosList[idx] || `位置 ${idx + 1}`;
      const statusText = c.isReversed ? '逆位' : '正位';
      
      // 智慧特別解析[cite: 12]
      let specialNotice = "";
      if (posName.includes('障礙') && !c.isReversed) {
        specialNotice = "（注意：正位好牌出現在障礙位，提示需防範過度樂觀、盲目自信或沉迷舒適圈[cite: 12]）";
      } else if (posName.includes('對策') && c.isReversed) {
        specialNotice = "（建言：逆位提示暫時不宜強攻，需先調整內在心態，化解潛在的思維死角[cite: 12]）";
      }

      const meaning = c.isReversed 
        ? (c.reversedZh || '當前能量有所受阻，提醒您先收斂衝動，靜心檢視內在盲點。') 
        : (c.uprightZh || '能量順暢流動，請展現自信與清晰的行動力。');
      
      readingText += `📍【${posName}】${c.nameZh}（${statusText}）${specialNotice}\n👉 指引：${meaning}\n\n`;
    });

    readingText += `✨ 【靈性大師綜合啟示】\n本牌陣以【${validCards[0].nameZh}】為核心起手，照出您當前局勢的真相[cite: 12]。正如牌卡是一面鏡子，它映射出您內心深處最真實的渴望與焦慮[cite: 12]。未來並非定數，只要您當下的心態有一咪咪微小的改變，能量場就會跟著轉動，創造出您所期望的未來[cite: 12]！`;
  } else {
    readingText = `Greetings, Seeker. Regarding your query: "${userQuery}", the cards reflect your inner truth through this ${validCards.length}-card spread:\n\n`;
    
    validCards.forEach((c, idx) => {
      const posName = currentPosList[idx] || `Position ${idx + 1}`;
      const statusText = c.isReversed ? 'Reversed' : 'Upright';
      const meaning = c.isReversed 
        ? (c.reversedEn || 'Energy is currently blocked. Take a moment for inner reflection.') 
        : (c.uprightEn || 'Energy flows freely. Proceed with clarity and confidence.');
      
      readingText += `📍 [${posName}] ${c.nameEn} (${statusText})\n👉 Guidance: ${meaning}\n\n`;
    });

    readingText += `✨ [Master Synthesis]\nLed by ${validCards[0].nameEn}, this spread mirrors your current state. Remember, tarot reflects present energy—shifting your mindset today transforms your destiny tomorrow!`;
  }

  typewriterEffect('typewriter-text', readingText, 18);

  setTimeout(() => {
    if (resultGrid) resultGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
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
  const tabs = ['cards', 'questions', 'combinations', 'spreads'];
  
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