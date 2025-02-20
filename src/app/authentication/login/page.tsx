// src/app/login/page.tsx
import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login | Makarapreneur'
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}