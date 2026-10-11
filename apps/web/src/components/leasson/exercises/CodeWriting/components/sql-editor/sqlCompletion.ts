import type { Monaco } from '@monaco-editor/react'

import type { DatabaseSchema } from '@/types/database'

const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'ORDER BY',
  'GROUP BY',
  'HAVING',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'ON',
  'AS',
  'AND',
  'OR',
  'NOT',
  'IN',
  'IS',
  'NULL',
  'LIKE',
  'ASC',
  'DESC',
  'LIMIT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE TABLE',
  'DROP TABLE',
]

/**
 * Registers custom SQL completion provider in Monaco Editor using schema context.
 */
export function registerSqlCompletion(monaco: Monaco, schema: DatabaseSchema) {
  return monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: [' ', '.', ','],
    provideCompletionItems: (model, position) => {
      const wordInfo = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordInfo.startColumn,
        endColumn: wordInfo.endColumn,
      }

      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })

      const upperText = textUntilPosition.toUpperCase()
      const isAfterFrom = /\bFROM\s+[a-zA-Z0-9_]*$/i.test(textUntilPosition) || /\bJOIN\s+[a-zA-Z0-9_]*$/i.test(textUntilPosition)
      const suggestions: Array<{
        label: string
        kind: number
        insertText: string
        detail?: string
        documentation?: string
        range: typeof range
      }> = []

      // 1. Table suggestions (prioritized after FROM or JOIN)
      for(const table of schema.tables) {
        suggestions.push({
          label: table.name,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: table.name,
          detail: `Tabela (${table.columns.length} colunas)`,
          documentation: table.description ?? `Tabela ${table.name}`,
          range,
        })
      }

      // 2. Column suggestions
      for(const table of schema.tables) {
        for(const col of table.columns) {
          suggestions.push({
            label: `${col.name}`,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: col.name,
            detail: `Coluna de '${table.name}' [${col.type}]`,
            documentation: `Coluna ${col.name} (${col.type})${col.primaryKey ? ' - Chave Primária' : ''}`,
            range,
          })
        }
      }

      // 3. Keyword suggestions (only if not strictly typing a table name after FROM)
      if(!isAfterFrom || upperText.trim().endsWith(' ')) {
        for(const kw of SQL_KEYWORDS) {
          suggestions.push({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            detail: 'Palavra reservada SQL',
            range,
          })
        }
      }

      return { suggestions }
    },
  })
}
