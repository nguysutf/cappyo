import type { ExerciseValidationResult, LessonExercise } from '@/types/lesson'

import { CodeCompletion } from './CodeCompletion'
import { MultipleChoice } from './MultipleChoice'
import { TextCompletion } from './TextCompletion'

interface ExerciseRendererProps {
  exercise: LessonExercise
  userAnswer: string
  onAnswerChange: (answer: string) => void
  feedback: ExerciseValidationResult | null
}

export function ExerciseRenderer({
  exercise,
  userAnswer,
  onAnswerChange,
  feedback,
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
        <div>
          <h2>{exercise.question}</h2>
          <p>Exercício de escrita de código SQL em breve.</p>
        </div>
      )

    default: {
      const _exhaustiveCheck: never = exercise

      return <div>Exercício não suportado: {JSON.stringify(_exhaustiveCheck)}</div>
    }
  }
}
