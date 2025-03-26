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
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emailTemplates = [
  {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    subject: 'Payment Reminder - HIPMI UI Networking Night',
    content: `
      <p>Dear {{name}},</p>
      <p>This is a friendly reminder that we haven't received your payment for the upcoming HIPMI UI Networking Night event.</p>
      <p>Event details:</p>
      <ul>
        <li><strong>Date:</strong> [Event Date]</li>
        <li><strong>Time:</strong> [Event Time]</li>
        <li><strong>Venue:</strong> [Event Venue]</li>
        <li><strong>Payment Amount:</strong> Rp {{paymentAmount}}</li>
      </ul>
      <p>Please complete your payment as soon as possible to secure your participation. You can upload your payment proof through your participant dashboard.</p>
      <p>If you've already made the payment, please disregard this message.</p>
      <p>Best regards,<br>HIPMI UI Team</p>
    `,
  },
  {
    id: 'payment-verification',
    name: 'Payment Verification',
    subject: 'Payment Verified - HIPMI UI Networking Night',
    content: `
      <p>Dear {{name}},</p>
      <p>We're pleased to confirm that your payment for the HIPMI UI Networking Night has been verified.</p>
      <p>Your registration is now complete, and we're looking forward to seeing you at the event!</p>
      <p>Event details:</p>
      <ul>
        <li><strong>Date:</strong> [Event Date]</li>
        <li><strong>Time:</strong> [Event Time]</li>
        <li><strong>Venue:</strong> [Event Venue]</li>
      </ul>
      <p>Please arrive 15 minutes early for registration. Don't forget to bring your ID card.</p>
      <p>Best regards,<br>HIPMI UI Team</p>
    `,
  },
  {
    id: 'custom',
    name: 'Custom Email',
    subject: '',
    content: '',
  }
];

