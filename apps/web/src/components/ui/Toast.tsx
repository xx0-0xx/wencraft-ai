import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-1/2 z-[80] flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-3 rounded-xl border border-line/80 bg-surface/95 px-4 py-3 shadow-lift backdrop-blur lg:bottom-6"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          <span className="min-w-0 flex-1 text-[13px] text-ink">{message}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-secondary transition-colors hover:bg-muted hover:text-ink"
            aria-label="关闭提示"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
