# Authentication Setup Guide

This project uses **Supabase** for authentication with Next.js 15+ Server Actions.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

### 2. Configure Environment Variables

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then fill in your Supabase credentials from your project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**Where to find these:**
- Go to your Supabase project dashboard
- Click on "Settings" → "API"
- Copy the "Project URL" and "anon public" key

### 3. Enable Email Authentication

In your Supabase dashboard:
1. Go to "Authentication" → "Providers"
2. Enable "Email" provider
3. Configure email settings if needed

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── actions.ts          # Server actions for login/signup
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── signup/
│   │       └── page.tsx        # Signup page
│   ├── dashboard/
│   │   └── page.tsx            # Protected dashboard
│   └── page.tsx                # Landing page
└── lib/
    └── supabase/
        ├── client.ts           # Client-side Supabase
        ├── server.ts           # Server-side Supabase
        └── proxy.ts            # Middleware proxy
```

## 🔐 Authentication Flow

### Sign Up
1. User visits `/auth/signup`
2. Fills in name, email, and password
3. Server action `signup()` creates user in Supabase
4. User is redirected to `/dashboard`

### Login
1. User visits `/auth/login`
2. Enters email and password
3. Server action `login()` authenticates with Supabase
4. User is redirected to `/dashboard`

### Protected Routes
The dashboard page checks for authentication:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/auth/login')
}
```

## 🎨 UI Features

### Login Page
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Split Layout**: Form on one side, features on the other
- **Error Handling**: Displays authentication errors
- **Social Login**: Placeholders for Google and GitHub OAuth
- **Remember Me**: Option to stay logged in
- **Forgot Password**: Link to password recovery (to be implemented)

### Signup Page
- **Name Field**: Collects user's full name
- **Email Validation**: Built-in HTML5 validation
- **Password Requirements**: Minimum 8 characters
- **Terms Agreement**: Checkbox for terms and privacy policy
- **Trust Badges**: Security certifications display
- **Feature Highlights**: Shows benefits during signup

## 🛠️ Available Server Actions

### `login(formData: FormData)`
Authenticates a user with email and password.

```typescript
// Usage in a form
<form action={login}>
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit">Sign In</button>
</form>
```

### `signup(formData: FormData)`
Creates a new user account.

```typescript
// Usage in a form
<form action={signup}>
  <input name="name" type="text" />
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit">Create Account</button>
</form>
```

### `signout()`
Signs out the current user.

```typescript
// Usage
<form action={signout}>
  <button type="submit">Sign Out</button>
</form>
```

## 🎯 Next Steps

### 1. Add OAuth Providers
To enable Google or GitHub login:

```typescript
// In your form
const handleOAuth = async (provider: 'google' | 'github') => {
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

### 2. Add Password Reset

Create `/auth/forgot-password/page.tsx`:

```typescript
'use server'
export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })
}
```

### 3. Add Email Verification

In Supabase dashboard:
1. Go to "Authentication" → "URL Configuration"
2. Set "Site URL" to your domain
3. Enable email confirmation

### 4. Customize Email Templates

In Supabase dashboard:
1. Go to "Authentication" → "Email Templates"
2. Customize the confirmation and reset emails

## 🔒 Security Best Practices

✅ **Implemented:**
- Server-side authentication with Server Actions
- Secure cookie storage with `@supabase/ssr`
- Password minimum length requirement
- HTTPS-only cookies in production

📝 **Recommended:**
- Add rate limiting for auth endpoints
- Implement CAPTCHA for signup
- Add session timeout
- Enable MFA (Multi-Factor Authentication)
- Add audit logging

## 🐛 Troubleshooting

### "Invalid login credentials"
- Check that the email is verified in Supabase
- Ensure email confirmation is disabled in dev (or handle it)
- Verify environment variables are set correctly

### Redirect not working
- Check that the dashboard route exists
- Verify Supabase is properly initialized
- Check browser console for errors

### Session not persisting
- Ensure cookies are enabled
- Check that environment variables are prefixed with `NEXT_PUBLIC_`
- Verify the Supabase client is created correctly

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)

## 🎨 Design System

The auth pages follow the Plantheory design system:
- **Primary Colors**: Indigo 600 → Blue 600 gradient
- **Typography**: System fonts with proper hierarchy
- **Shadows**: Soft shadows with colored glows
- **Border Radius**: 12px (rounded-xl) for modern feel
- **Spacing**: Consistent 4px grid system

## 📱 Pages Available

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/dashboard` - Protected dashboard (requires authentication)

Visit any of these pages at: **http://localhost:3000**
