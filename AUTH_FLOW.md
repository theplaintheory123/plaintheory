# Plantheory Authentication Flow Guide

## 🔐 Complete Authentication Flow

### Current Setup

The authentication system now intelligently handles both scenarios:

1. **Email Confirmation Disabled** (Development Mode)
   - User signs up → Immediately redirected to dashboard
   - No email verification needed

2. **Email Confirmation Enabled** (Production Mode)
   - User signs up → Redirected to confirmation page
   - User checks email → Clicks verification link
   - User redirected to `/auth/callback` → Session created → Redirected to dashboard

---

## 🚀 Quick Setup Guide

### 1. Configure Supabase

#### For Development (Instant Login - Recommended for Testing)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. **Disable** "Confirm email" option
4. Save changes

✅ **Result**: Users go straight to dashboard after signup

#### For Production (Email Verification)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. **Enable** "Confirm email" option
4. Go to **Authentication** → **URL Configuration**
5. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
6. Save changes

✅ **Result**: Users must verify email before accessing dashboard

### 2. Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, change `NEXT_PUBLIC_SITE_URL` to your actual domain.

---

## 📋 Authentication Flow Details

### Sign Up Flow

```
User fills form
    ↓
Submit to signup() action
    ↓
Supabase creates account
    ↓
    ├─ Email confirmation DISABLED
    │       ↓
    │   Session created immediately
    │       ↓
    │   Redirect to /dashboard ✓
    │
    └─ Email confirmation ENABLED
            ↓
        Redirect to /auth/confirm
            ↓
        User checks email
            ↓
        User clicks verification link
            ↓
        Redirect to /auth/callback?code=xxx
            ↓
        Exchange code for session
            ↓
        Redirect to /dashboard ✓
```

### Login Flow

```
User fills login form
    ↓
Submit to login() action
    ↓
Supabase authenticates
    ↓
Session created
    ↓
Redirect to /dashboard ✓
```

---

## 🛠️ How It Works

### Server Action: `signup()`

The signup action automatically detects if email confirmation is required:

```typescript
if (authData.session) {
  // Email confirmation is disabled
  // User has immediate session
  redirect('/dashboard')
} else {
  // Email confirmation is enabled
  // User needs to verify email
  redirect('/auth/confirm')
}
```

### Callback Route: `/auth/callback`

Handles email verification:
- Receives verification code from email link
- Exchanges code for user session
- Redirects to dashboard on success
- Redirects to error page on failure

---

## 📄 Available Pages

| Route | Purpose | When Shown |
|-------|---------|------------|
| `/auth/login` | Login page | Always accessible |
| `/auth/signup` | Signup page | Always accessible |
| `/auth/confirm` | Email confirmation instructions | After signup (if email confirmation enabled) |
| `/auth/callback` | Email verification handler | Automatically via email link |
| `/auth/auth-code-error` | Verification error | If email link is invalid/expired |
| `/dashboard` | Main dashboard | After successful authentication |

---

## ⚙️ Supabase Settings

### Recommended Development Settings

1. **Email Confirmation**: ❌ Disabled (for faster testing)
2. **Email Confirmations**: ❌ Disabled
3. **Secure email change**: ✅ Enabled
4. **Double confirm email changes**: Optional

### Recommended Production Settings

1. **Email Confirmation**: ✅ Enabled
2. **Email Confirmations**: ✅ Enabled
3. **Secure email change**: ✅ Enabled
4. **Double confirm email changes**: ✅ Enabled
5. **Site URL**: Set to production domain
6. **Redirect URLs**: Add your production callback URL

---

## 🎯 Testing the Flow

### Test Without Email Confirmation (Development)

1. Disable email confirmation in Supabase
2. Visit `/auth/signup`
3. Fill in the form and submit
4. **Expected**: Immediately redirected to `/dashboard`

### Test With Email Confirmation (Production)

1. Enable email confirmation in Supabase
2. Visit `/auth/signup`
3. Fill in the form and submit
4. **Expected**: Redirected to `/auth/confirm`
5. Check your email inbox
6. Click the verification link
7. **Expected**: Redirected to `/dashboard`

---

## 🐛 Troubleshooting

### Issue: Not redirecting to dashboard after signup

**Solution**: Check Supabase email confirmation settings
- If disabled: Should go straight to dashboard
- If enabled: Should go to confirmation page first

### Issue: Email verification link not working

**Possible causes**:
1. Site URL not configured in Supabase
2. Link expired (links expire after 24 hours)
3. Link already used

**Solution**:
- Check Supabase URL Configuration
- Try signing up again with a new email

### Issue: "Conflicting route" error

**Solution**: Make sure you don't have both `page.tsx` and `route.ts` in the same folder

### Issue: Session not persisting

**Solution**:
- Check environment variables are set
- Ensure Supabase credentials are correct
- Clear browser cookies and try again

---

## 🔒 Security Features

✅ **Implemented**:
- Server-side authentication with Server Actions
- Secure cookie storage with `@supabase/ssr`
- Email verification for production
- Password minimum length (8 characters)
- HTTPS-only cookies in production
- Proper error handling

📝 **Recommended for Production**:
- Rate limiting on auth endpoints
- CAPTCHA on signup
- Password strength requirements
- MFA (Multi-Factor Authentication)
- Session timeout settings

---

## 📚 Key Files

- `src/app/auth/actions.ts` - Server actions for auth
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/signup/page.tsx` - Signup page
- `src/app/auth/confirm/page.tsx` - Email confirmation page
- `src/app/auth/callback/route.ts` - Email verification handler
- `src/app/auth/auth-code-error/page.tsx` - Error page
- `src/app/dashboard/page.tsx` - Protected dashboard
- `src/lib/supabase/server.ts` - Supabase server client

---

## 🎨 Current Status

✅ TypeScript errors fixed
✅ Smart redirect flow (development vs production)
✅ Email verification working
✅ Dashboard protection working
✅ Clean, responsive UI
✅ Error handling
✅ Back buttons to home page

**All systems operational!** 🚀

Visit http://localhost:3000 to test the authentication flow.
