/* ==========================================================================
   Astraea AI Tarot - 多國語系字典 (js/i18n.js)
   ========================================================================== */

let currentLang = localStorage.getItem('tarot_lang') || 'zh-TW';

const I18N_DICT = {
  'zh-TW': {
    brandTitle: '🔮 Astraea AI 塔羅占卜',
    placeholder: '例如：他現在對我有什麼想法？或點擊下方熱門問題...',
    inputLabel: '🔮 請輸入您想請示的心靈困惑：',
    btnSubmit: '🔮 開始免費占卜 / Start Reading',
    btnReDraw: '🔄 重新請示 / Read Again',
    btnSpread1: '1張牌 (每日指引)',
    btnSpread3: '3張牌 (時間軸)',
    btnSpread5: '5張牌 (深度牌陣)',
    tagLove: '💕 我的真命天子在哪裡？',
    tagCareer: '💼 該換工作還是留著？',
    tagFortune: '🪙 未來三個月財運？',
    tagUniverse: '✨ 宇宙今天想告訴我什麼？',
    drawHint: '點擊上方牌組進行抽牌',
    cardsDrawn: '✨ 已抽齊牌陣！解析中...'
  },
  'zh-CN': {
    brandTitle: '🔮 Astraea AI 塔罗占卜',
    placeholder: '例如：他现在对我有什么想法？或点击下方热门问题...',
    inputLabel: '🔮 请输入您想请示的心灵困惑：',
    btnSubmit: '🔮 开始免费占卜 / Start Reading',
    btnReDraw: '🔄 重新请示 / Read Again',
    btnSpread1: '1张牌 (每日指引)',
    btnSpread3: '3张牌 (时间轴)',
    btnSpread5: '5张牌 (深度牌阵)',
    tagLove: '💕 我的真命天子在哪里？',
    tagCareer: '💼 该换工作还是留着？',
    tagFortune: '🪙 未来三个月财运？',
    tagUniverse: '✨ 宇宙今天想告诉我什么？',
    drawHint: '点击上方牌组进行抽牌',
    cardsDrawn: '✨ 已抽齐牌阵！解析中...'
  },
  'en': {
    brandTitle: '🔮 Astraea AI Tarot',
    placeholder: 'e.g., What are their true feelings for me? Or tap a topic below...',
    inputLabel: '🔮 Enter Your Question or Query Below:',
    btnSubmit: '🔮 Start Free Reading',
    btnReDraw: '🔄 Read Again',
    btnSpread1: '1 Card (Daily)',
    btnSpread3: '3 Cards (Timeline)',
    btnSpread5: '5 Cards (Deep Spread)',
    tagLove: '💕 Where is my soulmate?',
    tagCareer: '💼 Should I change my job?',
    tagFortune: '🪙 3-Month Financial Outlook',
    tagUniverse: '✨ Message from the Universe',
    drawHint: 'Tap cards above to draw',
    cardsDrawn: '✨ Cards selected! Interpreting...'
  },
  'ja': {
    brandTitle: '🔮 Astraea AI タロット占い',
    placeholder: '例：あの人の今の本音は？または下の質問を選択...',
    inputLabel: '🔮 あなたの質問や悩みを入力してください：',
    btnSubmit: '🔮 無料占いを始める',
    btnReDraw: '🔄 もう一度占う',
    btnSpread1: '1枚引き (今日の運勢)',
    btnSpread3: '3枚引き (時系列)',
    btnSpread5: '5枚引き (深層スプレッド)',
    tagLove: '💕 運命の人はどこにいる？',
    tagCareer: '💼 転職すべきか留まるべきか？',
    tagFortune: '🪙 今後3ヶ月の金運は？',
    tagUniverse: '✨ 宇宙からの今日のメッセージ',
    drawHint: '上のカードをタップして引いてください',
    cardsDrawn: '✨ カードが選択されました！解釈中...'
  },
  'ko': {
    brandTitle: '🔮 Astraea AI 타로 점',
    placeholder: '예: 그 사람은 지금 나를 어떻게 생각할까? 또는 아래 질문 선택...',
    inputLabel: '🔮 고민이나 질문을 입력해 주세요:',
    btnSubmit: '🔮 무료 타로 점보기',
    btnReDraw: '🔄 다시 점보기',
    btnSpread1: '1장 (오늘의 운세)',
    btnSpread3: '3장 (타임라인)',
    btnSpread5: '5장 (심층 리딩)',
    tagLove: '💕 운명의 상대는 누구일까?',
    tagCareer: '💼 이직해야 할까?',
    tagFortune: '🪙 앞으로 3개월 재물운은?',
    tagUniverse: '✨ 우주가 주는 메시지',
    drawHint: '위의 카드를 탭하여 뽑아주세요',
    cardsDrawn: '✨ 카드가 선택되었습니다! 해석 중...'
  }
};