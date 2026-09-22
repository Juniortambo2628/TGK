import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import GlobalToast from '../Components/Admin/GlobalToast';
import NavigationProgress from '../Components/NavigationProgress';

/* ── SVG Icons (Heroicons 24x24 outline) ────────────────────────────── */

function IconChartBar(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
    );
}

function IconHome(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function IconInfoCircle(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
    );
}

function IconAcademic(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
    );
}

function IconHeart(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
}

function IconBriefcase(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function IconNewspaper(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5" />
        </svg>
    );
}

function IconBuildingOffice(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    );
}

function IconMegaphone(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.434-.185.884-.185 1.363 0 .478.037.957.185 1.364m0 0a23.94 23.94 0 01-1.014 5.395M10.34 6.66a23.91 23.91 0 00-8.835 2.535m0 0A23.74 23.74 0 005.205 3m.38 1.125a23.91 23.91 0 01-1.014 5.395" />
        </svg>
    );
}

function IconEnvelope(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
    );
}

function IconUserGroup(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    );
}

function IconGift(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function IconEnvelopeOpen(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 2.012l-7.08 3.54m0 0l.008.004m-.008-.004L11.53 17.25l1.487-.744m0 0l.008.004m-.008-.004L8.46 16.5l1.487-.744m0 0L7.5 15.75l1.487-.744m0 0L7.5 15.75l1.487-.744m0 0L7.5 15.75l1.487-.744M12 3v3.25m0 15.75v-3.25m0-3.25L6.18 9.875l5.507-2.754m0 0l5.507 2.754L12 15.5v7.5" />
        </svg>
    );
}

function IconPhoto(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
        </svg>
    );
}

