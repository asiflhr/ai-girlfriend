// app/components/TypingDots.js
import { motion } from 'framer-motion'

const TypingDot = ({ delay }) => (
  <motion.span
    initial={{ opacity: 0.2 }}
    animate={{ opacity: 1 }}
    transition={{
      repeat: Infinity,
      duration: 1.4,
      delay: delay,
      ease: 'easeInOut',
      repeatType: 'loop',
    }}
    // Use the user bubble color for typing dots
    className='inline-block w-2 h-2 mx-[1px] bg-user-bubble rounded-full'
  />
)

const TypingDots = () => {
  return (
    // Use AI bubble color for the typing bubble background
    <div className='flex items-center float-end w-fit space-x-[2px] p-3 bg-ai-bubble rounded-xl shadow-lg my-2 self-start'>
      <TypingDot delay={0} />
      <TypingDot delay={0.2} />
      <TypingDot delay={0.4} />
    </div>
  )
}

export default TypingDots
