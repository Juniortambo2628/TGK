import { Head, useForm, usePage } from '@inertiajs/react';
import AdminFormLayout from '../../Components/Admin/AdminFormLayout';
import AdminCard from '../../Components/Admin/AdminCard';

export default function Profile() {
    const { props } = usePage();
    const user = props.auth?.user;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch('/admin/profile', {
            preserveScroll: true,
        });
    };

    return (
        <AdminFormLayout
            title="Profile"
            description="Manage your account settings."
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Settings' },
                { label: 'Profile' },
            ]}
            actions={[
                { label: 'View public site', href: '/' },
            ]}
            onSubmit={handleSubmit}
            processing={processing}
            recentlySuccessful={recentlySuccessful}
            submitLabel="Save changes"
            sidebar={
                <>
                    {/* Account Info */}
                    <AdminCard>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-charcoal">Account Info</h3>
                                <p className="text-xs text-brand-charcoal/50 mt-0.5">Details about your account.</p>
                            </div>
                            {user?.created_at && (
                                <div>
                                    <span className="text-xs font-bold text-brand-charcoal/50">Member since</span>
                                    <p className="text-sm text-brand-charcoal mt-0.5">
                                        {new Date(user.created_at).toLocaleDateString('en-KE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}
                            {user?.email && (
                                <div>
                                    <span className="text-xs font-bold text-brand-charcoal/50">Email</span>
                                    <p className="text-sm text-brand-charcoal mt-0.5">{user.email}</p>
                                </div>
                            )}
                        </div>
                    </AdminCard>
                </>
            }
        >
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                        errors.name ? 'border-brand-red' : 'border-brand-hairline'
                    }`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-brand-red">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                        errors.email ? 'border-brand-red' : 'border-brand-hairline'
                    }`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-brand-red">{errors.email}</p>}
            </div>

            <div className="h-px w-full bg-brand-hairline" />
            <p className="text-xs text-brand-charcoal/50 -mt-4">
                Leave password fields blank to keep your current password.
            </p>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    New password
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                        errors.password ? 'border-brand-red' : 'border-brand-hairline'
                    }`}
                    placeholder="Leave blank to keep current"
                />
                {errors.password && <p className="mt-1.5 text-xs text-brand-red">{errors.password}</p>}
            </div>

            {/* Password confirmation */}
            <div>
                <label htmlFor="password_confirmation" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Confirm password
                </label>
                <input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                    placeholder="Confirm new password"
                />
            </div>
        </AdminFormLayout>
    );
}
