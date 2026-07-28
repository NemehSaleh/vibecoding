import confetti from 'canvas-confetti';

/**
 * Triggers a multi-stage celebratory confetti explosion
 */
export const triggerBadgeConfetti = () => {
  try {
    // Stage 1: Central Burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6']
    });

    // Stage 2: Dual Left & Right Cannon Shots
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#10b981']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#6366f1', '#818cf8', '#c7d2fe', '#ec4899']
      });
    }, 250);
  } catch (err) {
    console.error('Confetti trigger error:', err);
  }
};
