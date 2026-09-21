import { Link } from '@inertiajs/react';
import Hero from '../Components/Hero';
import Container from '../Components/Container';
import SectionHeader from '../Components/SectionHeader';
import { Stat, StatGrid } from '../Components/StatCounter';
import ProgramStageCard from '../Components/ProgramStageCard';
import StoryCard from '../Components/StoryCard';
import PartnerLogoGrid from '../Components/PartnerLogoGrid';
import CTABlock from '../Components/CTABlock';
import ImpactStats from '../Components/ImpactStats';
import RichText from '../Components/RichText';
import { Reveal, Stagger } from '../Components/Motion';
import { useCms, useSite } from '../lib/cms';
import { imageUrls, resolveHref } from '../lib/urls';

// Hard-coded fallbacks so the site renders correctly even before the admin
// has visited the CMS. Every value here can be overridden per-block from the
// dashboard.
const FALLBACK_HERO_IMAGES = [
    '/images/landing/hero-slide-1.jpg',
    '/images/landing/hero-slide-2.jpg',
    '/images/landing/hero-slide-3.jpg',
];

const FALLBACK_STATS = [
    { value: '600',    label: 'Youth skilled and mentored', description: 'Direct graduates of Msingi, Imarisha and Stawi.' },
    { value: '75%',    label: 'Transition rate',            description: 'Move into work, business or further study after the programme.' },
    { value: '400',    label: 'Mentors equipped',           description: 'Trained to hold a mentee relationship end to end.' },
    { value: '2,000',  label: 'Youth indirectly supported', description: 'Family, cohort peers and community touched by the work.' },
];

function formatBelieveStatement(html) {
    if (!html || typeof html !== 'string') return '';
    // Automatically highlights uppercase keywords (e.g. IF, AND IF, THEN, SO THAT) in brand red
    return html.replace(/(>|^)([^<]+)(<|$)/g, (match, prefix, text, suffix) => {
        const highlighted = text.replace(
            /\b(AND IF|SO THAT|IF|THEN)\b/g,
            '<span class="text-brand-red font-black">$1</span>'
        );
        return `${prefix}${highlighted}${suffix}`;
    });
}

