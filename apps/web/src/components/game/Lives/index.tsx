import { Heart } from 'lucide-react'

import styles from './Lives.module.scss'

interface LivesProps {
  vidas: number
}

export function Lives({ vidas }: LivesProps) {
  return (
    <div className={styles.lives} aria-live="polite">
      <Heart size={22} fill="currentColor" aria-hidden="true" />
      <span aria-hidden="true">{vidas}</span>
      <span className="sr-only">{vidas} vidas restantes</span>
    </div>
  )
}