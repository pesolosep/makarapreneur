/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Competition } from '@/models/Competition';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InformationCard from "@/components/competition/InformationCard";
import AboutUs from '@/components/homepage/AboutUs';

interface BusinessCaseContentProps {
  competition: Competition
}

export default function BusinessCaseContent({ competition }: BusinessCaseContentProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to allow for animations
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirectToRegister = () => {
    // Redirect to static URL for registration
    window.location.href = "https://makarapreneur.id/register";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-juneBud to-cornflowerBlue font-poppins">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-juneBud" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-juneBud to-cornflowerBlue font-poppins">
      <Navbar notTransparent />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24"
      >
        <InformationCard
          competition={competition}
          onRegister={handleRedirectToRegister}
        />
      </motion.main>
      
      <AboutUs />
      <Footer />
    </div>
  );
}