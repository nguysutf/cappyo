import { Route, Routes, Navigate } from 'react-router-dom'

import { DesignSystemPage } from '@/pages/design-system'
import { SqlJourneyPage } from '@/pages/journeys/sql'
import { SqlLessonPage } from '@/pages/journeys/sql/leasson'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/journeys/sql" replace />} />
      <Route path="/journeys/sql" element={<SqlJourneyPage />} />
      <Route path="/journeys/sql/leasson/:lessonId" element={<SqlLessonPage />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
    </Routes>
  )
}