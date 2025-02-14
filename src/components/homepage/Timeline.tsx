export default function Timeline() {
    return (
        <div className="bg-linen text-signalBlack px-12 flex flex-col justify-center items-center py-20 relative text-sm">
            <h1 className="headerText bg-juneBud text-center">TIMELINE</h1>
            <ul className="font-medium border-l border-cornflowerBlue pl-12 mt-8 space-y-4 max-w-[700px]">
                <li className="space-y-4 bg-signalBlack px-6 py-4 rounded-xl relative">
                    <h2 className="text-juneBud">Lorem Ipsum</h2>
                    <p className="max-w-[400px] text-linen"> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                    <p className="text-cornflowerBlue">lorem ipsum</p>
                    <div className="absolute w-5 h-5 bg-signalBlack rotate-45 top-0 -left-2"></div>
                    <div className="absolute w-6 h-6 bg-juneBud rounded-full top-0 -left-[60px]"></div>
                </li>
                <li className="space-y-4 bg-signalBlack px-6 py-4 rounded-xl relative">
                    <h2 className="text-juneBud">Lorem Ipsum</h2>
                    <p className="max-w-[400px] text-linen"> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                    <p className="text-cornflowerBlue">lorem ipsum</p>
                    <div className="absolute w-5 h-5 bg-signalBlack rotate-45 top-0 -left-2"></div>
                    <div className="absolute w-6 h-6 bg-juneBud rounded-full top-0 -left-[60px]"></div>
                </li>
                <li className="space-y-4 bg-signalBlack px-6 py-4 rounded-xl relative">
                    <h2 className="text-juneBud">Lorem Ipsum</h2>
                    <p className="max-w-[400px] text-linen"> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                    <p className="text-cornflowerBlue">lorem ipsum</p>
                    <div className="absolute w-5 h-5 bg-signalBlack rotate-45 top-0 -left-2"></div>
                    <div className="absolute w-6 h-6 bg-juneBud rounded-full top-0 -left-[60px]"></div>
                </li>
            </ul>
        </div>
    );
}
