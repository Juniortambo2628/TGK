import { Head, useForm, router } from '@inertiajs/react';
import AdminFormLayout from '../../../Components/Admin/AdminFormLayout';
import AdminCard from '../../../Components/Admin/AdminCard';

export default function Form({ user = null }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors, recentlySuccessful } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.users.update', user.id), { preserveScroll: true });
        } else {
            post(route('admin.users.store'), { preserveScroll: true });
        }
    };

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        router.delete(route('admin.users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => router.visit(route('admin.users.index')),
        });
    };

    return (
        <AdminFormLayout
            title={isEdit ? 'Edit User' : 'Create User'}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Users', href: '/admin/users' },
                { label: isEdit ? 'Edit' : 'Create' },
            ]}
            onSubmit={handleSubmit}
            processing={processing}
            recentlySuccessful={recentlySuccessful}
            submitLabel={isEdit ? 'Update User' : 'Create User'}
            sidebar={
                <>
                    {/* Account Info */}
                    <AdminCard>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-charcoal">Account Info</h3>
                                <p className="text-xs text-brand-charcoal/50 mt-0.5">Details about this user account.</p>
                            </div>
                            {isEdit && user?.created_at && (
                                <div>
                                    <span className="text-xs font-bold text-brand-charcoal/50">Created</span>
                                    <p className="text-sm text-brand-charcoal mt-0.5">
                                        {new Date(user.created_at).toLocaleDateString('en-KE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            )}
                            {isEdit && (
                                <div>
                                    <span className="text-xs font-bold text-brand-charcoal/50">User ID</span>
                                    <p className="text-sm text-brand-charcoal font-mono mt-0.5">{user.id}</p>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    {/* Danger Zone */}
                    {isEdit && (
                        <AdminCard>
                            <div className="p-6 lg:p-8 space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-brand-red">Danger Zone</h3>
                                    <p className="text-xs text-brand-charcoal/50 mt-0.5">Irreversible actions.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-2.5 text-sm font-bold text-brand-red hover:bg-brand-red hover:text-white transition-colors"
                                >
                                    Delete User
                                </button>
                            </div>
                        </AdminCard>
                    )}
                </>
            }
        >
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Name <span className="text-brand-red">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Full name"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.name ? 'border-brand-red' : 'border-brand-hairline'}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-brand-red">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Email <span className="text-brand-red">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="user@example.com"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.email ? 'border-brand-red' : 'border-brand-hairline'}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-brand-red">{errors.email}</p>}
            </div>

            <div className="h-px w-full bg-brand-hairline" />
            <p className="text-xs text-brand-charcoal/50 -mt-4">
                {isEdit ? 'Leave password fields blank to keep the current password.' : 'Set a password for this user.'}
            </p>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Password {!isEdit && <span className="text-brand-red">*</span>}
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required={!isEdit}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.password ? 'border-brand-red' : 'border-brand-hairline'}`}
                    placeholder={isEdit ? 'Leave blank to keep current' : ''}
                />
                {errors.password && <p className="mt-1.5 text-xs text-brand-red">{errors.password}</p>}
            </div>

            {/* Password Confirmation */}
            <div>
                <label htmlFor="password_confirmation" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Confirm Password
                </label>
                <input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                    placeholder="Confirm password"
                />
            </div>
        </AdminFormLayout>
    );
}
