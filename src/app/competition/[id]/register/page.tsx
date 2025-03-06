// // app/competition/business-plan/register/[id]/page.tsx
// import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import RegisterCompetition from '@/components/competition/RegisterCompetition';
// import { competitionService } from '@/lib/firebase/competitionService';

// interface Props {
//   params: {
//     id: string;
//   }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const competition = await competitionService.getCompetitionById(params.id);

//   if (!competition) {
//     return {
//       title: 'Competition Not Found | Makarapreneur',
//       description: 'The competition you are looking for does not exist.',
//     };
//   }

//   return {
//     title: `Register ${competition.name} | Makarapreneur`,
//     description: `Register your team for the ${competition.name}.`,
//     openGraph: {
//       title: `Register ${competition.name} | Makarapreneur`,
//       description: `Register your team for the ${competition.name}.`,
//       type: 'website',
//     },
//   };
// }

// export default async function RegisterCompetitionPage({ params }: Props) {
//   const competition = await competitionService.getCompetitionById(params.id);

//   if (!competition) {
//     notFound();
//   }

//   return <RegisterCompetition competition={competition} />;
// }