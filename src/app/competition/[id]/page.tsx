import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BusinessCaseContent from '@/components/competition/BusinessCaseContent';
import { competitionService } from '@/lib/firebase/competitionService';

interface Props {
  params: {
    id: string;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const competition = await competitionService.getCompetitionById(params.id);

  if (!competition) {
    return {
      title: 'Competition Not Found',
      description: 'The competition you are looking for does not exist.',
    };
  }

  return {
    title: `${competition.name} | Makarapreneur`,
    description: competition.description || 'Join the competition and showcase your innovative ideas.',
    openGraph: {
      title: `${competition.name} | Makarapreneur`,
      description: competition.description || 'Join the competition and showcase your innovative ideas.',
      type: 'website',
    },
  };
}

export default async function CompetitionPage({ params }: Props) {
  const competition = await competitionService.getCompetitionById(params.id);

  if (!competition) {
    notFound();
  }

  return <BusinessCaseContent competition={competition} />;
}
