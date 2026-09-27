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
    { value: '18–24', label: 'Ages served', description: 'Rural young women, including single mothers and vulnerable households.' },
    { value: '3', label: 'Stages on site', description: 'Discover, Develop and Launch, all under one roof.' },
    { value: '1', label: 'Flagship center', description: 'Our first and primary programme site, in Eldoret.' },
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
                title={cms.text('hero.title', 'Our flagship home for young women.')}
                subtitle={cms.text('hero.subtitle', 'In Mile 13 Juakali, Eldoret, rural young women aged 18 to 24 move through the full Discover, Develop, Launch journey in a safe space built for women.')}
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
                                title={cms.text('who.title', 'Young women aged 18 to 24.')}
                                accent="green"
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                <RichText
                                    html={cms.html('who.body', '<p>Young women face the sharpest edge of the transition trap. At Regina Yego, our flagship programme site, we deliver the full Discover, Develop, Launch journey to rural young women aged 18 to 24, including single mothers and those from vulnerable households, in a safe space built for women.</p><p>Daraja is different. Our upstream programme runs off campus, inside high schools, walking with teens aged 14 to 17 at risk of dropping out so they reach 18 with their options open.</p>')}
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
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-green mb-4">Growing the model</p>
                        <h2 className="text-3xl lg:text-4xl font-black mb-6">{cms.text('growing.title', 'One model. More young women reached.')}</h2>
                        <RichText
                            html={cms.html('growing.body', '<p>Regina Yego is the template for how we reach young women at scale. Each new centre carries the same full journey, the same safe space and the same standard of care, so more rural young women can move from school to opportunity close to home.</p>')}
                            className="text-lg text-brand-grey leading-relaxed space-y-4"
                        />
                        <Link href={cms.text('cta.route', '/contact?topic=partnership')} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-green">{cms.text('cta.label', 'Start a conversation about a new center')} →</Link>
                    </div>
                </Container>
            </section>
        </>
    );
}
