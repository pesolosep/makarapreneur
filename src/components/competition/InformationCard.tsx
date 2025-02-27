"use client";

import { useState, useEffect } from 'react';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Timer, Target, Check, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InformationCardProps {
  competition?: Competition | null;
  team?: Team | null;
  onRegister: () => void;
  onEdit?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const containerVariants = {
  hidden: { 
    opacity: 0,
    y: -20 // Mulai dari atas
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: -20 // Mulai dari atas
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 1
    }
  }
};

// Function to determine current stage and status
const determineCurrentStage = (team: Team, competition: Competition) => {
  
  if (!team || !competition?.stages) return null;
  
  // Get all team stage submissions
  const teamStages = team.stages;
  const competitionStages = competition.stages;
  
  // Check if registration is approved but no stages are cleared
  if (team.registrationStatus === 'approved' && 
      (!teamStages || Object.keys(teamStages).length === 0)) {
    return {
      stageNumber: '1',
      stageInfo: competitionStages['1'],
      statusText: 'Awaiting Submission',
      statusColor: 'text-linen/60',
      statusBg: 'bg-muted'
    };
  }
  
  // Find the last cleared stage
  let lastClearedStage: string | null = null;
  let nextStage: string | null = null;
  
  // Sort stage keys numerically
  const stageKeys = Object.keys(teamStages).sort((a, b) => parseInt(a) - parseInt(b));
  
  for (const stageKey of stageKeys) {
    const stage = teamStages[parseInt(stageKey)];
    
    if (stage.status === 'cleared' || stage.status === 'approved') {
      lastClearedStage = stageKey;
    }
  }
  
  // Determine the next stage
  if (lastClearedStage) {
    const nextStageNumber = (parseInt(lastClearedStage) + 1).toString();
    if (competitionStages[parseInt(nextStageNumber)]) {
      nextStage = nextStageNumber;
    }
  } else if (Object.keys(teamStages).length > 0) {
    // If no stages are cleared, use the first stage
    nextStage = '1';
  }
  
  // Check current stage status
  if (nextStage) {
    const currentStageSubmission = teamStages[parseInt(nextStage)];
    
    // Handle semifinal stage payment status
    if (nextStage === '2' && currentStageSubmission) {
      if (currentStageSubmission.status === 'cleared') {
        return {
          stageNumber: nextStage,
          stageInfo: competitionStages[parseInt(nextStage)],
          statusText: 'Stage Cleared',
          statusColor: 'text-juneBud',
          statusBg: 'bg-juneBud'
        };
      } else if (!currentStageSubmission.paidStatus) {
        return {
          stageNumber: nextStage,
          stageInfo: competitionStages[parseInt(nextStage)],
          statusText: 'Awaiting Payment',
          statusColor: 'text-linen/60',
          statusBg: 'bg-muted'
        };
      } else if (currentStageSubmission.paidStatus && currentStageSubmission.status === 'pending') {
        return {
          stageNumber: nextStage,
          stageInfo: competitionStages[parseInt(nextStage)],
          statusText: 'Under Review',
          statusColor: 'text-linen/60',
          statusBg: 'bg-muted'
        };
      }
    } else if (currentStageSubmission) {
      // Handle other stages
      switch (currentStageSubmission.status) {
        case 'pending':
          return {
            stageNumber: nextStage,
            stageInfo: competitionStages[parseInt(nextStage)],
            statusText: 'Under Review',
            statusColor: 'text-linen/60',
            statusBg: 'bg-muted'
          };
        case 'cleared':
        case 'approved':
          return {
            stageNumber: nextStage,
            stageInfo: competitionStages[parseInt(nextStage)],
            statusText: 'Stage Cleared',
            statusColor: 'text-juneBud',
            statusBg: 'bg-juneBud'
          };
        case 'rejected':
          return {
            stageNumber: nextStage,
            stageInfo: competitionStages[parseInt(nextStage)],
            statusText: 'Submission Rejected',
            statusColor: 'text-destructive',
            statusBg: 'bg-destructive'
          };
        default:
          return {
            stageNumber: nextStage,
            stageInfo: competitionStages[parseInt(nextStage)],
            statusText: 'Awaiting Submission',
            statusColor: 'text-linen/60',
            statusBg: 'bg-muted'
          };
      }
    } else {
      // Stage exists in competition but not yet in team submissions
      return {
        stageNumber: nextStage,
        stageInfo: competitionStages[parseInt(nextStage)],
        statusText: 'Awaiting Submission',
        statusColor: 'text-linen/60',
        statusBg: 'bg-muted'
      };
    }
  }
  
  // If all stages are cleared or no next stage is found
  if (lastClearedStage && lastClearedStage === Object.keys(competitionStages).length.toString()) {
    return {
      stageNumber: lastClearedStage,
      stageInfo: competitionStages[parseInt(lastClearedStage)],
      statusText: 'All Stages Completed',
      statusColor: 'text-juneBud',
      statusBg: 'bg-juneBud'
    };
  }
  
  // Default fallback
  return {
    stageNumber: '1',
    stageInfo: competitionStages['1'],
    statusText: 'Awaiting Submission',
    statusColor: 'text-linen/60',
    statusBg: 'bg-muted'
  };
};

