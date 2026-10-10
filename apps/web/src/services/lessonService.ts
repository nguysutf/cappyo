import { mockSqlLessonSession } from '@/mocks/sqlLessonMock'
import type { LessonSession } from '@/types/lesson'

export interface ILessonService {
  getLessonSession(journeyId: string, lessonId?: string): Promise<LessonSession>
  submitAnswer(
    lessonId: string,
    exerciseId: string,
    answer: string,
  ): Promise<{ success: boolean }>
}

class LessonService implements ILessonService {
  /**
   * Simulates fetching a lesson session with an async response.
   * Can easily be replaced with an HTTP client (e.g. fetch / axios) in the future.
   */
  async getLessonSession(journeyId: string, lessonId?: string): Promise<LessonSession> {
    // Artificial small delay to simulate network latency if needed
    await new Promise((resolve) => setTimeout(resolve, 80))

    if(journeyId === 'sql' || lessonId === 'sql-intro-01') {
      return structuredClone(mockSqlLessonSession)
    }

    return structuredClone(mockSqlLessonSession)
  }

  /**
   * Simulates sending an exercise answer to the backend.
   */
  async submitAnswer(
    _lessonId: string,
    _exerciseId: string,
    _answer: string,
  ): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return { success: true }
  }
}

export const lessonService = new LessonService()
