import Banner from "@/components/Banner";
import Description from "@/components/competitionComprof/Description";
import Testimonial from "@/components/competitionComprof/Testimonial";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShowCard from "@/components/EventCompList";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Competition | Makarapreneur",
    description: "Competition Page",
};

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="COMPETITION" />
            <ShowCard title="ARE YOU READY TO COMPETE?" />
            <Testimonial />
            <Description  number={1}/>
            <Description variant="secondary" number={2}/>
            <Description  number={3}/>
            <Footer />
        </div>
    );
}
