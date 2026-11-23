import { Check, ChevronRight, Lock, Play, Star } from 'lucide-react'

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
        className={`${styles.node} ${status === 'locked' ? styles.locked : ''}`}
        onClick={onStart}
        disabled={status === 'locked'}
        aria-label={`Lição ${index}: ${title} — ${statusLabel[status]}`}
      >
        <span className={`${styles.iconWrap} ${styles[color]} ${status === 'locked' ? styles.locked : ''}`}><Icon size={20} strokeWidth={2.6} aria-hidden="true" /></span>
        <span className={styles.lessonCopy}><span className={styles.step}>LIÇÃO {String(index).padStart(2, '0')}</span><span className={styles.title}>{title}</span></span>
        <span className={`${styles.meta} ${status === 'current' ? styles.currentMeta : ''}`}>
          {status === 'completed' ? <><Check size={13} /> concluída</> : status === 'current' ? 'começar agora' : 'bloqueada'}
        </span>
        <span className={styles.reward}><Star size={12} fill="currentColor" /> 100 XP</span>
        <ChevronRight className={styles.chevron} size={19} aria-hidden="true" />
      </button>
    </li>
  )
}
