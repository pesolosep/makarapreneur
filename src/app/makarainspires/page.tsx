import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Inspires from "@/components/homepage/Inspires";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Makara Inspires | Makarapreneur",
    description: "Makara Inspires Page",
};

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="MAKARA INSPIRES" />
            <Inspires variant="secondary"/>
            <Footer />
        </div>
    );
}
