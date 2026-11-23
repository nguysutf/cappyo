export interface DatabaseColumn {
  name: string
  type: string
  primaryKey?: boolean
  nullable?: boolean
  foreignKey?: {
    table: string
    column: string
  }
}

export interface DatabaseTable {
  name: string
  description?: string
  columns: DatabaseColumn[]
  rows?: Record<string, unknown>[]
}

export interface DatabaseSchema {
  tables: DatabaseTable[]
}

export interface QueryOutput {
  columns: string[]
  rows: Record<string, unknown>[]
}

export interface ExecutionResult {
  success: boolean
  columns?: string[]
  rows?: Record<string, unknown>[]
  error?: string
  executionTime?: number
  message?: string
  expected?: QueryOutput
}