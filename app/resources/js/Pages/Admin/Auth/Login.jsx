import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import GlobalToast from '../../../Components/Admin/GlobalToast';

export default function Login() {
    const { props } = usePage();
    const flash = props.flash || {};

    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post('/admin/login', data, {
            onFinish: () => setProcessing(false),
            onError: (err) => setErrors(err),
        });
    };

    return (
        <div className="min-h-screen flex bg-brand-charcoal">
            {/* Left: Hero image panel */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden rounded-r-3xl">
                <img
                    src="/images/landing/hero-slide-1.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/80 via-brand-red-deep/70 to-brand-charcoal/90" />

                {/* Decorative circles */}
                <div className="absolute -top-24 -right-24 w-80 h-80 border border-white/10 rounded-full" />
                <div className="absolute bottom-16 left-10 w-44 h-44 border border-white/10 rounded-full" />

                {/* Brand mark */}
                <div className="relative z-10 flex flex-col justify-between p-10 w-full">
                    <a href="/" className="inline-flex items-center gap-2 text-white no-underline">
                        <span className="font-normal text-2xl leading-none">[</span>
                        <span className="font-black text-lg tracking-widest uppercase">Good Kenyan</span>
                        <span className="font-normal text-2xl leading-none">]</span>
                        <span className="ml-2 text-[0.65rem] font-normal tracking-[0.24em] uppercase text-white/60">Foundation</span>
                    </a>

                    <div className="max-w-md">
                        <span className="inline-block text-[0.65rem] font-bold tracking-[0.24em] uppercase text-white/70 border border-white/25 rounded-full px-3 py-1.5 bg-white/5 backdrop-blur-sm">
                            Good Kenyan · Admin
                        </span>
                        <h1 className="mt-5 text-4xl xl:text-5xl font-black text-white leading-[1.08] tracking-tight" style={{ textWrap: 'balance' }}>
                            From school to opportunity.
                        </h1>
                        <p className="mt-4 text-base text-white/80 leading-relaxed max-w-sm">
                            The workspace behind goodkenyan.org. Publish stories, refresh page copy,
                            respond to messages and keep the brand pointing the same direction.
                        </p>

                        <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-4 text-xs text-white/55">
                            <span>&copy; {new Date().getFullYear()} Good Kenyan Foundation</span>
                            <span aria-hidden>·</span>
                            <a href="/" className="text-white/80 no-underline border-b border-white/30 hover:border-white transition-colors">
                                View the public site
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Login form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-[#1a1a1b]">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10 flex flex-col items-center">
                        <img
                            src="/images/tgkf-logo.png"
                            alt="Good Kenyan Foundation"
                            className="h-11 w-auto brightness-0 invert"
                        />
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight">
                        Welcome Back!
                    </h2>
                    <p className="mt-1.5 text-sm text-white/50">
                        Sign in to manage the Good Kenyan admin dashboard.
                    </p>

                    {/* Error banner */}
                    {errors.email && typeof errors.email === 'string' && (
                        <div className="mt-5 rounded-xl bg-brand-red/15 border border-brand-red/30 px-4 py-3 text-sm font-medium text-brand-red">
                            {errors.email}
                        </div>
                    )}
                    {errors.message && (
                        <div className="mt-5 rounded-xl bg-brand-red/15 border border-brand-red/30 px-4 py-3 text-sm font-medium text-brand-red">
                            {errors.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-white/60 mb-1.5 tracking-wide uppercase">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red ${
                                    errors.email ? 'border-brand-red/60' : 'border-white/10'
                                }`}
                                placeholder="you@example.com"
                            />
                            {errors.email && typeof errors.email !== 'string' && (
                                <p className="mt-1.5 text-xs text-brand-red">{errors.email[0]}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-white/60 mb-1.5 tracking-wide uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
                                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red ${
                                        errors.password ? 'border-brand-red/60' : 'border-white/10'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute inset-y-0 right-3 flex items-center text-white/30 hover:text-white/60 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && typeof errors.password !== 'string' && (
                                <p className="mt-1.5 text-xs text-brand-red">{errors.password[0]}</p>
                            )}
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData((d) => ({ ...d, remember: e.target.checked }))}
                                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand-red focus:ring-brand-red/30"
                                />
                                <span className="text-sm text-white/50">Remember me</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-[#1a1a1b] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(135deg, #FB2436 0%, #e8612d 50%, #d94fa0 100%)',
                            }}
                        >
                            {processing ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-white/30">
                        &copy; {new Date().getFullYear()} Good Kenyan Foundation. All rights reserved.
                    </p>
                </div>
            </div>

            <GlobalToast flash={flash} />
        </div>
    );
}

Login.layout = (page) => <>{page}</>;
