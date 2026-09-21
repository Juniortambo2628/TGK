import Container from './Container';
import { Stat } from './StatCounter';
import { Reveal } from './Motion';

const DEFAULT_STATS = [
    { value: '600',    label: 'Youth skilled and mentored', description: 'Direct graduates of Msingi, Imarisha and Stawi.' },
    { value: '75%',    label: 'Transition rate',            description: 'Move into work, business or further study after the programme.' },
    { value: '400',    label: 'Mentors equipped',           description: 'Trained to hold a mentee relationship end to end.' },
    { value: '2,000',  label: 'Youth indirectly supported', description: 'Family, cohort peers and community touched by the work.' },
];

/**
 * The client's impact numbers, presented as a hard-hitting standalone band.
 * All copy and the stats grid can be overridden from the CMS by passing
 * props; the defaults below keep the site whole before the client visits
 * the dashboard.
 */
export default function ImpactStats({
    eyebrow = 'Impact by the numbers',
    title = 'A track record we count and can point to.',
    body = 'Since 2017, we have built a structured gateway from school-leaving into economic independence. Our alumni are running micro-enterprises, working in the creative and service sectors, and moving through targeted scholarship pipelines.',
    stats = DEFAULT_STATS,
    centersText = 'Centers in Nairobi and Eldoret.',
}) {
    // Detect a leading "2 " so we can pull out the count badge from the copy
    const centersMatch = String(centersText).match(/^\s*(\d+)\s+(.+)$/);
    const centersCount = centersMatch ? centersMatch[1] : '2';
    const centersLabel = centersMatch ? centersMatch[2] : centersText;

    return (
        <section className="relative isolate overflow-hidden bg-brand-off py-20 lg:py-28">
            <Container>
                <div className="grid gap-12 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-4">
                        <Reveal>
                            <p className="eyebrow mb-4">{eyebrow}</p>
                            <h2 className="text-3xl md:text-4xl font-black text-balance leading-tight">{title}</h2>
                            {body && <p className="mt-4 text-brand-grey leading-relaxed">{body}</p>}
                        </Reveal>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 border-t border-brand-hairline pt-10 lg:pt-12">
                            {stats.slice(0, 6).map((s, i) => (
                                <Stat key={s.label + i} value={s.value} label={s.label} description={s.description} />
                            ))}
                        </div>

                        <Reveal delay={0.15}>
                            <div className="mt-12 pt-8 border-t border-brand-hairline flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white text-2xl font-black">{centersCount}</span>
                                    <p className="text-lg font-bold text-brand-charcoal">{centersLabel}</p>
                                </div>
                                <p className="text-sm text-brand-grey">
                                    Regina Yego (Eldoret) is the first, with the second in Nairobi coming online.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </Container>
        </section>
    );
}
