"use client";

import { db, storage } from "@/lib/firebase/firebase";
import {
    collection,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

export async function createDocumentWithImage(
    collectionName: string,
    data: Record<string, unknown>,
    image?: File,
    imagePath: string = collectionName // default path sama dengan nama koleksi
) {
    let imageUrl: string | undefined;

    if (image) {
        const storageRef = ref(
            storage,
            `${imagePath}/${Date.now()}_${image.name}`
        );
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
    }

    return addDoc(collection(db, collectionName), {
        ...data,
        ...(imageUrl && { imageUrl }),
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

export async function deleteDocumentWithImage(
    collectionName: string,
    id: string,
    hasImage: boolean
) {
    const docRef = doc(db, collectionName, id);

    if (hasImage) {
        // Get document data first
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        if (data?.imageUrl) {
            const imageRef = ref(storage, data.imageUrl);
            await deleteObject(imageRef);
        }
    }

    return deleteDoc(docRef);
}

export async function updateDocumentWithImage(
    collectionName: string,
    id: string,
    data: Record<string, unknown>,
    image?: File | null
) {
    const docRef = doc(db, collectionName, id);
    let imageUrl: string | undefined;

    if (image) {
        // Get current document data
        const docSnap = await getDoc(docRef);
        const currentData = docSnap.data();

        // Delete previous image if exists
        if (currentData?.imageUrl) {
            const prevImageRef = ref(storage, currentData.imageUrl);
            await deleteObject(prevImageRef);
        }

        // Upload new image
        const storageRef = ref(
            storage,
            `${collectionName}/${Date.now()}_${image.name}`
        );
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
    }

    return updateDoc(docRef, {
        ...data,
        ...(imageUrl && { imageUrl }),
        updatedAt: new Date(),
    });
}

export async function getDocuments<T>(
    collectionName: string,
    orderByField: string = "createdAt",
    orderDirection: "asc" | "desc" = "desc"
) {
    const q = query(
        collection(db, collectionName),
        orderBy(orderByField, orderDirection)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Konversi timestamp jika field ada
        ...(doc.data().createdAt && {
            createdAt: doc.data().createdAt.toDate(),
        }),
        ...(doc.data().updatedAt && {
            updatedAt: doc.data().updatedAt.toDate(),
        }),
    })) as T[];
}

export async function getDocumentById<T>(
    collectionName: string,
    id: string
) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) { 
        return {
            id: docSnap.id,
            ...docSnap.data(),
            // Konversi timestamp jika field ada
            ...(docSnap.data().createdAt && {
                createdAt: docSnap.data().createdAt.toDate(),
            }),
            ...(docSnap.data().updatedAt && {
                updatedAt: docSnap.data().updatedAt.toDate(),
            }),
        } as T;
    } else {
        throw new Error("Document not found");
    }
}
