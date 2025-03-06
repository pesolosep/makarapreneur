/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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
import InformationCard from "@/components/competition/InformationCardRedacted";
import { AssignmentList } from "@/components/competition/AssignmentCard";
import SemifinalPaymentButton from '@/components/competition/SemifinalPaymentButton';
import AboutUs from '@/components/homepage/AboutUs';
import { competitionService } from '@/lib/firebase/competitionService';

interface BusinessCaseContentProps {
  competition: Competition
}

export default function BusinessCaseContent({ competition }: BusinessCaseContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [team, setTeam] = useState<Team | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const { user, loading: loadingAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !loadingAuth) {
      // Create public view of assignments for non-logged in users
      const publicAssignments = Object.entries(competition.stages)
        .filter(([_, stage]) => stage.visibility)
        .map(([stageNum, stage]) => ({
          id: stageNum,
          stageNumber: parseInt(stageNum),
          ...stage,
          submission: null,
          submissionEnabled: false
        }));

      setAssignments(publicAssignments);
      setLoading(false);
      return;
    }

    const fetchTeamData = async () => {
      if (!user || !competition) return;

      try {
        const teamsQuery = query(
          collection(db, 'teams'),
          where('userId', '==', user.uid),
          where('competitionId', '==', competition.id)
        );

        const teamSnapshot = await getDocs(teamsQuery);
        const teamDoc = teamSnapshot.docs[0];

        if (teamDoc) {
          const teamData = {
            ...teamDoc.data(),
            id: teamDoc.id,
            createdAt: teamDoc.data().createdAt?.toDate(),
            updatedAt: teamDoc.data().updatedAt?.toDate(),
            registrationDate: teamDoc.data().registrationDate?.toDate(),
            stages: Object.entries(teamDoc.data().stages || {}).reduce((acc, [key, value]: [string, any]) => ({
              ...acc,
              [key]: {
                ...value,
                submissionDate: value.submissionDate?.toDate()
              }
            }), {})
          } as Team;
          
          setTeam(teamData);

          const teamAssignments = Object.entries(competition.stages)
            .filter(([_, stage]) => stage.visibility)
            .map(([stageNum, stage]) => {
              const stageNumber = parseInt(stageNum);
              const previousStage = teamData.stages[stageNumber - 1];
              const currentStage = teamData.stages[stageNumber];

              return {
                id: stageNum,
                stageNumber,
                ...stage,
                submission: currentStage,
                submissionEnabled: 
                  teamData.registrationStatus === 'approved' && 
                  (stageNumber === 1 || previousStage?.status !== 'rejected') && 
                  stage.visibility
              };
            });

          setAssignments(teamAssignments);
        } else {
          // If no team found, show public assignments
          const publicAssignments = Object.entries(competition.stages)
            .filter(([_, stage]) => stage.visibility)
            .map(([stageNum, stage]) => ({
              id: stageNum,
              stageNumber: parseInt(stageNum),
              ...stage,
              submission: null,
              submissionEnabled: false
            }));

          setAssignments(publicAssignments);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load team data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user, competition, toast, loadingAuth]);

  // Handle authentication requirements for actions
  const handleAuthenticatedAction = (action: () => void, message: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: message,
        variant: "destructive"
      });
      router.push('/authentication/login');
      return false;
    }
    return true;
  };

  const handleDownload = async (stageId: string) => {
    if (!handleAuthenticatedAction(
      () => {}, 
      "Please log in to download guidelines"
    )) return;

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

  const handleUpload = async (stageId: string, file: File) => {
    if (!handleAuthenticatedAction(
      () => {}, 
      "Please log in to submit your work"
    )) return;
  
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
      
      // Validate team registration status
      if (team.registrationStatus !== 'approved') {
        throw new Error('Your team registration must be approved first');
      }
  
      // Check if previous stage was rejected (except for stage 1)
      if (stageNumber > 1 && previousStage?.status === 'rejected') {
        throw new Error('Previous stage submission was rejected');
      }
  
      // Verify stage visibility
      if (!stage.visibility) {
        throw new Error('This stage is not currently available');
      }
  
      // Check submission deadline
      if (new Date() > new Date(stage.deadline)) {
        throw new Error('Submission deadline has passed');
      }
  
      // Since we already have the file, directly submit it
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
          id: teamDoc.id,
          createdAt: teamDoc.data().createdAt?.toDate(),
          updatedAt: teamDoc.data().updatedAt?.toDate(),
          registrationDate: teamDoc.data().registrationDate?.toDate(),
          stages: Object.entries(teamDoc.data().stages || {}).reduce((acc, [key, value]: [string, any]) => ({
            ...acc,
            [key]: {
              ...value,
              submissionDate: value.submissionDate?.toDate()
            }
          }), {})
        } as Team;
        
        setTeam(updatedTeam);
        
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-juneBud to-cornflowerBlue  font-poppins">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-juneBud" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-juneBud to-cornflowerBlue font-poppins">
      <Navbar notTransparent />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24"
      >
        <InformationCard
          competition={competition}
          team={team}
          onRegister={() => router.push(`/competition/${competition.id}/register`)}
          onEdit={() => router.push(`/competition/${competition.id}/edit`)}
        />

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-12 px-4 bg-linen"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl lg:text-4xl uppercase font-bold mb-6 text-signalBlack">Competition Stages</h2>
            <AssignmentList
              assignments={assignments}
              onDownload={handleDownload}
              onUpload={handleUpload}
              team={team}
            />
            
            {team?.stages[1]?.status === 'cleared' && !team?.paidStatus && (
              <div className="mt-8">
                <SemifinalPaymentButton 
                  teamId={team.id} 
                  disabled={!competition?.stages[3]?.visibility}
                />
              </div>
            )}
          </div>
        </motion.section>
      </motion.main>
      
      <AboutUs />
      <Footer />
    </div>
  );
}