import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, FlaskConical, Lightbulb, PlayCircle } from 'lucide-react'
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { ResultPanel } from '@/components/leasson/exercises/CodeWriting/components/result-panel'
import { getSampleDatabase } from '@/data/sampleDatabases'
import { sqlJourney } from '@/data/sqlJourney'
import { getTheory, type TheoryBlock } from '@/data/theory'
import { executeSql } from '@/services/sqlDatabase'
import type { ExecutionResult } from '@/types/database'

import styles from './Theory.module.scss'

function formatar(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((parte, i) => {
    if(parte.startsWith('**')) return <strong key={i}>{parte.slice(2, -2)}</strong>
    if(parte.startsWith('`')) return <code key={i}>{parte.slice(1, -1)}</code>
    return <Fragment key={i}>{parte}</Fragment>
  })
}

// Exemplo de SQL que roda de verdade no banco de exemplo e mostra o resultado
function Exemplo({ block }: { block: Extract<TheoryBlock, { type: 'example' }> }) {
  const [resultado, setResultado] = useState<ExecutionResult | null>(null)
  const banco = getSampleDatabase(block.databaseId)

  useEffect(() => {
    void executeSql(block.sql, banco.schema).then(setResultado)
  }, [block.sql, banco.schema])

  return (
    <figure className={styles.exemplo}>
      <div className={styles.codigoTopo}>
        <span>SQL</span>
        <span>banco: {banco.name}</span>
      </div>
      <pre className={styles.codigo}><code>{block.sql}</code></pre>
      <ResultPanel result={resultado} />
      {block.caption && <figcaption>{formatar(block.caption)}</figcaption>}
    </figure>
  )
}

function Bloco({ block }: { block: TheoryBlock }) {
  if(block.type === 'text') return <p className={styles.texto}>{formatar(block.text)}</p>
  if(block.type === 'example') return <Exemplo block={block} />

  const Icone = block.tone === 'dica' ? Lightbulb : AlertTriangle

  return (
    <aside className={`${styles.aviso} ${styles[block.tone]}`}>
      <Icone size={20} aria-hidden="true" />
      <div>
        <strong>{block.tone === 'dica' ? 'Dica' : 'Atenção'}</strong>
        <p>{formatar(block.text)}</p>
      </div>
    </aside>
  )
}

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

        {conteudo.sections.map((secao) => (
          <section key={secao.title} className={styles.secao}>
            <h2>{secao.title}</h2>
            {secao.blocks.map((block, i) => <Bloco key={i} block={block} />)}
          </section>
        ))}

        <section className={styles.resumo}>
          <h2>Resumo</h2>
          <ul>
            {conteudo.summary.map((item) => <li key={item}>{formatar(item)}</li>)}
          </ul>
        </section>

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