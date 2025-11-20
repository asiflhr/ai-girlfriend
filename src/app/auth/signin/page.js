'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [interests, setInterests] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        name,
        password,
        age,
        gender,
        interests,
        isSignUp: isSignUp.toString(),
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        alert(result?.error || 'Authentication failed')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-[--color-chat-bg] p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-[--color-chat-bg-dark] p-8 rounded-2xl shadow-2xl w-full max-w-md'
      >
        <h1 className='text-2xl font-bold text-center mb-6 text-[--color-text-primary]'>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
            />
          </div>

          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full p-3 pr-12 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[--color-text-secondary] hover:text-[--color-text-primary]'
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isSignUp && (
            <>
              <div>
                <input
                  type='text'
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                />
              </div>
              <div>
                <input
                  type='number'
                  placeholder='Age (18+)'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min='18'
                  className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                />
              </div>
              <div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Interests (comma separated)'
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                />
              </div>
            </>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full p-3 bg-orange-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50'
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className='text-center mt-4 text-[--color-text-secondary]'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className='text-orange-500 hover:underline'
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </main>
  )
}