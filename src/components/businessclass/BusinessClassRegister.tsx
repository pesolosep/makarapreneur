"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle2, FileText, ChevronRight, ChevronLeft, Check, Archive, X, Eye, BookText } from 'lucide-react';
import { businessClassService } from '@/lib/firebase/businessClassService';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ParticipantLevel, 
  InformationSource,
  BusinessClassParticipant
} from '@/models/BusinessClassParticipant';
import { sendBusinessClassUpdateEmail, sendBusinessClassConfirmationEmail } from '@/lib/emailUtils';

interface FormData {
  // Personal details
  email: string;
  name: string;
  institution: string;
  
  // Participant preferences
  participantLevel: ParticipantLevel;
  reasonForJoining: string;
  informationSource: InformationSource;
  otherInformationSource?: string;
  
  // Proof file
  proofZipFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

interface StepProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  isCompleted: boolean;
  isActive: boolean;
}

interface BusinessClassRegistrationFormProps {
  editMode?: boolean;
  existingData?: BusinessClassParticipant | null;
}

const Step = ({ title, icon, isCompleted, isActive }: StepProps) => (
  <div className={`flex items-center space-x-2 ${isActive ? 'text-juneBud' : 'text-juneBud'}`}>
    <div className={`p-2 rounded-full ${
      isCompleted 
        ? 'bg-juneBud' 
        : isActive 
          ? 'bg-juneBud/80' 
          : 'bg-gray-700'
    } text-signalBlack`}>
      {isCompleted ? <Check className="w-5 h-5" /> : icon}
    </div>
    <span className={`text-sm font-medium ${isActive ? 'text-juneBud' : 'text-juneBud'}`}>{title}</span>
  </div>
);

