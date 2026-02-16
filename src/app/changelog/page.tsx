import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Rocket,
  Sparkles,
  Bug,
  Zap,
  Shield,
  Layers,
  ChevronRight,
  Calendar,
  Tag,
  Github,
  Twitter,
  MessageCircle,
} from 'lucide-react'

// ==============================================
// Types
// ==============================================

type ChangelogEntry = {
  id: string
  version: string
  date: string
  title: string
  description: string
  type: 'feature' | 'improvement' | 'fix' | 'security'
  readTime: string
  author: {
    name: string
    avatar: string
  }
}

// ==============================================
// Data
// ==============================================

const changelogData: ChangelogEntry[] = [
  {
    id: '1',
    version: '2.5.0',
    date: '2024-02-15',
    title: 'AI-Powered Playbook Generation',
    description: 'Introducing AI-powered playbook generation that helps you create comprehensive operational documents in seconds. Simply describe your process, and our AI will generate a structured playbook with steps, tools, and best practices.',
    type: 'feature',
    readTime: '3 min',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC'
    }
  },
  {
    id: '2',
    version: '2.4.0',
    date: '2024-02-01',
    title: 'Advanced Analytics Dashboard',
    description: 'New analytics dashboard providing insights into playbook usage, team engagement, and operational efficiency. Track views, completion rates, and identify your most valuable processes.',
    type: 'feature',
    readTime: '4 min',
    author: {
      name: 'Marcus Rodriguez',
      avatar: 'MR'
    }
  },
  {
    id: '3',
    version: '2.3.2',
    date: '2024-01-20',
    title: 'Performance Optimization',
    description: 'Significant performance improvements across the platform. Playbook loading times reduced by 60%, and search functionality is now 3x faster with better relevance ranking.',
    type: 'improvement',
    readTime: '2 min',
    author: {
      name: 'Alex Thompson',
      avatar: 'AT'
    }
  },
  {
    id: '4',
    version: '2.3.0',
    date: '2024-01-10',
    title: 'Template Marketplace',
    description: 'Browse and import templates from our new marketplace. Access hundreds of pre-built playbooks for HR, operations, customer support, and more. Community templates now available.',
    type: 'feature',
    readTime: '3 min',
    author: {
      name: 'Emma Watson',
      avatar: 'EW'
    }
  },
  {
    id: '5',
    version: '2.2.1',
    date: '2023-12-20',
    title: 'Security Enhancements',
    description: 'Enhanced security features including two-factor authentication, session management, and audit logs. Enterprise-grade security now available for all workspaces.',
    type: 'security',
    readTime: '2 min',
    author: {
      name: 'David Kim',
      avatar: 'DK'
    }
  },
  {
    id: '6',
    version: '2.2.0',
    date: '2023-12-05',
    title: 'Real-time Collaboration',
    description: 'Work together in real-time with your team. See who&apos;s viewing each playbook, get instant updates when changes are made, and leave comments for feedback.',
    type: 'feature',
    readTime: '3 min',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC'
    }
  },
  {
    id: '7',
    version: '2.1.0',
    date: '2023-11-15',
    title: 'Integrations Hub',
    description: 'Connect Plantheory with your favorite tools. New integrations with Slack, Notion, Google Workspace, and Microsoft Teams. Automate playbook notifications and sync data.',
    type: 'feature',
    readTime: '4 min',
    author: {
      name: 'Marcus Rodriguez',
      avatar: 'MR'
    }
  },
  {
    id: '8',
    version: '2.0.3',
    date: '2023-10-28',
    title: 'Bug Fixes & Polish',
    description: 'Fixed various bugs including notification delays, mobile layout issues, and export formatting. Improved overall stability and user experience.',
    type: 'fix',
    readTime: '1 min',
    author: {
      name: 'Alex Thompson',
      avatar: 'AT'
    }
  }
]

