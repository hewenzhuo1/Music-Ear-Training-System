import { motion } from 'motion/react';

const notes = ['♪', '♫', '♬', '♩'];

export function FloatingNotes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      {Array.from({ length: 20 }).map((_, i) => {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 10;
        const randomDuration = 15 + Math.random() * 15;
        const randomSize = 20 + Math.random() * 40;

        return (
          <motion.div
            key={i}
            className="absolute text-primary/30"
            style={{
              left: `${randomX}%`,
              fontSize: `${randomSize}px`,
              top: '100%',
            }}
            animate={{
              y: [0, -1200],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: 'linear',
            }}
          >
            {randomNote}
          </motion.div>
        );
      })}
    </div>
  );
}