export default function Home({ stories = [], partners = [] }) {
    const cms = useCms();
    const site = useSite();
    const donateUrl = site.donateUrl || '#';

    const heroImages = cms.hasImages('hero.images')
        ? imageUrls(cms.array('hero.images'))
        : FALLBACK_HERO_IMAGES;

    const impactStats = cms.array('impact.stats', FALLBACK_STATS);

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Good Kenyan Foundation')}
                title={cms.text('hero.title', 'From school to opportunity.')}
                subtitle={cms.text('hero.subtitle', 'Good Kenyan equips young people with the skills, mentorship and pathways they need to move from education into work or entrepreneurship.')}
                images={heroImages}
                primaryCta={
                    (() => {
                        const route = cms.text('hero.cta_primary_route', '__donate');
                        const external = cms.text('hero.cta_primary_external');
                        const label = cms.text('hero.cta_primary_label', 'Support a young person');
                        const href = resolveHref(route, external, donateUrl);
                        const isExternal = route === '__donate' || route === '__external' || href.startsWith('http');
                        return isExternal
                            ? <a href={href} target="_blank" rel="noopener" className="btn-primary text-base">{label}</a>
                            : <Link href={href} className="btn-primary text-base">{label}</Link>;
                    })()
                }
                secondaryCta={
                    (() => {
                        const route = cms.text('hero.cta_secondary_route', '/our-model');
                        const external = cms.text('hero.cta_secondary_external');
                        const label = cms.text('hero.cta_secondary_label', 'See how it works');
                        const href = resolveHref(route, external, donateUrl);
                        const cls = 'btn-outline text-base !text-brand-off !border-brand-off/40 hover:!text-brand-off hover:!border-brand-off';
                        const isExternal = route === '__donate' || route === '__external' || href.startsWith('http');
                        return isExternal
                            ? <a href={href} target="_blank" rel="noopener" className={cls}>{label}</a>
                            : <Link href={href} className={cls}>{label}</Link>;
                    })()
                }
            />

            {/* WHO WE ARE */}
            <section className="py-20 lg:py-28">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHeader
                                eyebrow={cms.text('who.eyebrow', 'Who we are')}
                                title={cms.text('who.title', 'A Kenyan led organisation serving youth.')}
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                {cms.html('who.body') ? (
                                    <RichText html={cms.html('who.body')} />
                                ) : (
                                    <>
                                        <p className="text-lg lg:text-xl leading-relaxed text-brand-charcoal">
                                            Good Kenyan Foundation has a proven record of helping young people bridge the gap between school and opportunity. We work with youth aged 18 to 24 from low income rural communities and Nairobi's informal settlements, particularly vulnerable young women, guiding them from uncertainty after high school into clear, practical pathways toward work, business or further education, with a strong focus on the creative economy.
                                        </p>
                                        <p className="mt-6 text-lg leading-relaxed text-brand-grey">
                                            Alongside this, our Daraja programme works upstream with girls aged 14 to 17 at risk of dropping out, supporting them through high school with mentorship and life skills so they complete their education and leave with a plan.
                                        </p>
                                    </>
                                )}
                            </Reveal>
                        </div>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-2">
                        <Reveal>
                            <article className="rounded-3xl bg-brand-panel p-8 lg:p-10">
                                <p className="eyebrow mb-3">Our Mission</p>
                                {cms.html('who.mission') ? (
                                    <RichText html={cms.html('who.mission')} className="[&_p]:text-xl [&_p]:lg:text-2xl [&_p]:font-bold [&_p]:leading-snug [&_p]:text-brand-charcoal" />
                                ) : (
                                    <p className="text-xl lg:text-2xl font-bold text-brand-charcoal leading-snug">
                                        To grow the potential of Kenya's youth by providing skills, mentorship and tools that enable them to build sustainable livelihoods.
                                    </p>
                                )}
                            </article>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <article className="rounded-3xl bg-brand-charcoal text-white p-8 lg:p-10">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-red mb-3">Our Vision</p>
                                {cms.html('who.vision') ? (
                                    <RichText html={cms.html('who.vision')} className="[&_p]:text-xl [&_p]:lg:text-2xl [&_p]:font-bold [&_p]:leading-snug !text-white [&_*]:!text-white [&_p]:!text-white" />
                                ) : (
                                    <p className="text-xl lg:text-2xl font-bold leading-snug text-white">
                                        A Kenya where youth creativity drives meaningful work and sustainable livelihoods.
                                    </p>
                                )}
                            </article>
                        </Reveal>
                    </div>
                </Container>
            </section>

            {/* IMPACT NUMBERS */}
            <ImpactStats
                eyebrow={cms.text('impact.eyebrow', 'Impact by the numbers')}
                title={cms.text('impact.title', 'A track record we count and can point to.')}
                body={cms.text('impact.body', 'Since 2017, we have built a structured gateway from school-leaving into economic independence. Our alumni are running micro-enterprises, working in the creative and service sectors, and moving through targeted scholarship pipelines.')}
                stats={impactStats}
                centersText={cms.text('impact.centers_text', 'Centers in Nairobi and Eldoret.')}
            />

            {/* THE PROBLEM */}
            <section className="bg-brand-panel py-20 lg:py-28">
                <Container>
                    <SectionHeader
                        eyebrow={cms.text('problem.eyebrow', "The problem we're solving")}
                        title={cms.text('problem.title', 'The transition trap.')}
                        description={cms.text('problem.description', 'What happens between finishing school and finding a livelihood decides most of what comes next. For a majority of Kenyan youth, that space is empty.')}
                    />

                    <div className="mt-16">
                        <StatGrid>
                            <Stat value="1M+" label="Complete high school every year" description="Only about half secure placement in a public college or university." />
                            <Stat value="35–67%" label="NEET and underemployment" description="Broader measures for ages 15 to 34." />
                            <Stat value="5%" label="Orange Economy share of GDP" description="Yet just 0.25% of wage employment sits inside it." />
                        </StatGrid>
                    </div>

                    <div className="mt-20 grid gap-8 lg:grid-cols-2">
                        <Reveal>
                            <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-card">
                                <h3 className="text-2xl font-black mb-4">The transition trap</h3>
                                <ul className="space-y-3 text-brand-grey leading-relaxed">
                                    <li className="flex gap-3"><span className="text-brand-red mt-1.5">●</span>Most youth in low income rural and informal urban communities are trapped in survival work and petty trade.</li>
                                    <li className="flex gap-3"><span className="text-brand-red mt-1.5">●</span>The window between school and first income is where hope most often stalls.</li>
                                </ul>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-card">
                                <h3 className="text-2xl font-black mb-4">The untapped opportunity</h3>
                                <ul className="space-y-3 text-brand-grey leading-relaxed">
                                    <li className="flex gap-3"><span className="text-brand-red mt-1.5">●</span>Kenya's Orange (Creative) Economy is large and growing, yet employs far less than its output would suggest.</li>
                                    <li className="flex gap-3"><span className="text-brand-red mt-1.5">●</span>MICE, digital and circular economy sectors offer accessible, talent based livelihoods, yet few structured pathways exist.</li>
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </Container>
            </section>

            {/* WE BELIEVE */}
            <section className="py-20 lg:py-28">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="eyebrow mb-4">We believe</p>
                        <Reveal>
                            {cms.html('believe.body') ? (
                                <RichText
                                    html={formatBelieveStatement(cms.html('believe.body'))}
                                    className="[&_p]:text-2xl [&_p]:md:text-3xl [&_p]:lg:text-4xl [&_p]:font-black [&_p]:leading-tight [&_p]:text-brand-charcoal [&_p]:text-balance [&_strong]:text-brand-red [&_b]:text-brand-red [&_strong]:font-black [&_.text-brand-red]:text-brand-red"
                                />
                            ) : (
                                <p className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-brand-charcoal text-balance">
                                    <span className="text-brand-red">IF</span> vulnerable youth engage in a holistic, gender responsive programme that builds individualised career plans, digital skills, life skills and self awareness,{' '}
                                    <span className="text-brand-red">AND IF</span> they receive 6 to 18 months of sustained, staged support,{' '}
                                    <span className="text-brand-red">THEN</span> they build the confidence, skills and networks to transition into their chosen pathway and begin earning,{' '}
                                    <span className="text-brand-red">SO THAT</span> over time they lead sustainable, dignified livelihoods with greater control over their economic, health and life decisions.
                                </p>
                            )}
                        </Reveal>
                    </div>
                </Container>
            </section>

            {/* DISCOVER / DEVELOP / LAUNCH */}
            <section className="relative isolate bg-brand-charcoal text-brand-off py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <img src="/images/landing/model-bg.jpg" alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-brand-charcoal/85" />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-brand-charcoal/70 to-brand-charcoal/95" />
                </div>
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-red mb-4">
                            {cms.text('model.eyebrow', 'From uncertainty to income')}
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-balance">
                            {cms.text('model.title', 'The Discover, Develop, Launch model.')}
                        </h2>
                        <p className="mt-4 text-brand-off/80 text-lg">
                            {cms.text('model.description', 'Three interconnected stages, not isolated programmes, but a single structured journey from self discovery to economic participation.')}
                        </p>
                    </div>

                    <Stagger className="mt-16 grid gap-6 lg:grid-cols-3">
                        <ProgramStageCard index={1} stage="Discover" name="Msingi" swahili="Foundation" duration="6 weeks"
                            description="Participants build self awareness, clarity, and the digital foundations needed to make informed decisions about their futures."
                            exit="Certificate in Digital Skills and a clear individual direction." />
                        <ProgramStageCard index={2} stage="Develop" name="Imarisha" swahili="Training" duration="6 months"
                            description="Participants enter focused technical pathways designed with industry to build market relevant skills for the creative and service economy."
                            exit="Industry verified skills and employer relationships." />
                        <ProgramStageCard index={3} stage="Launch" name="Stawi" swahili="Work & Enterprise" duration="1 year"
                            description="Participants gain paid work experience through Stawi Enterprises, transitioning into employment or supported entrepreneurship with continued alumni support."
                            exit="Three pathways: employment, entrepreneurship, or higher education." />
                    </Stagger>

                    <div className="mt-12 text-center">
                        <Link href="/our-model" className="btn text-brand-off border border-brand-off/30 hover:border-brand-red hover:text-brand-red">
                            See the full model →
                        </Link>
                    </div>
                </Container>
            </section>

            {/* STAWI ENTERPRISES */}
            <section className="py-20 lg:py-28">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHeader
                                eyebrow={cms.text('stawi.eyebrow', 'Stawi Enterprises')}
                                title={cms.text('stawi.title', "Not a side venture. It's how we pay young people.")}
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                {cms.html('stawi.body') ? (
                                    <RichText html={cms.html('stawi.body')} />
                                ) : (
                                    <>
                                        <p className="text-lg leading-relaxed text-brand-charcoal">
                                            Stawi Enterprises is the commercial arm of our model. It is how we give young people paid work with real clients, and how we carry a growing share of our own costs rather than starting every year from zero.
                                        </p>
                                        <p className="mt-4 text-brand-grey leading-relaxed">
                                            When you buy from us, you are buying good work and funding a livelihood.
                                        </p>
                                    </>
                                )}
                            </Reveal>
                        </div>
                    </div>

                    <div className="mt-16 grid gap-8 lg:grid-cols-2">
                        <Reveal>
                            <article className="group h-full overflow-hidden rounded-3xl bg-white ring-1 ring-brand-hairline shadow-card">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src="/images/landing/good-studio.jpg" alt="Good Studio work in progress" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                                </div>
                                <div className="p-8 lg:p-10">
                                    <p className="eyebrow mb-3">Good Studio</p>
                                    <h3 className="text-2xl font-black mb-3">Events, design and products with a traceable story.</h3>
                                    <p className="text-brand-grey leading-relaxed">
                                        Event planning and staffing, decor and styling, branding and design, custom packaging, corporate gifting, and a decor range made from reclaimed materials.
                                    </p>
                                    <Link href="/stawi#good-studio" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-red">Request a quote →</Link>
                                </div>
                            </article>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <article className="group h-full overflow-hidden rounded-3xl bg-white ring-1 ring-brand-hairline shadow-card">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src="/images/landing/good-connect.jpg" alt="Good Connect team on the floor" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                                </div>
                                <div className="p-8 lg:p-10">
                                    <p className="eyebrow mb-3">Good Connect</p>
                                    <h3 className="text-2xl font-black mb-3">Customer experience delivered by a trained Kenyan team.</h3>
                                    <p className="text-brand-grey leading-relaxed">
                                        A training lab combined with a commercial call centre. Inbound and outbound calls, customer support, back office operations and data processing.
                                    </p>
                                    <Link href="/stawi#good-connect" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-red">Talk to us about a contract →</Link>
                                </div>
                            </article>
                        </Reveal>
                    </div>
                </Container>
            </section>

            {/* STORIES */}
            {stories.length > 0 && (
                <section className="bg-brand-panel py-20 lg:py-28">
                    <Container>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                            <SectionHeader eyebrow="Our stories" title="Four journeys, one throughline." />
                            <Link href="/stories" className="btn-outline self-start md:self-end">All stories →</Link>
                        </div>

                        <Stagger className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                            {stories.slice(0, 4).map((s) => <StoryCard key={s.slug} story={s} />)}
                        </Stagger>
                    </Container>
                </section>
            )}

            {/* PARTNERS */}
            {partners.length > 0 && (
                <section className="py-16 lg:py-20">
                    <Container>
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <p className="eyebrow mb-3">In good company</p>
                            <h2 className="text-2xl lg:text-3xl font-black">The organisations that walk with us.</h2>
                        </div>
                        <PartnerLogoGrid partners={partners} />
                    </Container>
                </section>
            )}

            {/* GET IN TOUCH */}
            <CTABlock
                eyebrow="Get in touch"
                title={cms.text('cta.title', "Let's build something with a young person's name on it.")}
                description={cms.text('cta.description', "Fund a cohort, hire our services or send a young person to the next intake. We'll write back.")}
                tone="charcoal"
            >
                <Link href="/contact" className="btn-primary">Send a message</Link>
                <a href={donateUrl} target="_blank" rel="noopener" className="btn border border-brand-off/40 text-brand-off hover:border-brand-off">Donate</a>
            </CTABlock>
        </>
    );
}
