import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function StoriesPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'stories' },
            ],
        },
        {
            key: 'sidebar',
            label: 'Sidebar',
            fields: [
                { key: 'sidebar.footer_note', label: 'Footer Note', type: 'textarea', richText: true },
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
            pageDescription="Manage the content for the Stories index page, including hero section and sidebar settings."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Stories Index' },
            ]}
        />
    );
}