// ==============================================
// Components
// ==============================================

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const TypeBadge: React.FC<{ type: ChangelogEntry['type'] }> = ({ type }) => {
  const styles = {
    feature: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    improvement: 'bg-blue-50 text-blue-700 border-blue-200',
    fix: 'bg-amber-50 text-amber-700 border-amber-200',
    security: 'bg-purple-50 text-purple-700 border-purple-200',
  }

  const icons = {
    feature: <Rocket className="w-3.5 h-3.5" />,
    improvement: <Zap className="w-3.5 h-3.5" />,
    fix: <Bug className="w-3.5 h-3.5" />,
    security: <Shield className="w-3.5 h-3.5" />,
  }

  const labels = {
    feature: 'New Feature',
    improvement: 'Improvement',
    fix: 'Bug Fix',
    security: 'Security',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type]}`}>
      {icons[type]}
      {labels[type]}
    </span>
  )
}

const ChangelogEntry: React.FC<{ entry: ChangelogEntry; index: number }> = ({ entry, index }) => {
  const isEven = index % 2 === 0

  return (
    <div className={`relative flex gap-6 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-12 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
      
      {/* Date column */}
      <div className="hidden sm:block w-32 flex-shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            {new Date(entry.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
          <div className="mt-1 text-xs font-mono text-gray-300">v{entry.version}</div>
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-lg transition-all">
          {/* Mobile version/date */}
          <div className="flex items-center justify-between sm:hidden mb-3">
            <span className="text-xs font-mono text-gray-400">v{entry.version}</span>
            <span className="text-xs text-gray-400">
              {new Date(entry.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{entry.title}</h3>
              <div className="flex flex-wrap items-center gap-3">
                <TypeBadge type={entry.type} />
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Tag className="w-3.5 h-3.5" />
                  <span>v{entry.version}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{entry.readTime} read</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xs font-medium text-white">
                {entry.author.avatar}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            {entry.description}
          </p>

          {/* Read more link */}
          <div className="mt-4">
            <Link
              href={`/changelog/${entry.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Read full announcement
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Empty column for alignment */}
      <div className="hidden sm:block w-32 flex-shrink-0" />
    </div>
  )
}

// ==============================================
// Main Page Component
// ==============================================

export default async function ChangelogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image src="/logo-text.svg" width={120} height={32} alt="Plantheory" />
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={user ? '/dashboard' : '/auth/login'}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {user ? 'Dashboard' : 'Log in'}
              </Link>
              {!user && (
                <Link
                  href="/auth/signup"
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </Container>
      </nav>

      {/* Header */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              <span className="font-medium text-gray-900">Changelog</span>
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              Stay up to date with the latest features, improvements, and fixes to Plantheory.
            </p>
            
            {/* RSS and Subscribe */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/changelog/rss"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6" cy="18" r="2" />
                  <path d="M4 4v2c7.732 0 14 6.268 14 14h2c0-8.837-7.163-16-16-16z" />
                  <path d="M4 10v2c4.411 0 8 3.589 8 8h2c0-5.514-4.486-10-10-10z" />
                </svg>
                RSS Feed
              </Link>
              <Link
                href="https://github.com/plantheory/updates"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Link>
              <Link
                href="https://twitter.com/plantheory"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Changelog Entries */}
      <section className="relative py-12 md:py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Year headers */}
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900">2024</h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {changelogData.map((entry, index) => (
                <ChangelogEntry key={entry.id} entry={entry} index={index} />
              ))}
            </div>

            {/* View all link */}
            <div className="text-center mt-12">
              <Link
                href="/changelog/archive"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                View full archive
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gray-50 border-t border-gray-200">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex p-3 bg-emerald-100 rounded-xl mb-4">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-3">
              Get notified about new updates
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Subscribe to our newsletter to receive notifications about new features and improvements.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              We&apos;ll only send you important updates. No spam, ever.
            </p>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo-text.svg" width={100} height={28} alt="Plantheory" />
              <span className="text-xs text-gray-400">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
              <Link href="https://status.plantheory.com" className="hover:text-gray-900 transition-colors">Status</Link>
            </div>
            <div className="flex gap-4">
              <Link href="https://twitter.com/plantheory" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="https://github.com/plantheory" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-4 h-4" />
              </Link>
              <Link href="https://discord.gg/plantheory" className="text-gray-400 hover:text-gray-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  )
}