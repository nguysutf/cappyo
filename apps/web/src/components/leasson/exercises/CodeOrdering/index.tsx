import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import type { CodeOrderingExercise } from '@/types/lesson'

import styles from './CodeOrdering.module.scss'

interface CodeOrderingProps {
  exercise: CodeOrderingExercise
  value: string
  onChange: (value: string) => void
  isAnswered: boolean
}

function shuffle(fragments: string[], seed: string): string[] {
  let n = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const result = [...fragments]

  for(let i = result.length - 1; i > 0; i--) {
    n = (n * 9301 + 49297) % 233280
    const j = n % (i + 1);

    [result[i], result[j]] = [result[j], result[i]]
  }

  if(result.join() === fragments.join()) result.push(result.shift()!)
  return result
}

export function CodeOrdering({ exercise, value, onChange, isAnswered }: CodeOrderingProps) {
  const initial = useMemo(() => shuffle(exercise.fragments, exercise.id), [exercise])
  const order: string[] = value ? JSON.parse(value) : initial

  useEffect(() => {
    if(!value) onChange(JSON.stringify(initial))
  }, [value, initial, onChange])

  const move = (from: number, to: number) => {
    const next = [...order];

    [next[from], next[to]] = [next[to], next[from]]
    onChange(JSON.stringify(next))
  }

  return (
    <div className={styles.container}>
      <div>
        {exercise.title && <span className={styles.badge}>{exercise.title}</span>}
        <h1 className={styles.question}>{exercise.question}</h1>
        <p className={styles.hint}>Use as setas para colocar os trechos na ordem certa.</p>
      </div>

      <ol className={styles.list} aria-label="Trechos de código">
        {order.map((fragment, i) => {
          let state = ''

          if(isAnswered) state = fragment === exercise.fragments[i] ? styles.correct : styles.incorrect

          return (
            <li key={fragment} className={`${styles.item} ${state}`}>
              <span className={styles.position}>{i + 1}</span>
              <code className={styles.code}>{fragment}</code>
              <div className={styles.arrows}>
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={isAnswered || i === 0}
                  aria-label={`Mover "${fragment}" para cima`}
                >
                  <ArrowUp size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={isAnswered || i === order.length - 1}
                  aria-label={`Mover "${fragment}" para baixo`}
                >
                  <ArrowDown size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}