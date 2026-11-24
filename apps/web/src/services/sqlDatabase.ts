import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

import { mockDatabaseData } from '@/mocks/databaseMock'
import type { DatabaseSchema, ExecutionResult, QueryOutput } from '@/types/database'

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

    const rows = table.rows ?? mockDatabaseData[table.name] ?? []

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

type Database = Awaited<ReturnType<typeof createDatabase>>

const MODIFIES_TABLE = /^\s*(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\s+"?([a-zA-Z_][a-zA-Z0-9_]*)/i

function lastStatement(code: string) {
  const statements = code.split(';').map((s) => s.trim()).filter(Boolean)

  return statements[statements.length - 1] ?? ''
}

function toRows(schema: DatabaseSchema, columns: string[], values: Array<Array<string | number | null>>) {
  const booleanColumns = new Set(
    schema.tables.flatMap((table) => table.columns
      .filter((column) => column.type.toUpperCase().includes('BOOL'))
      .map((column) => column.name.toLowerCase())),
  )

  return values.map((row) => Object.fromEntries(
    columns.map((column, index) => {
      const value = row[index]
      const normalizedValue = booleanColumns.has(column.toLowerCase()) && (value === 0 || value === 1)
        ? Boolean(value)
        : value

      return [column, normalizedValue]
    }),
  ))
}

function run(database: Database, schema: DatabaseSchema, code: string): QueryOutput & { message?: string } {
  const resultSets = database.exec(code)
  const modified = lastStatement(code).match(MODIFIES_TABLE)

  if(modified) {
    const changes = database.getRowsModified()
    const table = modified[1]
    const [after] = database.exec(`SELECT * FROM ${quoteIdentifier(table)}`)
    const isStructure = /^\s*(?:CREATE|ALTER)/i.test(lastStatement(code))

    return {
      columns: after?.columns ?? [],
      rows: after ? toRows(schema, after.columns, after.values) : [],
      message: isStructure
        ? `Tabela ${table} criada/alterada. Conteúdo atual:`
        : `${changes} ${changes === 1 ? 'linha afetada' : 'linhas afetadas'}. Tabela ${table} agora:`,
    }
  }

  const last = resultSets[resultSets.length - 1]

  return {
    columns: last?.columns ?? [],
    rows: last ? toRows(schema, last.columns, last.values) : [],
  }
}

export async function executeSql(code: string, schema: DatabaseSchema, solutionQuery?: string): Promise<ExecutionResult> {
  const query = code.trim()

  if(!query) {
    return {
      success: false,
      error: 'Nenhuma consulta fornecida. Digite seu código SQL antes de executar.',
    }
  }

  const startedAt = performance.now()
  let database: Database | null = null

  try {
    database = await createDatabase(schema)
    const output = run(database, schema, query)

    let expected: QueryOutput | undefined

    if(solutionQuery) {
      const solutionDatabase = await createDatabase(schema)

      try {
        expected = run(solutionDatabase, schema, solutionQuery)
      } finally {
        solutionDatabase.close()
      }
    }

    return {
      success: true,
      ...output,
      expected,
      executionTime: Math.max(1, Math.round(performance.now() - startedAt)),
    }
  } catch(error) {
    return {
      success: false,
      error: error instanceof Error ? `Erro no SQL: ${error.message}` : 'Não foi possível executar a consulta SQL.',
      executionTime: Math.max(1, Math.round(performance.now() - startedAt)),
    }
  } finally {
    database?.close()
  }
}

export async function createSqlSession(schema: DatabaseSchema) {
  let database: Database = await createDatabase(schema)

  return {
    execute(code: string): ExecutionResult {
      const query = code.trim()

      if(!query) return { success: false, error: 'Escreva um comando SQL antes de executar.' }

      const startedAt = performance.now()

      try {
        return {
          success: true,
          ...run(database, schema, query),
          executionTime: Math.max(1, Math.round(performance.now() - startedAt)),
        }
      } catch(error) {
        return {
          success: false,
          error: error instanceof Error ? `Erro no SQL: ${error.message}` : 'Não foi possível executar o comando.',
        }
      }
    },

    async reset() {
      database.close()
      database = await createDatabase(schema)
    },

    getSchema(): DatabaseSchema {
      const [tabelas] = database.exec(
        'SELECT name FROM sqlite_master WHERE type = \'table\' AND name NOT LIKE \'sqlite_%\' ORDER BY rowid',
      )

      return {
        tables: (tabelas?.values ?? []).map(([nome]) => {
          const original = schema.tables.find((t) => t.name === nome)
          const [colunas] = database.exec(`PRAGMA table_info(${quoteIdentifier(String(nome))})`)

          return {
            name: String(nome),
            description: original?.description ?? 'Tabela criada por você no Laboratório.',
            columns: (colunas?.values ?? []).map(([, colNome, tipo, notNull, , pk]) => {
              const coluna = original?.columns.find((c) => c.name === colNome)

              return {
                name: String(colNome),
                type: coluna?.type ?? (String(tipo) || 'TEXT'),
                primaryKey: Number(pk) > 0,
                nullable: !Number(notNull),
                foreignKey: coluna?.foreignKey,
              }
            }),
          }
        }),
      }
    },

    close() {
      database.close()
    },
  }
}

export type SqlSession = Awaited<ReturnType<typeof createSqlSession>>