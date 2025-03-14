import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import ProfessionCategories from "@/components/home/profession-categories";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedProfessionals from "@/components/home/featured-professionals";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ProfessionCategories />
        <HowItWorks />
        <FeaturedProfessionals />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
