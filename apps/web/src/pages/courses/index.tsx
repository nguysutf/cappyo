import { BookOpen, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { formatar, TheoryContent } from '@/components/theory/TheoryContent'
import { sqlJourney } from '@/data/sqlJourney'
import { getTheory } from '@/data/theory'

import styles from './Courses.module.scss'

const titulos: Record<string, string> = {
  'sql-basico': 'SELECT, WHERE e ORDER BY na prática',
  'manipulacao': 'INSERT, UPDATE e DELETE na prática',
  'where-avancado': 'AND, OR, NOT, IN, BETWEEN, LIKE e NULL no WHERE',
  'tabelas': 'Criar, alterar e apagar tabelas: CREATE, ALTER e DROP TABLE',
  'join': 'JOIN na prática: INNER JOIN, LEFT JOIN e ON',
}

export function CoursesPage() {
  const navigate = useNavigate()
  const [abertas, setAbertas] = useState<Record<string, boolean>>({})
  const aulas = sqlJourney.filter((mod) => mod.videoId)

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}><PlayCircle size={15} aria-hidden="true" /> VIDEOAULAS</p>
          <h1>Cursos</h1>
          <p>As 5 aulas da trilha de SQL, uma por módulo, cada uma com a sua teoria. Assista, leia e depois pratique os exercícios.</p>
        </header>

        <ol className={styles.lista}>
          {aulas.map((mod, i) => {
            const teoria = getTheory(mod.id)

            return (
              <li key={mod.id} className={styles.aula}>
                <div className={styles.topo}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${mod.videoId}?cc_load_policy=1&cc_lang_pref=pt&hl=pt-BR`}
                    title={`Aula ${i + 1}: ${titulos[mod.id] ?? mod.title}`}
                    loading="lazy"
                    allow="encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                  <div className={styles.info}>
                    <span className={styles.numero}>Aula {i + 1} · {mod.title}</span>
                    <h2>{titulos[mod.id] ?? mod.title}</h2>
                    {teoria ? (
                      <>
                        <p className={styles.aprende}>Nesta aula você aprende:</p>
                        <ul className={styles.topicos}>
                          {teoria.summary.map((item) => <li key={item}>{formatar(item)}</li>)}
                        </ul>
                      </>
                    ) : <p>{mod.description}</p>}
                    <button type="button" className={styles.praticar} onClick={() => navigate(`/journeys/sql#mod-${mod.id}`)}>
                      Praticar este módulo
                    </button>
                  </div>
                </div>

                {teoria && (
                  <details
                    className={styles.teoria}
                    onToggle={(e) => {
                      const aberta = e.currentTarget.open

                      setAbertas((atual) => ({ ...atual, [mod.id]: aberta }))
                    }}
                  >
                    <summary>
                      <BookOpen size={18} aria-hidden="true" /> Ler a teoria completa
                    </summary>
                    {abertas[mod.id] && (
                      <div className={styles.teoriaConteudo}>
                        <p className={styles.teoriaIntro}>{formatar(teoria.intro)}</p>
                        <TheoryContent theory={teoria} headingLevel={3} />
                        <Link to={`/teoria/${mod.id}`} className={styles.abrirPagina}>Abrir a teoria em página inteira</Link>
                      </div>
                    )}
                  </details>
                )}
              </li>
            )
          })}
        </ol>
      </main>
    </div>
  )
}