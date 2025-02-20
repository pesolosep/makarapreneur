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
        { id: 1, title: "HIPMI TALKS", link: "#1" },
        { id: 2, title: "INTERNAL BUSINESS CLASS", link: "#2" },
        { id: 3, title: "NETWORKING NIGHT", link: "#3" }
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
