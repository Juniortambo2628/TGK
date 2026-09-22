import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Hero from '../../Components/Hero';
import Container from '../../Components/Container';
import StoryCard from '../../Components/StoryCard';
import { Stagger } from '../../Components/Motion';
import { useCms } from '../../lib/cms';
import { imageUrl } from '../../lib/urls';

/**
 * Stories index with a sidebar for timeline filtering and quick jumps
 * between individual stories. The sidebar is sticky on desktop and
 * collapses into a slide-out drawer on mobile.
 */
export default function StoriesIndex({ stories = [] }) {
    const cms = useCms();
    const reduce = useReducedMotion();
    const [year, setYear] = useState('all');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/stories-hero.jpg';

    // Group by year, most recent first
    const years = useMemo(() => {
        const set = new Set(stories.map((s) => new Date(s.published_at).getFullYear()));
        return [...set].sort((a, b) => b - a);
    }, [stories]);

    const filtered = useMemo(
        () => (year === 'all' ? stories : stories.filter((s) => new Date(s.published_at).getFullYear() === year)),
        [stories, year]
    );

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Our Stories')}
                title={cms.text('hero.title', 'Named journeys, real outcomes.')}
                subtitle={cms.text('hero.subtitle', 'The people we work with tell the story better than we can. Read them in their own words.')}
                image={heroImage}
                minHeight="min-h-[60vh]"
            />

            <section className="py-16 lg:py-20">
                <Container>
                    {/* Mobile filter toggle */}
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <p className="text-sm text-brand-grey">
                            {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
                            {year !== 'all' && ` from ${year}`}
                        </p>
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            className="btn-outline text-xs !py-2 !px-4"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4" /></svg>
                            Filter
                        </button>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-12">
                        {/* Sidebar — desktop */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <Sidebar
                                stories={stories}
                                filtered={filtered}
                                years={years}
                                year={year}
                                onYearChange={setYear}
                            />
                        </aside>

                        {/* Story grid */}
                        <div className="lg:col-span-9">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={year}
                                    initial={reduce ? false : { opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Stagger className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                        {filtered.map((s, i) => <StoryCard key={s.slug} story={s} priority={i < 3} />)}
                                    </Stagger>

                                    {filtered.length === 0 && (
                                        <div className="rounded-3xl bg-brand-panel p-10 text-center">
                                            <p className="text-brand-grey">No stories from {year} yet.</p>
                                            <button onClick={() => setYear('all')} className="mt-4 btn-outline">Clear filter</button>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Mobile filter drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[80] bg-brand-charcoal/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-brand-off overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-brand-hairline">
                                <h2 className="text-lg font-black">Filter stories</h2>
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    aria-label="Close filter"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-panel"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>
                                </button>
                            </div>
                            <div className="p-5">
                                <Sidebar
                                    stories={stories}
                                    filtered={filtered}
                                    years={years}
                                    year={year}
                                    onYearChange={(y) => { setYear(y); setDrawerOpen(false); }}
                                />
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function Sidebar({ stories, filtered, years, year, onYearChange }) {
    return (
        <div className="lg:sticky lg:top-24 space-y-8">
            {/* Timeline */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red mb-4">Timeline</h2>
                <ul className="space-y-1">
                    <YearItem
                        label="All stories"
                        count={stories.length}
                        active={year === 'all'}
                        onClick={() => onYearChange('all')}
                    />
                    {years.map((y) => (
                        <YearItem
                            key={y}
                            label={String(y)}
                            count={stories.filter((s) => new Date(s.published_at).getFullYear() === y).length}
                            active={year === y}
                            onClick={() => onYearChange(y)}
                        />
                    ))}
                </ul>
            </div>

            {/* Quick nav — jump to a specific story */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red mb-4">
                    {year === 'all' ? 'All stories' : `${year} stories`}
                </h2>
                <ul className="space-y-1">
                    {filtered.map((s) => (
                        <li key={s.slug}>
                            <Link
                                href={`/stories/${s.slug}`}
                                className="group block rounded-xl px-3 py-2.5 -mx-3 transition-colors hover:bg-brand-panel"
                            >
                                <p className="text-sm font-bold text-brand-charcoal group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                                    {s.title}
                                </p>
                                <p className="mt-1 text-xs text-brand-grey">
                                    {new Date(s.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </Link>
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li className="text-sm text-brand-grey px-1">Nothing in this year.</li>
                    )}
                </ul>
            </div>

            <div className="pt-6 border-t border-brand-hairline">
                <p className="text-sm text-brand-grey leading-relaxed">
                    Every story here is shared with the person's consent. If you want to add your own, we would love to hear it.
                </p>
                <Link href={cms.text('cta.route', '/contact?topic=general')} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-red">
                    {cms.text('cta.label', 'Share a story')} →
                </Link>
            </div>
        </div>
    );
}

function YearItem({ label, count, active, onClick }) {
    return (
        <li>
            <button
                type="button"
                onClick={onClick}
                aria-pressed={active}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 -mx-3 text-left transition-colors ${
                    active ? 'bg-brand-red text-brand-off' : 'text-brand-charcoal hover:bg-brand-panel'
                }`}
            >
                <span className="text-sm font-bold">{label}</span>
                <span className={`text-xs tabular-nums ${active ? 'text-brand-off/80' : 'text-brand-grey'}`}>{count}</span>
            </button>
        </li>
    );
}
