import { Head, useForm } from '@inertiajs/react';
import AdminFormLayout from '../../../Components/Admin/AdminFormLayout';
import AdminCard from '../../../Components/Admin/AdminCard';
import FileUploader from '../../../Components/Admin/FileUploader';

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export default function Form({ post = null }) {
    const isEdit = !!post;

    const { data, setData, post: postRoute, put, processing, errors, recentlySuccessful } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        body: post?.body || '',
        hero_image: post?.hero_url || '',
        seo_title: post?.seo_title || '',
        seo_description: post?.seo_description || '',
        published_at: post?.published_at
            ? new Date(post.published_at).toISOString().slice(0, 16)
            : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.posts.update', post.id), { preserveScroll: true });
        } else {
            postRoute(route('admin.posts.store'), { preserveScroll: true });
        }
    };

    const handleTitleBlur = () => {
        if (!isEdit && !data.slug) {
            setData('slug', slugify(data.title));
        }
    };

    return (
        <AdminFormLayout
            title={isEdit ? 'Edit Story' : 'Create Story'}
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Blog', href: '/admin/posts' },
                { label: 'Stories', href: '/admin/posts' },
                { label: isEdit ? 'Edit' : 'Create' },
            ]}
            onSubmit={handleSubmit}
            processing={processing}
            recentlySuccessful={recentlySuccessful}
            submitLabel={isEdit ? 'Update Story' : 'Create Story'}
            sidebar={
                <>
                    {/* Cover Image */}
                    <AdminCard>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-charcoal">Cover Image</h3>
                                <p className="text-xs text-brand-charcoal/50 mt-0.5">Hero cover photo for cards and the public site.</p>
                            </div>
                            <FileUploader
                                value={data.hero_image}
                                onChange={(url) => setData('hero_image', url || '')}
                                folder="stories"
                                accept="image/*"
                                maxSizeMB={5}
                                maxWidth={1920}
                                quality={0.85}
                                label="Drop hero image here or click to browse"
                            />
                            {errors.hero_image && <p className="mt-1.5 text-xs text-brand-red">{errors.hero_image}</p>}
                        </div>
                    </AdminCard>

                    {/* Publishing */}
                    <AdminCard>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-brand-charcoal">Publishing</h3>
                                <p className="text-xs text-brand-charcoal/50 mt-0.5">Control when the story goes live.</p>
                            </div>
                            <div>
                                <label htmlFor="published_at" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                                    Publish Date & Time
                                </label>
                                <input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                                />
                                <p className="text-xs text-brand-charcoal/40 mt-1.5">Story is visible on the public site after this time.</p>
                            </div>
                            {isEdit && post?.slug && (
                                <div>
                                    <span className="text-xs font-bold text-brand-charcoal/50">Public Link</span>
                                    <a
                                        href={`/stories/${post.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-brand-red hover:text-brand-red-deep transition-colors mt-0.5"
                                    >
                                        /stories/{post.slug}
                                    </a>
                                </div>
                            )}
                        </div>
                    </AdminCard>
                </>
            }
        >
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Title <span className="text-brand-red">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    required
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    onBlur={handleTitleBlur}
                    placeholder="e.g. From School to Opportunity"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.title ? 'border-brand-red' : 'border-brand-hairline'}`}
                />
                {errors.title && <p className="mt-1.5 text-xs text-brand-red">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
                <label htmlFor="slug" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Slug <span className="text-brand-red">*</span>
                </label>
                <input
                    id="slug"
                    type="text"
                    required
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 font-mono ${errors.slug ? 'border-brand-red' : 'border-brand-hairline'}`}
                />
                {errors.slug && <p className="mt-1.5 text-xs text-brand-red">{errors.slug}</p>}
            </div>

            {/* Excerpt */}
            <div>
                <label htmlFor="excerpt" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Excerpt
                </label>
                <textarea
                    id="excerpt"
                    rows={3}
                    value={data.excerpt}
                    onChange={(e) => setData('excerpt', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${errors.excerpt ? 'border-brand-red' : 'border-brand-hairline'}`}
                    placeholder="A short summary of the story..."
                />
                {errors.excerpt && <p className="mt-1.5 text-xs text-brand-red">{errors.excerpt}</p>}
            </div>

            {/* Body */}
            <div>
                <label htmlFor="body" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Body
                </label>
                <textarea
                    id="body"
                    rows={14}
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 font-mono ${errors.body ? 'border-brand-red' : 'border-brand-hairline'}`}
                    placeholder="Story content (HTML supported, rich text editor coming later)..."
                />
                {errors.body && <p className="mt-1.5 text-xs text-brand-red">{errors.body}</p>}
            </div>

            <div className="h-px w-full bg-brand-hairline" />

            {/* SEO */}
            <div>
                <h3 className="text-sm font-bold text-brand-charcoal mb-4">Search Engine Optimization</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="seo_title" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                            Meta Title
                        </label>
                        <input
                            id="seo_title"
                            type="text"
                            value={data.seo_title}
                            onChange={(e) => setData('seo_title', e.target.value)}
                            className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                            placeholder="Optional override for the page title tag"
                        />
                    </div>
                    <div>
                        <label htmlFor="seo_description" className="block text-sm font-bold text-brand-charcoal mb-1.5">
                            Meta Description
                        </label>
                        <textarea
                            id="seo_description"
                            rows={2}
                            value={data.seo_description}
                            onChange={(e) => setData('seo_description', e.target.value)}
                            className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                            placeholder="Optional meta description"
                        />
                    </div>
                </div>
            </div>
        </AdminFormLayout>
    );
}
