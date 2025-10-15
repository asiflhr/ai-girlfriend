// app/layout.js
import './globals.css'
import Providers from './components/Providers'

export const metadata = {
  title: 'AI Girlfriend 💖',
  description: 'Your next-gen AI companion.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen' suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
