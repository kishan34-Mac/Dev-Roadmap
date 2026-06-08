import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface PhaseCompleteOverlayProps {
  phaseName: string;
  phaseEmoji: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function PhaseCompleteOverlay({ phaseName, phaseEmoji, visible, onDismiss }: PhaseCompleteOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#58A6FF', '#3FB950', '#BC8CFF', '#79C0FF', '#D29922'],
      });
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-space-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-6xl mb-4"
            >
              {phaseEmoji}
            </motion.div>
            <h2 className="text-3xl font-mono font-bold gradient-text-shimmer mb-2">PHASE COMPLETE</h2>
            <p className="text-xl font-mono text-gray-300">{phaseName}</p>
            <p className="text-sm font-sans text-gray-500 mt-2">Outstanding work, developer.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
