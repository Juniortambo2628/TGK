import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Container from './Container';

/**
 * Full-bleed hero.
 *
 * - `image` (single) or `images` (array) — array becomes a fading carousel
 * - Overlay: brand-red at the top → transparent middle → off-white at the
 *   bottom, so the hero blends into the body without a hard seam
 * - Eyebrow: title-case text inside a soft outline pill (no dot)
 */
export default function Hero({
    eyebrow,
    title,
    subtitle,
    image,
    images,
    primaryCta,
    secondaryCta,
    align = 'center',
    minHeight = 'min-h-[92vh] lg:min-h-screen',
    accent = 'red',
    autoplayMs = 6500,
}) {
    const reduce = useReducedMotion();
    const isCenter = align === 'center';
    const slides = images && images.length ? images : (image ? [image] : []);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (slides.length < 2 || reduce) return;
        const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), autoplayMs);
        return () => clearInterval(t);
    }, [slides.length, autoplayMs, reduce]);

    const pillBorder = accent === 'green' ? 'border-brand-green/70' : 'border-white/60';
    const pillDot = accent === 'green' ? 'bg-brand-green' : 'bg-white/80';

    return (
        <section className={`relative isolate flex items-center overflow-hidden ${minHeight}`}>
            <div className="absolute inset-0 -z-10">
                <AnimatePresence initial={false} mode="sync">
                    <motion.img
                        key={slides[idx] || 'placeholder'}
                        src={slides[idx]}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="eager"
                        {...({ fetchpriority: 'high' })}
                        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 1.2 }, scale: { duration: autoplayMs / 1000, ease: 'linear' } }}
                    />
                </AnimatePresence>

                {/*
                 * Overlay: single smooth gradient — brand red carrying deep into
                 * the middle so white text stays legible, then softening through
                 * a warm transparent band into off-white that melts into the body.
                 */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to bottom, ' +
                            'rgba(251,36,54,0.72) 0%, ' +
                            'rgba(251,36,54,0.55) 22%, ' +
                            'rgba(196,16,31,0.42) 42%, ' +
                            'rgba(53,53,54,0.30) 62%, ' +
                            'rgba(250,255,253,0.55) 84%, ' +
                            '#FAFFFD 100%)',
                    }}
                />
            </div>

            <Container className={`relative py-24 ${isCenter ? 'text-center' : ''}`}>
                <div className={`max-w-4xl ${isCenter ? 'mx-auto' : ''}`}>
                    {eyebrow && (
                        <motion.span
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-block rounded-full border ${pillBorder} bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white mb-6`}
                        >
                            {eyebrow}
                        </motion.span>
                    )}
                    <motion.h1
                        initial={reduce ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="text-display-xl font-black text-brand-off text-balance hero-text-shadow"
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className={`mt-6 max-w-2xl text-lg lg:text-xl text-brand-off/95 hero-text-shadow ${isCenter ? 'mx-auto' : ''}`}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                    {(primaryCta || secondaryCta) && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className={`mt-10 flex flex-wrap gap-4 ${isCenter ? 'justify-center' : ''}`}
                        >
                            {primaryCta}
                            {secondaryCta}
                        </motion.div>
                    )}
                </div>

                {slides.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIdx(i)}
                                aria-label={`Show slide ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
}
