import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register as a Professional | ServiceHub',
  description: 'Join ServiceHub as a professional service provider. Register to offer your services to customers in your area.',
};

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-50 min-h-screen">
      {children}
    </section>
  );
} 