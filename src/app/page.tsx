"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ==============================================
// Types
// ==============================================

interface Feature {
  icon: string;
  title: string;
  description: string;
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
}

interface FlowStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

// ==============================================
// Data
// ==============================================

const features: Feature[] = [
  {
    icon: "📋",
    title: "Document",
    description: "Create and organize all your business processes, policies, and procedures in one centralized hub."
  },
  {
    icon: "📊",
    title: "Organize",
    description: "Structure your operations with intuitive categories, tags, and custom workflows that make sense."
  },
  {
    icon: "⚡",
    title: "Run",
    description: "Execute daily tasks, track progress, and keep your business running smoothly from one dashboard."
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
    company: "TechFlow"
  },
  {
    quote: "Finally, a platform that understands how businesses actually operate. Our team is more aligned than ever.",
    author: "Marcus Rodriguez",
    role: "Director of Operations",
    company: "InnovateCorp"
  },
  {
    quote: "The clarity and organization Plantheory brings to our daily operations is invaluable. It just works.",
    author: "Emma Watson",
    role: "Operations Lead",
    company: "ScaleUp"
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
    {/* Grid Pattern - responsive grid size */}
    <div 
      className="absolute inset-0 opacity-30 md:opacity-100" 
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '2rem 2rem md:4rem 4rem'
      }}
    />
    
    {/* Diagonal Lines - hide on mobile */}
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
    
    {/* Geometric Shapes - adjusted for mobile */}
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      {/* Geometric accent */}
      <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-bl-xl md:rounded-bl-2xl" />
      </div>
      
      <div className="text-3xl md:text-4xl mb-3 md:mb-4">{feature.icon}</div>
      <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
      <p className="text-sm md:text-base text-gray-500 leading-relaxed">{feature.description}</p>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-4 md:left-8 right-4 md:right-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
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
      className="relative bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 h-full"
    >
      {/* Quote mark */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-4xl md:text-6xl text-gray-300 font-serif">"</div>
      
      <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-4 md:mb-6 relative z-10">{testimonial.quote}</p>
      
      <div className="border-t border-gray-200 pt-3 md:pt-4">
        <div className="font-medium text-gray-900 text-sm md:text-base">{testimonial.author}</div>
        <div className="text-xs md:text-sm text-gray-500">
          {testimonial.role}, {testimonial.company}
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
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-start p-4 sm:p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors"
    >
      {/* Number badge */}
      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-xl flex items-center justify-center">
        <span className="text-emerald-600 font-light text-xl sm:text-2xl">{step.number}</span>
      </div>
      
      {/* Icon */}
      <div className="text-2xl sm:text-3xl md:hidden">{step.icon}</div>
      
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="hidden md:block text-2xl mr-2">{step.icon}</div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900">{step.title}</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{step.description}</p>
      </div>
      
      {/* Connection line (except last) */}
      {index < flowSteps.length - 1 && (
        <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-300">
            <path d="M12 4v16M12 20l-4-4M12 20l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 sm:py-4" : "bg-transparent py-4 sm:py-6"
    }`}>
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="relative z-10">
            <Image src="/logo-text.svg" width={120} height={32} alt="Plantheory" className="sm:w-[150px]" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="#features" className="text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors">
              How it works
            </Link>
            <Link href="#what-we-do" className="text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors">
              What we do
            </Link>
            <Link href="#testimonials" className="text-sm lg:text-base text-gray-500 hover:text-gray-900 transition-colors">
              Testimonials
            </Link>
            <Link
              href="/auth/login"
              className="text-sm lg:text-base text-gray-900 font-medium hover:text-emerald-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 lg:px-5 py-2 bg-gray-900 text-white rounded-lg text-sm lg:text-base font-medium hover:bg-gray-800 transition-colors"
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
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </Link>
              <Link 
                href="#what-we-do" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                What we do
              </Link>
              <Link 
                href="#testimonials" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
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
      <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-16 sm:pb-20 md:pb-24 lg:pb-32 overflow-hidden">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-gray-900 mb-4 sm:mb-6 px-4">
                Your business's{' '}
                <span className="font-medium text-gray-900 relative">
                  single source of truth
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <line x1="0" y1="3" x2="200" y2="3" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                Document, organize, and run your daily operations from one place. 
                Plantheory is the modern platform that brings clarity to how your business works.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="/auth/signup"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
                >
                  Start free trial
                </Link>
                <Link
                  href="#what-we-do"
                  className="px-6 sm:px-8 py-3 sm:py-4 border border-gray-300 text-gray-700 rounded-xl text-sm sm:text-base font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  See what we do →
                </Link>
              </div>
              
              {/* Geometric accent */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-8 sm:h-12 bg-gradient-to-b from-gray-300 to-transparent" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* What We Do Section - NEW FLOW */}
      <section id="what-we-do" className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50/50">
        <Container>
          <SectionHeader
            title="What we do"
            description="We help you transform how your business operates, from chaos to clarity."
            align="center"
          />
          
          <div className="relative max-w-4xl mx-auto">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {flowSteps.map((step, index) => (
                <FlowStepCard key={step.number} step={step} index={index} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-20 md:py-24 lg:py-32">
        <Container>
          <SectionHeader
            title="Everything you need to run your business"
            description="One platform. Three core capabilities. Complete control over your operations."
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 sm:py-16 md:py-20 border-y border-gray-200">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-16 sm:py-20 md:py-24 lg:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="px-4 lg:px-0"
            >
              <SectionHeader
                title="From chaos to clarity in three steps"
                description="Plantheory helps you transform scattered processes into a well-organized operating system."
              />
              
              <div className="space-y-6 sm:space-y-8">
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
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="text-2xl sm:text-3xl font-light text-gray-300 flex-shrink-0">{item.step}</div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-500">{item.description}</p>
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
              className="relative px-4 lg:px-0"
            >
              <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200">
                <div className="space-y-3 sm:space-y-4">
                  {/* Grid visualization */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-4 sm:mb-6">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Process lines */}
                  <svg className="w-full h-8 sm:h-10 md:h-12" viewBox="0 0 300 48" preserveAspectRatio="xMidYMid meet">
                    <line x1="40" y1="24" x2="260" y2="24" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6 6" />
                    <circle cx="40" cy="24" r="3" fill="#10b981" />
                    <circle cx="150" cy="24" r="3" fill="#10b981" />
                    <circle cx="260" cy="24" r="3" fill="#10b981" />
                  </svg>
                  
                  {/* Data points */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 sm:h-14 md:h-16 bg-white border border-gray-200 rounded-lg p-1 sm:p-2">
                        <div className="w-full h-1 bg-gray-200 rounded mb-1 sm:mb-2" />
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
      <section id="testimonials" className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50">
        <Container>
          <SectionHeader
            title="Trusted by operations teams everywhere"
            description="Join thousands of businesses that have found clarity with Plantheory."
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32">
        <Container>
          <div className="max-w-3xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 sm:mb-6">
                Ready to bring clarity to your operations?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 sm:mb-8 md:mb-10">
                Start your free trial today. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gray-900 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
                >
                  Get started
                </Link>
                <Link
                  href="/auth/login"
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 border border-gray-300 text-gray-700 rounded-xl text-sm sm:text-base font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
              </div>
              
              {/* Geometric decoration */}
              <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full" />
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Image src="/logo-text.svg" width={120} height={32} alt="Plantheory" className="sm:w-[150px]" />
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                The single source of truth for how your business operates.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Guides", "API", "Support"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              }
            ].map(section => (
              <div key={section.title}>
                <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {section.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div>© {new Date().getFullYear()} Plantheory. All rights reserved.</div>
            <div className="flex gap-4 sm:gap-6 lg:gap-8">
              <Link href="#" className="hover:text-gray-600 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-gray-600 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-gray-600 transition-colors">Cookies</Link>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}