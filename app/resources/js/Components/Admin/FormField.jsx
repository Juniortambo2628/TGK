import { forwardRef } from 'react';

const inputClasses = (hasError) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${hasError ? 'border-brand-red' : 'border-brand-hairline'}`;

export function FormField({ label, required, error, children, htmlFor }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="block text-sm font-bold text-brand-charcoal mb-1.5">
                {label} {required && <span className="text-brand-red">*</span>}
            </label>
            {children}
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

export const TextInput = forwardRef(function TextInput({ id, error, className = '', ...props }, ref) {
    return (
        <input
            ref={ref}
            id={id}
            className={`${inputClasses(error)} ${className}`}
            {...props}
        />
    );
});

export const EmailInput = forwardRef(function EmailInput({ id, error, className = '', ...props }, ref) {
    return (
        <input
            ref={ref}
            id={id}
            type="email"
            className={`${inputClasses(error)} ${className}`}
            {...props}
        />
    );
});

export const PasswordInput = forwardRef(function PasswordInput({ id, error, className = '', ...props }, ref) {
    return (
        <input
            ref={ref}
            id={id}
            type="password"
            className={`${inputClasses(error)} ${className}`}
            {...props}
        />
    );
});

export const NumberInput = forwardRef(function NumberInput({ id, error, className = '', ...props }, ref) {
    return (
        <input
            ref={ref}
            id={id}
            type="number"
            className={`${inputClasses(error)} ${className}`}
            {...props}
        />
    );
});

export const UrlInput = forwardRef(function UrlInput({ id, error, className = '', ...props }, ref) {
    return (
        <input
            ref={ref}
            id={id}
            type="url"
            className={`${inputClasses(error)} ${className}`}
            {...props}
        />
    );
});

export const TextArea = forwardRef(function TextArea({ id, error, className = '', rows = 3, ...props }, ref) {
    return (
        <textarea
            ref={ref}
            id={id}
            rows={rows}
            className={`${inputClasses(error)} resize-y ${className}`}
            {...props}
        />
    );
});
