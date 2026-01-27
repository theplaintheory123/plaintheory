import { constructMetadata } from '@/lib/seo/config'

export const metadata = constructMetadata({
  title: 'Templates',
  description: 'Browse ready-to-use operational playbook templates. Get started quickly with pre-built workflows for HR, Operations, Support, and more.',
  noIndex: true,
})

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
