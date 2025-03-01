"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle2, Users, FileText, ChevronRight, ChevronLeft, Check, Archive, X, Eye } from 'lucide-react';
import { competitionService } from '@/lib/firebase/competitionService';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditRegistrationProps {
  competitionId: string;
}

interface FormData {
  teamName: string;
  
  // Team Leader fields
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderInstitution: string;
  leaderMajor: string;
  leaderBatchYear: string;
  
  // Member 1 fields
  member1Name: string;
  member1Email: string;
  member1Phone: string;
  member1Institution: string;
  member1Major: string;
  member1BatchYear: string;
  
  // Member 2 fields
  member2Name: string;
  member2Email: string;
  member2Phone: string;
  member2Institution: string;
  member2Major: string;
  member2BatchYear: string;
  
  // Single registration file (ZIP)
  registrationFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

interface StepProps {
  title: string;
  icon: any;
  isCompleted: boolean;
  isActive: boolean;
}

const Step = ({ title, icon, isCompleted, isActive }: StepProps) => (
  <div className={`flex items-center space-x-2 ${isActive ? 'text-juneBud' : 'text-gray-400'}`}>
    <div className={`p-2 rounded-full ${
      isCompleted 
        ? 'bg-juneBud' 
        : isActive 
          ? 'bg-juneBud/80' 
          : 'bg-gray-700'
    } text-signalBlack`}>
      {isCompleted ? <Check className="w-5 h-5" /> : icon}
    </div>
    <span className={`text-sm font-medium ${isActive ? 'text-juneBud' : 'text-gray-400'}`}>{title}</span>
  </div>
);

export default function EditRegistration({ competitionId }: EditRegistrationProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { userId, loading } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderInstitution: '',
    leaderMajor: '',
    leaderBatchYear: '',
    member1Name: '',
    member1Email: '',
    member1Phone: '',
    member1Institution: '',
    member1Major: '',
    member1BatchYear: '',
    member2Name: '',
    member2Email: '',
    member2Phone: '',
    member2Institution: '',
    member2Major: '',
    member2BatchYear: '',
    registrationFile: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [canChangeDocuments, setCanChangeDocuments] = useState<boolean>(true);
  const [originalDocURL, setOriginalDocURL] = useState<string | null>(null);

  const batchYears = ['2024', '2023', '2022', '2021'];

  // Fetch team and competition data
  useEffect(() => {
    if (loading) return;
    
    if (!userId) {
      router.push('/authentication/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch competition data
        const competitionData = await competitionService.getCompetitionById(competitionId);
        
        if (!competitionData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Competition not found",
          });
          router.push('/competition');
          return;
        }
        
        setCompetition(competitionData);
        
        // Use userId to get the team for this competition
        const teamData = await competitionService.getTeamByUserAndCompetition(userId, competitionId);
        
        if (!teamData) {
          // No team found for this user and competition
          router.push(`/competition/${competitionId}/register`);
          return;
        }
        
        setTeam(teamData);
        setCanChangeDocuments(teamData.registrationStatus === 'pending');
        
        // Save the original doc URL for reference
        if (teamData.registrationDocURL) {
          setOriginalDocURL(teamData.registrationDocURL);
        }
        
        // Check if registration status allows editing
        if (teamData.registrationStatus === 'approved') {
            toast({
              variant: "destructive",
              title: "Cannot Edit",
              description: "Registration is already approved and cannot be edited.",
            });
          router.push('/competition/' + teamData.competitionId);
          return;
        }
        
        // Check if registration deadline has passed
        const registrationDeadline = new Date(competitionData.registrationDeadline);
        const now = new Date();
        
        if (now > registrationDeadline) {
          router.push('/competition/' + teamData.competitionId);
          toast({
            variant: "destructive",
            title: "Deadline Passed",
            description: "Registration deadline has passed and cannot be edited.",
          });
          return;
        }
        
        // Initialize form with team data
        setFormData({
          teamName: teamData.teamName || '',
          
          leaderName: teamData.teamLeader.name || '',
          leaderEmail: teamData.teamLeader.email || '',
          leaderPhone: teamData.teamLeader.phone || '',
          leaderInstitution: teamData.teamLeader.institution || '',
          leaderMajor: teamData.teamLeader.major || '',
          leaderBatchYear: teamData.teamLeader.batchYear || '',
          
          member1Name: teamData.members.member1?.name || '',
          member1Email: teamData.members.member1?.email || '',
          member1Phone: teamData.members.member1?.phone || '',
          member1Institution: teamData.members.member1?.institution || '',
          member1Major: teamData.members.member1?.major || '',
          member1BatchYear: teamData.members.member1?.batchYear || '',
          
          member2Name: teamData.members.member2?.name || '',
          member2Email: teamData.members.member2?.email || '',
          member2Phone: teamData.members.member2?.phone || '',
          member2Institution: teamData.members.member2?.institution || '',
          member2Major: teamData.members.member2?.major || '',
          member2BatchYear: teamData.members.member2?.batchYear || '',
          
          registrationFile: null
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, loading, competitionId, router, toast]);

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+62\d{3,}$/.test(phone);
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.teamName) newErrors.teamName = 'Team name is required';
      if (!formData.leaderName) newErrors.leaderName = 'Leader name is required';
      if (!formData.leaderEmail) {
        newErrors.leaderEmail = 'Leader email is required';
      } else if (!validateEmail(formData.leaderEmail)) {
        newErrors.leaderEmail = 'Invalid email address';
      }
      if (!formData.leaderPhone) {
        newErrors.leaderPhone = 'Leader phone number is required';
      } else if (!validatePhone(formData.leaderPhone)) {
        newErrors.leaderPhone = 'Phone number must be in format +62xxx';
      }
      if (!formData.leaderInstitution) newErrors.leaderInstitution = 'Institution is required';
      if (!formData.leaderMajor) newErrors.leaderMajor = 'Major is required';
      if (!formData.leaderBatchYear) newErrors.leaderBatchYear = 'Batch year is required';
    }

    if (step === 2) {
      if (!formData.member1Name) newErrors.member1Name = 'Member 1 name is required';
      if (!formData.member1Email) {
        newErrors.member1Email = 'Member 1 email is required';
      } else if (!validateEmail(formData.member1Email)) {
        newErrors.member1Email = 'Invalid email address';
      }
      if (!formData.member1Phone) {
        newErrors.member1Phone = 'Member 1 phone number is required';
      } else if (!validatePhone(formData.member1Phone)) {
        newErrors.member1Phone = 'Phone number must be in format +62xxx';
      }
      if (!formData.member1Institution) newErrors.member1Institution = 'Institution is required';
      if (!formData.member1Major) newErrors.member1Major = 'Major is required';
      if (!formData.member1BatchYear) newErrors.member1BatchYear = 'Batch year is required';
      
      // Member 2 validation only if any field is filled
      const hasMember2Info = formData.member2Name || formData.member2Email || formData.member2Phone;
      
      if (hasMember2Info) {
        if (!formData.member2Name) newErrors.member2Name = 'Member 2 name is required';
        if (!formData.member2Email) {
          newErrors.member2Email = 'Member 2 email is required';
        } else if (!validateEmail(formData.member2Email)) {
          newErrors.member2Email = 'Invalid email address';
        }
        if (!formData.member2Phone) {
          newErrors.member2Phone = 'Member 2 phone number is required';
        } else if (!validatePhone(formData.member2Phone)) {
          newErrors.member2Phone = 'Phone number must be in format +62xxx';
        }
        if (!formData.member2Institution) newErrors.member2Institution = 'Institution is required';
        if (!formData.member2Major) newErrors.member2Major = 'Major is required';
        if (!formData.member2BatchYear) newErrors.member2BatchYear = 'Batch year is required';
      }
    }

    if (step === 3 && canChangeDocuments) {
      if (formData.registrationFile) {
        // Validate file type (must be ZIP)
        if (formData.registrationFile.type !== 'application/zip' && 
            formData.registrationFile.type !== 'application/x-zip-compressed' && 
            !formData.registrationFile.name.endsWith('.zip')) {
          newErrors.registrationFile = 'Registration file must be a ZIP file';
        }
        
        // Validate file size (max 30MB)
        const maxSizeInBytes = 30 * 1024 * 1024; // 30MB
        if (formData.registrationFile.size > maxSizeInBytes) {
          newErrors.registrationFile = 'Registration file must be less than 30MB';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Validate the file before setting it in formData
    if (file) {
      // Basic validation for file type and size
      const isZipFile = file.type === 'application/zip' || 
                        file.type === 'application/x-zip-compressed' || 
                        file.name.endsWith('.zip');
                      
      const isValidSize = file.size <= 30 * 1024 * 1024; // 30MB
      
      if (!isZipFile) {
        setErrors(prev => ({
          ...prev,
          registrationFile: 'Registration file must be a ZIP file'
        }));
        // Clear the input so the user can try again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      if (!isValidSize) {
        setErrors(prev => ({
          ...prev,
          registrationFile: 'Registration file must be less than 30MB'
        }));
        // Clear the input so the user can try again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }
    
    // If validation passes or file is null, update state
    setFormData(prev => ({
      ...prev,
      registrationFile: file
    }));
    
    // Clear previous errors
    if (errors.registrationFile) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.registrationFile;
        return newErrors;
      });
    }
  };

  const clearFileSelection = () => {
    setFormData(prev => ({
      ...prev,
      registrationFile: null
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const viewOriginalDocument = () => {
    if (originalDocURL) {
      window.open(originalDocURL, '_blank', 'noopener,noreferrer');
    }
  };

// Updated onSubmit function that can be called both from form submission and button click
const onSubmit = async (e?: FormEvent) => {
  // Prevent default form submission if called from form submit event
  if (e) {
    e.preventDefault();
  }
  
  if (!validateStep(currentStep)) {
    return;
  }

  try {
    setIsSubmitting(true);

    if (!userId || !team) {
      throw new Error('You must be logged in to update your registration');
    }

    // Create team data structure that matches the Team model
    const updatedTeamData = {
      teamName: formData.teamName,
      teamLeader: {
        name: formData.leaderName,
        email: formData.leaderEmail,
        phone: formData.leaderPhone,
        institution: formData.leaderInstitution,
        major: formData.leaderMajor,
        batchYear: formData.leaderBatchYear
      },
      members: {
        member1: {
          name: formData.member1Name,
          email: formData.member1Email,
          phone: formData.member1Phone,
          institution: formData.member1Institution,
          major: formData.member1Major,
          batchYear: formData.member1BatchYear
        },
        member2: formData.member2Name ? {
          name: formData.member2Name,
          email: formData.member2Email,
          phone: formData.member2Phone,
          institution: formData.member2Institution,
          major: formData.member2Major,
          batchYear: formData.member2BatchYear
        } : undefined,
      },
      updatedAt: new Date(),
    };

    // Update team with new data
    await competitionService.updateTeamInfo(
      team.id,
      updatedTeamData,
      canChangeDocuments && formData.registrationFile ? formData.registrationFile : null
    );

    // Clear the file input after successful submission
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Reset the file in formData
    setFormData(prev => ({
      ...prev,
      registrationFile: null
    }));

    toast({
      title: "Update Successful",
      description: "Your team information has been updated successfully.",
    });

    router.push('/competition/' + competitionId);
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Update Failed",
      description: error instanceof Error ? error.message : "Failed to update team information",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-signalBlack flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-juneBud" />
      </div>
    );
  }

  if (!userId || !team || !competition) {
    return null;
  }

  return (
    <div className="min-h-screen bg-signalBlack font-poppins text-linen">
      <Navbar notTransparent/>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-juneBud to-juneBud/90 text-signalBlack mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Edit Registration: {competition.name}</h1>
            <p className="text-xl text-signalBlack/80 leading-relaxed">
              Update your team information for {competition.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Progress 
            value={(currentStep / 3) * 100} 
            className="mb-6 bg-white/10" 
          />
          <div className="flex justify-between">
            <Step 
              title="Team Leader Info"
              icon={<UserCircle2 className="w-5 h-5" />}
              isCompleted={currentStep > 1}
              isActive={currentStep === 1}
            />
            <Step 
              title="Team Members"
              icon={<Users className="w-5 h-5" />}
              isCompleted={currentStep > 2}
              isActive={currentStep === 2}
            />
            <Step 
              title="Documentation"
              icon={<FileText className="w-5 h-5" />}
              isCompleted={currentStep > 3}
              isActive={currentStep === 3}
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {!canChangeDocuments && (
          <Alert className="mb-6 bg-amber-500/10 border-amber-500/20 text-amber-500">
            <AlertDescription>
              Your registration has been {team.registrationStatus}. You can only update personal information and cannot change the uploaded documents.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={(e) => e.preventDefault()} className="bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/10">
          {/* Step 1: Team and Leader Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Team Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Team Name</label>
                    <Input
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      placeholder="Enter your team name"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.teamName && (
                      <p className="text-red-400 text-sm mt-1">{errors.teamName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Team Leader Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleInputChange}
                      placeholder="Enter team leader's full name"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.leaderName && (
                      <p className="text-red-400 text-sm mt-1">{errors.leaderName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      name="leaderEmail"
                      value={formData.leaderEmail}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter team leader's email"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.leaderEmail && (
                      <p className="text-red-400 text-sm mt-1">{errors.leaderEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <Input
                      name="leaderPhone"
                      value={formData.leaderPhone}
                      onChange={handleInputChange}
                      placeholder="Format: +62xxx"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.leaderPhone && (
                      <p className="text-red-400 text-sm mt-1">{errors.leaderPhone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution (e.g. Universitas Indonesia)</label>
                    <Input
                      name="leaderInstitution"
                      value={formData.leaderInstitution}
                      onChange={handleInputChange}
                      placeholder="Enter your institution"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.leaderInstitution && (
                      <p className="text-red-400 text-sm mt-1">{errors.leaderInstitution}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Major</label>
                    <Input
                      name="leaderMajor"
                      value={formData.leaderMajor}
                      onChange={handleInputChange}
                      placeholder="Enter your major"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.leaderMajor && (
                      <p className="text-red-400 text-sm mt-1">{errors.leaderMajor}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Batch Year</label>
                    <Select
                      value={formData.leaderBatchYear}
                      onValueChange={(value) => handleSelectChange(value, 'leaderBatchYear')}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                        <SelectValue placeholder="Select batch year" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-700">
                        {batchYears.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.leaderBatchYear && (
                      <p className="text-red-400 text-sm mt-1">{errors.leaderBatchYear}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Team Members Information */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Team Member 1</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input
                      name="member1Name"
                      value={formData.member1Name}
                      onChange={handleInputChange}
                      placeholder="Enter member 1's full name"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member1Name && (
                      <p className="text-red-400 text-sm mt-1">{errors.member1Name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      name="member1Email"
                      value={formData.member1Email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter member 1's email"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member1Email && (
                     <p className="text-red-400 text-sm mt-1">{errors.member1Email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <Input
                      name="member1Phone"
                      value={formData.member1Phone}
                      onChange={handleInputChange}
                      placeholder="Format: +62xxx"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member1Phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.member1Phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution (e.g. Universitas Indonesia)</label>
                    <Input
                      name="member1Institution"
                      value={formData.member1Institution}
                      onChange={handleInputChange}
                      placeholder="Enter institution"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member1Institution && (
                      <p className="text-red-400 text-sm mt-1">{errors.member1Institution}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Major</label>
                    <Input
                      name="member1Major"
                      value={formData.member1Major}
                      onChange={handleInputChange}
                      placeholder="Enter major"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member1Major && (
                      <p className="text-red-400 text-sm mt-1">{errors.member1Major}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Batch Year</label>
                    <Select
                      value={formData.member1BatchYear}
                      onValueChange={(value) => handleSelectChange(value, 'member1BatchYear')}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                        <SelectValue placeholder="Select batch year" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-700">
                        {batchYears.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.member1BatchYear && (
                      <p className="text-red-400 text-sm mt-1">{errors.member1BatchYear}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud flex items-center">
                  Team Member 2
                  <span className="text-sm font-normal text-gray-400 ml-2">(Optional)</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input
                      name="member2Name"
                      value={formData.member2Name}
                      onChange={handleInputChange}
                      placeholder="Enter member 2's full name (optional)"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member2Name && (
                      <p className="text-red-400 text-sm mt-1">{errors.member2Name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      name="member2Email"
                      value={formData.member2Email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter member 2's email (optional)"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member2Email && (
                      <p className="text-red-400 text-sm mt-1">{errors.member2Email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <Input
                      name="member2Phone"
                      value={formData.member2Phone}
                      onChange={handleInputChange}
                      placeholder="Format: +62xxx (optional)"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member2Phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.member2Phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution (e.g. Universitas Indonesia)</label>
                    <Input
                      name="member2Institution"
                      value={formData.member2Institution}
                      onChange={handleInputChange}
                      placeholder="Enter institution (optional)"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member2Institution && (
                      <p className="text-red-400 text-sm mt-1">{errors.member2Institution}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Major</label>
                    <Input
                      name="member2Major"
                      value={formData.member2Major}
                      onChange={handleInputChange}
                      placeholder="Enter major (optional)"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.member2Major && (
                      <p className="text-red-400 text-sm mt-1">{errors.member2Major}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Batch Year</label>
                    <Select
                      value={formData.member2BatchYear}
                      onValueChange={(value) => handleSelectChange(value, 'member2BatchYear')}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                        <SelectValue placeholder="Select batch year (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-700">
                        {batchYears.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.member2BatchYear && (
                      <p className="text-red-400 text-sm mt-1">{errors.member2BatchYear}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-juneBud">Required Documentation</h2>
                
                {!canChangeDocuments && (
                  <Alert className="mb-6 bg-amber-500/10 border-amber-500/20 text-amber-500">
                    <AlertDescription>
                      Your application has been reviewed and you cannot change the uploaded documents at this time.
                    </AlertDescription>
                  </Alert>
                )}
                
                {canChangeDocuments && (
                  <Alert className="bg-juneBud/10 border-juneBud/20 text-linen mb-6">
                    <AlertDescription>
                      <p className="mb-2"><strong>Combine all required documents into a single ZIP file (max 30MB).</strong></p>
                      <p className="text-sm mb-1">Please include the following documents:</p>
                      <ol className="list-decimal pl-5 text-sm space-y-2">
                        <li>
                          <span className="font-medium">Student ID Cards</span>
                          <p className="text-xs text-gray-300">Combine all team members' ID cards into a single PDF file (max 10MB)</p>
                        </li>
                        <li>
                          <span className="font-medium">Proof of following @makarapreneur on Instagram</span>
                          <p className="text-xs text-gray-300">Combine all team members' proofs into a single PDF file (max 10MB)</p>
                        </li>
                        <li>
                          <span className="font-medium">Proof of posting Competition Twibbon and tagging 3 friends</span>
                          <p className="text-xs text-gray-300">Ensure your Instagram account is public and combine all members' proofs into a single PDF file (max 10MB)</p>
                        </li>
                        <li>
                          <span className="font-medium">Proof of posting Competition poster on SG and tagging @makarapreneur</span>
                          <p className="text-xs text-gray-300">Combine all members' proofs into a single PDF file (max 10MB)</p>
                        </li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">Current Documentation</label>
                      {originalDocURL && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-sm text-juneBud hover:text-juneBud hover:bg-juneBud/10 border-juneBud/30"
                          onClick={viewOriginalDocument}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Current Document
                        </Button>
                      )}
                    </div>
                    
                    {canChangeDocuments ? (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Update Registration File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-juneBud/30 rounded-lg hover:border-juneBud transition-colors bg-black/50">
                          <div className="space-y-1 text-center">
                            <Archive className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-300">
                              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-juneBud hover:text-juneBud/80">
                                <span>Upload ZIP file</span>
                                <Input
                                  id="file-upload"
                                  name="registrationFile"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  accept=".zip"
                                  ref={fileInputRef}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              ZIP file only, maximum 30MB
                            </p>
                            {formData.registrationFile && (
                              <div className="mt-4 p-3 bg-juneBud/10 rounded border border-juneBud/20 text-sm">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-linen">Selected file:</p>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFileSelection}
                                    className="h-7 w-7 rounded-full p-0 text-gray-400 hover:text-gray-100 hover:bg-red-500/20"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-linen/80 mt-1">{formData.registrationFile.name}</p>
                                <p className="text-xs text-linen/60 mt-1">
                                  {(formData.registrationFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                                <div className="mt-2 text-xs text-juneBud/90 bg-juneBud/5 p-2 rounded">
                                  This file will be uploaded when you click "Save Changes" at the bottom.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {errors.registrationFile && (
                          <p className="text-red-400 text-sm mt-2">{errors.registrationFile}</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-400">
                        <p>You cannot update the documentation at this time.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

       {/* Navigation Buttons */}
<div className="flex justify-between mt-8 pt-6 border-t border-white/10">
  {currentStep > 1 && (
    <Button
      type="button"
      variant="outline"
      onClick={prevStep}
      className="flex items-center bg-black/50 border-gray-700 hover:bg-black/80 text-linen"
    >
      <ChevronLeft className="w-4 h-4 mr-2" />
      Previous Step
    </Button>
  )}
  
  {currentStep < 3 ? (
    <Button
      type="button"
      onClick={nextStep}
      className="flex items-center ml-auto bg-juneBud hover:bg-juneBud/90 text-signalBlack"
    >
      Next Step
      <ChevronRight className="w-4 h-4 ml-2" />
    </Button>
  ) : (
    <Button
      type="button" 
      onClick={onSubmit}
      disabled={isSubmitting}
      className="flex items-center ml-auto bg-gradient-to-r from-juneBud to-cornflowerBlue hover:opacity-90 text-signalBlack"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          Save Changes
          <Check className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )}
</div>
        </form>
      </div>

      <Footer />
    </div>
  );
}