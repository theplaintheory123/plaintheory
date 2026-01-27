import { NextResponse } from 'next/server'
import { sendInviteEmail } from '@/lib/services/email'
import { generateInviteLink } from '@/lib/services/invite'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
  }

  const results: Record<string, unknown> = {
    email,
    timestamp: new Date().toISOString(),
  }

  // Test 1: Check environment variables
  results.envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  }

  // Test 2: Generate invite link
  console.log('Testing invite link generation...')
  const inviteResult = await generateInviteLink({
    email,
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/invite/accept?workspace=test&role=viewer`,
  })
  results.inviteLinkGeneration = inviteResult

  // Test 3: Send test email (only if invite link was generated)
  if (inviteResult.success && inviteResult.inviteLink) {
    console.log('Testing email sending...')
    const emailResult = await sendInviteEmail({
      to: email,
      inviterName: 'Test User',
      workspaceName: 'Test Workspace',
      inviteLink: inviteResult.inviteLink,
      role: 'viewer',
    })
    results.emailSending = emailResult
  } else {
    results.emailSending = { skipped: true, reason: 'Invite link generation failed' }
  }

  return NextResponse.json(results, { status: 200 })
}
