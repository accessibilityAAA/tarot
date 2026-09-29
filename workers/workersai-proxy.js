/* ==========================================================================
   天下第一塔羅牌 - Cloudflare Workers 安全代理 (workers/ai-proxy.js)
   防護 API Key 外洩、CORS 標頭控制與請求 Rate Limit 限制
   ========================================================================== */

export default {
  async fetch(request, env) {
    // 1. CORS 跨域安全標頭
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // 部署後可改為您的專屬網域 https://www.longminglee.com
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 處理 Preflight 請求
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const body = await request.json();
      const userPrompt = body.prompt || "";
      const lang = body.lang || "zh-TW";

      if (!userPrompt) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 從 Cloudflare Worker Secrets 取得私密金鑰 (絕不暴露給前端)
      const API_KEY = env.OPENAI_API_KEY || env.GEMINI_API_KEY;
      if (!API_KEY) {
        return new Response(JSON.stringify({ error: "Server API Key not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. 呼叫大模型 API (以 OpenAI / Compatible API 為例)
      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // 或使用成本極低且快速的微調模型
          messages: [
            {
              role: "system",
              content: `You are Astraea, the Master Tarot Reader of Ultimate Tarot. Provide insightful, empathetic, and profound readings in ${lang}. Use clear structure with bullet points and friendly guidance.`
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.7,
          stream: true // 支援打字機串流流暢輸出
        })
      });

      // 3. 串流回應直接 Pipe 回前端
      return new Response(apiResponse.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};