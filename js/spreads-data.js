/* ==========================================================================
   天下第一塔羅牌 - 專業牌陣資料庫 (js/spreads-data.js)
   支援多國語言動態轉換！
   ========================================================================== */

const TAROT_SPREADS_DB = {
  1: {
    id: "spread_1",
    count: 1,
    name: {
      "zh-TW": "單牌每日指引 (Daily Insight)",
      "zh-CN": "单牌每日指引 (Daily Insight)",
      "en": "Single Card Focus",
      "ja": "1枚引き (今日のメッセージ)",
      "ko": "1장 (오늘의 메시지)"
    },
    description: {
      "zh-TW": "針對單一問題或今日整體運勢，提供精準、直接的直覺指引。",
      "zh-CN": "针对单一问题或今日整体运势，提供精准、直接的直觉指引。",
      "en": "Provides direct and focused guidance for a specific question or daily energy.",
      "ja": "特定の質問や今日の運勢に対して、明快で直感的なヒントを提供します。",
      "ko": "특정 질문이나 오늘의 운세에 대해 명확하고 직관적인 조언을 제공합니다."
    },
    positions: [
      {
        id: 1,
        name: {
          "zh-TW": "當前核心解答 / 今日指引",
          "zh-CN": "当前核心解答 / 今日指引",
          "en": "Core Insight / Daily Message",
          "ja": "コアの回答 / 今日の指針",
          "ko": "핵심 답변 / 오늘의 지침"
        }
      }
    ]
  },

  3: {
    id: "spread_3",
    count: 3,
    name: {
      "zh-TW": "三才時間軸牌陣 (Past-Present-Future)",
      "zh-CN": "三才时间轴牌阵 (Past-Present-Future)",
      "en": "Three Card Timeline",
      "ja": "3枚引き (過去・現在・未来)",
      "ko": "3장 (과거·현재·미래)"
    },
    description: {
      "zh-TW": "剖析問題演變脈絡，梳理過去影響、當前現狀與未來發展趨勢。",
      "zh-CN": "剖析问题演变脉络，梳理过去影响、当前现状与未来发展趋势。",
      "en": "Explores the timeline of your issue: past influences, current reality, and potential future.",
      "ja": "過去の影響、現在の状況、そして今後の展開の流れを3段階で紐解きます。",
      "ko": "과거의 영향, 현재의 상황, 향후 미래의 흐름을 3단계로 분석합니다."
    },
    positions: [
      {
        id: 1,
        name: {
          "zh-TW": "過去原因 (Past)",
          "zh-CN": "过去原因 (Past)",
          "en": "Past Root",
          "ja": "過去の要因 (Past)",
          "ko": "과거의 원인 (Past)"
        }
      },
      {
        id: 2,
        name: {
          "zh-TW": "當前現狀 (Present)",
          "zh-CN": "当前现状 (Present)",
          "en": "Present State",
          "ja": "現在の状況 (Present)",
          "ko": "현재의 상황 (Present)"
        }
      },
      {
        id: 3,
        name: {
          "zh-TW": "未來趨勢 (Future)",
          "zh-CN": "未来趋势 (Future)",
          "en": "Future Outcome",
          "ja": "今後の展開 (Future)",
          "ko": "미래의 흐름 (Future)"
        }
      }
    ]
  },

  4: {
    id: "spread_4",
    count: 4,
    name: {
      "zh-TW": "四元素身心靈陣 (Elemental Alignment)",
      "zh-CN": "四元素身心灵阵 (Elemental Alignment)",
      "en": "Four Elements Spread",
      "ja": "4元素スプレッド (心身のバランス)",
      "ko": "4대 원소 리딩 (영육의 균형)"
    },
    description: {
      "zh-TW": "全方位檢視身心靈平衡，分別對應行動、情感、思考與物質現況。",
      "zh-CN": "全方位检视身心灵平衡，分别对应行动、情感、思考与物质现状。",
      "en": "Examines mind, body, and spirit balance across Fire, Water, Air, and Earth energies.",
      "ja": "火・水・風・地の4元素を通して、行動、感情、思考、現実のバランスを診断します。",
      "ko": "불, 물, 바람, 흙의 4대 원소를 통해 행동, 감정, 사고, 현실의 균형을 점검합니다."
    },
    positions: [
      {
        id: 1,
        name: {
          "zh-TW": "火 (行動與意志)",
          "zh-CN": "火 (行动与意志)",
          "en": "Fire - Action & Will",
          "ja": "火 (行動と情熱)",
          "ko": "불 (행동과 의지)"
        }
      },
      {
        id: 2,
        name: {
          "zh-TW": "水 (情感與直覺)",
          "zh-CN": "水 (情感与直觉)",
          "en": "Water - Emotion & Intuition",
          "ja": "水 (感情と直感)",
          "ko": "물 (감정과 직관)"
        }
      },
      {
        id: 3,
        name: {
          "zh-TW": "風 (思維與溝通)",
          "zh-CN": "风 (思维与沟通)",
          "en": "Air - Mind & Logic",
          "ja": "風 (思考と論理)",
          "ko": "바람 (사고와 논리)"
        }
      },
      {
        id: 4,
        name: {
          "zh-TW": "土 (物質與現實)",
          "zh-CN": "土 (物质与现实)",
          "en": "Earth - Matter & Reality",
          "ja": "地 (現実と物質)",
          "ko": "흙 (현실과 물질)"
        }
      }
    ]
  },

  5: {
    id: "spread_5",
    count: 5,
    name: {
      "zh-TW": "五牌深度決策陣 (Deep Decision Spread)",
      "zh-CN": "五牌深度决策阵 (Deep Decision Spread)",
      "en": "Five Card Cross Decision",
      "ja": "5枚引き (深層意思決定スプレッド)",
      "ko": "5장 (심층 의사결정 리딩)"
    },
    description: {
      "zh-TW": "適合面臨重大選擇或陷入瓶頸時，全面剖析優劣勢、盲點與解答。",
      "zh-CN": "适合面临重大选择或陷入瓶颈时，全面剖析优劣势、盲点与解答。",
      "en": "Deeply analyzes key challenges, advantages, hidden blindspots, actionable advice, and final outcomes.",
      "ja": "重要な選択や行き詰まりに直面した際、強み、盲点、具策、最終結果を詳細に分析します。",
      "ko": "중요한 선택이나 난관에 부딪혔을 때 장점, 맹점, 행동 지침, 최종 결과를 다각도로 분석합니다."
    },
    positions: [
      {
        id: 1,
        name: {
          "zh-TW": "當前核心困局",
          "zh-CN": "当前核心困局",
          "en": "Core Problem",
          "ja": "課題の核心",
          "ko": "문제의 핵심"
        }
      },
      {
        id: 2,
        name: {
          "zh-TW": "潛在優勢 / 助力",
          "zh-CN": "潜在优势 / 助力",
          "en": "Advantage / Helper",
          "ja": "潜在的な強み / 助力",
          "ko": "잠재적 장점 / 조력"
        }
      },
      {
        id: 3,
        name: {
          "zh-TW": "潛在劣勢 / 盲點",
          "zh-CN": "潜在劣势 / 盲点",
          "en": "Disadvantage / Blindspot",
          "ja": "盲点 / 注意点",
          "ko": "맹점 / 주의사항"
        }
      },
      {
        id: 4,
        name: {
          "zh-TW": "建議行動方案",
          "zh-CN": "建议行动方案",
          "en": "Recommended Action",
          "ja": "具体的なアドバイス",
          "ko": "구체적 행동 지침"
        }
      },
      {
        id: 5,
        name: {
          "zh-TW": "最終預期結果",
          "zh-CN": "最终预期结果",
          "en": "Final Outcome",
          "ja": "最終的な結果",
          "ko": "최종 예상 결과"
        }
      }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = TAROT_SPREADS_DB;
}