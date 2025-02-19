import ShowCard from "@/components/EventCompList";
import Footer from "@/components/Footer";
import AboutUs from "@/components/homepage/AboutUs";
import Hero from "@/components/homepage/Hero";
import Inspires from "@/components/homepage/Inspires";
import Speakers from "@/components/homepage/Speakers";
import Sponsors from "@/components/homepage/Sponsors";
import Timeline from "@/components/homepage/Timeline";
import Navbar from "@/components/Navbar";

import arifDarussalam from "@/assets/grandtalkshowJudges/ArifDarussalam.png";
import maulanaMuhammad from "@/assets/grandtalkshowJudges/MaulanaMuhammad.png";
import petrusHadiSatriaBapa from "@/assets/grandtalkshowJudges/PetrusHadiSatriaBapa.png";
import ranggaAnantaLaksamana from "@/assets/grandtalkshowJudges/RanggaAnantaLaksamana.png";
import renoAdityo from "@/assets/grandtalkshowJudges/RenoAdityo.png";
import rezaRizkyDarmawan from "@/assets/grandtalkshowJudges/RezaRizkyDarmawan.png";
import sammyRamadhan from "@/assets/grandtalkshowJudges/SammyRamadhan.png";

export default function page() {
    const cards = [
        { id: 1, title: "HIPMI TALKS", link: "#1" },
        { id: 2, title: "INTERNAL BUSINESS CLASS", link: "#2" },
        { id: 3, title: "NETWORKING NIGHT", link: "#3" },
    ];

    const grandTalkShowJudges = [
        {
            name: "Petrus Hadi Satria Bapa",
            role: "Managing Partner At Mesana Investama Utama",
            image: petrusHadiSatriaBapa,
        },
        {
            name: "Rangga Ananta Laksamana",
            role: "Commisioner PT. Trimegah Karya Pratama Tbk",
            image: ranggaAnantaLaksamana,
        },
        {
            name: "Arif Darussalam",
            role: "CEO & Founder PT. Kreatif Pesona Indonesia",
            image: arifDarussalam,
        },
        {
            name: "Maulana Muhammad",
            role: "Direktur Utama PT Batulicin Nusantara Maritim Tbk",
            image: maulanaMuhammad,
        },
        {
            name: "Sammy Ramadhan",
            role: "Founder Goers",
            image: sammyRamadhan,
        },
        {
            name: "Reza Rizky Darmawan",
            role: "Co-Founder & Managing Partner At Kisara Capital",
            image: rezaRizkyDarmawan,
        },
        {
            name: "Reno Adityo",
            role: "Co-Founder & Director PT. Lamandau Subur Sejahtera",
            image: renoAdityo,
        },
    ];

    return (
        <div className="font-poppins">
            <Navbar />
            <Hero />
            <AboutUs height={800} />
            <ShowCard title="UPCOMING EVENTS" cardsList={cards} />
            <Timeline />
            <Speakers
                title1="PAST JUDGES"
                title2="GRAND TALKSHOW SPEAKERS"
                speakers={grandTalkShowJudges}
            />
            <Sponsors />
            <Inspires />
            <Footer />
        </div>
    );
}
