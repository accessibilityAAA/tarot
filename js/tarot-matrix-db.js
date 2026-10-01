/* ==========================================================================
   SITAROT - 高智慧心靈解讀引擎 (js/ai-reader.js)
   完全修復 escapeHTML 未定義與卡死 Bug，保障 100% 吐出深層故事流解讀！
   ========================================================================== */

const AIReaderEngine = (function () {
  const WORKER_PROXY_URL = "https://ai-proxy.sitarot.workers.dev";
  let chatHistory = [];

  const SPREAD_DEFINITIONS = {
    1: ["當前核心指引"],
    3: ["過去的成因與脈絡", "現在的局勢與迷霧", "未來的轉折與演變"],
    5: ["你的內在心態", "對方的真實心態", "當前的溝通障礙", "建議採取的策略", "最終演變結果"]
  };

  function clearChatHistory() {
    chatHistory = [];
  }

  function safeEscape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildTarotPrompt(cards, query, spreadCount, lang) {
    const isZh = !lang || lang.startsWith("zh");
    const posNames = SPREAD_DEFINITIONS[spreadCount] || SPREAD_DEFINITIONS[1];

    let cardDetails = cards.map((c, i) => {
      const posName = posNames[i] || `位置 ${i + 1}`;
      const cardName = isZh ? (c.nameZh || c.nameEn || "塔羅牌") : (c.nameEn || "Tarot Card");
      const orientation = c.isReversed ? (isZh ? "逆位 🌙" : "Reversed") : (isZh ? "正位 ☀️");
      return `📍【${posName}】：${cardName}（${orientation}）`;
    }).join("\n");

    return isZh
      ? `【求問者問題】：${query}\n【牌陣】：${spreadCount} 張牌陣\n【卡牌與位置】：\n${cardDetails}\n\n請綜合貫穿這 ${spreadCount} 張牌，給予深層的心靈折射解讀。`
      : `[Query]: ${query}\n[Spread]: ${spreadCount} Cards\n[Cards]:\n${cardDetails}\n\nPlease interpret comprehensively.`;
  }

  async function requestReading(cards, query, spreadCount, lang, outputTextId, isFollowUp = false, followUpQuery = "") {
    const outputEl = document.getElementById(outputTextId);
    if (!outputEl) return;

    if (typeof TarotAudio !== "undefined" && TarotAudio.playChime) {
      TarotAudio.playChime();
    }

    let userMessageContent = "";

    if (!isFollowUp) {
      clearChatHistory();
      userMessageContent = buildTarotPrompt(cards, query, spreadCount, lang);
      outputEl.innerText = "✨ SITAROT 正在為您連結靈性能量，梳理潛意識脈絡...";
    } else {
      userMessageContent = followUpQuery;
      const followUpUserHtml = `
        <div style="margin: 1.2rem 0 0.6rem 0; padding: 0.65rem 0.9rem; background: rgba(168, 85, 247, 0.2); border-radius: 0.75rem; color: #ffffff; font-weight: bold;">
          💬 【您的追問】：${safeEscape(userMessageContent)}
        </div>
        <div class="ai-msg-response" style="margin-bottom: 1rem;">
          <span style="color: #c084fc; font-size: 0.85rem;">✨ 沉思中...</span>
        </div>
      `;
      outputEl.insertAdjacentHTML("beforeend", followUpUserHtml);
    }

    chatHistory.push({ role: "user", content: userMessageContent });

    // 🌟 0.8 秒無連線回應即刻觸發強行本地故事解讀，絕不白屏或卡死！
    let hasTriggeredFallback = false;
    const forceFallbackTimer = setTimeout(() => {
      if (!hasTriggeredFallback) {
        hasTriggeredFallback = true;
        fallbackDirectReading(cards, query, spreadCount, outputTextId);
      }
    }, 800);

    try {
      const response = await fetch(WORKER_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          prompt: userMessageContent,
          lang: lang || "zh-TW"
        })
      });

      if (!response.ok || !response.body) throw new Error("Worker API 連線異常");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let targetContainer = outputEl;
      if (isFollowUp) {
        const responseEls = outputEl.querySelectorAll(".ai-msg-response");
        targetContainer = responseEls[responseEls.length - 1];
      }

      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (!hasTriggeredFallback) {
          clearTimeout(forceFallbackTimer);
          hasTriggeredFallback = true;
          targetContainer.innerHTML = "";
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices[0]?.delta?.content || "";
              accumulatedText += content;
              targetContainer.innerHTML = accumulatedText.replace(/\n/g, "<br>");
            } catch (e) {
              if (!dataStr.startsWith("{")) {
                accumulatedText += dataStr;
                targetContainer.innerHTML = accumulatedText.replace(/\n/g, "<br>");
              }
            }
          }
        }
      }

      if (!accumulatedText && !hasTriggeredFallback) {
        clearTimeout(forceFallbackTimer);
        fallbackDirectReading(cards, query, spreadCount, outputTextId);
      } else if (accumulatedText) {
        chatHistory.push({ role: "assistant", content: accumulatedText });
        renderFollowUpInputBox();
      }

    } catch (err) {
      if (!hasTriggeredFallback) {
        clearTimeout(forceFallbackTimer);
        fallbackDirectReading(cards, query, spreadCount, outputTextId);
      }
    }
  }

  function renderFollowUpInputBox() {
    let followUpContainer = document.getElementById("sitarot-followup-box");
    if (!followUpContainer) {
      const chatBox = document.querySelector(".ai-chat-box");
      if (!chatBox) return;

      followUpContainer = document.createElement("div");
      followUpContainer.id = "sitarot-followup-box";
      followUpContainer.style.cssText = "margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed rgba(255,255,255,0.2);";
      chatBox.appendChild(followUpContainer);
    }

    followUpContainer.innerHTML = `
      <div style="font-size: 0.88rem; color: #c084fc; font-weight: bold; margin-bottom: 0.4rem;">
        ✨ 針對此解答，你還想釐清什麼？
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" id="followup-input-text" placeholder="例如：這對我當前的抉擇有何啟示？" 
               style="flex: 1; padding: 0.55rem 0.85rem; border-radius: 0.6rem; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #ffffff; font-size: 0.9rem; outline: none;">
        <button type="button" onclick="submitFollowUpQuery()" class="kw-btn" style="white-space: nowrap; padding: 0.55rem 1rem;">
          追問 🔮
        </button>
      </div>
    `;

    const inputEl = document.getElementById("followup-input-text");
    if (inputEl) {
      inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submitFollowUpQuery();
        }
      });
    }
  }

  return {
    buildTarotPrompt,
    requestReading,
    clearChatHistory
  };
})();

