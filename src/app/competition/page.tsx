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
    const cards = [
        { id: 1, title: "BUSINESS PLAN COMPETITION - SMA", link: "/business-plan" },
        { id: 2, title: "BUSINESS PLAN COMPETITION - MAHASISWA", link: "/highschool-business-plan" },
        { id: 3, title: "BUSINESS CASE COMPETITION", link: "/business-case" },
    ];

    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title="COMPETITION" />
            <ShowCard title="ARE YOU READY TO COMPETE?" cardsList={cards} />
            <Testimonial />
            <Description
                number={1}
                title="TINGKAT SMA - NATIONAL BUSINESS PLAN COMPETITION"
                description="Dirancang untuk menginspirasi siswa dalam menciptakan ide bisnis yang kreatif, inovatif, dan praktis, serta membangun pemahaman dasar tentang kewirausahaan."
                link = "/business-plan"
            />
            <Description
                variant="secondary"
                number={2}
                title="TINGKAT MAHASISWA - NATIONAL BUSINESS PLAN COMPETITION"
                description="Platform bagi mahasiswa untuk mengasah keterampilan dalam perencanaan dan pelaksanaan bisnis, dengan fokus pada strategi pertumbuhan dan keberlanjutan."
                link = "/highschool-business-plan"
            />
            <Description
                number={3}
                title="TINGKAT MAHASISWA - NATIONAL BUSINESS CASE COMPETITION"
                description="Menantang peserta untuk menganalisis dan memberikan solusi strategis terhadap permasalahan bisnis di dunia nyata, mengasah kemampuan berpikir kritis, inovatif, dan berbasis data."
                link = "/business-case"
            />
            <Footer />
        </div>
    );
}
