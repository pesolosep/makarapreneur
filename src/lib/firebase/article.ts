// lib/firebase/articles.ts
import { db, storage } from '@/lib/firebase/firebase';
import { Article } from '@/models/Article';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function getArticles() {
  const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate()
  })) as Article[];
}

export async function getArticle(id: string) {
  const docRef = doc(db, 'articles', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
    updatedAt: snapshot.data().updatedAt?.toDate()
  } as Article;
}

export async function createArticle(title: string, content: string, image: File) {
  const storageRef = ref(storage, `articles/${Date.now()}_${image.name}`);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  return addDoc(collection(db, 'articles'), {
    title,
    content,
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateArticle(id: string, data: Partial<Article>, newImage?: File) {
  const docRef = doc(db, 'articles', id);
  let imageUrl = data.imageUrl;

  if (newImage) {
    // Delete old image if exists
    if (data.imageUrl) {
      const oldImageRef = ref(storage, data.imageUrl);
      await deleteObject(oldImageRef);
    }
    
    // Upload new image
    const storageRef = ref(storage, `articles/${Date.now()}_${newImage.name}`);
    await uploadBytes(storageRef, newImage);
    imageUrl = await getDownloadURL(storageRef);
  }

  return updateDoc(docRef, {
    ...data,
    imageUrl,
    updatedAt: new Date()
  });
}

export async function deleteArticle(id: string, imageUrl: string) {
  const docRef = doc(db, 'articles', id);
  const imageRef = ref(storage, imageUrl);
  
  await deleteObject(imageRef);
  return deleteDoc(docRef);
}