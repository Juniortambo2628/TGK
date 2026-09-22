import { Head, useForm } from '@inertiajs/react';
import AdminFormLayout from '../../../Components/Admin/AdminFormLayout';
import AdminCard from '../../../Components/Admin/AdminCard';
import FileUploader from '../../../Components/Admin/FileUploader';

export default function Form({ partner = null }) {
    const isEdit = !!partner;

    const { data, setData, post, put, processing, errors, recentlySuccessful } = useForm({
        name: partner?.name || '',
        url: partner?.url || '',
        logo: partner?.logo_url || '',
        sort_order: partner?.sort_order ?? 0,
        is_active: partner?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.partners.update', partner.id), { preserveScroll: true });
        } else {
            post(route('admin.partners.store'), { preserveScroll: true });
        }
    };

    return (
        <AdminFormLayout
            title={isEdit ? 'Edit Partner' : 'Create Partner'}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'People', href: '/admin/partners' },
                { label: 'Partners', href: '/admin/partners' },
                { label: isEdit ? 'Edit' : 'Create' },
            ]}
            onSubmit={handleSubmit}
            processing={processing}
            recentlySuccessful={recentlySuccessful}
            submitLabel={isEdit ? 'Update Partner' : 'Create Partner'}
            sidebar={
                <>
                    {/* Logo */}
                    <AdminCard>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-charcoal">Partner Logo</h3>
                                <p className="text-xs text-brand-charcoal/50 mt-0.5">Upload the partner's logo image.</p>
                            </div>
                            <FileUploader
                                value={data.logo || null}
                                onChange={(url) => setData('logo', url || '')}
                                folder="partners"
                                accept="image/*"
                                maxSizeMB={2}
                                maxWidth={600}
                                quality={0.9}
                                label="Drop logo here or click to browse"
                            />
                            {errors.logo && <p className="mt-1.5 text-xs text-brand-red">{errors.logo}</p>}
                        </div>
                    </AdminCard>

                    {/* Settings */}
                    <AdminCard>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-charcoal">Settings</h3>
                                <p className="text-xs text-brand-charcoal/50 mt-0.5">Display order and visibility.</p>
                            </div>
                            <div>
                                <label htmlFor="sort_order" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                                    Sort Order
                                </label>
                                <input
                                    id="sort_order"
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-brand-hairline text-brand-red focus:ring-brand-red/30"
                                />
                                <span className="text-sm font-bold text-brand-charcoal">Active</span>
                            </label>
                        </div>
                    </AdminCard>
                </>
            }
        >
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Name <span className="text-brand-red">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Partner name"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.name ? 'border-brand-red' : 'border-brand-hairline'}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-brand-red">{errors.name}</p>}
            </div>

            {/* Website URL */}
            <div>
                <label htmlFor="url" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Website URL
                </label>
                <input
                    id="url"
                    type="url"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.url ? 'border-brand-red' : 'border-brand-hairline'}`}
                    placeholder="https://example.com"
                />
                {errors.url && <p className="mt-1.5 text-xs text-brand-red">{errors.url}</p>}
            </div>
        </AdminFormLayout>
    );
}
