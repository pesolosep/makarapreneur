// app/competition/business-plan/register/page.tsx
import { Metadata } from 'next';
import RegisterCompetition from '@/components/competition/RegisterCompetition';

export const metadata: Metadata = {
  title: 'Register Competition | Makarapreneur',
  description: 'Register your team for the Makarapreneur Business Plan Competition.',
  openGraph: {
    title: 'Register Competition | Makarapreneur',
    description: 'Register your team for the Makarapreneur Business Plan Competition.',
    type: 'website',
  },
};

export default function RegisterPage() {
  return <RegisterCompetition />;
}