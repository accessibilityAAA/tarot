// build.js - 終極全自動生成器 (單牌 / 雙牌 / 問題庫 / 牌陣頁 / Sitemap)
const fs = require('fs');
const path = require('path');

console.log('--------------------------------------------------');
console.log('🚀 開始執行全站靜態頁面生成器 build.js...');

const SITE_DOMAIN = 'https://www.longminglee.com';

const cardsJsonPath = path.join(__dirname, 'data', 'cards.json');
const combiJsonPath = path.join(__dirname, 'data', 'combinations.json');
const questJsonPath = path.join(__dirname, 'data', 'questions.json');
const spreadJsonPath = path.join(__dirname, 'data', 'spreads.json');

const cardsOutputDir = path.join(__dirname, 'cards');
const combiOutputDir = path.join(__dirname, 'combinations');
const questOutputDir = path.join(__dirname, 'questions');
const spreadOutputDir = path.join(__dirname, 'spreads');

[cardsOutputDir, combiOutputDir, questOutputDir, spreadOutputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function safeReadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error(`⚠️ 警告：${path.basename(filePath)} 格式錯誤 (${err.message})`);
    return null;
  }
}

const sitemapUrls = [`${SITE_DOMAIN}/index.html`];

// 1. 生成 78 張單牌頁面 (/cards/)
const cardsData = safeReadJSON(cardsJsonPath);
if (cardsData) {
  let cardCount = 0;
  Object.keys(cardsData).forEach((key) => {
    const card = cardsData[key];
    const fileName = `${card.id}.html`;
    sitemapUrls.push(`${SITE_DOMAIN}/cards/${fileName}`);

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.name.zh} ${card.name.en} 塔羅牌義全解析 | Astraea Tarot</title>
  <meta name="description" content="深入探索 ${card.name.zh} (${card.name.en}) 塔羅牌的象徵與正逆位牌義解讀。">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="wiki-page">
  <header class="site-header"><div class="header-inner"><a href="../index.html" class="brand-title">🔮 Astraea Tarot 塔羅百科</a><a href="../index.html" class="btn-head">🎴 線上抽牌</a></div></header>
  <main class="container wiki-container" style="padding: 1.5rem 0.8rem;">
    <nav class="breadcrumb" style="font-size:0.85rem; color:var(--text-sub); margin-bottom:0.75rem;"><a href="../index.html" style="color:var(--text-sub);">首頁</a> &gt; <span>${card.name.zh} ${card.name.en}</span></nav>
    <section class="glass-card" style="margin-bottom:1rem;">
      <div style="display:grid; grid-template-columns: 160px 1fr; gap:1.2rem; align-items:center;">
        <img src="../assets/images/cards/${card.id}.jpg" onerror="this.onerror=null; this.src='../assets/images/cards/00.webp';" alt="${card.name.zh}" style="width:100%; border-radius:0.5rem; border:1.5px solid var(--border-color);">
        <div>
          <h1 style="font-size:1.6rem; color:var(--gold-accent); margin:0;">${card.name.zh} <span style="font-size:1rem; color:var(--text-sub);">${card.name.en}</span></h1>
          <p style="font-size:0.9rem; color:var(--text-sub);">${card.archetype || '塔羅牌義'}</p>
          <div style="font-size:0.88rem; line-height:1.6; margin-top:0.5rem;">
            <div><strong style="color:#10b981;">【正位】</strong> ${card.keywords?.upright?.join('、') || '暫無'}</div>
            <div><strong style="color:#ef4444;">【逆位】</strong> ${card.keywords?.reversed?.join('、') || '暫無'}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="glass-card" style="margin-bottom:1rem;">
      <h2 style="font-size:1.15rem; color:#10b981; border-bottom:1px solid var(--border-color); padding-bottom:0.4rem;">☀️ 正位牌義</h2>
      <p style="font-size:0.92rem; line-height:1.65;">${card.interpretations?.upright?.general || '詳細牌義整理中...'}</p>
      <h2 style="font-size:1.15rem; color:#ef4444; border-bottom:1px solid var(--border-color); padding-bottom:0.4rem; margin-top:1.2rem;">🌙 逆位牌義</h2>
      <p style="font-size:0.92rem; line-height:1.65;">${card.interpretations?.reversed?.general || '詳細牌義整理中...'}</p>
    </section>
    <section style="text-align:center; padding:1.2rem 0;"><a href="../index.html" class="btn-gold" style="display:inline-block; text-decoration:none; font-size:0.95rem; padding:0.5rem 1.5rem;">🔮 進入線上免費占卜</a></section>
  </main>
  <footer class="site-footer"><div class="footer-inner" style="text-align:center;"><p style="font-size:0.8rem; color:var(--footer-text);">© 2026 Astraea Tarot. All Rights Reserved.</p></div></footer>
</body>
</html>`;
    fs.writeFileSync(path.join(cardsOutputDir, fileName), htmlContent, 'utf8');
    cardCount++;
  });
  console.log(`✅ 已成功生成 ${cardCount} 個單牌百科網頁 (/cards/)`);
}

// 2. 生成雙牌組合頁面 (/combinations/)
const combiData = safeReadJSON(combiJsonPath);
if (combiData) {
  let combiCount = 0;
  Object.keys(combiData).forEach((key) => {
    const item = combiData[key];
    const fileName = `${item.id}.html`;
    sitemapUrls.push(`${SITE_DOMAIN}/combinations/${fileName}`);

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title_zh} 塔羅牌組合解讀 | Astraea Tarot</title>
  <meta name="description" content="當抽到 ${item.title_zh} (${item.title_en}) 代表什麼？深度剖析這組塔羅牌組合在感情關係、職場事業上的深度牌義。">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="wiki-page">
  <header class="site-header"><div class="header-inner"><a href="../index.html" class="brand-title">🔮 Astraea Tarot 雙牌組合庫</a><a href="../index.html" class="btn-head">🎴 線上抽牌</a></div></header>
  <main class="container wiki-container" style="padding: 1.5rem 0.8rem;">
    <nav class="breadcrumb" style="font-size:0.85rem; color:var(--text-sub); margin-bottom:0.75rem;"><a href="../index.html" style="color:var(--text-sub);">首頁</a> &gt; <span>牌組組合：${item.title_zh}</span></nav>
    <section class="glass-card" style="margin-bottom:1rem; text-align:center;">
      <h1 style="font-size:1.6rem; color:var(--gold-accent); margin-bottom:0.4rem;">${item.title_zh}</h1>
      <p style="font-size:0.9rem; color:var(--text-sub);">${item.title_en}</p>
    </section>
    <section class="glass-card" style="margin-bottom:1rem;">
      <h2 style="font-size:1.15rem; color:#f472b6; border-bottom:1px solid var(--border-color); padding-bottom:0.4rem;">❤️ 感情關係解讀</h2>
      <p style="font-size:0.92rem; line-height:1.65;">${item.relationship_reading}</p>
      <h2 style="font-size:1.15rem; color:#60a5fa; border-bottom:1px solid var(--border-color); padding-bottom:0.4rem; margin-top:1.2rem;">💼 事業與工作指引</h2>
      <p style="font-size:0.92rem; line-height:1.65;">${item.career_reading}</p>
      <blockquote style="border-left:3px solid var(--gold-accent); padding-left:0.6rem; color:#fef08a; margin-top:1.2rem; font-style:italic;">💡 核心建議：${item.advice}</blockquote>
    </section>
    <section style="text-align:center; padding:1.2rem 0;"><a href="../index.html" class="btn-gold" style="display:inline-block; text-decoration:none; font-size:0.95rem; padding:0.5rem 1.5rem;">🔮 進入線上免費占卜</a></section>
  </main>
  <footer class="site-footer"><div class="footer-inner" style="text-align:center;"><p style="font-size:0.8rem; color:var(--footer-text);">© 2026 Astraea Tarot. All Rights Reserved me.</p></div></footer>
</body>
</html>`;
    fs.writeFileSync(path.join(combiOutputDir, fileName), htmlContent, 'utf8');
    combiCount++;
  });
  console.log(`✅ 已成功生成 ${combiCount} 個雙牌組合網頁 (/combinations/)`);
}

