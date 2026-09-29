/* ==========================================================================
   Astraea AI Tarot - 主控邏輯 (js/app.js)
   ========================================================================== */

let currentSpread = 1; // 全功能開放：1張、3張、5張自由切換
let drawnCards = [];

document.addEventListener('DOMContentLoaded', () => {
  syncThemeState();
  applyLanguageUI();
  initFanDeck();
  initSlots();
});

// 1. 白天/深色護眼主題切換邏輯
function toggleDarkMode() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('tarot_theme', isLight ? 'light' : 'dark');
  updateThemeBtn();
}

function syncThemeState() {
  const saved = localStorage.getItem('tarot_theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
  }
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (btn) {
    const isLight = document.body.classList.contains('light-mode');
    const t = I18N_DICT[currentLang];
    btn.innerText = isLight ? t.btnThemeDark : t.btnThemeLight;
  }
}

function toggleLargeFont() {
  document.body.classList.toggle('large-mode');
}

// 2. 切換多語系
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tarot_lang', lang);
  applyLanguageUI();
}

function applyLanguageUI() {
  const t = I18N_DICT[currentLang];
  document.getElementById('brand-title').innerText = t.brandTitle;
  document.getElementById('user-query').placeholder = t.placeholder;
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
  const t = I18N_DICT[currentLang];
  const map = { love: t.tagLove, career: t.tagCareer, fortune: t.tagFortune, universe: t.tagUniverse };
  document.getElementById('user-query').value = map[type] || '';
}

// 3. 牌陣切換 (1, 3, 5全開放)
function selectSpread(count) {
  currentSpread = count;
  drawnCards = [];
  
  [1, 3, 5].forEach(num => {
    const btn = document.getElementById(`btn-spread-${num}`);
    if (btn) {
      btn.style.background = (num === count) ? 'var(--primary-purple)' : 'transparent';
      btn.style.color = (num === count) ? '#ffffff' : 'var(--text-main)';
    }
  });

  document.getElementById('ai-reading-output').style.display = 'none';
  initFanDeck();
  initSlots();
}

function initFanDeck() {
  const wrapper = document.getElementById('fan-deck-wrapper');
  if (!wrapper) return;

  wrapper.style.display = 'flex';
  wrapper.innerHTML = '';
  
  const totalCards = 19;
  for (let i = 0; i < totalCards; i++) {
    const rot = (i - 9) * 4;
    const transX = (i - 9) * 11;
    const card = document.createElement('div');
    card.className = 'fan-card';
    card.style.transform = `translateX(${transX}px) rotate(${rot}deg)`;
    card.style.zIndex = i;
    card.onclick = () => drawCard(card);
    wrapper.appendChild(card);
  }

  updateStatusNotice();
}

function initSlots() {
  const grid = document.getElementById('slots-grid');
  if (!grid) return;

  grid.innerHTML = '';
  for (let i = 1; i <= currentSpread; i++) {
    const slot = document.createElement('div');
    slot.id = `slot-${i}`;
    slot.className = 'slot-box';
    slot.innerHTML = `<span style="font-size:0.75rem; color:var(--text-sub); font-weight:bold;">${i}</span>`;
    grid.appendChild(slot);
  }
}

function updateStatusNotice() {
  const t = I18N_DICT[currentLang];
  const left = currentSpread - drawnCards.length;
  const status = document.getElementById('tarot-hint-status');
  if (!status) return;

  if (left > 0) {
    status.innerText = `${t.drawHint} (${left})`;
  } else {
    status.innerText = t.cardsDrawn;
  }
}

function drawCard(cardEl) {
  if (drawnCards.length >= currentSpread) return;

  playSound('draw');

  const randomCard = TAROT_CARDS_DB[Math.floor(Math.random() * TAROT_CARDS_DB.length)];
  const isReversed = Math.random() < 0.25;
  drawnCards.push({ ...randomCard, isReversed });

  cardEl.style.opacity = '0';
  cardEl.style.pointerEvents = 'none';

  const slot = document.getElementById(`slot-${drawnCards.length}`);
  if (slot) {
    slot.classList.add('active');
    slot.innerHTML = `
      <img src="${randomCard.img}" class="card-img ${isReversed ? 'card-reversed' : ''}" alt="${randomCard.nameEn}">
    `;
  }

  updateStatusNotice();

  if (drawnCards.length === currentSpread) {
    document.getElementById('fan-deck-wrapper').style.display = 'none';
    setTimeout(generateAIReading, 500);
  }
}

// 4. 打字機串流解牌效果
function generateAIReading() {
  playSound('win');

  const output = document.getElementById('ai-reading-output');
  const streamText = document.getElementById('typewriter-text');
  const userQuery = document.getElementById('user-query').value.trim() || 'General Life Path';
  const t = I18N_DICT[currentLang];

  output.style.display = 'block';

  const isZh = currentLang.startsWith('zh');
  const summaryHtml = drawnCards.map((c, i) => `
    <div style="font-size:0.85rem; background:rgba(0,0,0,0.1); padding:0.4rem; border-radius:0.4rem; margin-bottom:0.3rem;">
      <strong>${isZh ? '位置' : 'Card'} ${i + 1}：</strong> ${isZh ? c.nameZh : c.nameEn} 
      <span style="color:${c.isReversed ? '#ef4444' : '#059669'}; font-weight:bold;">
        【${c.isReversed ? (isZh ? '逆位' : 'Reversed') : (isZh ? '正位' : 'Upright')}】
      </span>
    </div>
  `).join('');

  document.getElementById('cards-summary').innerHTML = summaryHtml;

  const readingText = isZh 
    ? `親愛的心靈探索者，針對您的提問「${userQuery}」，宇宙能量正透過牌陣為您傳遞指引。\n\n起手牌【${drawnCards[0].nameZh}】(${drawnCards[0].isReversed ? '逆位' : '正位'}) 顯示了您目前心境的轉折。請放下過度的焦慮與內耗，保持靈活的心態順應改變，屬於您的幸運隨後就會明朗！`
    : `Greetings, Seeker. Regarding your query: "${userQuery}", the cosmic energy offers profound clarity.\n\nThe leading card, ${drawnCards[0].nameEn} (${drawnCards[0].isReversed ? 'Reversed' : 'Upright'}), indicates a key pivot in your energy. Release doubts and align with your true purpose. Answers are already unfolding around you.`;

  typewriterEffect('typewriter-text', readingText, 25);
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