import ShowCard from "@/components/EventCompList";
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Hero from "@/components/homepage/Hero";
import Inspires from "@/components/homepage/Inspires";
import Speakers from "@/components/homepage/Speakers";
import Sponsors from "@/components/homepage/Sponsors";
import Timeline from "@/components/homepage/Timeline";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Hero />
            <AboutUs />
            <ShowCard title="UPCOMING EVENTS" />
            <Timeline />
            <Speakers />
            <Sponsors />
            <Inspires />
            <Footer />
        </div>
    );
}
