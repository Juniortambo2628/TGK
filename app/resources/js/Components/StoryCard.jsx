import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Reveal } from './Motion';
import { Skeleton } from './Skeleton';

export default function StoryCard({ story, priority = false }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const href = `/stories/${story.slug}`;
    return (
        <Reveal className="h-full">
            <article className="group h-full flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-hairline">
                <Link href={href} className="relative block overflow-hidden aspect-[4/3] bg-brand-charcoal/5">
                    {!imageLoaded && (
                        <Skeleton className="absolute inset-0 w-full h-full !rounded-none" />
                    )}
                    <img
                        src={story.hero_url || `/images/stories/${story.hero_image}`}
                        alt={story.title}
                        loading={priority ? 'eager' : 'lazy'}
                        onLoad={() => setImageLoaded(true)}
                        className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                </Link>
                <div className="flex flex-1 flex-col p-6 lg:p-8">
                    <p className="eyebrow mb-3">Story</p>
                    <h3 className="text-xl lg:text-2xl font-black leading-tight">
                        <Link href={href} className="hover:text-brand-red transition-colors">
                            {story.title}
                        </Link>
                    </h3>
                    {story.excerpt && (
                        <p className="mt-3 text-brand-grey line-clamp-3">{story.excerpt}</p>
                    )}
                    <div className="mt-6 pt-6 border-t border-brand-hairline flex items-center justify-between">
                        <time className="text-xs text-brand-grey uppercase tracking-wider">
                            {new Date(story.published_at).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </time>
                        <Link href={href} className="text-sm font-bold text-brand-red inline-flex items-center gap-1">
                            Read <span aria-hidden>→</span>
                        </Link>
                    </div>
                </div>
            </article>
        </Reveal>
    );
}
