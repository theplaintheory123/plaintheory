// app/page.tsx
"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from "framer-motion";

// Custom hook for parallax effect
const useParallax = (value: MotionValue<number>, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF8F5] font-sans text-[#1A1817] antialiased">
      {/* Background Lines that move with scroll */}
      <BackgroundLines scrollYProgress={scrollYProgress} />

      {/* Soft Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 top-0 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-amber-100/20 via-rose-50/10 to-transparent blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[800px] w-[800px] rounded-full bg-gradient-to-tl from-stone-200/15 via-amber-100/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <HeroSection scrollYProgress={scrollYProgress} email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
        <TrustedBySection />
        <FeaturesSection />
        <CorePrinciplesSection />
        <HeartbeatVisualizationSection scrollYProgress={scrollYProgress} />
        <ReportsShowcaseSection />
        <OutcomesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
        <FAQSection />
        <CTASection email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
        <Footer />
      </div>
    </main>
  );
}

// Background Lines with Parallax Movement
function BackgroundLines({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const line1Y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const line2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const line3Y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const line1X = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const line2X = useTransform(scrollYProgress, [0, 1], [0, 80]);
  
  const line1Length = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const line2Length = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const line3Length = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1400 1200"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Main horizontal flow line */}
        <motion.g style={{ y: line1Y, x: line1X }}>
          <motion.path
            d="M-50,400 Q350,200 700,400 T1450,400"
            fill="none"
            stroke="#D4C5B9"
            strokeWidth="1.5"
            style={{ pathLength: line1Length }}
          />
        </motion.g>

        {/* Diagonal accent */}
        <motion.g style={{ y: line2Y, x: line2X }}>
          <motion.path
            d="M200,-50 L1200,1250"
            fill="none"
            stroke="#E8D5C4"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            style={{ pathLength: line2Length }}
          />
        </motion.g>

        {/* Gentle vertical curve */}
        <motion.g style={{ y: line3Y }}>
          <motion.path
            d="M950,-50 Q1150,600 950,1250"
            fill="none"
            stroke="#DCD3CC"
            strokeWidth="1.2"
            style={{ pathLength: line3Length }}
          />
        </motion.g>

        {/* Heartbeat line (ECG) that moves with scroll */}
        <motion.g style={{ y: useTransform(scrollYProgress, [0, 1], [0, 250]) }}>
          <motion.path
            d="M0,800 L100,800 L150,750 L200,850 L250,800 L1400,800"
            fill="none"
            stroke="#C2786B"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={150 + i * 180}
            cy={300 + (i % 3) * 200}
            r={2 + (i % 3)}
            fill={i % 2 === 0 ? "#C2786B" : "#A88B7D"}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.2] }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, 100 + i * 30]),
            }}
            transition={{
              duration: 3 + i,
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Header Component
function Header({ mobileMenuOpen, setMobileMenuOpen }: any) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-2xl border border-[#1A1817]/10 bg-white/60 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-light tracking-tight text-[#1A1817] sm:text-xl">
              plaintheory
            </span>
            <span className="rounded-full bg-[#1A1817]/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#1A1817]/50">
              LifeOS
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {["Features", "Reports", "Principles", "Demo", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-[#1A1817]/60 transition-colors hover:text-[#1A1817]"
              >
                {item}
              </a>
            ))}
            <a
              href="/app"
              className="rounded-full border border-[#C2786B]/30 bg-[#C2786B]/10 px-4 py-1.5 text-sm font-medium text-[#C2786B] backdrop-blur-sm transition-all hover:bg-[#C2786B]/20"
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
          className="absolute left-4 right-4 top-24 rounded-2xl border border-[#1A1817]/10 bg-white/95 p-6 backdrop-blur-xl sm:left-6 sm:right-6 md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {["Features", "Reports", "Principles", "Demo", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-[#1A1817]/70"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
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

// Hero Section - Centered with Side Animations
function HeroSection({ scrollYProgress, email, setEmail, submitted, handleSubmit }: any) {
  const y = useParallax(scrollYProgress, 30);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Side floating elements
  const leftX = useTransform(scrollYProgress, [0, 1], [-20, -100]);
  const rightX = useTransform(scrollYProgress, [0, 1], [20, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 sm:px-6 lg:px-8">
      {/* Floating side decorations */}
      <motion.div
        style={{ x: leftX, rotate }}
        className="pointer-events-none absolute left-4 top-1/3 hidden lg:block"
      >
        <div className="text-8xl opacity-20">◈</div>
      </motion.div>
      <motion.div
        style={{ x: rightX, rotate: useTransform(scrollYProgress, [0, 1], [0, -360]) }}
        className="pointer-events-none absolute right-4 top-2/3 hidden lg:block"
      >
        <div className="text-7xl opacity-20">◈</div>
      </motion.div>

      <motion.div style={{ y }} className="w-full max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[#1A1817]/40 sm:mb-6">
            Live Now — Start Free
          </span>
          <h1 className="mx-auto max-w-4xl font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1A1817] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Your life,
            <br />
            <span className="italic text-[#C2786B]">in rhythm.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-[#1A1817]/70 sm:mt-8 sm:text-lg">
            Plaintheory is a calm, intentional dashboard that brings your digital life into focus. 
            Track your days, weeks, and years with beautiful reports that help you see the bigger picture.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex justify-center sm:mt-12"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 rounded-full border border-[#1A1817]/10 bg-white/60 px-5 py-3 text-sm backdrop-blur-sm transition-all placeholder:text-[#1A1817]/30 focus:border-[#C2786B]/50 focus:outline-none focus:ring-2 focus:ring-[#C2786B]/20 sm:py-4"
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-full bg-[#1A1817] px-6 py-3 font-mono text-sm font-medium text-white transition-all hover:bg-[#C2786B] sm:py-4"
              >
                <span className="relative z-10">Get Started →</span>
                <motion.div
                  className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
              className="inline-block rounded-full border border-[#C2786B]/30 bg-[#C2786B]/10 px-6 py-4 text-sm backdrop-blur-sm"
            >
              <span className="font-mono text-[#C2786B]">✓ Check your inbox for the magic link!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mx-auto mt-12 h-[300px] w-full max-w-5xl overflow-hidden rounded-2xl border border-[#1A1817]/10 bg-white/50 shadow-2xl shadow-black/5 backdrop-blur-sm sm:mt-16 sm:h-[350px] md:h-[400px] lg:rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#C2786B]/5 to-transparent" />
          
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <motion.path
              d="M0,200 L80,200 L130,160 L180,240 L230,200 L1000,200"
              fill="none"
              stroke="#C2786B"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
            />
          </svg>

          <div className="relative z-10 grid h-full w-full grid-cols-4 gap-3 p-4 sm:gap-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="col-span-1 row-span-2 rounded-xl border border-[#1A1817]/10 bg-white/60 p-3 backdrop-blur-sm sm:p-4"
            >
              <div className="text-xs uppercase tracking-wider text-[#1A1817]/40">Weather</div>
              <div className="mt-1 text-2xl sm:mt-2 sm:text-3xl">☀️</div>
              <div className="text-xl font-light sm:text-2xl">72°</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="col-span-2 row-span-1 rounded-xl border border-[#1A1817]/10 bg-white/60 p-3 backdrop-blur-sm sm:p-4"
            >
              <div className="text-xs uppercase tracking-wider text-[#1A1817]/40">Today</div>
              <div className="mt-1 font-serif text-base sm:mt-2 sm:text-xl">Focus time 9-11am</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="col-span-1 row-span-2 rounded-xl border border-[#1A1817]/10 bg-white/60 p-3 backdrop-blur-sm sm:p-4"
            >
              <div className="text-xs uppercase tracking-wider text-[#1A1817]/40">Tasks</div>
              <div className="mt-3 space-y-2 sm:mt-4">
                <div className="h-1 w-full rounded-full bg-[#1A1817]/20" />
                <div className="h-1 w-3/4 rounded-full bg-[#1A1817]/20" />
                <div className="h-1 w-1/2 rounded-full bg-[#1A1817]/20" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0 }}
              className="col-span-3 row-span-1 rounded-xl border border-[#1A1817]/10 bg-white/60 p-3 backdrop-blur-sm sm:p-4"
            >
              <div className="text-xs uppercase tracking-wider text-[#1A1817]/40">Weekly Report Preview</div>
              <div className="mt-2 flex items-end gap-1 sm:gap-2">
                <div className="h-6 w-3 rounded-sm bg-[#C2786B]/60 sm:h-8 sm:w-4" />
                <div className="h-10 w-3 rounded-sm bg-[#C2786B]/80 sm:h-12 sm:w-4" />
                <div className="h-5 w-3 rounded-sm bg-[#C2786B]/40 sm:h-6 sm:w-4" />
                <div className="h-8 w-3 rounded-sm bg-[#C2786B]/70 sm:h-10 sm:w-4" />
                <div className="h-6 w-3 rounded-sm bg-[#C2786B]/50 sm:h-8 sm:w-4" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1A1817]/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-10 w-5 rounded-full border border-[#1A1817]/20 sm:h-12 sm:w-6"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mx-auto mt-2 h-1.5 w-0.5 rounded-full bg-[#1A1817]/30 sm:h-2 sm:w-1"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Trusted By Section
function TrustedBySection() {
  return (
    <section className="border-y border-[#1A1817]/5 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-wider text-[#1A1817]/40">
          Trusted by mindful individuals worldwide
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 opacity-50 grayscale sm:mt-8 sm:gap-8">
          {["Notion", "Linear", "Figma", "Vercel", "Stripe"].map((brand) => (
            <span key={brand} className="font-serif text-lg italic text-[#1A1817]/40 sm:text-xl">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: "🌤️", title: "Unified View", description: "Weather, calendar, tasks, and notes in a single, serene interface.", color: "#C2786B" },
    { icon: "📊", title: "Weekly Reports", description: "Get a beautiful summary of your week every Sunday, delivered to your inbox.", color: "#A88B7D" },
    { icon: "📈", title: "Quarterly Insights", description: "See trends and patterns across three months to adjust your habits.", color: "#B7A08B" },
    { icon: "📅", title: "Annual Review", description: "A comprehensive year-in-review that celebrates your growth and focus.", color: "#9B8579" },
    { icon: "🔒", title: "Privacy First", description: "Your data stays local or in your private cloud. No tracking, ever.", color: "#C2786B" },
    { icon: "⚡", title: "Lightning Fast", description: "Optimized for speed. Loads instantly, responds immediately.", color: "#A88B7D" },
  ];

  return (
    <section id="features" ref={ref} className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">
            Everything in one place
          </h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#1A1817]/60 sm:mt-4">
            The features you need, including powerful reports.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, borderColor: feature.color }}
              className="group rounded-2xl border border-[#1A1817]/10 bg-white/40 p-6 backdrop-blur-sm transition-all duration-300 sm:p-8"
            >
              <div className="mb-4 text-3xl sm:mb-6 sm:text-4xl">{feature.icon}</div>
              <h3 className="font-serif text-xl font-light text-[#1A1817] sm:text-2xl">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1A1817]/60 sm:mt-3">{feature.description}</p>
              <div
                className="mt-4 h-0.5 w-12 rounded-full opacity-0 transition-opacity group-hover:opacity-100 sm:mt-6"
                style={{ backgroundColor: feature.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Core Principles Section
function CorePrinciplesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const principles = [
    { number: "01", title: "Unified", description: "Your calendar, weather, and notes in a single, serene view. No tab-hopping." },
    { number: "02", title: "Intentional", description: "Every widget serves a purpose. No infinite scroll, no engagement bait." },
    { number: "03", title: "Owned", description: "Your data stays local or in your private cloud. We never monetize attention." },
  ];

  return (
    <section id="principles" className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 bg-[#1A1817]/[0.02]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">The Principles</h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#1A1817]/60 sm:mt-4">Three tenets of a quieter digital life.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
          {principles.map((item, idx) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group text-center"
            >
              <div className="mb-4 font-mono text-4xl font-thin text-[#C2786B]/30 transition-colors group-hover:text-[#C2786B]/50 sm:mb-6 sm:text-5xl">
                {item.number}
              </div>
              <h3 className="font-serif text-xl font-light text-[#1A1817] sm:text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1A1817]/60 sm:mt-3">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Heartbeat Visualization Section
function HeartbeatVisualizationSection({ scrollYProgress }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const pathLength = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <section id="demo" ref={ref} className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">Find your rhythm</h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#1A1817]/60 sm:mt-4">Track what matters with live visualizations.</p>
        </motion.div>

        <div className="mt-12 sm:mt-16">
          <div className="relative h-48 w-full rounded-2xl border border-[#1A1817]/10 bg-white/40 p-4 backdrop-blur-sm sm:h-56 md:h-64 lg:rounded-3xl lg:p-8">
            <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="none">
              <line x1="0" y1="100" x2="1200" y2="100" stroke="#1A1817" strokeWidth="0.5" opacity="0.1" />
              <motion.path
                d="M0,100 L80,100 L120,60 L160,140 L200,100 L280,100 L320,40 L360,160 L400,100 L1200,100"
                fill="none"
                stroke="#C2786B"
                strokeWidth="2.5"
                style={{ pathLength }}
              />
              <motion.circle cx="120" cy="60" r="4" fill="#C2786B" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.5, 1] } : {}} transition={{ delay: 0.5 }} />
              <motion.circle cx="160" cy="140" r="3" fill="#C2786B" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.5, 1] } : {}} transition={{ delay: 0.7 }} />
              <motion.circle cx="320" cy="40" r="5" fill="#C2786B" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 2, 1] } : {}} transition={{ delay: 0.9 }} />
              <motion.circle cx="360" cy="160" r="3" fill="#C2786B" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.5, 1] } : {}} transition={{ delay: 1.1 }} />
              <motion.text x="1100" y="90" fill="#C2786B" fontSize="12" fontFamily="monospace" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>LIVE</motion.text>
              <motion.circle cx="1160" cy="85" r="4" fill="#C2786B" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1, 0.5, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center sm:mt-8">
            <div><div className="font-mono text-2xl font-light text-[#1A1817] sm:text-3xl">72</div><div className="text-xs uppercase tracking-wider text-[#1A1817]/40">BPM</div></div>
            <div><div className="font-mono text-2xl font-light text-[#1A1817] sm:text-3xl">8,432</div><div className="text-xs uppercase tracking-wider text-[#1A1817]/40">Steps</div></div>
            <div><div className="font-mono text-2xl font-light text-[#1A1817] sm:text-3xl">7.5h</div><div className="text-xs uppercase tracking-wider text-[#1A1817]/40">Sleep</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reports Showcase Section
function ReportsShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const reports = [
    { title: "Weekly Reflection", description: "Every Sunday, receive a beautifully designed summary of your week.", image: "📆", color: "#C2786B" },
    { title: "Quarterly Insights", description: "Every three months, see patterns in your productivity and habits.", image: "📊", color: "#A88B7D" },
    { title: "Annual Review", description: "A comprehensive year-in-review that celebrates milestones.", image: "🎉", color: "#9B8579" },
  ];

  return (
    <section id="reports" ref={ref} className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 bg-[#1A1817]/[0.02]">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} className="mb-12 text-center sm:mb-16">
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">Insights that matter</h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#1A1817]/60 sm:mt-4">Beautiful reports delivered to you — weekly, quarterly, annually.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {reports.map((report, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-[#1A1817]/10 bg-white/40 p-6 backdrop-blur-sm transition-all sm:p-8 lg:rounded-3xl"
              style={{ borderColor: isInView ? report.color : undefined }}
            >
              <div className="mb-4 text-5xl sm:mb-6 sm:text-6xl">{report.image}</div>
              <h3 className="font-serif text-xl font-light text-[#1A1817] sm:text-2xl">{report.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1A1817]/60 sm:mt-3">{report.description}</p>
              <div className="mt-4 flex items-center gap-2 sm:mt-6">
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: report.color }} />
                <span className="font-mono text-xs uppercase tracking-wider text-[#1A1817]/40">Included Free</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Outcomes Section
function OutcomesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const outcomes = [
    { value: "2.5x", label: "More Focus Time", icon: "🎯" },
    { value: "-68%", label: "Digital Clutter", icon: "🧘" },
    { value: "+40%", label: "Task Completion", icon: "✅" },
  ];

  return (
    <section className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 border-t border-[#1A1817]/5">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="text-center">
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">Measurable calm</h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[#1A1817]/60 sm:mt-4">Real outcomes from our community.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 md:grid-cols-3">
          {outcomes.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.15 }} className="text-center">
              <div className="mb-4 text-4xl sm:mb-6 sm:text-5xl">{item.icon}</div>
              <div className="font-serif text-5xl font-light text-[#C2786B] sm:text-6xl">{item.value}</div>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#1A1817]/60">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const steps = [
    { step: "01", title: "Sign Up", desc: "Create your free account in seconds." },
    { step: "02", title: "Connect", desc: "Link your calendar and favorite tools." },
    { step: "03", title: "Customize", desc: "Arrange widgets to fit your flow." },
    { step: "04", title: "Breathe", desc: "Enjoy a calmer, more focused day." },
  ];

  return (
    <section className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 bg-[#1A1817]/[0.02]">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="text-center">
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">How it works</h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-4">
          {steps.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: idx * 0.1 }} className="relative">
              <div className="mb-3 font-mono text-2xl text-[#C2786B]/40 sm:mb-4">{item.step}</div>
              <h3 className="font-serif text-lg font-light sm:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-[#1A1817]/60">{item.desc}</p>
              {idx < 3 && <div className="absolute -right-4 top-6 hidden h-0.5 w-6 bg-[#1A1817]/10 md:block" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const testimonials = [
    { quote: "Plaintheory has replaced five different apps for me. It's my digital sanctuary.", author: "Sarah Chen", role: "Design Lead" },
    { quote: "Finally, a dashboard that respects my attention. The weekly reports are a game changer.", author: "Marcus Webb", role: "Software Engineer" },
    { quote: "I start every morning with Plaintheory. The annual review helped me see my growth clearly.", author: "Elena Rossi", role: "Writer" },
  ];

  return (
    <section className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 border-t border-[#1A1817]/5">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="text-center">
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">Loved by mindful creators</h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.1 }} className="rounded-2xl border border-[#1A1817]/10 bg-white/40 p-6 backdrop-blur-sm sm:p-8">
              <p className="font-serif text-base italic text-[#1A1817]/80 sm:text-lg">"{t.quote}"</p>
              <div className="mt-4 sm:mt-6"><p className="font-medium">{t.author}</p><p className="text-sm text-[#1A1817]/40">{t.role}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection({ email, setEmail, submitted, handleSubmit }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="pricing" ref={ref} className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="text-center">
          <h2 className="font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">Free, forever</h2>
          <p className="mt-3 text-base text-[#1A1817]/60 sm:mt-4 sm:text-lg">No credit card required. Get started in seconds.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="mt-10 rounded-2xl border border-[#C2786B]/20 bg-white/60 p-6 backdrop-blur-sm sm:mt-12 sm:p-8 md:p-12 lg:rounded-3xl">
          <div className="text-center"><div className="font-mono text-5xl font-light text-[#1A1817] sm:text-6xl">$0</div><p className="mt-2 text-sm uppercase tracking-wider text-[#1A1817]/40">Always free core features</p></div>
          <ul className="mt-6 space-y-2 sm:mt-8 sm:space-y-3">
            {["All core features", "Weekly, quarterly & annual reports", "Unlimited widgets", "Email support"].map((item, i) => (
              <li key={i} className="flex items-center justify-center gap-2 text-[#1A1817]/70"><span className="text-[#C2786B]">✓</span> {item}</li>
            ))}
          </ul>
          <div className="mt-8 sm:mt-10">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required className="flex-1 rounded-full border border-[#1A1817]/10 bg-white/80 px-5 py-3 text-sm focus:border-[#C2786B] focus:outline-none sm:py-4" />
                <button type="submit" className="rounded-full bg-[#1A1817] px-6 py-3 font-mono text-sm font-medium text-white transition-all hover:bg-[#C2786B] sm:py-4">Start Free</button>
              </form>
            ) : (
              <div className="text-center text-[#C2786B] font-mono">✓ Check your inbox!</div>
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
    { q: "Is Plaintheory really free?", a: "Yes, the core product is free forever." },
    { q: "Where is my data stored?", a: "Locally first, with optional encrypted cloud sync." },
    { q: "What are the reports like?", a: "Beautifully designed PDF summaries delivered weekly, quarterly, and annually." },
    { q: "Can I export my data?", a: "Absolutely. Export everything to CSV or JSON anytime." },
  ];

  return (
    <section className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 border-t border-[#1A1817]/5">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-serif text-3xl font-light italic text-[#1A1817] sm:text-4xl md:text-5xl">Questions?</h2>
        <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-[#1A1817]/10 bg-white/40 p-5 backdrop-blur-sm sm:p-6">
              <h3 className="font-serif text-base font-medium sm:text-lg">{faq.q}</h3>
              <p className="mt-2 text-sm text-[#1A1817]/60">{faq.a}</p>
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
    <section className="py-16 px-4 sm:py-20 lg:py-24 lg:px-8 bg-gradient-to-b from-transparent to-[#C2786B]/5">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-3xl font-light text-[#1A1817] sm:text-4xl md:text-5xl lg:text-6xl">
          Ready to find your rhythm?
        </motion.h2>
        <p className="mt-4 text-base text-[#1A1817]/60 sm:mt-6 sm:text-lg">Join thousands who have found calm with Plaintheory.</p>
        <div className="mt-8 sm:mt-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 rounded-full border border-[#1A1817]/20 bg-white/80 px-5 py-3 text-sm focus:border-[#C2786B] focus:outline-none sm:py-4" />
              <button type="submit" className="rounded-full bg-[#C2786B] px-6 py-3 font-mono text-sm font-medium text-white transition-all hover:bg-[#A8665A] sm:py-4 sm:px-8">Get Started</button>
            </form>
          ) : (
            <div className="text-[#C2786B] font-mono">Thanks! Check your inbox.</div>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-[#1A1817]/10 py-10 px-4 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-light tracking-tight text-[#1A1817]">plaintheory</span>
            <span className="rounded-full bg-[#1A1817]/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#1A1817]/50">LifeOS</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Twitter", "Github", "Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="font-mono text-xs uppercase tracking-wider text-[#1A1817]/40 transition-colors hover:text-[#1A1817]">{item}</a>
            ))}
          </div>
        </div>
        <div className="mt-6 text-center sm:mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A1817]/20">© {new Date().getFullYear()} PLAINTHEORY. CRAFTED WITH INTENTION.</p>
        </div>
      </div>
    </footer>
  );
}