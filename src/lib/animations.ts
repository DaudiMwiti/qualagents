
import { MotionProps } from "framer-motion";

// Staggered children animation (for lists)
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Fade up animation for items in a staggered list
export const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.42, 0, 0.58, 1], // Apple-like cubic bezier
    }
  },
};

// Subtle scale animation for cards and elements
export const scaleOnHover: MotionProps = {
  whileHover: { 
    scale: 1.02,
    transition: { 
      duration: 0.2,
      ease: [0.34, 1.56, 0.64, 1], // Slight bounce effect
    }
  },
  whileTap: { 
    scale: 0.98,
    transition: { 
      duration: 0.1,
    }
  },
};

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    }
  },
};

// Slide in from right animation
export const slideInRight = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.42, 0, 0.58, 1],
    }
  },
};

// Slide in from left animation
export const slideInLeft = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.42, 0, 0.58, 1],
    }
  },
};

// Animation for overlays
export const overlayAnimation = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  },
};

// Animation for modals and dialogs
export const modalAnimation = {
  hidden: { 
    opacity: 0,
    scale: 0.96,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1],
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.2,
    }
  },
};
