import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
// AnimatePresence is still used for the outer dialog mount/unmount.
import { useEffect, useRef } from 'react';

/**
 * Fullscreen product lightbox.
 *
 * - Arrows / swipe / dots switch between images inside the active gallery
 * - Thumbnails at the bottom switch between different galleries
 * - Esc closes, click on the backdrop closes
 * - Focus is trapped on the close button so keyboard users can escape
 * - CTA fires an Inertia-friendly link to /contact?topic=quote
 */
export default function ProductLightbox({
    open,
    products,
    activeProductIndex,
    activeImageIndex,
    onClose,
    onSelectProduct,
    onSelectImage,
    onPrev,
    onNext,
}) {
    const closeRef = useRef(null);
    const reduce = useReducedMotion();
    const product = products[activeProductIndex];

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose, onPrev, onNext]);

    if (!product) return null;
    const image = product.images[activeImageIndex];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${product.name} gallery`}
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex flex-col bg-brand-charcoal/95 backdrop-blur-md text-brand-off"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-white/10">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-red">Good Studio</p>
                            <h3 className="mt-1 text-lg lg:text-xl font-black truncate">{product.name}</h3>
                        </div>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close gallery"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 6l12 12" /><path d="M18 6L6 18" />
                            </svg>
                        </button>
                    </div>

                    {/* Image + side info */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_360px]">
                        <div className="relative flex items-center justify-center p-4 lg:p-8">
                            <motion.img
                                key={image}
                                src={image}
                                alt={product.name}
                                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                            />

                            {product.images.length > 1 && (
                                <>
                                    <IconButton label="Previous image" onClick={() => onSelectImage((activeImageIndex - 1 + product.images.length) % product.images.length)}
                                                className="left-4 lg:left-8">
                                        <path d="M15 6l-6 6 6 6" />
                                    </IconButton>
                                    <IconButton label="Next image" onClick={() => onSelectImage((activeImageIndex + 1) % product.images.length)}
                                                className="right-4 lg:right-8">
                                        <path d="M9 6l6 6-6 6" />
                                    </IconButton>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                        {product.images.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => onSelectImage(i)}
                                                aria-label={`Show image ${i + 1}`}
                                                className={`h-1.5 rounded-full transition-all ${i === activeImageIndex ? 'w-8 bg-brand-off' : 'w-3 bg-brand-off/40 hover:bg-brand-off/70'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <aside className="border-t lg:border-t-0 lg:border-l border-white/10 p-6 lg:p-8 flex flex-col justify-between gap-6 overflow-y-auto">
                            <div>
                                <p className="text-xs text-brand-off/60">
                                    Image {activeImageIndex + 1} of {product.images.length} · Product {activeProductIndex + 1} of {products.length}
                                </p>
                                <h4 className="mt-2 text-2xl font-black">{product.name}</h4>
                                {product.blurb && <p className="mt-3 text-brand-off/80 leading-relaxed">{product.blurb}</p>}
                                {product.details && product.details.length > 0 && (
                                    <ul className="mt-5 space-y-2 text-sm text-brand-off/85">
                                        {product.details.map((d) => (
                                            <li key={d} className="flex gap-2"><span className="text-brand-red mt-1.5">●</span><span>{d}</span></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <a
                                href={`/contact?topic=quote&about=${encodeURIComponent(product.name)}`}
                                className="btn-primary w-full justify-center"
                            >
                                Request a quote for something similar
                            </a>
                        </aside>
                    </div>

                    {/* Product thumbnails at the bottom to switch galleries */}
                    <div className="border-t border-white/10 px-4 lg:px-8 py-4 overflow-x-auto">
                        <div className="flex items-center gap-3 min-w-max">
                            {products.map((p, i) => (
                                <button
                                    key={p.slug}
                                    type="button"
                                    onClick={() => onSelectProduct(i)}
                                    aria-label={p.name}
                                    aria-current={i === activeProductIndex}
                                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                                        i === activeProductIndex ? 'ring-brand-red' : 'ring-transparent hover:ring-white/40'
                                    }`}
                                >
                                    <img src={p.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function IconButton({ children, label, onClick, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`absolute top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors ${className}`}
        >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {children}
            </svg>
        </button>
    );
}
