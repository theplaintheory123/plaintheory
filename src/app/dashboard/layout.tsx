import { constructMetadata } from '@/lib/seo/config'

export const metadata = constructMetadata({
  title: 'Dashboard',
  description: 'Your Plantheory dashboard - manage playbooks, view analytics, and collaborate with your team.',
  noIndex: true,
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
