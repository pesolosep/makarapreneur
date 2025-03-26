"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle2, FileText, ChevronRight, ChevronLeft, Check, Building, Users, Phone, Upload, BriefcaseIcon, Eye, X } from 'lucide-react';
import { networkingEventService } from '@/lib/firebase/networkNightService';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MembershipStatus, 
  Position, 
  NetworkingParticipant,
} from '@/models/NetworkParticipant';
import { sendNetworkingEventUpdateEmail, sendNetworkingEventConfirmationEmail } from '@/lib/emailUtils';

interface FormData {
    // Personal Information
    name: string;
    whatsappNumber: string;
    email: string;
    position: string;
    
    // Membership Information
    membershipStatus: MembershipStatus;
    hipmiPtOrigin?: string;
    otherOrigin?: string;
    
    // Event Expectations
    expectations: string[];
    otherExpectation?: string;
    
    // Business Information
    hasBusiness: boolean;
    businessName?: string;
    businessField?: string;
    businessDescription?: string;
    businessSocial?: string;
    
    // Payment
    paymentProofFile: File | null;
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


interface NetworkRegistrationFormProps {
  editMode?: boolean;
  existingData?: NetworkingParticipant | null;
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

const expectationOptions = [
  { id: 'industry-insight', label: 'Insight to the Industry' },
  { id: 'networking', label: 'Networking opportunities' },
  { id: 'internship', label: 'Internship opportunities' },
  { id: 'mentor', label: 'Finding a mentor' },
  { id: 'promotion', label: 'Promoting my business' },
  { id: 'other', label: 'Other' }
];

const businessFieldOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'creative-design', label: 'Creative and Design' },
  { value: 'retail-ecommerce', label: 'Retail and E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'health-wellness', label: 'Health and Wellness' },
  { value: 'other', label: 'Other' }
];

const positionOptions = [
  { value: Position.PENGURUS_INTI, label: 'Pengurus Inti' },
  { value: Position.KEPALA_WAKIL_BIDANG, label: 'Kepala/Wakil Kepala Bidang' },
  { value: Position.STAF, label: 'Staf' },
  { value: Position.ANGGOTA, label: 'Anggota' }
];

const hipmiPtOriginOptions = [
  { value: 'ui', label: 'HIPMI PT Universitas Indonesia' },
  { value: 'ipb', label: 'HIPMI PT IPB University' },
  { value: 'ugm', label: 'HIPMI PT Universitas Gadjah Mada' },
  { value: 'telkom', label: 'HIPMI PT Telkom University Bandung' },
  { value: 'trisakti', label: 'HIPMI PT Universitas Trisakti' },
  { value: 'unpad', label: 'HIPMI PT Universitas Padjajaran' },
  { value: 'itb', label: 'HIPMI PT Institut Teknologi Bandung' },
  { value: 'unpas', label: 'HIPMI PT Universitas Pasundan' },
  { value: 'esa-unggul', label: 'HIPMI PT Universitas Esa Unggul' },
  { value: 'upn-jakarta', label: 'HIPMI PT Universitas Pembangunan Nasional Veteran Jakarta' },
  { value: 'upi', label: 'HIPMI PT Universitas Pendidikan Indonesia' },
  { value: 'uii', label: 'HIPMI PT Universitas Islam Indonesia' },
  { value: 'uin', label: 'HIPMI PT Universitas Islam Negeri Syarif Hidayatullah' },
  { value: 'unj', label: 'HIPMI PT Universitas Negeri Jakarta' },
  { value: 'upn-yogya', label: 'HIPMI PT Universitas Pembangunan Nasional Veteran Yogyakarta' },
  { value: 'undip', label: 'HIPMI PT Universitas Diponegoro' },
  { value: 'unisba', label: 'HIPMI PT Universitas Islam Bandung' },
  { value: 'unpar', label: 'HIPMI PT Universitas Katolik Parahyangan' },
  { value: 'other', label: 'Other' }
];


const NetworkingEventRegistrationForm: React.FC<NetworkRegistrationFormProps> = ({ 
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
    name: '',
    whatsappNumber: '',
    email: '',
    position: '',
    
    membershipStatus: MembershipStatus.FUNGSIONARIS,
    hipmiPtOrigin: '',
    otherOrigin: '',
    
    expectations: [],
    otherExpectation: '',
    
    hasBusiness: false,
    businessName: '',
    businessField: '',
    businessDescription: '',
    businessSocial: '',
    
    paymentProofFile: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedExpectations, setSelectedExpectations] = useState<string[]>([]);

  // Populate form with existing data if in edit mode
  useEffect(() => {
    if (editMode && existingData) {
      // Map expectations to option IDs
      const mappedExpectations = existingData.expectations.map(exp => {
        const found = expectationOptions.find(option => option.label === exp);
        return found ? found.id : (exp === 'Other' ? 'other' : '');
      }).filter(id => id); // Remove empty strings
      
      setSelectedExpectations(mappedExpectations);
      
      // Set initial form data
      setFormData({
        name: existingData.name || '',
        whatsappNumber: existingData.whatsappNumber || '',
        email: existingData.email || '', // Load email from existing data
        position: existingData.position || '',
        
        membershipStatus: existingData.membershipStatus || MembershipStatus.FUNGSIONARIS,
        hipmiPtOrigin: existingData.hipmiPtOrigin || '',
        otherOrigin: '',
        
        expectations: mappedExpectations,
        otherExpectation: existingData.expectations.find(exp => !expectationOptions.some(o => o.label === exp)) || '',
        
        hasBusiness: existingData.hasBusiness || false,
        businessName: existingData.business?.name || '',
        businessField: existingData.business?.field || '',
        businessDescription: existingData.business?.description || '',
        businessSocial: existingData.business?.socialMedia || '',
        
        paymentProofFile: null
      });
      
      // Save original doc URL
      if (existingData.paymentProofURL) {
        setOriginalDocURL(existingData.paymentProofURL);
      }
      
      // Always start at step 1 when in edit mode
      setCurrentStep(1);
    }
  }, [editMode, existingData]);

  // Add email pre-filling
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/authentication/login?redirect=/event/register/networking');
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

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/authentication/login?redirect=/event/register/networking');
      return;
    }
  }, [user, loading, router]);

  const validatePhoneNumber = (phone: string) => {
    return /^08\d{3,}$/.test(phone);
  };

  // Add email validation
  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      
      if (!formData.whatsappNumber) {
        newErrors.whatsappNumber = 'WhatsApp number is required';
      } else if (!validatePhoneNumber(formData.whatsappNumber)) {
        newErrors.whatsappNumber = 'Phone number must be in format 08xxx';
      }

      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      
      if (!formData.position) newErrors.position = 'Position is required';
    }

    if (step === 2) {
      if (formData.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && !formData.hipmiPtOrigin) {
        newErrors.hipmiPtOrigin = 'HIPMI PT origin is required for non-fungsionaris';
      }
      
      if (formData.hipmiPtOrigin === 'other' && !formData.otherOrigin) {
        newErrors.otherOrigin = 'Please specify your HIPMI PT origin';
      }
      
      if (selectedExpectations.length === 0) {
        newErrors.expectations = 'Please select at least one expectation';
      }
      
      if (selectedExpectations.includes('other') && !formData.otherExpectation) {
        newErrors.otherExpectation = 'Please specify your other expectation';
      }
    }

    if (step === 3) {
      if (formData.hasBusiness) {
        if (!formData.businessName) newErrors.businessName = 'Business name is required';
        if (!formData.businessField) newErrors.businessField = 'Business field is required';
        if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required';
      }
    }
    
    if (step === 4) {
      // Only require payment proof for new registrations, not for edits
      if (!editMode && !formData.paymentProofFile) {
        newErrors.paymentProofFile = 'Payment proof is required';
      } else if (formData.paymentProofFile) {
        // Only validate if a new file is provided
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validFileTypes.includes(formData.paymentProofFile.type)) {
          newErrors.paymentProofFile = 'Payment proof must be an image (JPEG, PNG) or PDF file';
        }
        
        // Validate file size (max 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (formData.paymentProofFile.size > maxSizeInBytes) {
          newErrors.paymentProofFile = 'Payment proof file must be less than 5MB';
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasBusiness: checked
    }));
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

  const handleExpectationChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedExpectations(prev => [...prev, id]);
    } else {
      setSelectedExpectations(prev => prev.filter(item => item !== id));
    }
    
    // Clear any error for expectations
    if (errors.expectations) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.expectations;
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
      const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validFileTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          paymentProofFile: 'Payment proof must be an image (JPEG, PNG) or PDF file'
        }));
        // Clear the input so the user can try again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setErrors(prev => ({
          ...prev,
          paymentProofFile: 'Payment proof file must be less than 5MB'
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
      paymentProofFile: file
    }));
    
    if (errors.paymentProofFile) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentProofFile;
        return newErrors;
      });
    }
  };

  const clearFileSelection = () => {
    setFormData(prev => ({
      ...prev,
      paymentProofFile: null
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
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

  const onSubmit = async (e?: FormEvent) => {
    // Prevent default form submission if called from form submit event
    if (e) {
      e.preventDefault();
    }
    
    // If not on the final step, just move to the next step
    if (currentStep < 4) {
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

      // Prepare expectations array from selected checkboxes
      const expectationsArray = selectedExpectations.map(id => {
        if (id === 'other') {
          return formData.otherExpectation || 'Other';
        }
        return expectationOptions.find(option => option.id === id)?.label || id;
      });

      // Create business data if user has a business
      const businessData = formData.hasBusiness ? {
        name: formData.businessName || '',
        field: formData.businessField || '',
        description: formData.businessDescription || '',
        socialMedia: formData.businessSocial || ''
      } : null;

      // Handle HIPMI PT origin for non-fungsionaris
      let hipmiPtOriginValue = formData.hipmiPtOrigin;
      if (formData.hipmiPtOrigin === 'other' && formData.otherOrigin) {
        hipmiPtOriginValue = formData.otherOrigin;
      }

      // Create participant data structure
      const participantData = {
        name: formData.name,
        email: formData.email,
        whatsappNumber: formData.whatsappNumber,
        position: formData.position as Position, // Convert string to Position enum
        membershipStatus: formData.membershipStatus,
        hipmiPtOrigin: hipmiPtOriginValue,
        expectations: expectationsArray,
        hasBusiness: formData.hasBusiness,
        business: businessData
      };

      if (editMode && existingData) {
        // Update existing registration
        await networkingEventService.editRegistration(
          existingData.id,
          participantData,
          formData.paymentProofFile || undefined
        );

        // Send notification email for edits
        if (typeof sendNetworkingEventUpdateEmail === 'function') {
          sendNetworkingEventUpdateEmail(formData, existingData.id)
            .catch(error => console.error('Error sending email notification:', error));
        }

        toast({
          title: "Registration Updated",
          description: "Your registration has been successfully updated.",
        });
      } else {
        // Create new registration
        if (!formData.paymentProofFile) {
          throw new Error('Payment proof is required for new registrations');
        }

        const newRegistration = await networkingEventService.registerParticipant(
          user.uid,
          participantData,
          formData.paymentProofFile
        );
        
        // Send confirmation email to user for new registrations
        if (typeof sendNetworkingEventConfirmationEmail === 'function') {
          sendNetworkingEventConfirmationEmail(formData, newRegistration.id)
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

      router.push('/event');
    } catch (error) {
      toast({
        variant: "destructive",
        title: editMode ? "Update Failed" : "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to process registration",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate payment amount based on membership status
  const paymentAmount = formData.membershipStatus === MembershipStatus.FUNGSIONARIS ? 75000 : 145000;

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
              {editMode ? 'Update Your Registration' : 'Networking Night Registration'}
            </h1>
            <p className="text-xl text-signalBlack/80 leading-relaxed">
              {editMode 
                ? 'Edit your registration details below. You can update your information and upload a new payment proof if needed.'
                : 'Join our exclusive networking event and connect with industry professionals, entrepreneurs, and fellow students.'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Progress 
            value={(currentStep / 4) * 100} 
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
              title="Background"
              icon={<Building className="w-5 h-5" />}
              isCompleted={currentStep > 2}
              isActive={currentStep === 2}
            />
            <Step 
              title="Business Info"
              icon={<BriefcaseIcon className="w-5 h-5" />}
              isCompleted={currentStep > 3}
              isActive={currentStep === 3}
            />
            <Step 
              title="Payment"
              icon={<FileText className="w-5 h-5" />}
              isCompleted={currentStep > 4}
              isActive={currentStep === 4}
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                      disabled={editMode}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp Number</label>
                    <Input
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="Format: 08xxx"
                      className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                    />
                    {errors.whatsappNumber && (
                      <p className="text-red-400 text-sm mt-1">{errors.whatsappNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => handleSelectChange(value, 'position')}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-700">
                        {positionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.position && (
                      <p className="text-red-400 text-sm mt-1">{errors.position}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Membership and Expectations */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Membership & Expectations</h2>
                
                <div className="space-y-4">
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Are you a HIPMI PT UI Fungsionaris?</label>
                    <RadioGroup 
                      value={formData.membershipStatus} 
                      onValueChange={(value) => handleRadioChange(value, 'membershipStatus')}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2 bg-black/40 p-3 rounded-lg border border-gray-700 hover:border-juneBud/60 transition-colors">
                        <RadioGroupItem value={MembershipStatus.FUNGSIONARIS} id="fungsionaris" className="text-juneBud" />
                        <Label htmlFor="fungsionaris" className="flex-1 cursor-pointer">
                          <span className="font-medium">Yes</span>
                          <p className="text-sm text-gray-400">I am a HIPMI PT UI Fungsionaris</p>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-black/40 p-3 rounded-lg border border-gray-700 hover:border-juneBud/60 transition-colors">
                        <RadioGroupItem value={MembershipStatus.NON_FUNGSIONARIS} id="non-fungsionaris" className="text-juneBud" />
                        <Label htmlFor="non-fungsionaris" className="flex-1 cursor-pointer">
                          <span className="font-medium">No</span>
                          <p className="text-sm text-gray-400">I am from another HIPMI PT</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {formData.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Your HIPMI PT Origin</label>
                      <Select
                        value={formData.hipmiPtOrigin}
                        onValueChange={(value) => handleSelectChange(value, 'hipmiPtOrigin')}
                      >
                        <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                          <SelectValue placeholder="Select your HIPMI PT" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-700 max-h-[300px]">
                          {hipmiPtOriginOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.hipmiPtOrigin && (
                        <p className="text-red-400 text-sm mt-1">{errors.hipmiPtOrigin}</p>
                      )}
                      
                      {formData.hipmiPtOrigin === 'other' && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-300 mb-1">Please specify your HIPMI PT</label>
                          <Input
                            name="otherOrigin"
                            value={formData.otherOrigin || ''}
                            onChange={handleInputChange}
                            placeholder="Enter your HIPMI PT name"
                            className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                          />
                          {errors.otherOrigin && (
                            <p className="text-red-400 text-sm mt-1">{errors.otherOrigin}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      What do you expect from this networking night?
                    </label>
                    <div className="space-y-3">
                      {expectationOptions.map((option) => (
                        <div 
                          key={option.id}
                          className="flex items-start p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-juneBud/60 transition-colors"
                        >
                          <Checkbox
                            id={`expectation-${option.id}`}
                            checked={selectedExpectations.includes(option.id)}
                            onCheckedChange={(checked) => handleExpectationChange(option.id, checked === true)}
                            className="mt-1 h-4 w-4 rounded border-gray-700 text-juneBud focus:ring-juneBud/20"
                          />
                          <label htmlFor={`expectation-${option.id}`} className="ml-2 block cursor-pointer">
                            <span className="font-medium">{option.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.expectations && (
                      <p className="text-red-400 text-sm mt-2">{errors.expectations}</p>
                    )}
                  </div>
                  
                  {selectedExpectations.includes('other') && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Please specify your expectation</label>
                      <Input
                        name="otherExpectation"
                        value={formData.otherExpectation || ''}
                        onChange={handleInputChange}
                        placeholder="Other expectation from the event"
                        className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                      />
                      {errors.otherExpectation && (
                        <p className="text-red-400 text-sm mt-1">{errors.otherExpectation}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-juneBud">Business Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-black/40 rounded-lg border border-gray-700">
                    <div>
                      <h3 className="font-medium">Do you have a business?</h3>
                      <p className="text-sm text-gray-400">Let us know if you're an entrepreneur</p>
                    </div>
                    <Switch 
                      checked={formData.hasBusiness}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                  
                  {formData.hasBusiness && (
                    <div className="space-y-4 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-juneBud/20">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
                        <Input
                          name="businessName"
                          value={formData.businessName || ''}
                          onChange={handleInputChange}
                          placeholder="Enter your business name"
                          className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                        />
                        {errors.businessName && (
                          <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Business Field</label>
                        <Select
                          value={formData.businessField || ''}
                          onValueChange={(value) => handleSelectChange(value, 'businessField')}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen">
                            <SelectValue placeholder="Select business field" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-700">
                            {businessFieldOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.businessField && (
                          <p className="text-red-400 text-sm mt-1">{errors.businessField}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Business Description</label>
                        <Textarea
                          name="businessDescription"
                          value={formData.businessDescription || ''}
                          onChange={handleInputChange}
                          placeholder="Briefly describe your business"
                          className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500 min-h-[100px]"
                        />
                        {errors.businessDescription && (
                          <p className="text-red-400 text-sm mt-1">{errors.businessDescription}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Business Social Media (optional)</label>
                        <Input
                          name="businessSocial"
                          value={formData.businessSocial || ''}
                          onChange={handleInputChange}
                          placeholder="Instagram: @yourbusiness, Website: example.com"
                          className="bg-black/50 border-gray-700 focus:border-juneBud focus:ring-juneBud/20 text-linen placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-juneBud">Payment Information</h2>
                
                <Alert className="bg-juneBud/10 border-juneBud/20 text-linen mb-6">
                  <AlertDescription>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">Registration Fee:</span>
                      <span className="text-xl font-bold text-juneBud">Rp {paymentAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm mb-3">Please transfer the registration fee to:</p>
                    <div className="bg-black/30 rounded-lg p-3 mb-3">
                      <p className="font-medium">Bank BLU</p>
                      <p>Account Number: 007033578200</p>
                      <p>Account Name: Cherien Stevie</p>
                    </div>
                    <p className="text-sm">After making the payment, please upload your payment proof below.</p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    {/* Show original document section if available */}
                    {editMode && originalDocURL && (
                      <div className="mb-4 border border-gray-700 rounded-lg p-4 bg-black/30">
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-medium text-juneBud">Current Payment Proof</h3>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-sm text-juneBud bg-juneBud/10 hover:text-juneBud hover:bg-juneBud/20 border-juneBud/30"
                            onClick={viewOriginalDocument}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Current Proof
                          </Button>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Your previously submitted payment proof is still available.</p>
                      </div>
                    )}
                    
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {editMode ? 'Upload New Payment Proof (Optional)' : 'Upload Payment Proof'}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-juneBud/30 rounded-lg hover:border-juneBud transition-colors bg-black/50">
                      <div className="space-y-1 text-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="mx-auto h-12 w-12 text-juneBud hover:text-juneBud/80 transition-colors" />
                        </label>
                        <div className="flex text-sm text-gray-300 justify-center">
                          <p className="text-gray-400">Upload payment proof</p>
                        
                          <Input
                            id="file-upload"
                            name="paymentProofFile"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            ref={fileInputRef}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, or PDF (max 5MB)
                        </p>
                        {formData.paymentProofFile && (
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
                            <p className="text-sm text-linen/80 mt-1">{formData.paymentProofFile.name}</p>
                            <p className="text-xs text-linen/60 mt-1">
                              {(formData.paymentProofFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                        {editMode && !formData.paymentProofFile && originalDocURL && (
                          <p className="mt-2 text-sm text-juneBud/70">Using previously uploaded payment proof</p>
                        )}
                      </div>
                    </div>
                    {errors.paymentProofFile && (
                      <p className="text-red-400 text-sm mt-2">{errors.paymentProofFile}</p>
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
            
            {currentStep < 4 ? (
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
                onClick={(e) => onSubmit(e)}
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

export default NetworkingEventRegistrationForm;