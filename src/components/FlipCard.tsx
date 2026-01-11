import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'

interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  className?: string
  onClick?: () => void
}

export function FlipCard({ front, back, className = '', onClick }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
    if (onClick && isFlipped) {
      setTimeout(() => {
        onClick()
      }, 300)
    }
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ 
          transformStyle: 'preserve-3d',
          cursor: 'pointer'
        }}
        animate={{ 
          rotateY: isFlipped ? 180 : 0 
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.645, 0.045, 0.355, 1.000]
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {front}
        </div>
        
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
