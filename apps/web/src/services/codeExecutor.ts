import { mockDatabaseData } from '@/mocks/databaseMock'
import type { DatabaseSchema, ExecutionResult } from '@/types/database'

export interface ICodeExecutor {
  execute(code: string, schema: DatabaseSchema): Promise<ExecutionResult>
}

export class MockCodeExecutor implements ICodeExecutor {
  async execute(code: string, schema: DatabaseSchema): Promise<ExecutionResult> {
    // Artificial latency simulation (150ms)
    await new Promise((resolve) => setTimeout(resolve, 150))

    const cleanCode = code.trim().replace(/;$/, '')

    if(!cleanCode) {
      return {
        success: false,
        error: 'Nenhuma consulta fornecida. Digite seu código SQL antes de executar.',
      }
    }

    // Basic SQL Regex parser for SELECT queries
    const selectMatch = cleanCode.match(
      /^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i,
    )

    if(!selectMatch) {
      // Check if user wrote non-SELECT statement
      if(/^(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/i.test(cleanCode)) {
        return {
          success: false,
          error: 'Operações de modificação de estrutura/dados (DML/DDL) não são permitidas nesta lição. Utilize apenas SELECT.',
        }
      }

      return {
        success: false,
        error: 'Sintaxe SQL não reconhecida ou não suportada. Verifique se a estrutura é: SELECT colunas FROM tabela WHERE condicao;',
      }
    }

    const [, columnsStr, tableNameInput, whereStr, _orderByStr, limitStr] = selectMatch
    const tableName = tableNameInput.toLowerCase()

    // Validate table existence in schema
    const targetTable = schema.tables.find((t) => t.name.toLowerCase() === tableName)

    if(!targetTable) {
      return {
        success: false,
        error: `Tabela '${tableNameInput}' não encontrada no banco de dados. Tabelas disponíveis: ${schema.tables.map((t) => t.name).join(', ')}.`,
      }
    }

    const rawRows = mockDatabaseData[targetTable.name] ?? []

    // Parse requested columns
    let selectedColumns: string[] = []

    if(columnsStr.trim() === '*') {
      selectedColumns = targetTable.columns.map((c) => c.name)
    } else {
      selectedColumns = columnsStr
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)

      // Validate column names against schema
      for(const col of selectedColumns) {
        const colExists = targetTable.columns.some((c) => c.name.toLowerCase() === col.toLowerCase())

        if(!colExists) {
          return {
            success: false,
            error: `Coluna '${col}' não existe na tabela '${targetTable.name}'. Colunas válidas: ${targetTable.columns.map((c) => c.name).join(', ')}.`,
          }
        }
      }
    }

    // Filter rows (WHERE)
    let filteredRows = [...rawRows]

    if(whereStr) {
      const conditionMatch = whereStr.match(/^([a-zA-Z0-9_]+)\s*(=|!=|>|<|>=|<=)\s*(.+)$/)

      if(!conditionMatch) {
        return {
          success: false,
          error: `Condição WHERE '${whereStr}' não suportada. Exemplo suportado: WHERE active = true ou WHERE id = 1`,
        }
      }

      const [, whereCol, operator, rawVal] = conditionMatch
      const colDef = targetTable.columns.find((c) => c.name.toLowerCase() === whereCol.toLowerCase())

      if(!colDef) {
        return {
          success: false,
          error: `Coluna '${whereCol}' na cláusula WHERE não existe na tabela '${targetTable.name}'.`,
        }
      }

      let targetVal: unknown = rawVal.trim().replace(/^['"]|['"]$/g, '')

      if(rawVal.trim().toLowerCase() === 'true') targetVal = true
      if(rawVal.trim().toLowerCase() === 'false') targetVal = false
      if(!isNaN(Number(rawVal.trim())) && rawVal.trim() !== '') targetVal = Number(rawVal.trim())

      filteredRows = filteredRows.filter((row) => {
        const rowVal = row[colDef.name]

        if(operator === '=') return rowVal === targetVal
        if(operator === '!=') return rowVal !== targetVal
        if(operator === '>') return Number(rowVal) > Number(targetVal)
        if(operator === '<') return Number(rowVal) < Number(targetVal)
        if(operator === '>=') return Number(rowVal) >= Number(targetVal)
        if(operator === '<=') return Number(rowVal) <= Number(targetVal)

        return false
      })
    }

    // Apply LIMIT
    if(limitStr) {
      const limitNum = parseInt(limitStr, 10)

      if(!isNaN(limitNum)) {
        filteredRows = filteredRows.slice(0, limitNum)
      }
    }

    // Project columns in output rows
    const projectedRows = filteredRows.map((row) => {
      const newRow: Record<string, unknown> = {}

      for(const col of selectedColumns) {
        const actualColDef = targetTable.columns.find((c) => c.name.toLowerCase() === col.toLowerCase())

        const colName = actualColDef ? actualColDef.name : col

        newRow[colName] = row[colName]
      }

      return newRow
    })

    return {
      success: true,
      columns: selectedColumns,
      rows: projectedRows,
      executionTime: 12, // simulated ms
    }
  }
}

export const codeExecutor = new MockCodeExecutor()
