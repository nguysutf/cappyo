import type { DatabaseSchema, ExecutionResult } from '@/types/database'

import { executeSql } from './sqlDatabase'

export interface ICodeExecutor {
  execute(code: string, schema: DatabaseSchema, solutionQuery?: string): Promise<ExecutionResult>
}

export class SqlJsCodeExecutor implements ICodeExecutor {
  execute(code: string, schema: DatabaseSchema, solutionQuery?: string): Promise<ExecutionResult> {
    return executeSql(code, schema, solutionQuery)
  }
}

export const codeExecutor = new SqlJsCodeExecutor()