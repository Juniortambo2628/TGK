import ContentEditor from '../../../Components/Admin/ContentEditor';

export default function GetInvolvedPage({ page, pageSlug, blocks = {} }) {
    const tabs = [
        {
            key: 'hero',
            label: 'Hero',
            fields: [
                { key: 'hero.eyebrow', label: 'Eyebrow' },
                { key: 'hero.title', label: 'Title' },
                { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'get-involved' },
            ],
        },
        {
            key: 'cards',
            label: 'Cards',
            fields: [
                { key: 'donate.title', label: 'Donate Title' },
                { key: 'donate.body', label: 'Donate Body', type: 'textarea', richText: true },
                { key: 'donate.image', label: 'Donate Image', type: 'image', folder: 'get-involved' },
                { key: 'scholarship.title', label: 'Scholarship Title' },
                { key: 'scholarship.body', label: 'Scholarship Body', type: 'textarea', richText: true },
                { key: 'scholarship.image', label: 'Scholarship Image', type: 'image', folder: 'get-involved' },
                { key: 'mentor.title', label: 'Mentor Title' },
                { key: 'mentor.intro', label: 'Mentor Intro', type: 'textarea', richText: true },
                { key: 'mentor.image', label: 'Mentor Image', type: 'image', folder: 'get-involved' },
                { key: 'register.title', label: 'Register Title' },
                { key: 'register.intro', label: 'Register Intro', type: 'textarea', richText: true },
                { key: 'register.image', label: 'Register Image', type: 'image', folder: 'get-involved' },
            ],
        },
        {
            key: 'cta',
            label: 'CTA Links',
            fields: [
                { key: 'donate.cta_label', label: 'Donate CTA Label' },
                { key: 'donate.cta_route', label: 'Donate CTA Route', type: 'link-picker' },
                { key: 'scholarship.cta_label', label: 'Scholarship CTA Label' },
                { key: 'scholarship.cta_route', label: 'Scholarship CTA Route', type: 'link-picker' },
                { key: 'mentor.cta_label', label: 'Mentor CTA Label' },
                { key: 'mentor.cta_route', label: 'Mentor CTA Route', type: 'link-picker' },
                { key: 'register.cta_label', label: 'Register CTA Label' },
                { key: 'register.cta_route', label: 'Register CTA Route', type: 'link-picker' },
            ],
        },
    ];

    return (
        <ContentEditor
            pageSlug={pageSlug}
            pageTitle={page.label}
            pageDescription="Manage the content for the Get Involved page, including donation, scholarship, mentor, and register cards."
            blocks={blocks}
            tabs={tabs}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Get Involved' },
            ]}
        />
    );
}
