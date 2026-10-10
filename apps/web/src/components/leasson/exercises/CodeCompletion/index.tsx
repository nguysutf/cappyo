import { useRef, useEffect } from 'react'

import type { CodeCompletionExercise } from '@/types/lesson'

import styles from './CodeCompletion.module.scss'

interface CodeCompletionProps {
  exercise: CodeCompletionExercise
  value: string
  onChange: (val: string) => void
  isAnswered: boolean
  isCorrect?: boolean
}

export function CodeCompletion({
  exercise,
  value,
  onChange,
  isAnswered,
  isCorrect,
}: CodeCompletionProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if(!isAnswered) {
      inputRef.current?.focus()
    }
  }, [isAnswered])

  // Split code by {{blank}} or ____
  const blankPattern = /\{\{blank\}\}|_{2,}/g
  const parts = exercise.code.split(blankPattern)

  let inputStatusClass = ''

  if(isAnswered) {
    inputStatusClass = isCorrect ? styles.correct : styles.incorrect
  }

  return (
    <div className={styles.container}>
      <div className={styles.questionSection}>
        {exercise.title && <span className={styles.badge}>{exercise.title}</span>}
        <h1 className={styles.question}>{exercise.question}</h1>
      </div>

      <div className={styles.codeCard}>
        <div className={styles.codeHeader}>
          <div className={styles.windowControls}>
            <span className={`${styles.dot} ${styles.red}`} />
            <span className={`${styles.dot} ${styles.yellow}`} />
            <span className={`${styles.dot} ${styles.green}`} />
          </div>
          <span className={styles.langLabel}>{exercise.language.toUpperCase()}</span>
        </div>

        <div className={styles.codeBody}>
          {parts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < parts.length - 1 && (
                <input
                  ref={inputRef}
                  type="text"
                  className={`${styles.codeInput} ${inputStatusClass}`}
                  placeholder={exercise.placeholder ?? '____'}
                  value={value}
                  disabled={isAnswered}
                  onChange={(e) => onChange(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-label="Complete o código"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
