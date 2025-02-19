import Mission from "@/components/aboutus/Mission";
import Prinsip from "@/components/aboutus/Prinsip";
import Vision from "@/components/aboutus/Vision";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Navbar from "@/components/Navbar";
import Slideshow from "@/components/UseCarousel";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Makarapreneur",
    description: "About Us Page",
};

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="ABOUT US" />
            <AboutUs variant="secondary" />
            <div className=" max-w-screen overflow-x-hidden">
            <Prinsip />
            <Vision />
            <Mission />
            </div>
            <Slideshow />
            <Footer />
        </div>
    );
}
