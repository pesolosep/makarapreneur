import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Hero from "@/components/homepage/Hero";
import Speakers from "@/components/homepage/Speakers";
import Timeline from "@/components/homepage/Timeline";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Hero />
            <AboutUs />
            <Timeline />
            <Speakers />
            <Footer />
        </div>
    );
}
