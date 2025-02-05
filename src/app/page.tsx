import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Hero from "@/components/homepage/Hero";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Hero />
            <AboutUs />
            <Footer />
        </div>
    );
}
