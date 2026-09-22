import { useState } from 'react';
import AdminDialog from './AdminDialog';
import StatusBadge from './StatusBadge';

function Field({ label, children, className = '' }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <span className="text-[11px] font-semibold tracking-wide text-brand-charcoal/40">{label}</span>
            <div className="text-sm text-brand-charcoal leading-relaxed">{children}</div>
        </div>
    );
}

function Section({ title, children, className = '' }) {
    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="text-xs font-semibold tracking-wide text-brand-charcoal/40 border-b border-brand-hairline pb-2">{title}</h4>
            {children}
        </div>
    );
}

const STATUS_CONFIG = {
    'contact-messages': {
        title: 'Message Details',
        fields: (item) => [
            { label: 'Sender', value: item.name },
            { label: 'Email', value: item.email, type: 'email' },
            { label: 'Topic', value: item.topic || '—' },
        ],
        sidebar: (item) => ({
            status: item.is_handled ? 'handled' : 'unhandled',
            date: item.created_at,
        }),
        hasMessage: true,
    },
    'mentor-applications': {
        title: 'Application Details',
        fields: (item) => [
            { label: 'Applicant', value: item.name },
            { label: 'Email', value: item.email, type: 'email' },
            { label: 'Profession', value: item.profession || '—' },
        ],
        sidebar: (item) => ({
            status: item.status || 'new',
            date: item.created_at,
            statusOptions: [
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'onboarded', label: 'Onboarded' },
                { value: 'declined', label: 'Declined' },
            ],
        }),
        hasMessage: true,
    },
    'registrations': {
        title: 'Registration Details',
        fields: (item) => [
            { label: 'Name', value: item.name },
            { label: 'Email', value: item.email, type: 'email' },
            { label: 'Phone', value: item.phone || '—' },
            { label: 'Programme', value: item.programme, type: 'badge' },
        ],
        sidebar: (item) => ({
            status: item.status || 'new',
            date: item.created_at,
            statusOptions: [
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'declined', label: 'Declined' },
            ],
        }),
        hasMessage: true,
    },
    'scholarship-applications': {
        title: 'Application Details',
        fields: (item) => [
            { label: 'Applicant', value: item.name },
            { label: 'Email', value: item.email, type: 'email' },
            { label: 'Organisation', value: item.organisation || '—' },
            { label: 'Amount', value: item.amount ? `KES ${Number(item.amount).toLocaleString()}` : '—' },
        ],
        sidebar: (item) => ({
            status: item.status || 'new',
            date: item.created_at,
            statusOptions: [
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'committed', label: 'Committed' },
                { value: 'declined', label: 'Declined' },
            ],
        }),
        hasMessage: true,
    },
    'subscribers': {
        title: 'Subscriber Details',
        fields: (item) => [
            { label: 'Email', value: item.email, type: 'email' },
            { label: 'IP Address', value: item.ip_address || '—', mono: true },
        ],
        sidebar: (item) => ({
            status: null,
            date: item.created_at,
        }),
        hasMessage: false,
    },
};

function renderFieldValue(field) {
    if (field.type === 'email') {
        return (
            <a href={`mailto:${field.value}`} className="text-brand-red hover:underline">{field.value}</a>
        );
    }
    if (field.type === 'badge') {
        return <StatusBadge status={field.value} />;
    }
    return field.value;
}

export default function SubmissionDetailDialog({
    open,
    onClose,
    submission,
    type,
    onStatusChange,
    onDelete,
    onToggleHandled,
}) {
    const [statusValue, setStatusValue] = useState(null);

    if (!submission) return null;

    const config = STATUS_CONFIG[type];
    if (!config) return null;

    const fields = config.fields(submission);
    const sidebar = config.sidebar(submission);
    const formattedDate = sidebar.date
        ? new Date(sidebar.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '—';

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatusValue(newStatus);
        onStatusChange?.(submission.id, newStatus);
    };

    const handleToggleHandled = () => {
        onToggleHandled?.(submission.id, submission.is_handled);
    };

    return (
        <AdminDialog
            open={open}
            onClose={onClose}
            title={config.title}
            subtitle={
                <span className="flex items-center gap-2">
                    {submission.name && <span className="font-semibold text-brand-charcoal">{submission.name}</span>}
                    {submission.email && <span className="text-brand-charcoal/40">• {submission.email}</span>}
                </span>
            }
            size="lg"
            footer={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {sidebar.statusOptions ? (
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-brand-charcoal/50">Status:</label>
                                <select
                                    value={submission.status || 'new'}
                                    onChange={handleStatusChange}
                                    className="rounded-lg border border-brand-hairline bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:ring-2 focus:ring-brand-red/30 transition-colors"
                                >
                                    {sidebar.statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        ) : type === 'contact-messages' ? (
                            <button
                                type="button"
                                onClick={handleToggleHandled}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                                    submission.is_handled
                                        ? 'bg-brand-charcoal/10 text-brand-charcoal hover:bg-brand-charcoal/20'
                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                            >
                                {submission.is_handled ? 'Mark Unhandled' : 'Mark Handled'}
                            </button>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={() => onDelete?.(submission.id)}
                        className="rounded-lg bg-brand-red/10 px-4 py-2 text-sm font-bold text-brand-red hover:bg-brand-red/20 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            }
        >
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content (left, wider) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="Contact Information">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {fields.map((field) => (
                                    <Field key={field.label} label={field.label} className={field.mono ? 'font-mono' : ''}>
                                        {renderFieldValue(field)}
                                    </Field>
                                ))}
                            </div>
                        </Section>

                        {config.hasMessage && submission.message && (
                            <Section title="Message">
                                <div className="rounded-xl border border-brand-hairline bg-brand-panel/40 p-4">
                                    <p className="text-sm text-brand-charcoal/80 whitespace-pre-wrap leading-relaxed">
                                        {submission.message}
                                    </p>
                                </div>
                            </Section>
                        )}

                        {!config.hasMessage && type === 'subscribers' && (
                            <Section title="Subscription Info">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Source">Website</Field>
                                    <Field label="Status">Active</Field>
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* Sidebar (right, narrower) */}
                    <div className="space-y-6">
                        <Section title="Details">
                            <div className="space-y-4">
                                <Field label="Status">
                                    {sidebar.status ? (
                                        <StatusBadge status={sidebar.status} />
                                    ) : (
                                        <span className="text-brand-charcoal/40">—</span>
                                    )}
                                </Field>
                                <Field label="Received">{formattedDate}</Field>
                                {submission.id && (
                                    <Field label="ID">
                                        <span className="font-mono text-xs text-brand-charcoal/50">#{submission.id}</span>
                                    </Field>
                                )}
                            </div>
                        </Section>

                        <Section title="Quick Actions">
                            <div className="space-y-2">
                                {submission.email && (
                                    <a
                                        href={`mailto:${submission.email}`}
                                        className="flex items-center gap-2 rounded-lg border border-brand-hairline px-3 py-2 text-sm font-medium text-brand-charcoal hover:bg-brand-panel transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-brand-charcoal/40">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        Reply via Email
                                    </a>
                                )}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </AdminDialog>
    );
}
