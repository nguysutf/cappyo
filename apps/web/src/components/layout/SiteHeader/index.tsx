import { Link } from 'react-router-dom'

import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/journeys/sql" className={styles.brand}>
          Cappyo
        </Link>
      </div>
    </header>
  )
}