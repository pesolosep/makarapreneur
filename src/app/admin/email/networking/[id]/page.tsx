'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { networkingEventAdminService, networkingEventService } from '@/lib/firebase/networkNightService';
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
import { NetworkingParticipant, MembershipStatus } from '@/models/NetworkParticipant';
import { sendPaymentVerificationEmail, sendPaymentReminderEmail } from '@/lib/emailUtils';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Mail, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Edit, 
  Trash, 
  FileCheck, 
  Send,
  Calendar,
  Clock,
  Smartphone,
  User,
  Briefcase,
  Building,
  Tag,
  Eye,
  RefreshCcw
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
  return undefined;
};

const ParticipantDetailPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [participant, setParticipant] = useState<NetworkingParticipant | null>(null);
  const [loadingPage, setloadingPage] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [paymentVerifyDialogOpen, setPaymentVerifyDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { loading, user, isAdmin } = useAuth();

  useEffect(() => {
    if(loading){
      return;
    }
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    const participantId = resolvedParams.id;
    if (participantId) {
      setIsRouterReady(true);
      fetchParticipant(participantId);
    } else {
      setError("Participant ID not found");
      setloadingPage(false);
    }
  }, [user, isAdmin, router, resolvedParams.id]);

  const fetchParticipant = async (participantId: string) => {
    try {
      setloadingPage(true);
      console.log('Fetching participant with ID:', participantId);
      const data = await networkingEventService.getParticipantById(participantId);
      
      if (!data) {
        throw new Error('Participant not found');
      }

      console.log('Participant data received');
      
      const processedData: NetworkingParticipant = {
        ...data,
        id: participantId,
        name: data.name || '',
        email: data.email || '',
        whatsappNumber: data.whatsappNumber || '',
        position: data.position || 'ANGGOTA',
        membershipStatus: data.membershipStatus || MembershipStatus.NON_FUNGSIONARIS,
        expectations: Array.isArray(data.expectations) ? data.expectations : [],
        hasBusiness: Boolean(data.hasBusiness),
        business: data.business || undefined,
        paymentProofURL: data.paymentProofURL || undefined,
        hipmiPtOrigin: data.hipmiPtOrigin || undefined,
        registrationDate: convertTimestampToDate(data.registrationDate) || new Date(),
        paymentDate: convertTimestampToDate(data.paymentDate),
        paymentAmount: data.paymentAmount || 0,
        createdAt: convertTimestampToDate(data.createdAt) || new Date(),
        updatedAt: convertTimestampToDate(data.updatedAt)
      };
      
      setParticipant(processedData);
      
      // Set initial payment status based on payment proof
      if (processedData.paymentProofURL) {
        setPaymentStatus('VERIFIED');
      } else {
        setPaymentStatus('UNPAID');
      }
    } catch (error) {
      console.error('Failed to fetch participant:', error);
      setError('Failed to load participant data: ' + (error instanceof Error ? error.message : String(error)));
      toast({
        title: 'Error',
        description: 'Failed to load participant data',
        variant: 'destructive',
      });
    } finally {
      setloadingPage(false);
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatPosition = (position: string) => {
    switch (position) {
      case 'PENGURUS_INTI':
        return 'Pengurus Inti';
      case 'KEPALA_WAKIL_KEPALA_BIDANG':
        return 'Kepala/Wakil Kepala Bidang';
      case 'STAF':
        return 'Staf';
      case 'ANGGOTA':
        return 'Anggota';
      default:
        return position;
    }
  };

  // Debugging view - Shows when we have an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto py-8">
          <Button variant="outline" onClick={() => router.push('/admin/email/networking')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Participants
          </Button>
          
          <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 mb-4">
            <h2 className="font-bold mb-2">Error loadingPage Participant</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // loadingPage state
  if (!isRouterReady || loadingPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto py-12 text-center">
          loadingPage participant data...
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
          <Button onClick={() => router.push('/admin/email/networking')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Participants
          </Button>
        </div>
      </div>
    );
  }

  // Simplified participant view (can be expanded later)
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" onClick={() => router.push('/admin/email/networking')} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Participant Details</h1>
          </div>
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
                    variant={participant.membershipStatus === MembershipStatus.FUNGSIONARIS ? "default" : "secondary"}
                  >
                    {participant.membershipStatus === MembershipStatus.FUNGSIONARIS ? 'Fungsionaris' : 'Non-Fungsionaris'}
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
                    <TabsTrigger value="business">Business Info</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <Smartphone className="mr-2 h-4 w-4" /> WhatsApp Number
                          </label>
                          <p className="mt-1">{participant.whatsappNumber}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <Tag className="mr-2 h-4 w-4" /> Position
                          </label>
                          <p className="mt-1">{formatPosition(participant.position)}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </label>
                          <p className="mt-1">{participant.email}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> Registration Date
                          </label>
                          <p className="mt-1">{formatDate(participant.registrationDate)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Expectations</label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {participant.expectations && participant.expectations.length > 0 ? (
                            participant.expectations.map((expectation, index) => (
                              <Badge key={index} variant="outline">
                                {expectation}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">No expectations specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="business">
                    <div className="space-y-6">
                      {participant.hasBusiness ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 flex items-center">
                                <Briefcase className="mr-2 h-4 w-4" /> Business Name
                              </label>
                              <p className="mt-1">{participant.business?.name || 'N/A'}</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-500 flex items-center">
                                <Tag className="mr-2 h-4 w-4" /> Business Field
                              </label>
                              <p className="mt-1">{participant.business?.field || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Business Description</label>
                            <div className="mt-1">
                              <div className="p-3 bg-gray-50 rounded-md text-gray-600 text-sm min-h-[100px]">
                                {participant.business?.description || 'No business description available.'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No Business Information</h3>
                          <p className="text-gray-500 max-w-sm">
                            This participant has indicated they do not have a business.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Payment Status</label>
                          <div className="mt-1 flex items-center">
                            {paymentStatus === 'VERIFIED' ? (
                              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Unpaid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Amount</label>
                        <p className="mt-1 text-lg font-medium">
                          Rp {participant.paymentAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      
                      {participant.paymentDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Payment Date</label>
                          <p className="mt-1">{formatDate(participant.paymentDate)}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Proof</label>
                        <div className="mt-2">
                          {participant.paymentProofURL ? (
                            <div className="border rounded-md overflow-hidden">
                              <div className="bg-gray-50 p-2 flex justify-between items-center border-b">
                                <span className="text-sm font-medium">Payment Receipt</span>
                                <a 
                                  href={participant.paymentProofURL} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm flex items-center"
                                >
                                  <Download className="h-3 w-3 mr-1" /> Download
                                </a>
                              </div>
                              
                              {participant.paymentProofURL.toLowerCase().endsWith('.pdf') ? (
                                <div className="p-4 text-center">
                                  <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500">PDF document</p>
                                  <a 
                                    href={participant.paymentProofURL}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                  >
                                    View PDF
                                  </a>
                                </div>
                              ) : (
                                <div className="p-2">
                                  <div className="aspect-video relative bg-gray-100 rounded overflow-hidden">
                                    <Image
                                      src={participant.paymentProofURL}
                                      alt="Payment proof"
                                      fill
                                      style={{ objectFit: 'contain' }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-md border border-dashed">
                              <FileCheck className="h-12 w-12 text-gray-300 mb-4" />
                              <h3 className="text-base font-medium text-gray-700 mb-2">No Payment Proof Uploaded</h3>
                              <p className="text-gray-500 max-w-sm text-sm">
                                The participant has not uploaded payment proof yet.
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
            onClick={() => router.push('/admin/email/networking')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Participants List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetailPage;