// 3. 生成塔羅問題庫頁面 (/questions/)
const questData = safeReadJSON(questJsonPath);
if (questData) {
  let questCount = 0;
  Object.keys(questData).forEach((key) => {
    const q = questData[key];
    const fileName = `${q.id}.html`;
    sitemapUrls.push(`${SITE_DOMAIN}/questions/${fileName}`);

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${q.title_zh} | 塔羅專題線上占卜 | Astraea Tarot</title>
  <meta name="description" content="${q.description}">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="wiki-page">
  <header class="site-header"><div class="header-inner"><a href="../index.html" class="brand-title">🔮 Astraea Tarot 問題庫</a><a href="../index.html" class="btn-head">🎴 線上抽牌</a></div></header>
  <main class="container wiki-container" style="padding: 1.5rem 0.8rem;">
    <nav class="breadcrumb" style="font-size:0.85rem; color:var(--text-sub); margin-bottom:0.75rem;"><a href="../index.html" style="color:var(--text-sub);">首頁</a> &gt; <span>${q.category_zh}</span></nav>
    <section class="glass-card" style="margin-bottom:1rem; text-align:center;">
      <span style="background:var(--primary-purple); color:#fff; font-size:0.75rem; padding:0.2rem 0.6rem; border-radius:0.3rem;">${q.category_zh}</span>
      <h1 style="font-size:1.5rem; color:var(--gold-accent); margin:0.6rem 0 0.2rem 0;">${q.title_zh}</h1>
      <p style="font-size:0.85rem; color:var(--text-sub);">${q.title_en}</p>
    </section>
    <section class="glass-card" style="margin-bottom:1rem;">
      <h2 style="font-size:1.1rem; color:#fef08a; margin-top:0;">📋 問題剖析與建議牌陣</h2>
      <p style="font-size:0.92rem; line-height:1.65; color:var(--text-main);">${q.description}</p>
      <div style="background:rgba(0,0,0,0.25); padding:0.8rem; border-radius:0.5rem; border:1px solid var(--border-color); margin-top:0.8rem;">
        <div style="font-size:0.9rem; font-weight:bold; color:var(--gold-accent);">推薦牌陣：${q.spread_name}</div>
        <p style="font-size:0.85rem; color:var(--text-sub); margin:0.4rem 0 0 0;">${q.advice_overview}</p>
      </div>
    </section>
    <section style="text-align:center; padding:1.5rem 0;">
      <a href="../index.html?q=${encodeURIComponent(q.title_zh)}&spread=${q.spread_recommended}" class="btn-gold" style="display:inline-block; text-decoration:none; font-size:1.05rem; padding:0.6rem 2rem;">🔮 立即為這個問題進行線上占卜</a>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-inner" style="text-align:center;"><p style="font-size:0.8rem; color:var(--footer-text);">© 2026 Astraea Tarot. All Rights Reserved.</p></div></footer>
</body>
</html>`;
    fs.writeFileSync(path.join(questOutputDir, fileName), htmlContent, 'utf8');
    questCount++;
  });
  console.log(`✅ 已成功生成 ${questCount} 個問題專題網頁 (/questions/)`);
}

// 4. 生成塔羅牌陣頁面 (/spreads/)
const spreadData = safeReadJSON(spreadJsonPath);
if (spreadData) {
  let spreadCount = 0;
  Object.keys(spreadData).forEach((key) => {
    const s = spreadData[key];
    const fileName = `${s.id}.html`;
    sitemapUrls.push(`${SITE_DOMAIN}/spreads/${fileName}`);

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.name_zh} | 專業塔羅牌陣教學與線上占卜 | Astraea Tarot</title>
  <meta name="description" content="${s.description}">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="wiki-page">
  <header class="site-header"><div class="header-inner"><a href="../index.html" class="brand-title">🔮 Astraea Tarot 牌陣庫</a><a href="../index.html" class="btn-head">🎴 線上抽牌</a></div></header>
  <main class="container wiki-container" style="padding: 1.5rem 0.8rem;">
    <nav class="breadcrumb" style="font-size:0.85rem; color:var(--text-sub); margin-bottom:0.75rem;"><a href="../index.html" style="color:var(--text-sub);">首頁</a> &gt; <span>${s.name_zh}</span></nav>
    <section class="glass-card" style="margin-bottom:1rem; text-align:center;">
      <span style="background:var(--primary-purple); color:#fff; font-size:0.75rem; padding:0.2rem 0.6rem; border-radius:0.3rem;">${s.count} 張牌陣</span>
      <h1 style="font-size:1.5rem; color:var(--gold-accent); margin:0.6rem 0 0.2rem 0;">${s.name_zh}</h1>
      <p style="font-size:0.85rem; color:var(--text-sub);">${s.name_en}</p>
    </section>
    <section class="glass-card" style="margin-bottom:1rem;">
      <h2 style="font-size:1.1rem; color:#fef08a; margin-top:0;">📐 牌陣原理與位置說明</h2>
      <p style="font-size:0.92rem; line-height:1.65; color:var(--text-main);">${s.description}</p>
      <div style="background:rgba(0,0,0,0.25); padding:0.8rem; border-radius:0.5rem; border:1px solid var(--border-color); margin-top:0.8rem;">
        <div style="font-size:0.9rem; font-weight:bold; color:var(--gold-accent); margin-bottom:0.4rem;">牌陣各位置定義：</div>
        <ol style="font-size:0.85rem; color:var(--text-sub); margin:0; padding-left:1.2rem; line-height:1.6;">
          ${s.positions_zh.map(pos => `<li>${pos}</li>`).join('')}
        </ol>
      </div>
    </section>
    <section style="text-align:center; padding:1.5rem 0;">
      <a href="../index.html?spread=${s.count}" class="btn-gold" style="display:inline-block; text-decoration:none; font-size:1.05rem; padding:0.6rem 2rem;">🔮 直接使用「${s.name_zh}」進行線上抽牌</a>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-inner" style="text-align:center;"><p style="font-size:0.8rem; color:var(--footer-text);">© 2026 Astraea Tarot. All Rights Reserved.</p></div></footer>
</body>
</html>`;
    fs.writeFileSync(path.join(spreadOutputDir, fileName), htmlContent, 'utf8');
    spreadCount++;
  });
  console.log(`✅ 已成功生成 ${spreadCount} 個牌陣教學網頁 (/spreads/)`);
}

// 5. 全自動生成 sitemap.xml
const todayStr = new Date().toISOString().split('T')[0];
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemapUrls.forEach(url => {
  xmlContent += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url.includes('index.html') ? '1.0' : '0.8'}</priority>\n  </url>\n`;
});
xmlContent += `</urlset>`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xmlContent, 'utf8');
console.log(`🗺️ 全站 Sitemap 地圖同步完成！共包含 ${sitemapUrls.length} 個靜態連結。`);

console.log('\n🎉 全站四大靜態模組 + SEO 資源全數生成完畢！');
console.log('--------------------------------------------------');