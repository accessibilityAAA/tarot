/* ==========================================================================
   SITAROT - 靈動故事解讀引擎 (js/ai-reader.js)
   完全移除任何網路連線與非同步 API，100% 本地同步直出，絕不空白卡死！
   ========================================================================== */

const AIReaderEngine = (function () {
  function clearChatHistory() {}

  // 點擊開啟解讀的核心進入點
  function requestReading(cards, query, spreadCount, lang, outputTextId) {
    const outputEl = document.getElementById(outputTextId);
    if (!outputEl) return;

    if (typeof TarotAudio !== "undefined" && TarotAudio.playChime) {
      TarotAudio.playChime();
    }

    // 🌟 完全純同步寫入 DOM，0 秒響應、零網路失敗風險！
    fallbackDirectReading(cards, query, spreadCount, outputTextId);
  }

  return {
    requestReading: requestReading,
    clearChatHistory: clearChatHistory
  };
})();

// 本地深層故事解讀生成器
function fallbackDirectReading(cards, query, spreadCount, outputTextId) {
  const outputEl = document.getElementById(outputTextId);
  if (!outputEl) return;

  const validCards = (cards && cards.length) ? cards : [];
  const count = validCards.length || spreadCount || 1;

  // 1. 抓取牌陣各坑位名稱
  const roleNames = (typeof TAROT_MATRIX_DB !== 'undefined' && TAROT_MATRIX_DB.spreadPositions)
    ? (TAROT_MATRIX_DB.spreadPositions[count] || TAROT_MATRIX_DB.spreadPositions[1])
    : {
        1: ["當前核心指引"],
        3: ["過去的根源與因果", "現在的局勢與迷霧", "未來的突破與演變"],
        5: ["你的內在心態", "對方的真實心態", "當前的溝通障礙", "建議採取的策略", "最終演變結果"]
      }[count] || ["當前指引"];

  let text = `🔮 SITAROT 心靈折射・深層故事解讀\n\n`;
  text += `關於你請示的困惑：「${query || '當前運勢指引'}」，這 ${count} 張牌映照出你潛意識中的能量脈絡：\n\n`;

  // 2. 逐張解析並結合牌義資料庫
  if (Array.isArray(validCards)) {
    validCards.forEach((c, idx) => {
      if (!c) return;
      const role = roleNames[idx] || `第 ${idx + 1} 階段`;
      const cardName = c.nameZh || c.nameEn || c.name || '塔羅牌';
      const status = c.isReversed ? '逆位 🌙' : '正位 ☀️';

      let cardNarrative = "";
      
      // 優先從 TAROT_MATRIX_DB 或 TAROT_CARDS_DB 撈取剖析敘事
      const cardKey = (c.id || "").toLowerCase();
      const matrixMatch = (typeof TAROT_MATRIX_DB !== 'undefined' && TAROT_MATRIX_DB.cardsReading) 
        ? TAROT_MATRIX_DB.cardsReading[cardKey] 
        : null;

      if (matrixMatch) {
        const dir = c.isReversed ? 'reversed' : 'upright';
        cardNarrative = matrixMatch[dir]?.general || matrixMatch[dir]?.love || matrixMatch[dir]?.career || "";
      }

      if (!cardNarrative) {
        if (c.isReversed) {
          cardNarrative = c.reversedZh || c.reversedMeaning || (c.keywords && c.keywords.reversed ? `呈現【${c.keywords.reversed.join('、')}】的能量。代表你在這個環節感到了內心的阻礙，可能是過度壓抑或執著於舊思維。` : '暗示此處存在著未被察覺的內在阻礙，需要停下腳步重新校準。');
        } else {
          cardNarrative = c.uprightZh || c.uprightMeaning || (c.keywords && c.keywords.upright ? `展現【${c.keywords.upright.join('、')}】的流動。意味著內在的力量正在顯化，只要保持清醒就能順應推動力。` : '展現順暢的顯化能量，指引你勇敢擁抱當前的轉變。');
        }
      }

      text += `🌱 【${role}】—— ${cardName}（${status}）\n`;
      text += `${cardNarrative}\n\n`;
    });
  }

  text += `✨ 【大師靈魂提問】：貫穿這 ${count} 張牌，局勢的癥結不在於外部環境，而是你如何看待眼前的瓶頸。允許當下的迷霧存在，答案自然會浮現出來。`;

  // 3. 🌟 強制賦予文字顏色，直接寫入 DOM，絕不留白！
  outputEl.style.color = "#1e1b4b";
  outputEl.style.display = "block";
  outputEl.style.visibility = "visible";
  outputEl.style.opacity = "1";
  outputEl.innerHTML = text.replace(/\n/g, "<br>");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AIReaderEngine;
}