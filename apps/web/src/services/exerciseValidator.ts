import type { ExecutionResult } from '@/types/database'
import type {
  CodeCompletionExercise,
  CodeOrderingExercise,
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

    case 'code-ordering':
      return validateCodeOrdering(exercise, userAnswer)

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
  const correctAnswer = exercise.solutionQuery ?? ''

  if(!executionResult?.success) {
    return {
      isCorrect: false,
      userAnswer,
      correctAnswer,
      explanation: executionResult
        ? 'Sua consulta tem um erro. Veja a mensagem na aba Resultado e tente de novo.'
        : 'Execute sua consulta antes de verificar.',
    }
  }

  const expected = executionResult.expected ?? {
    columns: exercise.expectedResult?.columns ?? [],
    rows: exercise.expectedResult?.rows ?? [],
  }
  const orderMatters = /ORDER\s+BY/i.test(correctAnswer)

  const isCorrect = sameResult(
    { columns: executionResult.columns ?? [], rows: executionResult.rows ?? [] },
    expected,
    orderMatters,
  )

  return {
    isCorrect,
    userAnswer,
    correctAnswer,
    explanation: isCorrect
      ? exercise.explanation
      : 'Sua consulta rodou, mas o resultado não é o esperado. Confira as colunas, os filtros e a ordem.',
  }
}

function sameResult(
  actual: { columns: string[]; rows: Record<string, unknown>[] },
  expected: { columns: string[]; rows: Record<string, unknown>[] },
  orderMatters: boolean,
) {
  const sameColumns
    = actual.columns.length === expected.columns.length
    && actual.columns.every((c, i) => c.toLowerCase() === expected.columns[i]?.toLowerCase())

  if(!sameColumns || actual.rows.length !== expected.rows.length) return false

  const toKeys = (rows: Record<string, unknown>[]) => rows.map((r) => JSON.stringify(Object.values(r)))
  const a = toKeys(actual.rows)
  const b = toKeys(expected.rows)

  if(!orderMatters) {
    a.sort()
    b.sort()
  }

  return a.every((row, i) => row === b[i])
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
function validateCodeOrdering(
  exercise: CodeOrderingExercise,
  userAnswer: string,
): ExerciseValidationResult {
  const correctOrder = exercise.fragments.join(' ')
  const userOrder = (JSON.parse(userAnswer || '[]') as string[]).join(' ')

  return {
    isCorrect: userOrder === correctOrder,
    userAnswer: userOrder,
    correctAnswer: correctOrder,
    explanation: exercise.explanation,
  }
}