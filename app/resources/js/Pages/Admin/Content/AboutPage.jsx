import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function AboutPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'about' },
            ],
        },
        {
            key: 'story',
            label: 'Our Story',
            fields: [
                { key: 'story.eyebrow', label: 'Eyebrow' },
                { key: 'story.title', label: 'Title' },
                { key: 'story.body', label: 'Body', type: 'textarea', richText: true },
            ],
        },
        {
            key: 'mission',
            label: 'Mission & Vision',
            fields: [
                { key: 'mission', label: 'Mission', type: 'textarea', richText: true },
                { key: 'vision', label: 'Vision', type: 'textarea', richText: true },
            ],
        },
        {
            key: 'values',
            label: 'Values & Voice',
            fields: [
                { key: 'values.title', label: 'Title' },
                { key: 'values.body', label: 'Body', type: 'textarea', richText: true },
                { key: 'values.image', label: 'Supporting image', type: 'image', folder: 'about' },
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
            pageDescription="Manage the content for the About page, including your story, mission, vision, and values."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'About Page' },
            ]}
        />
    );
}
