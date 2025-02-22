// lib/firebase/articles.ts
import { db, storage } from '@/lib/firebase/firebase';
import { Article } from '@/models/Article';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function getArticleCount() {
  const snapshot = await getDocs(collection(db, 'articles'));
  return snapshot.size;
}

export async function getHomepageArticles() {
  const q = query(
    collection(db, 'articles'), 
    orderBy('createdAt', 'desc'),
    limit(3)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate()
  })) as Article[];
}
export async function getRandomArticles(count: number = 2) {
  // Get total count first for random starting point
  const snapshot = await getDocs(collection(db, 'articles'));
  const totalArticles = snapshot.size;
  
  if (totalArticles <= count) {
    // If we don't have enough articles, just return all shuffled
    const q = query(collection(db, 'articles'));
    const allDocs = await getDocs(q);
    const articles = allDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Article[];

    // Shuffle
    for (let i = articles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [articles[i], articles[j]] = [articles[j], articles[i]];
    }
    
    return articles;
  }

  // Get more than we need to ensure randomness
  const q = query(collection(db, 'articles'), limit(count * 2));
  const querySnapshot = await getDocs(q);
  const articles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate()
  })) as Article[];

  // Shuffle and return required count
  for (let i = articles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [articles[i], articles[j]] = [articles[j], articles[i]];
  }

  return articles.slice(0, count);
}
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