export default function AdminCard({ children, className = '', header = null }) {
    return (
        <div className={`bg-white rounded-xl border border-brand-hairline shadow-soft overflow-hidden ${className}`}>
            {header && (
                <div className="px-6 py-4 border-b border-brand-hairline">
                    {header}
                </div>
            )}
            {children}
        </div>
    );
}
