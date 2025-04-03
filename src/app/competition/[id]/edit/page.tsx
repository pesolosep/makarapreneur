// app/competition/edit/[id]/page.tsx
import { notFound } from 'next/navigation';
import EditRegistration from '@/components/competition/EditRegistrationComponent';
import { competitionService } from '@/lib/firebase/competitionService';

interface Props {
  params: {
    id: string; // This is the competition ID
  };
}

export default async function EditRegistrationPage({ params }: Props) {
  try {
    // Get the competition data from URL params
    const competition = await competitionService.getCompetitionById(params.id);
    
    if (!competition) {
      notFound();
    }
    
    // Pass competitionId to client component to handle auth and team fetching
    return <EditRegistration competitionId={params.id} />;
  } catch (error) {
    console.error('Error in edit registration page:', error);
    return null;
  }
}