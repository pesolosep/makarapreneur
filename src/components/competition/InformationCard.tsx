"use client";

import { useState, useEffect } from 'react';
import { Competition } from '@/models/Competition';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Timer, ChevronRight, Calendar, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InformationCardProps {
  competition?: Competition | null;
  onRegister: () => void;
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
    y: -20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: -15
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.8
    }
  }
};

export default function InformationCard({ 
  competition,
  onRegister
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

  const handleRedirectToRegister = () => {
    // Use registration URL from the competition model or fallback to default
    const registrationUrl = competition?.registrationUrl || 'https://makarapreneur.id/register';
    window.open(registrationUrl, '_blank');
  };

  const handleDownloadGuidelines = () => {
    // Use guideline file URL from the competition model stage 1 or fallback to default
    const guidelineUrl = competition?.stages?.[1]?.guidelineFileURL || 'https://makarapreneur.id/guidelines';
    window.open(guidelineUrl, '_blank');
  };

  return (
    <section className="bg-gradient-to-b from-juneBud/90 to-cornflowerBlue/90 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 relative"
      >
        {/* Competition Badge & Title */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-10"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full bg-cornflowerBlue/80 backdrop-blur-sm shadow-md"
          >
            <Trophy className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white font-poppins tracking-wide">
              BUSINESS COMPETITION
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6 text-signalBlack font-poppins leading-tight"
          >
            {competition?.name || 'Competition Name'}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl font-medium text-signalBlack/90 leading-relaxed max-w-3xl mx-auto"
          >
            {competition?.description || 'Competition description loading...'}
          </motion.p>
        </motion.div>

        {/* Registration Card - Centered with clean design */}
        <motion.div 
          variants={itemVariants}
          className="max-w-xl mx-auto"
        >
          <Card className="backdrop-blur-xl bg-gray-800/60 border border-white/20 overflow-hidden rounded-2xl shadow-xl">
            <CardContent className="p-8">
              {/* Top section with deadline */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <Calendar className="w-5 h-5 text-red-300" />
                  <span className="font-bold uppercase tracking-wide text-sm">Registration Deadline</span>
                </div>
                <p className="text-2xl font-bold text-white mb-2">
                  {new Date(competition?.registrationDeadline || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-base text-white/80 font-medium">
                  {new Date(competition?.registrationDeadline || '').toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div 
                variants={itemVariants}
                className="flex justify-between mb-8 p-4 rounded-xl bg-gradient-to-br from-gray-900/60 to-gray-700/40"
              >
                <CountdownBlock label="Days" value={timeLeft.days} />
                <CountdownBlock label="Hours" value={timeLeft.hours} />
                <CountdownBlock label="Minutes" value={timeLeft.minutes} />
                <CountdownBlock label="Seconds" value={timeLeft.seconds} />
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="space-y-4">
                <Button
                  onClick={handleRedirectToRegister}
                  className={cn(
                    "w-full py-6 text-base font-semibold",
                    "bg-gradient-to-r from-juneBud to-cornflowerBlue text-signalBlack",
                    "hover:shadow-lg hover:from-juneBud/90 hover:to-cornflowerBlue/90",
                    "transition-all duration-300 rounded-xl",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                  disabled={new Date() > new Date(competition?.registrationDeadline || 0)}
                >
                  <motion.span 
                    className="flex items-center justify-center gap-2"
                    whileHover={{ x: 3 }}
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
                        <ExternalLink className="w-5 h-5" />
                      </>
                    )}
                  </motion.span>
                </Button>
                
                <Button
                  onClick={handleDownloadGuidelines}
                  variant="outline"
                  className="w-full py-5 text-base font-medium bg-white/20 text-white border-white/30 
                           hover:bg-white/30 transition-all duration-300 rounded-xl"
                >
                  <motion.span
                    className="flex items-center justify-center gap-2" 
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                  >
                    <Download className="w-5 h-5" />
                    Download Guidelines
                  </motion.span>
                </Button>
              </motion.div>
              
              {/* Registration Status Badge - Only show when closed */}
              {new Date() > new Date(competition?.registrationDeadline || 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 bg-red-900/40 text-red-300 px-4 py-3 rounded-lg text-sm font-medium flex items-center"
                >
                  <Timer className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Registration is now closed. Please contact us for more information.</span>
                </motion.div>
              )}
              
              {/* Contact Information - Separate Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-12 bg-gray-700/50 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg"
              >
                <h3 className="font-bold text-base text-white mb-4 text-center uppercase tracking-wider">
                  Need Help? Contact Our Team
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href="https://wa.me/6282230057560" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-cornflowerBlue/80 hover:bg-cornflowerBlue transition-all duration-300 rounded-lg p-3 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0" className="text-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="font-semibold text-white">Rafli</span>
                    </span>
                    <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full group-hover:bg-white/30 transition-all">
                      +62 822-3005-7560
                    </span>
                  </a>
                  
                  <a 
                    href="https://wa.me/6287775002425" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-juneBud/80 hover:bg-juneBud transition-all duration-300 rounded-lg p-3 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0" className="text-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="font-semibold text-grey">Adelia</span>
                    </span>
                    <span className="text-grey text-sm bg-white/20 px-3 py-1 rounded-full group-hover:bg-white/30 transition-all">
                      +62 877-7500-2425
                    </span>
                  </a>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
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
    <div className="w-16 h-16 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 
                 flex items-center justify-center mb-2 shadow-md">
      <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
        {value < 10 ? `0${value}` : value}
      </span>
    </div>
    <span className="text-sm font-semibold text-white/90">{label}</span>
  </motion.div>
);