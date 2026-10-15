import { Star, Zap } from 'lucide-react'

import { getNivel, getXp } from '@/services/game'

import styles from './PlayerStats.module.scss'

export function PlayerStats() {
  const xp = getXp()
  const nivel = getNivel(xp)

  return (
    <div className={styles.stats} aria-label={`Nível ${nivel}, ${xp} XP`}>
      <span className={styles.nivel}>
        <Star size={18} fill="currentColor" aria-hidden="true" /> Nível {nivel}
      </span>
      <span className={styles.xp}>
        <Zap size={18} fill="currentColor" aria-hidden="true" /> {xp} XP
      </span>
    </div>
  )
}