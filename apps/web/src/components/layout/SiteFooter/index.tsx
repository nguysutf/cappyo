import { Link } from 'react-router-dom'

import styles from './SiteFooter.module.scss'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Cappyo</p>
      <p className={styles.links}>
        <a href="https://github.com/nguysutf/cappyo" target="_blank" rel="noopener noreferrer">
          Código no GitHub
        </a>
        <Link to="/design-system">Design system</Link>
      </p>
    </footer>
  )
}