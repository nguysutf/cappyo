import type {
  CodeCompletionExercise,
  ExerciseValidationResult,
  LessonExercise,
  MultipleChoiceExercise,
  TextCompletionExercise,
} from '@/types/lesson'

/**
 * Normalizes a text answer by trimming whitespace and converting to uppercase,
 * collapsing redundant internal whitespace.
 */
export function normalizeAnswer(val: string): string {
  return val.trim().replace(/\s+/g, ' ').toUpperCase()
}

/**
 * Validates any supported exercise type against a user answer.
 */
export function validateExercise(
  exercise: LessonExercise,
  userAnswer: string,
): ExerciseValidationResult {
  switch (exercise.type) {
    case 'multiple-choice':
      return validateMultipleChoice(exercise, userAnswer)

    case 'text-completion':
      return validateTextCompletion(exercise, userAnswer)

    case 'code-completion':
      return validateCodeCompletion(exercise, userAnswer)

    case 'code-writing':
      // Conceptual / future implementation:
      return {
        isCorrect: false,
        userAnswer,
        correctAnswer: exercise.solutionQuery ?? '',
        explanation: exercise.explanation,
      }

    default: {
      const _exhaustiveCheck: never = exercise

      throw new Error(`Unhandled exercise type: ${JSON.stringify(_exhaustiveCheck)}`)
    }
  }
}

function validateMultipleChoice(
  exercise: MultipleChoiceExercise,
  selectedOptionId: string,
): ExerciseValidationResult {
  const chosenOption = exercise.options.find((opt) => opt.id === selectedOptionId)
  const correctOption = exercise.options.find((opt) => opt.correct)

  const isCorrect = Boolean(chosenOption?.correct)

  return {
    isCorrect,
    userAnswer: chosenOption?.label ?? selectedOptionId,
    correctAnswer: correctOption?.label ?? '',
    explanation: exercise.explanation,
  }
}

function validateTextCompletion(
  exercise: TextCompletionExercise,
  userAnswer: string,
): ExerciseValidationResult {
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedExpected = normalizeAnswer(exercise.answer)
  const normalizedAccepted = (exercise.acceptedAnswers ?? []).map(normalizeAnswer)

  const isCorrect
    = normalizedUser === normalizedExpected || normalizedAccepted.includes(normalizedUser)

  return {
    isCorrect,
    userAnswer,
    correctAnswer: exercise.answer,
    explanation: exercise.explanation,
  }
}

function validateCodeCompletion(
  exercise: CodeCompletionExercise,
  userAnswer: string,
): ExerciseValidationResult {
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedExpected = normalizeAnswer(exercise.answer)
  const normalizedAccepted = (exercise.acceptedAnswers ?? []).map(normalizeAnswer)

  const isCorrect
    = normalizedUser === normalizedExpected || normalizedAccepted.includes(normalizedUser)

  return {
    isCorrect,
    userAnswer,
    correctAnswer: exercise.answer,
    explanation: exercise.explanation,
  }
}
