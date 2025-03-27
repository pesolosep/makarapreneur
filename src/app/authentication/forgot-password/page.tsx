'use client'

import { useState } from 'react'
import { resetPassword } from '@/lib/firebase/authService'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle2 } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import team from "@/assets/teamCompressed.jpg"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError('Failed to send password reset email. Please check your email address.')
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
          {/* Form Card */}
          <div className="bg-white/95 rounded-none p-8 md:p-12 shadow-2xl relative overflow-hidden
                       border border-white/20 animate-in fade-in duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              Reset Password
            </h2>
            
            {success ? (
              <Alert className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-none animate-in fade-in duration-300">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-sm md:text-base font-medium ml-2">
                  Password reset email sent! Please check your inbox and follow the instructions to reset your password.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative z-10">
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <p className="text-center text-gray-600 text-sm md:text-base pt-4 font-medium">
                  Remember your password?{' '}
                  <Link 
                    href="/authentication/login" 
                    className="text-cornflowerBlue hover:text-cornflowerBlue/80 transition-colors duration-200 
                             hover:underline font-semibold"
                  >
                    Back to Login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 