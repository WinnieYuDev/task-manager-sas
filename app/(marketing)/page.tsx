import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";

export const metadata = {
  title: "TaskBloom — Where productivity blossoms",
  description:
    "Premium task management for teams. Real-time sync, analytics, and a calm, powerful workflow.",
};

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <Features />
      <ProductPreview />
      <Pricing />
      <Testimonials />
      <CTA />
    </>
  );
}
