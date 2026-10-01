/* ==========================================================================
   SITAROT - Web Audio API High-Fidelity Audio Engine (js/audio-engine.js)
   零外部音檔加載，純算力合成 528Hz 和弦與真實紙張洗牌聲效
   ========================================================================== */

const TarotAudio = (function () {
  let ctx = null;
  let isMuted = false;

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

  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  // 1. 擬真卡牌滑動聲 (Card Slide - Pink Noise + Dynamic Filter)
  function playDrawSound() {
    if (isMuted) return;
    const ac = getAudioContext();
    if (!ac) return;

    try {
      const duration = 0.15;
      const bufferSize = ac.sampleRate * duration;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.08;
      }

      const noise = ac.createBufferSource();
      noise.buffer = buffer;

      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, ac.currentTime + duration);
      filter.Q.value = 1.8;

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.35, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio playDrawSound error:', e);
    }
  }

  // 2. 翻牌擊打聲 (Flip Snap)
  function playFlipSound() {
    if (isMuted) return;
    const ac = getAudioContext();
    if (!ac) return;

    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.09);

      gain.gain.setValueAtTime(0.45, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start();
      osc.stop(ac.currentTime + 0.09);
    } catch (e) {
      console.warn('Audio playFlipSound error:', e);
    }
  }

  // 3. 洗牌連環滑音 (Shuffle Wave)
  function playShuffleSound() {
    if (isMuted) return;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => playDrawSound(), i * 55);
    }
  }

  // 4. 528Hz 神聖頻率共鳴和弦 (Solfeggio Chime)
  function playChimeSound() {
    if (isMuted) return;
    const ac = getAudioContext();
    if (!ac) return;

    try {
      // 528Hz (Love/DNA Transformation) 和諧疊加
      const freqs = [528.00, 660.00, 792.00, 1056.00];
      freqs.forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ac.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.18, ac.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ac.destination);

        osc.start(ac.currentTime + idx * 0.08);
        osc.stop(ac.currentTime + idx * 0.08 + 1.2);
      });
    } catch (e) {
      console.warn('Audio playChimeSound error:', e);
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