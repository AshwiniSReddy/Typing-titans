import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Trophy } from 'lucide-react'

interface LeaderboardEntry {
  name: string;
  wpm: number;
  accuracy: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-10">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-teal-600 hover:bg-teal-700 text-white"
      >
        <Trophy className="w-5 h-5 mr-2" />
        Leaderboard
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Typists</h3>
              <ul className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{entry.name}</span>
                    <span className="text-teal-600 font-medium">{entry.wpm} WPM</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

