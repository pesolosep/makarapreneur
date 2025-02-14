import Image from "next/image";
import map from "@/assets/dummyMap.svg";
import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div className="min-h-[389px] w-full bg-linen text-signalBlack bottom-0 pt-8 flex flex-col">
                <div className="flex justify-between w-full mt-5 min-h-[250px] px-12 flex-wrap gap-y-5 mb-5">
                    <div>
                        <h3 className="text-cornflowerBlue font-semibold text-lg mb-5">
                            About Us
                        </h3>
                        <p className="max-w-[292px] font-medium">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-cornflowerBlue font-semibold text-lg mb-5">
                            Navigation Bar
                        </h3>
                        <ul className="font-medium flex flex-col gap-1">
                            <Link href={'#'} className="linkFooter">
                                <li>Home</li>
                            </Link>
                            <Link href={'#'} className="linkFooter">
                                <li>About</li>
                            </Link>
                            <Link href={'#'} className="linkFooter">
                                <li>Competition</li>
                            </Link>
                            <Link href={'#'} className="linkFooter">
                                <li>Event</li>
                            </Link>
                            <Link href={'#'} className="linkFooter">
                                <li>Makara Inspires</li>
                            </Link>
                            <Link href={'#'} className="linkFooter">
                                <li>Contact</li>
                            </Link>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-cornflowerBlue font-semibold text-lg mb-5">
                            Location
                        </h3>
                        <Image src={map} alt="map" />
                    </div>
                </div>
                <div className="flex justify-between mt-auto py-4 border-t border-signalBlack px-12 font-medium">
                    <h3>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </h3>
                    <h3>Follow us:</h3>
                </div>
            </div>
        </footer>
    );
}
