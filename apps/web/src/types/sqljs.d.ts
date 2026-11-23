declare module 'sql.js' {
  interface SqlJsConfig {
    locateFile?: (file: string) => string
  }

  interface SqlJsResult {
    columns: string[]
    values: Array<Array<string | number | null>>
  }

  interface SqlJsStatement {
    run(values?: Array<string | number | null>): void
    free(): boolean
  }

  interface SqlJsDatabase {
    exec(sql: string): SqlJsResult[]
    run(sql: string): void
    getRowsModified(): number
    prepare(sql: string): SqlJsStatement
    close(): void
  }

  interface SqlJsModule {
    Database: new (data?: Uint8Array) => SqlJsDatabase
  }

  export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsModule>
}