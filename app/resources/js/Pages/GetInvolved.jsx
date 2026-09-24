import { Link, usePage, useForm } from '@inertiajs/react';
import Hero from '../Components/Hero';
import Container from '../Components/Container';
import { Reveal } from '../Components/Motion';
import { useCms } from '../lib/cms';
import { imageUrl } from '../lib/urls';

export default function GetInvolved() {
    const { props } = usePage();
    const cms = useCms();
    const donateUrl = props.donateUrl || '#';

    const heroImage = cms.hasImages('hero.images')
        ? imageUrl(cms.array('hero.images')[0])
        : '/images/landing/get-involved-hero.jpg';

    return (
        <>
            <Hero
                eyebrow={cms.text('hero.eyebrow', 'Get involved')}
                title={cms.text('hero.title', 'Four ways to walk with us.')}
                subtitle={cms.text('hero.subtitle', 'Donate, mentor, fund a scholarship, or send a young person to the next intake.')}
                image={heroImage}
                minHeight="min-h-[60vh]"
            />

            <section className="py-16 lg:py-24">
                <Container>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card
                            id="donate"
                            eyebrow="Donate"
                            title={cms.text('donate.title', 'Give once, or set up a monthly gift.')}
                            description={cms.text('donate.body', 'Donations go through our verified Keela page. USA tax receipts issued instantly.')}
                            ctaLabel="Donate now"
                            ctaHref={donateUrl}
                            external
                        />
                        <Card
                            id="scholarship"
                            eyebrow="Scholarship"
                            title={cms.text('scholarship.title', 'Name a scholarship for a young person.')}
                            description={cms.text('scholarship.body', 'Cover the six month Imarisha training or the one year Stawi placement. We report back on how it went.')}
                            ctaLabel={cms.text('scholarship.cta_label', 'Talk to us')}
                            ctaHref={cms.text('scholarship.cta_route', '/contact?topic=scholarship')}
                        />
                        <MentorForm
                            title={cms.text('mentor.title', 'Become a mentor.')}
                            intro={cms.text('mentor.intro', 'A few hours a month. Real conversations. Real outcomes.')}
                        />
                        <RegistrationForm
                            title={cms.text('register.title', 'Apply to a programme.')}
                            intro={cms.text('register.intro', 'For young people who want to join the next Msingi, Imarisha, Stawi or Daraja cohort.')}
                        />
                    </div>
                </Container>
            </section>
        </>
    );
}

function Card({ id, eyebrow, title, description, ctaLabel, ctaHref, external = false }) {
    return (
        <Reveal>
            <article id={id} className="scroll-mt-24 h-full rounded-3xl bg-white p-8 lg:p-10 shadow-card ring-1 ring-brand-hairline flex flex-col">
                <p className="eyebrow mb-3">{eyebrow}</p>
                <h2 className="text-2xl lg:text-3xl font-black mb-4">{title}</h2>
                <p className="text-brand-grey leading-relaxed flex-1">{description}</p>
                {external ? (
                    <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="mt-8 btn-primary self-start">{ctaLabel}</a>
                ) : (
                    <Link href={ctaHref} className="mt-8 btn-primary self-start">{ctaLabel}</Link>
                )}
            </article>
        </Reveal>
    );
}

function MentorForm({ title, intro }) {
    const { data, setData, post, processing, wasSuccessful, errors, reset } = useForm({
        name: '', email: '', phone: '', profession: '', hours_per_month: '', message: '',
    });
    const submit = (e) => { e.preventDefault(); post('/get-involved/mentor', { onSuccess: () => reset() }); };
    return (
        <Reveal>
            <form id="mentor" onSubmit={submit} className="scroll-mt-24 h-full rounded-3xl bg-brand-charcoal text-brand-off p-8 lg:p-10 shadow-card flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-red">Mentor</p>
                <h2 className="text-2xl lg:text-3xl font-black">{title}</h2>
                <p className="text-brand-off/80 text-sm">{intro}</p>
                <MutedInput placeholder="Your name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} type="text" required />
                <MutedInput placeholder="Email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} type="email" required />
                <MutedInput placeholder="Phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} type="tel" />
                <MutedInput placeholder="Profession" value={data.profession} onChange={(v) => setData('profession', v)} error={errors.profession} type="text" />
                <MutedInput placeholder="Hours per month you can give" value={data.hours_per_month} onChange={(v) => setData('hours_per_month', v)} error={errors.hours_per_month} type="text" />
                <textarea placeholder="Anything else we should know?" rows={3} value={data.message} onChange={(e) => setData('message', e.target.value)} className={mutedInputCls} />
                <button type="submit" disabled={processing} className="btn-primary self-start mt-2">
                    {processing ? 'Sending…' : 'Apply to mentor'}
                </button>
                {wasSuccessful && <p className="text-sm text-brand-off/85">Thanks. We'll be in touch.</p>}
            </form>
        </Reveal>
    );
}

function RegistrationForm({ title, intro }) {
    const { data, setData, post, processing, wasSuccessful, errors, reset } = useForm({
        name: '', email: '', phone: '', dob: '', location: '', programme: '', message: '',
    });
    const submit = (e) => { e.preventDefault(); post('/get-involved/register', { onSuccess: () => reset() }); };
    return (
        <Reveal>
            <form id="register" onSubmit={submit} className="scroll-mt-24 h-full rounded-3xl bg-brand-red text-brand-off p-8 lg:p-10 shadow-card flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-off/85">Register</p>
                <h2 className="text-2xl lg:text-3xl font-black">{title}</h2>
                <p className="text-brand-off/85 text-sm">{intro}</p>
                <MutedInput placeholder="Your full name" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} type="text" required />
                <MutedInput placeholder="Email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} type="email" required />
                <MutedInput placeholder="Phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} type="tel" required />
                <div className="grid grid-cols-2 gap-3">
                    <MutedInput placeholder="Date of birth" value={data.dob} onChange={(v) => setData('dob', v)} error={errors.dob} type="date" />
                    <MutedInput placeholder="Where do you live?" value={data.location} onChange={(v) => setData('location', v)} error={errors.location} type="text" />
                </div>
                <select value={data.programme} onChange={(e) => setData('programme', e.target.value)} className={mutedInputCls} required>
                    <option value="" className="text-brand-charcoal">Which programme?</option>
                    <option value="msingi" className="text-brand-charcoal">Msingi (Discover, 6 weeks)</option>
                    <option value="imarisha" className="text-brand-charcoal">Imarisha (Develop, 6 months)</option>
                    <option value="stawi" className="text-brand-charcoal">Stawi (Launch, 1 year)</option>
                    <option value="daraja" className="text-brand-charcoal">Daraja (girls 14–17)</option>
                </select>
                <textarea placeholder="Tell us a little about yourself" rows={3} value={data.message} onChange={(e) => setData('message', e.target.value)} className={mutedInputCls} />
                <button type="submit" disabled={processing} className="btn bg-brand-off text-brand-charcoal hover:bg-white self-start mt-2">
                    {processing ? 'Sending…' : 'Submit application'}
                </button>
                {wasSuccessful && <p className="text-sm text-brand-off/90">Thanks. We'll be in touch about the next intake.</p>}
            </form>
        </Reveal>
    );
}

const mutedInputCls = 'w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-brand-off placeholder:text-brand-off/60 focus:outline-none focus:border-brand-off/60';

function MutedInput({ placeholder, value, onChange, type = 'text', error, required }) {
    return (
        <div>
            <input type={type} required={required} value={value} placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)} className={mutedInputCls} />
            {error && <p className="mt-1 text-xs text-brand-off/80">{error}</p>}
        </div>
    );
}
