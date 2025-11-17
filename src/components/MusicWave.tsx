import { motion } from 'motion/react';

interface Props {
  isPlaying?: boolean;
}

export function MusicWave({ isPlaying = false }: Props) {
  const bars = Array.from({ length: 5 });

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
          initial={{ height: '20%' }}
          animate={
            isPlaying
              ? {
                  height: ['20%', '100%', '40%', '80%', '30%'],
                  transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  },
                }
              : { height: '20%' }
          }
        />
      ))}
    </div>
  );
}
