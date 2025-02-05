import { useState, useEffect } from 'react';

interface InformationCardProps {
  isRegistered: boolean;
  toggleRegistration: () => void;
  deadlineDate: string; // Expected format: "YYYY-MM-DD HH:mm:ss"
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function InformationCard({ 
  isRegistered, 
  toggleRegistration,
  deadlineDate = "2025-12-31 23:59:59" // Default deadline
}: InformationCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadlineDate).getTime() - new Date().getTime();
      
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
  }, [deadlineDate]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className="bg-juneBud p-4">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 text-signalBlack text-left">
            <h1 className="font-semibold text-3xl tracking-widest mb-5">LOREM IPSUM</h1>
            <p className="font-medium max-w-[500px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-gray-700 text-white p-6 rounded-lg shadow-none">
            <h2 className="text-xl font-semibold mb-4">Member Information</h2>
            {isRegistered ? (
              <div className="space-y-3">
                <p><span className="font-medium">Member 1:</span> John Doe</p>
                <p><span className="font-medium">Member 2:</span> Jane Doe</p>
                <p><span className="font-medium">Member 3:</span> John Smith</p>
                <p><span className="font-medium">Member 4:</span> Jane Smith</p>

                <button
                  onClick={toggleRegistration}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Ceritanya tombol edit registration </button>

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
                <p><span className="font-medium">Deadline Registration:</span> {deadlineDate}</p>
                <button
                  onClick={toggleRegistration}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Register Now!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}