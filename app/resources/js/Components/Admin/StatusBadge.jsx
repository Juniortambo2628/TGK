const variantMap = {
    published: 'green', draft: 'grey', active: 'green', inactive: 'grey',
    handled: 'green', unhandled: 'red', new: 'red', contacted: 'amber',
    onboarded: 'green', accepted: 'green', committed: 'green', declined: 'grey',
    approved: 'green', pending: 'amber', rejected: 'red',
    msingi: 'red', imarisha: 'red', stawi: 'red', daraja: 'red',
};

export function Badge({ children, variant = 'red' }) {
    const variants = {
        red: 'bg-brand-red/10 text-brand-red',
        green: 'bg-green-50 text-green-700',
        grey: 'bg-brand-charcoal/10 text-brand-charcoal/60',
        amber: 'bg-amber-50 text-amber-700',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${variants[variant] || variants.red}`}>
            {children}
        </span>
    );
}

export default function StatusBadge({ status }) {
    if (!status) return null;
    const key = String(status).toLowerCase();
    const variant = variantMap[key] || 'grey';
    const label = String(status).charAt(0).toUpperCase() + String(status).slice(1);
    return <Badge variant={variant}>{label}</Badge>;
}
