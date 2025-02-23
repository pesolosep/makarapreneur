// app/admin/email/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Undo, Redo, Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { adminService } from '@/lib/firebase/competitionService';
import type { Competition } from '@/models/Competition';
import type { Team } from '@/models/Team';

interface EmailTemplate {
  subject: string;
  content: string;
}

interface EmailTemplates {
  [key: string]: EmailTemplate;
}

interface SelectedTeams {
  [key: string]: boolean;
}

type RegistrationStatus = 'all' | 'pending' | 'approved' | 'rejected';

const EmailPage = () => {
  // Team management states
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('all');
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});
  const [selectAll, setSelectAll] = useState(false);

  // Email states
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Email templates
  const emailTemplates: EmailTemplates = {
    welcome: {
      subject: 'Welcome to Our Competition!',
      content: `<p>Dear Team [TeamName],</p>
<p>Thank you for registering for our competition. We're excited to have you on board!</p>
<p>Here are some important details about the upcoming events:</p>
<ul>
  <li>Competition timeline</li>
  <li>Important deadlines</li>
  <li>Required materials</li>
</ul>
<p>Best regards,<br/>Admin Team</p>`
    },
    // ... other templates
  };

  // Fetch competitions and teams
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const competitionsRef = collection(db, 'competitions');
        const snapshot = await getDocs(competitionsRef);
        const competitionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Competition[];
        setCompetitions(competitionsData);
        
        if (competitionsData.length > 0) {
          setSelectedCompetition(competitionsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching competitions:', error);
      }
    };

    fetchCompetitions();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedCompetition) return;
      
      try {
        const teams = await adminService.getTeamsByCompetition(selectedCompetition);
        setTeams(teams);
        setFilteredTeams(teams);
        // Reset selected teams when competition changes
        setSelectedTeams({});
        setSelectAll(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [selectedCompetition]);

  // Handle search and filtering
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    handleFilter(term, registrationStatus);
  };

  const handleFilter = (searchTerm: string, status: RegistrationStatus) => {
    let filtered = [...teams];

    if (status !== 'all') {
      filtered = filtered.filter(team => team.registrationStatus === status);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(team => 
        team.teamName.toLowerCase().includes(term) ||
        team.teamLeader.name.toLowerCase().includes(term) ||
        team.teamLeader.email.toLowerCase().includes(term) ||
        (team.members.member1?.name || '').toLowerCase().includes(term) ||
        (team.members.member2?.name || '').toLowerCase().includes(term)
      );
    }

    setFilteredTeams(filtered);
  };

  // Handle team selection
  const handleSelectTeam = (teamId: string, checked: boolean) => {
    setSelectedTeams(prev => ({
      ...prev,
      [teamId]: checked
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelectedTeams: SelectedTeams = {};
    filteredTeams.forEach(team => {
      newSelectedTeams[team.id] = checked;
    });
    setSelectedTeams(newSelectedTeams);
  };

  // Handle template selection
  const handleTemplateSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = event.target.value;
    setSelectedTemplate(templateKey);
    
    if (templateKey) {
      const template = emailTemplates[templateKey];
      if (template) {
        setSubject(template.subject);
        editor?.commands.setContent(template.content);
        setContent(template.content);
      }
    }
  };

  // Handle email sending
  const handleSendEmail = async () => {
    const selectedTeamsList = filteredTeams.filter(team => selectedTeams[team.id]);
    
    if (selectedTeamsList.length === 0) {
      setStatus({
        type: 'error',
        message: 'Please select at least one team'
      });
      return;
    }

    if (!subject || !content) {
      setStatus({
        type: 'error',
        message: 'Please fill in subject and content'
      });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      for (const team of selectedTeamsList) {
        // Collect all email recipients
        const recipients = [
          team.teamLeader.email,
          ...(team.members.member1?.email ? [team.members.member1.email] : []),
          ...(team.members.member2?.email ? [team.members.member2.email] : [])
        ];

        // Replace placeholders in content
        const personalizedContent = content
          .replace(/\[TeamName\]/g, team.teamName)
          .replace(/\[Name\]/g, team.teamName);

        // Send email to all team members
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipients.join(', '),
            subject,
            html: personalizedContent,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send email to team ${team.teamName}`);
        }
      }

      setStatus({
        type: 'success',
        message: `Email sent successfully to ${selectedTeamsList.length} teams!`
      });
      
      // Clear selections but keep the content
      setSelectedTeams({});
      setSelectAll(false);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send some emails. Please try again.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <select
                value={registrationStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as RegistrationStatus;
                  setRegistrationStatus(newStatus);
                  handleFilter(searchTerm, newStatus);
                }}
                className="w-48 p-2 border rounded-md bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="compose" className="space-y-4">
            <TabsList>
              <TabsTrigger value="compose">Compose Email</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="compose">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        />
                      </TableHead>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTeams[team.id] || false}
                            onCheckedChange={(checked) => handleSelectTeam(team.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{team.teamName}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>
                              <span className="font-medium">Leader:</span> {team.teamLeader.name}
                            </div>
                            {team.members.member1 && (
                              <div>
                                <span className="font-medium">Member 1:</span> {team.members.member1.name}
                              </div>
                            )}
                            {team.members.member2 && (
                              <div>
                                <span className="font-medium">Member 2:</span> {team.members.member2.name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{team.registrationStatus}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div>
                  <label className="text-sm font-medium" htmlFor="subject">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                  />
                </div>

                <div className="border rounded-md p-2">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={editor?.isActive('bold') ? 'bg-slate-200' : ''}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={editor?.isActive('italic') ? 'bg-slate-200' : ''}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={editor?.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={editor?.isActive('bulletList') ? 'bg-slate-200' : ''}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={editor?.isActive('orderedList') ? 'bg-slate-200' : ''}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().undo().run()}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editor?.chain().focus().redo().run()}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                  <EditorContent editor={editor} />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Available placeholders:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">[TeamName]</code>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubject('');
                      setContent('');
                      setSelectedTemplate('');
                      editor?.commands.setContent('');
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleSendEmail}
                    disabled={sending || !subject || Object.keys(selectedTeams).length === 0}
                  >
                    {sending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="template">
                    Select Template
                  </label>
                  <select
                    id="template"
                    value={selectedTemplate}
                    onChange={handleTemplateSelect}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="">Choose a template</option>
                    <option value="welcome">Welcome Email</option>
                    <option value="reminder">Deadline Reminder</option>
                    <option value="announcement">Announcement</option>
                    <option value="stage-cleared">Stage Cleared Notification</option>
                    <option value="stage-rejected">Stage Rejection Notification</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-md">
                  <h3 className="font-medium mb-2">Template Preview</h3>
                  <div className="text-sm">
                    {content && (
                      <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        className="prose max-w-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {status && (
            <Alert
              variant={status.type === 'success' ? 'default' : 'destructive'}
              className="mt-4"
            >
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailPage;