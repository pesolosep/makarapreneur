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

export default function InformationCard({ 
  competition,
  team,
  onRegister,
  onEdit
}: InformationCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  const currentStage = team && competition?.stages ? 
    Object.entries(competition.stages).find(([key]) => key === Object.keys(team.stages).length.toString()) : null;

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
                      <motion.div
                        key="registered"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 px-4 py-2 bg-juneBud/20 text-juneBud rounded-full"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Registered</span>
                      </motion.div>
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
                        {/* Stage Info */}
                        {currentStage && (
                          <div>
                            <label className="text-sm text-linen/60 block mb-1">Current Stage</label>
                            <div className="bg-white/5 rounded p-3 border border-white/10">
                              <h4 className="text-lg font-medium text-cornflowerBlue mb-2">
                                {currentStage[1].title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-linen/60">
                                <Calendar className="w-4 h-4" />
                                <span>Due {new Date(currentStage[1].deadline).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Registration Status */}
                        <div>
                          <label className="text-sm text-linen/60 block mb-1">Application Status</label>
                          <div className="flex items-center gap-2 bg-white/5 rounded p-3 border border-white/10">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              team.registrationStatus === 'approved' && 'bg-juneBud',
                              team.registrationStatus === 'rejected' && 'bg-destructive',
                              team.registrationStatus === 'pending' && 'bg-muted'
                            )} />
                            <span className={cn(
                              "text-sm font-medium",
                              team.registrationStatus === 'approved' && 'text-juneBud',
                              team.registrationStatus === 'rejected' && 'text-destructive',
                              team.registrationStatus === 'pending' && 'text-linen/60'
                            )}>
                              {team.registrationStatus === 'approved' && 'Application Approved'}
                              {team.registrationStatus === 'rejected' && 'Application Rejected'}
                              {team.registrationStatus === 'pending' && 'Under Review'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {onEdit && (
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
