import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BusinessCaseContent from '@/components/competition/BusinessCaseContent';
import { competitionService } from '@/lib/firebase/competitionService';

// Define the correct props type for Next.js app router pages
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params, searchParams }: Props
): Promise<Metadata> {
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

export default async function CompetitionPage({
  params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams,
}: Props) {
  const competition = await competitionService.getCompetitionById(params.id);

  if (!competition) {
    notFound();
  }

  return <BusinessCaseContent competition={competition} />;
}