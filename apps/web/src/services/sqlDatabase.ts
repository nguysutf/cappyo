import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

import { mockDatabaseData } from '@/mocks/databaseMock'
import type { DatabaseSchema, ExecutionResult } from '@/types/database'

let sqlModulePromise: ReturnType<typeof initSqlJs> | null = null

function getSqlModule() {
  sqlModulePromise ??= initSqlJs({ locateFile: () => wasmUrl })
  return sqlModulePromise
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`
}

function sqliteType(type: string) {
  const normalizedType = type.toUpperCase()

  if(normalizedType.includes('INT')) return 'INTEGER'
  if(normalizedType.includes('DECIMAL') || normalizedType.includes('NUMERIC') || normalizedType.includes('REAL')) return 'REAL'
  if(normalizedType.includes('BOOL')) return 'INTEGER'

  return 'TEXT'
}

async function createDatabase(schema: DatabaseSchema) {
  const SQL = await getSqlModule()
  const database = new SQL.Database()

  for(const table of schema.tables) {
    const columnDefinitions = table.columns.map((column) => {
      const primaryKey = column.primaryKey ? ' PRIMARY KEY' : ''
      const nullable = column.nullable === false || column.primaryKey ? ' NOT NULL' : ''

      return `${quoteIdentifier(column.name)} ${sqliteType(column.type)}${primaryKey}${nullable}`
    })

    database.run(`CREATE TABLE ${quoteIdentifier(table.name)} (${columnDefinitions.join(', ')})`)

    const rows = mockDatabaseData[table.name] ?? []

    if(rows.length === 0) continue

    const columnNames = table.columns.map((column) => column.name)
    const placeholders = columnNames.map(() => '?').join(', ')
    const insert = database.prepare(
      `INSERT INTO ${quoteIdentifier(table.name)} (${columnNames.map(quoteIdentifier).join(', ')}) VALUES (${placeholders})`,
    )

    try {
      for(const row of rows) {
        insert.run(columnNames.map((columnName) => {
          const value = row[columnName]

          if(value === null || value === undefined) return null
          if(typeof value === 'boolean') return Number(value)
          if(typeof value === 'string' || typeof value === 'number') return value

          return String(value)
        }))
      }
    } finally {
      insert.free()
    }
  }

  return database
}

export async function executeSql(code: string, schema: DatabaseSchema): Promise<ExecutionResult> {
  const query = code.trim()

  if(!query) {
    return {
      success: false,
      error: 'Nenhuma consulta fornecida. Digite seu código SQL antes de executar.',
    }
  }

  const startedAt = performance.now()
  let database: Awaited<ReturnType<typeof createDatabase>> | null = null

  try {
    database = await createDatabase(schema)
    const resultSets = database.exec(query)
    const firstResult = resultSets[0]
    const booleanColumns = new Set(
      schema.tables.flatMap((table) => table.columns
        .filter((column) => column.type.toUpperCase().includes('BOOL'))
        .map((column) => column.name.toLowerCase())),
    )
    const rows = firstResult
      ? firstResult.values.map((values) => Object.fromEntries(
        firstResult.columns.map((column, index) => {
          const value = values[index]
          const normalizedValue = booleanColumns.has(column.toLowerCase()) && (value === 0 || value === 1)
            ? Boolean(value)
            : value

          return [column, normalizedValue]
        }),
      ))
      : []

    return {
      success: true,
      columns: firstResult?.columns ?? [],
      rows,
      executionTime: Math.max(1, Math.round(performance.now() - startedAt)),
    }
  } catch(error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Não foi possível executar a consulta SQL.',
      executionTime: Math.max(1, Math.round(performance.now() - startedAt)),
    }
  } finally {
    database?.close()
  }
}
