import type { ExecutionResult } from '@/types/database'
import type { ExerciseValidationResult, LessonExercise } from '@/types/lesson'

import { CodeCompletion } from './CodeCompletion'
import { CodeWriting } from './CodeWriting'
import { MultipleChoice } from './MultipleChoice'
import { TextCompletion } from './TextCompletion'

interface ExerciseRendererProps {
  exercise: LessonExercise
  userAnswer: string
  onAnswerChange: (answer: string) => void
  feedback: ExerciseValidationResult | null
  onExecutionComplete?: (result: ExecutionResult) => void
}

export function ExerciseRenderer({
  exercise,
  userAnswer,
  onAnswerChange,
  feedback,
  onExecutionComplete,
}: ExerciseRendererProps) {
  const isAnswered = feedback !== null
  const isCorrect = feedback?.isCorrect

  switch (exercise.type) {
    case 'multiple-choice':
      return (
        <MultipleChoice
          exercise={exercise}
          selectedValue={userAnswer}
          onSelect={onAnswerChange}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
        />
      )

    case 'text-completion':
      return (
        <TextCompletion
          exercise={exercise}
          value={userAnswer}
          onChange={onAnswerChange}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
        />
      )

    case 'code-completion':
      return (
        <CodeCompletion
          exercise={exercise}
          value={userAnswer}
          onChange={onAnswerChange}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
        />
      )

    case 'code-writing':
      return (
        <CodeWriting
          exercise={exercise}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          isAnswered={isAnswered}
          onExecutionComplete={onExecutionComplete}
        />
      )

    default: {
      const _exhaustiveCheck: never = exercise

      return <div>Exercício não suportado: {JSON.stringify(_exhaustiveCheck)}</div>
    }
  }
}
