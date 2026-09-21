import Hero from '../Components/Hero';
import Container from '../Components/Container';
import PartnerLogoGrid from '../Components/PartnerLogoGrid';
import { Reveal } from '../Components/Motion';
import { useCms } from '../lib/cms';
import { imageUrl } from '../lib/urls';

export default function Partners({ partners = [] }) {
    const cms = useCms();
    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/partners-hero.jpg';

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'In good company')}
                title={cms.text('hero.title', 'The organisations that walk with us.')}
                subtitle={cms.text('hero.subtitle', "Funders, industry partners and mentors who make a young person's next step possible.")}
                image={heroImage}
                minHeight="min-h-[60vh]"
            />

            <section className="py-16 lg:py-24">
                <Container>
                    <PartnerLogoGrid partners={partners} />
                    <Reveal>
                        <p className="mt-16 max-w-2xl mx-auto text-center text-brand-grey">
                            If your organisation would like to walk with us, we would love to hear from you.
                        </p>
                    </Reveal>
                </Container>
            </section>
        </>
    );
}
