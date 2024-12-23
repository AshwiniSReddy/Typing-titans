'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Share } from 'lucide-react'

interface CompletionScreenProps {
  wordsPerMin: number
  accuracy: number
  onTryAgain: () => void
  onShare: () => void
}


export function CompletionScreen({
  wordsPerMin,
  accuracy,
  onTryAgain,
  onShare
}: CompletionScreenProps) {
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-2xl w-full text-center space-y-8"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-gray-800"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          You've completed the typing test!
        </motion.h1>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="text-2xl text-gray-700"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your typing speed is{' '}
            <span className="text-teal-600 font-bold">{wordsPerMin} wpm</span>
          </motion.div>
    
          <motion.div 
            className="text-2xl text-gray-700"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.7 }}
          >
            Your accuracy is{' '}
            <span className="text-teal-600 font-bold">{accuracy}%</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={onTryAgain}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-full text-lg"
          >
            Try again
          </Button>

          <div className="flex justify-center">
            <button
              onClick={onShare}
              className="flex items-center text-gray-500 hover:text-teal-600 transition-colors"
            >
              <Share className="w-4 h-4 mr-2" />
              <span className="text-sm">Share your score</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

