import { Head, useForm, usePage, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import AdminHero from '../../Components/Admin/AdminHero';
import AdminCard from '../../Components/Admin/AdminCard';
import StickySaveBar from '../../Components/Admin/StickySaveBar';
import FileUploader from '../../Components/Admin/FileUploader';

const tabs = [
    { key: 'identity', label: 'Identity' },
    { key: 'contact', label: 'Contact' },
    { key: 'socials', label: 'Socials' },
];

function Field({ label, id, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-brand-charcoal mb-1.5">
                {label}
            </label>
            <input
                id={id}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                    error ? 'border-brand-red' : 'border-brand-hairline'
                }`}
                {...props}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function TextareaField({ label, id, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-brand-charcoal mb-1.5">
                {label}
            </label>
            <textarea
                id={id}
                rows={3}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                    error ? 'border-brand-red' : 'border-brand-hairline'
                }`}
                {...props}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function IdentityForm({ settings, errors }) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        site_name: settings.site_name || '',
        tagline: settings.tagline || '',
        short_description: settings.short_description || '',
        logo_wordmark: settings.logo_wordmark || '',
        logo_favicon: settings.logo_favicon || '',
        logo_social: settings.logo_social || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.update', { tab: 'identity' }), {
            preserveScroll: true,
            onSuccess: () => toast.success('Identity settings saved.'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Field
                label="Site Name"
                id="site_name"
                value={data.site_name}
                onChange={(e) => setData('site_name', e.target.value)}
                placeholder="Good Kenyan Foundation"
                error={errors.site_name}
            />
            <Field
                label="Tagline"
                id="tagline"
                value={data.tagline}
                onChange={(e) => setData('tagline', e.target.value)}
                placeholder="Empowering communities"
                error={errors.tagline}
            />
            <TextareaField
                label="Short Description"
                id="short_description"
                value={data.short_description}
                onChange={(e) => setData('short_description', e.target.value)}
                placeholder="A brief description of the organisation"
                error={errors.short_description}
            />
            <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Logo Wordmark
                </label>
                <FileUploader
                    value={data.logo_wordmark || null}
                    onChange={(url) => setData('logo_wordmark', url || '')}
                    folder="brand"
                    accept="image/*"
                    maxSizeMB={2}
                    maxWidth={800}
                    quality={0.9}
                    label="Drop logo wordmark here or click to browse"
                />
                {errors.logo_wordmark && <p className="mt-1.5 text-xs text-brand-red">{errors.logo_wordmark}</p>}
            </div>
            <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Favicon
                </label>
                <FileUploader
                    value={data.logo_favicon || null}
                    onChange={(url) => setData('logo_favicon', url || '')}
                    folder="brand"
                    accept="image/*"
                    maxSizeMB={1}
                    maxWidth={256}
                    quality={0.95}
                    label="Drop favicon here or click to browse"
                />
                {errors.logo_favicon && <p className="mt-1.5 text-xs text-brand-red">{errors.logo_favicon}</p>}
            </div>
            <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Social Share Image
                </label>
                <FileUploader
                    value={data.logo_social || null}
                    onChange={(url) => setData('logo_social', url || '')}
                    folder="brand"
                    accept="image/*"
                    maxSizeMB={5}
                    maxWidth={1200}
                    quality={0.85}
                    label="Drop social share image here or click to browse"
                />
                {errors.logo_social && <p className="mt-1.5 text-xs text-brand-red">{errors.logo_social}</p>}
            </div>

            <SubmitButton processing={processing} recentlySuccessful={recentlySuccessful} />
        </form>
    );
}

