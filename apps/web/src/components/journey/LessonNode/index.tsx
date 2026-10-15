import { Check, Lock, Play } from 'lucide-react'

import styles from './LessonNode.module.scss'

export type LessonStatus = 'completed' | 'current' | 'locked'

interface LessonNodeProps {
  index: number
  title: string
  status: LessonStatus
  color: string
  onStart: () => void
}

const statusLabel = {
  completed: 'concluída',
  current: 'disponível',
  locked: 'bloqueada',
}

export function LessonNode({ index, title, status, color, onStart }: LessonNodeProps) {
  let Icon = Lock

  if(status === 'completed') Icon = Check
  if(status === 'current') Icon = Play

  return (
    <li className={styles.item}>
      <button
        type="button"
        className={`${styles.node} ${styles[color]} ${status === 'locked' ? styles.locked : ''}`}
        onClick={onStart}
        disabled={status === 'locked'}
        aria-label={`Lição ${index}: ${title} — ${statusLabel[status]}`}
      >
        <Icon size={30} strokeWidth={3} aria-hidden="true" />
      </button>
      <span className={styles.title}>{title}</span>
    </li>
  )
}