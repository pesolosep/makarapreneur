import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShowCard from "@/components/EventCompList";
import type { Metadata } from "next";
import hipmiTalks from "@/assets/makarapreneur/hipmitalks.jpg"
import internalBusinessClass from "@/assets/makarapreneur/internalbusinessclass.jpg"
import networkingNight from "@/assets/makarapreneur/aboutus.jpg"

export const metadata: Metadata = {
    title: "Event | Makarapreneur",
    description: "Event Page",
};

export default function page() {
    const cards = [
        { id: 1, title: "HIPMI TALKS", link: "/event/hipmitalks", image: hipmiTalks },
        { id: 2, title: "INTERNAL BUSINESS CLASS", link: "/event/internalbusinessclass", image: internalBusinessClass },
        { id: 3, title: "NETWORKING NIGHT", link: "/event/networkingnight", image: networkingNight }
    ];

    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="EVENT" />
            <ShowCard title="ARE YOU READY?" variant="secondary" cardsList={cards}/>
            <Footer />
        </div>
    );
}
