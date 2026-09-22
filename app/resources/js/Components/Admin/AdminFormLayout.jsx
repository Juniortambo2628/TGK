import { Head } from '@inertiajs/react';
import AdminHero from './AdminHero';

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

                {/* Sticky Save Toolbar */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px]">
                    <div className="mx-auto max-w-5xl">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-hairline shadow-lg">
                            <div className="flex items-center justify-between px-4 py-3">
                                <div />
                                <div className="flex items-center gap-3">
                                    {recentlySuccessful && (
                                        <span className="text-sm font-medium text-green-600">Saved successfully.</span>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-red-deep hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {submitIcon}
                                        {processing ? 'Saving...' : submitLabel}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
