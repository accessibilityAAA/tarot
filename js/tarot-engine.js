/* ==========================================================================
   3D 扇形展牌與物理抽牌引擎 (js/tarot-engine.js)
   ========================================================================== */

let currentSpreadCount = 1; // 1張, 3張, 5張牌陣
let userSelectedCards = [];

// 1. 初始化 3D 弧形牌堆
function render3DFanDeck() {
  const container = document.getElementById('fan-deck-wrapper');
  if (!container) return;

  container.style.display = 'flex';
  container.innerHTML = '';
  
  const totalDisplayCards = 21; // 展現 21 張視覺牌卡
  for (let i = 0; i < totalDisplayCards; i++) {
    const rot = (i - 10) * 3.8; // 計算 3D 角度
    const transX = (i - 10) * 11;
    
    const card = document.createElement('div');
    card.className = 'fan-card';
    card.style.transform = `translateX(${transX}px) rotate(${rot}deg)`;
    card.style.zIndex = i;
    card.onclick = () => handleCardClick(card);
    container.appendChild(card);
  }

  updateSpreadStatusNotice();
}

// 2. 初始化空槽位 (Slots)
function renderSlotBoxes() {
  const grid = document.getElementById('tarot-slots-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  for (let i = 1; i <= currentSpreadCount; i++) {
    const slot = document.createElement('div');
    slot.id = `slot-card-${i}`;
    slot.className = 'slot-box active:scale-95';
    slot.innerHTML = `<span class="text-xs text-purple-400/60 font-bold">Slot ${i}</span>`;
    grid.appendChild(slot);
  }
}

// 3. 切換牌陣模式 (1張/3張/5張)
function changeSpreadMode(count) {
  currentSpreadCount = count;
  userSelectedCards = [];

  // 隱藏 AI 讀牌區
  const aiOutput = document.getElementById('ai-reading-output');
  if (aiOutput) aiOutput.classList.add('hidden');

  render3DFanDeck();
  renderSlotBoxes();
}

// 4. 點擊抽牌邏輯
function handleCardClick(cardEl) {
  if (userSelectedCards.length >= currentSpreadCount) return;

  // 播放洗牌音效
  if (typeof playSoundEffect === 'function') {
    playSoundEffect('draw');
  }

  // 隨機選擇一張卡牌並決定正逆位 (25% 機率逆位)
  const randomCard = TAROT_CARDS_DB[Math.floor(Math.random() * TAROT_CARDS_DB.length)];
  const isReversed = Math.random() < 0.25;

  userSelectedCards.push({ ...randomCard, isReversed });

  // 淡出被抽取的牌卡
  cardEl.style.opacity = '0';
  cardEl.style.pointerEvents = 'none';

  // 將牌卡填入對應 Slot 並執行 3D 翻牌動畫
  const targetSlot = document.getElementById(`slot-card-${userSelectedCards.length}`);
  if (targetSlot) {
    targetSlot.classList.add('active');
    targetSlot.innerHTML = `
      <div class="flip-card-inner flipped">
        <img src="${randomCard.img}" 
             class="card-front ${isReversed ? 'card-reversed' : ''}" 
             alt="${randomCard.nameEn}">
      </div>
    `;
  }

  updateSpreadStatusNotice();

  // 抽滿後自動觸發 AI 解牌
  if (userSelectedCards.length === currentSpreadCount) {
    document.getElementById('fan-deck-wrapper').style.display = 'none';
    setTimeout(() => {
      if (typeof triggerAITarotReading === 'function') {
        triggerAITarotReading(userSelectedCards);
      }
    }, 500);
  }
}

function updateSpreadStatusNotice() {
  const status = document.getElementById('tarot-hint-status');
  if (!status) return;

  const left = currentSpreadCount - userSelectedCards.length;
  if (left > 0) {
    status.innerText = `Select ${left} more card(s) from the deck above`;
  } else {
    status.innerText = `✨ Cards selected! Generating AI Insights...`;
  }
}