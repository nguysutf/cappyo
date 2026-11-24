import { supabase } from './supabase'

const COMPLETED_KEY = 'cappyo:concluidas'
const STATS_KEY = 'cappyo:stats'

export interface LearnerStats {
  xp: number
  streak: number
  hearts: number
  dailyGoal: number
  dailyXp: number
  lastActiveDate?: string
}

export interface LessonCompletionData {
  accuracy: number
  exercisesCompleted: number
  xpEarned: number
}

const defaultStats: LearnerStats = {
  xp: 0,
  streak: 0,
  hearts: 5,
  dailyGoal: 20,
  dailyXp: 0,
  lastActiveDate: undefined,
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function yesterday() {
  const date = new Date()

  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

function readStoredStats(): LearnerStats {
  try {
    return { ...defaultStats, ...JSON.parse(localStorage.getItem(STATS_KEY) ?? '{}') }
  } catch {
    return defaultStats
  }
}

function writeStoredStats(stats: LearnerStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function getConcluidas(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function marcarConcluida(lessonId: string) {
  const concluidas = getConcluidas()

  if(!concluidas.includes(lessonId)) {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...concluidas, lessonId]))
  }
}

export async function getLearnerStats(): Promise<LearnerStats> {
  const stored = readStoredStats()

  if(!supabase) return stored

  const { data: userData } = await supabase.auth.getUser()

  if(!userData.user) return stored

  const [{ data: profile }, { data: daily }] = await Promise.all([
    supabase.from('profiles').select('xp, streak_count, hearts, daily_goal').eq('id', userData.user.id).maybeSingle(),
    supabase.from('user_daily_stats').select('xp_earned').eq('user_id', userData.user.id).eq('activity_date', today()).maybeSingle(),
  ])

  if(!profile) return stored

  return {
    xp: profile.xp,
    streak: profile.streak_count,
    hearts: profile.hearts,
    dailyGoal: profile.daily_goal,
    dailyXp: daily?.xp_earned ?? 0,
  }
}

export async function syncProgressFromSupabase() {
  if(!supabase) return getConcluidas()

  const { data: userData } = await supabase.auth.getUser()

  if(!userData.user) return getConcluidas()

  const { data } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', userData.user.id)
    .not('completed_at', 'is', null)

  if(!data?.length) return getConcluidas()

  const merged = Array.from(new Set([...getConcluidas(), ...data.map((item) => item.lesson_id)]))

  localStorage.setItem(COMPLETED_KEY, JSON.stringify(merged))
  return merged
}

export async function recordLessonCompletion(lessonId: string, completion: LessonCompletionData) {
  const alreadyCompleted = getConcluidas().includes(lessonId)

  marcarConcluida(lessonId)
  if(alreadyCompleted) return

  const stored = readStoredStats()
  const currentDate = today()
  const isSameDay = stored.lastActiveDate === currentDate
  const isConsecutiveDay = stored.lastActiveDate === yesterday()
  const nextStats: LearnerStats = {
    ...stored,
    xp: stored.xp + completion.xpEarned,
    streak: isSameDay ? stored.streak : isConsecutiveDay ? stored.streak + 1 : 1,
    dailyXp: isSameDay ? stored.dailyXp + completion.xpEarned : completion.xpEarned,
    lastActiveDate: currentDate,
  }

  writeStoredStats(nextStats)

  if(!supabase) return

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if(!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak_count, last_active_date')
    .eq('id', user.id)
    .maybeSingle()

  const { data: dailyStat } = await supabase
    .from('user_daily_stats')
    .select('xp_earned, exercises_completed')
    .eq('user_id', user.id)
    .eq('activity_date', currentDate)
    .maybeSingle()

  const profileStreak = profile?.last_active_date === currentDate
    ? (profile.streak_count ?? 0)
    : profile?.last_active_date === yesterday()
      ? (profile.streak_count ?? 0) + 1
      : 1

  await Promise.all([
    supabase.from('profiles').update({
      xp: (profile?.xp ?? 0) + completion.xpEarned,
      streak_count: profileStreak,
      last_active_date: currentDate,
    }).eq('id', user.id),
    supabase.from('user_lesson_progress').upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      xp_earned: completion.xpEarned,
      best_accuracy: completion.accuracy,
      attempts: 1,
    }, { onConflict: 'user_id,lesson_id' }),
    supabase.from('user_daily_stats').upsert({
      user_id: user.id,
      activity_date: currentDate,
      xp_earned: (dailyStat?.xp_earned ?? 0) + completion.xpEarned,
      exercises_completed: (dailyStat?.exercises_completed ?? 0) + completion.exercisesCompleted,
    }, { onConflict: 'user_id,activity_date' }),
  ])
}

export async function recordExerciseAttempt(
  lessonId: string,
  exerciseId: string,
  answer: string,
  isCorrect: boolean,
  executionResult?: unknown,
) {
  if(!supabase) return

  const { data: userData } = await supabase.auth.getUser()

  if(!userData.user) return

  await supabase.from('user_exercise_attempts').insert({
    user_id: userData.user.id,
    lesson_id: lessonId,
    exercise_id: exerciseId,
    answer,
    is_correct: isCorrect,
    execution_result: executionResult ?? null,
  })
}