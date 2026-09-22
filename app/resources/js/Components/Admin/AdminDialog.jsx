import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconX, IconArrowLeft } from './Icons';

function DialogField({ label, children, mono, className = '' }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <span className="text-[11px] font-semibold tracking-wide text-brand-charcoal/40">{label}</span>
            <div className={`text-sm text-brand-charcoal ${mono ? 'font-mono text-xs' : ''}`}>{children}</div>
        </div>
    );
}

function DialogSection({ title, children, className = '' }) {
    return (
        <div className={`space-y-3 ${className}`}>
            <h4 className="text-[11px] font-semibold tracking-wide text-brand-charcoal/40 border-b border-brand-hairline pb-2">{title}</h4>
            {children}
        </div>
    );
}

function DialogDivider() {
    return <div className="h-px bg-brand-hairline" />;
}

function DialogActions({ children, className = '' }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {children}
        </div>
    );
}

export default function AdminDialog({
    open,
    onClose,
    title,
    subtitle,
    size = 'lg',
    showBackButton = false,
    onBack,
    headerRight,
    children,
    footer,
    footerClassName = '',
}) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const maxWidthClass = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
        full: 'max-w-7xl',
    }[size] || 'max-w-3xl';

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 pt-[5vh] sm:pt-[8vh]">
                    <motion.div
                        className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        ref={panelRef}
                        className={`relative z-10 w-full ${maxWidthClass} my-4 rounded-2xl border border-brand-hairline bg-white shadow-2xl`}
                        initial={{ opacity: 0, scale: 0.97, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 12 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-brand-hairline px-6 py-4">
                            {showBackButton && (
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="p-1.5 -ml-2 rounded-lg text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors"
                                >
                                    <IconArrowLeft className="h-5 w-5" />
                                </button>
                            )}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-black text-brand-charcoal truncate">{title}</h2>
                                {subtitle && <p className="text-xs text-brand-charcoal/50 mt-0.5 truncate">{subtitle}</p>}
                            </div>
                            {headerRight}
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors"
                            >
                                <IconX className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className={`border-t border-brand-hairline px-6 py-4 bg-brand-panel/30 rounded-b-2xl ${footerClassName}`}>
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

AdminDialog.Field = DialogField;
AdminDialog.Section = DialogSection;
AdminDialog.Divider = DialogDivider;
AdminDialog.Actions = DialogActions;
