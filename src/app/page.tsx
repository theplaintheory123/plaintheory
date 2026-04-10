// app/page.tsx
"use client";
import React from "react";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useSpring,
} from "framer-motion";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { Badge } from "@/components/ui/badge";
import { Box, Lock, Search, Sparkles, Calendar, Shield, Eye, Wind } from "lucide-react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import WorldMap from "@/components/ui/world-map";
import { LampContainer } from "@/components/ui/lamp";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#FCFBF9] via-[#FAF8F5] to-[#F5F2ED] font-sans text-[#1A1817] antialiased">
      {/* Calm Background Lines with Smooth Parallax */}
      <BackgroundLines scrollYProgress={smoothScrollYProgress} />
      
      <div className="relative z-10">
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrollToSection={scrollToSection} />
        <HeroSection scrollYProgress={smoothScrollYProgress} email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
        <UnifiedConsoleSection />
        <PrivacyFirstSection />
        <IntentionalDesignSection />
        <ReportsSection />
        <GlobalPresenceSection />
        <TestimonialsSection />
        <PricingSection email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
        <FAQSection />
        <CTASection email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
        <Footer />
      </div>
    </main>
  );
}

// Calm Background Lines with Smooth Movement
function BackgroundLines({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const line1Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const line2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const line3Y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  const line1Length = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const line2Length = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const line3Length = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1400 1200"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Gentle flow lines */}
        <motion.g style={{ y: line1Y }}>
          <motion.path
            d="M-50,300 Q350,150 700,300 T1450,300"
            fill="none"
            stroke="#D4C5B9"
            strokeWidth="1"
            style={{ pathLength: line1Length }}
          />
        </motion.g>

        <motion.g style={{ y: line2Y }}>
          <motion.path
            d="M-50,600 Q350,500 700,600 T1450,600"
            fill="none"
            stroke="#E8D5C4"
            strokeWidth="0.8"
            strokeDasharray="3 6"
            style={{ pathLength: line2Length }}
          />
        </motion.g>

        <motion.g style={{ y: line3Y }}>
          <motion.path
            d="M-50,900 Q350,800 700,900 T1450,900"
            fill="none"
            stroke="#DCD3CC"
            strokeWidth="1.2"
            style={{ pathLength: line3Length }}
          />
        </motion.g>

        {/* Calm floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={i}
            cx={100 + i * 120}
            cy={200 + (i % 4) * 250}
            r={1.5 + (i % 3)}
            fill="#C2786B"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.1] }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, 80 + i * 20]),
            }}
            transition={{
              duration: 4 + i,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Minimalist Header
function Header({ mobileMenuOpen, setMobileMenuOpen, scrollToSection }: any) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-2xl border border-[#1A1817]/8 bg-white/50 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-light tracking-tight text-[#1A1817] sm:text-xl">
              plaintheory
            </span>
            <span className="rounded-full bg-[#C2786B]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#C2786B]">
              LifeOS
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {["Philosophy", "Features", "Reports", "Pricing"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium text-[#1A1817]/50 transition-colors hover:text-[#1A1817]"
              >
                {item}
              </button>
            ))}
            <a
              href="/app"
              className="rounded-full border border-[#C2786B]/20 bg-[#C2786B]/5 px-5 py-2 text-sm font-medium text-[#C2786B] transition-all hover:bg-[#C2786B]/10"
            >
              Sign In
            </a>
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d={mobileMenuOpen ? "M6 18L18 6M6 6L18 18" : "M4 6H20M4 12H20M4 18H20"}
                stroke="#1A1817"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-4 right-4 top-24 rounded-2xl border border-[#1A1817]/10 bg-white/90 p-6 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {["Philosophy", "Features", "Reports", "Pricing"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  scrollToSection(item.toLowerCase());
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-[#1A1817]/60"
              >
                {item}
              </button>
            ))}
            <a
              href="/app"
              className="mt-2 rounded-full bg-[#C2786B] px-4 py-3 text-center text-sm font-medium text-white"
            >
              Sign In
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

// Hero Section - Calm and Centered
function HeroSection({ scrollYProgress, email, setEmail, submitted, handleSubmit }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center">
      <motion.div className="w-full text-center">
        <LampContainer>
          <motion.h1
            
            className="mt-6 bg-gradient-to-br from-[#1A1817] via-[#3A3532] to-[#5A524D] bg-clip-text text-center font-serif text-4xl font-light italic tracking-tight text-transparent md:text-6xl lg:text-7xl"
          >
            Your digital life, <br />
            <span className="text-[#C2786B]">calmly unified</span>
          </motion.h1>
          <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-base text-white sm:text-lg"
        >
          One intentional interface for calendar, tasks, weather, and notes. 
          No distractions. No data harvesting. Just clarity.
        </motion.p>
          <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex justify-center"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 rounded-full border border-[#1A1817]/10 bg-white/60 px-5 py-3.5 text-sm backdrop-blur-sm transition-all placeholder:text-[#1A1817]/30 focus:border-[#C2786B]/40 focus:outline-none focus:ring-2 focus:ring-[#C2786B]/10"
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-full bg-[#1A1817] px-6 py-3.5 font-mono text-sm font-medium text-white transition-all hover:bg-[#C2786B]"
              >
                <span className="relative z-10">Start Free →</span>
                <motion.div
                  className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block rounded-full border border-[#C2786B]/20 bg-[#C2786B]/5 px-6 py-3.5 text-sm backdrop-blur-sm"
            >
              <span className="font-mono text-[#C2786B]">✓ Check your inbox for access</span>
            </motion.div>
          )}
        </motion.div>
        </LampContainer>

        

      

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative mt-20 w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent pointer-events-none z-10" />
          <MacbookScroll
            title={
              <span className="font-serif text-2xl font-light italic text-[#1A1817]">
                Everything in one place.
                <br />
                <span className="text-[#C2786B]">Nothing you don't need.</span>
              </span>
            }
            badge={
              <a href="https://peerlist.io/manuarora">
                <Badge className="h-10 w-10 -rotate-12 transform" />
              </a>
            }
            src={`https://cdn.dribbble.com/userupload/44320695/file/18cfe3d258612de2213688e5c83502c1.png?resize=752x&vertical=center`}
            showGradient={false}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}



// Unified Console Section - The Dashboard Experience
function UnifiedConsoleSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="features" ref={ref} className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 bg-white/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
            Everything in one place
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[#1A1817]/40">
            The tools you need, nothing you don't
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl border border-[#1A1817]/8 bg-white/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C2786B]/10">
              <Calendar className="h-6 w-6 text-[#C2786B]" />
            </div>
            <h3 className="font-serif text-2xl font-light">Unified Dashboard</h3>
            <p className="mt-3 text-[#1A1817]/60 leading-relaxed">
              Calendar, tasks, weather, and notes in a single, editorial-quality view. 
              No more switching between apps or losing context.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-3xl border border-[#1A1817]/8 bg-white/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#A88B7D]/10">
              <Sparkles className="h-6 w-6 text-[#A88B7D]" />
            </div>
            <h3 className="font-serif text-2xl font-light">Smart Widgets</h3>
            <p className="mt-3 text-[#1A1817]/60 leading-relaxed">
              Drag and drop widgets to create your perfect layout. Weather, calendar, tasks, 
              and more — arranged exactly how you think.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-3xl border border-[#1A1817]/8 bg-white/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#9B8579]/10">
              <Search className="h-6 w-6 text-[#9B8579]" />
            </div>
            <h3 className="font-serif text-2xl font-light">Global Search</h3>
            <p className="mt-3 text-[#1A1817]/60 leading-relaxed">
              Find anything instantly across your entire digital life. Notes, events, tasks — 
              all searchable from one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="rounded-3xl border border-[#1A1817]/8 bg-white/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C2786B]/10">
              <Wind className="h-6 w-6 text-[#C2786B]" />
            </div>
            <h3 className="font-serif text-2xl font-light">Focus Mode</h3>
            <p className="mt-3 text-[#1A1817]/60 leading-relaxed">
              One-click focus mode strips away everything but what matters right now. 
              Deep work, uninterrupted.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Privacy First Section
function PrivacyFirstSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 bg-gradient-to-b from-transparent to-[#C2786B]/[0.02]">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C2786B]/10 px-4 py-1.5 mb-6">
              <Lock className="h-3.5 w-3.5 text-[#C2786B]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[#C2786B]">Privacy First</span>
            </div>
            <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
              Your data belongs to you
            </h2>
            <p className="mt-6 text-lg text-[#1A1817]/60 leading-relaxed">
              Plaintheory stores everything locally by default. Want sync? Enable encrypted 
              cloud backup with keys only you control. We never see your data, never sell it, 
              and never will.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Local-first architecture",
                "End-to-end encryption for sync",
                "Export everything anytime",
                "No third-party trackers"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-[#1A1817]/70"
                >
                  <span className="text-[#C2786B]">✓</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C2786B]/10 via-transparent to-transparent rounded-3xl" />
            <div className="rounded-3xl border border-[#1A1817]/8 bg-white/60 p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-8 w-8 text-[#C2786B]" />
                <div>
                  <div className="font-mono text-sm text-[#1A1817]/40">Encryption Status</div>
                  <div className="font-medium text-[#1A1817]">End-to-End Encrypted</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Calendar Data", status: "Local Only" },
                  { label: "Tasks & Notes", status: "Encrypted Sync" },
                  { label: "Weather Preferences", status: "Local Only" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#1A1817]/5">
                    <span className="text-sm text-[#1A1817]/60">{item.label}</span>
                    <span className="text-sm font-mono text-[#1A1817]">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Intentional Design Section with Draggable Cards
function IntentionalDesignSection() {
  const items = [
    {
      title: "Minimalist",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop",
      className: "absolute top-8 left-[15%] rotate-[-4deg]",
    },
    {
      title: "Calm",
      image: "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop",
      className: "absolute top-20 left-[35%] rotate-[3deg]",
    },
    {
      title: "Focused",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
      className: "absolute top-12 right-[25%] rotate-[-2deg]",
    },
    {
      title: "Intentional",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop",
      className: "absolute top-28 right-[15%] rotate-[5deg]",
    },
    {
      title: "Editorial",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop",
      className: "absolute top-16 left-[25%] rotate-[-6deg]",
    },
  ];

  return (
    <section className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 border-t border-[#1A1817]/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
            Intentional by design
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[#1A1817]/40">
            Every pixel serves a purpose
          </p>
        </motion.div>
        
        <DraggableCardContainer className="relative flex min-h-[500px] w-full items-center justify-center overflow-clip">
          <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center font-serif text-2xl font-light italic text-[#1A1817]/30 md:text-4xl">
            No infinite scroll.
            <br />
            No engagement traps.
          </p>
          {items.map((item) => (
            <DraggableCardBody key={item.title} className={item.className}>
              <img
                src={item.image}
                alt={item.title}
                className="pointer-events-none relative z-10 h-56 w-56 object-cover rounded-2xl shadow-lg"
              />
              <h3 className="mt-4 text-center font-serif text-xl font-light text-[#1A1817]">
                {item.title}
              </h3>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </div>
    </section>
  );
}

// Reports Section - Editorial Quality
function ReportsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const reports = [
    { 
      title: "Weekly Reflection", 
      description: "Every Sunday, a calm summary of your week. Wins, patterns, and moments of focus.",
      icon: "📋",
      color: "#C2786B"
    },
    { 
      title: "Quarterly Insights", 
      description: "See how you spend your time. Understand your rhythms without judgment.",
      icon: "📊",
      color: "#A88B7D"
    },
    { 
      title: "Annual Review", 
      description: "A beautiful year-in-review that celebrates your growth and milestones.",
      icon: "📖",
      color: "#9B8579"
    },
  ];

  return (
    <section id="reports" ref={ref} className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 bg-white/40">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={isInView ? { opacity: 1 } : {}} 
          transition={{ duration: 1 }} 
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
            Editorial-quality reports
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[#1A1817]/40">
            Insights delivered to your inbox, beautifully designed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {reports.map((report, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.15, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-[#1A1817]/8 bg-white/50 p-8 backdrop-blur-sm transition-all"
            >
              <div className="mb-6 text-5xl">{report.icon}</div>
              <h3 className="font-serif text-2xl font-light text-[#1A1817]">{report.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1817]/60">{report.description}</p>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: report.color }} />
                <span className="font-mono text-xs uppercase tracking-wider text-[#1A1817]/30">Included Free</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Global Presence with World Map
function GlobalPresenceSection() {
  return (
    <section className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-serif text-3xl font-light italic text-[#1A1817] md:text-5xl">
            Access your life{" "}
            <span className="text-[#C2786B]">
              {"anywhere".split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </p>
          <p className="mt-4 text-sm text-[#1A1817]/60 md:text-base max-w-2xl mx-auto">
            Your dashboard syncs seamlessly across devices. At home, at work, or anywhere 
            in between — your digital sanctuary is always with you.
          </p>
        </motion.div>
        <WorldMap
          dots={[
            { start: { lat: 40.7128, lng: -74.006 }, end: { lat: 51.5074, lng: -0.1278 } },
            { start: { lat: 35.6762, lng: 139.6503 }, end: { lat: 37.7749, lng: -122.4194 } },
            { start: { lat: -33.8688, lng: 151.2093 }, end: { lat: 19.076, lng: 72.8777 } },
            { start: { lat: 55.7558, lng: 37.6173 }, end: { lat: -23.5505, lng: -46.6333 } },
            { start: { lat: 34.0522, lng: -118.2437 }, end: { lat: 41.9028, lng: 12.4964 } },
          ]}
        />
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const testimonials = [
    { 
      quote: "Plaintheory replaced five different apps for me. It's the first thing I open each morning — a moment of calm before the day begins.", 
      author: "Sarah Chen", 
      role: "Design Lead" 
    },
    { 
      quote: "Finally, a dashboard that respects my attention. No notifications, no infinite scroll — just what I need, when I need it.", 
      author: "Marcus Webb", 
      role: "Software Engineer" 
    },
    { 
      quote: "The weekly reports are a game changer. They help me reflect without the usual productivity guilt. Just gentle, useful insights.", 
      author: "Elena Rossi", 
      role: "Writer" 
    },
  ];

  return (
    <section className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 border-t border-[#1A1817]/5">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={isInView ? { opacity: 1 } : {}} 
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
            Trusted by mindful people
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              animate={isInView ? { opacity: 1, y: 0 } : {}} 
              transition={{ delay: idx * 0.1 }} 
              className="rounded-2xl border border-[#1A1817]/8 bg-white/40 p-8 backdrop-blur-sm"
            >
              <p className="font-serif text-base italic text-[#1A1817]/70">"{t.quote}"</p>
              <div className="mt-6">
                <p className="font-medium text-[#1A1817]">{t.author}</p>
                <p className="text-sm text-[#1A1817]/40">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section - Free Forever
function PricingSection({ email, setEmail, submitted, handleSubmit }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="pricing" ref={ref} className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 bg-gradient-to-b from-transparent to-[#C2786B]/[0.03]">
      <div className="mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={isInView ? { opacity: 1 } : {}} 
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
            Free, forever
          </h2>
          <p className="mt-4 text-base text-[#1A1817]/60">
            No credit card required. No hidden fees. Just a calmer digital life.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ delay: 0.2 }} 
          className="mt-12 rounded-3xl border border-[#C2786B]/15 bg-white/60 p-8 backdrop-blur-sm md:p-12"
        >
          <div className="text-center">
            <div className="font-serif text-6xl font-light text-[#1A1817]">$0</div>
            <p className="mt-2 text-sm uppercase tracking-wider text-[#1A1817]/40">Always free</p>
          </div>
          <ul className="mt-8 space-y-3">
            {[
              "Unified dashboard with all core features",
              "Weekly, quarterly & annual reports",
              "Unlimited widgets and customization",
              "Local-first data storage",
              "Optional encrypted sync",
              "Email support"
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-center gap-2 text-[#1A1817]/70">
                <span className="text-[#C2786B]">✓</span> {item}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Your email" 
                  required 
                  className="flex-1 rounded-full border border-[#1A1817]/10 bg-white/80 px-5 py-3.5 text-sm focus:border-[#C2786B] focus:outline-none" 
                />
                <button 
                  type="submit" 
                  className="rounded-full bg-[#1A1817] px-6 py-3.5 font-mono text-sm font-medium text-white transition-all hover:bg-[#C2786B]"
                >
                  Start Free
                </button>
              </form>
            ) : (
              <div className="text-center font-mono text-[#C2786B]">✓ Check your inbox!</div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    { q: "Is Plaintheory really free forever?", a: "Yes. The core product is and always will be free. We believe a calmer digital life shouldn't cost anything." },
    { q: "Where is my data stored?", a: "Locally on your device by default. You can optionally enable encrypted cloud sync for backup across devices." },
    { q: "What makes Plaintheory different?", a: "We're built on three principles: unified (everything in one place), intentional (no engagement traps), and owned (your data stays yours)." },
    { q: "Can I export my data?", a: "Absolutely. Export everything to CSV or JSON anytime. No lock-in, ever." },
  ];

  return (
    <section className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8 border-t border-[#1A1817]/5">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
          Questions?
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
              className="rounded-xl border border-[#1A1817]/8 bg-white/40 p-6 backdrop-blur-sm"
            >
              <h3 className="font-serif text-base font-medium">{faq.q}</h3>
              <p className="mt-3 text-sm text-[#1A1817]/60 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ email, setEmail, submitted, handleSubmit }: any) {
  return (
    <section className="py-20 px-4 sm:py-28 lg:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="font-serif text-3xl font-light text-[#1A1817] sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Find your calm
        </motion.h2>
        <p className="mt-4 text-base text-[#1A1817]/60">
          Join people who have found clarity with Plaintheory.
        </p>
        <div className="mt-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
                className="flex-1 rounded-full border border-[#1A1817]/10 bg-white/80 px-5 py-3.5 text-sm focus:border-[#C2786B] focus:outline-none" 
              />
              <button 
                type="submit" 
                className="rounded-full bg-[#C2786B] px-6 py-3.5 font-mono text-sm font-medium text-white transition-all hover:bg-[#A8665A]"
              >
                Get Started
              </button>
            </form>
          ) : (
            <div className="font-mono text-[#C2786B]">Thanks! Check your inbox.</div>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer with LIFE branding
function Footer() {
  return (
    <footer className="border-t border-[#1A1817]/8 pt-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-light tracking-tight text-[#1A1817]">plaintheory</span>
                <span className="rounded-full bg-[#C2786B]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#C2786B]">
                  LifeOS
                </span>
              </div>
              <p className="mt-4 text-sm text-[#1A1817]/50 max-w-xs">
                A calm, intentional dashboard for your digital life. Free forever.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Philosophy", "Features", "Reports", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Privacy", "Contact"] },
              { title: "Resources", links: ["Help Center", "Community", "API Status", "Changelog"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#1A1817]/30">{col.title}</h4>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-[#1A1817]/50 hover:text-[#1A1817] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-20 pb-8 text-center">
            <div className="select-none font-serif text-[12vw] font-light tracking-tighter text-[#1A1817]/[0.03] leading-none md:text-[10vw]">
              CALM
            </div>
            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A1817]/20">
              © {new Date().getFullYear()} PLAINTHEORY. CRAFTED WITH INTENTION.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}