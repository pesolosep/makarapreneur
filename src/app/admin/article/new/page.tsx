'use client';
import AdminNavbar from '@/components/admin/NavbarAdmin';
import ArticleForm from '@/components/article/ArticleForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewArticlePage() {
  const [loading] = useState<boolean>(true);
    const { user, isAdmin } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (loading){return}
      if ( user && !isAdmin) {
        router.push('/');
      }
    }, [user, isAdmin, router, loading]);
  return (<div>
    <AdminNavbar></AdminNavbar>
    <div className='py-12'></div>
    <ArticleForm />



  </div>);
}


