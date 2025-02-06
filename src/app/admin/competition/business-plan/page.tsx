// src/app/page.js
"use client";
import { useState } from 'react';
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Navbar from "@/components/Navbar";
import InformationCard from "@/components/competition/InformationCard"; // Corrected import
import { AssignmentList } from "@/components/competition/AssignmentCard";
export default function Dashboard() {
  const [isRegistered, setIsRegistered] = useState(false);

  const toggleRegistration = () => {
    setIsRegistered(!isRegistered);
  };
    // Sample assignment data
    const assignments = [
        {
          id: '1',
          title: 'Preliminary Case',
          deadline: '5 Mei 2021',
          description: 'Pada tugas study case ini, Anda diminta untuk menganalisis masalah terkait user experience salah satu website/aplikasi guna meningkatkan interface dan user experience-nya. Gunakan framework Design Thinking dalam menganalisis masalah yang ada pada website/aplikasi tersebut.',
          status: 'Belum dikerjakan',
          submitterName: 'UXStudyCase_Kelompok3.zip',
          submissionTime: 'Senin, 3 Mei 2021 23:12 WIB'
        },
        {
          id: '2',
          title: 'UX STUDY CASE',
          deadline: '5 Mei 2021',
          description: 'Pada tugas study case ini, Anda diminta untuk menganalisis masalah terkait user experience salah satu website/aplikasi guna meningkatkan interface dan user experience-nya. Gunakan framework Design Thinking dalam menganalisis masalah yang ada pada website/aplikasi tersebut.',
          status: 'Belum dikerjakan'
        }
      ];
    const handleDownload = (id: string) => {
    console.log('Downloading assignment:', id);
    // Implement download logic here
    };

    const handleUpload = (id: string) => {
    console.log('Uploading assignment:', id);
    // Implement upload logic here
    };
    
  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Navbar />

      <InformationCard
        deadlineDate='5 Mei 2021'
        isRegistered={isRegistered}
        toggleRegistration={toggleRegistration}
      />
        {/* Assignment Section */}
        <div className="bg-gray-500">
        <h2 className="text-2xl font-bold mb-6 ml-4">Your Assignments</h2>
        <AssignmentList
        assignments={assignments}
        onDownload={handleDownload}
        onUpload={handleUpload}
        />
    </div>
      <AboutUs />
      <Footer />
    </div>
  );
}