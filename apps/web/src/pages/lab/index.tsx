import { FlaskConical, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { DatabasePanel } from '@/components/leasson/exercises/CodeWriting/components/database-panel'
import { ResultPanel } from '@/components/leasson/exercises/CodeWriting/components/result-panel'
import { SqlEditor } from '@/components/leasson/exercises/CodeWriting/components/sql-editor'
import { getSampleDatabase, sampleDatabases } from '@/data/sampleDatabases'
import { createSqlSession, type SqlSession } from '@/services/sqlDatabase'
import type { DatabaseSchema, ExecutionResult } from '@/types/database'

import styles from './Lab.module.scss'

export function LabPage() {
  const [databaseId, setDatabaseId] = useState(sampleDatabases[0].id)
  const database = getSampleDatabase(databaseId)
  const [code, setCode] = useState(database.examples[0].sql)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  // Tabelas mostradas à esquerda: acompanham CREATE, ALTER e DROP feitos pelo aluno
  const [schemaAtual, setSchemaAtual] = useState<DatabaseSchema>(database.schema)
  const [isExecuting, setIsExecuting] = useState(false)
  const [aviso, setAviso] = useState('')
  const sessionRef = useRef<SqlSession | null>(null)
  const codeRef = useRef(code)

  codeRef.current = code

  useEffect(() => {
    let cancelado = false

    void createSqlSession(database.schema).then((session) => {
      if(cancelado) {
        session.close()
        return
      }
      sessionRef.current = session
      setSchemaAtual(session.getSchema())
    })

    return () => {
      cancelado = true
      sessionRef.current?.close()
      sessionRef.current = null
    }
  }, [database.schema])

  const executar = useCallback(() => {
    if(!sessionRef.current) return
    setIsExecuting(true)
    setAviso('')
    setResult(sessionRef.current.execute(codeRef.current))
    setSchemaAtual(sessionRef.current.getSchema())
    setIsExecuting(false)
  }, [])

  async function restaurar() {
    await sessionRef.current?.reset()
    if(sessionRef.current) setSchemaAtual(sessionRef.current.getSchema())
    setResult(null)
    setAviso(`Banco "${database.name}" restaurado com os dados originais.`)
  }

  function trocarBanco(id: string) {
    setDatabaseId(id)
    setCode(getSampleDatabase(id).examples[0].sql)
    setResult(null)
    setAviso('')
  }

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}><FlaskConical size={15} aria-hidden="true" /> AMBIENTE LIVRE</p>
          <h1>Laboratório de SQL</h1>
          <p>Escreva e execute qualquer comando SQL, sem nota e sem vidas. As mudanças ficam salvas até você restaurar o banco.</p>
        </header>

        <div className={styles.bancos} role="group" aria-label="Escolha o banco de dados">
          {sampleDatabases.map((db) => (
            <button
              key={db.id}
              type="button"
              className={`${styles.banco} ${db.id === databaseId ? styles.bancoAtivo : ''}`}
              aria-pressed={db.id === databaseId}
              onClick={() => trocarBanco(db.id)}
            >
              <strong>{db.name}</strong>
              <span>{db.description}</span>
            </button>
          ))}
        </div>

        <div className={styles.area}>
          <aside className={styles.tabelas}>
            <h2>Tabelas</h2>
            <DatabasePanel key={databaseId} schema={schemaAtual} />
          </aside>

          <section className={styles.trabalho}>
            <div className={styles.exemplos} aria-label="Exemplos prontos">
              <span>Exemplos:</span>
              {database.examples.map((ex) => (
                <button key={ex.label} type="button" onClick={() => setCode(ex.sql)}>{ex.label}</button>
              ))}
            </div>

            <SqlEditor
              key={databaseId}
              value={code}
              onChange={setCode}
              onExecute={executar}
              isExecuting={isExecuting}
              schema={schemaAtual}
            />

            <div className={styles.acoes}>
              <button type="button" className={styles.restaurar} onClick={() => void restaurar()}>
                <RotateCcw size={16} aria-hidden="true" /> Restaurar banco
              </button>
            </div>

            <p role="status" className={styles.aviso}>{aviso}</p>

            <ResultPanel result={result} isExecuting={isExecuting} />
          </section>
        </div>
      </main>
    </div>
  )
}