import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';

export function StageLoader() {
  const { active, progress } = useProgress();
  const loading = active || progress < 100;

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#2a2019]/58 backdrop-blur-[3px]"
        >
          <div className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[#e6d4ba]/20" />
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#e6c79a]/85 border-r-[#e6c79a]/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="font-serif text-[16px] text-[#ead8bc]">器</span>
          </div>
          <div className="text-center">
            <p className="font-serif text-[15px] tracking-[0.18em] text-[#f4eadb]">
              正在唤醒器物
            </p>
            <p className="mt-1 text-[10px] tracking-[0.12em] text-[#c8b7a2]">
              解析 GLB · 校准贴花曲面 · {Math.round(progress)}%
            </p>
          </div>
          <div className="h-[2px] w-36 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-[#d8b98f]"
              animate={{ width: `${Math.max(6, progress)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
