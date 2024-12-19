'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Keyboard, ArrowRight } from 'lucide-react'
import { Leaderboard } from './Leaderboard'
import { TypingTestScreen } from './TypingTestScreen'
import { CompletionScreen } from './CompletionScreen'

interface LeaderboardEntry {
  name: string;
  wpm: number;
  accuracy: number;
}

export default function TypingTest() {
  const [username, setUsername] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showTest, setShowTest] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalWPM, setFinalWPM] = useState(0)
  const [finalAccuracy, setFinalAccuracy] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('typingTestLeaderboard')
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard))
    }
  }, [])

  const updateLeaderboard = useCallback((name: string, wpm: number, accuracy: number) => {
    const newEntry: LeaderboardEntry = { name, wpm, accuracy }
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 5)
    setLeaderboard(updatedLeaderboard)
    localStorage.setItem('typingTestLeaderboard', JSON.stringify(updatedLeaderboard))
  }, [leaderboard])

  const handleStart = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowTest(true)
      setIsTransitioning(false)
    }, 3000)
  }

  const handleTestComplete = useCallback((wpm: number, accuracy: number) => {
    setFinalWPM(wpm)
    setFinalAccuracy(accuracy)
    setIsCompleted(true)
    updateLeaderboard(username, wpm, accuracy)
  }, [username, updateLeaderboard])

  const handleTryAgain = useCallback(() => {
    setIsCompleted(false)
    setShowTest(true)
  }, [])

  const handleShare = useCallback(() => {
    // Implement sharing functionality
    alert(`Score shared: ${finalWPM} WPM with ${finalAccuracy}% accuracy`)
  }, [finalWPM, finalAccuracy])

  if (isCompleted) {
    return (
      <CompletionScreen
        wordsPerMin={finalWPM}
        accuracy={finalAccuracy}
        onTryAgain={handleTryAgain}
        onShare={handleShare}
      />
    )
  }

  if (showTest) {
    return (
      <>
        <Leaderboard leaderboard={leaderboard} />
        <TypingTestScreen username={username} onTestComplete={handleTestComplete} />
      </>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      <Leaderboard leaderboard={leaderboard} />
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div 
            className="max-w-md w-full p-8 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center mb-6"
            >
              <Keyboard className="w-12 h-12 text-teal-600" />
            </motion.div>

            <motion.h1 
              className="text-3xl font-bold text-center mb-6 text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Typing Test
            </motion.h1>

            <motion.p 
              className="text-gray-600 text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Enter your name to start the challenge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <Input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />

              <Button 
                className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-300"
                disabled={!username.trim()}
                onClick={handleStart}
              >
                <span className="mr-2">Start Test</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-white flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <motion.h2 
                className="text-4xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Get Ready, {username}!
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your typing test will begin shortly...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

