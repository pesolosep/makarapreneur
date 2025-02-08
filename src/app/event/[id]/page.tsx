import Banner from "@/components/Banner";
import ShowEvent from "@/components/eventmenu/ShowEvent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="EVENT #1"/>
            <ShowEvent />
            <Footer />
        </div>
    );
}
