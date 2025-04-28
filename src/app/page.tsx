import Hero from '@/components/Hero';
import ServiceListings from '@/components/ServiceListings';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ServiceListings />
      {/* Service listings will be added here */}
    </main>
  );
} 