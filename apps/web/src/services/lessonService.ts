import { mockSqlSchema } from '@/mocks/databaseMock'
import { mockSqlLessonSession } from '@/mocks/sqlLessonMock'
import type { LessonSession } from '@/types/lesson'

import { supabase } from './supabase'

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
    if(supabase && lessonId) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('id, title, exercises(id, type, position, payload)')
        .eq('id', lessonId)
        .maybeSingle()

      if(lesson?.exercises?.length) {
        const exercises = [...lesson.exercises]
          .sort((a, b) => a.position - b.position)
          .map((exercise) => {
            const payload = exercise.payload as Record<string, unknown>

            return {
              id: exercise.id,
              type: exercise.type,
              ...payload,
              ...(exercise.type === 'code-writing' && !payload.databaseSchema
                ? { databaseSchema: mockSqlSchema }
                : {}),
            }
          })

        return {
          id: lesson.id,
          journeyId,
          title: lesson.title,
          exercises: exercises as LessonSession['exercises'],
        }
      }
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
