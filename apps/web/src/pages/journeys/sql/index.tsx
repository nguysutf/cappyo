import { ArrowRight, CheckCircle2, ChevronRight, Flame, Sparkles, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { LessonStatus } from '@/components/journey/LessonNode'
import { ModuleSection } from '@/components/journey/ModuleSection'
import { TabelaTrilha } from '@/components/journey/TabelaTrilha'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { sqlJourney } from '@/data/sqlJourney'
import { getJourney } from '@/services/journeyService'
import { getConcluidas, getLearnerStats, syncProgressFromSupabase, type LearnerStats } from '@/services/progress'

import styles from './journey.module.scss'

export function SqlJourneyPage() {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const [concluidas, setConcluidas] = useState(getConcluidas)
  const [stats, setStats] = useState<LearnerStats>({ xp: 0, streak: 0, hearts: 5, dailyGoal: 20, dailyXp: 0 })
  const [journey, setJourney] = useState(sqlJourney)

  useEffect(() => {
    if(hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash, journey])

  useEffect(() => {
    void syncProgressFromSupabase().then(setConcluidas)
    void getLearnerStats().then(setStats)
    void getJourney('sql').then(setJourney)
  }, [])

  const todasLicoes = journey.flatMap((m) => m.lessons)
  const atual = todasLicoes.find((l) => !concluidas.includes(l.id))
  const percentual = Math.round((concluidas.length / todasLicoes.length) * 100)
  const xp = stats.xp || concluidas.length * 100

  function getStatus(lessonId: string): LessonStatus {
    if(concluidas.includes(lessonId)) return 'completed'
    if(lessonId === atual?.id) return 'current'
    return 'locked'
  }

  return (
    <div className={styles.page}>
      <SiteHeader />

      <div className={styles.layout}>
        <main className={styles.main}>
          <section className={styles.welcome}>
            <div>
              <p className={styles.eyebrow}><Sparkles size={15} /> MISSÃO DE HOJE</p>
              <h1>Domine SQL, uma query por vez.</h1>
              <p className={styles.subhead}>Sua próxima conquista está a poucos minutos. Continue de onde parou e mantenha o ritmo.</p>
              {atual && <button className={styles.primaryCta} type="button" onClick={() => navigate(`/journeys/sql/leasson/${atual.id}`)}>Continuar aprendendo <ArrowRight size={18} /></button>}
            </div>
            <div className={styles.heroBadge}><Trophy size={34} /><strong>{percentual}%</strong><span>da trilha</span></div>
          </section>

          <section className={styles.statsGrid} aria-label="Seu progresso">
            <div className={styles.statCard}><span className={`${styles.statIcon} ${styles.purple}`}><CheckCircle2 size={20} /></span><div><strong>{concluidas.length}/{todasLicoes.length}</strong><small>lições concluídas</small></div></div>
            <div className={styles.statCard}><span className={`${styles.statIcon} ${styles.orange}`}><Flame size={20} /></span><div><strong>{stats.streak} dias</strong><small>sequência atual</small></div></div>
            <div className={styles.statCard}><span className={`${styles.statIcon} ${styles.yellow}`}><Trophy size={20} /></span><div><strong>{xp} XP</strong><small>pontos conquistados</small></div></div>
          </section>

          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>MAPA DE APRENDIZADO</p><h2>Sua jornada</h2></div><span>{todasLicoes.length - concluidas.length} desafios restantes <ChevronRight size={16} /></span></div>
          {journey.map((mod, i) => (
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
          <TabelaTrilha concluidas={concluidas} journey={journey} stats={stats} />
        </aside>
      </div>

      <SiteFooter />
    </div>
  )
}