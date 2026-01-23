'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionState = {
  error?: string
  success?: boolean
}

export async function login(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message, success: false }
  }

  // Check if email confirmation is required
  // If user is already confirmed (email confirmation disabled in Supabase), go to dashboard
  // Otherwise, go to confirmation page
  if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
    // Email already exists
    return { error: 'An account with this email already exists', success: false }
  }

  if (authData.session) {
    // User is auto-confirmed (email confirmation is disabled)
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } else {
    // User needs to confirm email
    revalidatePath('/', 'layout')
    redirect('/auth/confirm')
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
