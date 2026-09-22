import { Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import Hero from '../Components/Hero';
import Container from '../Components/Container';
import SectionHeader from '../Components/SectionHeader';
import CTABlock from '../Components/CTABlock';
import ProductGallery from '../Components/ProductGallery';
import PhotoStrip from '../Components/PhotoStrip';
import RichText from '../Components/RichText';
import { Reveal, Stagger, StaggerItem } from '../Components/Motion';
import { useCms } from '../lib/cms';
import { imageUrl } from '../lib/urls';

const behindTheWorkPhotos = [
    { src: '/images/gallery/goodkenyan-img-1.jpg', caption: 'Cohort in session' },
    { src: '/images/gallery/goodkenyan-img-2.jpg', caption: 'Design brief review' },
    { src: '/images/gallery/goodkenyan-img-3.jpg', caption: 'Prototype board' },
    { src: '/images/gallery/goodkenyan-img-4.jpg', caption: 'Sourcing offcuts' },
    { src: '/images/gallery/goodkenyan-img-5.jpg', caption: 'Print tests' },
    { src: '/images/gallery/goodkenyan-img-6.jpg', caption: 'Finishing table' },
    { src: '/images/gallery/goodkenyan-img-7.jpg', caption: 'Screen printing' },
    { src: '/images/gallery/goodkenyan-img-8.jpg', caption: 'Sample review' },
    { src: '/images/gallery/goodkenyan-img-9.jpg', caption: 'Packing for delivery' },
    { src: '/images/gallery/goodkenyan-img-10.jpg', caption: 'Client walk-through' },
    { src: '/images/gallery/goodkenyan-img-11.jpg', caption: 'Team debrief' },
    { src: '/images/gallery/goodkenyan-img-12.jpg', caption: 'Studio morning' },
    { src: '/images/gallery/goodkenyan-img-14.jpg', caption: 'Trainer feedback' },
    { src: '/images/gallery/goodkenyan-img-15.jpg', caption: 'A finished run' },
    { src: '/images/gallery/goodkenyan-img-16.jpg', caption: 'Delivery day' },
    { src: '/images/gallery/goodkenyan-bn-2.jpg', caption: 'On site' },
    { src: '/images/gallery/good-kenyan-photo-1.png', caption: 'Studio detail' },
];

const goodStudioProducts = [
    {
        slug: 'signature-print-gift-boxes',
        name: 'Signature Print Gift Boxes',
        blurb: 'Reclaimed board wrapped in traditional prints. Made in small runs for corporate and personal gifting.',
        details: [
            'Reclaimed board and fabric offcuts',
            'Custom sizes from single-item to hamper',
            'Producer profit share on every unit',
        ],
        images: [
            '/images/products/print-boxes-01.jpg',
            '/images/products/print-boxes-02.jpg',
        ],
    },
    {
        slug: 'kraft-corporate-gifting',
        name: 'Kraft Corporate Gift Set',
        blurb: 'Clean kraft board with a single accent band. A minimal option for corporate hampers, staff kits and launch gifts.',
        details: [
            'Kraft board sourced from partner printers',
            'Custom band colours to your brand',
            'MOQ 25 units, lead time 10 working days',
        ],
        images: [
            '/images/products/kraft-gifting-01.jpg',
            '/images/products/kraft-gifting-02.jpg',
        ],
    },
    {
        slug: 'emerald-print-keepsake',
        name: 'Emerald Print Keepsake Box',
        blurb: 'A slimline keepsake box in emerald print, finished with a soft interior tray. Good for jewellery, cards and small gifts.',
        details: [
            'Print sourced from local markets, offcuts only',
            'Soft-lined interior tray',
            'Available in sets of two, three and five',
        ],
        images: [
            '/images/products/emerald-keepsake-01.jpg',
            '/images/products/emerald-keepsake-02.jpg',
        ],
    },
    {
        slug: 'emerald-print-journal',
        name: 'Emerald Print Journal',
        blurb: 'A hardcover journal with matching print. Corporate branding can be applied to the front or spine.',
        details: [
            'Hardcover with 120gsm cream paper',
            'Corporate branding on cover or spine',
            'MOQ 50 units',
        ],
        images: [
            '/images/products/emerald-journal-01.jpg',
        ],
    },
    {
        slug: 'reclaimed-wood-tray',
        name: 'Reclaimed Wood Serving Tray',
        blurb: 'A serving tray built from reclaimed wood, finished by hand at Regina Yego. Made to order for hospitality and event clients.',
        details: [
            'Reclaimed hardwood, food-safe finish',
            'Custom sizes and burned-in branding available',
            'Made to order, 3-week lead time',
        ],
        images: [
            '/images/products/reclaimed-tray-01.jpg',
        ],
    },
];

const studioServices = [
    'Event planning, staffing and coordination',
    'Event decor, styling and set production',
    'Branding, graphic design and print',
    'Custom packaging and corporate gifting',
    'Screen printing, heat press, vinyl cutting and finishing',
    'A decor range made from reclaimed wood, fabric offcuts, glass, metal and packaging waste',
];

const connectServices = [
    'Inbound and outbound call centre',
    'Customer experience and support desk',
    'Back office operations and data processing',
];

export default function Stawi() {
    const cms = useCms();

    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/stawi-hero.jpg';

    const studioGallery = cms.hasImages('studio.gallery')
        ? imageUrl(cms.array('studio.gallery')[0])
        : '/images/landing/good-studio-work.jpg';

    const connectGallery = cms.hasImages('connect.gallery')
        ? imageUrl(cms.array('connect.gallery')[0])
        : '/images/landing/good-connect-work.jpg';

    const rawStudioServices = cms.array('studio.services', []);
    const activeStudioServices = rawStudioServices.length
        ? rawStudioServices.map((s) => (typeof s === 'object' && s.item ? s.item : String(s)))
        : studioServices;

    const rawConnectServices = cms.array('connect.services', []);
    const activeConnectServices = rawConnectServices.length
        ? rawConnectServices.map((s) => (typeof s === 'object' && s.item ? s.item : String(s)))
        : connectServices;

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Stawi Enterprises')}
                title={cms.text('hero.title', 'Buy good work. Fund a livelihood.')}
                subtitle={cms.text('hero.subtitle', 'Stawi Enterprises is the commercial arm of our model. Two brands, one purpose: paid work for young people, delivered to real clients.')}
                image={heroImage}
                minHeight="min-h-[75vh]"
                primaryCta={<Link href="/contact?topic=quote" className="btn-primary text-base">Request a quote</Link>}
                secondaryCta={<a href="#good-studio" className="btn-outline text-base !text-brand-off !border-brand-off/40 hover:!text-brand-off hover:!border-brand-off">See what we do</a>}
            />

            {/* GOOD STUDIO */}
            <section id="good-studio" className="py-16 lg:py-24 scroll-mt-24">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHeader
                                eyebrow={cms.text('studio.eyebrow', 'Good Studio')}
                                title={cms.text('studio.title', 'Events, design and products with a traceable story.')}
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                <RichText
                                    html={cms.html('studio.body', '<p>Good Studio delivers creative and event work for corporate, NGO and private clients. Every brief is delivered by trainees working alongside experienced practitioners, so the work is professional and the training is real.</p>')}
                                    className="text-lg leading-relaxed text-brand-charcoal"
                                />
                            </Reveal>
                        </div>
                    </div>

                    <div className="mt-16 grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-7">
                            <img src={studioGallery} alt="Good Studio finished pieces" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-3xl shadow-card" />
                        </div>
                        <div className="lg:col-span-5">
                            <p className="eyebrow mb-4">What we do</p>
                            <Stagger className="space-y-3">
                                {activeStudioServices.map((s) => (
                                    <StaggerItem key={s} className="flex gap-3 text-brand-charcoal">
                                        <span className="text-brand-red mt-1.5">●</span><span>{s}</span>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                            <div className="mt-8 rounded-2xl bg-brand-panel p-6">
                                <p className="eyebrow mb-2">Why buyers choose us</p>
                                <p className="text-sm text-brand-charcoal leading-relaxed">
                                    Materials sourced from partner businesses and local markets are diverted from landfill and turned into a retail and events range. That creates green livelihoods and gives you a product whose impact traces back to a named producer. Every item carries a producer profit share.
                                </p>
                            </div>
                            <Link href="/contact?topic=quote" className="mt-8 btn-primary">Request a quote</Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* GOOD STUDIO — SELECTED WORK */}
            <section id="good-studio-work" className="bg-brand-panel py-16 lg:py-24 scroll-mt-24">
                <Container>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <SectionHeader
                            eyebrow="Selected work"
                            title="Recent pieces from Good Studio."
                            description="A small window into what we make. Tap any piece to see more angles and request something similar."
                        />
                        <Link href="/contact?topic=quote" className="btn-outline self-start md:self-end">
                            Brief us on a project →
                        </Link>
                    </div>

                    <ProductGallery products={goodStudioProducts} />
                </Container>
            </section>

            {/* BEHIND THE WORK — documentary strip */}
            <PhotoStrip
                eyebrow="Behind the studio"
                title="How the work gets made."
                description="Trainees and practitioners at the workbench: sourcing, prototyping, printing, packing. Every image on this page carries a real person's labour."
                photos={behindTheWorkPhotos}
            />

            {/* GOOD CONNECT */}
            <section id="good-connect" className="py-16 lg:py-24 scroll-mt-24">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHeader
                                eyebrow={cms.text('connect.eyebrow', 'Good Connect')}
                                title={cms.text('connect.title', 'Customer experience delivered by a trained Kenyan team.')}
                            />
                        </div>
                        <div className="lg:col-span-7 lg:pt-12">
                            <Reveal>
                                <RichText
                                    html={cms.html('connect.body', '<p>Good Connect combines a training lab with a commercial call centre, making it the most direct route in our model from training into salaried work.</p>')}
                                    className="text-lg leading-relaxed text-brand-charcoal"
                                />
                            </Reveal>
                        </div>
                    </div>

                    <div className="mt-16 grid gap-12 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <p className="eyebrow mb-4">Services</p>
                            <Stagger className="space-y-3">
                                {activeConnectServices.map((s) => (
                                    <StaggerItem key={s} className="flex gap-3 text-brand-charcoal">
                                        <span className="text-brand-red mt-1.5">●</span><span>{s}</span>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                            <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
                                <p className="eyebrow mb-2">Why work with us</p>
                                <p className="text-sm text-brand-charcoal leading-relaxed">
                                    Agents complete structured systems training before live deployment and work under supervision. Capacity is activated in line with signed contracts, so we scale with you rather than promising a bench we do not have.
                                </p>
                            </div>
                            <Link href="/contact?topic=quote" className="mt-8 btn-primary">Talk to us about a contract</Link>
                        </div>
                        <div className="lg:col-span-7">
                            <img src={connectGallery} alt="Good Connect team at the desks" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-3xl shadow-card" />
                        </div>
                    </div>
                </Container>
            </section>

            <CTABlock eyebrow="Ready to brief us?" title="Two paths, one call." description="Whether it's a launch event, a corporate gift run or a support desk, we'll come back within two working days." tone="red">
                <Link href={cms.text('cta.primary_route', '/contact?topic=quote')} className="btn bg-brand-off text-brand-charcoal hover:bg-white">{cms.text('cta.primary_label', 'Request a quote')}</Link>
                <Link href={cms.text('cta.secondary_route', '/contact?topic=partnership')} className="btn border border-brand-off/40 text-brand-off hover:border-brand-off">{cms.text('cta.secondary_label', 'Discuss a partnership')}</Link>
            </CTABlock>
        </>
    );
}
