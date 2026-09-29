/* ==========================================================================
   Astraea AI Tarot - 78 Cards Complete Database (js/tarot-data.js)
   ========================================================================== */

const TAROT_CARDS_DB = (function () {
  const db = [];

  // 1. 大阿爾克那 Major Arcana (22張)
  const majorNames = [
    {
      id: "major_0",
      nameEn: "The Fool",
      nameZh: "愚者",
      icon: "🃏",
      uprightKeywords: ["新開始", "冒險", "自發性", "潛力", "純真"],
      reversedKeywords: ["輕率", "冒失", "草率決定", "恐懼", "愚蠢"],
      uprightEn: "The Fool represents new beginnings, boundless energy, and taking a leap of faith into the unknown.",
      uprightZh: "愚者象徵全新開始、無畏的冒險精神與無限潛能。勇敢跨出第一步，信任宇宙的安排。",
      reversedEn: "Reversed, The Fool cautions against recklessness, uncalculated risks, or hesitation caused by fear.",
      reversedZh: "逆位的愚者提醒避免衝動行事或衝動下決定。此時應多一份理性評估，切勿盲目冒險。"
    },
    {
      id: "major_1",
      nameEn: "The Magician",
      nameZh: "魔術師",
      icon: "🪄",
      uprightKeywords: ["創造力", "專注", "顯化", "技能", "資源"],
      reversedKeywords: ["欺騙", "技能未顯", "意志薄弱", "延誤", "操弄"],
      uprightEn: "The Magician signifies mastery, resourcefulness, and the power to manifest your desires into reality.",
      uprightZh: "魔術師代表專注、資源整合與將夢想化為現實的創造力。你已具備所需的一切工具。",
      reversedEn: "Reversed Magician warns of illusion, manipulation, or untapped potential due to lack of focus.",
      reversedZh: "逆位魔術師暗示可能存在資訊不透明、幻覺或才華未發揮的情況。宜警惕表面花招。"
    },
    {
      id: "major_2",
      nameEn: "The High Priestess",
      nameZh: "女祭司",
      icon: "🌙",
      uprightKeywords: ["直覺", "潛意識", "神祕", "內在智慧", "靜心"],
      reversedKeywords: ["膚淺", "忽視直覺", "壓抑", "秘密洩漏", "動盪"],
      uprightEn: "The High Priestess guides you to trust your inner voice, intuition, and hidden wisdom.",
      uprightZh: "女祭司引導你傾聽內心的聲音。深層的直覺與內在智慧將為你指明方向，靜心沉澱是最好的解答。",
      reversedEn: "Reversed Priestess indicates disconnected intuition, secrets, or ignoring your inner truth.",
      reversedZh: "逆位女祭司代表忽視了直覺警告，或心神不安、秘密洩漏。請重新回歸內心的平靜。"
    },
    {
      id: "major_3",
      nameEn: "The Empress",
      nameZh: "皇后",
      icon: "👑",
      uprightKeywords: ["豐盛", "滋養", "母性", "美感", "創造力"],
      reversedKeywords: ["過度依賴", "匱乏", "創造力阻塞", "家庭衝突"],
      uprightEn: "The Empress symbolizes fertility, abundance, beauty, and the nourishing power of nature.",
      uprightZh: "皇后代表豐盛、愛與滋養。當前正是收穫美滿、發揮創意與感受生活美好與愛的時刻。",
      reversedEn: "Reversed Empress hints at creative blockages, over-dependence, or feeling unappreciated.",
      reversedZh: "逆位皇后提示可能陷入創造力瓶頸或感情中的過度依賴。學習先好好愛護與滋養自己。"
    },
    {
      id: "major_4",
      nameEn: "The Emperor",
      nameZh: "皇帝",
      icon: "🏛️",
      uprightKeywords: ["權威", "秩序", "架構", "控制", "穩定"],
      reversedKeywords: ["專制", "缺乏自律", "控制狂", "混亂", "剛愎自用"],
      uprightEn: "The Emperor represents structure, leadership, stability, and solid foundational boundaries.",
      uprightZh: "皇帝象徵秩序、權威與堅固的架構。以條理與自律建立明確的目標，展現領導力。",
      reversedEn: "Reversed Emperor suggests abuse of power, lack of discipline, or rigid inflexibility.",
      reversedZh: "逆位皇帝代表可能面臨權力衝突、剛愎自用或規則混亂。宜調整彈性，切勿強加控制。"
    },
    {
      id: "major_5",
      nameEn: "The Hierophant",
      nameZh: "教皇",
      icon: "🔔",
      uprightKeywords: ["傳統", "信仰", "導師", "社會規範", "學習"],
      reversedKeywords: ["打破傳統", "叛逆", "盲從", "新觀點", "束縛"],
      uprightEn: "The Hierophant speaks of spiritual guidance, traditional values, and learning from established systems.",
      uprightZh: "教皇代表智慧指引、傳統規範與心靈導師。跟隨經過時間檢驗的制度或請教前輩將獲益良多。",
      reversedEn: "Reversed Hierophant challenges dogma, encouraging unconventional thinking or freedom from rigid beliefs.",
      reversedZh: "逆位教皇鼓勵突破陳腐觀念與僵化教條。大膽質疑現狀，尋求適合自己的創新道路。"
    },
    {
      id: "major_6",
      nameEn: "The Lovers",
      nameZh: "戀人",
      icon: "💕",
      uprightKeywords: ["愛與和諧", "選擇", "契合", "價值觀", "夥伴關係"],
      reversedKeywords: ["失衡", "價值觀衝突", "不協調", "猶豫擇一"],
      uprightEn: "The Lovers celebrates profound connection, harmony, shared values, and critical life choices.",
      uprightZh: "戀人牌象徵深深的連結、和諧的夥伴關係與重大選擇。遵循內心真正的價值觀做出決定。",
      reversedEn: "Reversed Lovers points to misalignment in relationships, bad choices, or internal conflict.",
      reversedZh: "逆位戀人代表價值觀分歧、溝通失衡或抉擇時的逃避。需要誠實面對雙方真正的需求。"
    },
    {
      id: "major_7",
      nameEn: "The Chariot",
      nameZh: "戰車",
      icon: "🛡️",
      uprightKeywords: ["意志力", "勝利", "克服障礙", "專注目標", "推進"],
      reversedKeywords: ["失控", "方向迷失", "衝動", "阻力", "挫折"],
      uprightEn: "The Chariot signifies determination, focus, and triumph over obstacles through sheer willpower.",
      uprightZh: "戰車代表堅強的意志力、掌控局勢與克服萬難的決心。維持專注，勝利就在前方。",
      reversedEn: "Reversed Chariot warns of losing direction, feeling powerless, or reckless aggressive actions.",
      reversedZh: "逆位戰車警示失控、情緒衝動或方向偏離。此時應暫停腳步，重新掌控內心的韁繩。"
    },
    {
      id: "major_8",
      nameEn: "Strength",
      nameZh: "力量",
      icon: "🦁",
      uprightKeywords: ["內在力量", "勇氣", "耐心", "包容", "柔能克剛"],
      reversedKeywords: ["自我懷疑", "軟弱", "情緒失控", "急躁"],
      uprightEn: "Strength honors gentle courage, compassion, emotional mastery, and inner resilience.",
      uprightZh: "力量象徵柔能克剛的內在勇氣與耐心。用愛與包容化解衝突，遠比強硬更有力量。",
      reversedEn: "Reversed Strength indicates inner doubt, raw emotion, or feeling overwhelmed by external pressures.",
      reversedZh: "逆位力量代表自我懷疑或情緒失控。請重新找回內心的平靜，相信自己的堅韌能力。"
    },
    {
      id: "major_9",
      nameEn: "The Hermit",
      nameZh: "隱士",
      icon: "🕯️",
      uprightKeywords: ["內省", "獨處", "尋求真理", "引路燈塔", "沉思"],
      reversedKeywords: ["孤立", "疏離", "偏執", "拒絕指引"],
      uprightEn: "The Hermit invites introspection, quiet solitude, and seeking truth away from worldly distractions.",
      uprightZh: "隱士召喚你進行深度內省。暫時退離人群的喧囂，在安靜中尋找屬於自己的真理燈塔。",
      reversedEn: "Reversed Hermit cautions against unhealthy loneliness, isolation, or stubborn refusal of advice.",
      reversedZh: "逆位隱士警告孤立過度或走向偏執。適時向外伸出求助手掌，不要將自己封閉。"
    },
    {
      id: "major_10",
      nameEn: "Wheel of Fortune",
      nameZh: "命運之輪",
      icon: "🎡",
      uprightKeywords: ["運勢轉變", "契機", "因果", "循環", "命運"],
      reversedKeywords: ["抗拒改變", "低潮", "幸運受阻", "重複錯誤"],
      uprightEn: "The Wheel of Fortune turns in your favor, bringing sudden shifts, good luck, and cosmic cycles.",
      uprightZh: "命運之輪正在旋轉，帶來命運的轉折與幸運的契機。順應自然的流轉，把握改變的良機。",
      reversedEn: "Reversed Wheel shows feeling stuck, resisting inevitable change, or experiencing temporary setbacks.",
      reversedZh: "逆位命運之輪代表遭遇暫時的低潮或抗拒改變。理解循環順逆，放鬆心態等待時機重來。"
    },
    {
      id: "major_11",
      nameEn: "Justice",
      nameZh: "正義",
      icon: "⚖️",
      uprightKeywords: ["公平", "真相", "因果報應", "客觀", "法律/合約"],
      reversedKeywords: ["不公", "偏見", "逃避責任", "不誠實"],
      uprightEn: "Justice embodies truth, fairness, cause and effect, and making balanced, honest decisions.",
      uprightZh: "正義代表客觀、公正與因果法則。以誠實與理性的態度面對挑戰，你的行為將帶來公正的結果。",
      reversedEn: "Reversed Justice highlights unfairness, dishonesty, or avoiding accountability for past actions.",
      reversedZh: "逆位正義提示可能面臨不公待遇或試圖逃避責任。勇敢承擔並校正偏差才能恢復平衡。"
    },
    {
      id: "major_12",
      nameEn: "The Hanged Man",
      nameZh: "倒吊人",
      icon: "🙃",
      uprightKeywords: ["臣服", "換位思考", "犧牲", "暫停", "新視角"],
      reversedKeywords: ["無謂犧牲", "拖延", "掙扎", "固執"],
      uprightEn: "The Hanged Man asks you to surrender, pause, and view your situation from a completely new angle.",
      uprightZh: "倒吊人提示順應臣服與換位思考。主動暫停衝刺，從全新的視角審視人生，反而能獲得大智慧。",
      reversedEn: "Reversed Hanged Man warns of useless martyrdom, procrastination, or resisting necessary pauses.",
      reversedZh: "逆位倒吊人代表無謂的犧牲或拖延。若只是停留在原地掙扎，請果斷採取行動打破僵局。"
    },
    {
      id: "major_13",
      nameEn: "Death",
      nameZh: "死神",
      icon: "🥀",
      uprightKeywords: ["結束", "轉變", "重生", "放下舊事物", "蛻變"],
      reversedKeywords: ["恐懼改變", "死守過往", "沉淪", "過渡期拉長"],
      uprightEn: "Death marks the natural end of a major cycle, opening the door for profound transformation and rebirth.",
      uprightZh: "死神象徵舊事物的終結與嶄新的重生。勇於放下不再適合你的過去，才能迎來美麗的蛻變。",
      reversedEn: "Reversed Death indicates holding onto what must be released, fearing change, or stalling rebirth.",
      reversedZh: "逆位死神代表對改變的恐懼，強行死守早已結束的事物。學會放手，生命才能重新流動。"
    },
    {
      id: "major_14",
      nameEn: "Temperance",
      nameZh: "節制",
      icon: "🕊️",
      uprightKeywords: ["平衡", "中庸", "調和", "耐心", "靈魂整合"],
      reversedKeywords: ["極端", "失衡", "過度", "衝突", "缺乏耐心"],
      uprightEn: "Temperance encourages moderation, patience, inner harmony, and blending opposing forces gently.",
      uprightZh: "節制牌帶來和諧與平衡的能量。保持中庸之道與耐心，巧妙地整合不同的資源與觀點。",
      reversedEn: "Reversed Temperance reflects imbalance, excess, impatience, or discordant conflict in daily life.",
      reversedZh: "逆位節制代表生活失去平衡，陷入極端或過度消費/消耗。請調整步調，恢復節奏。"
    },
    {
      id: "major_15",
      nameEn: "The Devil",
      nameZh: "惡魔",
      icon: "🔥",
      uprightKeywords: ["執著", "慾望", "物質束縛", "癮頭", "限制"],
      reversedKeywords: ["掙脫枷鎖", "覺醒", "奪回主導權", "釋放"],
      uprightEn: "The Devil exposes unhealthy attachments, illusions of entrapment, and over-obsession with material desires.",
      uprightZh: "惡魔牌揭示了誘惑、執著與物質枷鎖。意識到這些限制往往是自己設下的，你隨時有權離場。",
      reversedEn: "Reversed Devil signals breaking free from toxic patterns, overcoming addiction, and regaining freedom.",
      reversedZh: "逆位惡魔象徵從負面關係或癮頭中覺醒。你正逐漸掙脫枷鎖，重獲內心的自由與主導權。"
    },
    {
      id: "major_16",
      nameEn: "The Tower",
      nameZh: "高塔",
      icon: "⚡",
      uprightKeywords: ["突然變革", "幻滅", "體制崩解", "覺醒", "突破"],
      reversedKeywords: ["災難延後", "抗拒轉變", "隱瞞危機"],
      uprightEn: "The Tower brings sudden upheaval, shattering illusions to rebuild on solid, genuine truths.",
      uprightZh: "高塔代表衝擊性的突然變革與舊體制的崩解。雖然帶來震驚，但這是在為真實的重建掃清障礙。",
      reversedEn: "Reversed Tower implies avoiding a necessary crisis or delaying an inevitable downfall.",
      reversedZh: "逆位高塔代表試圖延緩 inevitability 的危機爆發。掩蓋問題無法解決根源，宜勇敢面對。"
    },
    {
      id: "major_17",
      nameEn: "The Star",
      nameZh: "星星",
      icon: "⭐",
      uprightKeywords: ["希望", "信心", "療癒", "靈感", "平靜"],
      reversedKeywords: ["絕望", "失去信心", "沮喪", "懷疑未來"],
      uprightEn: "The Star pours hope, spiritual healing, renewed faith, and radiant inspiration after the storm.",
      uprightZh: "星星牌風雨過後注入溫柔的希望與療癒。對未來保持信心，靈感與光明正引領著你。",
      reversedEn: "Reversed Star warns of hopelessness, discouragement, or doubting your own divine guidance.",
      reversedZh: "逆位星星代表暫時的信心喪失或陷入沮喪情緒。請提醒自己，星光依然在黑夜中閃耀。"
    },
    {
      id: "major_18",
      nameEn: "The Moon",
      nameZh: "月亮",
      icon: "🌕",
      uprightKeywords: ["直覺", "不安", "潛意識", "幻象", "迷霧"],
      reversedKeywords: ["撥雲見日", "克服恐懼", "揭開真相"],
      uprightEn: "The Moon reveals illusions, anxieties, active dreams, and navigating through unchartered emotional fog.",
      uprightZh: "月亮牌照亮潛意識的迷霧與內心不安。不要被幻想與未知的恐懼嚇倒，依靠直覺緩步前行。",
      reversedEn: "Reversed Moon signals the dissipation of confusion, uncovering truths, and overcoming hidden fears.",
      reversedZh: "逆位月亮代表迷霧逐漸散去，真相浮出水面。不安與恐懼被解開，心境重新變得清晰。"
    },
    {
      id: "major_19",
      nameEn: "The Sun",
      nameZh: "太陽",
      icon: "☀️",
      uprightKeywords: ["成功", "喜悅", "活力", "光明", "自信"],
      reversedKeywords: ["暫時陰霾", "過度自信", "延遲的喜悅"],
      uprightEn: "The Sun radiates pure warmth, vitality, joy, celebration, and absolute clarity of success.",
      uprightZh: "太陽牌帶來無與倫比的光明、活力與成功的喜悅。充滿自信地展現自我，溫暖周圍的人。",
      reversedEn: "Reversed Sun still carries positivity, though dimmed slightly by pessimism or small delays.",
      reversedZh: "逆位太陽依然具有正面能量，只是成果可能略有延遲，或是內心被微小的悲觀情緒遮蔽。"
    },
    {
      id: "major_20",
      nameEn: "Judgement",
      nameZh: "審判",
      icon: "🎺",
      uprightKeywords: ["召喚", "覺醒", "重大決定", "重生", "總結"],
      reversedKeywords: ["自我批判", "猶豫過度", "錯失良機"],
      uprightEn: "Judgement calls for spiritual awakening, evaluating life choices, and stepping into higher purpose.",
      uprightZh: "審判牌聽見了靈魂的召喚。這是總結過去、做出重大決定並開啟全新生命篇章的關鍵時刻。",
      reversedEn: "Reversed Judgement hints at harsh self-doubt, ignoring your inner calling, or delaying choices.",
      reversedZh: "逆位審判代表過度自我批判或猶豫不決。不要讓過去的愧疚拖累你邁向未來的腳步。"
    },
    {
      id: "major_21",
      nameEn: "The World",
      nameZh: "世界",
      icon: "🌍",
      uprightKeywords: ["完成", "圓滿", "成就", "統合", "旅行/世界"],
      reversedKeywords: ["未竟之業", "拖延尾聲", "缺乏成就感"],
      uprightEn: "The World honors full closure, wholeness, grand achievement, and the completion of a major journey.",
      uprightZh: "世界牌象徵旅程的大圓滿與豐碩成果。你順利完成了階段性使命，準備迎接下一個精彩循環。",
      reversedEn: "Reversed World indicates incomplete business, lack of closure, or struggling across the finish line.",
      reversedZh: "逆位世界代表距離成功只差臨門一腳，或對圓滿感到遺憾。補齊最後一步就能圓滿交卷。"
    }
  ];

  majorNames.forEach((item) => db.push(item));

  // 2. 小阿爾克那 Minor Arcana (56張)
  const suits = [
    { nameEn: "Wands", nameZh: "權杖", icon: "🪄", element: "火 (行動力/事業)" },
    { nameEn: "Cups", nameZh: "聖盃", icon: "🍷", element: "水 (情感/人際)" },
    { nameEn: "Swords", nameZh: "寶劍", icon: "🗡️", element: "風 (理智/思考)" },
    { nameEn: "Pentacles", nameZh: "星幣", icon: "🪙", element: "土 (物質/財富)" }
  ];

  const ranks = [
    {
      num: "Ace",
      zh: "一",
      up: ["新突破", "潛能點燃", "起點"],
      rev: ["缺乏動力", "起步延遲", "阻礙"]
    },
    {
      num: "2",
      zh: "二",
      up: ["規劃未來", "抉擇", "合作夥伴"],
      rev: ["猶豫不決", "不平衡", "計劃延誤"]
    },
    {
      num: "3",
      zh: "三",
      up: ["擴展遠景", "團隊成果", "進展"],
      rev: ["合作溝通不良", "延誤", "孤立"]
    },
    {
      num: "4",
      zh: "四",
      up: ["穩定安居", "慶祝", "成果鞏固"],
      rev: ["家庭小摩擦", "不穩定", "短暫不安"]
    },
    {
      num: "5",
      zh: "五",
      up: ["競爭衝突", "意見分歧", "挑戰"],
      rev: ["化解衝突", "和解", "避開爭執"]
    },
    {
      num: "6",
      zh: "六",
      up: ["勝利獲勝", "獲得認可", "榮譽"],
      rev: ["短暫挫折", "缺乏認同", "驕傲自滿"]
    },
    {
      num: "7",
      zh: "七",
      up: ["堅守陣地", "防禦抗壓", "毅力"],
      rev: ["力不從心", "棄守", "壓力過重"]
    },
    {
      num: "8",
      zh: "八",
      up: ["快速推進", "訊息傳遞", "行動迅速"],
      rev: ["溝通誤解", "延誤滯留", "混亂"]
    },
    {
      num: "9",
      zh: "九",
      up: ["堅持到底", "最後考驗", "防備力"],
      rev: ["疲憊不堪", "過度防備", "固執頑抗"]
    },
    {
      num: "10",
      zh: "十",
      up: ["責任重擔", "極限挑戰", "終點將至"],
      rev: ["卸下重擔", "委託他人", "崩潰過載"]
    },
    {
      num: "Page",
      zh: "侍者",
      up: ["好奇探索", "新訊息", "學習熱情"],
      rev: ["不成熟", "訊息誤導", "缺乏定性"]
    },
    {
      num: "Knight",
      zh: "騎士",
      up: ["勇往直前", "熱情衝刺", "行動力"],
      rev: ["衝動魯莽", "缺乏耐性", "後勁不足"]
    },
    {
      num: "Queen",
      zh: "王后",
      up: ["自信魅力", "溫暖滋養", "獨立智慧"],
      rev: ["情緒化", "嫉妒控制", "缺乏自信"]
    },
    {
      num: "King",
      zh: "國王",
      up: ["成熟領導", "掌控大局", "權威專業"],
      rev: ["專制獨裁", "衝動包庇", "嚴苛冷酷"]
    }
  ];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      const isZhName = `${suit.nameZh}${rank.zh}`;
      const isEnName = `${rank.num} of ${suit.nameEn}`;

      db.push({
        id: `${suit.nameEn.toLowerCase()}_${rank.num.toLowerCase()}`,
        nameEn: isEnName,
        nameZh: isZhName,
        icon: suit.icon,
        uprightKeywords: rank.up,
        reversedKeywords: rank.rev,
        uprightEn: `The ${isEnName} represents active ${suit.element} energy in its ${rank.zh} stage, focusing on ${rank.up.join(", ")}.`,
        uprightZh: `【${isZhName}】正位：展現出${suit.element}能量的流暢運作，重點聚焦於：${rank.up.join("、")}。`,
        reversedEn: `Reversed ${isEnName} suggests friction or blockage in ${suit.element} matters: ${rank.rev.join(", ")}.`,
        reversedZh: `【${isZhName}】逆位：提醒留意${suit.element}方面的能量停滯或阻礙：${rank.rev.join("、")}。`
      });
    });
  });

  return db;
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = TAROT_CARDS_DB;
}