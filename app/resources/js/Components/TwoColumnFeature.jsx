import { motion, useReducedMotion } from 'framer-motion';
import Container from './Container';
import { Reveal } from './Motion';

/**
 * The alternating two-column pattern from food4education. Text one side,
 * image the other, `flip` swaps sides. Image gets a subtle parallax.
 */
export default function TwoColumnFeature({ eyebrow, title, children, image, imageAlt = '', flip = false, accent = 'red' }) {
    const reduce = useReducedMotion();
    return (
        <section className="py-16 lg:py-24">
            <Container>
                <div className={`grid gap-10 lg:gap-16 items-center lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                    <motion.div
                        initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-3xl aspect-[4/3] shadow-card"
                    >
                        <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
                    </motion.div>

                    <div>
                        {eyebrow && (
                            <Reveal>
                                <p className={`text-xs font-bold uppercase tracking-[0.22em] mb-4 ${accent === 'green' ? 'text-brand-green' : 'text-brand-red'}`}>
                                    {eyebrow}
                                </p>
                            </Reveal>
                        )}
                        <Reveal delay={0.05}>
                            <h2 className="text-3xl md:text-4xl font-black text-balance mb-6">{title}</h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-brand-charcoal prose-p:text-brand-grey">
                                {children}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </Container>
        </section>
    );
}
