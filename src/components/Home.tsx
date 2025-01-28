'use client'

import { addProduct } from "@/lib/addProduct";


export default function Home() {

    const onSubmit = async () => { 
        await addProduct();
        window.alert("Product Added");
    }

    return (
        <div>
            <h1>Hello World</h1>
            <div className="flex flex-col gap-2 items-center">
                <label htmlFor="title">Title of Product</label>
                <input type="text" name="title" id="title" className="text-black"/>
                <button onClick={onSubmit} className="bg-gray-400 px-2 py-1 hover:bg-slate-600 duration-150">Submit</button>
            </div>
        </div>
    );
}
