import { CheckCircle2, XCircle } from 'lucide-react'

import type { ExerciseValidationResult } from '@/types/lesson'

import styles from './FeedbackFooter.module.scss'

interface FeedbackFooterProps {
  feedback: ExerciseValidationResult | null
  canCheck: boolean
  onCheck: () => void
  onNext: () => void
  isLastExercise?: boolean
}

export function FeedbackFooter({
  feedback,
  canCheck,
  onCheck,
  onNext,
  isLastExercise = false,
}: FeedbackFooterProps) {
  const isAnswered = feedback !== null

  let footerClass = styles.footer

  if(isAnswered) {
    footerClass += feedback.isCorrect
      ? ` ${styles.correct}`
      : ` ${styles.incorrect}`
  }

  return (
    <footer className={footerClass}>
      <div className={styles.inner}>
        {isAnswered ? (
          <div className={styles.feedbackArea}>
            <div
              className={`${styles.statusIconWrapper} ${
                feedback.isCorrect ? styles.correctIcon : styles.incorrectIcon
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 size={32} />
              ) : (
                <XCircle size={32} />
              )}
            </div>

            <div className={styles.feedbackContent}>
              <h2
                className={`${styles.feedbackTitle} ${
                  feedback.isCorrect ? styles.correctTitle : styles.incorrectTitle
                }`}
              >
                {feedback.isCorrect ? 'Excelente! Resposta correta.' : 'Ops, não foi bem isso!'}
              </h2>

              {!feedback.isCorrect && feedback.correctAnswer && (
                <p className={styles.solutionText}>
                  Resposta correta: <strong>{feedback.correctAnswer}</strong>
                </p>
              )}

              {feedback.explanation && (
                <p className={styles.feedbackText}>{feedback.explanation}</p>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.feedbackArea} />
        )}

        <div className={styles.actionArea}>
          {!isAnswered ? (
            <button
              type="button"
              className={styles.actionButton}
              disabled={!canCheck}
              onClick={onCheck}
            >
              Verificar
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.actionButton} ${
                feedback.isCorrect ? styles.successButton : styles.dangerButton
              }`}
              onClick={onNext}
              autoFocus
            >
              {isLastExercise ? 'Finalizar Lição' : 'Continuar'}
            </button>
          )}
        </div>
      </div>
    </footer>
  )
}
