import Footer from "@/components/Footer";
import Home from "@/components/homepage/Home";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Home />
            <Footer />
        </div>
    );
}
