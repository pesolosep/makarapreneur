// app/admin/articles/edit/[id]/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import ArticleForm from '@/components/article/ArticleForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/NavbarAdmin';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

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
    <ArticleForm params={resolvedParams} />
    
    </div>);
}