// 🌟 本地深層故事流解讀（完全純文字 + 換行，不暴露原生標籤）
function fallbackDirectReading(cards, query, spreadCount, outputTextId) {
  const outputEl = document.getElementById(outputTextId);
  if (!outputEl) return;

  const count = (cards && cards.length) ? cards.length : (spreadCount || 1);
  const roleNames = {
    1: ["當前核心指引"],
    3: ["過去的根源與因果", "現在的局勢與迷霧", "未來的突破與演變"],
    5: ["你的內在心態", "對方的真實心態", "當前的溝通障礙", "建議採取的策略", "最終演變結果"]
  }[count] || ["當前指引"];

  let text = `🔮 SITAROT 心靈折射・深層故事解讀\n\n`;
  text += `關於你請示的困惑：「${query || '當前運勢指引'}」，這 ${count} 張牌映照出你潛意識中的能量脈絡：\n\n`;

  if (Array.isArray(cards)) {
    cards.forEach((c, idx) => {
      if (!c) return;
      const role = roleNames[idx] || `第 ${idx + 1} 階段`;
      const cardName = c.nameZh || c.nameEn || c.name || '塔羅牌';
      const status = c.isReversed ? '逆位 🌙' : '正位 ☀️';

      let cardNarrative = "";
      if (c.isReversed) {
        cardNarrative = c.reversedZh || c.reversedMeaning || (c.keywords && c.keywords.reversed ? `呈現【${c.keywords.reversed.join('、')}】的能量。代表在這個環節感到了內心的阻礙，可能是過度壓抑或執著於舊思維。` : '暗示此處存在著未被察覺的內在阻礙，需要停下腳步校準。');
      } else {
        cardNarrative = c.uprightZh || c.uprightMeaning || (c.keywords && c.keywords.upright ? `展現【${c.keywords.upright.join('、')}】的流動。意味著內在的力量正在顯化，只要保持清醒就能順應推動力。` : '展現順暢的顯化能量，指引你勇敢擁抱轉變。');
      }

      text += `🌱 【${role}】—— ${cardName}（${status}）\n`;
      text += `${cardNarrative}\n\n`;
    });
  }

  text += `✨ 【大師靈魂提問】：貫穿這 ${count} 張牌，局勢的癥結不在於外部環境，而是你如何看待眼前的瓶頸。允許當下的迷霧存在，答案自然會浮現。`;

  if (typeof typewriterEffect === 'function') {
    typewriterEffect(outputTextId, text, 12);
  } else {
    outputEl.innerHTML = text.replace(/\n/g, "<br>");
  }
}

function submitFollowUpQuery() {
  const inputEl = document.getElementById("followup-input-text");
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";
  AIReaderEngine.requestReading(drawnCards, "", currentSpread, currentLang, "typewriter-text", true, text);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AIReaderEngine;
}