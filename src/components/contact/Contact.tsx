'use client';

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Users, MessageSquare, Send, Instagram, Twitter, Linkedin, Calendar, Trophy, Settings, Truck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        const currentSectionRef = sectionRef.current;
        if (currentSectionRef) {
            observer.observe(currentSectionRef);
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef);
            }
        };
    }, []);

    const contactItems = [
        { 
            icon: Users, 
            title: "Sponsorship", 
            color: "bg-juneBud",
            contact: "Umar (+62 821-2502-8592)"
        },
        { 
            icon: Mail, 
            title: "Media Partnership", 
            color: "bg-cornflowerBlue",
            contact: "Rafi (+62 811-1247-117)"
        },
        { 
            icon: Phone, 
            title: "Public Relation", 
            color: "bg-juneBud",
            contact: "Syauqi (+62 877-6031-3616)"
        },
        { 
            icon: MessageSquare, 
            title: "General Inquiries", 
            color: "bg-cornflowerBlue",
            contact: "Sabila (+62 812-1130-1903)"
        },
        {
            icon: Calendar,
            title: "Event",
            color: "bg-juneBud",
            contact: "Aqila (+62 812-1130-1903)"
        },
        {
            icon: Trophy,
            title: "Competition",
            color: "bg-cornflowerBlue",
            contact: "Nifara (+62 878-8305-3850)"
        },
        {
            icon: Settings,
            title: "Operational",
            color: "bg-juneBud",
            contact: "Dylan (+62 812-7433-9857)"
        },
        {
            icon: Truck,
            title: "Logistic",
            color: "bg-cornflowerBlue",
            contact: "Arsa (+62 851-5545-2071)"
        }
    ];

        const socialIcons = [
            { 
                icon: Instagram, 
                color: "bg-gradient-to-br from-juneBud to-cornflowerBlue",
                link: "https://www.instagram.com/makarapreneur"
            },
            { 
                icon: Twitter, 
                color: "bg-gradient-to-br from-juneBud to-cornflowerBlue",
                link: "https://x.com/makarapreneur"
            },
            { 
                icon: Linkedin, 
                color: "bg-gradient-to-br from-juneBud to-cornflowerBlue",
                link: "https://www.linkedin.com/in/makarapreneur-hipmi-pt-ui-71a9262b9/?originalSubdomain=id"
            }
        ];
    
    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    
    // Validate form
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast({
                title: "Form Validation Error",
                description: "Please fill in all required fields correctly.",
                variant: "destructive"
            });
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Create the HTML content for the admin email
            const adminHtml = `
                <h2>New Contact Message from ${formData.name}</h2>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Mobile:</strong> ${formData.mobile}</p>
                <p><strong>Message:</strong></p>
                <p>${formData.message.replace(/\\n/g, '<br>')}</p>
            `;
            
            // Create the HTML content for the user confirmation email
            const userHtml = `
                <h2>Thank you for contacting Makarapreneur!</h2>
                <p>Dear ${formData.name},</p>
                <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                <p>Your message:</p>
                <p><em>${formData.message.replace(/\\n/g, '<br>')}</em></p>
                <p>Best regards,<br>Makarapreneur Team</p>
            `;
            
            // Send email to admin
            const adminResponse = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: process.env.NEXT_PUBLIC_SMTP_USER,
                    subject: `Contact Message from ${formData.name} (${formData.email})`,
                    html: adminHtml
                }),
            });
            
            if (!adminResponse.ok) {
                throw new Error('Failed to send email to admin');
            }
            
            // Send confirmation email to user
            const userResponse = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: formData.email,
                    subject: 'Thank you for contacting Makarapreneur',
                    html: userHtml
                }),
            });
            
            if (!userResponse.ok) {
                throw new Error('Failed to send confirmation email');
            }
            
            // Show success message
            setSubmitSuccess(true);
            toast({
                title: "Message Sent Successfully",
                description: "Thank you for contacting us. We'll get back to you soon!",
                variant: "default"
            });
            
            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                mobile: '',
                message: ''
            });
            
            // Reset success state after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
            
        } catch (error) {
            console.error('Error sending emails:', error);
            toast({
                title: "Error Sending Message",
                description: "There was a problem sending your message. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={sectionRef} className="bg-signalBlack py-24 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(186,222,79,0.05),transparent_50%)]" />
                <div className={`
                    absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,149,237,0.05),transparent_50%)]
                    transition-opacity duration-1000
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                `} />
                <div className={`
                    absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(186,222,79,0.03),transparent_40%)]
                    transition-opacity duration-1000 delay-300
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                `} />
            </div>
            
            <div className={`
                bg-linen max-w-[1400px] mx-auto rounded-3xl px-6 lg:px-12 py-16
                transition-all duration-1000 transform
                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
                relative overflow-hidden shadow-2xl
            `}>
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
                    {/* Form Section */}
                    <Card className={`
                        w-full lg:max-w-[550px] border-0 shadow-2xl bg-signalBlack rounded-3xl 
                        transition-all duration-1000 
                        ${isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-12 rotate-2'}
                        hover:shadow-cornflowerBlue/20 hover:shadow-2xl
                    `}>
                        <CardContent className="p-10 gap-8 flex flex-col">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Input */}
                                <div 
                                    className={`
                                        space-y-3 transition-all duration-700
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: '200ms' }}
                                >
                                    <label className="text-juneBud font-medium block text-lg">
                                        Name
                                    </label>
                                    <Input 
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="bg-linen/90 border-0 focus:ring-2 ring-cornflowerBlue/50 h-14 text-lg px-4
                                                 transition-all duration-300 hover:bg-linen focus:bg-linen"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                                
                                {/* Email Input */}
                                <div 
                                    className={`
                                        space-y-3 transition-all duration-700
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: '400ms' }}
                                >
                                    <label className="text-juneBud font-medium block text-lg">
                                        Email
                                    </label>
                                    <Input 
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="bg-linen/90 border-0 focus:ring-2 ring-cornflowerBlue/50 h-14 text-lg px-4
                                                 transition-all duration-300 hover:bg-linen focus:bg-linen"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                                
                                {/* Mobile Input */}
                                <div 
                                    className={`
                                        space-y-3 transition-all duration-700
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: '600ms' }}
                                >
                                    <label className="text-juneBud font-medium block text-lg">
                                        Mobile
                                    </label>
                                    <Input 
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="Enter your mobile number"
                                        className="bg-linen/90 border-0 focus:ring-2 ring-cornflowerBlue/50 h-14 text-lg px-4
                                                 transition-all duration-300 hover:bg-linen focus:bg-linen"
                                    />
                                    {errors.mobile && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                                    )}
                                </div>
                                
                                {/* Message Textarea */}
                                <div 
                                    className={`
                                        space-y-3 transition-all duration-700
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: '800ms' }}
                                >
                                    <label className="text-juneBud font-medium block text-lg">
                                        Message
                                    </label>
                                    <Textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Type your message here..."
                                        className="bg-linen/90 border-0 focus:ring-2 ring-cornflowerBlue/50 min-h-[160px] text-lg px-4
                                                 transition-all duration-300 hover:bg-linen focus:bg-linen resize-none"
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                    )}
                                </div>
                                
                                {/* Submit Button */}
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        mt-4 text-lg h-14 rounded-xl w-full
                                        bg-gradient-to-r from-cornflowerBlue to-juneBud hover:opacity-90
                                        transition-all duration-500 group overflow-hidden relative
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                        ${isSubmitting ? 'opacity-80' : ''}
                                    `}
                                    style={{ transitionDelay: '1000ms' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-juneBud to-cornflowerBlue opacity-0 
                                                  group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2 relative z-10">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending...</span>
                                        </div>
                                    ) : submitSuccess ? (
                                        <div className="flex items-center justify-center gap-2 relative z-10">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Message Sent!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 relative z-10">
                                            <span>Submit Message</span>
                                            <Send className="w-5 h-5 transition-all duration-500 
                                                          group-hover:translate-x-1 group-hover:scale-110" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Section */}
                    <div className={`
                        w-full space-y-8
                        transition-all duration-1000 delay-300
                        ${isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-12 -rotate-2'}
                    `}>
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                                FOR MORE DETAILS <br />
                                <span className="text-cornflowerBlue">CONTACT US!</span>
                            </h2>
                            <div className="h-1 w-32 bg-gradient-to-r from-cornflowerBlue to-juneBud rounded-full mt-4 mb-8" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {contactItems.map((item, index) => (
                                <div 
                                    key={index}
                                    className={`
                                        flex gap-4 items-center
                                        transition-all duration-500 group
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: `${(index % 4 + 1) * 150}ms` }}
                                >
                                    <div className={`
                                        w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0
                                        transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
                                    `}>
                                        <item.icon className="w-6 h-6 text-signalBlack transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-base mb-1 truncate">{item.title}</p>
                                        <p className="text-signalBlack/80 text-sm">
                                            {item.contact}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Email address info */}
                        <div className={`
                            pt-4 transition-all duration-500 delay-1000
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}>
                            <p className="font-medium text-base">Email:</p>
                            <p className="text-signalBlack/80 text-sm mb-4">{process.env.NEXT_PUBLIC_SMTP_USER}</p>
                        </div>

                        <div className={`
                            pt-4 transition-all duration-500 delay-1000
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}>
                            <p className="font-medium text-lg mb-4">Connect with us!</p>
                            <div className="flex gap-4">
                                {socialIcons.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`
                                            w-12 h-12 rounded-xl ${social.color}
                                            flex items-center justify-center
                                            transition-all duration-300
                                            hover:scale-110 hover:rotate-6 hover:shadow-lg
                                        `}
                                    >
                                        <social.icon className="w-6 h-6 text-signalBlack transition-transform duration-300 hover:scale-110" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}