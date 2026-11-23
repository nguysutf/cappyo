import { sqlJourney, type Module } from '@/data/sqlJourney'
import type { LearnerStats } from '@/services/progress'

import styles from './TabelaTrilha.module.scss'

interface TabelaTrilhaProps {
  concluidas: string[]
  journey?: Module[]
  stats?: LearnerStats
}

export function TabelaTrilha({ concluidas, journey = sqlJourney, stats }: TabelaTrilhaProps) {
  const dailyGoal = stats?.dailyGoal ?? 20
  const dailyXp = stats?.dailyXp ?? 0
  const dailyProgress = Math.min(100, Math.round((dailyXp / dailyGoal) * 100))

  return (
    <div className={styles.panel}>
      <section className={styles.goalCard} aria-label="Meta diária">
        <div className={styles.goalHeader}><span>Meta diária</span><strong>{dailyXp}/{dailyGoal} XP</strong></div>
        <div className={styles.goalTrack}><span style={{ width: `${dailyProgress}%` }} /></div>
        <p>{dailyProgress >= 100 ? 'Meta concluída. Você está voando!' : `${dailyGoal - dailyXp} XP para manter o ritmo hoje.`}</p>
      </section>
      <table className={styles.tabela}>
        <caption>Resumo da trilha</caption>
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Lições</th>
            <th>Feitas</th>
          </tr>
        </thead>
        <tbody>
          {journey.map((mod) => (
            <tr key={mod.id}>
              <td>{mod.title}</td>
              <td>{mod.lessons.length}</td>
              <td>{mod.lessons.filter((l) => concluidas.includes(l.id)).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
