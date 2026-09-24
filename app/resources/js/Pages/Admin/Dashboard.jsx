import { Head, Link, usePage } from '@inertiajs/react';
import AdminHero from '../../Components/Admin/AdminHero';
import AdminCard from '../../Components/Admin/AdminCard';
import StatusBadge from '../../Components/Admin/StatusBadge';
import ViewToggle from '../../Components/Admin/ViewToggle';
import { IconUsers, IconAcademic, IconEnvelope, IconMegaphone } from '../../Components/Admin/Icons';

function StatCard({ label, value, icon }) {
    return (
        <div className="rounded-xl bg-brand-off p-5 shadow-soft">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-brand-charcoal/50">{label}</p>
                    <p className="mt-1 text-3xl font-black text-brand-charcoal">{Number(value).toLocaleString()}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    {icon}
                </div>
            </div>
        </div>
    );
}

const programmeColors = {
    Msingi: 'bg-brand-red',
    Imarisha: 'bg-brand-charcoal',
    Stawi: 'bg-brand-green',
    Daraja: 'bg-brand-red/50',
};

const programmeLabels = {
    Msingi: 'Msingi (Foundation)',
    Imarisha: 'Imarisha (Strengthen)',
    Stawi: 'Stawi (Growth)',
    Daraja: 'Daraja (Bridge)',
};

export default function Dashboard() {
    const { props } = usePage();
    const { stats, recentRegistrations, trendData, programmeData } = props;

    const maxTrendValue = Math.max(
        ...trendData.flatMap((d) => [d.registrations, d.mentors]),
        1
    );

    const totalProgramme = Math.max(
        Object.values(programmeData).reduce((s, v) => s + v, 0),
        1
    );

    return (
        <>
            <Head title="Dashboard" />

            <AdminHero
                title="Dashboard"
                description="Overview of your platform activity."
                breadcrumbs={[{ label: 'Dashboard' }]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminCard>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Registrations"
                                value={stats.registrations}
                                icon={<IconUsers className="h-6 w-6" />}
                            />
                            <StatCard
                                label="Mentor Applications"
                                value={stats.mentors}
                                icon={<IconAcademic className="h-6 w-6" />}
                            />
                            <StatCard
                                label="Messages"
                                value={stats.messages}
                                icon={<IconEnvelope className="h-6 w-6" />}
                            />
                            <StatCard
                                label="Subscribers"
                                value={stats.subscribers}
                                icon={<IconMegaphone className="h-6 w-6" />}
                            />
                        </div>
                    </div>
                </AdminCard>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <AdminCard>
                        <div className="p-6">
                            <h2 className="text-sm font-bold text-brand-charcoal">Monthly trend</h2>
                            <p className="mt-0.5 text-xs text-brand-charcoal/50">Registrations vs Mentor Applications</p>

                            <div className="mt-5 space-y-3">
                                {trendData.map((d) => (
                                    <div key={d.month} className="flex items-center gap-3">
                                        <span className="w-16 flex-shrink-0 text-right text-xs font-bold text-brand-charcoal/50">{d.month}</span>
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-brand-panel">
                                                    <div
                                                        className="absolute inset-y-0 left-0 rounded-full bg-brand-red transition-all"
                                                        style={{ width: `${(d.registrations / maxTrendValue) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-xs font-bold text-brand-charcoal/60">{d.registrations}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-brand-panel">
                                                    <div
                                                        className="absolute inset-y-0 left-0 rounded-full bg-brand-charcoal transition-all"
                                                        style={{ width: `${(d.mentors / maxTrendValue) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-xs font-bold text-brand-charcoal/60">{d.mentors}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center gap-4 text-xs text-brand-charcoal/50">
                                <span className="flex items-center gap-1.5">
                                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-red" />
                                    Registrations
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-charcoal" />
                                    Mentors
                                </span>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard>
                        <div className="p-6">
                            <h2 className="text-sm font-bold text-brand-charcoal">Programme distribution</h2>
                            <p className="mt-0.5 text-xs text-brand-charcoal/50">Registrations by programme</p>

                            <div className="mt-5 space-y-4">
                                {Object.entries(programmeData).map(([programme, count]) => (
                                    <div key={programme}>
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span className="text-sm font-bold text-brand-charcoal">{programmeLabels[programme] || programme}</span>
                                            <span className="text-xs font-bold text-brand-charcoal/50">{count} ({Math.round((count / totalProgramme) * 100)}%)</span>
                                        </div>
                                        <div className="relative h-4 overflow-hidden rounded-full bg-brand-panel">
                                            <div
                                                className={`absolute inset-y-0 left-0 rounded-full transition-all ${programmeColors[programme] || 'bg-brand-red'}`}
                                                style={{ width: `${(count / totalProgramme) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AdminCard>
                </div>

                <AdminCard>
                    <div className="flex items-center justify-between border-b border-brand-hairline px-6 py-4">
                        <div>
                            <h2 className="text-sm font-bold text-brand-charcoal">Recent registrations</h2>
                            <p className="mt-0.5 text-xs text-brand-charcoal/50">Latest 6 registrations</p>
                        </div>
                        <Link
                            href={route('admin.registrations.index')}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-brand-red transition-colors hover:bg-brand-red/10"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-brand-hairline bg-brand-panel/50">
                                    <th className="px-6 py-3 text-xs font-bold text-brand-charcoal/50">Name</th>
                                    <th className="px-6 py-3 text-xs font-bold text-brand-charcoal/50">Programme</th>
                                    <th className="px-6 py-3 text-xs font-bold text-brand-charcoal/50">Email</th>
                                    <th className="px-6 py-3 text-xs font-bold text-brand-charcoal/50">Status</th>
                                    <th className="px-6 py-3 text-xs font-bold text-brand-charcoal/50">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-hairline">
                                {recentRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-brand-panel/30 transition-colors">
                                        <td className="px-6 py-3.5 font-bold text-brand-charcoal">{reg.name}</td>
                                        <td className="px-6 py-3.5"><StatusBadge status={reg.programme} /></td>
                                        <td className="px-6 py-3.5 text-brand-charcoal/70">{reg.email}</td>
                                        <td className="px-6 py-3.5"><StatusBadge status={reg.status} /></td>
                                        <td className="px-6 py-3.5 text-xs text-brand-charcoal/50">
                                            {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                                {recentRegistrations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                            No registrations yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>
            </div>
        </>
    );
}
