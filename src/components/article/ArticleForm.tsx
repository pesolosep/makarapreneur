/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ArticleForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/firebase';
import { useAuth } from '@/contexts/AuthContext';
import TipTapEditor from '@/components/article/TipTapEditor';

// This interface helps us maintain type safety for our form 
interface ArticleFormProps {
    params?: {
      id: string;
    };
  }

  
interface FormData {
  title: string;
  content: string;
  image: File | null;
  preview: string;
}

export default function ArticleForm({ params }: ArticleFormProps) {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const [articleId, setArticleId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
      title: '',
      content: '',
      image: null, 
      preview: ''
    });
  
    useEffect(() => {
      if (params?.id && params.id !== articleId) {
        setArticleId(params.id);
        fetchArticle(params.id);
      }
    }, [params?.id, articleId]);
  
    const fetchArticle = async (id: string) => {
      try {
        const docSnap = await getDoc(doc(db, 'articles', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            title: data.title,
            content: data.content,
            preview: data.imageUrl
          }));
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };
 

  // Handle form submission with proper error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      // Handle image upload if there's a new image
      let imageUrl = formData.preview;
      if (formData.image) {
        const storageRef = ref(storage, `articles/${Date.now()}_${formData.image.name}`);
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Prepare article data
      const articleData = {
        title: formData.title,
        content: formData.content,
        imageUrl,
        updatedAt: new Date()
      };

      // Update or create article based on whether we have an ID
      if (params?.id) {
        await updateDoc(doc(db, 'articles', params.id), articleData);
      } else {
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          createdAt: new Date()
        });
      }

      // Redirect to articles list on success
      router.push('/admin/article');
    } catch (error) {
      console.error('Error saving article:', error);
      // Here you might want to add user feedback for errors
    }
  };

  // Only allow admin access
  if (!isAdmin) return <div>Access denied</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Title input */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Article Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter article title"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Rich text editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <TipTapEditor 
          value={formData.content}
          onChange={(content: any) => setFormData(prev => ({ ...prev, content }))}
        />
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Featured Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData(prev => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file)
              }));
            }
          }}
          className="w-full"
          required={!params?.id}
        />
        {formData.preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={formData.preview} 
            alt="Preview" 
            className="w-48 h-48 object-cover rounded mt-2 border"
          />
        )}
      </div>

      {/* Submit button */}
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        {params?.id ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  );
}