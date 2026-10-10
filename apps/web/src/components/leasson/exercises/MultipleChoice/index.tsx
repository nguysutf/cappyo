import { Check, X } from 'lucide-react'
import { useEffect } from 'react'

import type { MultipleChoiceExercise } from '@/types/lesson'

import styles from './MultipleChoice.module.scss'

interface MultipleChoiceProps {
  exercise: MultipleChoiceExercise
  selectedValue: string
  onSelect: (optionId: string) => void
  isAnswered: boolean
  isCorrect?: boolean
}

export function MultipleChoice({
  exercise,
  selectedValue,
  onSelect,
  isAnswered,
}: MultipleChoiceProps) {
  // Allow keyboard shortcuts 1, 2, 3, 4 or A, B, C, D to pick options
  useEffect(() => {
    if(isAnswered) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if(['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      const key = e.key.toUpperCase()
      const indexNum = parseInt(e.key, 10) - 1
      let targetIndex = -1

      if(!isNaN(indexNum) && indexNum >= 0 && indexNum < exercise.options.length) {
        targetIndex = indexNum
      } else if(['A', 'B', 'C', 'D'].includes(key)) {
        targetIndex = key.charCodeAt(0) - 65
      }

      if(targetIndex >= 0 && targetIndex < exercise.options.length) {
        onSelect(exercise.options[targetIndex].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [exercise.options, isAnswered, onSelect])

  return (
    <div className={styles.container}>
      <div className={styles.questionSection}>
        {exercise.title && <span className={styles.badge}>{exercise.title}</span>}
        <h1 className={styles.question}>{exercise.question}</h1>
      </div>

      <div
        className={styles.optionsGrid}
        role="radiogroup"
        aria-label={exercise.question}
      >
        {exercise.options.map((option, index) => {
          const isSelected = selectedValue === option.id
          const optionLetter = String.fromCharCode(65 + index)

          let stateClass = ''

          if(isAnswered) {
            if(option.correct) {
              stateClass = styles.correct
            } else if(isSelected && !option.correct) {
              stateClass = styles.incorrect
            }
          } else if(isSelected) {
            stateClass = styles.selected
          }

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isAnswered}
              className={`${styles.optionButton} ${stateClass}`}
              onClick={() => onSelect(option.id)}
            >
              <div className={styles.keyBadge}>{optionLetter}</div>
              <span className={styles.optionLabel}>{option.label}</span>

              {isAnswered && option.correct && (
                <div className={`${styles.statusIcon} ${styles.correctIcon}`}>
                  <Check size={20} strokeWidth={3} />
                </div>
              )}

              {isAnswered && isSelected && !option.correct && (
                <div className={`${styles.statusIcon} ${styles.incorrectIcon}`}>
                  <X size={20} strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
