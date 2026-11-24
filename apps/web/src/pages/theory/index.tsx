import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, PlayCircle } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { formatar, TheoryContent } from '@/components/theory/TheoryContent'
import { sqlJourney } from '@/data/sqlJourney'
import { getTheory } from '@/data/theory'

import styles from './Theory.module.scss'

export function TheoryPage() {
  const { moduleId = '' } = useParams()
  const indice = sqlJourney.findIndex((mod) => mod.id === moduleId)
  const modulo = sqlJourney[indice]
  const conteudo = getTheory(moduleId)

  if(!modulo || !conteudo) return <Navigate to="/journeys/sql" replace />

  const anterior = sqlJourney[indice - 1]
  const proximo = sqlJourney[indice + 1]

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <header className={styles.topo}>
          <p className={styles.eyebrow}><BookOpen size={15} aria-hidden="true" /> MÓDULO {indice + 1} · TEORIA</p>
          <h1>{modulo.title}</h1>
          <p className={styles.intro}>{formatar(conteudo.intro)}</p>
          <div className={styles.atalhos}>
            <Link to="/cursos"><PlayCircle size={16} aria-hidden="true" /> Assistir a videoaula</Link>
            <Link to="/laboratorio"><FlaskConical size={16} aria-hidden="true" /> Testar no Laboratório</Link>
          </div>
        </header>

        <TheoryContent theory={conteudo} />

        <Link to={`/journeys/sql#mod-${modulo.id}`} className={styles.praticar}>
          Ir para os exercícios <ArrowRight size={18} aria-hidden="true" />
        </Link>

        <nav className={styles.navegacao} aria-label="Outros módulos">
          {anterior ? (
            <Link to={`/teoria/${anterior.id}`}><ArrowLeft size={16} aria-hidden="true" /> {anterior.title}</Link>
          ) : <span />}
          {proximo && (
            <Link to={`/teoria/${proximo.id}`}>{proximo.title} <ArrowRight size={16} aria-hidden="true" /></Link>
          )}
        </nav>
      </main>
    </div>
  )
}