import { LandingPage } from "@/components/layouts/landing-page";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
        const { locale } = await params;
        return <LandingPage locale={locale} />;
}
