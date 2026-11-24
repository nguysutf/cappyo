import { sqlJourney } from '@/data/sqlJourney'
import type { Module } from '@/data/sqlJourney'

import { supabase } from './supabase'

export async function getJourney(slug: string): Promise<Module[]> {
  if(!supabase) return structuredClone(sqlJourney)

  const { data } = await supabase
    .from('journeys')
    .select('id, modules(id, title, description, color, sort_order, lessons(id, title, available, sort_order))')
    .eq('slug', slug)
    .maybeSingle()

  if(!data?.modules?.length) return structuredClone(sqlJourney)

  return [...data.modules]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      color: module.color as Module['color'],
      videoId: sqlJourney.find((local) => local.id === module.id)?.videoId,
      lessons: [...(module.lessons ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          available: lesson.available,
        })),
    }))
}