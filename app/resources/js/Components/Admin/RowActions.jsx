import React, { useState, useRef, useEffect } from 'react';
import { IconVerticalThreeDots } from './Icons';

function RowActionsItem({ onClick, icon, danger, onClose, children }) {
    return (
        <button
            onClick={() => {
                onClick?.();
                onClose?.();
            }}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-brand-panel cursor-pointer transition-colors ${
                danger ? 'text-brand-red' : 'text-brand-charcoal'
            }`}
        >
            {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
}

function RowActions({ children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open]);

    return (
        <div className="relative inline-block" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="p-1.5 rounded-lg text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-panel transition-colors"
            >
                <IconVerticalThreeDots />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-brand-hairline shadow-card z-50 min-w-[160px] py-1">
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, { onClose: () => setOpen(false) })
                    )}
                </div>
            )}
        </div>
    );
}

RowActions.Item = RowActionsItem;

export default RowActions;
