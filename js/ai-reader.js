/* ==========================================================================
   天下第一塔羅牌 - AI 串流解牌與對接模組 (js/ai-reader.js)
   支援 Cloudflare Worker 安全代理、打字機流暢渲染與離線本地降級解牌
   ========================================================================== */

const AIReaderEngine = (function () {
  const WORKER_PROXY_URL = "https://ai-proxy.your-subdomain.workers.dev"; // 部署後的 Cloudflare Worker URL
  let typewriterTimer = null;

  // 1. 建立組合 AI Prompt
  function buildTarotPrompt(cards, query, spreadCount, lang) {
    const isZh = lang.startsWith("zh");
    const spreadInfo = typeof TAROT_SPREADS_DB !== "undefined" ? TAROT_SPREADS_DB[spreadCount] : null;
    const spreadName = spreadInfo ? (spreadInfo.name[lang] || spreadInfo.name["zh-TW"]) : `${spreadCount} Card Spread`;

    let cardDetails = cards.map((c, i) => {
      const posInfo = (spreadInfo && spreadInfo.positions && spreadInfo.positions[i])
        ? (spreadInfo.positions[i].name[lang] || spreadInfo.positions[i].name["zh-TW"])
        : `Position ${i + 1}`;
      
      const cardName = isZh ? c.nameZh : c.nameEn;
      const orientation = c.isReversed ? (isZh ? "逆位" : "Reversed") : (isZh ? "正位" : "Upright");
      const keywords = c.isReversed ? c.reversedKeywords.join(", ") : c.uprightKeywords.join(", ");
      
      return `[${posInfo}] : ${cardName} (${orientation}) - Key Concepts: ${keywords}`;
    }).join("\n");

    const promptText = isZh
      ? `【求問者問題】：${query}\n【選用牌陣】：${spreadName}\n【抽取卡牌】：\n${cardDetails}\n\n請以溫暖、專業且具啟發性的心理塔羅大師語氣，針對問題與牌陣進行深度剖析。請包含：\n1. 牌陣整體能量概覽\n2. 各位置卡牌的具體心理與現實指引\n3. 給求問者的核心行動建議。`
      : `[User Query]: ${query}\n[Tarot Spread]: ${spreadName}\n[Drawn Cards]:\n${cardDetails}\n\nPlease interpret this reading empathetically as a Master Tarot Reader. Provide:\n1. Overall Energy Overview\n2. Specific Insights for each Position\n3. Clear, Actionable Advice.`;

    return SecuritySanitizer.sanitizePrompt(promptText);
  }

  // 2. 打字機串流效果
  function runTypewriterStream(targetElementId, fullText, speed = 20, onComplete = null) {
    const container = document.getElementById(targetElementId);
    if (!container) return;

    if (typewriterTimer) clearInterval(typewriterTimer);
    container.innerHTML = "";

    let index = 0;
    const cleanText = String(fullText);

    typewriterTimer = setInterval(() => {
      if (index < cleanText.length) {
        const char = cleanText.charAt(index);
        if (char === "\n") {
          container.innerHTML += "<br>";
        } else {
          container.innerHTML += SecuritySanitizer.escapeHTML(char);
        }
        index++;
      } else {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
        if (typeof onComplete === "function") onComplete();
      }
    }, speed);
  }

  // 3. 離線本地備用解牌算法 (當 API 無法連線時自動降級備用)
  function generateLocalFallbackReading(cards, query, lang) {
    const isZh = lang.startsWith("zh");
    const safeQuery = SecuritySanitizer.sanitizeInput(query);
    const firstCard = cards[0];

    if (isZh) {
      let analysis = `親愛的心靈探索者，針對您所請示的問題：「${safeQuery}」，宇宙能量已透過塔羅牌陣為您顯化指引。\n\n`;
      analysis += `主導當前局勢的核心卡牌為【${firstCard.nameZh}】(${firstCard.isReversed ? "逆位" : "正位"})。\n`;
      analysis += `${firstCard.isReversed ? firstCard.reversedZh : firstCard.uprightZh}\n\n`;
      
      if (cards.length > 1) {
        analysis += `從整體牌陣的能量流轉來看，當前情勢正處於梳理與轉換的關鍵期。不論眼前面臨何種考驗，請保持內心的清明與自信。\n\n`;
      }

      analysis += `💡 【心靈行動建議】：${firstCard.advice || "信任內心的直覺，勇敢踏出調整的腳步，幸運隨後就會明朗。"}`;
      return analysis;
    } else {
      let analysis = `Greetings, Seeker of Truth. Regarding your query: "${safeQuery}", the cosmic energy speaks through your spread.\n\n`;
      analysis += `The dominant card shaping your energy is ${firstCard.nameEn} (${firstCard.isReversed ? "Reversed" : "Upright"}).\n`;
      analysis += `${firstCard.isReversed ? firstCard.reversedEn : firstCard.uprightEn}\n\n`;
      
      analysis += `💡 [Actionable Advice]: ${firstCard.advice || "Trust your inner wisdom and take clear, deliberate action."}`;
      return analysis;
    }
  }

  // 4. 觸發 AI 解牌流程
  async function requestReading(cards, query, spreadCount, lang, outputTextId) {
    const safeQuery = SecuritySanitizer.sanitizeInput(query);
    const validCards = SecuritySanitizer.validateCardsData(cards);

    if (validCards.length === 0) return;

    const prompt = buildTarotPrompt(validCards, safeQuery, spreadCount, lang);

    // 播放勝音/祝禱音效
    if (typeof TarotAudio !== "undefined") {
      TarotAudio.playChime();
    }

    try {
      // 嘗試透過 Workers Proxy 請求線上 API
      const response = await fetch(WORKER_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, lang })
      });

      if (!response.ok || !response.body) {
        throw new Error("Worker Proxy unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const outputEl = document.getElementById(outputTextId);
      if (outputEl) outputEl.innerHTML = "";

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        if (outputEl) {
          outputEl.innerHTML = SecuritySanitizer.escapeHTML(accumulatedText).replace(/\n/g, "<br>");
        }
      }

    } catch (err) {
      console.warn("[AIReaderEngine] 線上 API 無法連線，啟用本地降級解牌引擎：", err.message);
      
      // 自動降級為本地純淨解讀
      const fallbackText = generateLocalFallbackReading(validCards, safeQuery, lang);
      runTypewriterStream(outputTextId, fallbackText, 22);
    }
  }

  return {
    buildTarotPrompt,
    runTypewriterStream,
    generateLocalFallbackReading,
    requestReading
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = AIReaderEngine;
}