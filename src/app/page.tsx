"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ==============================================
// Types
// ==============================================

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

interface FlowStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ==============================================
// Data
// ==============================================

const features: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2-10H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
      </svg>
    ),
    title: "Document Processes",
    description: "Create comprehensive documentation for every business process, policy, and procedure in one centralized hub.",
    color: "emerald"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Organize Workflows",
    description: "Structure your operations with intuitive categories, tags, and custom workflows that mirror how your business works.",
    color: "blue"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Run Operations",
    description: "Execute daily tasks, track progress in real-time, and keep your business running smoothly from one dashboard.",
    color: "purple"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Collaborate",
    description: "Work together seamlessly with real-time updates, comments, and notifications for your entire team.",
    color: "amber"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Analytics",
    description: "Make data-driven decisions with powerful insights into your team's performance and operational efficiency.",
    color: "pink"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols to keep your business data safe and protected at all times.",
    color: "indigo"
  }
];

const stats: Stat[] = [
  { value: "10,000+", label: "Active businesses" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "24/7", label: "Support available" },
  { value: "50+", label: "Integrations" }
];

const testimonials: Testimonial[] = [
  {
    quote: "Plantheory transformed how we document and run our operations. It's the single source of truth we've always needed.",
    author: "Sarah Chen",
    role: "COO",
    company: "TechFlow",
    avatar: "SC"
  },
  {
    quote: "Finally, a platform that understands how businesses actually operate. Our team is more aligned than ever.",
    author: "Marcus Rodriguez",
    role: "Director of Operations",
    company: "InnovateCorp",
    avatar: "MR"
  },
  {
    quote: "The clarity and organization Plantheory brings to our daily operations is invaluable. It just works.",
    author: "Emma Watson",
    role: "Operations Lead",
    company: "ScaleUp",
    avatar: "EW"
  }
];

const flowSteps: FlowStep[] = [
  {
    number: "01",
    title: "Map Your Processes",
    description: "Document every workflow, policy, and procedure in one place. Capture tribal knowledge before it walks out the door.",
    icon: "🗺️"
  },
  {
    number: "02",
    title: "Structure & Organize",
    description: "Create custom categories, tags, and hierarchies that mirror how your business actually works.",
    icon: "🏗️"
  },
  {
    number: "03",
    title: "Execute Daily",
    description: "Run operations through checklists, task assignments, and real-time progress tracking.",
    icon: "▶️"
  },
  {
    number: "04",
    title: "Iterate & Improve",
    description: "Identify bottlenecks, optimize workflows, and scale your operations with data-driven insights.",
    icon: "🔄"
  }
];

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "What we do", href: "#what-we-do" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Guides", href: "/guides" },
      { label: "API Reference", href: "/api" },
      { label: "Support", href: "/support" },
      { label: "Blog", href: "/blog" },
      { label: "Community", href: "/community" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" }
    ]
  }
];

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

