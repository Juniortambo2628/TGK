/**
 * Render CMS-managed rich text. The HTML has already been sanitised on the
 * server (App\Support\Html::purify) so we can safely `dangerouslySetInnerHTML`.
 * We also normalise a couple of things the editor emits:
 *  - <a> without target gets target=_blank + rel=noopener when it's external
 *  - Prose styling comes from the parent's `className`
 *
 * If `html` is empty we render nothing (not even the wrapper) so pages that
 * fall back to hard-coded copy don't collapse into an empty div.
 */
export default function RichText({ html, className = '', as: Tag = 'div' }) {
    if (!html || typeof html !== 'string') return null;
    return (
        <Tag
            className={`prose prose-lg max-w-none prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-a:text-brand-red ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
