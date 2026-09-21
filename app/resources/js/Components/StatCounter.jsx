import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function parseNumber(v) {
    const m = String(v).match(/([\d,.]+)/);
    if (!m) return { num: 0, prefix: '', suffix: String(v) };
    const num = parseFloat(m[1].replace(/,/g, ''));
    const idx = String(v).indexOf(m[1]);
    return {
        num,
        prefix: String(v).slice(0, idx),
        suffix: String(v).slice(idx + m[1].length),
        raw: m[1],
    };
}

export function Stat({ value, label, description, accent = 'red' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const reduce = useReducedMotion();
    const parsed = parseNumber(value);
    const [display, setDisplay] = useState(reduce ? parsed.num : 0);

    useEffect(() => {
        if (!inView || reduce) { setDisplay(parsed.num); return; }
        const controls = animate(0, parsed.num, {
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setDisplay(v),
        });
        return () => controls.stop();
    }, [inView, parsed.num, reduce]);

    const formatted = Number.isInteger(parsed.num)
        ? Math.round(display).toLocaleString()
        : display.toFixed(2);

    return (
        <div ref={ref} className="text-left">
            <p className={`text-4xl md:text-5xl lg:text-6xl font-black leading-none ${accent === 'green' ? 'text-brand-green' : 'text-brand-red'}`}>
                {parsed.prefix}
                <span>{formatted}</span>
                {parsed.suffix}
            </p>
            {label && <p className="mt-3 text-sm font-bold uppercase tracking-wider text-brand-charcoal">{label}</p>}
            {description && <p className="mt-2 text-sm text-brand-grey max-w-xs">{description}</p>}
        </div>
    );
}

export function StatGrid({ children, className = '' }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 ${className}`}>
            {children}
        </div>
    );
}
