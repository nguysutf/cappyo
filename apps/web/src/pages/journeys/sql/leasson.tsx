import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { ExerciseRenderer } from '@/components/leasson/exercises/ExerciseRenderer'
import { FeedbackFooter } from '@/components/leasson/FeedbackFooter'
import { LeassonLayout } from '@/components/leasson/layout'
import { LessonCompletion } from '@/components/leasson/LessonCompletion'
import { ProgressBar } from '@/components/leasson/ProgressBar'
import { useLesson } from '@/hooks/useLesson'
import { lessonService } from '@/services/lessonService'
import type { LessonSession } from '@/types/lesson'

export function SqlLessonPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<LessonSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    lessonService
      .getLessonSession('sql')
      .then((data) => {
        if(isMounted) {
          setSession(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load lesson:', err)
        if(isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const {
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
  } = useLesson(session)

  const handleExit = useCallback(() => {
    navigate('/')
  }, [navigate])

  // Global keyboard shortcuts: Enter confirms or proceeds to next question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Enter') {
        if(feedback !== null) {
          e.preventDefault()
          handleNext()
        } else if(userAnswer.trim().length > 0) {
          e.preventDefault()
          handleCheckAnswer()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [feedback, userAnswer, handleNext, handleCheckAnswer])

  if(isLoading) {
    return (
      <LeassonLayout>
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          Carregando lição...
        </div>
      </LeassonLayout>
    )
  }

  if(isCompleted) {
    return (
      <LeassonLayout
        header={
          <ProgressBar
            current={totalExercises}
            total={totalExercises}
            progressPercentage={100}
            onClose={handleExit}
          />
        }
      >
        <LessonCompletion
          summary={summary}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      </LeassonLayout>
    )
  }

  if(!currentExercise) {
    return (
      <LeassonLayout>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          Nenhum exercício encontrado.
        </div>
      </LeassonLayout>
    )
  }

  return (
    <LeassonLayout
      header={
        <ProgressBar
          current={currentIndex + 1}
          total={totalExercises}
          progressPercentage={progressPercentage}
          onClose={handleExit}
        />
      }
      footer={
        <FeedbackFooter
          feedback={feedback}
          canCheck={userAnswer.trim().length > 0}
          onCheck={handleCheckAnswer}
          onNext={handleNext}
          isLastExercise={isLastExercise}
        />
      }
    >
      <ExerciseRenderer
        key={currentExercise.id}
        exercise={currentExercise}
        userAnswer={userAnswer}
        onAnswerChange={handleSelectAnswer}
        feedback={feedback}
      />
    </LeassonLayout>
  )
}

export default SqlLessonPage
