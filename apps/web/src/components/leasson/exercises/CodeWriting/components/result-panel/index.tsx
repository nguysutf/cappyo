import { AlertCircle, Terminal, CheckCircle2 } from 'lucide-react'

import type { ExecutionResult } from '@/types/database'

import styles from './ResultPanel.module.scss'

interface ResultPanelProps {
  result: ExecutionResult | null
  isExecuting?: boolean
}

export function ResultPanel({ result, isExecuting }: ResultPanelProps) {
  if(isExecuting) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.emptyState}>
          <p>Executando consulta SQL...</p>
        </div>
      </div>
    )
  }

  if(!result) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.emptyState}>
          <Terminal size={36} />
          <p>Execute sua consulta para visualizar o resultado.</p>
        </div>
      </div>
    )
  }

  if(!result.success) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.errorBox}>
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <h4>Erro ao executar consulta</h4>
            <p>{result.error ?? 'Verifique a sintaxe SQL e tente novamente.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const rows = result.rows ?? []
  const columns = result.columns ?? (rows[0] ? Object.keys(rows[0]) : [])

  if(rows.length === 0) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.metaBar}>
          <span>
            <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 4, color: '#10b981' }} />
            Consulta executada com sucesso
          </span>
          {result.executionTime !== undefined && (
            <span>Tempo demonstrativo: {result.executionTime} ms</span>
          )}
        </div>
        <div className={styles.emptyState}>
          <p>A consulta foi executada com sucesso, mas não retornou registros.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.resultContainer}>
      <div className={styles.metaBar}>
        <span>
          {rows.length} {rows.length === 1 ? 'linha retornada' : 'linhas retornadas'}
        </span>
        {result.executionTime !== undefined && (
          <span>Tempo demonstrativo: {result.executionTime} ms</span>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col) => {
                  const val = row[col]
                  let displayVal = String(val ?? '')
                  let valClass = ''

                  if(val === null || val === undefined) {
                    displayVal = 'NULL'
                    valClass = styles.nullValue
                  } else if(typeof val === 'boolean') {
                    displayVal = val ? 'true' : 'false'
                    valClass = styles.booleanValue
                  }

                  return (
                    <td key={col} className={valClass}>
                      {displayVal}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
