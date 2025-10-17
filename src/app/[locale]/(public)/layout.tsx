import { Navigation } from '@/components/layouts/navbar';
import { Footer } from '@/components/layouts/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation isLoggedIn={false} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
