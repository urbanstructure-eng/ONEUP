/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, animate } from 'motion/react';
import { Instagram, Twitter, Linkedin, ChevronUp, X, ChevronLeft, ChevronRight, Send, ArrowUpRight, Smile } from 'lucide-react';

const PROJECTS = [
  { id: 1, title: "Aura Identity", category: "Branding", image: "https://picsum.photos/seed/aura/1200/800", colSpan: "md:col-span-8" },
  { id: 2, title: "Vortex Digital", category: "UI/UX", image: "https://picsum.photos/seed/vortex/800/800", colSpan: "md:col-span-4" },
  { id: 3, title: "Padelux", category: "Branding", image: "https://lh3.googleusercontent.com/d/1VAN-GqZ2QduoqhcfJbiHR5nmT6ouaNti", colSpan: "md:col-span-4" },
  { id: 4, title: "Nova Campaign", category: "Art Direction", image: "https://picsum.photos/seed/nova/800/800", colSpan: "md:col-span-4" },
  { id: 5, title: "Zenith Web", category: "Development", image: "https://picsum.photos/seed/zenith/800/1000", colSpan: "md:col-span-4" },
  { id: 6, title: "Pulse Motion", category: "Animation", image: "https://picsum.photos/seed/pulse/1200/675", colSpan: "md:col-span-6" },
  { id: 7, title: "Echo Sound", category: "Audio", image: "https://picsum.photos/seed/echo/1200/675", colSpan: "md:col-span-6" },
  { id: 8, title: "Stellar App", category: "Mobile", image: "https://picsum.photos/seed/stellar/1600/600", colSpan: "md:col-span-12" },
  { id: 9, title: "Flux Brand", category: "Strategy", image: "https://picsum.photos/seed/flux/800/800", colSpan: "md:col-span-6" },
  { id: 10, title: "Orbit Space", category: "Exhibition", image: "https://picsum.photos/seed/orbit/1200/750", colSpan: "md:col-span-6" },
];

