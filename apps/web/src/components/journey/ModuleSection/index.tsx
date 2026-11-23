import { Check, LockKeyhole, PlayCircle, Sparkles } from 'lucide-react'

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
  const completed = module.lessons.filter((lesson) => getStatus(lesson.id) === 'completed').length
  const progress = Math.round((completed / module.lessons.length) * 100)

  return (
    <section id={`mod-${module.id}`} className={styles.section}>
      <header className={`${styles.banner} ${styles[module.color]}`}>
        <div className={styles.bannerTop}>
          <span className={styles.moduleNumber}>{String(number).padStart(2, '0')}</span>
          <div>
            <p className={styles.kicker}>Fase {number} <span>•</span> {completed === module.lessons.length ? 'concluída' : 'em andamento'}</p>
            <h2 className={styles.title}>{module.title}</h2>
            <p className={styles.description}>{module.description}</p>
          </div>
          <div className={styles.progressLabel} aria-label={`${progress}% concluído`}><strong>{progress}%</strong><span>progresso</span></div>
        </div>
        <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
        <div className={styles.progressMeta}><span>{completed}/{module.lessons.length} lições</span><span>{progress === 100 ? <><Check size={14} /> Fase completa</> : <><Sparkles size={14} /> +{module.lessons.length - completed} desafios</>}</span></div>
      </header>

      {module.videoId && (
        <details className={styles.video}>
          <summary>
            <PlayCircle size={20} aria-hidden="true" /> Assistir videoaula
          </summary>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${module.videoId}?cc_load_policy=1&cc_lang_pref=pt&hl=pt-BR`}
            title={`Videoaula do módulo ${number}: ${module.title}`}
            loading="lazy"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </details>
      )}

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
      <p className={styles.nextHint}><LockKeyhole size={14} /> Complete as lições na ordem para desbloquear a próxima fase</p>
    </section>
  )
}