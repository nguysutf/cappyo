import type { ExecutionResult } from '@/types/database'
import type {
  CodeCompletionExercise,
  CodeWritingExercise,
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
  executionResult?: ExecutionResult,
): ExerciseValidationResult {
  switch (exercise.type) {
    case 'multiple-choice':
      return validateMultipleChoice(exercise, userAnswer)

    case 'text-completion':
      return validateTextCompletion(exercise, userAnswer)

    case 'code-completion':
      return validateCodeCompletion(exercise, userAnswer)

    case 'code-writing':
      return validateCodeWriting(exercise, userAnswer, executionResult)

    default: {
      const _exhaustiveCheck: never = exercise

      throw new Error(`Unhandled exercise type: ${JSON.stringify(_exhaustiveCheck)}`)
    }
  }
}

export function validateCodeWriting(
  exercise: CodeWritingExercise,
  userAnswer: string,
  executionResult?: ExecutionResult,
): ExerciseValidationResult {
  const normalizedUser = normalizeAnswer(userAnswer)

  if(exercise.expectedResult && executionResult?.success && executionResult.rows) {
    const expectedCols = exercise.expectedResult.columns ?? []
    const actualCols = executionResult.columns ?? []

    const colsMatch
      = expectedCols.length === 0
      || (expectedCols.length === actualCols.length
        && expectedCols.every((c, i) => c.toLowerCase() === actualCols[i]?.toLowerCase()))

    const rowsMatch
      = JSON.stringify(executionResult.rows) === JSON.stringify(exercise.expectedResult.rows)

    const isCorrect = colsMatch && rowsMatch

    return {
      isCorrect,
      userAnswer,
      correctAnswer: exercise.solutionQuery ?? 'SELECT name, email FROM users WHERE active = true;',
      explanation: isCorrect
        ? exercise.explanation
        : 'Sua consulta rodou com sucesso, mas o resultado retornado não atendeu a todos os requisitos do exercício (verifique as colunas e filtros).',
    }
  }

  const isCorrect = exercise.solutionQuery
    ? normalizeAnswer(exercise.solutionQuery) === normalizedUser
    : normalizedUser.includes('SELECT') && normalizedUser.includes('FROM')

  return {
    isCorrect,
    userAnswer,
    correctAnswer: exercise.solutionQuery ?? '',
    explanation: exercise.explanation,
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
