'use client'

import { useState } from 'react'
import { registerUser } from '@/lib/firebase/authService'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import team from "@/assets/teamCompressed.jpg"

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const validatePassword = (value: string) => {
    if (value.length > 0 && value.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    setError('')
    return true
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validasi password
    if (!validatePassword(password)) {
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await registerUser(email, password)
      router.push('/authentication/login?registerSuccess=true')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setError("Email already registered")
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
      <div className="relative bg-zinc-900 h-20 md:h-24 border-b border-white/10">
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
      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)] md:mt-12">
        <div className="w-full max-w-md md:max-w-2xl px-4 md:px-8">
          {/* Tabs */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[60%] z-20">
            <div className="grid grid-cols-2 bg-white rounded-none shadow-2xl w-[260px] md:w-auto">
              <Link 
                href="/authentication/login"
                className="px-8 md:px-12 py-3.5 md:py-4 bg-white text-gray-800 hover:text-gray-900 font-bold text-sm md:text-base 
                        transition-colors duration-300 hover:bg-gray-50 uppercase tracking-wider text-center"
              >
                Sign In
              </Link>
              <div className="relative px-8 md:px-12 py-3.5 md:py-4 bg-signalBlack text-juneBud font-bold text-sm md:text-base
                            uppercase tracking-wider after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-juneBud text-center">
                Register
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 rounded-none p-8 md:p-12 shadow-2xl relative overflow-hidden
                       border border-white/20 animate-in fade-in duration-700">
            <form onSubmit={handleRegister} className="space-y-8 md:space-y-10 relative z-10">
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
                      minLength={8}
                      className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 bg-white border border-gray-200 
                               focus:border-juneBud focus:ring-2 focus:ring-juneBud/20
                               shadow-sm hover:border-gray-300 transition-all duration-200 text-sm md:text-base
                               rounded-none font-medium"
                      placeholder="Create a password (min. 8 characters)"
                      value={password}
                      onChange={handlePasswordChange}
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

                <div>
                  <label className="block text-gray-700 mb-2.5 md:mb-3 font-semibold text-sm md:text-base">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5
                                   group-focus-within:text-juneBud transition-colors duration-200" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-10 md:pr-12 bg-white border border-gray-200 
                               focus:border-juneBud focus:ring-2 focus:ring-juneBud/20
                               shadow-sm hover:border-gray-300 transition-all duration-200 text-sm md:text-base
                               rounded-none font-medium"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 
                               hover:text-gray-600 focus:text-juneBud transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-gray-600 text-sm md:text-base pt-4 font-medium">
                Already have an account?{' '}
                <Link 
                  href="/authentication/login" 
                  className="text-cornflowerBlue hover:text-cornflowerBlue/80 transition-colors duration-200 
                           hover:underline font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}