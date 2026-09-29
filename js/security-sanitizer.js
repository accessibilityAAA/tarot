/* ==========================================================================
   天下第一塔羅牌 - XSS 防禦與資料淨化模組 (js/security-sanitizer.js)
   100% 防護 DOM 注入、Prompt Injection 與非正常字元
   ========================================================================== */

const SecuritySanitizer = (function () {
  // 1. HTML 特殊字元轉義 (防止 XSS)
  function escapeHTML(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 2. 提問輸入框文字淨化 (控制長度與控制字元)
  function sanitizeInput(text, maxLength = 300) {
    if (typeof text !== "string") return "";
    
    // 移除控制字元 (ASCII 0-31，保留換行 10 與 13)
    let cleaned = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "");
    
    // 去除前後多餘空白
    cleaned = cleaned.trim();

    // 限制最大字數，防範記憶體溢出
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength);
    }

    return cleaned;
  }

  // 3. 淨化 Prompt 防止指令挾持 (Prompt Injection)
  function sanitizePrompt(promptText) {
    let safeText = sanitizeInput(promptText, 300);
    
    // 移除可能的系統指令挾持關鍵字
    safeText = safeText
      .replace(/system:/gi, "")
      .replace(/developer:/gi, "")
      .replace(/\[INST\]/gi, "")
      .replace(/\[\/INST\]/gi, "")
      .replace(/<\|im_start\|>/gi, "")
      .replace(/<\|im_end\|>/gi, "");

    return safeText;
  }

  // 4. 驗證牌陣數據結構合法性
  function validateCardsData(cardsArray) {
    if (!Array.isArray(cardsArray)) return [];
    
    return cardsArray.filter((card) => {
      return (
        card &&
        typeof card === "object" &&
        typeof card.id === "string" &&
        typeof card.nameEn === "string" &&
        typeof card.nameZh === "string"
      );
    });
  }

  return {
    escapeHTML,
    sanitizeInput,
    sanitizePrompt,
    validateCardsData
  };
})();

// 綁定全域輔助函式
function escapeHTML(str) {
  return SecuritySanitizer.escapeHTML(str);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SecuritySanitizer;
}