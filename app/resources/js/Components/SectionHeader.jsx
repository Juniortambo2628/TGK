import { Reveal } from './Motion';

export default function SectionHeader({ eyebrow, title, description, align = 'left', accent = 'red' }) {
    const centered = align === 'center';
    return (
        <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
            {eyebrow && (
                <Reveal>
                    <p className={`text-xs font-bold uppercase tracking-[0.22em] mb-4 ${accent === 'green' ? 'text-brand-green' : 'text-brand-red'}`}>
                        {eyebrow}
                    </p>
                </Reveal>
            )}
            <Reveal delay={0.05}>
                <h2 className="text-3xl md:text-4xl lg:text-heading font-black text-balance">
                    {title}
                </h2>
            </Reveal>
            {description && (
                <Reveal delay={0.1}>
                    <p className="mt-4 text-base md:text-lg text-brand-grey max-w-2xl leading-relaxed">
                        {description}
                    </p>
                </Reveal>
            )}
        </div>
    );
}
