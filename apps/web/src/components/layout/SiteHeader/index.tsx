import { Link } from 'react-router-dom'

import { PlayerStats } from '@/components/game/PlayerStats'

import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/journeys/sql" className={styles.brand}>
          <img src="/logo.png" alt="Cappyo — voltar para a trilha" className={styles.logo} />
        </Link>
        <PlayerStats />
      </div>
    </header>
  )
}