// Helper function to determine application status display
const getApplicationStatus = (team: Team, currentStageInfo: { stageNumber: string; stageInfo: any; statusText: string; statusColor: string; statusBg: string; } | null) => {
  // If registration is not approved yet, show registration status
  if (team.registrationStatus !== 'approved') {
    return {
      statusText: team.registrationStatus === 'pending' ? 'Awaiting Registration Approval' : 'Application Rejected',
      statusColor: team.registrationStatus === 'pending' ? 'text-linen/60' : 'text-destructive',
      statusBg: team.registrationStatus === 'pending' ? 'bg-muted' : 'bg-destructive'
    };
  }
  
  // If registration is approved but no current stage info, default to approved status
  if (!currentStageInfo) {
    return {
      statusText: 'Application Approved',
      statusColor: 'text-juneBud',
      statusBg: 'bg-juneBud'
    };
  }
  
  // Otherwise, use the current stage status
  return {
    statusText: currentStageInfo.statusText,
    statusColor: currentStageInfo.statusColor,
    statusBg: currentStageInfo.statusBg
  };
};

export default function InformationCard({ 
  competition,
  team,
  onRegister,
  onEdit
}: InformationCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const currentStageInfo = team && competition?.stages ? determineCurrentStage(team, competition) : null;
  const statusDisplay = team ? getApplicationStatus(team, currentStageInfo) : null;
  
  // Get the status display information

  useEffect(() => {
    if (!competition?.registrationDeadline) return;

    const calculateTimeLeft = () => {
      const difference = new Date(competition.registrationDeadline).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [competition?.registrationDeadline]);

  return (
    <section className=" bg-gradient-to-b from-juneBud to-cornflowerBlue py-16">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 relative"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Section - Competition Info */}
          <motion.div 
            variants={itemVariants}
            className="flex-1 space-y-8"
          >
            <div className="relative">              
              <div className="relative">
                <motion.div 
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-cornflowerBlue"
                >
                  <Trophy className="w-5 h-5 text-linen" />
                  <span className="text-sm font-medium text-linen font-poppins">
                    Business Competition
                  </span>
                </motion.div>

                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl font-bold mb-6 text-signalBlack font-poppins leading-tight"
                >
                  {competition?.name || 'Competition Name'}
                </motion.h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-lg lg:text-xl font-medium text-signalBlack leading-relaxed font-sans"
                >
                  {competition?.description || 'Competition description loading...'}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Registration Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-[480px] sticky top-8"
          >
            <Card className="backdrop-blur-xl bg-signalBlack/95">
              <CardContent className="p-8">
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center justify-between mb-8"
                >
                  <h2 className="text-2xl font-bold font-poppins text-background">Registration Status</h2>
                  <AnimatePresence mode="wait">
    {team ? (
      team.registrationStatus === 'pending' ? (
        <motion.div
          key="pending"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-500 rounded-full"
        >
          <Timer className="w-4 h-4" />
          <span className="text-sm font-medium">Pending</span>
        </motion.div>
      ) : team.registrationStatus === 'approved' ? (
        <motion.div
          key="approved"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 px-4 py-2 bg-juneBud/20 text-juneBud rounded-full"
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Approved</span>
        </motion.div>
      ) : (
        <motion.div
          key="rejected"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 px-4 py-2 bg-destructive/20 text-destructive rounded-full"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Rejected</span>
        </motion.div>
      )
    ) : (
      <motion.div
        key="not-registered"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center gap-2 px-4 py-2 bg-destructive/20 text-destructive rounded-full"
      >
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Not Registered</span>
      </motion.div>
    )}
  </AnimatePresence>
                </motion.div>

                {!team ? (
                  <motion.div 
                    variants={containerVariants}
                    className="space-y-8"
                  >
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-2 text-linen/60 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span>Registration Deadline</span>
                      </div>
                      <p className="text-xl font-medium text-linen">
                        {new Date(competition?.registrationDeadline || '').toLocaleString()}
                      </p>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="flex justify-between"
                    >
                      <CountdownBlock label="Days" value={timeLeft.days} />
                      <CountdownBlock label="Hours" value={timeLeft.hours} />
                      <CountdownBlock label="Min" value={timeLeft.minutes} />
                      <CountdownBlock label="Sec" value={timeLeft.seconds} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        onClick={onRegister}
                        className={cn(
                          "w-full py-6 text-lg font-medium",
                          "bg-gradient-to-r from-juneBud to-cornflowerBlue text-signalBlack",
                          "hover:shadow-lg hover:shadow-cornflowerBlue/20",
                          "transition-all duration-300",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        disabled={new Date() > new Date(competition?.registrationDeadline || 0)}
                      >
                        <motion.div 
                          className="flex items-center justify-center gap-2"
                          whileHover={{ x: 5 }}
                          whileTap={{ x: -2 }}
                        >
                          {new Date() > new Date(competition?.registrationDeadline || 0) ? (
                            <>
                              <Timer className="w-5 h-5" />
                              Registration Closed
                            </>
                          ) : (
                            <>
                              Register Now
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.div>
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    className="space-y-6"
                  >
                    {/* Team Details */}
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-2 text-linen mb-3">
                        <Users className="w-5 h-5" />
                        <h3 className="text-xl font-semibold font-poppins">Team Details</h3>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <TeamInfoItem label="Team" value={team.teamName} />
                          <TeamInfoItem label="Leader" value={team.teamLeader.name} />
                          {team.members.member1 && (
                            <TeamInfoItem label="Member 1" value={team.members.member1.name} />
                          )}
                          {team.members.member2 && (
                            <TeamInfoItem label="Member 2" value={team.members.member2.name} />
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Status & Current Stage */}
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-2 text-linen mb-3">
                        <Target className="w-5 h-5" />
                        <h3 className="text-xl font-semibold font-poppins">Progress</h3>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 space-y-4">
                        {/* Stage Info - Always show current stage if available */}
                        {currentStageInfo && (
                          <div>
                            <label className="text-sm text-linen/60 block mb-1">Current Stage</label>
                            <div className="bg-white/5 rounded p-3 border border-white/10">
                              <h4 className="text-lg font-medium text-cornflowerBlue mb-2">
                                {currentStageInfo.stageInfo.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-linen/60">
                                <Calendar className="w-4 h-4" />
                                <span>Due {new Date(currentStageInfo.stageInfo.deadline).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Combined Application Status */}
                        <div>
                          <label className="text-sm text-linen/60 block mb-1">Application Status</label>
                          <div className="flex items-center gap-2 bg-white/5 rounded p-3 border border-white/10">
                                            <div className={cn(
                        "w-2 h-2 rounded-full",
                        team.registrationStatus === 'pending' ? "bg-amber-500" :
                        team.registrationStatus === 'approved' ? 
                          (currentStageInfo ? statusDisplay?.statusBg : "bg-juneBud") : 
                          "bg-destructive"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        team.registrationStatus === 'pending' ? "text-amber-500" :
                        team.registrationStatus === 'approved' ? 
                          (currentStageInfo ? statusDisplay?.statusColor : "text-juneBud") : 
                          "text-destructive"
                      )}>
                        {team.registrationStatus === 'pending' ? "Awaiting Registration Approval" :
                        team.registrationStatus === 'approved' ? 
                          (currentStageInfo ? statusDisplay?.statusText : "Application Approved") : 
                          "Application Rejected"}
                      </span>
                    </div>
                        </div>
                      </div>
                    </motion.div>
       

                  {/* Only show Edit button if registration is pending and deadline hasn't passed */}
                  {onEdit && 
                    team.registrationStatus !== 'approved' && 
                    new Date() <= new Date(competition?.registrationDeadline || 0) && (
                    <motion.div variants={itemVariants}>
                      <Button
                        onClick={onEdit}
                        className="w-full py-6 text-lg font-medium bg-gradient-to-r from-juneBud to-cornflowerBlue 
                        text-signalBlack hover:shadow-lg hover:shadow-cornflowerBlue/20 transition-all duration-500
                        hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <motion.div 
                          className="flex items-center justify-center gap-2"
                          whileHover={{ x: 5 }}
                          whileTap={{ x: -2 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 400,
                            damping: 10
                          }}
                        >
                          Edit Team Information
                          <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const CountdownBlock = ({ label, value }: { label: string; value: number }) => (
  <motion.div 
    className="flex flex-col items-center"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
      <span className="text-2xl font-bold text-linen font-mono tabular-nums">
        {value < 10 ? `0${value}` : value}
      </span>
    </div>
    <span className="text-sm font-medium text-linen/60">{label}</span>
  </motion.div>
);


const TeamInfoItem = ({ label, value, className }: { label: string; value: string; className?: string }) => (
  <div className="flex flex-col">
    <label className="text-sm text-linen/60 mb-1">{label}</label>
    <motion.p 
      className={cn("text-lg font-medium text-linen truncate", className)}
      whileHover={{ x: 2 }}
    >
      {value}
    </motion.p>
  </div>
);