import { useNavigate } from 'react-router-dom'

import type { LessonStatus } from '@/components/journey/LessonNode'
import { ModuleSection } from '@/components/journey/ModuleSection'
import { TabelaTrilha } from '@/components/journey/TabelaTrilha'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { sqlJourney } from '@/data/sqlJourney'
import { getConcluidas } from '@/services/progress'

import styles from './journey.module.scss'

export function SqlJourneyPage() {
  const navigate = useNavigate()
  const concluidas = getConcluidas()
  const todasLicoes = sqlJourney.flatMap((m) => m.lessons)
  const atual = todasLicoes.find((l) => !concluidas.includes(l.id))

  function getStatus(lessonId: string): LessonStatus {
    if(concluidas.includes(lessonId)) return 'completed'
    if(lessonId === atual?.id && atual.available) return 'current'
    return 'locked'
  }

  return (
    <div className={styles.page}>
      <SiteHeader />

      <div className={styles.layout}>
        <main className={styles.main}>
          {sqlJourney.map((mod, i) => (
            <ModuleSection
              key={mod.id}
              module={mod}
              number={i + 1}
              getStatus={getStatus}
              onStartLesson={(id) => navigate(`/journeys/sql/leasson/${id}`)}
            />
          ))}
        </main>

        <aside className={styles.sidebar}>
          <TabelaTrilha concluidas={concluidas} />
        </aside>
      </div>

      <SiteFooter />
    </div>
  )
}