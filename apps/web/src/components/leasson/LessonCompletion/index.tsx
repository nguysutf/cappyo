import { Trophy, RotateCcw, Home } from 'lucide-react'

import type { LessonSummary } from '@/hooks/useLesson'

import styles from './LessonCompletion.module.scss'

interface LessonCompletionProps {
  summary: LessonSummary
  onRestart: () => void
  onExit: () => void
}

export function LessonCompletion({
  summary,
  onRestart,
  onExit,
}: LessonCompletionProps) {
  return (
    <div className={styles.completionCard}>
      <div className={styles.trophyCircle}>
        <Trophy size={44} />
      </div>

      <div>
        <h1 className={styles.title}>Lição Concluída!</h1>
        <p className={styles.subtitle}>
          Você deu mais um passo na sua jornada de SQL.
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.accuracy}`}>
            {summary.accuracyPercentage}%
          </span>
          <span className={styles.statLabel}>Precisão</span>
        </div>

        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.correct}`}>
            {summary.correctCount}
          </span>
          <span className={styles.statLabel}>Acertos</span>
        </div>

        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.mistakes}`}>
            {summary.mistakesCount}
          </span>
          <span className={styles.statLabel}>Erros</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onExit}
        >
          <Home size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          Voltar à Trilha
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onRestart}
        >
          <RotateCcw size={16} />
          Praticar Novamente
        </button>
      </div>
    </div>
  )
}