function IconCog(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconUserCircle(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconUser(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function IconChevronDown(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function IconMenu(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    );
}

function IconX(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function IconArrowLeft(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

/* ── Navigation structure ───────────────────────────────────────────── */

const navigation = [
    { label: 'Dashboard', href: '/admin', icon: IconChartBar },
    {
        label: 'Content',
        children: [
            { label: 'Home Page', href: '/admin/content/home', icon: IconHome },
            { label: 'About Page', href: '/admin/content/about', icon: IconInfoCircle },
            { label: 'Our Model', href: '/admin/content/our-model', icon: IconAcademic },
            { label: 'Regina Yego', href: '/admin/content/regina-yego', icon: IconHeart },
            { label: 'Stawi', href: '/admin/content/stawi', icon: IconBriefcase },
            { label: 'Stories Index', href: '/admin/content/stories', icon: IconNewspaper },
            { label: 'Partners', href: '/admin/content/partners', icon: IconBuildingOffice },
            { label: 'Get Involved', href: '/admin/content/get-involved', icon: IconMegaphone },
            { label: 'Contact', href: '/admin/content/contact', icon: IconEnvelope },
        ],
    },
    {
        label: 'Blog',
        children: [
            { label: 'Stories', href: '/admin/posts', icon: IconNewspaper },
        ],
    },
    {
        label: 'People',
        children: [
            { label: 'Partners', href: '/admin/partners', icon: IconBuildingOffice },
        ],
    },
    {
        label: 'Submissions',
        children: [
            { label: 'Contact Messages', href: '/admin/contact-messages', icon: IconEnvelope },
            { label: 'Mentor Applications', href: '/admin/mentor-applications', icon: IconUserGroup },
            { label: 'Registrations', href: '/admin/registrations', icon: IconAcademic },
            { label: 'Scholarship Apps', href: '/admin/scholarship-applications', icon: IconGift },
            { label: 'Subscribers', href: '/admin/subscribers', icon: IconEnvelopeOpen },
        ],
    },
    {
        label: 'Media',
        children: [
            { label: 'Media Gallery', href: '/admin/media', icon: IconPhoto },
        ],
    },
    {
        label: 'Settings',
        children: [
            { label: 'Settings', href: '/admin/settings', icon: IconCog },
            { label: 'User Accounts', href: '/admin/users', icon: IconUserCircle },
            { label: 'Profile', href: '/admin/profile', icon: IconUser },
        ],
    },
];

/* ── Sidebar link ────────────────────────────────────────────────────── */

function SidebarLink({ item, active, collapsed, onClick }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'text-brand-charcoal/70 hover:bg-brand-charcoal/5 hover:text-brand-charcoal'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
        >
            <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-brand-red' : 'text-brand-charcoal/40 group-hover:text-brand-charcoal/60'}`} />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
    );
}

/* ── Sidebar section ─────────────────────────────────────────────────── */

function SidebarSection({ group, url, collapsed, onLinkClick }) {
    const Icon = group.icon;
    const isActive = group.children?.some((c) => url === c.href || url.startsWith(c.href + '/'));
    const [expanded, setExpanded] = useState(isActive);

    useEffect(() => {
        if (isActive) setExpanded(true);
    }, [isActive]);

    if (group.href) {
        return (
            <SidebarLink
                item={group}
                active={url === group.href || url.startsWith(group.href + '/')}
                collapsed={collapsed}
                onClick={onLinkClick}
            />
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-brand-red' : 'text-brand-charcoal/50 hover:text-brand-charcoal/70'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? group.label : undefined}
            >
                {Icon && <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-brand-red' : 'text-brand-charcoal/40'}`} />}
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left truncate">{group.label}</span>
                        <IconChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>
            {!collapsed && expanded && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-brand-hairline pl-3">
                    {group.children.map((child) => (
                        <SidebarLink
                            key={child.href}
                            item={child}
                            active={url === child.href || url.startsWith(child.href + '/')}
                            collapsed={collapsed}
                            onClick={onLinkClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── AdminLayout ─────────────────────────────────────────────────────── */

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const flash = props.flash || {};
    const user = props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    useEffect(() => {
        setSidebarOpen(false);
        setUserMenuOpen(false);
    }, [url]);

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'AD';

    return (
        <div className="min-h-screen bg-brand-panel font-sans">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-brand-charcoal/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-brand-hairline bg-brand-off transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="flex h-16 items-center gap-3 border-b border-brand-hairline px-4">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <img src="/images/tgkf-logo.png" alt="Good Kenyan Foundation" className="h-8 w-auto" />
                        <span className="text-sm font-bold text-brand-charcoal tracking-tight">Admin</span>
                    </Link>
                    <button
                        type="button"
                        className="ml-auto lg:hidden p-1 rounded-md text-brand-charcoal/50 hover:text-brand-charcoal"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <IconX className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Admin navigation">
                    {navigation.map((item) => (
                        <SidebarSection
                            key={item.label}
                            group={item}
                            url={url}
                            collapsed={false}
                            onLinkClick={() => setSidebarOpen(false)}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-brand-hairline px-4 py-3">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-sm text-brand-charcoal/50 hover:text-brand-charcoal transition-colors"
                    >
                        <IconArrowLeft className="h-4 w-4" />
                        Back to site
                    </a>
                </div>
            </aside>

            {/* Main area */}
            <div className="lg:pl-[260px]">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-brand-hairline bg-brand-off/90 backdrop-blur px-4 lg:px-8">
                    <button
                        type="button"
                        className="p-2 -ml-2 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-charcoal/5 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <IconMenu className="h-5 w-5" />
                    </button>

                    <div className="flex-1" />

                    {/* User menu */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen((o) => !o)}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-white text-xs font-bold">
                                {initials}
                            </div>
                            <span className="hidden sm:block">{user?.name || 'Admin'}</span>
                            <IconChevronDown className={`h-4 w-4 text-brand-charcoal/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {userMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setUserMenuOpen(false)}
                                    aria-hidden="true"
                                />
                                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-brand-hairline bg-brand-off py-1 shadow-card">
                                    <Link
                                        href="/admin/profile"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-brand-panel transition-colors"
                                    >
                                        <IconUser className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <div className="my-1 h-px bg-brand-hairline" />
                                    <Link
                                        href="/admin/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-red hover:bg-brand-red/5 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Logout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <GlobalToast flash={flash} />
            <NavigationProgress />
        </div>
    );
}
