import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShowCard from "@/components/EventCompList";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="EVENT" />
            <ShowCard title="ARE YOU READY?" variant="secondary"/>
            <Footer />
        </div>
    );
}
