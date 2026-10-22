import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Head back to the front page.',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="shell nf">
      <h1>Page not found</h1>
      <p className="prose">
        There is nothing at this address. The link was probably moved or mistyped.
      </p>
      <p className="nf__back">
        <Link className="btn btn--primary" href="/">
          Back to the front page
        </Link>
      </p>
      </section>
      <Footer />
    </>
  );
}
