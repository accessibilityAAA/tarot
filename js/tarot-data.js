/* ==========================================================================
   SITAROT - 78張塔羅牌完整核心資料庫 (js/tarot-data.js)
   包含 22 張大阿爾克那與 56 張小阿爾克那完整牌義、關鍵字與解讀文本
   ========================================================================== */

const TAROT_CARDS_DB = [
  // --------------------------------------------------------------------------
  // 大阿爾克那 (Major Arcana 0-21)
  // --------------------------------------------------------------------------
  { id: "the-fool", num: 0, nameZh: "愚者", nameEn: "The Fool", element: "風", 
    keywords: { upright: ["冒險", "純真", "新開始", "自由"], reversed: ["魯莽", "逃避", "缺乏規劃", "危險"] },
    uprightZh: "象徵純粹、毫無心理包袱的新起點。拋開過往防備，以純真與好奇擁抱未知的可能性。",
    reversedZh: "警示草率冒進或因為逃避現實而做出不智決定，需要建立現實的安全邊界。"
  },
  { id: "the-magician", num: 1, nameZh: "魔術師", nameEn: "The Magician", element: "風", 
    keywords: { upright: ["創造力", "顯化", "資源整合", "主動"], reversed: ["欺瞞", "花言巧語", "能力浪費", "盲點"] },
    uprightZh: "具備成功所需的一切工具與資源，專注於目標進行整合，就能化想法為具體現實。",
    reversedZh: "注意訊息的真實性，避免被表面的花言巧語所蒙蔽，或警示才華未能正確展現。"
  },
  { id: "the-high-priestess", num: 2, nameZh: "女祭司", nameEn: "The High Priestess", element: "水", 
    keywords: { upright: ["直覺", "潛意識", "靜心", "沉澱"], reversed: ["壓抑", "猜忌", "直覺封閉", "冷漠"] },
    uprightZh: "答案早已在你心中。靜下心來傾聽內在直覺，勝過外界無謂的嘈雜聲音。",
    reversedZh: "情緒過度壓抑或忽視了內心的警告，容易因為猜忌與疏離而錯失核心真實。"
  },
  { id: "the-empress", num: 3, nameZh: "皇后", nameEn: "The Empress", element: "土", 
    keywords: { upright: ["豐盛", "滋養", "愛", "創造力"], reversed: ["控制欲", "過度依賴", "耗竭", "浪費"] },
    uprightZh: "代表極致的豐盛與愛的滋養。計畫結出纍纍碩果，盡情享受生命的慷慨饋贈。",
    reversedZh: "警示窒息式的控制或過度討好，容易在關係中耗盡自己的心靈能量。"
  },
  { id: "the-emperor", num: 4, nameZh: "皇帝", nameEn: "The Emperor", element: "火", 
    keywords: { upright: ["秩序", "責任", "穩固", "領導力"], reversed: ["專制", "剛愎自用", "控制狂", "混亂"] },
    uprightZh: "展現強大的邏輯秩序與擔當力。建立明確規矩與穩固基礎，能掌握全盤局勢。",
    reversedZh: "警示過度僵化或專制獨裁，硬碰硬只會讓溝通陷入僵局與對立。"
  },
  { id: "the-hierophant", num: 5, nameZh: "教皇", nameEn: "The Hierophant", element: "土", 
    keywords: { upright: ["引導", "傳統", "貴人", "信仰"], reversed: ["墨守成規", "理念衝突", "權威壓迫", "叛逆"] },
    uprightZh: "代表體制引導與貴人相助。遵循成熟經驗或尋求專業建議，能獲得方向。",
    reversedZh: "打破不合理的死板規範，不要為了迎合權威或傳統而委屈真實的自己。"
  },
  { id: "the-lovers", num: 6, nameZh: "戀人", nameEn: "The Lovers", element: "風", 
    keywords: { upright: ["和諧", "靈魂吸引", "抉擇", "合作"], reversed: ["價值觀分歧", "逃避選擇", "隔閡", "失衡"] },
    uprightZh: "代表心靈的和諧連結與真誠合作。面臨重要抉擇時，選擇符合靈魂價值的道路。",
    reversedZh: "價值觀出現分歧或內部溝通斷層，切忌因為恐懼而延遲必要的溝通。"
  },
  { id: "the-chariot", num: 7, nameZh: "戰車", nameEn: "The Chariot", element: "水", 
    keywords: { upright: ["意志力", "突破", "勝利", "方向"], reversed: ["失控", "方向迷失", "情緒衝動", "挫折"] },
    uprightZh: "以堅定的意志力統合衝突力量，克服眼前的挑戰，朝著目標勇敢前進。",
    reversedZh: "警示失控與情緒化衝動，當前的拉扯需要先停下校準方向，切忌盲目硬闖。"
  },
  { id: "strength", num: 8, nameZh: "力量", nameEn: "Strength", element: "火", 
    keywords: { upright: ["以柔克剛", "勇氣", "包容", "自律"], reversed: ["自卑", "內心恐懼", "軟弱", "失去耐性"] },
    uprightZh: "真正的強大來自內心的慈悲與耐性。以柔克剛，能撫平最躁動的狂野能量。",
    reversedZh: "被內在的恐懼與自卑感佔據，需要重拾對自己的信任，給予自我溫柔包容。"
  },
  { id: "the-hermit", num: 9, nameZh: "隱士", nameEn: "The Hermit", element: "土", 
    keywords: { upright: ["內省", "尋求真理", "沉澱", "智慧"], reversed: ["孤立", "逃避現實", "孤僻", "隔絕"] },
    uprightZh: "暫時退回內在的平靜城堡。這是一段尋找自我真理、進行深度思考的黃金沉澱期。",
    reversedZh: "過度孤立排外或陷入自憐情緒，試著敞開心扉，適度接受外界的溫暖與協助。"
  },
  { id: "wheel-of-fortune", num: 10, nameZh: "命運之輪", nameEn: "Wheel of Fortune", element: "火", 
    keywords: { upright: ["轉機", "順應時勢", "宇宙契機", "循環"], reversed: ["抗拒改變", "低潮", "重複循環", "阻礙"] },
    uprightZh: "宇宙的輪盤正在轉動！順應時勢與轉機，把握不可多得的命運契機。",
    reversedZh: "抗拒改變只會增加痛苦。接納短暫的低潮，這是在為下一波起飛蓄積能量。"
  },
  { id: "justice", num: 11, nameZh: "正義", nameEn: "Justice", element: "風", 
    keywords: { upright: ["客觀", "公平", "因果", "理性"], reversed: ["偏頗", "逃避責任", "不公", "審判失衡"] },
    uprightZh: "以理性客觀的角度衡量一切。種什麼因得什麼果，誠實面對能帶來最公正的平衡。",
    reversedZh: "警示不對等的對待或試圖掩蓋失誤，逃避責任只會讓局勢變得更加複雜。"
  },
  { id: "the-hanged-man", num: 12, nameZh: "倒吊人", nameEn: "The Hanged Man", element: "水", 
    keywords: { upright: ["換位思考", "臣服", "等待時機", "覺察"], reversed: ["無謂犧牲", "死板固執", "拖延", "麻木"] },
    uprightZh: "換個倒立的角度看世界，局勢將豁然開朗。主動臣服於當下，等待最佳時機。",
    reversedZh: "警示做無謂的委屈與犧牲，如果固執不願改變舊思維，只會陷入毫無意義的拖延。"
  },
  { id: "death", num: 13, nameZh: "死神", nameEn: "Death", element: "水", 
    keywords: { upright: ["重生", "階段結束", "蛻變", "放下"], reversed: ["抗拒結束", "拖泥帶水", "恐懼改變", "停滯"] },
    uprightZh: "舊有的階段徹底結束，迎來靈魂的深刻重生。勇敢放下過去，才能擁抱新篇章。",
    reversedZh: "強行抱著早已枯萎的舊事物不放，恐懼改變會讓你錯過早日重生的機會。"
  },
  { id: "temperance", num: 14, nameZh: "節制", nameEn: "Temperance", element: "火", 
    keywords: { upright: ["調和", "和諧溝通", "淨化", "適中"], reversed: ["失衡", "溝通不順", "極端", "揮霍"] },
    uprightZh: "代表完美的調和與靈魂轉換。透過溫和對等流動，能將混亂淨化為和諧。",
    reversedZh: "生活或關係出現極端失衡，溝通出現代溝，需要重新調整生活節奏與心態。"
  },
  { id: "the-devil", num: 15, nameZh: "惡魔", nameEn: "The Devil", element: "土", 
    keywords: { upright: ["執著", "慾望", "心靈枷鎖", "束縛"], reversed: ["覺醒解脫", "打破枷鎖", "擺脫控制", "重生"] },
    uprightZh: "警示被物質慾望或不健康的心理執著所牽絆，鎖鏈其實是鬆的，關鍵在於你是否想開。",
    reversedZh: "意識到有毒關係或不健康習慣的危害，正在展現覺醒的力量，打破枷鎖獲取自由。"
  },
  { id: "the-tower", num: 16, nameZh: "高塔", nameEn: "The Tower", element: "火", 
    keywords: { upright: ["破除假象", "突發劇變", "覺醒", "重構"], reversed: ["掩耳盜鈴", "危機延緩", "強行支撐", "恐懼"] },
    uprightZh: "強烈但必要的覺醒！虛假的伪裝與不穩固的基礎被擊碎，讓真正的聖殿能重新重建。",
    reversedZh: "試圖掩蓋已經產生的裂痕，掩耳盜鈴只會延緩危機爆發，請坦然面對現實。"
  },
  { id: "the-star", num: 17, nameZh: "星星", nameEn: "The Star", element: "風", 
    keywords: { upright: ["希望", "心靈療癒", "信念", "平靜"], reversed: ["悲觀", "信心危機", "失去期待", "沮喪"] },
    uprightZh: "暴風雨後的溫柔曙光。保持純粹的信任與希望，靈魂正獲得深度的滋養與療癒。",
    reversedZh: "陷入短暫的信心危機或悲觀情緒中，請記得：即使雲層遮蔽，星光依然在為你閃耀。"
  },
  { id: "the-moon", num: 18, nameZh: "月亮", nameEn: "The Moon", element: "水", 
    keywords: { upright: ["潛意識不安", "迷霧", "直覺考驗", "幻想"], reversed: ["迷霧散去", "真相大白", "清醒", "釋懷"] },
    uprightZh: "映照出潛意識深處的恐懼與迷霧。不要被想像出來的陰影嚇倒，信任直覺指引。",
    reversedZh: "困擾已久的迷霧終於散去，真相大白，內心的不安與疑慮逐步獲得釋懷。"
  },
  { id: "the-sun", num: 19, nameZh: "太陽", nameEn: "The Sun", element: "火", 
    keywords: { upright: ["喜悅", "成功", "光明", "生命力"], reversed: ["熱情稍退", "延遲成功", "過度自負", "短暫陰霾"] },
    uprightZh: "充滿光明與生命的極致喜悅！一切顯得坦蕩清晰，目標順利達成，成功唾手可得。",
    reversedZh: "雖然進度稍有延遲或熱情降溫，但光明依然存在，調整步調即可重拾活力。"
  },
  { id: "judgement", num: 20, nameZh: "審判", nameEn: "Judgement", element: "火", 
    keywords: { upright: ["靈魂覺醒", "重大召喚", "清晰抉擇", "重生"], reversed: ["自我懷疑", "懊悔過去", "錯失良機", "猶豫"] },
    uprightZh: "聽見來自靈魂深處的召喚。這是總結過去、清醒做出人生重大決定的轉折時刻。",
    reversedZh: "陷入對過去失誤的自我懷疑與懊悔中，猶豫不決會讓你錯過眼前的突破良機。"
  },
  { id: "the-world", num: 21, nameZh: "世界", nameEn: "The World", element: "土", 
    keywords: { upright: ["圓滿", "達成目標", "完美統合", "新循環"], reversed: ["未竟之業", "缺乏突破", "功虧一潰", "最後一哩路"] },
    uprightZh: "象徵階段性的完美圓滿與大統合！內在與外在達到和諧，準備優雅邁入下一個新循環。",
    reversedZh: "離成功只差最後一哩路，檢視是否有未竟之業或細節疏漏，補齊即可達成圓滿。"
  },

  // --------------------------------------------------------------------------
  // 小阿爾克那 - 權杖組 (Wands 1-14)
  // --------------------------------------------------------------------------
  { id: "ace-of-wands", nameZh: "權杖一", nameEn: "Ace of Wands", element: "火",
    keywords: { upright: ["熱情衝勁", "新計畫", "靈感", "生命力"], reversed: ["動力不足", "延遲", "三分鐘熱度", "挫折"] },
    uprightZh: "點燃新計畫與熱情的火花！心中充滿靈感與行動力，是開創事業的黃金起點。",
    reversedZh: "出現三分鐘熱度或動力脫節的情況，需要重新找回最初的熱情與明確方向。"
  },
  { id: "two-of-wands", nameZh: "權杖二", nameEn: "Two of Wands", element: "火",
    keywords: { upright: ["遠見", "規劃", "跨出舒適圈", "抉擇"], reversed: ["猶豫不決", "局限", "害怕未知", "保守"] },
    uprightZh: "站在高處進行長遠的規劃與佈局。你已掌握既有成果，準備勇敢跨出舒適圈。",
    reversedZh: "因為害怕未知的風險而縮回安全區，猶豫不決會讓你錯失擴展版圖的良機。"
  },
  { id: "three-of-wands", nameZh: "權杖三", nameEn: "Three of Wands", element: "火",
    keywords: { upright: ["擴展", "遠景實現", "合作", "展望"], reversed: ["合作卡關", "延誤", "眼光短淺", "溝通脫節"] },
    uprightZh: "遠航的船隻正在駛回成果！事業與計畫進入實質擴展期，眼光放遠收穫無量。",
    reversedZh: "計畫進度面臨延誤或海外/跨界合作不順，需要重新檢視供應鏈與團隊溝通。"
  },
  { id: "four-of-wands", nameZh: "權杖四", nameEn: "Four of Wands", element: "火",
    keywords: { upright: ["慶祝", "穩固安居", "和諧家庭", "階段成功"], reversed: ["不穩定", "內部不和", "暫時停滯", "過渡期"] },
    uprightZh: "值得歡慶的階段性勝利！建立了穩固的安全城堡，無論家庭或團隊皆呈現和諧氣氛。",
    reversedZh: "內部出現短暫的步調不一或基礎不穩，需要投入時間處理家庭或團隊內部的細節。"
  },

  // --------------------------------------------------------------------------
  // 小阿爾克那 - 聖盃組 (Cups 1-14)
  // --------------------------------------------------------------------------
  { id: "ace-of-cups", nameZh: "聖盃一", nameEn: "Ace of Cups", element: "水",
    keywords: { upright: ["情感流動", "愛與關懷", "靈性滋養", "和諧"], reversed: ["情感壓抑", "心碎", "付出失衡", "冷漠"] },
    uprightZh: "愛與情感的泉湧而出！心靈獲得充沛的滋養，適合開啟一段美好的情感或藝術創作。",
    reversedZh: "感覺情緒枯竭或付出得不到回應，需要先把這份愛與關懷轉向滋養你自己。"
  },
  { id: "two-of-cups", nameZh: "聖盃二", nameEn: "Two of Cups", element: "水",
    keywords: { upright: ["互相吸引", "和諧夥伴", "平等溝通", "契合"], reversed: ["溝通脫節", "衝突", "關係失衡", "疏離"] },
    uprightZh: "彼此心靈的高度契合與互相吸引。建立在平等、尊重與真誠基礎上的和諧關係。",
    reversedZh: "溝通出現誤解或利益衝突，雙方心態出現不對等，需要重新開誠布公坦誠相對。"
  },

  // --------------------------------------------------------------------------
  // 小阿爾克那 - 寶劍組 (Swords 1-14)
  // --------------------------------------------------------------------------
  { id: "ace-of-swords", nameZh: "寶劍一", nameEn: "Ace of Swords", element: "風",
    keywords: { upright: ["突破", "理智清晰", "真相", "決斷力"], reversed: ["混亂", "偏見", "言語傷害", "思考卡關"] },
    uprightZh: "理智與決斷力的雙面寶劍！撥開迷霧看清真相，以極高的智慧與邏輯破除障礙。",
    reversedZh: "思考陷入混亂與偏見中，注意過度犀利的言詞傷害到身邊真正關心你的人。"
  },
  { id: "three-of-swords", nameZh: "寶劍三", nameEn: "Three of Swords", element: "風",
    keywords: { upright: ["心碎", "悲傷釋放", "現實痛感", "療癒契機"], reversed: ["走過陣痛", "接納傷痛", "逐漸復原", "寬恕"] },
    uprightZh: "經歷現實帶來的陣痛與心碎。不要壓抑淚水，允許悲傷流動，這是徹底療癒的開端。",
    reversedZh: "陣痛期正在過去，你開始學會接納過去的傷害與寬恕，心靈正逐步重獲新生。"
  },

  // --------------------------------------------------------------------------
  // 小阿爾克那 - 星幣組 (Pentacles 1-14)
  // --------------------------------------------------------------------------
  { id: "ace-of-pentacles", nameZh: "星幣一", nameEn: "Ace of Pentacles", element: "土",
    keywords: { upright: ["物質契機", "實質回報", "穩固起點", "豐盛"], reversed: ["錯失良機", "財務透支", "基礎不穩", "短視"] },
    uprightZh: "宇宙遞來的一枚實質金幣！代表極具潛力的財務、事業或健康方面的實質新契機。",
    reversedZh: "警示財務規劃不當或投資視角過於短視，需要重新檢視預算與風險控制。"
  },
  { id: "ten-of-pentacles", nameZh: "星幣十", nameEn: "Ten of Pentacles", element: "土",
    keywords: { upright: ["家族豐盛", "長期安定", "資產傳承", "圓滿"], reversed: ["家族爭執", "資產風險", "財務負擔", "基礎動搖"] },
    uprightZh: "物質與家族圓滿的頂峰！享有長期穩固的資產安全感與物質豐盛，基業長青。",
    reversedZh: "注意家族或團隊內部的財務爭執，或是因為過度重視物質而忽視了情感連結。"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TAROT_CARDS_DB;
}