import { Route, Routes, Navigate } from 'react-router-dom'

import { AuthPage } from '@/pages/auth'
import { CoursesPage } from '@/pages/courses'
import { DesignSystemPage } from '@/pages/design-system'
import { SqlJourneyPage } from '@/pages/journeys/sql'
import { SqlLessonPage } from '@/pages/journeys/sql/leasson'
import { ProgressPage } from '@/pages/progress'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/journeys/sql" replace />} />
      <Route path="/journeys/sql" element={<SqlJourneyPage />} />
      <Route path="/journeys/sql/leasson/:lessonId" element={<SqlLessonPage />} />
      <Route path="/progresso" element={<ProgressPage />} />
      <Route path="/cursos" element={<CoursesPage />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  )
}