import { constructMetadata } from '@/lib/seo/config'

export const metadata = constructMetadata({
  title: 'Sign Up',
  description: 'Create your free Plantheory account. Start your 30-day trial and transform your operational processes.',
  canonical: '/auth/signup',
})

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
