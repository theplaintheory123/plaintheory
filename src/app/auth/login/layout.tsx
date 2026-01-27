import { constructMetadata } from '@/lib/seo/config'

export const metadata = constructMetadata({
  title: 'Sign In',
  description: 'Sign in to your Plantheory account to access your operational playbooks and team workspace.',
  canonical: '/auth/login',
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
