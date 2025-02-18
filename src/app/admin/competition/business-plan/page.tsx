"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Navbar from "@/components/Navbar";
import InformationCard from "@/components/competition/InformationCard";
import { AssignmentList } from "@/components/competition/AssignmentCard";
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { competitionService } from '@/lib/firebase/competitionService';
import { useTeamId } from '@/hooks/useTeamId';
import { useToast } from '@/hooks/use-toast';
import SemifinalPaymentButton from '@/components/competition/SemifinalPaymentButton';

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get authenticated user
  const { user } = useAuth();

  // Get competitionId from wherever you're storing it
  const competitionId = 'business-plan';
  
  // Get teamId based on authenticated user
  const { teamId, loading: teamIdLoading } = useTeamId(competitionId);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {

      // router.push('/login');
      console.log("ini user " + user)
      return;
    }

    const fetchData = async () => {
      try {
        // Wait for teamId to be available
        if (teamIdLoading) return;

        // Fetch competition and team data if teamId exists
        const [competitionDoc, teamDoc] = await Promise.all([
          getDoc(doc(db, 'competitions', competitionId)),
          teamId ? getDoc(doc(db, 'teams', teamId)) : null
        ]);

        if (!competitionDoc.exists()) {
          throw new Error('Competition not found');
        }

        const competitionData = competitionDoc.data() as Competition;
        setCompetition(competitionData);

        if (teamDoc?.exists()) {
          const teamData = teamDoc.data() as Team;
          setTeam(teamData);

          // Transform stages into assignments
          const stageAssignments = Object.entries(competitionData.stages)
            .filter(([_, stage]) => stage.visibility)
            .map(([stageNum, stage]) => ({
              id: stageNum,
              ...stage,
              submission: teamData.stages[parseInt(stageNum)]
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
  }, [user, teamId, teamIdLoading, competitionId, toast, router]);

  const handleDownload = async (stageId: string) => {
    try {
      const stage = competition?.stages[parseInt(stageId)];
      if (!stage?.guidelineFileURL) {
        throw new Error('Guidelines not available');
      }

      // Create a temporary anchor element to trigger download
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
        throw new Error('Team not found');
      }

      const stage = competition?.stages[parseInt(stageId)];
      if (!stage) {
        throw new Error('Stage not found');
      }

      // Check if past deadline
      if (new Date() > new Date(stage.deadline)) {
        throw new Error('Submission deadline has passed');
      }

      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        await competitionService.submitStageWork(team.id, parseInt(stageId), file);
        
        toast({
          title: "Success",
          description: "Submission uploaded successfully",
        });

        // Refresh the data
        const teamDoc = await getDoc(doc(db, 'teams', team.id));
        if (teamDoc.exists()) {
          const updatedTeam = teamDoc.data() as Team;
          setTeam(updatedTeam);
          
          // Update assignments with new submission data
          setAssignments(prev => 
            prev.map(assignment => 
              assignment.id === stageId 
                ? { ...assignment, submission: updatedTeam.stages[parseInt(stageId)] }
                : assignment
            )
          );
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

  if (loading || teamIdLoading) {
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
        onRegister={() => router.push('/competition/register')}
        onEdit={() => router.push('/competition/edit')}
      />

      {team && (
        <div className="bg-gray-500 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-white">Your Assignments</h2>
            <AssignmentList
              assignments={assignments}
              onDownload={handleDownload}
              onUpload={handleUpload}
            />
            
            {team.stages[2]?.status === 'cleared' && !team.stages[2]?.paidStatus && (
              <div className="mt-8">
                <SemifinalPaymentButton 
                  teamId={team.id} 
                  disabled={!competition?.stages[3]?.visibility}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <AboutUs />
      <Footer />
    </div>
  );
}