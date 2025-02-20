// app/competition/business-case/page.tsx
import { Metadata } from 'next';
import BusinessCaseContent from '@/components/competition/BusinessCaseContent';

export const metadata: Metadata = {
  title: 'Business Case Competition | Makarapreneur',
  description: 'Showcase your analytical and business strategy skills in the Makarapreneur Business Case Competition.',
  openGraph: {
    title: 'Business Case Competition | Makarapreneur',
    description: 'Showcase your analytical and business strategy skills in the Makarapreneur Business Case Competition.',
    type: 'website',
  },
};

export default function BusinessCasePage() {
  return <BusinessCaseContent />;
}