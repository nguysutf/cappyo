import { sqlJourney } from '@/data/sqlJourney'

import styles from './TabelaTrilha.module.scss'

interface TabelaTrilhaProps {
  concluidas: string[]
}

export function TabelaTrilha({ concluidas }: TabelaTrilhaProps) {
  return (
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
        {sqlJourney.map((mod) => (
          <tr key={mod.id}>
            <td>{mod.title}</td>
            <td>{mod.lessons.length}</td>
            <td>{mod.lessons.filter((l) => concluidas.includes(l.id)).length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}