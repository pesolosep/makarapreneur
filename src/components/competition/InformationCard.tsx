// components/competition/InformationCard.tsx
import { useState, useEffect } from 'react';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { Button } from '@/components/ui/button';

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
    calculateTimeLeft(); // Initial calculation

    return () => clearInterval(timer);
  }, [competition?.registrationDeadline]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className="bg-juneBud p-4 py-20">
      <div className="w-full py-9">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 text-signalBlack text-left">
            <h1 className="font-semibold text-3xl tracking-widest mb-5">
              {competition?.name || 'Competition Name'}
            </h1>
            <p className="font-medium max-w-[500px]">
              {competition?.description || 'Competition description loading...'}
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-gray-700 text-white p-6 rounded-lg shadow-none">
            <h2 className="text-xl font-semibold mb-4">Team Information</h2>
            {team ? (
              <div className="space-y-3">
                <p><span className="font-medium">Team Name:</span> {team.teamName}</p>
                <p><span className="font-medium">Team Leader:</span> {team.teamLeader.name}</p>
                {team.members.member1 && (
                  <p><span className="font-medium">Member 1:</span> {team.members.member1.name}</p>
                )}
                {team.members.member2 && (
                  <p><span className="font-medium">Member 2:</span> {team.members.member2.name}</p>
                )}
                <p>
                  <span className="font-medium">Registration Status:</span>{' '}
                  <span className={`
                    ${team.registrationStatus === 'approved' ? 'text-green-400' : ''}
                    ${team.registrationStatus === 'rejected' ? 'text-red-400' : ''}
                    ${team.registrationStatus === 'pending' ? 'text-yellow-400' : ''}
                  `}>
                    {team.registrationStatus.toUpperCase()}
                  </span>
                </p>
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="secondary"
                    className="w-full"
                  >
                    Edit Team Information
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
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
                <p><span className="font-medium">Status:</span> Not Registered</p>
                <p>
                  <span className="font-medium">Registration Deadline:</span>{' '}
                  {competition?.registrationDeadline.toLocaleString()}
                </p>
                <Button
                  onClick={onRegister}
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={new Date() > new Date(competition?.registrationDeadline || 0)}
                >
                  Register Now!
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}