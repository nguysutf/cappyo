import type { User } from '@supabase/supabase-js'

import { supabase } from './supabase'

export interface AuthFormData {
  email: string
  password: string
  displayName?: string
}

export async function getCurrentUser(): Promise<User | null> {
  if(!supabase) return null

  const { data } = await supabase.auth.getUser()

  return data.user
}

export async function signIn({ email, password }: AuthFormData) {
  if(!supabase) return { error: 'O Supabase local ainda não está configurado.' }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  return { error: error?.message }
}

export async function signUp({ email, password, displayName }: AuthFormData) {
  if(!supabase) return { error: 'O Supabase local ainda não está configurado.' }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName?.trim() || email.split('@')[0],
      },
    },
  })

  return { error: error?.message }
}

export async function signOut() {
  if(!supabase) return
  await supabase.auth.signOut()
}
