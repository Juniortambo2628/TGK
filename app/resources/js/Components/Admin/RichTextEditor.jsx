import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEffect, useCallback, useState, useRef } from 'react';
import { IconBold, IconItalic, IconUnderline, IconStrikethrough, IconListBullet, IconListNumbered, IconLink, IconChevronDown } from './RichTextIcons';

const toolbarBtn = 'inline-flex items-center justify-center w-8 h-8 rounded-md text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-hairline transition-colors disabled:opacity-30 disabled:cursor-not-allowed';
const toolbarBtnActive = 'inline-flex items-center justify-center w-8 h-8 rounded-md text-brand-red bg-brand-red/10';

function ToolbarButton({ icon: Icon, isActive, disabled, onClick, title }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={isActive ? toolbarBtnActive : toolbarBtn}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-brand-hairline mx-1" />;
}

function HeadingDropdown({ editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const currentLevel = editor?.getAttributes('heading')?.level;
    const label = currentLevel ? `H${currentLevel}` : 'Paragraph';

    const levels = [
        { value: null, label: 'Paragraph' },
        { value: 2, label: 'Heading 2' },
        { value: 3, label: 'Heading 3' },
        { value: 4, label: 'Heading 4' },
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-bold text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-hairline transition-colors"
            >
                {label}
                <IconChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 w-36 rounded-lg border border-brand-hairline bg-white py-1 shadow-lg">
                    {levels.map((level) => (
                        <button
                            key={level.label}
                            type="button"
                            onClick={() => {
                                if (level.value) {
                                    editor.chain().focus().toggleHeading({ level: level.value }).run();
                                } else {
                                    editor.chain().focus().setParagraph().run();
                                }
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-sm hover:bg-brand-panel transition-colors ${
                                (level.value === null && !currentLevel) || currentLevel === level.value
                                    ? 'font-bold text-brand-red'
                                    : 'text-brand-charcoal'
                            }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function LinkButton({ editor }) {
    const [showInput, setShowInput] = useState(false);
    const [url, setUrl] = useState('');
    const inputRef = useRef(null);

    const setLink = useCallback(() => {
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        } else {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }
        setShowInput(false);
        setUrl('');
    }, [editor, url]);

    useEffect(() => {
        if (showInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => {
                    if (editor.isActive('link')) {
                        editor.chain().focus().unsetLink().run();
                    } else {
                        const previousUrl = editor.getAttributes('link').href || '';
                        setUrl(previousUrl);
                        setShowInput(true);
                    }
                }}
                className={editor.isActive('link') ? toolbarBtnActive : toolbarBtn}
                title="Insert link"
            >
                <IconLink className="w-4 h-4" />
            </button>
            {showInput && (
                <div className="absolute top-full left-0 z-50 mt-1 flex items-center gap-1 rounded-lg border border-brand-hairline bg-white p-1.5 shadow-lg">
                    <input
                        ref={inputRef}
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); setLink(); }
                            if (e.key === 'Escape') { setShowInput(false); setUrl(''); }
                        }}
                        placeholder="https://..."
                        className="w-48 rounded-md border border-brand-hairline px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-brand-red/30"
                    />
                    <button type="button" onClick={setLink} className="rounded-md bg-brand-red px-2 py-1 text-xs font-bold text-white hover:bg-brand-red-deep transition-colors">
                        Set
                    </button>
                    <button type="button" onClick={() => { setShowInput(false); setUrl(''); }} className="rounded-md px-2 py-1 text-xs font-bold text-brand-charcoal/50 hover:text-brand-charcoal transition-colors">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default function RichTextEditor({ value = '', onChange, error, placeholder = 'Write something...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-brand-red underline cursor-pointer' },
            }),
            Underline,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[120px] px-4 py-3 focus:outline-none',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [value]);

    if (!editor) return null;

    return (
        <div>
            <div className={`rounded-lg border bg-white transition-shadow focus-within:ring-2 focus-within:ring-brand-red/30 ${error ? 'border-brand-red' : 'border-brand-hairline'}`}>
                <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-hairline/60 px-2 py-1.5">
                    <HeadingDropdown editor={editor} />
                    <ToolbarDivider />
                    <ToolbarButton
                        icon={IconBold}
                        isActive={editor.isActive('bold')}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="Bold"
                    />
                    <ToolbarButton
                        icon={IconItalic}
                        isActive={editor.isActive('italic')}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="Italic"
                    />
                    <ToolbarButton
                        icon={IconUnderline}
                        isActive={editor.isActive('underline')}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        title="Underline"
                    />
                    <ToolbarButton
                        icon={IconStrikethrough}
                        isActive={editor.isActive('strike')}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        title="Strikethrough"
                    />
                    <ToolbarDivider />
                    <ToolbarButton
                        icon={IconListBullet}
                        isActive={editor.isActive('bulletList')}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        title="Bullet list"
                    />
                    <ToolbarButton
                        icon={IconListNumbered}
                        isActive={editor.isActive('orderedList')}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        title="Numbered list"
                    />
                    <ToolbarDivider />
                    <LinkButton editor={editor} />
                </div>
                <EditorContent editor={editor} />
            </div>
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}
