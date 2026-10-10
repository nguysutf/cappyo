import type { ReactNode } from 'react'

import styles from './layout.module.scss'

interface LeassonLayoutProps {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export function LeassonLayout({ header, footer, children }: LeassonLayoutProps) {
  return (
    <div className={styles.container}>
      {header && (
        <header className={styles.header}>
          <div className={styles.headerInner}>{header}</div>
        </header>
      )}

      <main className={styles.main}>
        <div className={styles.exerciseWrapper}>{children}</div>
      </main>

      {footer}
    </div>
  )
}