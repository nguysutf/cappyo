import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

import { mockDatabaseData } from '@/mocks/databaseMock'
import type { DatabaseSchema, ExecutionResult, QueryOutput } from '@/types/database'

import type { ICodeExecutor } from './codeExecutor'

let sqlPromise: Promise<SqlJsStatic> | null = null

function loadSql() {
  sqlPromise ??= initSqlJs({ locateFile: () => wasmUrl })
  return sqlPromise
}

function createDatabase(SQL: SqlJsStatic, schema: DatabaseSchema): Database {
  const db = new SQL.Database()

  for(const table of schema.tables) {
    const columns = table.columns
      .map((c) => `${c.name} ${c.type}${c.primaryKey ? ' PRIMARY KEY' : ''}`)
      .join(', ')

    db.run(`CREATE TABLE ${table.name} (${columns})`)

    const rows = table.rows ?? mockDatabaseData[table.name] ?? []

    for(const row of rows) {
      const names = Object.keys(row)
      const values = names.map((n) => {
        const v = row[n]

        return typeof v === 'boolean' ? Number(v) : (v as string | number | null)
      })

      db.run(
        `INSERT INTO ${table.name} (${names.join(', ')}) VALUES (${names.map(() => '?').join(', ')})`,
        values,
      )
    }
  }

  return db
}

function toRows(schema: DatabaseSchema, columns: string[], values: unknown[][]) {
  const booleanColumns = new Set(
    schema.tables.flatMap((t) => t.columns.filter((c) => c.type === 'BOOLEAN').map((c) => c.name)),
  )

  return values.map((value) =>
    Object.fromEntries(
      columns.map((col, i) => [col, booleanColumns.has(col) ? Boolean(value[i]) : value[i]]),
    ),
  )
}

const MODIFIES_TABLE = /^\s*(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\s+([a-zA-Z_][a-zA-Z0-9_]*)/i

function lastStatement(code: string) {
  const statements = code.split(';').map((s) => s.trim()).filter(Boolean)

  return statements[statements.length - 1] ?? ''
}

function run(db: Database, schema: DatabaseSchema, code: string): QueryOutput & { message?: string } {
  const results = db.exec(code)
  const modified = lastStatement(code).match(MODIFIES_TABLE)

  if(modified) {
    const changes = db.getRowsModified()
    const table = modified[1]
    const [after] = db.exec(`SELECT * FROM ${table}`)
    const isStructure = /^\s*(?:CREATE|ALTER)/i.test(lastStatement(code))

    return {
      columns: after?.columns ?? [],
      rows: after ? toRows(schema, after.columns, after.values) : [],
      message: isStructure
        ? `Tabela ${table} criada/alterada. Conteúdo atual:`
        : `${changes} ${changes === 1 ? 'linha afetada' : 'linhas afetadas'}. Tabela ${table} agora:`,
    }
  }

  const last = results[results.length - 1]

  return {
    columns: last?.columns ?? [],
    rows: last ? toRows(schema, last.columns, last.values) : [],
  }
}

export class SqliteCodeExecutor implements ICodeExecutor {
  async execute(code: string, schema: DatabaseSchema, solutionQuery?: string): Promise<ExecutionResult> {
    if(!code.trim()) {
      return { success: false, error: 'Nenhuma consulta fornecida. Digite seu código SQL antes de executar.' }
    }

    const SQL = await loadSql()
    const start = performance.now()
    const db = createDatabase(SQL, schema)

    try {
      const output = run(db, schema, code)
      const executionTime = Math.round(performance.now() - start)

      let expected: QueryOutput | undefined

      if(solutionQuery) {
        const solutionDb = createDatabase(SQL, schema)

        try {
          expected = run(solutionDb, schema, solutionQuery)
        } finally {
          solutionDb.close()
        }
      }

      return { success: true, ...output, executionTime, expected }
    } catch(error) {
      return { success: false, error: `Erro no SQL: ${(error as Error).message}` }
    } finally {
      db.close()
    }
  }
}