import { useState, useCallback } from 'react'

import { validateExercise } from '@/services/exerciseValidator'
import type { ExecutionResult } from '@/types/database'
import type {
  ExerciseValidationResult,
  LessonExercise,
  LessonSession,
} from '@/types/lesson'

export interface LessonSummary {
  total: number
  correctCount: number
  mistakesCount: number
  accuracyPercentage: number
}

export function useLesson(session: LessonSession | null) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<ExerciseValidationResult | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<
    Array<{ exerciseId: string; isCorrect: boolean; userAnswer: string }>
  >([])

  const currentExercise: LessonExercise | null
    = session && session.exercises.length > currentIndex
      ? session.exercises[currentIndex]
      : null

  const isLastExercise = session
    ? currentIndex === session.exercises.length - 1
    : false

  const totalExercises = session?.exercises.length ?? 0
  const progressPercentage
    = totalExercises > 0
      ? Math.round(((currentIndex + (feedback ? 1 : 0)) / totalExercises) * 100)
      : 0

  const handleSelectAnswer = useCallback((answer: string) => {
    setUserAnswer(answer)
  }, [])

  const handleCheckAnswer = useCallback((executionResult?: ExecutionResult) => {
    if(!currentExercise || !userAnswer.trim()) return

    const validationResult = validateExercise(currentExercise, userAnswer, executionResult)

    setFeedback(validationResult)

    setResults((prev) => [
      ...prev,
      {
        exerciseId: currentExercise.id,
        isCorrect: validationResult.isCorrect,
        userAnswer,
      },
    ])
  }, [currentExercise, userAnswer])

  const handleNext = useCallback(() => {
    if(!session) return

    if(currentIndex + 1 < session.exercises.length) {
      setCurrentIndex((prev) => prev + 1)
      setUserAnswer('')
      setFeedback(null)
    } else {
      setIsCompleted(true)
    }
  }, [currentIndex, session])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setUserAnswer('')
    setFeedback(null)
    setIsCompleted(false)
    setResults([])
  }, [])

  const correctCount = results.filter((r) => r.isCorrect).length
  const mistakesCount = results.length - correctCount
  const summary: LessonSummary = {
    total: totalExercises,
    correctCount,
    mistakesCount,
    accuracyPercentage:
      totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0,
  }

  return {
    currentIndex,
    currentExercise,
    totalExercises,
    progressPercentage,
    userAnswer,
    feedback,
    isCompleted,
    isLastExercise,
    summary,
    handleSelectAnswer,
    handleCheckAnswer,
    handleNext,
    handleRestart,
  }
}
