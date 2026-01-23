# Plantheory

**Transform Operational Chaos into Clarity**

Plantheory is a modern platform that helps businesses document, organize, and run their daily operations from one place. It's the single source of truth for how a business operates day to day.

![Plantheory](https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Plantheory)

## Features

### MVP (Phase 1)

- **Operational Playbooks**: Create, edit, and organize step-by-step process documentation
- **Rich Text Editor**: Document processes with detailed instructions
- **Tool Linking**: Add tool names and URLs directly within playbook steps
- **Global Search**: Find any playbook, step, or tool instantly
- **Templates**: Start with pre-built templates for common business processes
- **Shareable Workspaces**: Share playbooks via link with optional PIN protection
- **Mobile-First UI**: Fully responsive design for desktop and mobile
- **Team Management**: Invite team members with role-based access (Admin, Editor, Viewer)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase PostgreSQL](https://supabase.com/database)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plantheory.git
   cd plantheory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**

   Go to your Supabase project's SQL Editor and run the commands from `supabase-schema.md`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── confirm/         # Email confirmation
│   │   ├── callback/        # OAuth callback
│   │   └── auth-code-error/ # Auth error page
│   ├── dashboard/           # Main dashboard
│   ├── playbooks/           # Playbook pages
│   │   ├── [id]/           # View/Edit playbook
│   │   └── new/            # Create playbook
│   ├── templates/           # Template gallery
│   ├── search/              # Global search
│   ├── settings/            # Settings pages
│   ├── onboarding/          # Workspace setup wizard
│   ├── share/               # Public shared views
│   │   └── [id]/           # Shared workspace
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       └── DashboardLayout.tsx
└── lib/
    └── supabase/            # Supabase client configuration
        ├── client.ts        # Browser client
        └── server.ts        # Server client
```

## Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Landing page with features, pricing, and CTA |
| `/auth/login` | User login |
| `/auth/signup` | User registration |
| `/dashboard` | Main dashboard with stats and quick actions |
| `/playbooks` | List all playbooks with search and filters |
| `/playbooks/new` | Create a new playbook |
| `/playbooks/[id]` | View a playbook |
| `/playbooks/[id]/edit` | Edit a playbook |
| `/templates` | Browse and use templates |
| `/search` | Global search |
| `/settings` | Workspace, profile, team, and sharing settings |
| `/onboarding` | New user workspace setup |
| `/share/[id]` | Public workspace view |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | Your app URL (for OAuth redirects) |

## Database Schema

See `supabase-schema.md` for complete database setup including:
- Tables (profiles, workspaces, playbooks, steps, tools, templates, team members)
- Row Level Security (RLS) policies
- Functions and triggers
- Seed data

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

## Roadmap

### Phase 1 - MVP (Current)
- [x] User authentication
- [x] Workspace creation
- [x] Playbook CRUD
- [x] Step-by-step editor
- [x] Tool linking
- [x] Global search
- [x] Templates
- [x] Shareable links
- [x] Mobile responsive

### Phase 2 - Expansion
- [ ] Internal tools directory
- [ ] Vendor & service tracker
- [ ] Advanced roles & permissions
- [ ] Industry-specific templates
- [ ] Email reminders

### Phase 3 - Platform Scale
- [ ] Multi-location support
- [ ] AI assistance
- [ ] Analytics dashboard
- [ ] Compliance & audit logs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.plantheory.app](https://docs.plantheory.app)
- Email: support@plantheory.app
- Twitter: [@plantheory](https://twitter.com/plantheory)

---

**Plantheory** - How your business actually works.
