import { Link } from '@inertiajs/react';
import Container from '../../Components/Container';

export default function NotFound() {
    return (
        <section className="py-24 lg:py-32">
            <Container className="text-center max-w-2xl">
                <p className="eyebrow mb-3">404</p>
                <h1 className="text-5xl lg:text-6xl font-black text-brand-charcoal">We can't find that page.</h1>
                <p className="mt-6 text-lg text-brand-grey">It may have been moved, or the link may be old.</p>
                <Link href="/" className="mt-10 btn-primary">Back to home</Link>
            </Container>
        </section>
    );
}
