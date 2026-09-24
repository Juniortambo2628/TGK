import { Link } from '@inertiajs/react';
import Container from '../../Components/Container';

const MESSAGES = {
    403: {
        eyebrow: '403',
        title: 'You do not have access to that page.',
        body: 'If you think this is a mistake, sign in or contact us.',
    },
    419: {
        eyebrow: '419',
        title: 'Your session expired.',
        body: 'For your security, please refresh the page and try again.',
    },
    500: {
        eyebrow: '500',
        title: 'Something went wrong.',
        body: 'We hit an unexpected error. Please try again in a moment.',
    },
    503: {
        eyebrow: '503',
        title: 'We are under maintenance.',
        body: 'We will be back shortly. Thank you for your patience.',
    },
};

export default function Error({ status = 500 }) {
    const message = MESSAGES[status] || MESSAGES[500];

    return (
        <section className="py-24 lg:py-32">
            <Container className="text-center max-w-2xl">
                <p className="eyebrow mb-3">{message.eyebrow}</p>
                <h1 className="text-5xl lg:text-6xl font-black text-brand-charcoal">{message.title}</h1>
                <p className="mt-6 text-lg text-brand-grey">{message.body}</p>
                <Link href="/" className="mt-10 btn-primary">Back to home</Link>
            </Container>
        </section>
    );
}
