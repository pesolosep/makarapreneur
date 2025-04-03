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

import budimanSudjatmiko from "@/assets/grandtalkshowSpeakers/BudimanSudjatmiko.png";
import eddiDanusaputro from "@/assets/grandtalkshowSpeakers/EddiDanusaputro.png";
import kaesangPangarep from "@/assets/grandtalkshowSpeakers/KaesangPangarep.png";
import mPradanaIndaputra from "@/assets/grandtalkshowSpeakers/M_PradanaIndaputra.png";
import poppyZeidra from "@/assets/grandtalkshowSpeakers/PoppyZeidra.png";
import rMahelanPrabantarikso from "@/assets/grandtalkshowSpeakers/R_MahelanPrabantarikso.png";
import richieAdrianHS from "@/assets/grandtalkshowSpeakers/RichieAdrianH_S.png";
import sandiagaUno from "@/assets/grandtalkshowSpeakers/SandiagaUno.png";
import teguhKurniawanHarmanda from "@/assets/grandtalkshowSpeakers/TeguhKurniawanHarmanda.png";

import ranggaDeranaNiode from "@/assets/hipmiTalksSpeakers/RanggaDeranaNiode.png";
import renoAditya from "@/assets/hipmiTalksSpeakers/RenoAditya.png";
import riandyHaroen from "@/assets/hipmiTalksSpeakers/RiandyHaroen.png";
import rikaAmelia from "@/assets/hipmiTalksSpeakers/RikaAmelia.png";
import satrioRama from "@/assets/hipmiTalksSpeakers/SatrioRama.png";
import sonaMaesana from "@/assets/hipmiTalksSpeakers/SonaMaesana.png";

import hipmiTalks from "@/assets/makarapreneur/hipmitalks.jpg"
import internalBusinessClass from "@/assets/makarapreneur/internalbusinessclass.jpg"
import networkingNight from "@/assets/makarapreneur/aboutus.jpg"

export default function page() {
    const cards = [
        { id: 1, title: "HIPMI TALKS", link: "/event/hipmitalks", image: hipmiTalks },
        { id: 2, title: "HIPMI UI BUSINESS CLASS", link: "/event/internalbusinessclass", image: internalBusinessClass },
        { id: 3, title: "NETWORKING NIGHT", link: "/event/networkingnight", image: networkingNight }
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

    const grandTalkShowSpeakers = [
        {
            name: "Budiman Sudjatmiko",
            role: "Ketua Gerakan Inovator 4.0",
            image: budimanSudjatmiko,
        },
        {
            name: "Eddi Danusaputro",
            role: "CEO BNI Venture",
            image: eddiDanusaputro,
        },
        {
            name: "Kaesang Pangarep",
            role: "Founder & CEO Sang Pisang",
            image: kaesangPangarep,
        },
        {
            name: "M. Pradana Indaputra",
            role: "Staff Khusus Bidang Peningkatan Pengusaha Nasional Keminvest/BKPM",
            image: mPradanaIndaputra,
        },
        {
            name: "Poppy Zeidra",
            role: "Ketua Dpeartment CSR BPP HIPMI Sinergitas BUMN BUMD",
            image: poppyZeidra,
        },
        {
            name: "R. Mahelan Prabantarikso",
            role: "Direktur Utama PT Asuransi Jiwasraya",
            image: rMahelanPrabantarikso,
        },
        {
            name: "Richie Adrian H. S",
            role: "Direktur Utama PT. Harta Djaya Karya Tbk",
            image: richieAdrianHS,
        },
        {
            name: "Sandiaga Uno",
            role: "Menteri Pariwisata dan Ekonomi Kreatif Republik Indonesia",
            image: sandiagaUno,
        },
        {
            name: "Teguh Kurniawan Harmanda",
            role: "Direktur Utama Peruri Digital Security",
            image: teguhKurniawanHarmanda,
        },
    ];

    const hipmiTalksSpeakers = [
        {
            name: "Rangga Derana Niode",
            role: "Ketua Umum BPC HIPMI Kepulauan Seribu & Direktur PT Regal Infinity Seulawah",
            image: ranggaDeranaNiode,
        },
        {
            name: "Reno Aditya",
            role: "Wakil Bendahara Umum BPD HIPMI Jaya & Co-Founder and Direktur Lamandau Group",
            image: renoAditya,
        },
        {
            name: "Riandy Haroen",
            role: "Ketua Umum BPC HIPMI Jakarta Pusat & Direktur Utama PT. Maskapai Industri Pembangunan Utama",
            image: riandyHaroen,
        },
        {
            name: "Rika Amelia",
            role: "Ketua Umum BPC HIPMI Jakarta Barat & Direktur Making Name Studio",
            image: rikaAmelia,
        },
        {
            name: "Satrio Rama",
            role: "Ketua Umum BPC HIPMI Jakarta Timur & Direktur Utama PT Data Decon",
            image: satrioRama,
        },
        {
            name: "Sona Maesana",
            role: "Ketua Umum BPD HIPMI Jaya & CEO Satria Akasa Investama",
            image: sonaMaesana,
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
            <Speakers
                title1="PAST SPEAKERS"
                title2="GRAND TALKSHOW SPEAKERS"
                speakers={grandTalkShowSpeakers}
                variant="secondary"
            />
            <Speakers
                title1="PAST SPEAKERS"
                title2="PRE-EVENT SPEAKERS: HIPMI TALKS"
                speakers={hipmiTalksSpeakers}
            />
            <Sponsors />
            <Inspires />
            <Footer />
        </div>
    );
}
