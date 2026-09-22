import { Link } from '@inertiajs/react';
import Hero from '../Components/Hero';
import Container from '../Components/Container';
import SectionHeader from '../Components/SectionHeader';
import TwoColumnFeature from '../Components/TwoColumnFeature';
import CTABlock from '../Components/CTABlock';
import RichText from '../Components/RichText';
import { Reveal } from '../Components/Motion';
import { useCms } from '../lib/cms';
import { imageUrl } from '../lib/urls';

export default function About() {
    const cms = useCms();
    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/about-hero.jpg';

    const valuesImage = cms.hasImages('values.image')
        ? imageUrl(cms.array('values.image')[0])
        : '/images/landing/values.jpg';

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Who we are')}
                title={cms.text('hero.title', 'A Kenyan led organisation serving youth.')}
                subtitle={cms.text('hero.subtitle', 'We have a proven record of helping young people bridge the gap between school and opportunity, with a strong focus on the creative economy.')}
                image={heroImage}
                minHeight="min-h-[70vh]"
            />

            <section className="py-16 lg:py-24">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHeader
                                eyebrow={cms.text('story.eyebrow', 'Our story')}
                                title={cms.text('story.title', 'Founded in 2017. Based in Eldoret and Nairobi.')}
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                <RichText
                                    html={cms.html('story.body', "<p>We work with youth aged 18 to 24 from low income rural communities and Nairobi's informal settlements, particularly vulnerable young women, guiding them from uncertainty after high school into clear, practical pathways toward work, business or further education.</p><p>Alongside this, our Daraja programme works upstream with girls aged 14 to 17 at risk of dropping out, supporting them through high school with mentorship and life skills so they complete their education and leave with a plan.</p>")}
                                    className="text-lg leading-relaxed text-brand-charcoal space-y-4"
                                />
                            </Reveal>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="bg-brand-panel py-16 lg:py-24">
                <Container>
                    <div className="grid gap-8 md:grid-cols-2">
                        <Reveal>
                            <article className="rounded-3xl bg-white p-10 shadow-card">
                                <p className="eyebrow mb-4">Our Mission</p>
                                <RichText
                                    html={cms.html('mission', "<p>To grow the potential of Kenya's youth by providing skills, mentorship and tools that enable them to build sustainable livelihoods.</p>")}
                                    className="text-2xl font-black leading-snug"
                                />
                            </article>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <article className="rounded-3xl bg-brand-charcoal text-white p-10 shadow-card">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-red mb-4">Our Vision</p>
                                <RichText
                                    html={cms.html('vision', "<p>A Kenya where youth creativity drives meaningful work and sustainable livelihoods.</p>")}
                                    className="text-2xl font-black leading-snug !text-white [&_*]:!text-white [&_p]:!text-white"
                                />
                            </article>
                        </Reveal>
                    </div>
                </Container>
            </section>

            <TwoColumnFeature
                eyebrow="How we sound"
                title={cms.text('values.title', 'Warm, vibrant, clean, modern.')}
                image={valuesImage}
                imageAlt="Programme participants working together"
            >
                <RichText
                    html={cms.html('values.body', '<p>We think like a person, not a company. When we talk about young people and their transition into work, we are experts, and we sound like it: knowledgeable and friendly. Never institutional, never pitying, never shouty.</p><p>Everything we publish should sound like a person wrote it for a person, and every interaction should feel full of possibility.</p>')}
                    className="space-y-4"
                />
            </TwoColumnFeature>

            <CTABlock eyebrow="Come along" title="Two ways to get involved right now." tone="red">
                <Link href={cms.text('cta.primary_route', '/get-involved')} className="btn bg-brand-off text-brand-charcoal hover:bg-white">{cms.text('cta.primary_label', 'Get involved')}</Link>
                <Link href={cms.text('cta.secondary_route', '/contact')} className="btn border border-brand-off/40 text-brand-off hover:border-brand-off">{cms.text('cta.secondary_label', 'Contact us')}</Link>
            </CTABlock>
        </>
    );
}
