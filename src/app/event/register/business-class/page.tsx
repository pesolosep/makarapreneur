"use client";

import { useEffect, useState } from 'react';
import BusinessClassRegistrationForm from '@/components/businessclass/BusinessClassRegister';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { businessClassService } from '@/lib/firebase/businessClassService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Edit, ArrowLeft, PenBox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BusinessClassParticipant } from '@/models/BusinessClassParticipant';
import { useRouter } from 'next/navigation';

export default function BusinessClassRegistrationPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<BusinessClassParticipant | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
        router.push('/authentication/login?redirect=/event/register/business-class');
        return;
      }
    const checkRegistrationStatus = async () => {
      try {
        setCheckingRegistration(true);
        
        // Check if user already registered
        if (user.email) {
          const registration = await businessClassService.getParticipantByEmail(user.email);
          if (registration) {
            setAlreadyRegistered(true);
            setExistingRegistration(registration);
          }
        }
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
      <div className="min-h-screen bg-signalBlack flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/10 text-linen">
          <Alert className="bg-juneBud/10 border-juneBud/20 mb-6">
            <ExclamationTriangleIcon className="h-6 w-6 text-juneBud" color="red" />
            <AlertTitle className="text-juneBud font-semibold text-lg">Already Registered</AlertTitle>
            <AlertDescription>
              <p className="mt-2 mb-4 text-juneBud">
                You have already registered for the HIPMI UI Business Class. Your registration has been recorded.
              </p>
              <p className="mb-4 text-juneBud">
                If you need previously registered for a previous episode, you can use the button below to redo your submission.
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
              <a href="/event">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Event Page
              </a>
            </Button>
            

          </div>
        </div>
      </div>
    );
  }

  return (
    <BusinessClassRegistrationForm 
      editMode={editMode} 
      existingData={editMode ? existingRegistration : null} 
    />
  );
}