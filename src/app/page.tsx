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
    const cards = [
        { id: 1, title: "HIPMI TALKS", link: "#1" },
        { id: 2, title: "INTERNAL BUSINESS CLASS", link: "#2" },
        { id: 3, title: "NETWORKING NIGHT", link: "#3" }
    ];

    return (
        <div className="font-poppins">
            <Navbar />
            <Hero />
            <AboutUs height={800} />
            <ShowCard title="UPCOMING EVENTS" cardsList={cards}/>
            <Timeline />
            <Speakers />
            <Sponsors />
            <Inspires />
            <Footer />
        </div>
    );
}
