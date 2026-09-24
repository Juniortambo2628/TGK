import { Link } from '@inertiajs/react';
import Container from '../../Components/Container';
import StoryCard from '../../Components/StoryCard';
import { Reveal, Stagger } from '../../Components/Motion';

export default function StoryShow({ story, related = [] }) {
    const paragraphs = String(story.body || '').split(/\n{2,}/).filter(Boolean);

    return (
        <>
            <article>
                <div className="relative isolate min-h-[60vh] lg:min-h-[70vh] flex items-end overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <img src={story.hero_url} alt={story.title} className="h-full w-full object-cover" {...({ fetchpriority: 'high' })} />
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/40 via-brand-charcoal/60 to-brand-charcoal/95" />
                    </div>
                    <Container className="py-16 lg:py-20">
                        <Reveal>
                            <Link href="/stories" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-brand-off/80 mb-6 hover:text-brand-off">
                                <span>←</span> All stories
                            </Link>
                            <p className="eyebrow mb-3">A Good Kenyan story</p>
                            <h1 className="text-4xl md:text-5xl lg:text-display font-black text-brand-off text-balance max-w-4xl leading-tight">
                                {story.title}
                            </h1>
                            <p className="mt-6 text-brand-off/80 text-sm uppercase tracking-wider">
                                {new Date(story.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </Reveal>
                    </Container>
                </div>

                <section className="py-16 lg:py-24">
                    <Container>
                        <div className="max-w-3xl mx-auto">
                            {paragraphs.map((p, i) => (
                                <Reveal key={i} delay={Math.min(i * 0.03, 0.3)}>
                                    <p className="mt-6 first:mt-0 text-lg leading-relaxed text-brand-charcoal">
                                        {p.startsWith('"') ? <span className="block border-l-4 border-brand-red pl-6 italic text-xl text-brand-charcoal">{p}</span> : p}
                                    </p>
                                </Reveal>
                            ))}
                        </div>
                    </Container>
                </section>
            </article>

            {related.length > 0 && (
                <section className="bg-brand-panel py-16 lg:py-24">
                    <Container>
                        <h2 className="text-2xl lg:text-3xl font-black mb-10">More stories</h2>
                        <Stagger className="grid gap-8 md:grid-cols-3">
                            {related.map((s) => <StoryCard key={s.slug} story={s} />)}
                        </Stagger>
                    </Container>
                </section>
            )}
        </>
    );
}
