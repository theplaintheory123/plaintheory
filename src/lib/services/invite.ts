import { createAdminClient } from '@/lib/supabase/admin'

export type InviteResult = {
  success: boolean
  inviteLink?: string
  error?: string
}

export type GenerateInviteLinkOptions = {
  email: string
  redirectTo?: string
}

/**
 * Generates a Supabase Auth invite link for a user.
 *
 * This creates a user in Supabase Auth (if they don't exist) and generates
 * a magic link they can use to set up their account.
 *
 * NOTE: This does NOT send an email automatically. You need to send the
 * returned invite link via your own email service (Resend, SendGrid, etc).
 */
export async function generateInviteLink(
  options: GenerateInviteLinkOptions
): Promise<InviteResult> {
  const { email, redirectTo } = options

  try {
    const supabaseAdmin = createAdminClient()

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error generating invite link:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data?.properties?.action_link) {
      return {
        success: false,
        error: 'No invite link generated',
      }
    }

    return {
      success: true,
      inviteLink: data.properties.action_link,
    }
  } catch (err) {
    console.error('Error in generateInviteLink:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    }
  }
}

/**
 * Generates an invite link and returns additional user data.
 * Useful when you need the created user's ID for database operations.
 */
export async function generateInviteLinkWithUser(options: GenerateInviteLinkOptions) {
  const { email, redirectTo } = options

  try {
    const supabaseAdmin = createAdminClient()

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error generating invite link:', error)
      return {
        success: false as const,
        error: error.message,
      }
    }

    return {
      success: true as const,
      inviteLink: data.properties.action_link,
      hashedToken: data.properties.hashed_token,
      user: data.user,
    }
  } catch (err) {
    console.error('Error in generateInviteLinkWithUser:', err)
    return {
      success: false as const,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    }
  }
}
