import type { ButtonHTMLAttributes } from 'react'

import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button type="button" className={`${styles.button} ${styles[variant]} ${className}`} {...rest} />
}