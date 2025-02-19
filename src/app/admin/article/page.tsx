// app/admin/article/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Article } from '@/models/Article';

export default function AdminArticles() {
 const { isAdmin } = useAuth();
 const [articles, setArticles] = useState<Article[]>([]);

 useEffect(() => {
   const fetchArticles = async () => {
     const querySnapshot = await getDocs(collection(db, 'articles'));
     setArticles(querySnapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data(),
       createdAt: doc.data().createdAt?.toDate(),
       updatedAt: doc.data().updatedAt?.toDate()
     })) as Article[]);
   };
   fetchArticles();
 }, []);

 const handleDelete = async (id: string, imageUrl: string) => {
   await deleteDoc(doc(db, 'articles', id));
   await deleteObject(ref(storage, imageUrl));
   setArticles(prev => prev.filter(article => article.id !== id));
 };

 if (!isAdmin) return <div>Access denied</div>;

 return (
   <div className="p-6">
     <div className="flex justify-between mb-6">
       <h1 className="text-2xl font-bold">Articles</h1>
       <Link href="/admin/article/new" className="bg-blue-500 text-white px-4 py-2 rounded">New</Link>
     </div>
     
     <div className="grid gap-4">
       {articles.map(article => (
         <div key={article.id} className="border p-4 rounded flex justify-between items-center">
           <h2>{article.title}</h2>
           <div className="flex gap-2">
             <Link href={`/admin/article/edit/${article.id}`} className="bg-gray-500 text-white px-3 py-1 rounded">Edit</Link>
             <button onClick={() => handleDelete(article.id, article.imageUrl)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
           </div>
         </div>
       ))}
     </div>
   </div>
 );
}