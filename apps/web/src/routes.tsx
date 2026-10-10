import { Route, Routes, Navigate } from 'react-router-dom'

import { SqlLessonPage } from '@/pages/journeys/sql/leasson'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/journeys/sql/leasson" replace />} />
      <Route path="/journeys/sql/leasson" element={<SqlLessonPage />} />
    </Routes>
  )
}