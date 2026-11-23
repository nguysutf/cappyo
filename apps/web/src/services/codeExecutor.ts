import type { DatabaseSchema, ExecutionResult } from '@/types/database'

import { executeSql } from './sqlDatabase'

export interface ICodeExecutor {
  execute(code: string, schema: DatabaseSchema): Promise<ExecutionResult>
}

export class SqlJsCodeExecutor implements ICodeExecutor {
  execute(code: string, schema: DatabaseSchema): Promise<ExecutionResult> {
    return executeSql(code, schema)
  }
}

export const codeExecutor = new SqlJsCodeExecutor()
