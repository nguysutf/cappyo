import { Code2, Database, Terminal } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'

import { Tabs, type TabItem } from '@/components/tabs'
import { codeExecutor } from '@/services/codeExecutor'
import type { ExecutionResult } from '@/types/database'
import type { CodeWritingExercise } from '@/types/lesson'

import styles from './CodeWriting.module.scss'
import { DatabasePanel } from './components/database-panel'
import { ExerciseDescription } from './components/exercise-description'
import { ResultPanel } from './components/result-panel'
import { SqlEditor } from './components/sql-editor'

interface CodeWritingProps {
  exercise: CodeWritingExercise
  userAnswer: string
  onAnswerChange: (code: string) => void
  isAnswered: boolean
  onExecutionComplete?: (result: ExecutionResult) => void
}

export function CodeWriting({
  exercise,
  userAnswer,
  onAnswerChange,
  isAnswered,
  onExecutionComplete,
}: CodeWritingProps) {
  const [activeTabId, setActiveTabId] = useState('editor')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)

  const handleExecute = useCallback(async () => {
    setIsExecuting(true)
    try {
      const res = await codeExecutor.execute(userAnswer, exercise.databaseSchema)

      setExecutionResult(res)
      setActiveTabId('result')
      onExecutionComplete?.(res)
    } finally {
      setIsExecuting(false)
    }
  }, [userAnswer, exercise.databaseSchema, onExecutionComplete])

  const handleInsertText = useCallback(
    (text: string) => {
      const space = userAnswer && !userAnswer.endsWith(' ') ? ' ' : ''

      onAnswerChange(`${userAnswer}${space}${text}`)
    },
    [userAnswer, onAnswerChange],
  )

  const tabs: TabItem[] = useMemo(() => {
    let resultBadge: React.ReactNode = null
    let resultBadgeType: 'default' | 'success' | 'error' = 'default'

    if(executionResult) {
      if(executionResult.success) {
        const rowCount = executionResult.rows?.length ?? 0

        resultBadge = `${rowCount} ${rowCount === 1 ? 'linha' : 'linhas'}`
        resultBadgeType = 'success'
      } else {
        resultBadge = 'Erro'
        resultBadgeType = 'error'
      }
    }

    return [
      {
        id: 'editor',
        label: 'Editor SQL',
        icon: <Code2 size={16} />,
        content: (
          <div className={styles.editorTabWrapper}>
            <SqlEditor
              value={userAnswer}
              onChange={onAnswerChange}
              onExecute={handleExecute}
              isExecuting={isExecuting}
              schema={exercise.databaseSchema}
              disabled={isAnswered}
            />
          </div>
        ),
      },
      {
        id: 'schema',
        label: 'Banco de Dados',
        icon: <Database size={16} />,
        content: (
          <div className={styles.tabContentWrapper}>
            <DatabasePanel
              schema={exercise.databaseSchema}
              onInsertText={isAnswered ? undefined : handleInsertText}
            />
          </div>
        ),
      },
      {
        id: 'result',
        label: 'Resultado',
        icon: <Terminal size={16} />,
        badge: resultBadge,
        badgeType: resultBadgeType,
        content: (
          <div className={styles.tabContentWrapper}>
            <ResultPanel result={executionResult} isExecuting={isExecuting} />
          </div>
        ),
      },
    ]
  }, [
    userAnswer,
    onAnswerChange,
    handleExecute,
    isExecuting,
    exercise.databaseSchema,
    isAnswered,
    handleInsertText,
    executionResult,
  ])

  return (
    <div className={styles.container}>
      <ExerciseDescription exercise={exercise} />

      <div className={styles.tabsWrapper}>
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          onChange={setActiveTabId}
          ariaLabel="Ambiente de Desenvolvimento SQL"
        />
      </div>
    </div>
  )
}