const SectionHeader: React.FC<{ 
  title: string; 
  description?: string;
  align?: "left" | "center";
  className?: string;
}> = ({ title, description, align = "left", className = "" }) => (
  <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""} ${className}`}>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-4">
      {title}
    </h2>
    {description && (
      <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

const GeometricBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute inset-0 opacity-30 md:opacity-100" 
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '2rem 2rem'
      }}
    />
    
    <div className="hidden md:block absolute inset-0 opacity-30">
      <div className="absolute top-0 left-0 w-full h-full" 
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            #e5e7eb 20px,
            #e5e7eb 21px
          )`
        }}
      />
    </div>
    
    <svg className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 text-gray-200 opacity-30 md:opacity-100" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points="0,0 100,0 50,50" fill="currentColor" />
      <circle cx="75" cy="75" r="25" fill="currentColor" className="opacity-50" />
    </svg>
    
    <svg className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 text-gray-200 opacity-30 md:opacity-100" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="20" y="20" width="60" height="60" fill="currentColor" className="opacity-30" />
      <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" className="opacity-20" />
    </svg>
  </div>
);

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-200 group-hover:bg-pink-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-100',
  }[feature.color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center mb-4 transition-colors`}>
        {feature.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
      
      {/* Hover effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const StatCard: React.FC<{ stat: Stat; index: number }> = ({ stat, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-4"
    >
      <div className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-1 md:mb-2">{stat.value}</div>
      <div className="text-xs md:text-sm uppercase tracking-wider text-gray-400">{stat.label}</div>
    </motion.div>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-emerald-200 transition-all"
    >
      {/* Quote mark */}
      <div className="absolute top-4 right-4 text-4xl text-gray-200 font-serif">"</div>
      
      <p className="text-sm text-gray-600 mb-6 relative z-10">{testimonial.quote}</p>
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-sm font-medium text-white">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{testimonial.author}</div>
          <div className="text-xs text-gray-500">
            {testimonial.role}, {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FlowStepCard: React.FC<{ step: FlowStep; index: number }> = ({ step, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative flex gap-4 items-start p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-200 transition-all"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
        <span className="text-emerald-600 font-light text-xl">{step.number}</span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{step.icon}</span>
          <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
};

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200 py-3" : "bg-transparent py-4"
    }`}>
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="relative z-10">
            <Image src="/logo-text.svg" width={120} height={32} alt="Plantheory" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              How it works
            </Link>
            <Link href="#what-we-do" onClick={(e) => scrollToSection(e, '#what-we-do')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              What we do
            </Link>
            <Link href="#testimonials" onClick={(e) => scrollToSection(e, '#testimonials')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Testimonials
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-gray-900 font-medium hover:text-emerald-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-10 p-2"
          >
            <div className={`w-6 h-0.5 bg-gray-600 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-6 h-0.5 bg-gray-600 mt-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-gray-600 mt-1.5 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={mobileMenuOpen ? { x: 0 } : { x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl md:hidden pt-20 px-6"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="#features" 
                onClick={(e) => scrollToSection(e, '#features')}
                className="text-gray-600 hover:text-gray-900 py-2"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={(e) => scrollToSection(e, '#how-it-works')}
                className="text-gray-600 hover:text-gray-900 py-2"
              >
                How it works
              </Link>
              <Link 
                href="#what-we-do" 
                onClick={(e) => scrollToSection(e, '#what-we-do')}
                className="text-gray-600 hover:text-gray-900 py-2"
              >
                What we do
              </Link>
              <Link 
                href="#testimonials" 
                onClick={(e) => scrollToSection(e, '#testimonials')}
                className="text-gray-600 hover:text-gray-900 py-2"
              >
                Testimonials
              </Link>
              <div className="border-t border-gray-200 my-2" />
              <Link 
                href="/auth/login" 
                className="text-gray-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </nav>
  );
};

// ==============================================
// Main Page Component
// ==============================================

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <GeometricBackground />
      
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 mb-6">
                Your business's{' '}
                <span className="font-medium text-gray-900 relative">
                  single source of truth
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <line x1="0" y1="3" x2="200" y2="3" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                Document, organize, and run your daily operations from one place. 
                Plantheory brings clarity to how your business works.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl text-base font-medium hover:bg-gray-800 transition-colors"
                >
                  Start free trial
                </Link>
                <Link
                  href="#what-we-do"
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl text-base font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  See what we do →
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="relative py-20 md:py-32 bg-gray-50">
        <Container>
          <SectionHeader
            title="What we do"
            description="We help you transform how your business operates, from chaos to clarity."
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {flowSteps.map((step, index) => (
              <FlowStepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section - Improved */}
      <section id="features" className="relative py-20 md:py-32">
        <Container>
          <SectionHeader
            title="Everything you need to run your business"
            description="One platform. Six powerful capabilities. Complete control over your operations."
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-gray-200">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 md:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <SectionHeader
                title="From chaos to clarity in three steps"
                description="Plantheory helps you transform scattered processes into a well-organized operating system."
              />
              
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Document everything",
                    description: "Capture all your processes, policies, and procedures in one centralized location."
                  },
                  {
                    step: "02",
                    title: "Organize intuitively",
                    description: "Structure your operations with custom categories, tags, and workflows."
                  },
                  {
                    step: "03",
                    title: "Run efficiently",
                    description: "Execute daily tasks, track progress, and keep everything running smoothly."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex gap-6"
                  >
                    <div className="text-2xl font-light text-gray-300 flex-shrink-0">{item.step}</div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Visual representation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                  
                  <svg className="w-full h-12" viewBox="0 0 300 48" preserveAspectRatio="xMidYMid meet">
                    <line x1="40" y1="24" x2="260" y2="24" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6 6" />
                    <circle cx="40" cy="24" r="3" fill="#10b981" />
                    <circle cx="150" cy="24" r="3" fill="#10b981" />
                    <circle cx="260" cy="24" r="3" fill="#10b981" />
                  </svg>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-white border border-gray-200 rounded-lg p-2">
                        <div className="w-full h-1 bg-gray-200 rounded mb-2" />
                        <div className="w-2/3 h-1 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 md:py-32 bg-gray-50">
        <Container>
          <SectionHeader
            title="Trusted by operations teams everywhere"
            description="Join thousands of businesses that have found clarity with Plantheory."
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Ready to bring clarity to your operations?
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 mb-8">
                Start your free trial today. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl text-base font-medium hover:bg-gray-800 transition-colors"
                >
                  Get started
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl text-base font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Footer - With proper links */}
      <footer className="relative border-t border-gray-200 py-12">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Image src="/logo-text.svg" width={120} height={32} alt="Plantheory" />
              </div>
              <p className="text-sm text-gray-500">
                The single source of truth for how your business operates.
              </p>
            </div>
            
            {footerSections.map(section => (
              <div key={section.title}>
                <h4 className="font-medium text-gray-900 mb-4 text-sm">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>© {new Date().getFullYear()} Plantheory. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-gray-600 transition-colors">Cookies</Link>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}