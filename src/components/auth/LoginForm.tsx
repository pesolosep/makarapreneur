'use client'

import { useState } from 'react'
import { loginUser } from '@/lib/firebase/authService'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import team from "@/assets/teamCompressed.jpg"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { isAdmin } = useAuth()
  const searchParams = useSearchParams()
  const registerSuccess = searchParams.get('registerSuccess')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginUser(email, password)
      const redirectPath = searchParams.get('redirect')
      if (redirectPath) {
        router.push(redirectPath)
      } else if  (isAdmin){
        router.push('/admin')
      } else {
        router.push('/')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-signalBlack overflow-hidden font-poppins">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={team}
          alt="Background"
          className="object-cover w-full h-full opacity-40"
          priority
        />
      </div>

      {/* Top Navigation */}
      <div className="relative bg-signalBlack h-20 md:h-24 bg-zinc-900 border-white/10">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="logo"
              width={40}
              height={40}
              className="transition-transform duration-300 hover:scale-110"
            />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)] mt-12`}>
        <div className="w-full max-w-md md:max-w-2xl px-4 md:px-8">
          {/* Tabs */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[60%] z-20">
            <div className="grid grid-cols-2 bg-white rounded-none shadow-2xl w-[260px] md:w-auto">
              <div className="relative px-8 md:px-12 py-3.5 md:py-4 bg-signalBlack text-juneBud font-bold text-sm md:text-base
                            uppercase tracking-wider after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-juneBud text-center">
                Sign In
              </div>
              <Link 
                href="/authentication/register"
                className="px-8 md:px-12 py-3.5 md:py-4 bg-white text-gray-800 hover:text-gray-900 font-bold text-sm md:text-base 
                        transition-colors duration-300 hover:bg-gray-50 uppercase tracking-wider text-center"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 rounded-none p-8 md:p-12 shadow-2xl relative overflow-hidden
                       border border-white/20 animate-in fade-in duration-700">
            {registerSuccess && (
              <Alert className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-none animate-in fade-in duration-300">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-sm md:text-base font-medium ml-2">
                Account created successfully! Please check your email - we have sent you a verification link. After verifying your email, you can sign in.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-8 md:space-y-10 relative z-10">
              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-gray-700 mb-2.5 md:mb-3 font-semibold text-sm md:text-base">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5 
                                   group-focus-within:text-juneBud transition-colors duration-200" />
                    <Input
                      type="email"
                      required
                      className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-4 bg-white border border-gray-200 
                               focus:border-juneBud focus:ring-2 focus:ring-juneBud/20
                               shadow-sm hover:border-gray-300 transition-all duration-200 text-sm md:text-base
                               rounded-none font-medium"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2.5 md:mb-3 font-semibold text-sm md:text-base">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5
                                   group-focus-within:text-juneBud transition-colors duration-200" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 bg-white border border-gray-200 
                               focus:border-juneBud focus:ring-2 focus:ring-juneBud/20
                               shadow-sm hover:border-gray-300 transition-all duration-200 text-sm md:text-base
                               rounded-none font-medium"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 
                               hover:text-gray-600 focus:text-juneBud transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                </div>
              </div>
{/* 
              <div className="flex items-center justify-between pt-2">
                <Link 
                  href="/forgot-password" 
                  className="text-sm md:text-base text-cornflowerBlue hover:text-cornflowerBlue/80 
                           transition-colors duration-200 hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </div> */}

              {error && (
                <Alert variant="destructive" className="bg-red-50 border border-red-100 rounded-none animate-in fade-in duration-300">
                  <AlertDescription className="text-red-600 text-sm md:text-base font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 md:h-14 bg-signalBlack hover:bg-signalBlack/90
                         text-white font-bold uppercase tracking-wider transition-all duration-300 
                         shadow-md hover:shadow-xl active:shadow-inner active:scale-[0.99]
                         text-sm md:text-base rounded-none
                         relative overflow-hidden group
                         after:absolute after:inset-0 after:bg-juneBud/0 hover:after:bg-juneBud/5 after:transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <p className="text-center text-gray-600 text-sm md:text-base pt-4 font-medium">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/authentication/register" 
                  className="text-cornflowerBlue hover:text-cornflowerBlue/80 transition-colors duration-200 
                           hover:underline font-semibold"
                >
                  Register Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}