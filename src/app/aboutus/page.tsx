import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="ABOUT US" />
            <AboutUs variant="secondary"/>
            <Footer />
        </div>
    );
}
