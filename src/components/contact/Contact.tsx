import { Button } from "../ui/button";

export default function Contact() {
    return (
        <div className="bg-signalBlack py-12">
            <div className="bg-linen px-12 py-12 flex flex-wrap justify-between">
                <div className="w-[400px] bg-signalBlack rounded-xl p-6 gap-5 flex flex-col justify-center font-medium text-linen">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-juneBud">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="rounded-md py-1 px-2 text-signalBlack"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-juneBud">
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            className="rounded-md py-1 px-2 text-signalBlack"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="mobile" className="text-juneBud">
                            Mobile
                        </label>
                        <input
                            type="text"
                            name="mobile"
                            id="mobile"
                            className="rounded-md py-1 px-2 text-signalBlack"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-juneBud">
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            className="rounded-md py-1 px-2 text-signalBlack"
                        ></textarea>
                    </div>
                    <Button className="mt-3">Submit</Button>
                </div>
                <div>
                    <h2 className="headerText">
                        FOR MORE DETAILS <br />
                        <span className="text-cornflowerBlue">CONTACT US!</span>
                    </h2>
                    <div className="bg-signalBlack w-full h-[2px] my-4"></div>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-6">
                            <div className="w-16 h-16 rounded-xl bg-juneBud"></div>
                            <div className="flex flex-col justify-center">
                                <p className="font-semibold">Sponsorship</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-16 h-16 rounded-xl bg-juneBud"></div>
                            <div className="flex flex-col justify-center">
                                <p className="font-semibold">Media Partnership</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-16 h-16 rounded-xl bg-juneBud"></div>
                            <div className="flex flex-col justify-center">
                                <p className="font-semibold">Public Relation</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-16 h-16 rounded-xl bg-juneBud"></div>
                            <div className="flex flex-col justify-center">
                                <p className="font-semibold">Contact Person</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p>Connect with us!</p>
                        <div className="flex mt-2 gap-3">
                            <div className="w-8 h-8 bg-cornflowerBlue rounded-lg"></div>
                            <div className="w-8 h-8 bg-cornflowerBlue rounded-lg"></div>
                            <div className="w-8 h-8 bg-cornflowerBlue rounded-lg"></div>
                            <div className="w-8 h-8 bg-cornflowerBlue rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
