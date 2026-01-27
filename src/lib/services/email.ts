import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  }
  return transporter
}

export type SendEmailOptions = {
  to: string
  subject: string
  html: string
  text?: string
}

export type SendEmailResult = {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send an email using Resend SMTP
 *
 * NOTE: If using onboarding@resend.dev (Resend's test address),
 * you can ONLY send to the email address that owns your Resend account.
 * To send to other recipients, verify your own domain in Resend.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text } = options
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured')
    return {
      success: false,
      error: 'Email service not configured (missing API key)',
    }
  }

  try {
    console.log(`Sending email to: ${to}, from: ${fromEmail}, subject: ${subject}`)

    const info = await getTransporter().sendMail({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    })

    console.log('Email sent successfully:', info.messageId)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send email'
    console.error('Error sending email:', errorMessage, err)

    // Check for common Resend errors
    if (errorMessage.includes('validation_error') || errorMessage.includes('not allowed')) {
      return {
        success: false,
        error: 'Cannot send to this email. If using onboarding@resend.dev, you can only send to your own Resend account email. Verify your domain in Resend to send to others.',
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export type InviteEmailParams = {
  to: string
  inviterName: string
  workspaceName: string
  inviteLink: string
  role: string
}

/**
 * Send a workspace invitation email
 */
export async function sendInviteEmail(params: InviteEmailParams): Promise<SendEmailResult> {
  const { to, inviterName, workspaceName, inviteLink, role } = params

  const subject = `${inviterName} invited you to join ${workspaceName}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">You're Invited!</h1>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi there,
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      <strong>${inviterName}</strong> has invited you to join <strong>${workspaceName}</strong> as a <strong>${role}</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${inviteLink}"
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Accept Invitation
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      If you weren't expecting this invitation, you can safely ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      This invitation link will expire in 24 hours.
    </p>
  </div>
</body>
</html>
`

  const text = `
You're Invited!

Hi there,

${inviterName} has invited you to join ${workspaceName} as a ${role}.

Accept the invitation by clicking this link:
${inviteLink}

If you weren't expecting this invitation, you can safely ignore this email.

This invitation link will expire in 24 hours.
`

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}
