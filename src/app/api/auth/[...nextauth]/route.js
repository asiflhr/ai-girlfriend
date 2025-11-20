import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
        password: { label: 'Password', type: 'password' },
        age: { label: 'Age', type: 'number' },
        gender: { label: 'Gender', type: 'text' },
        interests: { label: 'Interests', type: 'text' },
        isSignUp: { label: 'Is Sign Up', type: 'boolean' }
      },
      async authorize(credentials) {
        await dbConnect()
        
        const { email, name, password, age, gender, interests, isSignUp } = credentials
        
        if (!email || !password) {
          throw new Error('Email and password are required')
        }
        
        if (isSignUp === 'true') {
          // Sign up
          if (!name || !age || !gender) {
            throw new Error('All fields are required for signup')
          }
          
          const existingUser = await User.findOne({ email })
          if (existingUser) {
            throw new Error('User already exists')
          }
          
          const hashedPassword = await bcrypt.hash(password, 12)
          const interestsArray = interests ? interests.split(',').map(i => i.trim()) : []
          
          const user = await User.create({ 
            email, 
            name, 
            password: hashedPassword,
            age: parseInt(age), 
            gender, 
            interests: interestsArray 
          })
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        } else {
          // Sign in
          const user = await User.findOne({ email })
          if (!user) {
            throw new Error('No user found')
          }
          
          if (!user.password) {
            throw new Error('Please sign up again - account needs password setup')
          }
          
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            throw new Error('Invalid password')
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }