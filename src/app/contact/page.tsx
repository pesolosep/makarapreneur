import Banner from "@/components/Banner";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Makarapreneur",
    description: "Contact Us Page",
};

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="CONTACT US" />
            <Contact />
            <Footer />
        </div>
    );
}
