import Footer from "@/components/Footer";
import ShowArticle from "@/components/makarainspires/ShowArticle";
import Navbar from "@/components/Navbar";

export default function page() {
    return (
        <div className="font-poppins">
            <Navbar />
            <ShowArticle />
            <Footer />
        </div>
    );
}
