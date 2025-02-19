"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Navbar from "@/components/Navbar";
import InformationCard from "@/components/competition/InformationCard";
import { AssignmentList } from "@/components/competition/AssignmentCard";
import { Competition, Stage } from '@/models/Competition';
import { Team } from '@/models/Team';
import { competitionService } from '@/lib/firebase/competitionService';
import { useToast } from '@/hooks/use-toast';
import SemifinalPaymentButton from '@/components/competition/SemifinalPaymentButton';

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const competitionId = 'business-plan';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // If still authenticating, don't fetch yet
        if (authLoading) return;

        // If no user and authentication is complete, redirect
        if (!user && !authLoading) {
          router.push('/login');
          return;
        }

        // Fetch competition data
        const competitionDoc = await getDoc(doc(db, 'competitions', competitionId));
        if (!competitionDoc.exists()) {
          throw new Error('Competition not found');
        }

        const competitionData = {
          ...competitionDoc.data(),
          id: competitionDoc.id,
          registrationDeadline: competitionDoc.data().registrationDeadline?.toDate(),
          createdAt: competitionDoc.data().createdAt?.toDate(),
          updatedAt: competitionDoc.data().updatedAt?.toDate(),
          stages: Object.entries(competitionDoc.data().stages || {}).reduce((acc, [key, value]: [string, any]) => ({
            ...acc,
            [key]: {
              ...value,
              deadline: value.deadline?.toDate()
            }
          }), {})
        } as Competition;

        setCompetition(competitionData);

        if (!user) return;

        // Fetch team data if exists
        const teamsQuery = query(
          collection(db, 'teams'),
          where('userId', '==', user.uid),
          where('competitionId', '==', competitionId)
        );
        const teamSnapshot = await getDocs(teamsQuery);
        const teamDoc = teamSnapshot.docs[0];

        if (teamDoc) {
          const teamData = {
            ...teamDoc.data(),
            id: teamDoc.id
          } as Team;
          
          setTeam(teamData);

          // Transform visible stages into assignments
          const stageAssignments = Object.entries(competitionData.stages)
            .filter(([_, stage]) => stage.visibility)
            .map(([stageNum, stage]) => {
              const stageNumber = parseInt(stageNum);
              const previousStage = teamData.stages[stageNumber - 1];
              const currentStage = teamData.stages[stageNumber];

              return {
                id: stageNum,
                ...stage,
                submission: currentStage,
                submissionEnabled: 
                  teamData.registrationStatus === 'approved' && 
                  (stageNumber === 1 || previousStage?.status !== 'rejected') && 
                  stage.visibility
              };
            });

          setAssignments(stageAssignments);
        } else {
          const stageAssignments = Object.entries(competitionData.stages)
            .filter(([_, stage]) => stage.visibility)
            .map(([stageNum, stage]) => ({
              id: stageNum,
              ...stage,
              submission: null,
              submissionEnabled: false
            }));

          setAssignments(stageAssignments);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load competition data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, competitionId, toast, router]);

  const handleDownload = async (stageId: string) => {
    try {
      const stage = competition?.stages[parseInt(stageId)];
      if (!stage?.guidelineFileURL) {
        throw new Error('Guidelines not available');
      }

      const link = document.createElement('a');
      link.href = stage.guidelineFileURL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Error",
        description: error instanceof Error ? error.message : "Failed to download guidelines",
      });
    }
  };

  const handleUpload = async (stageId: string) => {
    try {
      if (!team) {
        throw new Error('You must be registered to submit');
      }

      const stage = competition?.stages[parseInt(stageId)];
      if (!stage) {
        throw new Error('Stage not found');
      }

      const stageNumber = parseInt(stageId);
      const previousStage = team.stages[stageNumber - 1];
      
      if (team.registrationStatus !== 'approved') {
        throw new Error('Your team registration must be approved first');
      }

      if (stageNumber > 1 && previousStage?.status === 'rejected') {
        throw new Error('Previous stage submission was rejected');
      }

      if (!stage.visibility) {
        throw new Error('This stage is not currently available');
      }

      if (new Date() > new Date(stage.deadline)) {
        throw new Error('Submission deadline has passed');
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setLoading(true);
        try {
          await competitionService.submitStageWork(team.id, stageNumber, file);
          
          toast({
            title: "Success",
            description: "Submission uploaded successfully",
          });

          // Refresh team data
          const teamDoc = await getDoc(doc(db, 'teams', team.id));
          if (teamDoc.exists()) {
            const updatedTeam = {
              ...teamDoc.data(),
              id: teamDoc.id
            } as Team;
            
            setTeam(updatedTeam);
            
            // Update assignments
            setAssignments(prev => 
              prev.map(assignment => 
                assignment.id === stageId 
                  ? { 
                      ...assignment, 
                      submission: updatedTeam.stages[stageNumber],
                      submissionEnabled: true
                    }
                  : assignment
              )
            );
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Upload Error",
            description: error instanceof Error ? error.message : "Failed to upload submission",
          });
        } finally {
          setLoading(false);
        }
      };
      
      input.click();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload submission",
      });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 font-poppins">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Navbar />

      <InformationCard
        competition={competition}
        team={team}
        registrationUrl={`/competition/${competitionId}/register`}
      />

      <div className="bg-gray-500 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white">Competition Stages</h2>
          <AssignmentList
            assignments={assignments}
            onDownload={handleDownload}
            onUpload={handleUpload}
          />
          
          {team?.stages[2]?.status === 'cleared' && !team.stages[2]?.paidStatus && (
            <div className="mt-8">
              <SemifinalPaymentButton 
                teamId={team.id} 
                disabled={!competition?.stages[3]?.visibility}
              />
            </div>
          )}
        </div>
      </div>

      <AboutUs />
      <Footer />
    </div>
  );
}