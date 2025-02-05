import { Button } from "../ui/button";

export default function AboutUs() {
    return (
        <div className="bg-signalBlack text-linen p-12">
            <div className="flex flex-col w-[500px]">
                <h1>About Us</h1>
                <p className="">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </p>
                <Button>Learn More</Button>
            </div>
        </div>
    );
}
