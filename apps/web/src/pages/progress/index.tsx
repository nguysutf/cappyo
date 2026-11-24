import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/Button'
import { sqlJourney } from '@/data/sqlJourney'
import { getNivel, XP_POR_NIVEL } from '@/services/game'
import { getJourney } from '@/services/journeyService'
import { getConcluidas, getLearnerStats, syncProgressFromSupabase, type LearnerStats } from '@/services/progress'

import styles from './Progress.module.scss'

interface BarraProps {
  valor: number
  total: number
  rotulo: string
}

function Barra({ valor, total, rotulo }: BarraProps) {
  return (
    <div
      className={styles.barra}
      role="progressbar"
      aria-label={rotulo}
      aria-valuenow={valor}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div className={styles.preenchido} style={{ width: `${Math.min(100, (valor / total) * 100)}%` }} />
    </div>
  )
}

export function ProgressPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<LearnerStats>({ xp: 0, streak: 0, hearts: 5, dailyGoal: 20, dailyXp: 0 })
  const [concluidas, setConcluidas] = useState(getConcluidas)
  const [journey, setJourney] = useState(sqlJourney)

  useEffect(() => {
    void getLearnerStats().then(setStats)
    void syncProgressFromSupabase().then(setConcluidas)
    void getJourney('sql').then(setJourney)
  }, [])

  const nivel = getNivel(stats.xp)
  const xpNoNivel = stats.xp % XP_POR_NIVEL
  const todasLicoes = journey.flatMap((m) => m.lessons)
  const feitas = todasLicoes.filter((l) => concluidas.includes(l.id)).length
  const proxima = todasLicoes.find((l) => !concluidas.includes(l.id) && l.available)

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <h1>Meu progresso</h1>

        <div className={styles.cards}>
          <section className={styles.card}>
            <h2>Nível {nivel}</h2>
            <Barra valor={xpNoNivel} total={XP_POR_NIVEL} rotulo={`XP para o nível ${nivel + 1}`} />
            <p>{xpNoNivel} de {XP_POR_NIVEL} XP para o nível {nivel + 1} · {stats.xp} XP no total</p>
          </section>

          <section className={styles.card}>
            <h2>Lições concluídas</h2>
            <Barra valor={feitas} total={todasLicoes.length} rotulo="Lições concluídas" />
            <p>{feitas} de {todasLicoes.length} lições</p>
          </section>

          <section className={styles.card}>
            <h2>Meta de hoje</h2>
            <Barra valor={stats.dailyXp} total={stats.dailyGoal} rotulo="Meta diária de XP" />
            <p>{stats.dailyXp} de {stats.dailyGoal} XP hoje</p>
          </section>

          <section className={styles.card}>
            <h2>Sequência</h2>
            <p className={styles.destaque}>{stats.streak} {stats.streak === 1 ? 'dia' : 'dias'}</p>
            <p>Dias seguidos estudando</p>
          </section>
        </div>

        <section className={styles.card}>
          <h2>Por módulo</h2>
          <ul className={styles.modulos}>
            {journey.map((mod, i) => {
              const feitasNoModulo = mod.lessons.filter((l) => concluidas.includes(l.id)).length

              return (
                <li key={mod.id}>
                  <div className={styles.moduloTopo}>
                    <span>{i + 1}. {mod.title}</span>
                    <span>{feitasNoModulo}/{mod.lessons.length}</span>
                  </div>
                  <Barra valor={feitasNoModulo} total={mod.lessons.length} rotulo={`Progresso em ${mod.title}`} />
                </li>
              )
            })}
          </ul>
        </section>

        {proxima ? (
          <Button onClick={() => navigate(`/journeys/sql/leasson/${proxima.id}`)}>
            Continuar: {proxima.title}
          </Button>
        ) : (
          <p className={styles.aviso}>Você fez todas as lições disponíveis. Novas lições em breve!</p>
        )}
      </main>
    </div>
  )
}