function ContactForm({ settings, errors }) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        notify_email: settings.notify_email || '',
        address_eldoret: settings.address_eldoret || '',
        address_nairobi: settings.address_nairobi || '',
        donate_url: settings.donate_url || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.update', { tab: 'contact' }), {
            preserveScroll: true,
            onSuccess: () => toast.success('Contact settings saved.'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Field
                label="Contact Email"
                id="contact_email"
                type="email"
                value={data.contact_email}
                onChange={(e) => setData('contact_email', e.target.value)}
                placeholder="hello@goodkenyan.org"
                error={errors.contact_email}
            />
            <Field
                label="Contact Phone"
                id="contact_phone"
                type="tel"
                value={data.contact_phone}
                onChange={(e) => setData('contact_phone', e.target.value)}
                placeholder="+254 700 000 000"
                error={errors.contact_phone}
            />
            <Field
                label="Notification Email"
                id="notify_email"
                type="email"
                value={data.notify_email}
                onChange={(e) => setData('notify_email', e.target.value)}
                placeholder="admin@goodkenyan.org"
                error={errors.notify_email}
            />
            <TextareaField
                label="Eldoret Address"
                id="address_eldoret"
                value={data.address_eldoret}
                onChange={(e) => setData('address_eldoret', e.target.value)}
                placeholder="Eldoret office address"
                error={errors.address_eldoret}
            />
            <TextareaField
                label="Nairobi Address"
                id="address_nairobi"
                value={data.address_nairobi}
                onChange={(e) => setData('address_nairobi', e.target.value)}
                placeholder="Nairobi office address"
                error={errors.address_nairobi}
            />
            <Field
                label="Donate URL"
                id="donate_url"
                value={data.donate_url}
                onChange={(e) => setData('donate_url', e.target.value)}
                placeholder="https://paystack.com/donate"
                error={errors.donate_url}
            />

            <SubmitButton processing={processing} recentlySuccessful={recentlySuccessful} />
        </form>
    );
}

function SocialsForm({ settings, errors }) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        social_facebook: settings.social_facebook || '',
        social_instagram: settings.social_instagram || '',
        social_x: settings.social_x || '',
        social_linkedin: settings.social_linkedin || '',
        social_youtube: settings.social_youtube || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.update', { tab: 'socials' }), {
            preserveScroll: true,
            onSuccess: () => toast.success('Social media settings saved.'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Field
                label="Facebook URL"
                id="social_facebook"
                value={data.social_facebook}
                onChange={(e) => setData('social_facebook', e.target.value)}
                placeholder="https://facebook.com/goodkenyan"
                error={errors.social_facebook}
            />
            <Field
                label="Instagram URL"
                id="social_instagram"
                value={data.social_instagram}
                onChange={(e) => setData('social_instagram', e.target.value)}
                placeholder="https://instagram.com/goodkenyan"
                error={errors.social_instagram}
            />
            <Field
                label="X (Twitter) URL"
                id="social_x"
                value={data.social_x}
                onChange={(e) => setData('social_x', e.target.value)}
                placeholder="https://x.com/goodkenyan"
                error={errors.social_x}
            />
            <Field
                label="LinkedIn URL"
                id="social_linkedin"
                value={data.social_linkedin}
                onChange={(e) => setData('social_linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/goodkenyan"
                error={errors.social_linkedin}
            />
            <Field
                label="YouTube URL"
                id="social_youtube"
                value={data.social_youtube}
                onChange={(e) => setData('social_youtube', e.target.value)}
                placeholder="https://youtube.com/@goodkenyan"
                error={errors.social_youtube}
            />

            <SubmitButton processing={processing} recentlySuccessful={recentlySuccessful} />
        </form>
    );
}

function SubmitButton({ processing, recentlySuccessful }) {
    return (
        <StickySaveBar
            processing={processing}
            recentlySuccessful={recentlySuccessful}
            submitLabel="Save changes"
        />
    );
}

export default function Settings() {
    const { props } = usePage();
    const { tab, settings } = props;
    const errors = props.errors || {};

    const activeTab = tab || 'identity';

    const switchTab = (key) => {
        router.get(route('admin.settings.edit', { tab: key }), {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Settings" />

            <AdminHero
                title="Settings"
                description="Manage your site configuration."
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Settings' },
                ]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8">
                <div className="max-w-3xl">
                    <AdminCard>
                        <div className="p-6">
                            {/* Tabs */}
                            <div className="flex gap-0 border-b border-brand-hairline">
                                {tabs.map((t) => (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => switchTab(t.key)}
                                        className={`relative px-5 py-3 text-sm font-bold transition-colors ${
                                            activeTab === t.key
                                                ? 'text-brand-red'
                                                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
                                        }`}
                                    >
                                        {t.label}
                                        {activeTab === t.key && (
                                            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-red" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="mt-8">
                                {activeTab === 'identity' && <IdentityForm settings={settings.identity} errors={errors} />}
                                {activeTab === 'contact' && <ContactForm settings={settings.contact} errors={errors} />}
                                {activeTab === 'socials' && <SocialsForm settings={settings.socials} errors={errors} />}
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </>
    );
}
