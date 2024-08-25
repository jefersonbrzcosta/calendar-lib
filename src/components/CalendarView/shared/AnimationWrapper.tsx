import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

const AnimationWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <motion.div className={`flex bg-gray-50 ${className ?? ''}`}
    initial={{ opacity: 0, x: 1050 }}
    animate={{ opacity: 1, x: 0}}
    transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
