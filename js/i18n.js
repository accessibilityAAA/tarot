/* ==========================================================================
   Astraea AI Tarot - 多語系字典與 UI 替換邏輯 (js/i18n.js)
   ========================================================================== */

// 注意：currentLang 統一由 app.js 宣告，這裡只負責定義字典與維護
if (typeof window.currentLang === 'undefined') {
  window.currentLang = localStorage.getItem('tarot_lang') || 'zh-TW';
}

const I18N_DICT = {
  'zh-TW': {
    brandTitle: 'SITAROT',
    inputLabel: '今天，你想問什麼？',
    placeholder: '例如：他現在對我有什麼想法？或點擊下方熱門問題...',
    tagLove: '💕 感情心態',
    tagCareer: '💼 職涯抉擇',
    tagFortune: '🪙 財運分析',
    tagUniverse: '✨ 宇宙指引',
    btnSpread1: '1張牌 (每日指引)',
    btnSpread3: '3張牌 (時間軸)',
    btnSpread5: '5張牌 (深度牌陣)',
    drawHint: '✨ 請憑直覺點擊下方卡牌進行抽牌',
    cardsDrawn: '✨ 牌陣已完成！點擊下方按鈕開始解讀',
    btnSubmit: '開始選牌 🔮',
    btnReDraw: '🔄 重新提問 / SITAROT',
    btnSave: '📖 保存至靈魂日誌',
    readyText: '🔮 牌陣已就緒！點擊開啟 SITAROT 超級解讀',
    needMore: '🔮 請先點擊上方卡牌進行抽牌 (還差 {x} 張)'
  },
  'zh-CN': {
    brandTitle: 'SITAROT',
    inputLabel: '今天，你想问什么？',
    placeholder: '例如：他现在对我有什么想法？或点击下方热门问题...',
    tagLove: '💕 感情心态',
    tagCareer: '💼 职涯抉择',
    tagFortune: '🪙 财运分析',
    tagUniverse: '✨ 宇宙指引',
    btnSpread1: '1张牌 (每日指引)',
    btnSpread3: '3张牌 (时间轴)',
    btnSpread5: '5张牌 (深度牌阵)',
    drawHint: '✨ 请凭直觉点击下方卡牌进行抽牌',
    cardsDrawn: '✨ 牌阵已完成！点击下方按钮开始解读',
    btnSubmit: '开始选牌 🔮',
    btnReDraw: '🔄 重新提问 / SITAROT',
    btnSave: '📖 保存至灵魂日志',
    readyText: '🔮 牌阵已就绪！点击开启 SITAROT 超级解读',
    needMore: '🔮 请先点击上方卡牌进行抽牌 (还差 {x} 张)'
  },
  'en': {
    brandTitle: 'SITAROT',
    inputLabel: 'What is your question today?',
    placeholder: 'e.g., What are his current feelings towards me?',
    tagLove: '💕 Love & Relationship',
    tagCareer: '💼 Career Path',
    tagFortune: '🪙 Financial Luck',
    tagUniverse: '✨ Cosmic Guidance',
    btnSpread1: '1 Card (Daily)',
    btnSpread3: '3 Cards (Timeline)',
    btnSpread5: '5 Cards (Deep Spread)',
    drawHint: '✨ Trust your intuition and click cards below',
    cardsDrawn: '✨ Spread completed! Click button below to read',
    btnSubmit: 'Start Selection 🔮',
    btnReDraw: '🔄 New Query / SITAROT',
    btnSave: '📖 Save to Journal',
    readyText: '🔮 Spread Ready! Click for SITAROT AI Reading',
    needMore: '🔮 Draw {x} more card(s)'
  },
  'ja': {
    brandTitle: 'SITAROT',
    inputLabel: '今日、何を占いたいですか？',
    placeholder: '例：あの人は今私のことをどう思っている？...',
    tagLove: '💕 恋愛・お相手の気持ち',
    tagCareer: '💼 仕事・転職の悩み',
    tagFortune: '🪙 金運・財運アドバイス',
    tagUniverse: '✨ 宇宙からのメッセージ',
    btnSpread1: '1枚 (今日の助言)',
    btnSpread3: '3枚 (過去・現在・未来)',
    btnSpread5: '5枚 (深層スプレッド)',
    drawHint: '✨ 直感でカードをクリックして引いてください',
    cardsDrawn: '✨ カードが揃いました！ボタンを押して解読開始',
    btnSubmit: 'カードを選ぶ 🔮',
    btnReDraw: '🔄 もう一度占う / SITAROT',
    btnSave: '📖 日記に保存',
    readyText: '🔮 展開完了！SITAROT AI解読を開始',
    needMore: '🔮 あと {x} 枚カードを引いてください'
  },
  'ko': {
    brandTitle: 'SITAROT',
    inputLabel: '오늘 어떤 점을 치고 싶으신가요?',
    placeholder: '예: 그 사람은 지금 나를 어떻게 생각할까?...',
    tagLove: '💕 연애·속마음',
    tagCareer: '💼 이직·진로 고민',
    tagFortune: '🪙 재물·금전운',
    tagUniverse: '✨ 우주의 조언',
    btnSpread1: '1장 (오늘의 조언)',
    btnSpread3: '3장 (타임라인)',
    btnSpread5: '5장 (심층 스프레드)',
    drawHint: '✨ 직관적으로 아래 카드를 클릭하여 뽑으세요',
    cardsDrawn: '✨ 카드 뽑기 완료! 아래 버튼을 누르세요',
    btnSubmit: '카드 선택하기 🔮',
    btnReDraw: '🔄 다시 질문하기 / SITAROT',
    btnSave: '📖 일기에 저장',
    readyText: '🔮 리딩 준비 완료! SITAROT AI 해석 시작',
    needMore: '🔮 {x}장의 카드를 더 뽑아주세요'
  }
};