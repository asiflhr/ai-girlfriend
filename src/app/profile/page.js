'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, User, Loader2 } from 'lucide-react'

const AVATARS = ['👤', '👩', '👨', '🧑', '👧', '👦', '🧓', '👴', '👵', '🦊', '🐱', '🐶', '🦁', '🐯', '🦄']

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    interests: '',
    avatar: '👤',
    preferences: {
      theme: 'dark',
      notifications: true
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (session) {
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || '',
          age: data.age || '',
          gender: data.gender || '',
          interests: data.interests ? data.interests.join(', ') : '',
          avatar: data.avatar || '👤',
          preferences: {
            theme: data.preferences?.theme || 'dark',
            notifications: data.preferences?.notifications ?? true
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i)
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: interestsArray
        })
      })

      if (response.ok) {
        router.refresh()
        // Show success message or toast here if we had one
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[--color-chat-bg]'>
        <Loader2 className='animate-spin text-[--color-user-bubble]' size={32} />
      </div>
    )
  }

  return (
    <main className='min-h-screen bg-[--color-chat-bg] p-4 md:p-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-2xl mx-auto bg-[--color-chat-bg-dark] rounded-2xl shadow-xl overflow-hidden border border-[--color-border-subtle]'
      >
        <div className='p-6 border-b border-[--color-border-subtle] flex items-center gap-4'>
          <button 
            onClick={() => router.push('/')}
            className='p-2 hover:bg-[--color-ai-bubble] rounded-full transition-colors'
          >
            <ArrowLeft size={24} className='text-[--color-text-primary]' />
          </button>
          <h1 className='text-2xl font-bold text-[--color-text-primary]'>Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Avatar Selection */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-[--color-text-secondary]'>Avatar</label>
            <div className='flex flex-wrap gap-2'>
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type='button'
                  onClick={() => setFormData({ ...formData, avatar })}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    formData.avatar === avatar 
                      ? 'bg-[--color-user-bubble] scale-110' 
                      : 'bg-[--color-ai-bubble] hover:bg-opacity-80'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-[--color-text-secondary]'>Name</label>
              <input
                type='text'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-[--color-text-secondary]'>Age</label>
              <input
                type='number'
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                required
                min='18'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-[--color-text-secondary]'>Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
                required
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-[--color-text-secondary]'>Interests</label>
              <input
                type='text'
                value={formData.interests}
                onChange={e => setFormData({ ...formData, interests: e.target.value })}
                placeholder='Comma separated (e.g. Music, Travel)'
                className='w-full p-3 bg-[--color-ai-bubble] text-[--color-text-primary] rounded-lg border border-[--color-border-subtle] focus:outline-none focus:border-[--color-user-bubble]'
              />
            </div>
          </div>

          {/* Preferences */}
          <div className='space-y-4 pt-4 border-t border-[--color-border-subtle]'>
            <h3 className='text-lg font-semibold text-[--color-text-primary]'>Preferences</h3>
            
            <div className='flex items-center justify-between'>
              <span className='text-[--color-text-primary]'>Notifications</span>
              <button
                type='button'
                onClick={() => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, notifications: !formData.preferences.notifications }
                })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  formData.preferences.notifications ? 'bg-[--color-user-bubble]' : 'bg-[--color-border-subtle]'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.preferences.notifications ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          <div className='pt-6'>
            <button
              type='submit'
              disabled={saving}
              className='w-full p-3 bg-[--color-user-bubble] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {saving ? <Loader2 className='animate-spin' size={20} /> : <Save size={20} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  )
}
