import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from '../lib/cms';
import { imageUrl } from '../lib/urls';

/**
 * Primary nav. Title-case labels throughout. `About` is a megamenu parent
 * containing Who We Are, Our Model and Regina Yego Girls Center. Opens on
 * hover on desktop, collapses to an accordion on mobile.
 */
const primary = [
    {
        label: 'About',
        href: '/about',
        children: [
            {
                label: 'Who We Are',
                href: '/about',
                blurb: 'A Kenyan-led organisation serving youth since 2017.',
            },
            {
                label: 'Our Model',
                href: '/our-model',
                blurb: 'The Discover, Develop, Launch journey.',
            },
            {
                label: 'Regina Yego Girls Center',
                href: '/regina-yego',
                blurb: 'Our first center and the home of the Daraja programme.',
            },
        ],
    },
    { label: 'Stawi Enterprises', href: '/stawi' },
    { label: 'Stories', href: '/stories' },
    { label: 'Partners', href: '/partners' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'Contact', href: '/contact' },
];

export default function Nav() {
    const { url } = usePage();
    const site = useSite();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const [hoverLabel, setHoverLabel] = useState(null);
    const hoverTimer = useRef(null);
    const donateUrl = site.donateUrl || '#';
    const logoSrc = imageUrl(site.logo, '/images/tgkf-logo.png');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
        setMobileExpanded(null);
        setHoverLabel(null);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const isActive = (href) =>
        href === '/' ? url === '/' : url === href || url.startsWith(href + '/');

    const isBranchActive = (item) =>
        isActive(item.href) || (item.children || []).some((c) => isActive(c.href));

    const openMenu = (label) => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setHoverLabel(label);
    };
    const closeMenu = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setHoverLabel(null), 120);
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                scrolled || open || hoverLabel
                    ? 'bg-brand-off/95 backdrop-blur shadow-[0_1px_0_0_rgba(53,53,54,0.06)]'
                    : 'bg-transparent'
            }`}
            onMouseLeave={closeMenu}
        >
            <div className="container-page flex items-center justify-between py-4 lg:py-5">
                <Link href="/" className="flex items-center gap-3" aria-label={`${site.name || 'Good Kenyan Foundation'} home`}>
                    <img
                        src={logoSrc}
                        alt={site.name || 'Good Kenyan Foundation'}
                        className="h-10 w-auto lg:h-11"
                    />
                    <span className="sr-only">{site.name || 'Good Kenyan Foundation'}</span>
                </Link>

                <nav className="hidden xl:flex items-center gap-1" aria-label="Primary">
                    {primary.map((item) => {
                        const hasChildren = !!item.children;
                        const active = isBranchActive(item);
                        return (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => hasChildren && openMenu(item.label)}
                                onMouseLeave={hasChildren ? closeMenu : undefined}
                            >
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={hoverLabel === item.label}
                                        onFocus={() => openMenu(item.label)}
                                        onClick={() => setHoverLabel((h) => (h === item.label ? null : item.label))}
                                        className={`inline-flex items-center gap-1 px-3 py-2 text-[15px] font-semibold tracking-normal transition-colors ${
                                            active ? 'text-brand-red' : 'text-brand-charcoal hover:text-brand-red'
                                        }`}
                                    >
                                        {item.label}
                                        <svg
                                            className={`h-3.5 w-3.5 transition-transform ${hoverLabel === item.label ? 'rotate-180' : ''}`}
                                            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                        >
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`px-3 py-2 text-[15px] font-semibold tracking-normal transition-colors ${
                                            active ? 'text-brand-red' : 'text-brand-charcoal hover:text-brand-red'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <a href={donateUrl} target="_blank" rel="noopener" className="btn-primary hidden md:inline-flex">
                        Donate
                    </a>
                    <button
                        type="button"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-charcoal/15 text-brand-charcoal"
                        onClick={() => setOpen((o) => !o)}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            {open ? (
                                <>
                                    <path d="M6 6l12 12" />
                                    <path d="M18 6L6 18" />
                                </>
                            ) : (
                                <>
                                    <path d="M4 7h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 17h16" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Desktop megamenu panel */}
            <AnimatePresence>
                {hoverLabel && (() => {
                    const item = primary.find((p) => p.label === hoverLabel && p.children);
                    if (!item) return null;
                    return (
                        <motion.div
                            key={item.label + '-menu'}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="hidden xl:block absolute inset-x-0 top-full bg-brand-off border-t border-brand-hairline shadow-[0_20px_40px_-24px_rgba(53,53,54,0.25)]"
                            onMouseEnter={() => openMenu(item.label)}
                            onMouseLeave={closeMenu}
                        >
                            <div className="container-page py-10">
                                <div className="grid grid-cols-3 gap-8">
                                    {item.children.map((c) => (
                                        <Link
                                            key={c.href}
                                            href={c.href}
                                            className={`group rounded-2xl p-5 -m-5 transition-colors hover:bg-brand-panel ${
                                                isActive(c.href) ? 'bg-brand-panel' : ''
                                            }`}
                                        >
                                            <p className={`text-base font-bold ${isActive(c.href) ? 'text-brand-red' : 'text-brand-charcoal group-hover:text-brand-red'} transition-colors`}>
                                                {c.label}
                                                <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                                            </p>
                                            {c.blurb && (
                                                <p className="mt-2 text-sm text-brand-grey leading-relaxed">{c.blurb}</p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="xl:hidden bg-brand-off border-t border-brand-hairline"
                    >
                        <nav className="container-page py-4 flex flex-col" aria-label="Mobile">
                            {primary.map((item) => {
                                const hasChildren = !!item.children;
                                const expanded = mobileExpanded === item.label;
                                const active = isBranchActive(item);
                                if (!hasChildren) {
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`py-3 border-b border-brand-hairline text-lg font-bold ${
                                                active ? 'text-brand-red' : 'text-brand-charcoal'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                }
                                return (
                                    <div key={item.label} className="border-b border-brand-hairline">
                                        <button
                                            type="button"
                                            className={`w-full flex items-center justify-between py-3 text-lg font-bold ${
                                                active ? 'text-brand-red' : 'text-brand-charcoal'
                                            }`}
                                            onClick={() => setMobileExpanded((m) => (m === item.label ? null : item.label))}
                                            aria-expanded={expanded}
                                        >
                                            {item.label}
                                            <svg
                                                className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                            >
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {expanded && (
                                                <motion.div
                                                    key="sub"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.22 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 pb-3 flex flex-col">
                                                        {item.children.map((c) => (
                                                            <Link
                                                                key={c.href}
                                                                href={c.href}
                                                                className={`py-2.5 text-base font-semibold ${
                                                                    isActive(c.href) ? 'text-brand-red' : 'text-brand-charcoal'
                                                                }`}
                                                            >
                                                                {c.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                            <a href={donateUrl} target="_blank" rel="noopener" className="btn-primary mt-6 self-start">
                                Donate
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
