// components/competition/InformationCard.tsx
"use client";

import { useState, useEffect } from 'react';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy, Users, Timer, Target, Check, ChevronRight, AlertCircle } from 'lucide-react';

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

  return (
    <div className="bg-juneBud py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Competition Info */}
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-signalBlack">
              {competition?.name || 'Competition Name'}
            </h1>
            <div className="flex items-center gap-2 mb-4 text-signalBlack/80">
              <Trophy className="w-5 h-5" />
              <span className="text-lg">Business Case Competition</span>
            </div>
            <p className="text-lg text-signalBlack/90 leading-relaxed mb-8 max-w-2xl">
              {competition?.description || 'Competition description loading...'}
            </p>
          </div>

          {/* Right Section - Registration Status & Team Info */}
          <div className="lg:w-[400px] space-y-6">
            {/* Registration Status Card */}
            <div className="bg-signalBlack rounded-xl p-6 text-linen">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Registration Status</h2>
                {team ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm">
                    <Check className="w-4 h-4" />
                    Registered
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Not Registered
                  </div>
                )}
              </div>
              {!team && (
                <>
                  <p className="text-sm text-linen/80 mb-4">
                    Registration Deadline:
                    <span className="block text-lg font-medium mt-1">
                      {new Date(competition?.registrationDeadline || '').toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </p>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <TimeBlock label="Days" value={timeLeft.days} />
                    <TimeBlock label="Hours" value={timeLeft.hours} />
                    <TimeBlock label="Min" value={timeLeft.minutes} />
                    <TimeBlock label="Sec" value={timeLeft.seconds} />
                  </div>
                  <Button
                    onClick={onRegister}
                    className="w-full bg-juneBud text-signalBlack hover:bg-juneBud/90 group"
                    disabled={new Date() > new Date(competition?.registrationDeadline || 0)}
                  >
                    {new Date() > new Date(competition?.registrationDeadline || 0) ? (
                      <span className="flex items-center justify-center gap-2">
                        <Timer className="w-4 h-4" />
                        Registration Closed
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Register Now
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Team Info Card - Only shown if team exists */}
            {team && (
              <div className="bg-signalBlack rounded-xl p-6 text-linen">
                <div className="space-y-6">
                  {/* Team Details */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team Details
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-linen/60">Team Name</label>
                        <p className="text-lg font-medium">{team.teamName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-linen/60">Leader</label>
                        <p className="text-lg font-medium">{team.teamLeader.name}</p>
                      </div>
                      {team.members.member1 && (
                        <div>
                          <label className="text-sm text-linen/60">Member 1</label>
                          <p className="text-lg font-medium">{team.members.member1.name}</p>
                        </div>
                      )}
                      {team.members.member2 && (
                        <div>
                          <label className="text-sm text-linen/60">Member 2</label>
                          <p className="text-lg font-medium">{team.members.member2.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Current Progress
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-linen/60">Stage</label>
                        <p className="text-lg font-medium">Stage {Object.keys(team.stages).length}</p>
                      </div>
                      <div>
                        <label className="text-sm text-linen/60">Status</label>
                        <p className={`text-lg font-medium ${
                          team.registrationStatus === 'approved' ? 'text-green-400' :
                          team.registrationStatus === 'rejected' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {team.registrationStatus.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {onEdit && (
                    <Button
                      onClick={onEdit}
                      className="w-full bg-juneBud text-signalBlack hover:bg-juneBud/90 group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Edit Team Information
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TimeBlock = ({ label, value }: { label: string; value: number }) => (
  <motion.div 
    className="bg-linen/10 rounded-lg p-2 text-center"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <span className="text-xl font-bold block">
      {value < 10 ? `0${value}` : value}
    </span>
    <span className="text-xs text-linen/60">{label}</span>
  </motion.div>
);