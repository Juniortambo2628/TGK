import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function ContactPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'contact' },
            ],
        },
        {
            key: 'form',
            label: 'Form',
            fields: [
                { key: 'left.eyebrow', label: 'Left Eyebrow' },
                { key: 'left.title', label: 'Left Title' },
                { key: 'form.title', label: 'Form Title' },
            ],
        },
    ];

    return (
        <ContentEditor
            pageSlug={pageSlug}
            pageTitle={page.label}
            pageDescription="Manage the content for the Contact page, including hero section and form configuration."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Contact' },
            ]}
        />
    );
}
