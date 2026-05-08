import { useState, useCallback } from 'react'
import {
  getProgress,
  recordSecret,
  recordQuiz,
  recordChapter,
  resetProgress,
} from '../utils/progressStore'

export const useProgress = () => {
  const [progress, setProgress] = useState(() => getProgress())

  // Refresh progress from localStorage
  const refresh = useCallback(() => {
    setProgress(getProgress())
  }, [])

  // Call this when user asks Dr. Clergy a question
  const logSecret = useCallback((question) => {
    recordSecret(question)
    refresh()
  }, [refresh])

  // Call this when user answers a quiz question
  const logQuiz = useCallback((data) => {
    recordQuiz(data)
    refresh()
  }, [refresh])

  // Call this when user reads a Bible chapter
  const logChapter = useCallback((book, chapter) => {
    recordChapter(book, chapter)
    refresh()
  }, [refresh])

  // Call this to wipe all progress
  const reset = useCallback(() => {
    resetProgress()
    refresh()
  }, [refresh])

  return {
    progress,
    logSecret,
    logQuiz,
    logChapter,
    reset,
    refresh,
  }
}