const ParticipantDetailPage: React.FC = () => {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [participant, setParticipant] = useState<NetworkingParticipant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [paymentVerifyDialogOpen, setPaymentVerifyDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

useEffect(() => {
    const participantId = window.location.pathname.split('/').pop();
    if (participantId) {
        setIsRouterReady(true);
        fetchParticipant(participantId);
    }
}, []);

  const fetchParticipant = async (participantId: string) => {
    try {
      setLoading(true);
      const data = await networkingEventService.getParticipantByUserId(participantId);
      setParticipant(data);
      
      // Set payment status
      if (data?.paymentProofURL) {
        setPaymentStatus('VERIFIED');
      } else {
        setPaymentStatus('UNPAID');
      }
    } catch (error) {
      console.error('Failed to fetch participant:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participant data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!participant) return;
    
    try {
      // In a real implementation, this would update the payment status in the database
      // This is a mock implementation
      setPaymentStatus('VERIFIED');
      toast({
        title: 'Payment Verified',
        description: 'Payment has been marked as verified',
      });
      
      // Send verification email
      await sendPaymentVerificationEmail(participant);
      
      setPaymentVerifyDialogOpen(false);
    } catch (error) {
      console.error('Failed to verify payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify payment',
        variant: 'destructive',
      });
    }
  };

  const markPaymentAsUnpaid = async () => {
    if (!participant) return;
    
    try {
      // In a real implementation, this would update the payment status in the database
      // This is a mock implementation
      setPaymentStatus('UNPAID');
      toast({
        title: 'Payment Status Updated',
        description: 'Payment has been marked as unpaid',
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  const handleSendEmail = async (subject: string, content: string) => {
    if (!participant) return;

    try {
      // In a real implementation, this would call the email sending API
      // This is a mock implementation
      toast({
        title: 'Sending Email...',
      });
      
      // Wait for 1.5 seconds to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Email Sent',
        description: `Email sent to ${participant.name}`,
      });
      
      setEmailDialogOpen(false);
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteParticipant = async () => {
    if (!participant) return;
    
    try {
      // In a real implementation, this would delete the participant from the database
      // This is a mock implementation
      toast({
        title: 'Deleting Participant...',
      });
      
      // Wait for 1.5 seconds to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Participant Deleted',
        description: `${participant.name} has been deleted`,
      });
      
      // Navigate back to the participants list
      router.push('/admin/email/networking');
    } catch (error) {
      console.error('Failed to delete participant:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete participant',
        variant: 'destructive',
      });
    }
  };

  const handleSendPaymentReminder = async () => {
    if (!participant) return;
    
    try {
      toast({
        title: 'Sending Payment Reminder...',
      });
      
      await sendPaymentReminderEmail(participant);
      
      toast({
        title: 'Payment Reminder Sent',
        description: `Payment reminder sent to ${participant.name}`,
      });
    } catch (error) {
      console.error('Failed to send payment reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to send payment reminder',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy HH:mm');
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

  if (!isRouterReady || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto py-12 text-center">
          Loading participant data...
        </div>
      </div>
    );
  }

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
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEmailDialogOpen(true)}>
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </Button>
            
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Participant Details */}
          <div className="lg:col-span-2">
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
                        
                        {participant.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 flex items-center">
                              <Building className="mr-2 h-4 w-4" /> HIPMI PT Origin
                            </label>
                            <p className="mt-1">{participant.hipmiPtOrigin || 'N/A'}</p>
                          </div>
                        )}
                        
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
                          {participant.expectations ? (
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
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <div className="mt-1">
                          <div className="p-3 bg-gray-50 rounded-md text-gray-600 text-sm min-h-[100px]">
                            No admin notes available.
                          </div>
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
                          
                          {participant.business?.socialMedia && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Social Media</label>
                              <div className="mt-1">
                                <p className="text-blue-600">{participant.business.socialMedia}</p>
                              </div>
                            </div>
                          )}
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
                        
                        <div className="flex gap-2">
                          {paymentStatus === 'VERIFIED' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={markPaymentAsUnpaid}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Mark as Unpaid
                            </Button>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSendPaymentReminder}
                              >
                                <Mail className="mr-2 h-4 w-4" /> Send Reminder
                              </Button>
                              
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => setPaymentVerifyDialogOpen(true)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" /> Verify Payment
                              </Button>
                            </>
                          )}
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
          
          {/* Right Column: Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline" onClick={() => setEmailDialogOpen(true)}>
                  <Mail className="mr-2 h-4 w-4" /> Send Email
                </Button>
                
                {paymentStatus !== 'VERIFIED' && (
                  <Button className="w-full" variant="outline" onClick={handleSendPaymentReminder}>
                    <AlertCircle className="mr-2 h-4 w-4" /> Send Payment Reminder
                  </Button>
                )}
                
                <Button className="w-full" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete Participant
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-3">
                  <div className="flex">
                    <div className="mr-3 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-600">Registration created</p>
                      <time className="text-xs text-gray-400">{formatDate(participant.registrationDate)}</time>
                    </div>
                  </div>
                  
                  {participant.paymentProofURL && (
                    <div className="flex">
                      <div className="mr-3 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <div>
                        <p className="text-gray-600">Payment proof uploaded</p>
                        <time className="text-xs text-gray-400">{formatDate(participant.paymentDate)}</time>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Send Email to {participant.name}</DialogTitle>
            <DialogDescription>
              Compose an email to send directly to this participant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="space-y-4">
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Email subject"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email-content">Message</Label>
                  <Textarea
                    id="email-content"
                    placeholder="Write your message here..."
                    className="mt-1 min-h-[200px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {emailTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <CardHeader className="py-4">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <p className="text-sm font-medium">{template.subject}</p>
                        <div className="mt-2 text-xs text-gray-500 line-clamp-3">
                          {template.content.replace(/<[^>]*>/g, ' ')}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end py-2">
                        <Button size="sm" variant="outline">
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSendEmail("Sample Subject", "Sample Content")}>
              <Send className="mr-2 h-4 w-4" /> Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Participant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this participant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Warning</p>
                <p>Deleting this participant will remove all their registration data, payment information, and participation history.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteParticipant}>
              <Trash className="mr-2 h-4 w-4" /> Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Verification Dialog */}
      <Dialog open={paymentVerifyDialogOpen} onOpenChange={setPaymentVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Mark this participant's payment as verified.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
              <p className="text-sm text-blue-800">
                Verifying payment will:
              </p>
              <ul className="text-sm text-blue-800 list-disc pl-5 mt-2">
              <li>Update this participant's status to 'Verified'</li>
                <li>Send a confirmation email to the participant</li>
                <li>Include them in the confirmed attendees list</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-reference">Payment Reference (Optional)</Label>
                <Input
                  id="payment-reference"
                  placeholder="Enter payment reference number"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Add any additional notes about this payment"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={verifyPayment}>
              <CheckCircle className="mr-2 h-4 w-4" /> Verify Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipantDetailPage;
