import Editor, { type OnMount, type Monaco } from '@monaco-editor/react'
import { Play, Loader2 } from 'lucide-react'
import { useRef, useEffect } from 'react'

import type { DatabaseSchema } from '@/types/database'

import { registerSqlCompletion } from './sqlCompletion'
import styles from './SqlEditor.module.scss'

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
  isExecuting: boolean
  schema: DatabaseSchema
  disabled?: boolean
}

export function SqlEditor({
  value,
  onChange,
  onExecute,
  isExecuting,
  schema,
  disabled = false,
}: SqlEditorProps) {
  const monacoRef = useRef<Monaco | null>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monacoRef.current = monaco

    // Register SQL schema autocomplete
    registerSqlCompletion(monaco, schema)

    // Add Ctrl+Enter or Cmd+Enter shortcut to execute query
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute()
    })
  }

  // Sync schema changes if needed
  useEffect(() => {
    if(monacoRef.current) {
      registerSqlCompletion(monacoRef.current, schema)
    }
  }, [schema])

  return (
    <div className={styles.editorCard}>
      <div className={styles.editorHeader}>
        <div className={styles.windowControls}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>

        <div className={styles.headerActions}>
          <span className={styles.shortcutTip}>
            Pressione <kbd>Ctrl</kbd> + <kbd>Enter</kbd> para executar
          </span>
          <span className={styles.langLabel}>SQL</span>
        </div>
      </div>

      <div className={styles.monacoContainer}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val ?? '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly: disabled,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            fontFamily: '\'Fira Code\', \'Courier New\', monospace',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
        />
      </div>

      <div className={styles.editorFooter}>
        <button
          type="button"
          className={styles.executeButton}
          disabled={disabled || isExecuting || !value.trim()}
          onClick={onExecute}
        >
          {isExecuting ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Executando...
            </>
          ) : (
            <>
              <Play size={16} />
              Executar consulta
            </>
          )}
        </button>
      </div>
    </div>
  )
}
