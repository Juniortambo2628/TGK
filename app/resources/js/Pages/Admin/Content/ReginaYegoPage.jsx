import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function ReginaYegoPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'regina-yego' },
            ],
        },
        {
            key: 'who',
            label: 'Who We Serve',
            fields: [
                { key: 'who.eyebrow', label: 'Eyebrow' },
                { key: 'who.title', label: 'Title' },
                { key: 'who.body', label: 'Body', type: 'textarea', richText: true },
                { key: 'who.image', label: 'Section image', type: 'image', folder: 'regina-yego' },
            ],
        },
        {
            key: 'stats',
            label: 'Stats',
            fields: [
                {
                    key: 'stats',
                    label: 'Stats',
                    type: 'repeater',
                    fields: [
                        { key: 'value', label: 'Value' },
                        { key: 'label', label: 'Label' },
                    ],
                },
            ],
        },
        {
            key: 'growing',
            label: 'Growing the Family',
            fields: [
                { key: 'growing.title', label: 'Title' },
                { key: 'growing.body', label: 'Body', type: 'textarea', richText: true },
                { key: 'growing.image', label: 'Section image', type: 'image', folder: 'regina-yego' },
            ],
        },
        {
            key: 'cta',
            label: 'CTA Button',
            fields: [
                { key: 'cta.label', label: 'CTA Label' },
                { key: 'cta.route', label: 'CTA Route', type: 'link-picker' },
            ],
        },
    ];

    return (
        <ContentEditor
            pageSlug={pageSlug}
            pageTitle={page.label}
            pageDescription="Manage the content for the Regina Yego page, including stats and who we serve."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Regina Yego' },
            ]}
        />
    );
}
