import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Reveal: fade + rise on first scroll into view. Uses useInView with a
 * "seen" state that persists once true, plus a 900ms mount fallback so
 * content is never stuck hidden if IntersectionObserver misses the entry
 * (fast programmatic scrolls, tab suspension, jump nav, etc).
 */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.05 });
    const [seen, setSeen] = useState(reduce);

    useEffect(() => {
        if (inView) setSeen(true);
    }, [inView]);

    useEffect(() => {
        if (reduce) return;
        const t = setTimeout(() => setSeen(true), 900);
        return () => clearTimeout(t);
    }, [reduce]);

    const MotionTag = motion[as] || motion.div;
    return (
        <MotionTag
            ref={ref}
            initial={reduce ? false : { opacity: 0, y }}
            animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </MotionTag>
    );
}

export function Stagger({ children, className = '', delayChildren = 0, stagger = 0.08 }) {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.05 });
    const [seen, setSeen] = useState(reduce);

    useEffect(() => { if (inView) setSeen(true); }, [inView]);
    useEffect(() => {
        if (reduce) return;
        const t = setTimeout(() => setSeen(true), 900);
        return () => clearTimeout(t);
    }, [reduce]);

    return (
        <motion.div
            ref={ref}
            initial={reduce ? false : 'hidden'}
            animate={seen ? 'show' : 'hidden'}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: stagger, delayChildren } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const StaggerItem = ({ children, y = 20, className = '' }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            variants={{
                hidden: reduce ? {} : { opacity: 0, y },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
