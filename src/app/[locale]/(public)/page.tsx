import { LandingPage } from "@/components/layouts/landing-page";

export default function Home({ params }: { params: { locale: string } }) {
        return <LandingPage locale={params.locale} />;
}
