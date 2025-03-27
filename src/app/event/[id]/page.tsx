import Banner from "@/components/Banner";
import EventDetail from "@/components/event/event-detail";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import hipmiTalks from "@/assets/makarapreneur/hipmitalks.jpg"
import internalBusinessClass from "@/assets/makarapreneur/internalbusinessclass.jpg"
import networkingNight from "@/assets/makarapreneur/aboutus.jpg"

export const metadata: Metadata = {
    title: "Event Details | Makarapreneur",
    description: "Event Details Page",
};

type EventId = "hipmitalks" | "internalbusinessclass" | "networkingnight";

export default async function page({
    params,
}: {
    params: Promise<{ id: EventId }>;
}) {
    const id = (await params).id;

    const event = {
hipmitalks: {
    id: "hipmitalks",
    title: "HIPMI Talks UI",
    description: [
        "HIPMI Talks UI 2025 adalah acara pra-event untuk Makarapreneur 2025 yang bertujuan memberikan wawasan berharga dan menginspirasi generasi muda dalam dunia kewirausahaan. Acara ini mengusung format talk show dan menghadirkan empat pembicara berpengalaman dari berbagai sektor, yang akan berbagi pengetahuan dan pengalaman mengenai strategi berfokus pada pelanggan.",
        "Dengan tema “Customer-Centric 101: Transforming Insights into Impactful Solutions”, HIPMI Talks UI 2025 akan memberikan wawasan praktis tentang cara memahami kebutuhan pelanggan dan mengubah wawasan tersebut menjadi solusi yang relevan dan berdampak. Melalui pendekatan yang berfokus pada pelanggan, acara ini bertujuan untuk memberikan strategi kepada para wirausahawan agar mereka dapat menghadapi tantangan, memanfaatkan peluang, dan berkontribusi pada pertumbuhan ekonomi yang berkelanjutan.",
    ],
    theme: "Customer-Centric 101: Transforming Insights into Impactful Solutions",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSclfEodOTaJpdUc-AAsi1EXoESMDiBaCAO_2CkVFcx2mQ3DSw/viewform?usp=sharing",
    image: hipmiTalks,
    date: "Kamis, 17 April 2025",
    time: "14.00-17.05",
    location: "Universitas Indonesia"
},
internalbusinessclass: {
    id: "internalbusinessclass",
    title: "HIPMI UI Business Class",
    description: [
        "**HIPMI UI Business Class** merupakan *workshop* kewirausahaan untuk para fungsionaris dan anggota HIPMI PT UI yang terbagi menjadi enam episode dengan penyajian tiga episode pada setiap segmentasi audiens; \n1. *Advance*  : mereka yang sudah terjun sebagai pelaku usaha \n \n2. *Beginners* : mereka yang baru akan menggeluti dunia wirausaha \n\n\nSetiap episode disusun secara sistematis untuk memenuhi kebutuhan masing-masing segmen audiens. Untuk audiens *advance*, disediakan pembekalan wawasan yang komprehensif dari berbagai sektor usaha, sedangkan untuk *beginners*, materi disajikan secara bertahap dan berkesinambungan agar lebih mudah dipahami.",
        "Tema tiap episode sebagai berikut:\n - * Eps 1 Beginners : \"***From Concept to Reality: Exploring Business Ideas and Targeting Potential Markets***\"\n\n - * Eps 2 Beginners    : \"***Building Your Business Blueprint: From Idea to Execution***\"\n\n - * Eps 3 Beginners : \"***Branding from Scratch: A Guide to Building Your Business and Its Identity***\"\n\n\n\n\n - * Eps 1 Advance : \"***Becoming the Icon of F&B: Building a Brand That Defines the Future***\"\n\n - * Eps 2 Advance  : \"***Innovative Disruption: Crafting the Future of Creative Industries***\"\n\n - * Eps 3 Advance : \"***Future-Proofing Your Digital Products: Strategies to Stay Ahead in a Rapidly Changing Market***\"",
        "Jadwal Pelaksanaan:\n\n**BEGINNERS**\n- Eps 1: Sabtu, 12 April 2025\n- Eps 2: Jum'at, 25 April 2025\n- Eps 3: Jum'at, 9 Mei 2025\n\n**ADVANCE**\n- Eps 1: Jum'at, 18 April 2025\n- Eps 2: Jum'at, 2 Mei 2025\n- Eps 3: Jum'at, 16 Mei 2025"
    ],
    link: "internal",
    image: internalBusinessClass,
    date: "Multiple Dates (April - Mei 2025)",
    time: "Informed after registration",
    location: "Universitas Indonesia"
},
networkingnight: {
    id: "networkingnight",
    title: "Networking Night",
    description: [
        "Networking Night 2025 merupakan salah satu rangkaian acara dalam Makarapreneur 2025 yang bertujuan untuk menyatukan individu dari berbagai sektor bisnis dan wilayah. Acara ini dirancang untuk memperluas jaringan, mendorong kolaborasi, dan menciptakan kesempatan masa depan bagi para peserta.",
        "Dengan tema “Membangun Koneksi, Menciptakan Peluang”, Networking Night akan dilaksanakan dalam beberapa sesi dengan agenda yang bervariasi, termasuk pertemuan dengan anggota HIPMI PT dari seluruh Indonesia, serta pakar bisnis, juri, dan investor",
        "Acara ini memberikan platform yang unik bagi para wirausahawan dan profesional untuk berinteraksi, berbagi ide, dan mengeksplorasi kolaborasi potensial yang dapat mendorong pertumbuhan dan kesuksesan bisnis jangka panjang.",
    ],
    theme: "Membangun Koneksi, Menciptakan Peluang",
    link: "internal",
    image: networkingNight,
    date: "17 April 2025",
    time: "Informed after registration",
    location: "Universitas Indonesia"
}
    };

    return (
        <div className="font-poppins">
            <Navbar />
            <Banner title={event[id].title} />
            <div className="bg-signalBlack">
                <div className="py-6">
                    <EventDetail event={event[id]} />
                </div>
            </div>
            <Footer />
        </div>
    );
}