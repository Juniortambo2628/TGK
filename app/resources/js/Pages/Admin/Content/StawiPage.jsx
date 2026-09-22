import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function StawiPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'stawi' },
            ],
        },
        {
            key: 'studio',
            label: 'Good Studio',
            fields: [
                { key: 'studio.eyebrow', label: 'Eyebrow' },
                { key: 'studio.title', label: 'Title' },
                { key: 'studio.body', label: 'Body', type: 'textarea', richText: true },
                { key: 'studio.image', label: 'Section image', type: 'image', folder: 'stawi' },
                { key: 'studio.services', label: 'Services', type: 'services-list' },
            ],
        },
        {
            key: 'connect',
            label: 'Good Connect',
            fields: [
                { key: 'connect.eyebrow', label: 'Eyebrow' },
                { key: 'connect.title', label: 'Title' },
                { key: 'connect.body', label: 'Body', type: 'textarea', richText: true },
                { key: 'connect.image', label: 'Section image', type: 'image', folder: 'stawi' },
                { key: 'connect.services', label: 'Services', type: 'services-list' },
            ],
        },
        {
            key: 'products',
            label: 'Selected Work',
            fields: [
                { key: 'products', label: 'Products', type: 'products-editor' },
            ],
        },
        {
            key: 'cta',
            label: 'CTA Buttons',
            fields: [
                { key: 'cta.primary_label', label: 'Primary CTA Label' },
                { key: 'cta.primary_route', label: 'Primary CTA Route', type: 'link-picker' },
                { key: 'cta.secondary_label', label: 'Secondary CTA Label' },
                { key: 'cta.secondary_route', label: 'Secondary CTA Route', type: 'link-picker' },
            ],
        },
    ];

    return (
        <ContentEditor
            pageSlug={pageSlug}
            pageTitle={page.label}
            pageDescription="Manage the content for the Stawi page, including services, products, and media."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Stawi' },
            ]}
        />
    );
}
