"use client";
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { competitionService } from '@/lib/firebase/competitionService';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'firebase/auth';

interface FormData {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  member1Name: string;
  member1Email: string;
  member2Name: string;
  member2Email: string;
  registrationFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    member1Name: '',
    member1Email: '',
    member2Name: '',
    member2Email: '',
    registrationFile: null
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }else{
        console.log("ini user " + user)
    }
  }, [user, loading, router]);

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.teamName) newErrors.teamName = 'Team name is required';
    if (!formData.leaderName) newErrors.leaderName = 'Leader name is required';
    if (!formData.member1Name) newErrors.member1Name = 'Member 1 name is required';

    if (!formData.leaderEmail) {
      newErrors.leaderEmail = 'Leader email is required';
    } else if (!validateEmail(formData.leaderEmail)) {
      newErrors.leaderEmail = 'Invalid email address';
    }

    if (!formData.member1Email) {
      newErrors.member1Email = 'Member 1 email is required';
    } else if (!validateEmail(formData.member1Email)) {
      newErrors.member1Email = 'Invalid email address';
    }

    if (formData.member2Email && !validateEmail(formData.member2Email)) {
      newErrors.member2Email = 'Invalid email address';
    }

    if (!formData.registrationFile) {
      newErrors.registrationFile = 'Registration file is required';
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      registrationFile: file
    }));
    
    if (errors.registrationFile) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.registrationFile;
        return newErrors;
      });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (!user) {
        throw new Error('You must be logged in to register');
      }

      const teamData = {
        userId: user.uid,
        teamName: formData.teamName,
        teamLeader: {
          name: formData.leaderName,
          email: formData.leaderEmail,
        },
        members: {
          member1: {
            name: formData.member1Name,
            email: formData.member1Email,
          },
          member2: formData.member2Name ? {
            name: formData.member2Name,
            email: formData.member2Email,
          } : undefined,
        },
        registrationDate: new Date(),
      };

      const competitionId = 'business-plan'; // Replace with actual competition ID
      const userId = user?.uid;
      if (!formData.registrationFile) {
        throw new Error('Registration file is required');
      }

      await competitionService.registerTeam(
        userId,
        competitionId,
        teamData,
        formData.registrationFile
      );

      toast({
        title: "Registration Successful",
        description: "Your team has been registered. Please wait for admin approval.",
      });

      router.push('/competition/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register team",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Team Registration</h1>

        <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Team Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Information</h2>
            <Input
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              placeholder="Team Name"
              className="mb-2"
            />
            {errors.teamName && (
              <p className="text-red-500 text-sm">{errors.teamName}</p>
            )}
          </div>

          {/* Team Leader Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Leader</h2>
            <div className="space-y-2">
              <Input
                name="leaderName"
                value={formData.leaderName}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
              {errors.leaderName && (
                <p className="text-red-500 text-sm">{errors.leaderName}</p>
              )}
              <Input
                name="leaderEmail"
                value={formData.leaderEmail}
                onChange={handleInputChange}
                type="email"
                placeholder="Email"
              />
              {errors.leaderEmail && (
                <p className="text-red-500 text-sm">{errors.leaderEmail}</p>
              )}
            </div>
          </div>

          {/* Team Members Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <div className="space-y-4">
              {/* Member 1 */}
              <div className="space-y-2">
                <Input
                  name="member1Name"
                  value={formData.member1Name}
                  onChange={handleInputChange}
                  placeholder="Member 1 Full Name"
                />
                {errors.member1Name && (
                  <p className="text-red-500 text-sm">{errors.member1Name}</p>
                )}
                <Input
                  name="member1Email"
                  value={formData.member1Email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Member 1 Email"
                />
                {errors.member1Email && (
                  <p className="text-red-500 text-sm">{errors.member1Email}</p>
                )}
              </div>

              {/* Member 2 (Optional) */}
              <div className="space-y-2">
                <Input
                  name="member2Name"
                  value={formData.member2Name}
                  onChange={handleInputChange}
                  placeholder="Member 2 Full Name (Optional)"
                />
                <Input
                  name="member2Email"
                  value={formData.member2Email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Member 2 Email (Optional)"
                />
                {errors.member2Email && (
                  <p className="text-red-500 text-sm">{errors.member2Email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Registration File Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Registration Document</h2>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            {errors.registrationFile && (
              <p className="text-red-500 text-sm">{errors.registrationFile}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Registration'
            )}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}