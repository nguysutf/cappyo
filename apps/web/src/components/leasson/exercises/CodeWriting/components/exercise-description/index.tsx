import type { CodeWritingExercise } from '@/types/lesson'

import styles from './ExerciseDescription.module.scss'

interface ExerciseDescriptionProps {
  exercise: CodeWritingExercise
}

export function ExerciseDescription({ exercise }: ExerciseDescriptionProps) {
  return (
    <div className={styles.descriptionContainer}>
      <span className={styles.badge}>Desafio SQL</span>
      <h1 className={styles.title}>{exercise.title ?? exercise.question}</h1>
      <p className={styles.question}>{exercise.question}</p>

      {exercise.instructions && exercise.instructions.length > 0 && (
        <ul className={styles.instructionsList}>
          {exercise.instructions.map((inst, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inst }} />
          ))}
        </ul>
      )}
    </div>
  )
}
