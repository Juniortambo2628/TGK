import Container from './Container';
import { Reveal } from './Motion';

export default function CTABlock({ eyebrow, title, description, children, tone = 'charcoal' }) {
    const isRed = tone === 'red';
    const bg = isRed ? 'bg-brand-red' : 'bg-brand-charcoal';
    const text = 'text-brand-off';
    return (
        <section className={`${bg} ${text}`}>
            <Container className="py-16 lg:py-24">
                <div className="max-w-3xl">
                    {eyebrow && (
                        <Reveal>
                            <p className={`text-xs font-bold uppercase tracking-[0.24em] mb-4 ${isRed ? 'text-brand-off/80' : 'text-brand-red'}`}>
                                {eyebrow}
                            </p>
                        </Reveal>
                    )}
                    <Reveal delay={0.05}>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-balance">{title}</h2>
                    </Reveal>
                    {description && (
                        <Reveal delay={0.1}>
                            <p className="mt-4 text-lg text-brand-off/85 leading-relaxed">{description}</p>
                        </Reveal>
                    )}
                    <Reveal delay={0.15}>
                        <div className="mt-8 flex flex-wrap gap-4">{children}</div>
                    </Reveal>
                </div>
            </Container>
        </section>
    );
}
