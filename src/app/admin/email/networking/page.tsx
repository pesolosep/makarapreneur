'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { networkingEventAdminService } from '@/lib/firebase/networkNightService';
import AdminNavbar from '@/components/admin/NavbarAdmin';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NetworkingParticipant, MembershipStatus } from '@/models/NetworkParticipant';

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';

import { 
  DownloadIcon, 
  FilterIcon, 
  MailIcon, 
  MoreHorizontal, 
  RefreshCcw, 
  Trash2,
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo, 
  Link as LinkIcon, 
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the filter options interface
interface FilterOptions {
  searchTerm: string;
  membershipStatus: string;
  paymentStatus: string;
  hasBusinessOnly: boolean;
  position: string;
  origin: string;
}

// Define email template interface
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const NetworkingParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<NetworkingParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    membershipStatus: '',
    paymentStatus: '',
    hasBusinessOnly: false,
    position: '',
    origin: '',
  });
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailTemplateType, setEmailTemplateType] = useState<string>('custom');
  const [emailError, setEmailError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Set up TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2]
      }),
      BulletList,
      OrderedList,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
  });

  // Email templates
  const emailTemplates: EmailTemplate[] = [
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
      id: 'event-confirmation',
      name: 'Event Confirmation',
      subject: 'Confirmation - HIPMI UI Networking Night',
      content: `
        <p>Dear {{name}},</p>
        <p>We're pleased to confirm your registration for the HIPMI UI Networking Night event!</p>
        <p><strong>Event details:</strong></p>
        <ul>
          <li><strong>Date:</strong> [Event Date]</li>
          <li><strong>Time:</strong> [Event Time]</li>
          <li><strong>Venue:</strong> [Event Venue]</li>
        </ul>
        <p>Please arrive 15-30 minutes early for registration. Don't forget to bring your ID card and show this email confirmation.</p>
        <p>We look forward to seeing you at the event!</p>
        <p>Best regards,<br>HIPMI UI Team</p>
      `,
    },
    {
      id: 'schedule-change',
      name: 'Schedule Change',
      subject: 'Important: Schedule Change - HIPMI UI Networking Night',
      content: `
        <p>Dear {{name}},</p>
        <p>We're writing to inform you about a change in the schedule for the upcoming HIPMI UI Networking Night event.</p>
        <p><strong>Updated event details:</strong></p>
        <ul>
          <li><strong>New Date:</strong> [New Event Date]</li>
          <li><strong>New Time:</strong> [New Event Time]</li>
          <li><strong>Venue:</strong> [Event Venue] (unchanged)</li>
        </ul>
        <p>We apologize for any inconvenience this change may cause. If you're unable to attend due to this schedule change, please let us know.</p>
        <p>Thank you for your understanding.</p>
        <p>Best regards,<br>HIPMI UI Team</p>
      `,
    }
  ];

  useEffect(() => {
    fetchParticipants();
  }, []);

  useEffect(() => {
    // Update selected participants when tab changes
    setSelectedParticipants([]);
    setSelectAll(false);
  }, [activeTab]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const data = await networkingEventAdminService.getAllParticipants();
      setParticipants(data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participants data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleParticipantSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants(prev => [...prev, id]);
    } else {
      setSelectedParticipants(prev => prev.filter(participantId => participantId !== id));
      setSelectAll(false);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      membershipStatus: '',
      paymentStatus: '',
      hasBusinessOnly: false,
      position: '',
      origin: '',
    });
  };

  // Filter participants based on current filters and active tab
  const getFilteredParticipants = () => {
    return participants.filter(participant => {
      // First apply tab filter
      if (activeTab === 'paid' && !participant.paymentProofURL) {
        return false;
      }
      
      if (activeTab === 'unpaid' && participant.paymentProofURL) {
        return false;
      }

      // Then apply detailed filters
      // Search term filter
      const searchMatch = !filters.searchTerm || 
        participant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        participant.whatsappNumber.includes(filters.searchTerm) ||
        (participant.hipmiPtOrigin && participant.hipmiPtOrigin.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (participant.business?.name && participant.business.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      // Membership status filter
      const membershipMatch = !filters.membershipStatus || participant.membershipStatus === filters.membershipStatus;

      // Payment status filter
      const paymentMatch = !filters.paymentStatus || 
        (filters.paymentStatus === 'PAID' && participant.paymentProofURL) ||
        (filters.paymentStatus === 'UNPAID' && !participant.paymentProofURL);

      // Business filter
      const businessMatch = !filters.hasBusinessOnly || participant.hasBusiness;

      // Position filter
      const positionMatch = !filters.position || participant.position === filters.position;

      // Origin filter (only applicable for NON_FUNGSIONARIS)
      const originMatch = !filters.origin || 
        (participant.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && 
         participant.hipmiPtOrigin === filters.origin);

      return searchMatch && membershipMatch && paymentMatch && businessMatch && positionMatch && originMatch;
    });
  };

  const filteredParticipants = getFilteredParticipants();

  const exportToCSV = () => {
    try {
      const headers = [
        'Name', 
        'WhatsApp', 
        'Membership Status', 
        'Position', 
        'HIPMI PT Origin', 
        'Has Business', 
        'Business Name', 
        'Business Field', 
        'Registration Date'
      ];
      
      // Prepare CSV content
      let csvContent = headers.join(',') + '\n';
      
      filteredParticipants.forEach(participant => {
        const row = [
          `"${participant.name || ''}"`,
          `"${participant.whatsappNumber || ''}"`,
          `"${participant.membershipStatus === MembershipStatus.FUNGSIONARIS ? 'Fungsionaris' : 'Non-Fungsionaris'}"`,
          `"${participant.position || ''}"`,
          `"${participant.hipmiPtOrigin || ''}"`,
          participant.hasBusiness ? 'Yes' : 'No',
          `"${participant.business?.name || ''}"`,
          `"${participant.business?.field || ''}"`,
          participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : ''
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `networking_participants_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Successful',
        description: `Exported ${filteredParticipants.length} participants to CSV`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      // In a real implementation, you'd call an API endpoint to delete participants
      // This is just a mock implementation
      toast({
        title: 'Deleting participants...',
        description: `Deleting ${selectedParticipants.length} participants`,
      });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove deleted participants from state
      setParticipants(prev => 
        prev.filter(p => !selectedParticipants.includes(p.id))
      );
      
      toast({
        title: 'Success',
        description: `${selectedParticipants.length} participants deleted`,
      });
      
      // Reset selected participants
      setSelectedParticipants([]);
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete participants:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete participants',
        variant: 'destructive',
      });
    }
  };

  const handleSendEmails = async () => {
    if (!emailSubject.trim()) {
      setEmailError('Email subject is required');
      return;
    }

    if (!editor?.getHTML() || editor.getHTML() === '<p></p>') {
      setEmailError('Email content is required');
      return;
    }

    if (selectedParticipants.length === 0) {
      setEmailError('Please select at least one participant');
      return;
    }

    try {
      setEmailError(null);
      setSendingEmail(true);
      
      toast({
        title: 'Sending emails...',
        description: `Sending to ${selectedParticipants.length} participants`,
      });

      // Get selected participants' data
      const selectedParticipantsData = participants.filter(p => selectedParticipants.includes(p.id));
      
      // Send emails to each participant
      for (const participant of selectedParticipantsData) {
        let emailContent = editor.getHTML();
        
        // Replace variables in the content
        emailContent = emailContent
          .replace(/{{name}}/g, participant.name)
          .replace(/{{whatsappNumber}}/g, participant.whatsappNumber)
          .replace(/{{businessName}}/g, participant.business?.name || '')
          .replace(/{{registrationDate}}/g, participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : '')
          .replace(/{{membershipStatus}}/g, participant.membershipStatus === MembershipStatus.FUNGSIONARIS ? 'Fungsionaris' : 'Non-Fungsionaris');

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
      }

      toast({
        title: 'Success',
        description: `Emails sent to ${selectedParticipants.length} participants`,
      });

      // Close dialog and reset
      setEmailDialogOpen(false);
      setEmailSubject('');
      editor?.commands.setContent('');
    } catch (error) {
      console.error('Failed to send emails:', error);
      toast({
        title: 'Error',
        description: 'Failed to send emails',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const applyEmailTemplate = (templateType: string) => {
    setEmailTemplateType(templateType);
    
    // Find the selected template
    const template = emailTemplates.find(t => t.id === templateType);
    
    if (template) {
      setEmailSubject(template.subject);
      editor?.commands.setContent(template.content);
    } else {
      // Reset for custom emails
      setEmailSubject('');
      editor?.commands.setContent('');
    }
  };

  const insertVariable = (variable: string) => {
    editor?.commands.insertContent(`{{${variable}}}`);
    editor?.commands.focus();
  };

  // Calculate statistics for the dashboard
  const totalParticipants = participants.length;
  const fungsionarisCount = participants.filter(p => p.membershipStatus === MembershipStatus.FUNGSIONARIS).length;
  const nonFungsionarisCount = participants.filter(p => p.membershipStatus === MembershipStatus.NON_FUNGSIONARIS).length;
  const businessOwners = participants.filter(p => p.hasBusiness).length;

  // Get unique HIPMI PT origins for the filter dropdown
  const uniqueOrigins = Array.from(
    new Set(
      participants
        .filter(p => p.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && p.hipmiPtOrigin)
        .map(p => p.hipmiPtOrigin)
    )
  );

  // Get unique positions for the filter dropdown
  const uniquePositions = Array.from(
    new Set(
      participants
        .filter(p => p.position)
        .map(p => p.position)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container mx-auto py-8">
      <div className="py-8"></div>
      <div className="py-8"></div>
        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center py-8">
              <div>
                <CardTitle>Networking Event Participants</CardTitle>
                <CardDescription>Manage all networking event participants</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchParticipants}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                
                <Button 
                  onClick={exportToCSV} 
                  variant="outline"
                  size="sm"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                
                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <Button 
                    disabled={selectedParticipants.length === 0}
                    variant="default"
                    size="sm"
                    onClick={() => setEmailDialogOpen(true)}
                  >
                    <MailIcon className="h-4 w-4 mr-2" />
                    Email ({selectedParticipants.length})
                  </Button>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Send Email to Participants</DialogTitle>
                      <DialogDescription>
                        Send an email to {selectedParticipants.length} selected participants
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <Tabs defaultValue="editor" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="editor">Editor</TabsTrigger>
                          <TabsTrigger value="templates">Templates</TabsTrigger>
                          <TabsTrigger value="variables">Variables</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="editor" className="space-y-4">
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
                            <Label>Email Content</Label>
                            <div className="border rounded-md">
                              <div className="flex flex-wrap gap-1 p-1 border-b">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().toggleBold().run()}
                                  className={editor?.isActive('bold') ? 'bg-slate-200' : ''}
                                >
                                  <BoldIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                                  className={editor?.isActive('italic') ? 'bg-slate-200' : ''}
                                >
                                  <ItalicIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                  className={editor?.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}
                                >
                                  <Heading1 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                  className={editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
                                >
                                  <Heading2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                  className={editor?.isActive('bulletList') ? 'bg-slate-200' : ''}
                                >
                                  <List className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                  className={editor?.isActive('orderedList') ? 'bg-slate-200' : ''}
                                >
                                  <ListOrdered className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const url = window.prompt('URL');
                                    if (url) {
                                      editor?.chain().focus().setLink({ href: url }).run();
                                    }
                                  }}
                                  className={editor?.isActive('link') ? 'bg-slate-200' : ''}
                                >
                                  <LinkIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().undo().run()}
                                  disabled={!editor?.can().undo()}
                                >
                                  <Undo className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editor?.chain().focus().redo().run()}
                                  disabled={!editor?.can().redo()}
                                >
                                  <Redo className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="p-4 bg-white min-h-[200px]">
                                <EditorContent editor={editor} />
                              </div>
                            </div>
                          </div>
                          
                          {emailError && (
                            <Alert variant="destructive">
                              <AlertDescription>{emailError}</AlertDescription>
                            </Alert>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="templates" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {emailTemplates.map((template) => (
                              <Card key={template.id} 
                                className={`cursor-pointer hover:shadow-md ${template.id === emailTemplateType ? 'border-primary' : ''}`}
                                onClick={() => applyEmailTemplate(template.id)}
                              >
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm font-medium">{template.subject}</p>
                                  <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                                    {template.content.replace(/<[^>]*>/g, ' ')}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          
                          <div className="text-center text-sm text-gray-500 mt-4">
                            Click on a template to use it in your email.
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="variables" className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" onClick={() => insertVariable('name')}>
                              Insert Name
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('whatsappNumber')}>
                              Insert WhatsApp
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('businessName')}>
                              Insert Business Name
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('registrationDate')}>
                              Insert Registration Date
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('paymentAmount')}>
                              Insert Payment Amount
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('membershipStatus')}>
                              Insert Membership Status
                            </Button>
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-500">
                            <p>Variables will be replaced with actual participant data when the email is sent.</p>
                            <p className="mt-2">Example: Hello {'{{name}}'}, thank you for registering!</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSendEmails}
                        className="flex items-center"
                        disabled={sendingEmail}
                      >
                        {sendingEmail ? (
                          <>
                            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      disabled={selectedParticipants.length === 0}
                      onClick={() => setBulkDeleteDialogOpen(true)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All Participants
                  <Badge variant="outline" className="ml-2 rounded-full py-0 px-2">{participants.length}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                {/* Filters */}
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <h3 className="font-medium">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="searchTerm" className="text-xs">Search</Label>
                        <Input
                          id="searchTerm"
                          placeholder="Search by name, WhatsApp, or business"
                          value={filters.searchTerm}
                          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="membershipStatus" className="text-xs">Membership</Label>
                        <Select 
                          value={filters.membershipStatus || "all"} 
                          onValueChange={(value) => handleFilterChange('membershipStatus', value === "all" ? "" : value)}
                        >
                          <SelectTrigger id="membershipStatus">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value={MembershipStatus.FUNGSIONARIS}>Fungsionaris</SelectItem>
                            <SelectItem value={MembershipStatus.NON_FUNGSIONARIS}>Non-Fungsionaris</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="position" className="text-xs">Position</Label>
                        <Select 
                          value={filters.position || "all"} 
                          onValueChange={(value) => handleFilterChange('position', value === "all" ? "" : value)}
                        >
                          <SelectTrigger id="position">
                            <SelectValue placeholder="All Positions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Positions</SelectItem>
                            {uniquePositions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {filters.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && (
                        <div>
                          <Label htmlFor="origin" className="text-xs">HIPMI PT Origin</Label>
                          <Select 
                            value={filters.origin || "all"} 
                            onValueChange={(value) => handleFilterChange('origin', value === "all" ? "" : value)}
                          >
                            <SelectTrigger id="origin">
                              <SelectValue placeholder="All Origins" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Origins</SelectItem>
                              {uniqueOrigins.filter((origin): origin is string => typeof origin === 'string').map((origin) => (
                                <SelectItem key={origin} value={origin}>
                                  {origin}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hasBusinessOnly" 
                          checked={filters.hasBusinessOnly}
                          onCheckedChange={(checked) => 
                            handleFilterChange('hasBusinessOnly', checked === true)
                          }
                        />
                        <Label htmlFor="hasBusinessOnly">Has Business Only</Label>
                      </div>
                      
                      <div className="md:col-span-3 flex justify-end">
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Participants Table */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={
                              filteredParticipants.length > 0 && 
                              selectedParticipants.length === filteredParticipants.length
                            }
                            onCheckedChange={handleSelectAllChange}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-10">
                            Loading participants...
                          </TableCell>
                        </TableRow>
                      ) : filteredParticipants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-10">
                            No participants found. Try adjusting your filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParticipants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedParticipants.includes(participant.id)}
                                onCheckedChange={(checked) => 
                                  handleParticipantSelect(participant.id, checked === true)
                                }
                              />
                            </TableCell>
                            <TableCell className="font-medium">{participant.name}</TableCell>
                            <TableCell>{participant.whatsappNumber}</TableCell>
                            <TableCell>
                              <Badge variant={participant.membershipStatus === MembershipStatus.FUNGSIONARIS ? "default" : "secondary"}>
                                {participant.membershipStatus === MembershipStatus.FUNGSIONARIS 
                                  ? 'Fungsionaris' 
                                  : 'Non-Fungsionaris'}
                              </Badge>
                            </TableCell>
                            <TableCell>{participant.position}</TableCell>
                            <TableCell>
                              {participant.membershipStatus === MembershipStatus.NON_FUNGSIONARIS 
                                ? participant.hipmiPtOrigin 
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {participant.hasBusiness ? (
                                <Badge variant="outline" className="bg-green-50 hover:bg-green-100" title={participant.business?.name || 'Has Business'}>
                                  {participant.business?.name 
                                    ? (participant.business.name.length > 15 
                                        ? participant.business.name.substring(0, 12) + '...' 
                                        : participant.business.name)
                                    : 'Yes'}
                                </Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/email/networking/${participant.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    Showing {filteredParticipants.length} of {participants.length} participants
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">Selected: {selectedParticipants.length}</span>
                    {selectedParticipants.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedParticipants([])}>
                        Clear Selection
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedParticipants.length} participants? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              This will permanently remove the selected participants from the system, including all their registration data and payment information.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedParticipants.length} Participants
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkingParticipantsPage;