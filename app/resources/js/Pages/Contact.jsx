import Hero from '../Components/Hero';
import Container from '../Components/Container';
import ContactForm from '../Components/ContactForm';
import { Reveal } from '../Components/Motion';
import { useCms, useSite } from '../lib/cms';
import { imageUrl } from '../lib/urls';

export default function Contact({ topic }) {
    const cms = useCms();
    const site = useSite();
    const contact = site.contact || {};

    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/contact-hero.jpg';

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Contact')}
                title={cms.text('hero.title', 'Say hello.')}
                subtitle={cms.text('hero.subtitle', 'For quotes, partnerships, press or a general enquiry, drop us a note. We reply within two working days.')}
                image={heroImage}
                minHeight="min-h-[55vh]"
            />

            <section className="py-16 lg:py-24">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <Reveal>
                                <p className="eyebrow mb-3">{cms.text('left.eyebrow', 'Direct')}</p>
                                <h2 className="text-3xl font-black">{cms.text('left.title', 'Reach us any time.')}</h2>
                                <dl className="mt-8 space-y-6 text-brand-charcoal">
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wider text-brand-grey">Email</dt>
                                        <dd className="mt-1"><a href={`mailto:${contact.email || 'lucy.chepchumba@goodkenyan.org'}`} className="text-brand-red hover:underline">{contact.email || 'lucy.chepchumba@goodkenyan.org'}</a></dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wider text-brand-grey">Phone</dt>
                                        <dd className="mt-1"><a href={`tel:${(contact.phone || '+254 708 020 530').replace(/\s+/g, '')}`} className="hover:text-brand-red">{contact.phone || '+254 708 020 530'}</a></dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wider text-brand-grey">Eldoret (center)</dt>
                                        <dd className="mt-1">{contact.eldoret || 'Regina Yego Girls Center, Mile 13 Juakali, Eldoret'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold uppercase tracking-wider text-brand-grey">Nairobi</dt>
                                        <dd className="mt-1">{contact.nairobi || 'PO Box 15137, 00100 Nairobi, Kenya'}</dd>
                                    </div>
                                </dl>
                            </Reveal>
                        </div>
                        <div className="lg:col-span-7">
                            <ContactForm topic={topic || ''} title={cms.text('form.title', 'Send us a message')} />
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