export default function App() {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY = useTransform(smoothScrollY, [0, 1000], [0, -300]);
  const heroImageY = useTransform(smoothScrollY, [0, 1000], [0, 400]);
  const floatingElement1Y = useTransform(smoothScrollY, [0, 2000], [0, -800]);
  const floatingElement2Y = useTransform(smoothScrollY, [0, 2000], [0, -400]);
  
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [isFolding, setIsFolding] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Brand Identity',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

      // Track active section
      const sections = ['work', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 150;

      let currentSection = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    animate(window.scrollY, 0, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => window.scrollTo(0, latest)
    });
  };

  const navigateProject = (direction: 'next' | 'prev') => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS.findIndex(p => p.id === selectedProject.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PROJECTS.length;
    } else {
      nextIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    }
    setSelectedProject(PROJECTS[nextIndex]);
    // Scroll modal content to top
    const modal = document.getElementById('project-modal');
    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFolding(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to send email');
      }

      // Smooth transition sequence
      setTimeout(() => {
        setIsSent(true);
        setIsFolding(false);
        setFormData({ name: '', email: '', phone: '', service: 'Brand Identity', message: '' });
        
        setTimeout(() => {
          setShowContactForm(false);
          setIsSent(false);
        }, 5000);
      }, 2000); // Match the plane flight duration
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Failed to send inquiry: ${error.message}. Please check your Mailgun configuration.`);
      setIsFolding(false);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed nav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      animate(window.scrollY, offsetPosition, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white selection:bg-accent selection:text-black font-sans overflow-x-hidden relative">
      {/* Navigation (Static/Fixed) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center backdrop-blur-md border-b border-white/10 bg-[#1a1a1a]/80">
        <div 
          onClick={scrollToTop}
          className="cursor-pointer group flex items-center"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/17xzztOYQ2Sk3ZTlPOY0Pan1g0jfZikyP" 
            alt="oneup logo" 
            className="h-12 w-auto transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold tracking-tighter">oneup</span>';
            }}
          />
        </div>
        <div className="flex gap-8 md:gap-12 text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">
          {['work', 'services', 'about', 'contact'].map((id) => (
            <a 
              key={id}
              href={`#${id}`} 
              onClick={(e) => scrollToSection(e, id)} 
              className={`hover:text-accent transition-colors relative flex items-center gap-2 ${activeSection === id ? 'text-white' : ''}`}
            >
              {activeSection === id && (
                <motion.div 
                  layoutId="nav-arrow"
                  className="text-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
                </motion.div>
              )}
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden border-b border-white/10">
        {/* Animated Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.div
            style={{ y: heroImageY }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <motion.img
              src="https://lh3.googleusercontent.com/d/1cRgnMzlCeBFa0zsTzaUV5l3aSg1wy4l_"
              alt="Hero Background"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>
        
        <div className="relative z-20 max-w-5xl p-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-8">
              Design & Technology
            </div>
            <h1 className="text-[10vw] md:text-[7vw] font-bold leading-[0.85] tracking-tighter mb-12 text-accent">
              INNOVATIVE <br /> DIGITAL <br /> EXPERIENCES.
            </h1>
            <p className="max-w-md text-lg md:text-xl text-white/70 leading-relaxed mb-12 font-light">
              We create innovative digital experiences tailored for the modern market, focusing on experimental concepts and effective branding strategies.
            </p>
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => setShowContactForm(true)}
                className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all"
              >
                Start a Project
              </button>
              <div className="flex gap-2 items-center text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">
                <div className="w-12 h-px bg-white/10" />
                Scroll to explore
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="relative z-10 px-6 md:px-12 py-24 md:py-40">
        <div className="flex justify-between items-end mb-24 border-b border-white/10 pb-12">
          <div>
            <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">SELECTED WORK</h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 font-mono hidden md:block">2022 — 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-l border-white/10">
          {PROJECTS.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              onClick={() => setSelectedProject(project)}
              className={`group cursor-pointer border-r border-b border-white/10 ${project.colSpan} p-4 md:p-8`}
            >
              <div className="relative h-[320px] overflow-hidden bg-[#262626]">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-accent text-[8px] font-bold tracking-[0.3em] uppercase">{project.category}</span>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-1">{project.title}</h3>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.img 
                    src="https://lh3.googleusercontent.com/d/1Qm0emmiJjUXmvP1LDjXdL7JRkU1yotIf"
                    alt="arrow"
                    className="w-14 h-14 object-contain"
                    animate={{ 
                      opacity: [1, 0.6, 1],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      ease: "easeInOut" 
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 px-6 md:px-12 py-24 md:py-40 border-y border-white/10">
        <div className="flex justify-between items-end mb-24 border-b border-white/10 pb-12">
          <div>
            <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Expertise</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">SERVICES</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/10">
          {[
            { title: "Brand Identity", desc: "Crafting unique visual languages that define your brand's essence and resonance." },
            { title: "Digital Design", desc: "Creating intuitive, high-performance interfaces for web and mobile platforms." },
            { title: "Art Direction", desc: "Leading the creative vision to ensure consistency and impact across all media." }
          ].map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 md:p-16 border-r border-b border-white/10 hover:bg-white/[0.02] transition-colors group bg-[#262626]/50"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-12 relative overflow-hidden">
                <motion.img 
                  src="https://lh3.googleusercontent.com/d/1Qm0emmiJjUXmvP1LDjXdL7JRkU1yotIf"
                  alt="service icon"
                  className="w-12 h-12 object-contain"
                  initial={{ scale: 1, x: 0, y: 0 }}
                  whileHover={{ scale: 1.1, x: 5, y: -5 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight group-hover:text-accent transition-colors">{service.title}</h3>
              <p className="text-white/40 text-base leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className="relative z-10 px-6 md:px-12 py-32 md:py-56 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-l border-white/10">
          <div className="md:col-span-8 pt-8 pb-12 md:pt-16 md:pb-24 px-12 md:px-24 border-r border-b border-white/10">
            <span className="text-accent text-[14px] font-black tracking-[0.7em] uppercase mb-12 block">Our Approach</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              WE COMBINE <span className="text-accent">CREATIVITY</span> AND TECHNOLOGY TO ELEVATE BRAND PRESENCE.
            </h2>
          </div>
          <div className="md:col-span-4 pt-8 pb-12 md:pt-16 md:pb-24 px-12 border-r border-b border-white/10 flex flex-col justify-between bg-[#262626]/30">
            <p className="text-xl text-white/40 leading-relaxed font-light mb-12">
              Our approach combines creativity and technology to engage audiences and elevate brand presence in a competitive landscape.
            </p>
            <div className="space-y-12">
              <div className="space-y-4">
                {['Our Approach', 'Research Driven', 'Aesthetic Precision', 'Technical Excellence'].map((item) => (
                  <div key={item} className="flex items-center gap-4 text-sm font-medium uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 px-6 md:px-12 py-32 md:py-56 border-b border-white/10">
        <div className="max-w-7xl mx-auto border-t border-l border-white/10 grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-12 md:p-24 border-r border-b border-white/10 flex flex-col justify-center">
            <span className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-12 block">Get in touch</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">
              READY TO BUILD SOMETHING <span className="text-accent">EXTRAORDINARY</span>?
            </h2>
          </div>
          <div className="p-12 md:p-24 border-r border-b border-white/10 flex flex-col justify-center items-center text-center bg-[#262626]/50">
            <div 
              onClick={() => setShowContactForm(true)}
              className="group cursor-pointer mb-16 flex flex-col items-center"
            >
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter group-hover:text-accent transition-all">
                SAY HELLO
              </h2>
              <div className="flex items-center gap-4 mt-8 group-hover:gap-6 transition-all">
                <div className="h-[1px] w-12 bg-accent/30 group-hover:w-20 transition-all" />
                <span className="text-accent text-xl md:text-3xl uppercase tracking-[0.2em] font-black whitespace-nowrap">
                  START A PROJECT
                </span>
                <div className="h-[1px] w-12 bg-accent/30 group-hover:w-20 transition-all" />
              </div>
            </div>
            
            <div className="flex gap-8 justify-center">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                  className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 font-mono bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          © 2026 oneup. Design studio / Atelier de création
        </div>
        <div className="flex gap-12">
          <button onClick={() => setShowLegalModal(true)} className="hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => setShowLegalModal(true)} className="hover:text-white transition-colors">Terms of Service</button>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          globally yours!
          <Smile className="w-4 h-4 text-white" />
        </div>
      </footer>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center p-6 md:p-12 bg-black/90 backdrop-blur-xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl overflow-hidden relative preserve-3d my-12 md:my-24"
              style={{ transformStyle: 'preserve-3d' }}
              animate={isSent ? { 
                scale: 1, 
                opacity: 1, 
                x: 0, 
                y: 0, 
                rotateX: 0, 
                rotateY: 0, 
                rotateZ: 0 
              } : (isFolding ? {
                scale: [1, 0.4, 0.1],
                rotateX: [0, 90, 0],
                rotateY: [0, 45, 0],
                rotateZ: [0, -20, -15],
                x: [0, 50, 1200],
                y: [0, -50, -300],
                opacity: [1, 1, 0],
              } : { scale: 1, opacity: 1, y: 0 })}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={isFolding ? {
                duration: 2.5,
                times: [0, 0.6, 1],
                ease: "easeInOut"
              } : (isSent ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 200 })}
            >
              <AnimatePresence mode="wait">
                {isSent ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-12 md:p-24 text-center space-y-8"
                  >
                    <div className="w-24 h-24 border-2 border-accent rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-10 h-10 text-accent -rotate-12" />
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-center opacity-40">
                        <img 
                          src="https://lh3.googleusercontent.com/d/17xzztOYQ2Sk3ZTlPOY0Pan1g0jfZikyP" 
                          alt="oneup logo" 
                          className="h-10 w-auto"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold tracking-tighter">oneup</span>';
                          }}
                        />
                      </div>
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">THANK YOU</h2>
                      <p className="text-white/40 text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed">
                        Your inquiry has taken flight. <br /> 
                        We'll get back to you shortly.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowContactForm(false)}
                      className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent hover:text-white transition-colors pt-8"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form" 
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <AnimatePresence>
                      {isFolding && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0, rotate: -45, x: 0, y: 0 }}
                          animate={{ 
                            opacity: [0, 1, 1, 0], 
                            scale: [0, 1.5, 1.5, 0.5],
                            rotate: [-45, -12, -12, -12],
                            x: [0, 0, 0, 500],
                            y: [0, 0, 0, -500]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 2, 
                            times: [0, 0.2, 0.7, 1],
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 flex items-center justify-center z-50 text-accent pointer-events-none"
                        >
                          <Send className="w-24 h-24" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.div
                      animate={isFolding ? { 
                        opacity: 0, 
                        scale: 0.9, 
                        filter: 'blur(20px)',
                        transition: { duration: 0.8, ease: "easeIn" }
                      } : { 
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)'
                      }}
                    >
                      <button 
                        onClick={() => setShowContactForm(false)}
                        className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors z-10"
                      >
                        <X className="w-6 h-6 text-white/40 hover:text-white" />
                      </button>

                      <div className="p-8 md:p-16">
                        <div className="mb-12 text-center">
                          <div className="mb-10 flex justify-center opacity-90">
                            <img 
                              src="https://lh3.googleusercontent.com/d/17xzztOYQ2Sk3ZTlPOY0Pan1g0jfZikyP" 
                              alt="oneup logo" 
                              className="h-11 md:h-15 w-auto"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Inquiry</span>
                          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">START A PROJECT</h2>
                        </div>

                        <form className="space-y-8" onSubmit={handleFormSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 group">
                              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">Name</label>
                              <input 
                                required
                                type="text" 
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                              />
                            </div>
                            <div className="space-y-2 group">
                              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">Email</label>
                              <input 
                                required
                                type="email" 
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                              />
                            </div>
                            <div className="space-y-2 group md:col-span-2 lg:col-span-1">
                              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">Phone (Optional)</label>
                              <input 
                                type="tel" 
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">Service</label>
                            <select 
                              value={formData.service}
                              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                              className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg appearance-none cursor-pointer"
                            >
                              <option className="bg-[#1a1a1a]">Brand Identity</option>
                              <option className="bg-[#1a1a1a]">Digital Design</option>
                              <option className="bg-[#1a1a1a]">Art Direction</option>
                              <option className="bg-[#1a1a1a]">Other</option>
                            </select>
                          </div>

                          <div className="space-y-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">Message</label>
                            <textarea 
                              required
                              rows={4}
                              placeholder="Tell us about your project..."
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg resize-none"
                            />
                          </div>

                          <button 
                            type="submit"
                            disabled={isFolding}
                            className="w-full py-6 bg-accent text-black font-bold text-xs uppercase tracking-[0.4em] hover:bg-white transition-all mt-8 disabled:opacity-50"
                          >
                            {isFolding ? 'SENDING...' : 'Send Inquiry'}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Modal */}
      <AnimatePresence>
        {showLegalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black text-white overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col">
              <nav className="sticky top-0 w-full px-6 py-8 md:px-12 flex justify-between items-center bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
                <div className="flex items-center">
                  <img 
                    src="https://lh3.googleusercontent.com/d/17xzztOYQ2Sk3ZTlPOY0Pan1g0jfZikyP" 
                    alt="oneup logo" 
                    className="h-12 w-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button 
                  onClick={() => setShowLegalModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                >
                  <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </nav>

              <main className="flex-grow px-6 md:px-12 py-24 max-w-4xl mx-auto w-full">
                <div className="space-y-32">
                  {/* Privacy Policy */}
                  <section>
                    <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block">Legal</span>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">PRIVACY POLICY</h2>
                    <div className="prose prose-invert prose-lg max-w-none text-white/60 font-light leading-relaxed space-y-8">
                      <p>At oneup, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you interact with our design studio.</p>
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">1. Information Collection</h3>
                        <p>We collect information you provide directly to us, such as when you submit an inquiry through our contact form. This may include your name, email address, phone number, and project details.</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">2. Use of Information</h3>
                        <p>We use the information we collect to respond to your inquiries, provide our services, and improve our studio's offerings. We do not sell or share your personal information with third parties for marketing purposes.</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">3. Data Security</h3>
                        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
                      </div>
                    </div>
                  </section>

                  {/* Divider */}
                  <div className="h-px w-full bg-white/10" />

                  {/* Terms of Service */}
                  <section>
                    <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block">Legal</span>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">TERMS OF SERVICE</h2>
                    <div className="prose prose-invert prose-lg max-w-none text-white/60 font-light leading-relaxed space-y-8">
                      <p>By accessing or using the services provided by oneup, you agree to be bound by these terms of service.</p>
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">1. Services</h3>
                        <p>oneup provides design and technology services, including branding, digital design, and art direction. The specific scope of work for each project will be outlined in a separate agreement.</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">2. Intellectual Property</h3>
                        <p>Unless otherwise agreed in writing, all intellectual property rights in the work created by oneup remain the property of the studio until full payment is received.</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">3. Limitation of Liability</h3>
                        <p>oneup shall not be liable for any indirect, incidental, or consequential damages arising out of or in connection with our services.</p>
                      </div>
                    </div>
                  </section>
                </div>
              </main>

              <footer className="px-6 md:px-12 py-12 border-t border-white/10 flex flex-col items-center gap-8">
                <button 
                  onClick={() => setShowLegalModal(false)}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold hover:text-accent transition-colors"
                >
                  Close Legal
                </button>
                <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">
                  oneup © 2026 Design studio / Atelier de création
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="project-modal"
            className="fixed inset-0 z-[100] bg-white text-black overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col">
              <nav className="sticky top-0 w-full px-6 py-8 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 border-b border-black/5">
                <div 
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center cursor-pointer group"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/d/1N6Tfo4zos_u-SMF0PDBggzLPxjNA9XBG" 
                    alt="oneup logo" 
                    className="h-12 w-auto transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold tracking-tighter">oneup</span>';
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="flex items-center border border-black/10 rounded-full p-1">
                    <button 
                      onClick={() => navigateProject('prev')}
                      className="p-2 hover:bg-black/5 rounded-full transition-colors group"
                      title="Previous Project"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="w-px h-4 bg-black/10 mx-1" />
                    <button 
                      onClick={() => navigateProject('next')}
                      className="p-2 hover:bg-black/5 rounded-full transition-colors group"
                      title="Next Project"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors group"
                    title="Close"
                  >
                    <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </nav>

              <main className="flex-grow px-6 md:px-12 py-12 md:py-24 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
                  <div className="md:col-span-5 space-y-8">
                    <div>
                      <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                        {selectedProject.title.split(' ')[0]} <br />
                        <span className="text-black/20">{selectedProject.title.split(' ')[1]}</span>
                      </h2>
                    </div>
                    
                    <div className="space-y-6 pt-8 border-t border-black/10">
                      <p className="text-xl text-black/60 leading-relaxed font-light">
                        A deep dive into the creative process for {selectedProject.title}. We focused on delivering a unique visual language that resonates with the target audience while maintaining technical excellence.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-8 pt-8">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30 block mb-2">Year</span>
                          <span className="text-sm font-medium">2026</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30 block mb-2">Role</span>
                          <span className="text-sm font-medium">Lead Design</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    <motion.div 
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-black/5"
                    >
                      <img 
                        src={selectedProject.image} 
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    
                    <div className="mt-12 space-y-12">
                      <div className="aspect-video overflow-hidden bg-black/5">
                        <img 
                          src={`https://picsum.photos/seed/${selectedProject.id + 100}/1200/800`} 
                          alt="Detail 1"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="aspect-video overflow-hidden bg-black/5">
                        <img 
                          src={`https://picsum.photos/seed/${selectedProject.id + 200}/1200/800`} 
                          alt="Detail 2"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </main>

              <footer className="px-6 md:px-12 py-12 border-t border-black/10 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold hover:text-accent transition-colors"
                >
                  Close Project
                </button>
                <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/20">
                  oneup © 2026 Design studio / Atelier de création
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            onClick={scrollToTop}
            className="fixed bottom-24 left-1/2 z-50 flex flex-col items-center gap-2 text-white/30 hover:text-white transition-all group"
            aria-label="Back to top"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Top</span>
            <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:border-white transition-colors">
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}




