import { useEffect, useRef } from 'react';
import { Reveal } from './Motion';

/**
 * A horizontally scrollable documentary photo strip. Auto-scrolls slowly on
 * desktop as a subtle marquee, pauses on hover, and remains a normal
 * horizontal scroll on touch devices.
 */
export default function PhotoStrip({ photos, eyebrow, title, description }) {
    const trackRef = useRef(null);

    useEffect(() => {
        const el = trackRef.current;
        if (!el || photos.length < 4) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let raf, paused = false;
        const onEnter = () => (paused = true);
        const onLeave = () => (paused = false);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);

        const tick = () => {
            if (!paused && el.scrollWidth > el.clientWidth) {
                el.scrollLeft += 0.4;
                if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                    el.scrollLeft = 0;
                }
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [photos.length]);

    return (
        <section className="py-16 lg:py-20 overflow-hidden">
            <div className="container-page mb-10">
                <Reveal>
                    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
                    <h2 className="text-2xl md:text-3xl font-black text-balance">{title}</h2>
                    {description && (
                        <p className="mt-3 max-w-2xl text-brand-grey leading-relaxed">{description}</p>
                    )}
                </Reveal>
            </div>

            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto scroll-smooth px-6 md:px-8 lg:px-12 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {photos.map((p, i) => (
                    <figure
                        key={i}
                        className="relative shrink-0 w-72 sm:w-80 lg:w-96 aspect-[4/3] overflow-hidden rounded-2xl bg-brand-panel"
                    >
                        <img
                            src={p.src}
                            alt={p.alt || ''}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                        />
                        {p.caption && (
                            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/40 to-transparent p-4 text-xs font-semibold text-brand-off">
                                {p.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </section>
    );
}
