import { Link, useForm } from '@inertiajs/react';
import Container from './Container';
import { useSite } from '../lib/cms';
import { imageUrl } from '../lib/urls';

const SOCIAL_ICONS = {
    facebook:  { label: 'Facebook',  d: 'M13 22v-8h3l1-4h-4V7.5c0-1.2.4-2 2-2h2V2h-3c-3 0-5 1.8-5 5V10H6v4h3v8h4z' },
    instagram: { label: 'Instagram', d: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-.5a1 1 0 100 2 1 1 0 000-2z' },
    x:         { label: 'X',         d: 'M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l7-9L2 3h6l5 6 5-6z' },
    linkedin:  { label: 'LinkedIn',  d: 'M4 4h4v4H4V4zm0 6h4v10H4V10zm6 0h4v2c.7-1.3 2.2-2.3 4-2.3 3 0 5 2 5 5.4V20h-4v-6c0-1.6-.5-2.7-2-2.7-1.6 0-2.5 1.1-2.5 2.7V20h-4V10z' },
    youtube:   { label: 'YouTube',   d: 'M22 12s0-3.4-.4-5c-.3-1-1-1.7-2-2C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.6.5c-1 .3-1.7 1-2 2C2 8.6 2 12 2 12s0 3.4.4 5c.3 1 1 1.7 2 2 2 .5 7.6.5 7.6.5s5.6 0 7.6-.5c1-.3 1.7-1 2-2 .4-1.6.4-5 .4-5zM10 15V9l5 3-5 3z' },
};

const columns = [
    {
        title: 'About',
        links: [
            { label: 'Who We Are', href: '/about' },
            { label: 'Our Model', href: '/our-model' },
            { label: 'Regina Yego Girls Center', href: '/regina-yego' },
            { label: 'Partners', href: '/partners' },
        ],
    },
    {
        title: 'Stawi Enterprises',
        links: [
            { label: 'Good Studio', href: '/stawi#good-studio' },
            { label: 'Good Connect', href: '/stawi#good-connect' },
            { label: 'Request a quote', href: '/contact?topic=quote' },
        ],
    },
    {
        title: 'Get Involved',
        links: [
            { label: 'Become a Mentor', href: '/get-involved#mentor' },
            { label: 'Give a Scholarship', href: '/get-involved#scholarship' },
            { label: 'Registration Form', href: '/get-involved#register' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },
];

export default function Footer() {
    const site = useSite();
    const donateUrl = site.donateUrl || '#';
    const social = site.social || {};
    const logoSrc = imageUrl(site.logo, '/images/tgkf-logo.png');

    const { data, setData, post, processing, wasSuccessful, errors, reset } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/newsletter', { onSuccess: () => reset('email') });
    };

    return (
        <footer className="bg-brand-charcoal text-brand-off">
            <Container className="py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <div
                            role="img"
                            aria-label={site.name || 'Good Kenyan Foundation'}
                            className="h-14 w-48 mb-6 bg-brand-off"
                            style={{
                                WebkitMaskImage: `url(${logoSrc})`,
                                maskImage: `url(${logoSrc})`,
                                WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                                WebkitMaskSize: 'contain', maskSize: 'contain',
                                WebkitMaskPosition: 'left center', maskPosition: 'left center',
                            }}
                        />
                        <p className="text-brand-off/80 max-w-sm">
                            {site.description || 'From school to opportunity. We equip young people with the skills, mentorship and pathways to move from education into work or entrepreneurship.'}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            {Object.entries(SOCIAL_ICONS).map(([key, meta]) => {
                                const href = social[key];
                                if (!href) return null;
                                return (
                                    <a
                                        key={key}
                                        href={href}
                                        target="_blank"
                                        rel="noopener"
                                        aria-label={meta.label}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-brand-red transition-colors"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d={meta.d} /></svg>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {columns.map((col) => (
                        <div key={col.title} className="lg:col-span-2">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-off mb-4">{col.title}</h3>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-brand-off/75 hover:text-brand-off text-sm">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="lg:col-span-2">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-off mb-4">Stay in Touch</h3>
                        <p className="text-brand-off/75 text-sm mb-4">
                            News from the centers, four times a year. No spam.
                        </p>
                        <form onSubmit={submit} className="flex flex-col gap-2">
                            <label htmlFor="footer-email" className="sr-only">Email address</label>
                            <input
                                id="footer-email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-full bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-brand-off placeholder:text-brand-off/50 focus:outline-none focus:border-brand-red"
                            />
                            <button type="submit" disabled={processing} className="btn-primary text-xs py-2.5">
                                {processing ? 'Subscribing…' : 'Subscribe'}
                            </button>
                            {wasSuccessful && <p className="text-xs text-brand-off/80">Thanks. You're on the list.</p>}
                            {errors.email && <p className="text-xs text-brand-red-tint">{errors.email}</p>}
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-brand-off/60">
                    <p>© {new Date().getFullYear()} {site.name || 'Good Kenyan Foundation'}. Registered in Kenya.</p>
                    <p>{site.contact?.eldoret ? `${site.contact.eldoret} · ${site.contact.nairobi || ''}` : 'Regina Yego Girls Center, Mile 13 Juakali, Eldoret · PO Box 15137, 00100 Nairobi'}</p>
                    <a href={donateUrl} target="_blank" rel="noopener" className="text-brand-off hover:text-brand-red">
                        Donate →
                    </a>
                </div>
            </Container>
        </footer>
    );
}
