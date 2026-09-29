import { Link } from '@inertiajs/react';
import Container from '../../Components/Container';
import StoryCard from '../../Components/StoryCard';
import RichText from '../../Components/RichText';
import { Reveal, Stagger } from '../../Components/Motion';

export default function StoryShow({ story, related = [] }) {
    return (
        <>
            <article>
                <div className="relative isolate min-h-[60vh] lg:min-h-[70vh] flex items-end overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <img src={story.hero_url} alt={story.title} className="h-full w-full object-cover" style={{ objectPosition: story.hero_position || '50% 50%' }} {...({ fetchpriority: 'high' })} />
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
                            <Reveal>
                                <RichText
                                    html={story.body}
                                    className="text-lg leading-relaxed text-brand-charcoal [&_p]:mt-6 [&_p:first-child]:mt-0 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-red [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-xl"
                                />
                            </Reveal>
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
