import type { Module } from '@/data/sqlJourney'

import { LessonNode, type LessonStatus } from '../LessonNode'
import styles from './ModuleSection.module.scss'

interface ModuleSectionProps {
  module: Module
  number: number
  getStatus: (lessonId: string) => LessonStatus
  onStartLesson: (lessonId: string) => void
}

export function ModuleSection({ module, number, getStatus, onStartLesson }: ModuleSectionProps) {
  return (
    <section id={`mod-${module.id}`} className={styles.section}>
      <header className={`${styles.banner} ${styles[module.color]}`}>
        <p className={styles.kicker}>Módulo {number}</p>
        <h2 className={styles.title}>{module.title}</h2>
        <p className={styles.description}>{module.description}</p>
      </header>

      <ol className={styles.path}>
        {module.lessons.map((lesson, i) => (
          <LessonNode
            key={lesson.id}
            index={i + 1}
            title={lesson.title}
            status={getStatus(lesson.id)}
            color={module.color}
            onStart={() => onStartLesson(lesson.id)}
          />
        ))}
      </ol>
    </section>
  )
}