'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { businessClassAdminService } from '@/lib/firebase/businessClassService';
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
import { 
  ParticipantLevel, 
  InformationSource, 
  BusinessClassParticipant 
} from '@/models/BusinessClassParticipant';

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
import { useAuth } from '@/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';

// Define the filter options interface
interface FilterOptions {
  searchTerm: string;
  participantLevel: string;
  informationSource: string;
  otherInformationSource: string;
}

// Define email template interface
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

// Helper function to convert Firestore Timestamp to Date
const convertTimestampToDate = (value: Date | Timestamp | null | undefined): Date | null => {
  if (!value) return null;
  
  // If it's already a Date object
  if (value instanceof Date) return value;
  
  // If it's a Firestore Timestamp object
  if (typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
    return new Date((value as Timestamp).seconds * 1000);
  }
  
  // Try to convert other formats as a fallback
  try {
    return new Date(value as any);
  } catch (e) {
    console.error("Error converting to date:", e);
    return null;
  }
};

const BusinessClassParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<BusinessClassParticipant[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    participantLevel: '',
    informationSource: '',
    otherInformationSource: ''
  });
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailTemplateType, setEmailTemplateType] = useState<string>('custom');
  const [emailError, setEmailError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { loading, user, isAdmin } = useAuth();
  
  useEffect(() => {
    if(loading){
      return;
    }
    if (!isAdmin) {
      router.push('/');
      return;
    }
  }, [user, isAdmin, router]);
  
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
      id: 'welcome-template',
      name: 'Welcome to Business Class',
      subject: 'Welcome to HIPMI UI Business Class!',
      content: `
        <p>Dear {{name}},</p>
        <p>Welcome to HIPMI UI Business Class! We're excited to have you join our community of entrepreneurs.</p>
        <p>Event details:</p>
        <ul>
          <li><strong>Date:</strong> [Event Date]</li>
          <li><strong>Time:</strong> [Event Time]</li>
          <li><strong>Venue:</strong> [Event Venue]</li>
        </ul>
        <p>As a {{participantLevel}} level participant, you'll have access to all our resources tailored for your experience level.</p>
        <p>Feel free to reach out if you have any questions!</p>
        <p>Best regards,<br>HIPMI UI Business Class Team</p>
      `,
    },
    {
      id: 'event-reminder',
      name: 'Event Reminder',
      subject: 'Reminder: HIPMI UI Business Class Session',
      content: `
        <p>Dear {{name}},</p>
        <p>This is a friendly reminder about our upcoming HIPMI UI Business Class session:</p>
        <p><strong>Session details:</strong></p>
        <ul>
          <li><strong>Date:</strong> [Event Date]</li>
          <li><strong>Time:</strong> [Event Time]</li>
          <li><strong>Venue:</strong> [Event Venue]</li>
          <li><strong>Topic:</strong> [Session Topic]</li>
        </ul>
        <p>Please arrive 15 minutes early for registration. Don't forget to bring your laptop and business materials if required.</p>
        <p>We look forward to seeing you at the session!</p>
        <p>Best regards,<br>HIPMI UI Business Class Team</p>
      `,
    },
    {
      id: 'schedule-change',
      name: 'Schedule Change',
      subject: 'Important: Schedule Change - HIPMI UI Business Class',
      content: `
        <p>Dear {{name}},</p>
        <p>We're writing to inform you about a change in the schedule for the upcoming HIPMI UI Business Class session.</p>
        <p><strong>Updated session details:</strong></p>
        <ul>
          <li><strong>New Date:</strong> [New Event Date]</li>
          <li><strong>New Time:</strong> [New Event Time]</li>
          <li><strong>Venue:</strong> [Event Venue] (unchanged)</li>
        </ul>
        <p>We apologize for any inconvenience this change may cause. If you're unable to attend due to this schedule change, please let us know.</p>
        <p>Thank you for your understanding.</p>
        <p>Best regards,<br>HIPMI UI Business Class Team</p>
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
      setLoadingPage(true);
      const data = await businessClassAdminService.getAllParticipants();
      setParticipants(data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participants data',
        variant: 'destructive',
      });
    } finally {
      setLoadingPage(false);
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
      participantLevel: '',
      informationSource: '',
      otherInformationSource: ''
    });
  };

  // Update the formatDate function
  const formatDate = (date: Date | Timestamp | undefined | null): string => {
    if (!date) return 'N/A';
    
    const dateObj = convertTimestampToDate(date);
    if (!dateObj) return 'Invalid Date';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter participants based on current filters and active tab
  const getFilteredParticipants = () => {
    return participants.filter(participant => {
      // Search term filter
      const searchMatch = !filters.searchTerm || 
        participant.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        participant.email?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        participant.institution?.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Participant level filter
      const levelMatch = !filters.participantLevel || participant.participantLevel === filters.participantLevel;

      // Information source filter
      const sourceMatch = !filters.informationSource || participant.informationSource === filters.informationSource;

      // Other information source filter (only applicable if informationSource is OTHER)
      const otherSourceMatch = !filters.otherInformationSource || 
        (participant.informationSource === InformationSource.OTHER && 
         participant.otherInformationSource?.toLowerCase().includes(filters.otherInformationSource.toLowerCase()));

      return searchMatch && levelMatch && sourceMatch && otherSourceMatch;
    });
  };

  const filteredParticipants = getFilteredParticipants();

  const exportToCSV = () => {
    try {
      const headers = [
        'ID',
        'Name', 
        'Email', 
        'Institution',
        'Participant Level', 
        'Reason For Joining', 
        'Information Source', 
        'Other Information Source',
        'Social Media Proof URL',
        'Registration Date',
        'Created At',
        'Updated At'
      ];
      
      // Prepare CSV content
      let csvContent = headers.join(',') + '\n';
      
      filteredParticipants.forEach(participant => {
        const row = [
          `"${participant.id || ''}"`,
          `"${participant.name || ''}"`,
          `"${participant.email || ''}"`,
          `"${participant.institution || ''}"`,
          `"${participant.participantLevel || ''}"`,
          `"${participant.reasonForJoining?.replace(/"/g, '""') || ''}"`,
          `"${participant.informationSource || ''}"`,
          `"${participant.otherInformationSource || ''}"`,
          `"${participant.socialMediaProofURL || ''}"`,
          `"${formatDate(participant.registrationDate)}"`,
          `"${formatDate(participant.createdAt)}"`,
          `"${formatDate(participant.updatedAt)}"` 
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `business_class_participants_${new Date().toISOString().slice(0, 10)}.csv`);
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
          .replace(/{{name}}/g, participant.name || '')
          .replace(/{{email}}/g, participant.email || '')
          .replace(/{{institution}}/g, participant.institution || '')
          .replace(/{{participantLevel}}/g, participant.participantLevel || '')
          .replace(/{{registrationDate}}/g, formatDate(participant.registrationDate));

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

  // Calculate statistics
  const totalParticipants = participants.length;
  const beginnerCount = participants.filter(p => p.participantLevel === ParticipantLevel.BEGINNER).length;
  const advancedCount = participants.filter(p => p.participantLevel === ParticipantLevel.ADVANCE).length;

  // Get unique information sources for the filter dropdown
  const uniqueInformationSources = Object.values(InformationSource);

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
                <CardTitle>Business Class Participants</CardTitle>
                <CardDescription>Manage all business class participants</CardDescription>
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
                            <Button variant="outline" onClick={() => insertVariable('email')}>
                              Insert Email
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('institution')}>
                              Insert Institution
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('participantLevel')}>
                              Insert Participant Level
                            </Button>
                            <Button variant="outline" onClick={() => insertVariable('registrationDate')}>
                              Insert Registration Date
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
                <TabsTrigger value="beginner">
                  Beginner
                  <Badge variant="outline" className="ml-2 rounded-full py-0 px-2">{beginnerCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  Advanced
                  <Badge variant="outline" className="ml-2 rounded-full py-0 px-2">{advancedCount}</Badge>
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
                          placeholder="Search by name, email, or institution"
                          value={filters.searchTerm}
                          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="participantLevel" className="text-xs">Participant Level</Label>
                        <Select 
                          value={filters.participantLevel || "all"} 
                          onValueChange={(value) => handleFilterChange('participantLevel', value === "all" ? "" : value)}
                        >
                          <SelectTrigger id="participantLevel">
                            <SelectValue placeholder="All Levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value={ParticipantLevel.BEGINNER}>Beginner</SelectItem>
                            <SelectItem value={ParticipantLevel.ADVANCE}>Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="informationSource" className="text-xs">Information Source</Label>
                        <Select 
                          value={filters.informationSource || "all"} 
                          onValueChange={(value) => handleFilterChange('informationSource', value === "all" ? "" : value)}
                        >
                          <SelectTrigger id="informationSource">
                            <SelectValue placeholder="All Sources" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            {uniqueInformationSources.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {filters.informationSource === InformationSource.OTHER && (
                        <div>
                          <Label htmlFor="otherInformationSource" className="text-xs">Other Source Specification</Label>
                          <Input
                            id="otherInformationSource"
                            placeholder="Search in other source specifications"
                            value={filters.otherInformationSource}
                            onChange={(e) => handleFilterChange('otherInformationSource', e.target.value)}
                          />
                        </div>
                      )}
                      
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
                        <TableHead>Email</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Information Source</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingPage ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            Loading participants...
                          </TableCell>
                        </TableRow>
                      ) : filteredParticipants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
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
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.institution}</TableCell>
                            <TableCell>
                              <Badge variant={participant.participantLevel === ParticipantLevel.BEGINNER ? "secondary" : "default"}>
                                {participant.participantLevel === ParticipantLevel.BEGINNER ? 'Beginner' : 'Advanced'}
                              </Badge>
                            </TableCell>
                            <TableCell>{participant.informationSource}</TableCell>
                            <TableCell>{formatDate(participant.registrationDate)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/email/businesscaseclass/${participant.id}`)}
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
    </div>
  );
};

export default BusinessClassParticipantsPage;
