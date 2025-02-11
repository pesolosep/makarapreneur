import Banner from "@/components/Banner";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
