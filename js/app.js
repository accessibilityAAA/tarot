/* ==========================================================================
   Astraea AI Tarot - 雙向退牌 ✕ Modal彈窗條款 ✕ 多語系 (js/app.js)
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
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tarot_lang', lang);
  
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = lang;
  }

  applyLanguageUI();
}

function applyLanguageUI() {
  const t = I18N_DICT[currentLang] || I18N_DICT['en'];
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

  const displayCards = 22;
  const cardBackSvg = getCosmicDeckBackSvg();

  for (let i = 0; i < displayCards; i++) {
    const rot = (i - 10.5) * 2.6;
    const transX = (i - 10.5) * 18;

    const card = document.createElement('div');
    card.className = 'fan-card';
    card.id = `fan-card-${i}`;
    
    const baseTransform = `translateX(${transX}px) rotate(${rot}deg)`;
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

    card.ondragend = () => {
      card.style.opacity = '1';
    };

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
      const transY = Math.abs(offset) * 5;
      slot.style.transform = `translateY(${transY}px) rotate(${rot}deg)`;
    } else {
      slot.style.transform = 'none';
    }

    slot.ondragover = (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    };

    slot.ondragleave = () => {
      slot.classList.remove('drag-over');
    };

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

    slot.innerHTML = `<span style="font-size:0.82rem; color:var(--text-sub); font-weight:bold;">Card ${i + 1}</span>`;
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

  if (typeof playSound === 'function') {
    playSound('draw');
  }

  const randomCard = currentDeckPool.pop();
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

  if (typeof playSound === 'function') {
    playSound('draw');
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
    slotEl.innerHTML = `<span style="font-size:0.82rem; color:var(--text-sub); font-weight:bold;">Card ${slotIdx + 1}</span>`;
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

  if (typeof playSound === 'function') {
    playSound('win');
  }

  document.getElementById('start-divination-btn-box').style.display = 'none';
  document.getElementById('fan-deck-stage-wrapper').style.display = 'none';
  
  const blessingNotice = document.getElementById('ritual-blessing-notice');
  blessingNotice.style.display = 'block';

  setTimeout(() => {
    blessingNotice.style.display = 'none';
    generateAIReading();
  }, 1200);
}

function generateAIReading() {
  document.getElementById('interactive-setup-area').style.display = 'none';
  document.getElementById('slots-grid').style.display = 'none';
  
  document.getElementById('re-draw-btn-box').style.display = 'block';
  const resultGrid = document.getElementById('result-two-column-wrapper');
  resultGrid.style.display = 'grid';

  const userQuery = document.getElementById('user-query').value.trim() || 'General Life Path';
  const isZh = currentLang.startsWith('zh');

  const validCards = drawnCards.filter(c => c != null);

  const leftSlotsBox = document.getElementById('result-left-slots');
  leftSlotsBox.innerHTML = validCards.map((c, i) => `
    <div class="slot-box active" style="width:75px; height:120px;">
      ${renderNativeCardHtml(c, c.isReversed, isZh, i)}
    </div>
  `).join('');
  
  const summaryHtml = `
    <div class="cards-detail-list">
      ${validCards.map((c, i) => `
        <div class="card-detail-item">
          <span style="background:#7e22ce; color:#fff; width:20px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:bold; flex-shrink:0;">${i + 1}</span>
          <div>
            <div style="font-size:0.78rem; color:var(--text-sub); font-weight:bold;">${isZh ? `位置 ${i + 1} 的指引` : `Position ${i + 1}`}</div>
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

  const readingText = isZh 
    ? `親愛的心靈探索者，針對您的提問「${userQuery}」，宇宙能量正透過牌陣傳遞指引：\n\n起手牌【${validCards[0].nameZh}】(${validCards[0].isReversed ? '逆位' : '正位'}) 顯示了您目前心境的轉折：${validCards[0].isReversed ? validCards[0].reversedZh : validCards[0].uprightZh}\n\n請放下過度的焦慮與內耗，保持靈活的心態順應改變，屬於您的幸運隨後就會明朗！`
    : `Greetings, Seeker. Regarding your query: "${userQuery}", the cosmic energy offers profound clarity.\n\nThe leading card, ${validCards[0].nameEn} (${validCards[0].isReversed ? 'Reversed' : 'Upright'}), indicates: ${validCards[0].isReversed ? validCards[0].reversedEn : validCards[0].uprightEn}\n\nRelease doubts and align with your true purpose. Answers are already unfolding around you.`;

  typewriterEffect('typewriter-text', readingText, 25);

  setTimeout(() => {
    resultGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// 🌟 彈出式 Modal 視窗控制邏輯 (隱私政策 / 服務條款 / 退款政策)
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
      textZh: '我們高度重視您的個人隱私。本占卜應用為匿名娛樂與心靈探索工具，不會未經允許收集您的個人身分資料。您輸入的提問與抽取之卡牌紀錄僅會用於即時 AI 解讀計算，不會對外販售或公開。',
      textEn: 'We strictly protect your privacy. This application is designed for personalized spiritual exploration and entertainment. We do not sell or transmit your personal query data to third parties.'
    },
    terms: {
      titleZh: '📜 服務條款 Terms of Service',
      titleEn: '📜 Terms of Service',
      textZh: '歡迎使用 Astraea AI 塔羅占卜服務。本系統所提供之解牌內容係基於象徵學與 AI 語意分析生成之指引，僅供心靈啟發與娛樂參考，不可替代專業醫療、法律、財務或心理諮商之建議。',
      textEn: 'By using Astraea AI Tarot, you agree that readings provided are for inspiration and entertainment purposes only, and should not replace professional legal, financial, or medical advice.'
    },
    refund: {
      titleZh: '🪙 退款政策 Refund Policy',
      titleEn: '🪙 Refund Policy',
      textZh: '本網站目前提供免費算牌服務。若未來推出高級會員訂閱或深度付費諮詢，您可以在購買後 7 天內申請全額退款（需尚未解鎖超過 3 次深度專屬牌陣）。',
      textEn: 'Free readings are completely open to all users. Premium membership features qualify for a 7-day full refund if less than 3 deep reading reports have been unlocked.'
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