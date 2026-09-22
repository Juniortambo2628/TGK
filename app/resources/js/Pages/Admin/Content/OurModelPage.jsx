import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function OurModelPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'our-model' },
            ],
        },
        {
            key: 'stages',
            label: 'Three Stages',
            fields: [
                {
                    key: 'stages',
                    label: 'Stages',
                    type: 'repeater',
                    fields: [
                        { key: 'stage', label: 'Stage Number' },
                        { key: 'name', label: 'Name' },
                        { key: 'swahili', label: 'Swahili Name' },
                        { key: 'duration', label: 'Duration' },
                        { key: 'description', label: 'Description', type: 'textarea', richText: true },
                        { key: 'exit', label: 'Exit Criteria' },
                    ],
                },
            ],
        },
        {
            key: 'daraja',
            label: 'Daraja Upstream',
            fields: [
                { key: 'daraja.eyebrow', label: 'Eyebrow' },
                { key: 'daraja.title', label: 'Title' },
                { key: 'daraja.body', label: 'Body', type: 'textarea', richText: true },
                { key: 'daraja.image', label: 'Section image', type: 'image', folder: 'our-model' },
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
                { key: 'cta.daraja_label', label: 'Daraja Link Label' },
                { key: 'cta.daraja_route', label: 'Daraja Link Route', type: 'link-picker' },
            ],
        },
    ];

    return (
        <ContentEditor
            pageSlug={pageSlug}
            pageTitle={page.label}
            pageDescription="Manage the content for the Our Model page, including the three stages and Daraja upstream program."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Our Model' },
            ]}
        />
    );
}
