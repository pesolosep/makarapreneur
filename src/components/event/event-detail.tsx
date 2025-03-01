"use client";

import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import aboutUsDummy from "@/assets/aboutUsDummy.svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type EventDetailProps = {
    event: {
        title: string;
        description: string[];
        theme?: string;
        link: string;
    };
};

export default function EventDetail({ event }: EventDetailProps) {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-6 text-linen">
            {/* Header Image */}
            <div className="relative overflow-hidden rounded-lg mb-8">
                <Image
                    src={aboutUsDummy}
                    alt="HIPMI Talks UI 2025"
                    width={900}
                    height={300}
                    className="object-top"
                    priority
                />
            </div>

            {/* Event Header */}
            <div className="space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-juneBud w-max px-1 text-signalBlack">
                            {event.title}
                        </h1>
                        <p className="font-medium">
                            Pre-Event Makarapreneur 2025
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            size="lg"
                            className=""
                            disabled={event.link === "disabled"}
                            onClick={() => {
                                if (event.link !== "disabled") {
                                    window.open(event.link, "_blank");
                                }
                            }}
                        >
                            {event.link === "disabled"
                                ? "Coming Soon"
                                : "Daftar Sekarang"}
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="text-signalBlack bg-linen hover:bg-linen/50 border-0"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                const notification =
                                    document.createElement("div");
                                notification.className =
                                    "fixed bottom-4 right-4 bg-juneBud text-signalBlack px-4 py-2 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-500";
                                notification.textContent =
                                    "Link berhasil disalin!";
                                document.body.appendChild(notification);

                                setTimeout(() => {
                                    notification.style.opacity = "0";
                                    notification.style.transform =
                                        "translateY(100%)";
                                    setTimeout(() => {
                                        document.body.removeChild(notification);
                                    }, 500);
                                }, 2000);
                            }}
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Bagikan
                        </Button>
                    </div>
                </div>

                {/* Event Details */}
                <div className="grid sm:grid-cols-3 gap-4 bg-linen/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-juneBud" />
                        <div>
                            <p className="text-sm font-medium">Tanggal</p>
                            <p className="text-sm text-signalBlack">
                                Coming Soon
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-juneBud" />
                        <div>
                            <p className="text-sm font-medium">Waktu</p>
                            <p className="text-sm text-signalBlack">
                                Coming Soon
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-juneBud" />
                        <div>
                            <p className="text-sm font-medium">Lokasi</p>
                            <p className="text-sm text-signalBlack">
                                Coming Soon
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            {/* Main Content */}
            <div className="grid gap-8">
                {/* Theme */}
                {event.theme && (
                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-juneBud">
                            Theme
                        </h2>
                        <p className="">{event.theme}</p>
                    </section>
                )}

                {/* Description */}
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-juneBud">
                        About Event
                    </h2>
                    <div className="space-y-4 ">
                        {event.description.map((description, index) => (
                            <p key={index}>{description}</p>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-juneBud">
                        What You&apos;ll Get
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-4">
                        {[
                            "Wawasan praktis tentang strategi customer-centric",
                            "Pengalaman langsung dari 4 pembicara berpengalaman",
                            "Networking dengan sesama wirausahawan muda",
                            "Strategi menghadapi tantangan bisnis",
                        ].map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                    {index + 1}
                                </div>
                                <span className="">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
                <Button
                    size="lg"
                    className="min-w-[200px]"
                    disabled={event.link === "disabled"}
                    onClick={() => {
                        if (event.link !== "disabled") {
                            window.open(event.link, "_blank");
                        }
                    }}
                >
                    {event.link === "disabled"
                        ? "Coming Soon"
                        : "Daftar Sekarang"}
                </Button>
            </div>
        </div>
    );
}
