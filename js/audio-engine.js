/* ==========================================================================
   天下第一塔羅牌 - 純 Web Audio API 擬真音效引擎 (js/audio-engine.js)
   零外部音檔依賴、極速載入、支援 iOS/Android 瀏覽器解鎖
   ========================================================================== */

const TarotAudio = (function () {
  let ctx = null;
  let isMuted = false;

  // 1. 初始化 AudioContext (解決 iOS/Chrome 需手勢觸發的限制)
  function getAudioContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  // 2. 切換靜音
  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  // 3. 抽牌聲 (Card Draw / Slide - 粉紅噪音 + 高通濾鏡)
  function playDrawSound() {
    if (isMuted) return;
    const ac = getAudioContext();
    if (!ac) return;

    try {
      const bufferSize = ac.sampleRate * 0.12; // 0.12 秒滑音
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);

      // 生成沙沙聲粉紅噪音 (Pink Noise)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // 音量衰減
        b6 = white * 0.115926;
      }

      const noise = ac.createBufferSource();
      noise.buffer = buffer;

      // 帶通濾鏡 (Bandpass Filter) 模擬紙張摩擦聲
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.12);
      filter.Q.value = 1.5;

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.4, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio playDrawSound failed:', e);
    }
  }

  // 4. 翻牌聲 (Card Flip / Snap - 正弦波打擊 + 低通濾鏡)
  function playFlipSound() {
    if (isMuted) return;
    const ac = getAudioContext();
    if (!ac) return;

    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.08);

      gain.gain.setValueAtTime(0.5, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start();
      osc.stop(ac.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio playFlipSound failed:', e);
    }
  }

  // 5. 洗牌聲 (Shuffle - 連續微小摩擦)
  function playShuffleSound() {
    if (isMuted) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playDrawSound();
      }, i * 65);
    }
  }

  // 6. 聖音 / 完成祝禱音 (Spiritual Chime / Win - 4音階共鳴)
  function playChimeSound() {
    if (isMuted) return;
    const ac = getAudioContext();
    if (!ac) return;

    try {
      // 528Hz (修復頻率) / C5, E5, G5, C6 和弦
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ac.currentTime + i * 0.09);

        gain.gain.setValueAtTime(0.2, ac.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + i * 0.09 + 0.8);

        osc.connect(gain);
        gain.connect(ac.destination);

        osc.start(ac.currentTime + i * 0.09);
        osc.stop(ac.currentTime + i * 0.09 + 0.8);
      });
    } catch (e) {
      console.warn('Audio playChimeSound failed:', e);
    }
  }

  return {
    init: getAudioContext,
    toggleMute,
    playDraw: playDrawSound,
    playFlip: playFlipSound,
    playShuffle: playShuffleSound,
    playChime: playChimeSound
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TarotAudio;
}