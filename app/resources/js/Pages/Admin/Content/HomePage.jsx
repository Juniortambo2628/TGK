import ContentEditor from '../../../Components/Admin/ContentEditor';

const TABS = [
    {
        key: 'hero',
        label: 'Hero',
        fields: [
            { key: 'hero.eyebrow', label: 'Eyebrow' },
            { key: 'hero.title', label: 'Title' },
            { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
            { key: 'hero.images', label: 'Hero background images', type: 'gallery', folder: 'home' },
            { key: 'hero.cta_primary_label', label: 'Primary CTA Label' },
            { key: 'hero.cta_primary_route', label: 'Primary CTA Route', type: 'link-picker' },
            { key: 'hero.cta_secondary_label', label: 'Secondary CTA Label' },
            { key: 'hero.cta_secondary_route', label: 'Secondary CTA Route', type: 'link-picker' },
        ],
    },
    {
        key: 'who',
        label: 'Who We Are',
        fields: [
            { key: 'who.eyebrow', label: 'Eyebrow' },
            { key: 'who.title', label: 'Title' },
            { key: 'who.body', label: 'Body', type: 'textarea', richText: true },
            { key: 'who.image', label: 'Section image', type: 'image', folder: 'home' },
            { key: 'who.mission', label: 'Mission Statement', type: 'textarea', richText: true },
            { key: 'who.vision', label: 'Vision Statement', type: 'textarea', richText: true },
        ],
    },
    {
        key: 'impact',
        label: 'Impact Numbers',
        fields: [
            { key: 'impact.eyebrow', label: 'Eyebrow' },
            { key: 'impact.title', label: 'Title' },
            { key: 'impact.body', label: 'Description', type: 'textarea', richText: true },
            { key: 'impact.image', label: 'Section image', type: 'image', folder: 'home' },
            { key: 'impact.centers_text', label: 'Centers Text' },
        ],
    },
    {
        key: 'problem',
        label: 'The Problem',
        fields: [
            { key: 'problem.eyebrow', label: 'Eyebrow' },
            { key: 'problem.title', label: 'Title' },
            { key: 'problem.description', label: 'Description', type: 'textarea', richText: true },
            { key: 'problem.image', label: 'Section image', type: 'image', folder: 'home' },
        ],
    },
    {
        key: 'believe',
        label: 'We Believe',
        fields: [
            { key: 'believe.body', label: 'Statement', type: 'textarea', richText: true },
        ],
    },
    {
        key: 'model',
        label: 'Our Model',
        fields: [
            { key: 'model.eyebrow', label: 'Eyebrow' },
            { key: 'model.title', label: 'Title' },
            { key: 'model.description', label: 'Description', type: 'textarea', richText: true },
            { key: 'model.image', label: 'Section image', type: 'image', folder: 'home' },
        ],
    },
    {
        key: 'stawi',
        label: 'Stawi',
        fields: [
            { key: 'stawi.eyebrow', label: 'Eyebrow' },
            { key: 'stawi.title', label: 'Title' },
            { key: 'stawi.body', label: 'Body', type: 'textarea', richText: true },
            { key: 'stawi.image', label: 'Section image', type: 'image', folder: 'home' },
        ],
    },
    {
        key: 'cta',
        label: 'Bottom CTA',
        fields: [
            { key: 'cta.title', label: 'Title' },
            { key: 'cta.description', label: 'Description', type: 'textarea', richText: true },
            { key: 'cta.image', label: 'CTA image', type: 'image', folder: 'home' },
        ],
    },
];

export default function HomePage({ page, pageSlug, blocks = {} }) {
    return (
        <ContentEditor
            pageSlug={pageSlug}
            pageTitle={page.label}
            pageDescription="Manage the content for the home page, including hero, impact numbers, and call-to-action sections."
            blocks={blocks}
            tabs={TABS}
            route={route('admin.content.update', pageSlug)}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Content' },
                { label: 'Home Page' },
            ]}
        />
    );
}
