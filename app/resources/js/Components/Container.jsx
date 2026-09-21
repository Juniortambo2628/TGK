export default function Container({ children, className = '', as: Tag = 'div' }) {
    return <Tag className={`container-page ${className}`}>{children}</Tag>;
}
