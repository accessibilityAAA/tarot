/* ==========================================================================
   SITAROT - Workers AI Proxy (workers/ai-proxy.js)
   修正 CORS 標頭、動態網域防護與心理引導 Prompt
   ========================================================================== */

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = [
      "https://sitarot.com",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:8080"
    ];
    
    const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://sitarot.com";

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const body = await request.json();
      const messages = body.messages || [];
      const userPrompt = body.prompt || "";
      const lang = body.lang || "zh-TW";

      const API_KEY = env.OPENAI_API_KEY || env.GEMINI_API_KEY;
      if (!API_KEY) {
        return new Response(JSON.stringify({ error: "API Key missing" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const systemPrompt = `You are SITAROT (Super Intelligence Tarot), a silent, profound, psychological mentor.
Language: ${lang}

Philosophy & Style:
- Absolute Ban on Spiritual Cliches: NEVER use phrases like "The universe is telling you...", "Energy is manifesting...", or "Spiritual guidance".
- Cognitive Reframing: Shift the user from passive anxiety to active inner agency.

Structure for FIRST Response:
1. 🪞 【鏡像連結】 (Empathy & Reality Reframe): 1-2 sharp sentences acknowledging their inner state.
2. 🎴 【牌陣折射】 (Symbolic Insight): Calmly explain how drawn cards reflect subconscious boundaries and resistance.
3. 💡 【盲點翻轉】 (Cognitive Shift): Reframe their original question to empower decision-making.
4. ✨ 【靈魂提問】 (Contemplative Question): End with ONE provocative, gentle question that forces contemplative silence.

Structure for Follow-up Responses:
- Respond as a calm, insightful mentor within 2-3 concise paragraphs. Focus on inner clarity and action steps.`;

      let apiMessages = [{ role: "system", content: systemPrompt }];
      if (messages.length > 0) {
        apiMessages = apiMessages.concat(messages.slice(-8));
      } else {
        apiMessages.push({ role: "user", content: userPrompt });
      }

      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: apiMessages,
          temperature: 0.7,
          stream: true
        })
      });

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