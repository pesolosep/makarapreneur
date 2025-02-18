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
            <Description 
        number={1}
        title="Business Plan Competition"
        description="Join our premier business plan competition where innovative ideas meet opportunity. Present your groundbreaking business concept to industry experts and win substantial funding to kickstart your venture."
        registerLink="/competition/business-plan/"
      />

      <Description 
        variant="secondary"
        number={2}
        title="Case Competition"
        description="Put your analytical and problem-solving skills to the test in our case competition. Work with a talented team to analyze real-world business scenarios and present your strategic solutions to a panel of distinguished judges."
        registerLink="/competition/case/register"
      />

      <Description 
        number={3}
        title="Innovation Challenge"
        description="Showcase your innovative thinking in our technology-focused challenge. Develop cutting-edge solutions to real industry problems and get the chance to implement your ideas with leading tech companies."
        registerLink="/competition/innovation/register"
      />
            <Footer />
        </div>
    );
}
