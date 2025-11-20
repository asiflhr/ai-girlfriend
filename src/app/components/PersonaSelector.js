import { motion } from 'framer-motion'
import { personas } from '@/lib/personas'

const PersonaSelector = ({ selectedPersona, onPersonaChange, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-[--color-chat-bg-dark] rounded-2xl p-6 w-full max-w-md'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-bold text-[--color-text-primary] mb-4 text-center'>
          Choose Your AI Companion
        </h2>
        
        <div className='space-y-3'>
          {Object.entries(personas).map(([id, persona]) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onPersonaChange(id)
                onClose()
              }}
              className={`w-full p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                selectedPersona === id
                  ? 'border-[--color-user-bubble] bg-gradient-to-r from-[--color-user-bubble] to-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'border-[--color-border-subtle] bg-[--color-ai-bubble] hover:border-[--color-user-bubble] hover:shadow-md hover:shadow-orange-500/10'
              }`}
            >
              <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${selectedPersona === id ? 'hidden' : ''}`} />
              
              <div className='flex items-center space-x-4 relative z-10'>
                <div className={`text-3xl p-2 rounded-full ${selectedPersona === id ? 'bg-white/20' : 'bg-[--color-chat-bg-dark]'}`}>
                  {persona.avatar}
                </div>
                <div className='text-left flex-1'>
                  <h3 className={`font-bold text-lg ${selectedPersona === id ? 'text-white' : 'text-white group-hover:text-[--color-user-bubble] transition-colors'}`}>
                    {persona.name}
                  </h3>
                  <p className={`text-sm ${selectedPersona === id ? 'text-orange-100' : 'text-gray-400'}`}>
                    {persona.description}
                  </p>
                </div>
                {selectedPersona === id && (
                  <div className='w-3 h-3 bg-white rounded-full shadow-sm animate-pulse' />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PersonaSelector