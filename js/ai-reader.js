/* ==========================================================================
   AI Tarot Reader with Streaming Effect (js/ai-reader.js)
   ========================================================================== */

function triggerAITarotReading(cards) {
  const outputBox = document.getElementById('ai-reading-output');
  const streamTarget = document.getElementById('ai-stream-text');
  const userQuery = document.getElementById('user-query').value.trim() || 'General Life Path & Future';

  if (!outputBox || !streamTarget) return;

  if (typeof playSoundEffect === 'function') {
    playSoundEffect('reveal');
  }

  outputBox.classList.remove('hidden');

  // 生成卡牌資訊列
  const cardSummaryHtml = cards.map((c, i) => `
    <div class="text-xs bg-purple-900/40 p-2 rounded-lg border border-purple-800/40 my-1">
      <strong>Card ${i + 1}:</strong> ${c.nameEn} 
      <span class="${c.isReversed ? 'text-red-400' : 'text-emerald-400'} font-bold">
        [${c.isReversed ? 'Reversed' : 'Upright'}]
      </span>
      <p class="text-purple-300/70 text-xs mt-0.5">${c.isReversed ? c.reversedEn : c.uprightEn}</p>
    </div>
  `).join('');

  const fullAnalysisText = `
    Greetings, Seekers of Truth. I am Astraea, listening to the echoes of the Universe.
    
    Regarding your query: "${userQuery}", the cosmos has laid out a profound message.
    
    The energy of ${cards[0].nameEn} (${cards[0].isReversed ? 'Reversed' : 'Upright'}) indicates that you are entering a pivotal phase of spiritual growth. Do not let doubts cloud your judgment. Align your intentions, release inner resistance, and trust that the answers you seek are already unfolding around you.
  `;

  streamTarget.innerHTML = `
    <div class="mb-3">${cardSummaryHtml}</div>
    <div id="typewriter-content" class="text-purple-100 text-sm leading-relaxed space-y-2"></div>
  `;

  // 打字機效果漸進顯示
  typewriterEffect('typewriter-content', fullAnalysisText, 25);
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