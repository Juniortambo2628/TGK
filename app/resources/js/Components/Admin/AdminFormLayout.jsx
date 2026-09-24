import { Head } from '@inertiajs/react';
import AdminHero from './AdminHero';
import StickySaveBar from './StickySaveBar';

/**
 * Reusable two-column form layout for admin create/edit pages.
 *
 * Props:
 *   title              – page <title> and hero heading
 *   description        – optional hero subtitle
 *   breadcrumbs        – breadcrumb array for AdminHero
 *   actions            – optional hero action buttons
 *   children           – main column form fields (rendered in an 8-col card)
 *   sidebar            – sidebar content (rendered in a 4-col card)
 *   onSubmit           – form submit handler
 *   processing         – boolean, disables submit button while true
 *   recentlySuccessful – boolean, shows success message
 *   submitLabel        – text for the submit button
 *   submitIcon         – optional SVG node to show before the label
 */
export default function AdminFormLayout({
    title,
    description,
    breadcrumbs = [],
    actions,
    children,
    sidebar,
    onSubmit,
    processing = false,
    recentlySuccessful = false,
    submitLabel = 'Save changes',
    submitIcon,
}) {
    return (
        <>
            <Head title={title} />

            <AdminHero
                title={title}
                description={description}
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <form onSubmit={onSubmit}>
                <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8">
                    <div className="grid gap-6 lg:grid-cols-12 items-start">
                        {/* Main Column */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="rounded-xl border border-brand-hairline bg-white">
                                <div className="p-6 lg:p-8 space-y-6">
                                    {children}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        {sidebar && (
                            <div className="lg:col-span-4 space-y-6">
                                {sidebar}
                            </div>
                        )}
                    </div>
                </div>

                <StickySaveBar
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submitLabel={submitLabel}
                    submitIcon={submitIcon}
                />
            </form>
        </>
    );
}
