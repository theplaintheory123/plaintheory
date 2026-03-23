// app/page.tsx
// A visually stunning waitlist landing page with Supabase integration.
// Collects name, email, and description from users.

"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { createClient } from '@supabase/supabase-js';

// ==============================================
// Supabase Client Initialization
// ==============================================

// Replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==============================================
// Types
// ==============================================

interface WaitlistEntry {
  name: string;
  email: string;
  description: string;
  created_at: Date;
}

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

const GlowEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
  </div>
);

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      style={{ opacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3" : "bg-transparent py-6"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="relative z-10 flex items-center gap-2 group">
            <div >
               <Image src="/logo-text.svg" alt="PlainTheory Logo" width={120} height={20} />
            </div>
            
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'How It Works', 'Impact'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
                className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 transition-all group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="#waitlist"
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full text-sm font-medium hover:from-teal-700 hover:to-teal-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              Join Waitlist
            </Link>
          </div>

          <Link
            href="#waitlist"
            className="md:hidden px-5 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full text-sm font-medium shadow-md"
          >
            Join
          </Link>
        </div>
      </Container>
    </motion.nav>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-teal-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-50/0 group-hover:from-teal-50/30 group-hover:to-blue-50/30 rounded-2xl transition-all duration-500" />
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// ==============================================
// Main Page Component
// ==============================================

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            description: formData.description,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', description: '' });
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      <GlowEffect />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-1.5 mb-6 border border-teal-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-sm font-medium text-teal-700">Launching 2026 — Limited spots</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Your career.
                <br />
                Your startup.
                <br />
                <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                  Your next venture.
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                Join India's fastest-growing platform for career guidance, startup support, 
                co-founder matching, and idea development. Be the first to know when we launch.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#waitlist"
                  className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full text-base font-medium hover:from-teal-700 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                >
                  Join the waitlist
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full text-base font-medium hover:border-teal-500 hover:text-teal-600 transition-all"
                >
                  Explore features
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-md">
                      {['PS', 'AM', 'NG', 'RV', 'SK'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">1,200+</span> already waiting
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-teal-50/50 to-blue-50/50 rounded-3xl p-8 backdrop-blur-sm border border-teal-100/50 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                
                <div className="relative space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500">Live · 47 members online</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Priya S.", action: "just joined the waitlist", time: "2 min ago" },
                      { name: "Arjun M.", action: "looking for a co-founder", time: "15 min ago" },
                      { name: "Neha G.", action: "submitted startup idea", time: "1 hour ago" }
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-white/60 rounded-xl backdrop-blur-sm"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {activity.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">{activity.name}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-white to-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What we're building
            </h2>
            <p className="text-lg text-gray-500">
              Everything you need to build your future, all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Career Guidance",
                description: "Personalized roadmaps, skill assessments, and mentorship from industry experts."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Startup Support",
                description: "End-to-end support from idea validation to launch. Resources, tools, and expert guidance."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Idea Development",
                description: "Validate and refine your ideas with structured frameworks and real-world testing."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Find Co-founders",
                description: "Connect with complementary skill sets. Match with technical, business, and creative partners."
              }
            ].map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your journey starts here
            </h2>
            <p className="text-lg text-gray-500">
              Simple steps to get you from where you are to where you want to be.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Join the waitlist", description: "Sign up for early access and be the first to know when we launch.", icon: "🎯" },
              { number: "02", title: "Create your profile", description: "Tell us about your goals, skills, and what you're looking to achieve.", icon: "📝" },
              { number: "03", title: "Get matched", description: "Connect with mentors, co-founders, and opportunities tailored to you.", icon: "🤝" },
              { number: "04", title: "Build & grow", description: "Launch your startup, land your dream job, or scale your venture.", icon: "🚀" }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-teal-600 shadow-md">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-teal-300 to-transparent">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-teal-500 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Join a community of builders
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                Be part of something bigger. Connect with founders, creators, and innovators who are shaping the future.
              </p>
              <div className="space-y-4">
                {[
                  "Access exclusive workshops and events",
                  "Get priority mentorship from industry leaders",
                  "Early access to funding opportunities",
                  "Connect with like-minded builders"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-3xl p-8 border border-teal-200/50">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-teal-600">2026</div>
                  <p className="text-sm text-gray-500 mt-2">Launch Year</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">1,200+</div>
                    <div className="text-xs text-gray-500">Waitlist Members</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-xs text-gray-500">Mentors Onboard</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Waitlist Section with Supabase Form */}
      <section id="waitlist" className="relative py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-50 via-teal-100/20 to-blue-50 rounded-3xl p-8 md:p-12 border border-teal-200 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-400 rounded-full blur-3xl opacity-20" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-6 shadow-sm">
                  <span className="text-2xl">🚀</span>
                  <span className="text-sm font-medium text-teal-700">Limited spots — Join now</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Be the first to know
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Join the waitlist for early access. Get exclusive resources, mentorship opportunities, and be the first to experience Plain Theory.
                </p>
                
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-6 max-w-md mx-auto border border-green-200 shadow-lg text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-700 font-medium text-lg">Thanks for joining!</p>
                    <p className="text-sm text-gray-500 mt-2">We'll be in touch with updates and early access.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-6 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white/80 backdrop-blur-sm"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-6 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white/80 backdrop-blur-sm"
                      required
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about your goals, ideas, or what you're looking to build (optional)"
                      rows={3}
                      className="w-full px-6 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white/80 backdrop-blur-sm resize-none"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Join the waitlist'
                      )}
                    </button>
                  </form>
                )}
                
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-center"
                  >
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                  </motion.div>
                )}
                
                <p className="text-xs text-gray-500 mt-6 text-center">
                  No spam. Unsubscribe anytime. We respect your privacy. ✨
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-12 bg-gray-50">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div >
 <Image src="/logo-text.svg" alt="PlainTheory Logo" width={120} height={20} />
              </div>
            </div>
            
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">Twitter</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">LinkedIn</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">Instagram</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">Privacy</Link>
            </div>
            
            <p className="text-sm text-gray-400">© 2026 PlainTheory. All rights reserved.</p>
          </div>
        </Container>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}