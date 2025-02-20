'use client';

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Users, MessageSquare, Send, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

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

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const contactItems = [
        { icon: Users, title: "Sponsorship", color: "bg-juneBud" },
        { icon: Mail, title: "Media Partnership", color: "bg-cornflowerBlue" },
        { icon: Phone, title: "Public Relation", color: "bg-juneBud" },
        { icon: MessageSquare, title: "Contact Person", color: "bg-cornflowerBlue" }
    ];

    const socialIcons = [
        { icon: Instagram, color: "bg-gradient-to-br from-juneBud to-cornflowerBlue" },
        { icon: Twitter, color: "bg-gradient-to-br from-juneBud to-cornflowerBlue" },
        { icon: Facebook, color: "bg-gradient-to-br from-juneBud to-cornflowerBlue" },
        { icon: Linkedin, color: "bg-gradient-to-br from-juneBud to-cornflowerBlue" }
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
                bg-linen max-w-[1400px] mx-auto rounded-3xl px-8 lg:px-16 py-20
                transition-all duration-1000 transform
                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
                relative overflow-hidden shadow-2xl
            `}>
                <div className="flex flex-wrap justify-between gap-16 lg:gap-24">
                    {/* Form Section */}
                    <Card className={`
                        w-full max-w-[600px] border-0 shadow-2xl bg-signalBlack rounded-3xl 
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
                        w-full max-w-[500px] space-y-8
                        transition-all duration-1000 delay-300
                        ${isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-12 -rotate-2'}
                    `}>
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                                FOR MORE DETAILS <br />
                                <span className="text-cornflowerBlue">CONTACT US!</span>
                            </h2>
                            <div className="h-1 w-32 bg-gradient-to-r from-cornflowerBlue to-juneBud rounded-full mt-6" />
                        </div>

                        <div className="space-y-6">
                            {contactItems.map((item, index) => (
                                <div 
                                    key={index}
                                    className={`
                                        flex gap-6 items-center
                                        transition-all duration-500 group
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    `}
                                    style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                                >
                                    <div className={`
                                        w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center
                                        transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
                                    `}>
                                        <item.icon className="w-7 h-7 text-signalBlack transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg mb-1">{item.title}</p>
                                        <p className="text-signalBlack/80">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                                    <button
                                        key={index}
                                        className={`
                                            w-12 h-12 rounded-xl ${social.color}
                                            flex items-center justify-center
                                            transition-all duration-300
                                            hover:scale-110 hover:rotate-6 hover:shadow-lg
                                        `}
                                    >
                                        <social.icon className="w-6 h-6 text-signalBlack transition-transform duration-300 hover:scale-110" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}