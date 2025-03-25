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
            title: "HIPMI Talks UI",
            description: [
                "HIPMI Talks UI 2025 adalah acara pra-event untuk Makarapreneur 2025 yang bertujuan memberikan wawasan berharga dan menginspirasi generasi muda dalam dunia kewirausahaan. Acara ini mengusung format talk show dan menghadirkan empat pembicara berpengalaman dari berbagai sektor, yang akan berbagi pengetahuan dan pengalaman mengenai strategi berfokus pada pelanggan.",
                "Dengan tema “Customer-Centric 101: Transforming Insights into Impactful Solutions”, HIPMI Talks UI 2025 akan memberikan wawasan praktis tentang cara memahami kebutuhan pelanggan dan mengubah wawasan tersebut menjadi solusi yang relevan dan berdampak. Melalui pendekatan yang berfokus pada pelanggan, acara ini bertujuan untuk memberikan strategi kepada para wirausahawan agar mereka dapat menghadapi tantangan, memanfaatkan peluang, dan berkontribusi pada pertumbuhan ekonomi yang berkelanjutan.",
            ],
            theme: "Customer-Centric 101: Transforming Insights into Impactful Solutions",
            link: "disabled",
            image: hipmiTalks
        },
        internalbusinessclass: {
            title: "Internal Business Class",
            description: [
                "Internal Business Class (IBC) 2025 adalah workshop kewirausahaan yang dirancang khusus untuk fungsionaris dan anggota HIPMI PT UI. Workshop ini terdiri dari 6 episode yang terbagi menjadi dua segmen audiens: lanjutan (bagi mereka yang sudah berpraktik dalam dunia bisnis) dan pemula (bagi mereka yang baru mulai menjelajahi dunia kewirausahaan)",
                "Setiap episode disusun dengan struktur sistematis untuk memenuhi kebutuhan spesifik masing-masing segmen audiens. Bagi audiens tingkat lanjut, IBC akan memberikan wawasan komprehensif dari berbagai sektor bisnis untuk memperdalam pemahaman dan keterampilan mereka. Sementara itu, bagi pemula, materi disampaikan secara bertahap dan berkelanjutan untuk memastikan pemahaman yang lebih mudah dan menyeluruh",
            ],
            link: "disabled",
            image: internalBusinessClass
        },
        networkingnight: {
            title: "Networking Night",
            description: [
                "Networking Night 2025 merupakan salah satu rangkaian acara dalam Makarapreneur 2025 yang bertujuan untuk menyatukan individu dari berbagai sektor bisnis dan wilayah. Acara ini dirancang untuk memperluas jaringan, mendorong kolaborasi, dan menciptakan kesempatan masa depan bagi para peserta.",
                "Dengan tema “Membangun Koneksi, Menciptakan Peluang”, Networking Night akan dilaksanakan dalam beberapa sesi dengan agenda yang bervariasi, termasuk pertemuan dengan anggota HIPMI PT dari seluruh Indonesia, serta pakar bisnis, juri, dan investor",
                "Acara ini memberikan platform yang unik bagi para wirausahawan dan profesional untuk berinteraksi, berbagi ide, dan mengeksplorasi kolaborasi potensial yang dapat mendorong pertumbuhan dan kesuksesan bisnis jangka panjang.",
            ],
            theme: "Membangun Koneksi, Menciptakan Peluang",
            link: "https://forms.gle/ZUtGvzZUUUXSB69v5",
            image: networkingNight
        },
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
