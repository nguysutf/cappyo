import { Flame, Gem, Heart, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


import { getLearnerStats, type LearnerStats } from '@/services/progress'

import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  const [stats, setStats] = useState<LearnerStats>({ xp: 0, streak: 0, hearts: 5, dailyGoal: 20, dailyXp: 0 })

  useEffect(() => {
    void getLearnerStats().then(setStats)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/journeys/sql" className={styles.brand}>
          <img src="/logo.png" alt="Cappyo — voltar para a trilha" className={styles.logo} />
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link to="/journeys/sql" className={styles.navLink}>Minha trilha</Link>
          <span className={styles.stat}><Flame size={17} fill="currentColor" aria-hidden="true" /> {stats.streak} dias</span>
          <span className={styles.stat}><Gem size={17} fill="currentColor" aria-hidden="true" /> {stats.xp} XP</span>
          <span className={styles.stat}><Heart size={16} fill="currentColor" aria-hidden="true" /> {stats.hearts}</span>
          <Link to="/auth" className={styles.avatar} aria-label="Abrir perfil"><UserRound size={18} /></Link>
        </nav>
      </div>
    </header>
  )
}