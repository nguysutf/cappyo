import { AlertTriangle, Lightbulb } from 'lucide-react'
import { Fragment, useEffect, useState, type ReactNode } from 'react'

import { ResultPanel } from '@/components/leasson/exercises/CodeWriting/components/result-panel'
import { getSampleDatabase } from '@/data/sampleDatabases'
import type { ModuleTheory, TheoryBlock } from '@/data/theory'
import { executeSql } from '@/services/sqlDatabase'
import type { ExecutionResult } from '@/types/database'

import styles from './TheoryContent.module.scss'

export function formatar(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((parte, i) => {
    if(parte.startsWith('**')) return <strong key={i}>{parte.slice(2, -2)}</strong>
    if(parte.startsWith('`')) return <code key={i} className={styles.inlineCode}>{parte.slice(1, -1)}</code>
    return <Fragment key={i}>{parte}</Fragment>
  })
}

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

interface TheoryContentProps {
  theory: ModuleTheory
  headingLevel?: 2 | 3
}

export function TheoryContent({ theory, headingLevel = 2 }: TheoryContentProps) {
  const Titulo = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <div className={styles.conteudo}>
      {theory.sections.map((secao) => (
        <section key={secao.title} className={styles.secao}>
          <Titulo>{secao.title}</Titulo>
          {secao.blocks.map((block, i) => <Bloco key={i} block={block} />)}
        </section>
      ))}

      <section className={styles.resumo}>
        <Titulo>Resumo</Titulo>
        <ul>
          {theory.summary.map((item) => <li key={item}>{formatar(item)}</li>)}
        </ul>
      </section>
    </div>
  )
}