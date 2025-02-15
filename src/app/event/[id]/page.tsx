import Banner from "@/components/Banner";
import ShowEvent from "@/components/eventmenu/ShowEvent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Event Details | Makarapreneur",
    description: "Event Details Page",
};

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
