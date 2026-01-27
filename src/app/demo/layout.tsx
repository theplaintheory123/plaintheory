import { constructMetadata } from '@/lib/seo/config'

export const metadata = constructMetadata({
  title: 'Demo',
  description: 'Try Plantheory demo - explore operational playbooks, templates, and team collaboration features without signing up.',
  canonical: '/demo/dashboard',
})

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
