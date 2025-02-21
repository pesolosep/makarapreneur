import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShowCard from "@/components/EventCompList";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Event | Makarapreneur",
    description: "Event Page",
};

export default function page() {
    const cards = [
        { id: 1, title: "HIPMI TALKS", link: "/event/hipmitalks" },
        { id: 2, title: "INTERNAL BUSINESS CLASS", link: "/event/internalbusinessclass" },
        { id: 3, title: "NETWORKING NIGHT", link: "/event/networkingnight" }
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
