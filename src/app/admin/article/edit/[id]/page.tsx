// app/admin/articles/edit/[id]/page.tsx
'use client';
import { use } from 'react';
import ArticleForm from '@/components/article/ArticleForm';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ArticleForm params={resolvedParams} />;
}