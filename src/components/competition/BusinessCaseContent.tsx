/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeamId } from '@/hooks/useTeamId';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InformationCard from "@/components/competition/InformationCard";
import { AssignmentList } from "@/components/competition/AssignmentCard";
import SemifinalPaymentButton from '@/components/competition/SemifinalPaymentButton';
import AboutUs from '../homepage/AboutUs';

export default function BusinessCaseContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  const { user , loading: loadingAuth} = useAuth();
  const competitionId = 'business-case';
  const { teamId, loading: teamIdLoading } = useTeamId(competitionId);

  useEffect(() => {
    if (!user && !loadingAuth) {
      router.push('/authentication/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (teamIdLoading) return;

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

          const stageAssignments = Object.entries(competitionData.stages)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      if (new Date() > new Date(stage.deadline)) {
        throw new Error('Submission deadline has passed');
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        // Handle file upload logic here

        toast({
          title: "Success",
          description: "Submission uploaded successfully",
        });

        // Refresh team data after upload
        const teamDoc = await getDoc(doc(db, 'teams', team.id));
        if (teamDoc.exists()) {
          const updatedTeam = teamDoc.data() as Team;
          setTeam(updatedTeam);
          
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

  if (loadingAuth || teamIdLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-juneBud" />
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-background font-poppins">
      <Navbar notTransparent />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24" // Tambahkan min-height di sini
      >
        <InformationCard
          competition={competition}
          team={team}
          onRegister={() => router.push('/competition/business-plan/register')}
          onEdit={() => router.push('/competition/business-plan/edit')}
        />

        {team && assignments.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="py-12 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-signalBlack">Your Assignments</h2>
                {team.stages[2]?.status === 'cleared' && !team.stages[2]?.paidStatus && (
                  <div className="w-80">
                    <SemifinalPaymentButton 
                      teamId={team.id} 
                      disabled={!competition?.stages[3]?.visibility}
                    />
                  </div>
                )}
              </div>
              
              <AssignmentList
                assignments={assignments}
                onDownload={handleDownload}
                onUpload={handleUpload}
              />
            </div>
          </motion.section>
        )}
      </motion.main>
     <AboutUs/>
      <Footer />
    </div>
  );
}