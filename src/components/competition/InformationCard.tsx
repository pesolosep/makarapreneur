// components/competition/InformationCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { Button } from '@/components/ui/button';
import { Timestamp } from 'firebase/firestore';

// Updated interface to use onRegister callback instead of URL
interface InformationCardProps {
  competition?: Competition | null;
  team?: Team | null;
  onRegister: () => void;  // Changed from registrationUrl to onRegister function
}

// Helper interface for countdown timer
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function InformationCard({ 
  competition,
  team,
  onRegister
}: InformationCardProps) {
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  // Effect to handle countdown timer
  useEffect(() => {
    if (!competition?.registrationDeadline) return;

    const calculateTimeLeft = () => {
      const deadline = competition.registrationDeadline instanceof Timestamp 
        ? competition.registrationDeadline.toDate() 
        : new Date(competition.registrationDeadline);
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();
      
      setIsDeadlinePassed(difference <= 0);
      
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

    // Set up timer interval
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [competition?.registrationDeadline]);

  // Helper function to format numbers for display
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  // Helper function to format dates consistently
  const formatDate = (date: Date | Timestamp): string => {
    const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
    
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      hour12: true
    });
  };

  return (
    <div className="bg-juneBud p-4 py-20">
      <div className="w-full py-9">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Competition Information Section */}
          <div className="flex-1 text-signalBlack text-left">
            <h1 className="font-semibold text-3xl tracking-widest mb-5">
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

          {/* Team/Registration Information Section */}
          <div className="w-full md:w-1/3 bg-gray-700 text-white p-6 rounded-lg shadow-none">
            {team ? (
              // Registered Team View
              <div className="space-y-3">
                <h2 className="text-xl font-semibold mb-4">Team Information</h2>
                <div className="space-y-2">
                  <p className="font-medium text-lg">{team.teamName}</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Team Leader:</span> {team.teamLeader.name}
                    </p>
                    {team.members.member1 && (
                      <p className="text-sm">
                        <span className="font-medium">Member 1:</span> {team.members.member1.name}
                      </p>
                    )}
                    {team.members.member2 && (
                      <p className="text-sm">
                        <span className="font-medium">Member 2:</span> {team.members.member2.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm">
                    <span className="font-medium">Status: </span>
                    <span className={`
                      ${team.registrationStatus === 'approved' ? 'text-green-400' : ''}
                      ${team.registrationStatus === 'rejected' ? 'text-red-400' : ''}
                      ${team.registrationStatus === 'pending' ? 'text-yellow-400' : ''}
                    `}>
                      {team.registrationStatus.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Registered on: </span>
                    {team.registrationDate && formatDate(team.registrationDate)}
                  </p>
                </div>
              </div>
            ) : (
              // Registration View for Non-registered Users
              <div className="space-y-3">
                <h2 className="text-xl font-semibold mb-4">Registration Information</h2>
                {!isDeadlinePassed ? (
                  // Countdown Timer Display
                  <div className="text-red-500 text-2xl font-bold mb-4 text-center">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center">
                        <span>{formatNumber(timeLeft.days)}</span>
                        <span className="text-sm">Days</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span>{formatNumber(timeLeft.hours)}</span>
                        <span className="text-sm">Hours</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span>{formatNumber(timeLeft.minutes)}</span>
                        <span className="text-sm">Min</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span>{formatNumber(timeLeft.seconds)}</span>
                        <span className="text-sm">Sec</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-500 text-center font-semibold">
                    Registration Closed
                  </p>
                )}
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Registration Deadline:</span><br/>
                    {competition?.registrationDeadline ? 
                      formatDate(competition.registrationDeadline) : 
                      'Loading...'}
                  </p>
                </div>
                <Button
                  onClick={onRegister}
                  className="w-full bg-green-500 hover:bg-green-600 mt-4"
                  disabled={isDeadlinePassed}
                >
                  Register Now
                </Button>
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