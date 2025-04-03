import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComboTextProps {
  combo: number;
  isVisible: boolean;
}

const ComboText: React.FC<ComboTextProps> = ({ combo, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-6xl font-bold text-amber-400 drop-shadow-lg">
            {combo} COMBO!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComboText; 