const BusinessClassRegistrationForm: React.FC<BusinessClassRegistrationFormProps> = ({ 
  editMode = false, 
  existingData = null 
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalDocURL, setOriginalDocURL] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    institution: '',
    
    participantLevel: ParticipantLevel.BEGINNER,
    reasonForJoining: '',
    informationSource: InformationSource.INSTAGRAM,
    otherInformationSource: '',
    
    proofZipFile: null
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form with existing data if in edit mode
  useEffect(() => {
    if (editMode && existingData) {
      setFormData(prev => ({
        ...prev,
        email: existingData.email || '',
        name: existingData.name || '',
        institution: existingData.institution || '',
        participantLevel: existingData.participantLevel || ParticipantLevel.BEGINNER,
        reasonForJoining: existingData.reasonForJoining || '',
        informationSource: existingData.informationSource || InformationSource.INSTAGRAM,
        otherInformationSource: existingData.otherInformationSource || '',
        // Note: proofZipFile cannot be prefilled and will need to be uploaded again
        proofZipFile: null
      }));
      
      // Save original doc URL
      if (existingData.socialMediaProofURL) {
        setOriginalDocURL(existingData.socialMediaProofURL);
      }
      
      // Always start at step 1 when in edit mode
      setCurrentStep(1);
    }
  }, [editMode, existingData]);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/authentication/login?redirect=/event/register/business-class');
      return;
    }

    // Pre-fill email if available from user
    if (user.email && !editMode) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user, loading, router, editMode]);

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.institution) newErrors.institution = 'Institution is required';
    }

    if (step === 2) {
      if (!formData.reasonForJoining) {
        newErrors.reasonForJoining = 'Please provide your reason for joining';
      } else if (formData.reasonForJoining.length < 20) {
        newErrors.reasonForJoining = 'Please provide a more detailed reason (minimum 20 characters)';
      }
      
      if (formData.informationSource === InformationSource.OTHER && !formData.otherInformationSource) {
        newErrors.otherInformationSource = 'Please specify the information source';
      }
    }

    if (step === 3) {
      // Only require proof file for new registrations, not for edits
      if (!editMode && !formData.proofZipFile) {
        newErrors.proofZipFile = 'Proof file is required';
      } else if (formData.proofZipFile) {
        // Only validate file if one is provided
        // Validate file type (must be ZIP)
        if (formData.proofZipFile.type !== 'application/zip' && 
            formData.proofZipFile.type !== 'application/x-zip-compressed' && 
            !formData.proofZipFile.name.endsWith('.zip')) {
          newErrors.proofZipFile = 'Proof file must be a ZIP file';
        }
        
        // Validate file size (max 10MB)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (formData.proofZipFile.size > maxSizeInBytes) {
          newErrors.proofZipFile = 'Proof file must be less than 10MB';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleRadioChange = (value: string, fieldName: string) => {
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
                      
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isZipFile) {
        setErrors(prev => ({
          ...prev,
          proofZipFile: 'Proof file must be a ZIP file'
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
          proofZipFile: 'Proof file must be less than 10MB'
        }));
        // Clear the input so the user can try again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      proofZipFile: file
    }));
    
    if (errors.proofZipFile) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.proofZipFile;
        return newErrors;
      });
    }
  };

  const clearFileSelection = () => {
    setFormData(prev => ({
      ...prev,
      proofZipFile: null
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const viewOriginalDocument = () => {
    if (originalDocURL) {
      window.open(originalDocURL, '_blank', 'noopener,noreferrer');
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

  const onSubmit = async (e: FormEvent) => {
    if (e) {
        e.preventDefault();
      }
    
    // Important change: Always require step-by-step process regardless of edit mode
    if (currentStep < 3) {
      nextStep();
      return;
    }
    
    // Only proceed with submission if we're on the final step
    if (!validateStep(currentStep)) {
      return;
    }
    
  
    try {
      setIsSubmitting(true);
  
      if (!user) {
        throw new Error('You must be logged in to register');
      }
  
      // Create participant data structure
      const participantData = {
        email: formData.email,
        name: formData.name,
        institution: formData.institution,
        participantLevel: formData.participantLevel,
        reasonForJoining: formData.reasonForJoining,
        informationSource: formData.informationSource,
        otherInformationSource: formData.informationSource === InformationSource.OTHER ? 
                              formData.otherInformationSource : undefined
      };
  
      if (editMode && existingData) {
        // Update existing registration
        await businessClassService.editRegistration(
          existingData.id,
          participantData,
          formData.proofZipFile || undefined
        );
  
        // Send notification email for edits
        if (typeof sendBusinessClassUpdateEmail === 'function') {
          sendBusinessClassUpdateEmail(formData, existingData.id)
            .catch(error => console.error('Error sending email notification:', error));
        }
  
        toast({
          title: "Registration Updated",
          description: "Your registration has been successfully updated.",
        });
      } else {
        // Create new registration
        if (!formData.proofZipFile) {
          throw new Error('Proof file is required for new registrations');
        }
  
        const newRegistration = await businessClassService.registerParticipant(
          participantData,
          formData.proofZipFile
        );
        
        // Send confirmation email to user for new registrations
        if (typeof sendBusinessClassConfirmationEmail === 'function') {
          sendBusinessClassConfirmationEmail(formData, newRegistration.id)
            .catch(error => console.error('Error sending confirmation email:', error));
        }
  
        toast({
          title: "Registration Successful",
          description: "Your registration has been submitted. Please check your email for confirmation.",
        });
      }
  
      // Clear the file input after successful submission
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  
      router.push('/event/internalbusinessclass');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-signalBlack flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-juneBud" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-signalBlack font-poppins text-linen">
      <Navbar notTransparent/>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-juneBud to-juneBud/90 text-signalBlack mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {editMode ? 'Update Your Registration' : 'HIPMI UI Business Class Registration'}
            </h1>
            <p className="text-xl text-signalBlack/80 leading-relaxed">
              {editMode 
                ? 'Edit your registration details below. You can update your information and upload a new proof file if needed.'
                : 'Join our business class program designed for beginners and advanced entrepreneurs. Learn from industry experts and grow your business skills.'}
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
              title="Personal Info"
              icon={<UserCircle2 className="w-5 h-5" />}
              isCompleted={currentStep > 1}
              isActive={currentStep === 1}
            />
            <Step 
              title="Preferences"
              icon={<BookText className="w-5 h-5" />}
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
      <form onSubmit={(e) => e.preventDefault()} className="bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/10">
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter your email"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                      disabled={editMode} // Email cannot be changed in edit mode
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution (e.g. Universitas Indonesia)</label>
                    <Input
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      placeholder="Enter your institution"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.institution && (
                      <p className="text-red-400 text-sm mt-1">{errors.institution}</p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Level</label>
                    <RadioGroup 
                      value={formData.participantLevel} 
                      onValueChange={(value) => handleRadioChange(value, 'participantLevel')}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2 bg-black/40 p-3 rounded-lg border border-gray-700 hover:border-juneBud/60 transition-colors">
                        <RadioGroupItem value={ParticipantLevel.BEGINNER} id="beginner" className="text-juneBud" />
                        <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                          <span className="font-medium">Beginner</span>
                          <p className="text-sm text-juneBud">For those who are new to entrepreneurship</p>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-black/40 p-3 rounded-lg border border-gray-700 hover:border-juneBud/60 transition-colors">
                        <RadioGroupItem value={ParticipantLevel.ADVANCE} id="advance" className="text-juneBud" />
                        <Label htmlFor="advance" className="flex-1 cursor-pointer">
                          <span className="font-medium">Advanced</span>
                          <p className="text-sm text-juneBud">For those who already have business experience</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Your Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Reason for joining HIPMI UI Business Class</label>
                    <Textarea
                      name="reasonForJoining"
                      value={formData.reasonForJoining}
                      onChange={handleInputChange}
                      placeholder="Tell us why you want to join this program"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500 min-h-[120px]"
                    />
                    {errors.reasonForJoining && (
                      <p className="text-red-400 text-sm mt-1">{errors.reasonForJoining}</p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">How did you hear about HIPMI UI Business Class?</label>
                    <Select
                      value={formData.informationSource}
                      onValueChange={(value) => handleSelectChange(value, 'informationSource')}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                        <SelectValue placeholder="Select information source" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-700">
                        <SelectItem value={InformationSource.INSTAGRAM}>Instagram</SelectItem>
                        <SelectItem value={InformationSource.TIKTOK}>TikTok</SelectItem>
                        <SelectItem value={InformationSource.WEBSITE}>Website</SelectItem>
                        <SelectItem value={InformationSource.FRIEND}>Friend</SelectItem>
                        <SelectItem value={InformationSource.FACULTY}>Faculty</SelectItem>
                        <SelectItem value={InformationSource.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.informationSource === InformationSource.OTHER && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Please specify</label>
                      <Input
                        name="otherInformationSource"
                        value={formData.otherInformationSource || ''}
                        onChange={handleInputChange}
                        placeholder="Where did you hear about us?"
                        className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                      />
                      {errors.otherInformationSource && (
                        <p className="text-red-400 text-sm mt-1">{errors.otherInformationSource}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-juneBud">Required Documentation</h2>
                <Alert className="bg-juneBud/10 border-juneBud/20 mb-6">
  <AlertDescription>
    <p className="mb-2 text-juneBud"><strong>
      {editMode 
        ? 'You can upload a new proof file if needed. If you don\'t upload a new file, your previous submission will be kept.'
        : 'Combine all required proofs into a single ZIP file (max 10MB).'}
    </strong></p>
    <p className="text-sm mb-1 text-juneBud">Please include the following proofs:</p>
    <ol className="list-decimal pl-5 text-sm text-juneBud space-y-2">
      <li>
        <span className="font-medium text-juneBud">Proof of following HIPMI UI social media</span>
        <p className="text-xs text-white">
          Take a screenshot showing that you follow our {" "}
          <a 
            href="https://www.instagram.com/makarapreneur/" 
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-juneBud transition-colors"
          >
            Instagram account
          </a>{" "}
          and {" "}
          <a 
            href="https://www.tiktok.com/@makarapreneur?lang=en" 
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-juneBud transition-colors"
          >
            TikTok account
          </a>{" "}
        </p>
      </li>
      <li>
        <span className="font-medium text-juneBud">Proof of joining WhatsApp group</span>
        <p className="text-xs text-white">
          Take a screenshot showing you've joined the{" "}
          <a 
            href="https://chat.whatsapp.com/K0v2XGU5mLxEZkkUToVgGS" 
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-juneBud transition-colors"
          >
            WhatsApp group
          </a>
        </p>
      </li>
      <li>
        <span className="font-medium text-juneBud">Proof of sharing episode poster and tag three friends</span>
        <p className="text-xs text-white">Take a screenshot showing you've reposted our business class episode post on instagram and tag three friends </p>
      </li>
    </ol>
  </AlertDescription>
</Alert>

                <div className="space-y-4">
                  <div>
                    {/* Show original document section in edit mode */}
                    {editMode && originalDocURL && (
                      <div className="mb-4 border border-gray-700 rounded-lg p-4 bg-black/30">
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-medium text-juneBud">Current Document</h3>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-sm text-juneBud bg-juneBud/10 hover:text-juneBud hover:bg-juneBud/20 border-juneBud/30"
                            onClick={viewOriginalDocument}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Current Document
                          </Button>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Your previously submitted proof file is still available.</p>
                      </div>
                    )}
                    
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {editMode ? 'Upload New Proof ZIP File (Optional)' : 'Upload Proof ZIP File'}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-juneBud/30 rounded-lg hover:border-juneBud transition-colors bg-black/50">
                      <div className="space-y-1 text-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Archive className="mx-auto h-12 w-12 text-juneBud hover:text-juneBud/80 transition-colors" />
                        </label>
                        <div className="flex text-sm text-gray-300 justify-center">
                          <p className="text-gray-400">Upload ZIP file</p>
                        
                          <Input
                            id="file-upload"
                            name="proofZipFile"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".zip"
                            ref={fileInputRef}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          ZIP file only, maximum 10MB
                        </p>
                        {formData.proofZipFile && (
                          <div className="mt-4 p-3 bg-juneBud/10 rounded border border-juneBud/20 text-sm">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-linen">Selected file:</p>
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={clearFileSelection}
                                className="h-7 w-7 rounded-full p-0 text-juneBud hover:text-gray-100 hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-linen/80 mt-1">{formData.proofZipFile.name}</p>
                            <p className="text-xs text-linen/60 mt-1">
                              {(formData.proofZipFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                        {editMode && !formData.proofZipFile && (
                          <p className="mt-2 text-sm text-juneBud/70">Using previously uploaded proof file</p>
                        )}
                      </div>
                    </div>
                    {errors.proofZipFile && (
                      <p className="text-red-400 text-sm mt-2">{errors.proofZipFile}</p>
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
          {editMode ? "Updating..." : "Submitting..."}
        </>
      ) : (
        <>
          {editMode ? "Update Registration" : "Complete Registration"}
          <Check className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )}
</div>

          {/* Edit Mode Notice */}
          {editMode && (
            <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-md">
              <p className="text-sm text-blue-400">
                <strong>Edit Mode:</strong> You are updating your existing registration. Only changed fields will be updated.
              </p>
            </div>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessClassRegistrationForm;