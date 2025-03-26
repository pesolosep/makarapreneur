"use client";

import { useEffect, useState } from 'react';
import NetworkingEventRegistrationForm from '@/components/networking/NetworkingRegister';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { networkingEventService } from '@/lib/firebase/networkNightService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Edit, ArrowLeft, PenBox } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NetworkingParticipant } from '@/models/NetworkParticipant';
import { useRouter } from 'next/navigation';

export default function NetworkingEventRegistrationPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<NetworkingParticipant | null>(null);
  const [editMode, setEditMode] = useState(false);
//   const [registrationClosed, setRegistrationClosed] = useState(false);
  
  // Set this to true when registration is closed
//   const REGISTRATION_CLOSED = false;
//   // Set the registration deadline
//   const REGISTRATION_DEADLINE = new Date('2025-04-05T23:59:59');

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
        router.push('/authentication/login?redirect=/event/register/networking');
        return;
      }
    const checkRegistrationStatus = async () => {
      try {
        setCheckingRegistration(true);
        
        // Check if user already registered
        const registration = await networkingEventService.getParticipantByUserId(user.uid);
        if (registration) {
          setAlreadyRegistered(true);
          setExistingRegistration(registration);
        }
        
        // Check if registration is closed
        // const now = new Date();
        // if (REGISTRATION_CLOSED || now > REGISTRATION_DEADLINE) {
        //   setRegistrationClosed(true);
        // }
      } catch (error) {
        console.error('Error checking registration status:', error);
      } finally {
        setCheckingRegistration(false);
      }
    };
    
    checkRegistrationStatus();
  }, [user, loading]);

  if (loading || checkingRegistration) {
    return (
      <div className="min-h-screen bg-signalBlack flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-juneBud" />
      </div>
    );
  }

  if (alreadyRegistered && !editMode) {
    return (
      <>
        <Navbar notTransparent/>
        <div className="min-h-screen bg-signalBlack flex items-center justify-center p-4 pt-24">
          <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/10 text-linen">
            <Alert className="bg-juneBud/10 border-juneBud/20 mb-6">
              <ExclamationTriangleIcon className="h-6 w-6 text-juneBud" />
              <AlertTitle className="text-juneBud font-semibold text-lg">Already Registered</AlertTitle>
              <AlertDescription>
                <p className="mt-2 mb-4 text-juneBud">
                  You have already registered for the Networking Night event. Your registration has been recorded.
                </p>
                <p className="mb-4 text-juneBud">
                  If you need to update your registration details, you can use the button below to edit your submission.
                </p>
                <p className="mb-4 text-white">
                  Warning: Editing form near the event time may cause issues with your registration.
                </p>
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-5">
              {/* Edit Registration Button */}
              <Button 
                onClick={() => setEditMode(true)}
                className="w-full py-6 text-base font-medium bg-gradient-to-r from-juneBud to-juneBud/90 hover:from-juneBud/90 hover:to-juneBud text-signalBlack shadow-lg shadow-juneBud/20 hover:shadow-juneBud/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <PenBox className="w-5 h-5 mr-2" />
                Edit My Registration
              </Button>
              
              {/* Dashboard Button */}
              <Button 
                variant="outline" 
                asChild
                className="w-full py-6 text-base font-medium border-2 border-juneBud/30 bg-transparent text-juneBud hover:bg-juneBud/10 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <a href="/networking">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Networking Page
                </a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

//   if (registrationClosed) {
//     return (
//       <>
//         <Navbar notTransparent/>
//         <div className="min-h-screen bg-signalBlack flex items-center justify-center p-4 pt-24">
//           <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/10 text-linen">
//             <Alert className="bg-red-500/10 border-red-500/20">
//               <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
//               <AlertTitle className="text-red-400 font-semibold text-lg">Registration Closed</AlertTitle>
//               <AlertDescription>
//                 <p className="mt-2 mb-4">
//                   We're sorry, but registration for the Networking Night event has closed. The deadline was {REGISTRATION_DEADLINE.toLocaleDateString()} at {REGISTRATION_DEADLINE.toLocaleTimeString()}.
//                 </p>
//                 <p className="mb-6">
//                   Follow our social media accounts for updates on future networking events.
//                 </p>
//                 <div className="flex justify-center">
//                   <Link href="/">
//                     <Button className="bg-red-500/80 text-white hover:bg-red-500">
//                       Back to Home
//                     </Button>
//                   </Link>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

  return <NetworkingEventRegistrationForm editMode={editMode} existingData={editMode ? existingRegistration : null} />;
}