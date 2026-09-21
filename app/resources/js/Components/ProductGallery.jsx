import { useState } from 'react';
import { Reveal, Stagger, StaggerItem } from './Motion';
import ProductLightbox from './ProductLightbox';

/**
 * Grid of product portfolio cards. Click a card to expand into a lightbox
 * with per-image navigation and gallery-switching thumbnails.
 */
export default function ProductGallery({ products }) {
    const [openAt, setOpenAt] = useState(null); // { p, i }

    const open = (p, i = 0) => setOpenAt({ p, i });
    const close = () => setOpenAt(null);
    const selectProduct = (p) => setOpenAt({ p, i: 0 });
    const selectImage = (i) => setOpenAt((s) => (s ? { ...s, i } : s));

    const next = () => setOpenAt((s) => {
        if (!s) return s;
        const cur = products[s.p];
        if (s.i + 1 < cur.images.length) return { ...s, i: s.i + 1 };
        // roll to next product's first image
        const np = (s.p + 1) % products.length;
        return { p: np, i: 0 };
    });
    const prev = () => setOpenAt((s) => {
        if (!s) return s;
        if (s.i > 0) return { ...s, i: s.i - 1 };
        // roll to previous product's last image
        const np = (s.p - 1 + products.length) % products.length;
        return { p: np, i: products[np].images.length - 1 };
    });

    return (
        <>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p, idx) => (
                    <StaggerItem key={p.slug}>
                        <button
                            type="button"
                            onClick={() => open(idx)}
                            className="group block w-full text-left overflow-hidden rounded-3xl bg-white ring-1 ring-brand-hairline shadow-card focus:outline-none focus:ring-2 focus:ring-brand-red"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={p.images[0]}
                                    alt={p.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                                />
                                {p.images.length > 1 && (
                                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand-charcoal/80 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-off">
                                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <path d="M3 15l4-4 5 5" /><path d="M14 12l3-3 4 4" />
                                        </svg>
                                        {p.images.length}
                                    </span>
                                )}
                                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-brand-off/95 px-3 py-1.5 text-xs font-bold text-brand-charcoal opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                    Expand
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
                                    </svg>
                                </span>
                            </div>
                            <div className="p-5 lg:p-6">
                                <h4 className="text-lg font-black text-brand-charcoal group-hover:text-brand-red transition-colors">{p.name}</h4>
                                {p.blurb && <p className="mt-2 text-sm text-brand-grey line-clamp-2">{p.blurb}</p>}
                            </div>
                        </button>
                    </StaggerItem>
                ))}
            </Stagger>

            <ProductLightbox
                open={openAt !== null}
                products={products}
                activeProductIndex={openAt?.p ?? 0}
                activeImageIndex={openAt?.i ?? 0}
                onClose={close}
                onSelectProduct={selectProduct}
                onSelectImage={selectImage}
                onPrev={prev}
                onNext={next}
            />
        </>
    );
}
