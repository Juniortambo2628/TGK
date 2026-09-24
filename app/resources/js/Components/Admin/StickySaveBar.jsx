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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px]">
            <div className="mx-auto max-w-5xl">
                <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-soft">
                    <div className="flex items-center justify-between px-2.5 py-2 gap-3">
                        <div className="flex items-center gap-2 min-w-0">{extra}</div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {recentlySuccessful && (
                                <span className="text-xs font-medium text-green-600">Saved successfully.</span>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-deep hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
