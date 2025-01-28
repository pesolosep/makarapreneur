"use server";

import { db } from "./firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function addProduct() {
    await setDoc(doc(db, "cities", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA",
    });
}
