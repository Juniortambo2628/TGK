import { Link } from '@inertiajs/react';
import Hero from '../Components/Hero';
import Container from '../Components/Container';
import SectionHeader from '../Components/SectionHeader';
import { Stat, StatGrid } from '../Components/StatCounter';
import RichText from '../Components/RichText';
import { Reveal } from '../Components/Motion';
import { useCms } from '../lib/cms';
import { imageUrl } from '../lib/urls';

const FALLBACK_STATS = [
    { value: '14–17', label: 'Ages served', description: 'Girls in the Daraja programme at the center.' },
    { value: '100%', label: 'Guardian consent', description: 'Every photograph, every enrolment, every share.' },
    { value: '1', label: 'First center', description: 'The template every future center will follow.' },
];

export default function ReginaYego() {
    const cms = useCms();
    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/regina-yego.jpg';

    const stats = cms.array('stats', FALLBACK_STATS);

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Regina Yego Girls Center')}
                title={cms.text('hero.title', 'A home for the Daraja programme.')}
                subtitle={cms.text('hero.subtitle', 'Our first center, in Mile 13 Juakali, Eldoret. Green belongs to Regina Yego, and to Regina Yego alone.')}
                image={heroImage}
                minHeight="min-h-[75vh]"
                accent="green"
            />

            <section className="py-16 lg:py-24">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHeader
                                eyebrow={cms.text('who.eyebrow', 'Who we serve')}
                                title={cms.text('who.title', 'Girls aged 14 to 17, at risk of dropping out.')}
                                accent="green"
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                <RichText
                                    html={cms.html('who.body', '<p>The Daraja programme walks with girls through the years when a small setback becomes a permanent one. Mentorship, life skills and a safe study environment help them finish high school and leave with a clear plan.</p><p>Many alumni go on to join the Discover programme at 18, continuing the journey from school to opportunity without a gap in between.</p>')}
                                    className="text-lg leading-relaxed text-brand-charcoal space-y-4"
                                />
                            </Reveal>
                        </div>
                    </div>

                    <div className="mt-20">
                        <StatGrid>
                            {stats.map((s, idx) => (
                                <Stat key={idx} accent="green" value={s.value} label={s.label} description={s.description} />
                            ))}
                        </StatGrid>
                    </div>
                </Container>
            </section>

            <section className="py-16 lg:py-24 bg-[#F5FBEF]">
                <Container>
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-green mb-4">Naming the next center</p>
                        <h2 className="text-3xl lg:text-4xl font-black mb-6">{cms.text('growing.title', 'One system. Many centers.')}</h2>
                        <RichText
                            html={cms.html('growing.body', '<p>Every future center inherits three fixed things from this one: the bracket mark, the Lato wordmark, and the parent line "Good Kenyan Foundation". One thing is chosen per center: a single colour, assigned once, used the way green is used here.</p>')}
                            className="text-lg text-brand-grey leading-relaxed space-y-4"
                        />
                        <Link href={cms.text('cta.route', '/contact?topic=partnership')} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-green">{cms.text('cta.label', 'Start a conversation about a new center')} →</Link>
                    </div>
                </Container>
            </section>
        </>
    );
}
