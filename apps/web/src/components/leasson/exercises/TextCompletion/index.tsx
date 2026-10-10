import { useRef, useEffect } from 'react'

import type { TextCompletionExercise } from '@/types/lesson'

import styles from './TextCompletion.module.scss'

interface TextCompletionProps {
  exercise: TextCompletionExercise
  value: string
  onChange: (val: string) => void
  isAnswered: boolean
  isCorrect?: boolean
}

export function TextCompletion({
  exercise,
  value,
  onChange,
  isAnswered,
  isCorrect,
}: TextCompletionProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if(!isAnswered) {
      inputRef.current?.focus()
    }
  }, [isAnswered])

  // Split content by {{blank}} or ______
  const blankPattern = /\{\{blank\}\}|_{3,}/g
  const parts = exercise.content.split(blankPattern)

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

      <div className={styles.contentCard}>
        <div className={styles.interactiveSentence}>
          {parts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < parts.length - 1 && (
                <input
                  ref={inputRef}
                  type="text"
                  className={`${styles.blankInput} ${inputStatusClass}`}
                  placeholder={exercise.placeholder ?? 'resposta...'}
                  value={value}
                  disabled={isAnswered}
                  onChange={(e) => onChange(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  aria-label="Preencha a lacuna"
                />
              )}
            </span>
          ))}
        </div>

        <p className={styles.helpTip}>
          Pressione <strong>Enter</strong> para confirmar sua resposta.
        </p>
      </div>
    </div>
  )
}
