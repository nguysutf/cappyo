import { ChevronRight, ChevronDown, Table as TableIcon, Key, Link2 } from 'lucide-react'
import { useState } from 'react'

import type { DatabaseSchema } from '@/types/database'

import styles from './DatabasePanel.module.scss'

interface DatabasePanelProps {
  schema: DatabaseSchema
  onInsertText?: (text: string) => void
}

export function DatabasePanel({ schema, onInsertText }: DatabasePanelProps) {
  // First table expanded by default
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [schema.tables[0]?.name ?? '']: true,
  })

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }))
  }

  return (
    <div className={styles.panelContainer} role="region" aria-label="Esquema do banco de dados">
      {schema.tables.map((table) => {
        const isOpen = Boolean(expandedTables[table.name])

        return (
          <div
            key={table.name}
            className={`${styles.tableGroup} ${isOpen ? styles.open : ''}`}
          >
            <button
              type="button"
              className={styles.tableHeader}
              onClick={() => toggleTable(table.name)}
              aria-expanded={isOpen}
            >
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <TableIcon size={16} style={{ color: '#6366f1' }} />
              <span className={styles.tableName}>{table.name}</span>

              {onInsertText && (
                <span
                  className={styles.insertHint}
                  onClick={(e) => {
                    e.stopPropagation()
                    onInsertText(table.name)
                  }}
                  title="Inserir nome da tabela no editor"
                >
                  + Inserir
                </span>
              )}
            </button>

            {isOpen && (
              <>
                {table.description && (
                  <p className={styles.tableDescription}>{table.description}</p>
                )}

                <div className={styles.columnList}>
                  {table.columns.map((col) => (
                    <div key={col.name} className={styles.columnItem}>
                      {col.primaryKey ? (
                        <span title="Chave Primária"><Key size={14} style={{ color: '#d97706' }} /></span>
                      ) : col.foreignKey ? (
                        <span title="Chave Estrangeira"><Link2 size={14} style={{ color: '#0284c7' }} /></span>
                      ) : (
                        <span style={{ width: 14 }} />
                      )}

                      <span
                        className={styles.colName}
                        style={{ cursor: onInsertText ? 'pointer' : 'default' }}
                        onClick={() => onInsertText?.(col.name)}
                        title={onInsertText ? 'Clique para inserir no editor' : undefined}
                      >
                        {col.name}
                      </span>

                      <span className={styles.colType}>{col.type}</span>

                      {col.primaryKey && <span className={styles.badgePk}>PK</span>}
                      {col.foreignKey && (
                        <span
                          className={styles.badgeFk}
                          title={`FK -> ${col.foreignKey.table}.${col.foreignKey.column}`}
                        >
                          FK
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
