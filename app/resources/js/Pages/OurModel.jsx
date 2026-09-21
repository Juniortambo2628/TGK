import { Link } from '@inertiajs/react';
import Hero from '../Components/Hero';
import Container from '../Components/Container';
import SectionHeader from '../Components/SectionHeader';
import ProgramStageCard from '../Components/ProgramStageCard';
import RichText from '../Components/RichText';
import { Reveal, Stagger } from '../Components/Motion';
import CTABlock from '../Components/CTABlock';
import { useCms } from '../lib/cms';
import { imageUrl } from '../lib/urls';

const FALLBACK_STAGES = [
    { stage: 'Discover', name: 'Msingi',   swahili: 'Foundation',       duration: '6 weeks',   description: 'Participants build self awareness, clarity, and the digital foundations needed to make informed decisions about their futures.', exit: 'Certificate in Digital Skills and a clear individual direction.' },
    { stage: 'Develop',  name: 'Imarisha', swahili: 'Training',         duration: '6 months',  description: 'Participants enter focused technical pathways designed with industry to build market relevant skills for the creative and service economy.', exit: 'Industry verified skills and employer relationships.' },
    { stage: 'Launch',   name: 'Stawi',    swahili: 'Work & Enterprise', duration: '1 year',    description: 'Participants gain paid work experience through Stawi Enterprises, transitioning into employment or supported entrepreneurship with continued alumni support.', exit: 'Three pathways: employment, entrepreneurship, or higher education.' },
];

export default function OurModel() {
    const cms = useCms();
    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/model-hero.jpg';

    const stages = cms.array('stages', FALLBACK_STAGES);

    const darajaImage = cms.hasImages('daraja.image')
        ? imageUrl(cms.array('daraja.image')[0])
        : '/images/landing/daraja.jpg';

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Our model')}
                title={cms.text('hero.title', 'From uncertainty to income.')}
                subtitle={cms.text('hero.subtitle', 'Three interconnected stages, one structured journey from self discovery to economic participation.')}
                image={heroImage}
                minHeight="min-h-[70vh]"
            />

            <section className="py-16 lg:py-24">
                <Container>
                    <Stagger className="grid gap-6 lg:grid-cols-3">
                        {stages.map((stage, idx) => (
                            <ProgramStageCard
                                key={stage.name || idx}
                                index={idx + 1}
                                stage={stage.stage}
                                name={stage.name}
                                swahili={stage.swahili}
                                duration={stage.duration}
                                description={stage.description}
                                exit={stage.exit}
                            />
                        ))}
                    </Stagger>
                </Container>
            </section>

            <section className="bg-brand-panel py-16 lg:py-24">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-center">
                        <div className="lg:col-span-6">
                            <img src={darajaImage} alt="Daraja programme at Regina Yego Girls Center" loading="lazy" className="rounded-3xl w-full aspect-[4/3] object-cover shadow-card" />
                        </div>
                        <div className="lg:col-span-6">
                            <SectionHeader
                                eyebrow={cms.text('daraja.eyebrow', 'Upstream')}
                                title={cms.text('daraja.title', 'Daraja: staying in school.')}
                            />
                            <Reveal delay={0.1}>
                                <RichText
                                    html={cms.html('daraja.body', '<p>Daraja works with girls aged 14 to 17 at risk of dropping out. Through structured mentorship and life skills at Regina Yego Girls Center, they complete high school and leave with a plan for what comes next.</p>')}
                                    className="mt-4 text-lg leading-relaxed text-brand-charcoal"
                                />
                                <Link href="/regina-yego" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-red">Visit Regina Yego Girls Center →</Link>
                            </Reveal>
                        </div>
                    </div>
                </Container>
            </section>

            <CTABlock eyebrow="Join a cohort" title="Fund the next intake." description="A named cohort. Real outcomes. Ninety day reports." tone="charcoal">
                <Link href="/get-involved#scholarship" className="btn-primary">Give a scholarship</Link>
                <Link href="/contact?topic=partnership" className="btn border border-brand-off/40 text-brand-off hover:border-brand-off">Talk about a partnership</Link>
            </CTABlock>
        </>
    );
}
