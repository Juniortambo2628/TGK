import { Link } from '@inertiajs/react';

/**
 * Shared sticky bottom save bar used by AdminFormLayout, ContentEditor,
 * and any other admin form. Fixed bottom-center pill matching AdminToolbar.
 */
export default function StickySaveBar({
    processing = false,
    recentlySuccessful = false,
    submitLabel = 'Save changes',
    submitIcon,
    extra,
}) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px]">
            <div className="mx-auto max-w-5xl">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-hairline shadow-lg">
                    <div className="flex items-center justify-between px-4 py-3 gap-3">
                        <div className="flex items-center gap-3 min-w-0">{extra}</div>
                        <div className="flex items-center gap-3 flex-shrink-0">
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
    );
}
