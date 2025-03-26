'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { businessClassService } from '@/lib/firebase/businessClassService';
import AdminNavbar from '@/components/admin/NavbarAdmin';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  ParticipantLevel, 
  InformationSource, 
  BusinessClassParticipant 
} from '@/models/BusinessClassParticipant';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Mail, 
  Download, 
  Eye, 
  FileCheck, 
  Send,
  Calendar,
  Smartphone,
  User,
  Briefcase,
  Building,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { use } from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

const isFirestoreTimestamp = (value: any): value is FirestoreTimestamp => {
  return value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value;
};

const convertTimestampToDate = (timestamp: FirestoreTimestamp | Date | null | undefined) => {
  if (!timestamp) return undefined;
  
  if (isFirestoreTimestamp(timestamp)) {
    return new Date(timestamp.seconds * 1000);
  }
  
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Try to convert unknown format as fallback
  try {
    return new Date(timestamp as any);
  } catch (e) {
    console.error("Error converting timestamp to date:", e);
    return undefined;
  }
};

const formatDate = (date: Date | FirestoreTimestamp | null | undefined) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : convertTimestampToDate(date);
  
  if (!dateObj) return 'Invalid Date';
  
  try {
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const ParticipantDetailPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [participant, setParticipant] = useState<BusinessClassParticipant | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const { toast } = useToast();
  const { loading, user, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    const participantId = resolvedParams.id;
    if (participantId) {
      fetchParticipant(participantId);
    } else {
      setError("Participant ID not found");
      setLoadingPage(false);
    }
  }, [user, isAdmin, router, resolvedParams.id, loading]);

  const fetchParticipant = async (participantId: string) => {
    try {
      setLoadingPage(true);
      console.log('Fetching participant with ID:', participantId);
      const data = await businessClassService.getParticipantById(participantId);
      
      if (!data) {
        throw new Error('Participant not found');
      }

      console.log('Participant data received:', data);
      
      const processedData: BusinessClassParticipant = {
        ...data,
        id: participantId,
        name: data.name || '',
        email: data.email || '',
        institution: data.institution || '',
        participantLevel: data.participantLevel || ParticipantLevel.BEGINNER,
        reasonForJoining: data.reasonForJoining || '',
        informationSource: data.informationSource || InformationSource.INSTAGRAM,
        socialMediaProofURL: data.socialMediaProofURL || undefined,
        registrationDate: convertTimestampToDate(data.registrationDate as any) || new Date(),
        createdAt: convertTimestampToDate(data.createdAt as any) || new Date(),
        updatedAt: convertTimestampToDate(data.updatedAt as any)
      };
      
      setParticipant(processedData);
    } catch (error) {
      console.error('Failed to fetch participant:', error);
      setError('Failed to load participant data: ' + (error instanceof Error ? error.message : String(error)));
      toast({
        title: 'Error',
        description: 'Failed to load participant data',
        variant: 'destructive',
      });
    } finally {
      setLoadingPage(false);
    }
  };

  const handleSendEmail = async () => {
    if (!participant) return;
    
    if (!emailSubject.trim()) {
      toast({
        title: 'Error',
        description: 'Email subject is required',
        variant: 'destructive',
      });
      return;
    }

    if (!emailContent.trim()) {
      toast({
        title: 'Error',
        description: 'Email content is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSendingEmail(true);
      
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: participant.email,
          subject: emailSubject,
          html: emailContent,
        }),
      });

      toast({
        title: 'Success',
        description: `Email sent to ${participant.name}`,
      });

      setEmailDialogOpen(false);
      setEmailSubject('');
      setEmailContent('');
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Debugging view - Shows when we have an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto py-8">
          <Button variant="outline" onClick={() => router.push('/admin/email/businesscaseclass')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Participants
          </Button>
          
          <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 mb-4">
            <h2 className="font-bold mb-2">Error Loading Participant</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loadingPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto py-12 text-center">
          Loading participant data...
        </div>
      </div>
    );
  }

  // No participant found
  if (!participant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Participant Not Found</h2>
          <p className="mb-6">The participant you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push('/admin/email/businesscaseclass')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Participants
          </Button>
        </div>
      </div>
    );
  }

  // Participant detail view
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" onClick={() => router.push('/admin/email/businesscaseclass')} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Business Class Participant Details</h1>
          </div>
          <Button variant="outline" onClick={() => setEmailDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" /> Send Email
          </Button>
        </div>
        
        <div className="grid grid-cols-1">
          {/* Participant Details Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-gray-500" />
                    {participant.name}
                  </div>
                  <Badge
                    variant={participant.participantLevel === ParticipantLevel.BEGINNER ? "secondary" : "default"}
                  >
                    {participant.participantLevel === ParticipantLevel.BEGINNER ? 'Beginner' : 'Advanced'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Registered on {formatDate(participant.registrationDate)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="personal">Personal Details</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </label>
                          <p className="mt-1">{participant.email}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <GraduationCap className="mr-2 h-4 w-4" /> Institution
                          </label>
                          <p className="mt-1">{participant.institution}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> Registration Date
                          </label>
                          <p className="mt-1">{formatDate(participant.registrationDate)}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preferences">
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Information Source</label>
                        <p className="mt-1">{participant.informationSource}</p>
                        {participant.informationSource === InformationSource.OTHER && participant.otherInformationSource && (
                          <div className="mt-2">
                            <label className="text-sm font-medium text-gray-500">Specified Source</label>
                            <p className="mt-1">{participant.otherInformationSource}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reason for Joining</label>
                        <div className="mt-1">
                          <div className="p-3 bg-gray-50 rounded-md text-gray-600 text-sm min-h-[100px]">
                            {participant.reasonForJoining || 'No reason provided.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documentation">
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Social Media Proof</label>
                        <div className="mt-2">
                          {participant.socialMediaProofURL ? (
                            <div className="border rounded-md overflow-hidden">
                              <div className="bg-gray-50 p-2 flex justify-between items-center border-b">
                                <span className="text-sm font-medium">Social Media Proof</span>
                                <a 
                                  href={participant.socialMediaProofURL} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm flex items-center"
                                >
                                  <Download className="h-3 w-3 mr-1" /> Download
                                </a>
                              </div>
                              
                              <div className="p-4 text-center">
                                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">ZIP file with social media proof</p>
                                <a 
                                  href={participant.socialMediaProofURL}
                                  target="_blank"
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                >
                                  View File
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-md border border-dashed">
                              <FileCheck className="h-12 w-12 text-gray-300 mb-4" />
                              <h3 className="text-base font-medium text-gray-700 mb-2">No Proof Uploaded</h3>
                              <p className="text-gray-500 max-w-sm text-sm">
                                The participant has not uploaded social media proof yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button at bottom */}
        <div className="container mx-auto py-4 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/email/businesscaseclass')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Participants List
          </Button>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to {participant.name}</DialogTitle>
            <DialogDescription>
              This email will be sent to {participant.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emailSubject">Subject</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailContent">Content</Label>
              <Textarea
                id="emailContent"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Email content"
                className="min-h-[200px]"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>You can use HTML formatting in your email.</p>
              <p className="mt-1">The email will be sent to: {participant.email}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail}
              className="flex items-center"
              disabled={sendingEmail}
            >
              {sendingEmail ? (
                <>
                  Sending...
                </>
              ) : (
                <>
                  Send Email
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipantDetailPage;
