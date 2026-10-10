import { X } from 'lucide-react'

import styles from './ProgressBar.module.scss'

interface ProgressBarProps {
  current: number
  total: number
  progressPercentage: number
  onClose?: () => void
}

export function ProgressBar({
  current,
  total,
  progressPercentage,
  onClose,
}: ProgressBarProps) {
  return (
    <div
      className={styles.progressContainer}
      role="progressbar"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso da lição"
    >
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Sair da lição"
          title="Sair da lição"
        >
          <X size={24} />
        </button>
      )}

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
        />
      </div>

      <span className={styles.label}>
        {current} / {total}
      </span>
    </div>
  )
}
