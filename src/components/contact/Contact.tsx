'use client';

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Users, MessageSquare, Send, Instagram, Twitter, Linkedin, Calendar, Trophy, Settings, Truck } from "lucide-react";

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

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
                            {["Name", "Email", "Mobile"].map((label, index) => (
                                <div 
                                    key={label}
                                    className={`
                                        space-y-3 transition-all duration-700
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                                >
                                    <label className="text-juneBud font-medium block text-lg">
                                        {label}
                                    </label>
                                    <Input 
                                        type="text"
                                        placeholder={`Enter your ${label.toLowerCase()}`}
                                        className="bg-linen/90 border-0 focus:ring-2 ring-cornflowerBlue/50 h-14 text-lg px-4
                                                 transition-all duration-300 hover:bg-linen focus:bg-linen"
                                    />
                                </div>
                            ))}
                            <div className={`
                                space-y-3 transition-all duration-700
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                            `}
                                style={{ transitionDelay: '800ms' }}
                            >
                                <label className="text-juneBud font-medium block text-lg">
                                    Message
                                </label>
                                <Textarea 
                                    placeholder="Type your message here..."
                                    className="bg-linen/90 border-0 focus:ring-2 ring-cornflowerBlue/50 min-h-[160px] text-lg px-4
                                             transition-all duration-300 hover:bg-linen focus:bg-linen resize-none"
                                />
                            </div>
                            <Button 
                                className={`
                                    mt-4 text-lg h-14 rounded-xl
                                    bg-gradient-to-r from-cornflowerBlue to-juneBud hover:opacity-90
                                    transition-all duration-500 group overflow-hidden relative
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                `}
                                style={{ transitionDelay: '1000ms' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-juneBud to-cornflowerBlue opacity-0 
                                              group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 mr-2">Submit Message</span>
                                <Send className="w-5 h-5 relative z-10 transition-all duration-500 
                                               group-hover:translate-x-1 group-hover:scale-110" />
                            </Button>
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