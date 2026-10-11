export type ExerciseType
  = | 'multiple-choice'
  | 'text-completion'
  | 'code-completion'
  | 'code-writing'

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  title?: string;
  question: string;
  description?: string;
  explanation?: string;
  hint?: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  value: string;
  correct: boolean;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: MultipleChoiceOption[];
}

export interface TextCompletionExercise extends BaseExercise {
  type: 'text-completion';
  content: string; // e.g. "Para consultar dados em SQL, utilizamos o comando ______." or contains {{blank}}
  answer: string;
  acceptedAnswers?: string[];
  placeholder?: string;
}

export interface CodeCompletionExercise extends BaseExercise {
  type: 'code-completion';
  language: 'sql';
  code: string; // e.g. "SELECT ____ FROM users;" or contains {{blank}}
  answer: string;
  acceptedAnswers?: string[];
  placeholder?: string;
}

import type { DatabaseSchema } from './database'

export interface CodeWritingExercise extends BaseExercise {
  type: 'code-writing'
  language: 'sql'
  instructions?: string[]
  initialCode?: string
  databaseSchema: DatabaseSchema
  solutionQuery?: string
  expectedResult?: {
    columns?: string[]
    rows?: Record<string, unknown>[]
  }
}

export type LessonExercise
  = | MultipleChoiceExercise
  | TextCompletionExercise
  | CodeCompletionExercise
  | CodeWritingExercise

export interface LessonSession {
  id: string;
  title: string;
  journeyId: string;
  exercises: LessonExercise[];
}

export interface ExerciseValidationResult {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
}
