import Navbar        from '@/components/layout/Navbar';
import Footer        from '@/components/layout/Footer';
import HeroSection   from '@/components/home/HeroSection';
import PlansSection  from '@/components/home/PlansSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import GymSection    from '@/components/home/GymSection';
import HowItWorks    from '@/components/home/HowItWorks';
import FAQSection    from '@/components/home/FAQSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PlansSection />
        <BenefitsSection />
        <GymSection />
        <HowItWorks />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
