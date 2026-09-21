import { useForm } from '@inertiajs/react';

export default function ContactForm({ topic = '', title = 'Send us a message' }) {
    const { data, setData, post, processing, wasSuccessful, errors, reset } = useForm({
        name: '', email: '', phone: '', topic, message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contact', { onSuccess: () => reset('name', 'email', 'phone', 'message') });
    };

    return (
        <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-8 lg:p-10 shadow-card ring-1 ring-brand-hairline">
            <h2 className="text-2xl font-black">{title}</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" error={errors.name}>
                    <input type="text" required value={data.name} onChange={(e) => setData('name', e.target.value)} className={input} />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} className={input} />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone (optional)" error={errors.phone}>
                    <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={input} />
                </Field>
                <Field label="What is this about?" error={errors.topic}>
                    <select value={data.topic} onChange={(e) => setData('topic', e.target.value)} className={input}>
                        <option value="">Choose one</option>
                        <option value="general">General enquiry</option>
                        <option value="quote">Request a quote (Good Studio / Good Connect)</option>
                        <option value="partnership">Partnership</option>
                        <option value="press">Press</option>
                        <option value="mentor">I want to mentor</option>
                        <option value="scholarship">I want to fund a scholarship</option>
                        <option value="apply">I want to apply to a programme</option>
                    </select>
                </Field>
            </div>

            <Field label="Your message" error={errors.message}>
                <textarea required rows={6} value={data.message} onChange={(e) => setData('message', e.target.value)} className={input} />
            </Field>

            <div className="flex items-center gap-4">
                <button type="submit" disabled={processing} className="btn-primary">
                    {processing ? 'Sending…' : 'Send message'}
                </button>
                {wasSuccessful && <p className="text-sm text-brand-charcoal">Thanks. We'll be in touch soon.</p>}
            </div>
        </form>
    );
}

const input = 'w-full rounded-xl border border-brand-hairline bg-white px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-grey focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20';

function Field({ label, children, error }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-grey">{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs text-brand-red">{error}</span>}
        </label>
    );
}
