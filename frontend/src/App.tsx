import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Terminal,
  ExternalLink,
  Brain,
  Code2,
  User,
  Briefcase,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  Phone,
  CheckCircle2,
  Heart,
  TrendingUp,
  Target,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useScroll, useSpring } from 'framer-motion';
import Chat from './components/Chat';


// ── Personal VJ Monogram Visual ──
function HeroVisual() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px', height: '150px' }}>

      {/* Shimmer sweep ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '-8px', borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 60%, rgba(139,92,246,0.8) 80%, transparent 100%)',
        }}
      />

      {/* Static soft ring */}
      <div style={{
        position: 'absolute', inset: '-8px', borderRadius: '50%',
        border: '1.5px solid rgba(139,92,246,0.2)',
      }} />

      {/* Floating accent — top right diamond */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [0, 45, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-4px', right: '10px',
          width: '10px', height: '10px',
          background: 'var(--accent)',
          borderRadius: '2px',
          boxShadow: '0 0 12px var(--accent)',
          transform: 'rotate(45deg)',
        }}
      />

      {/* Floating accent — bottom left circle */}
      <motion.div
        animate={{ y: [4, -4, 4], scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute', bottom: '2px', left: '8px',
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--secondary)',
          boxShadow: '0 0 10px var(--secondary)',
        }}
      />

      {/* Floating accent — left mid dot */}
      <motion.div
        animate={{ x: [-3, 3, -3], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', left: '-6px', top: '50%',
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent-light, #a78bfa)',
          boxShadow: '0 0 8px #a78bfa',
        }}
      />

      {/* White backing circle */}
      <div style={{
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        {/* VJ Initials */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: '3.6rem', fontWeight: 900, lineHeight: 1,
            background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px', userSelect: 'none',
            filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.6))',
          }}
        >
          VJ
        </motion.div>
      </div>
    </div>
  );
}


const FALLBACK_PROJECTS = [
  {
    title: "Real-time Expert Booking System",
    description: "Developed a real-time platform for booking expert consultations with instant availability tracking and secure payment integration.",
    tags: ["React", "Node.js", "Web Dev", "Real-time"],
    year: "2024",
    github: "https://github.com/vrindajindal21/Real-Time-Expert-Session-Booking-System",
    demo: "https://real-time-expert-session-booking.vercel.app/"
  },
  {
    title: "Titanic Chatbot",
    description: "An interactive AI agent built with LangChain and FastAPI that analyzes the Titanic dataset, providing insights and visualizations.",
    tags: ["AI", "FastAPI", "LangChain", "Data Analysis"],
    year: "2025",
    github: "https://github.com/vrindajindal21/-titanic-chatbot",
    demo: "https://titanic-chat.streamlit.app/"
  }
];

export default function App() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('rose');
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch dynamic resume data from backend
  useEffect(() => {
    async function fetchResume() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/resume`);
        if (res.ok) {
          const data = await res.json();
          setResumeData(data);

          // Map Projects
          if (data.projects) {
            setProjects(data.projects.map((p: any) => ({
              title: p.title,
              description: p.description,
              tags: p.tech_stack || [],
              year: p.year,
              github: p.github || "https://github.com/vrindajindal21",
              demo: p.demo || "#"
            })));
          }

          // Map Certifications
          if (data.certifications) {
            setCertifications(data.certifications.map((c: string) => {
              const [name, issuer] = c.split(' (');
              return { name, issuer: issuer ? issuer.replace(')', '') : 'Credential' };
            }));
          }

          // Map Skills
          if (data.skills) {
            const groups = Object.entries(data.skills).map(([name, items]: [string, any]) => {
              let icon = <Layers className="text-secondary" />;
              if (name.includes('AI') || name.includes('Machine')) icon = <Brain className="text-accent" />;
              if (name.includes('Languages')) icon = <Code2 className="text-secondary" />;
              if (name.includes('Technical')) icon = <Terminal className="text-accent" />;

              return { name, items, icon };
            });
            setSkillGroups(groups);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic resume data:", err);
      }
    }
    fetchResume();
  }, []);

  const THEMES = [
    { id: 'violet', label: 'Violet', accent: '#8b5cf6', secondary: '#06b6d4', bg: '#020617', bgDark: '#0f172a', textMain: '#f8fafc', textMuted: '#94a3b8', glass: 'rgba(15,23,42,0.65)', card: '#1e293b' },
    { id: 'rose', label: 'Rose', accent: '#f43f5e', secondary: '#a855f7', bg: '#0a0812', bgDark: '#12101a', textMain: '#fdf4ff', textMuted: '#a89cb0', glass: 'rgba(18,16,26,0.7)', card: '#1c1726' },
    { id: 'emerald', label: 'Emerald', accent: '#10b981', secondary: '#14b8a6', bg: '#020f0d', bgDark: '#071a16', textMain: '#f0fdf4', textMuted: '#86b9a7', glass: 'rgba(7,26,22,0.7)', card: '#0d2620' },
    { id: 'amber', label: 'Amber', accent: '#f59e0b', secondary: '#f97316', bg: '#0c0a00', bgDark: '#1a1400', textMain: '#fffbeb', textMuted: '#b8a87c', glass: 'rgba(26,20,0,0.7)', card: '#231d00' },
    { id: 'indigo', label: 'Indigo', accent: '#6366f1', secondary: '#ec4899', bg: '#05050f', bgDark: '#0f0f1a', textMain: '#f5f3ff', textMuted: '#9b96b8', glass: 'rgba(15,15,26,0.7)', card: '#16152a' },
  ];

  useEffect(() => {
    const t = THEMES.find(t => t.id === activeTheme) || THEMES[1];
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-light', t.accent + 'cc');
    root.style.setProperty('--accent-glow', t.accent + '66');
    root.style.setProperty('--secondary', t.secondary);
    root.style.setProperty('--secondary-light', t.secondary + 'cc');
    root.style.setProperty('--bg-darker', t.bg);
    root.style.setProperty('--bg-dark', t.bgDark);
    root.style.setProperty('--text-main', t.textMain);
    root.style.setProperty('--text-muted', t.textMuted);
    root.style.setProperty('--glass', t.glass);
    root.style.setProperty('--card-bg', t.card);
    localStorage.setItem('vj-theme', t.id);
  }, [activeTheme]);

  useEffect(() => {
    const saved = localStorage.getItem('vj-theme');
    if (saved) setActiveTheme(saved);
  }, []);

  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracker
  useEffect(() => {
    const sections = ['about', 'projects', 'skills', 'education'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Auto chat popup — shows after 8s, once per session, dismissed on scroll
  useEffect(() => {
    if (sessionStorage.getItem('vj-popup-seen')) return;
    const timer = setTimeout(() => {
      if (!popupDismissed) setShowChatPopup(true);
    }, 8000);
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatPopup(false);
        clearTimeout(timer);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, [popupDismissed]);

  const dismissPopup = () => {
    setShowChatPopup(false);
    setPopupDismissed(true);
    sessionStorage.setItem('vj-popup-seen', '1');
  };

  const FILTERS = ['All', 'AI / ML', 'Python', 'Web'];

  const filtered = projects.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'AI / ML') return p.tags.some((t: string) => ['Deep Learning', 'NLP', 'ML', 'CNN', 'OpenCV', 'AI', 'LangChain'].includes(t));
    if (activeFilter === 'Python') return p.tags.includes('Python');
    if (activeFilter === 'Web') return p.tags.some((t: string) => ['HTML', 'CSS', 'JS', 'Web Dev', 'React', 'Real-time'].includes(t));
    return true;
  });

  const [typedText, setTypedText] = useState('');
  const [titleIdx, setTitleIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const TITLES = ['AI Developer', 'ML Engineer', 'Data Analyst', 'Software Developer', 'Python Dev'];

  useEffect(() => {
    const currentTitle = TITLES[titleIdx];
    const speed = isDeleting ? 60 : 110;
    const timer = setTimeout(() => {
      if (!isDeleting && typedText === currentTitle) {
        // Pause then start deleting
        setTimeout(() => setIsDeleting(true), 1400);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setTitleIdx(prev => (prev + 1) % TITLES.length);
      } else {
        setTypedText(prev =>
          isDeleting ? prev.slice(0, -1) : currentTitle.slice(0, prev.length + 1)
        );
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, titleIdx]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="app">
      {/* Mouse glow follower */}
      <motion.div
        animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120, mass: 0.5 }}
        style={{
          position: 'fixed', width: '500px', height: '500px', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)',
          borderRadius: '50%', zIndex: 0, filter: 'blur(30px)'
        }}
      />
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--accent), var(--secondary))',
          transformOrigin: '0%',
          zIndex: 1000
        }}
      />
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '10%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.5
        }} />
      </div>

      <nav className={`navbar ${isScrolled ? 'glass' : ''}`}>
        <div className="container">
          <div className="logo">Vrinda.AI</div>
          <div className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
            {[
              { href: '#about', label: 'Profile', id: 'about' },
              { href: '#projects', label: 'Portfolio', id: 'projects' },
              { href: '#skills', label: 'Stack', id: 'skills' },
              { href: '#education', label: 'Education', id: 'education' },
            ].map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: activeSection === link.id ? 'var(--accent)' : undefined,
                  position: 'relative',
                }}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="navIndicator"
                    style={{
                      position: 'absolute', bottom: '-4px', left: 0, right: 0,
                      height: '2px', background: 'linear-gradient(90deg, var(--accent), var(--secondary))',
                      borderRadius: '2px', boxShadow: '0 0 8px var(--accent-glow)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>
          <div className="cta-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-main)',
                cursor: 'pointer', display: 'none', padding: '8px'
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="nav-actions">
              <a href={resumeData?.personal_info?.linkedin || "https://www.linkedin.com/in/vrinda-jindal-936749361"} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px' }}><Linkedin size={20} /></a>
              <a href={`mailto:${resumeData?.personal_info?.email || "e23bcau0076@bennett.edu.in"}`} className="btn-secondary" style={{ padding: '8px' }}><Mail size={20} /></a>
            </div>
          </div>
        </div>
      </nav>

      <section className="container">
        <motion.div
          className="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content">
            <motion.span
              className="hero-subtitle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✦ Available for Opportunities 2026
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              style={{ marginBottom: '12px' }}
            >
              BCA (AI) |{' '}
              <span style={{ display: 'inline-block', minWidth: '220px' }}>
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ color: 'var(--accent)' }}
                >
                  |
                </motion.span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Applying AI/ML techniques to solve real-world problems through practical project implementation. Open to Internships 2026.
            </motion.p>

            {/* Animated stat counters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              style={{ display: 'flex', gap: '28px', margin: '24px 0', flexWrap: 'wrap' }}
            >
              {[{ val: '8+', label: 'Projects', color: 'var(--accent)' }, { val: '8.82', label: 'CGPA', color: 'var(--secondary)' }, { val: '6+', label: 'Certs', color: '#10b981' }].map(s => (
                <motion.div
                  key={s.label}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, type: 'spring' }}
                  style={{
                    textAlign: 'center', padding: '10px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${s.color}44`,
                    borderRadius: '14px',
                    boxShadow: `0 0 16px ${s.color}22`,
                  }}
                >
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, background: `linear-gradient(135deg, ${s.color}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>{s.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="cta-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <a href="#chat" className="btn btn-primary">Interview My AI</a>
              <a href="#projects" className="btn btn-secondary">Explore Portfolio</a>
            </motion.div>
          </div>

          <motion.div
            className="hero-image"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* === Premium 3-Ring Orbital System === */}
            <div style={{ position: 'relative', width: '360px', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* ── OUTER RING: tilted 3D, skill-label satellites that counter-rotate ── */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: '360px', height: '360px', borderRadius: '50%',
                  border: '1px dashed rgba(139,92,246,0.25)',
                  transform: 'rotateX(60deg)',
                }}
              >
                {[
                  { label: '✦ Code', angle: 0, color: '#a78bfa' },
                  { label: '✦ Build', angle: 90, color: '#06b6d4' },
                  { label: '✦ Learn', angle: 180, color: '#a78bfa' },
                  { label: '✦ Create', angle: 270, color: '#06b6d4' },
                ].map(({ label, angle, color }) => {
                  const rad = (angle * Math.PI) / 180;
                  const r = 180;
                  return (
                    <div key={label} style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: `translate(calc(${Math.cos(rad) * r}px - 50%), calc(${Math.sin(rad) * r}px - 50%))`,
                    }}>
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                          background: `${color}22`, border: `1px solid ${color}66`, color,
                          whiteSpace: 'nowrap', backdropFilter: 'blur(8px)',
                          boxShadow: `0 0 14px ${color}55`,
                        }}
                      >
                        {label}
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* ── MIDDLE RING: opposite rotation, comet-tail glowing dots ── */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: '278px', height: '278px', borderRadius: '50%',
                  border: '1px solid rgba(6,182,212,0.18)',
                  transform: 'rotateX(70deg) rotateZ(25deg)',
                }}
              >
                {[0, 120, 240].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const r = 139;
                  return (
                    <div key={i} style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: `translate(calc(${Math.cos(rad) * r}px - 50%), calc(${Math.sin(rad) * r}px - 50%))`,
                    }}>
                      <div style={{ position: 'relative' }}>
                        {/* Comet head */}
                        <motion.div
                          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
                          style={{
                            width: '11px', height: '11px', borderRadius: '50%',
                            background: 'var(--secondary)',
                            boxShadow: '0 0 16px var(--secondary), 0 0 36px rgba(6,182,212,0.5)',
                          }}
                        />
                        {/* Comet tail */}
                        <div style={{
                          position: 'absolute', top: '50%', right: '100%',
                          width: `${24 + i * 12}px`, height: '2px',
                          background: 'linear-gradient(to left, var(--secondary), transparent)',
                          transform: 'translateY(-50%)', borderRadius: '2px', opacity: 0.55,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* ── INNER RING: fast spin, pulsing accent dots ── */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: '185px', height: '185px', borderRadius: '50%',
                  border: '1.5px solid rgba(139,92,246,0.35)',
                }}
              >
                {[0, 180].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const r = 92;
                  return (
                    <div key={i} style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: `translate(calc(${Math.cos(rad) * r}px - 50%), calc(${Math.sin(rad) * r}px - 50%))`,
                    }}>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9 }}
                        style={{
                          width: '14px', height: '14px', borderRadius: '50%',
                          background: 'var(--accent)',
                          boxShadow: '0 0 20px var(--accent), 0 0 42px rgba(139,92,246,0.6)',
                        }}
                      />
                    </div>
                  );
                })}
              </motion.div>

              {/* ── Breathing ambient halo ── */}
              <motion.div
                animate={{ scale: [1, 1.07, 1], opacity: [0.25, 0.65, 0.25] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', width: '316px', height: '316px', borderRadius: '50%',
                  border: '2px solid rgba(139,92,246,0.3)',
                  boxShadow: '0 0 70px rgba(139,92,246,0.18), inset 0 0 70px rgba(139,92,246,0.06)',
                  pointerEvents: 'none',
                }}
              />

              {/* ── CORE: brain card, shimmer + float + rock ── */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 20px 55px rgba(139,92,246,0.35)',
                    '0 28px 80px rgba(139,92,246,0.6)',
                    '0 20px 55px rgba(139,92,246,0.35)',
                  ]
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '240px', height: '240px', borderRadius: '30%',
                  background: 'linear-gradient(135deg, #5b21b6 0%, #4c1d95 40%, #0e7490 100%)',
                  position: 'relative', zIndex: 2,
                  border: '1px solid rgba(139,92,246,0.45)',
                }}
              >
                {/* Glass shimmer overlay */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '30%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)',
                  pointerEvents: 'none',
                }} />

                {/* Centering wrapper — separate from animated element to prevent transform conflict */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <motion.div
                    animate={{ y: [0, -5, 4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ color: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <HeroVisual />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '10px', letterSpacing: '2px', opacity: 0.92, whiteSpace: 'nowrap' }}>
                      {resumeData?.personal_info?.name || "VRINDA JINDAL"}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>

        <div className="main-grid">
          <div className="content-side">

            <motion.section
              id="about"
              style={{ marginBottom: '80px' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
            >
              <h2 className="section-title"><span></span>Professional Summary</h2>
              <div className="glass" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                  <Target size={150} />
                </div>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '24px', lineHeight: '1.7' }}>
                  {resumeData?.profile || "Ambitious and Dedicated BCA student specializing in Artificial Intelligence with a strong foundation in programming, data structures, software development, and Data Analysis. Familiar with AI/ML concepts, Data Analyst methodologies, and full-stack development through academic and project work."}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <motion.div
                    className="glass"
                    style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '16px', border: '1px solid rgba(139, 92, 246, 0.1)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
                      <Target size={18} /> <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>TARGET ROLES</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['AI/ML Intern', 'Data Analyst Intern', 'Python Developer Intern', 'Software Developer Intern'].map(role => (
                        <span key={role} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {role}</span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div
                    className="glass"
                    style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '16px', border: '1px solid rgba(6, 182, 212, 0.1)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--secondary)' }}>
                      <Award size={18} /> <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>ACADEMIC STATUS</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>8.82 CGPA | Graduating 2026</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bennett University</p>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <section id="projects" style={{ marginBottom: '80px' }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '16px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}><span></span>Featured Portfolio</h2>
                  {/* Filter Tabs */}
                  <div style={{ display: 'flex', gap: '6px', padding: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px' }}>
                    {FILTERS.map(f => (
                      <motion.button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        whileTap={{ scale: 0.94 }}
                        style={{
                          padding: '7px 18px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
                          border: 'none', cursor: 'pointer', transition: 'all 0.25s',
                          background: activeFilter === f ? 'var(--accent)' : 'transparent',
                          color: activeFilter === f ? 'white' : 'var(--text-muted)',
                          boxShadow: activeFilter === f ? '0 4px 12px rgba(139,92,246,0.4)' : 'none'
                        }}
                      >
                        {f}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.div className="card-grid" layout>
                    {filtered.map((project, idx) => {
                      const cardColors = [
                        { bar: 'linear-gradient(90deg,#f43f5e,#a855f7)', border: 'rgba(244,63,94,0.35)' },
                        { bar: 'linear-gradient(90deg,#a855f7,#06b6d4)', border: 'rgba(168,85,247,0.35)' },
                        { bar: 'linear-gradient(90deg,#10b981,#06b6d4)', border: 'rgba(16,185,129,0.35)' },
                        { bar: 'linear-gradient(90deg,#f59e0b,#f43f5e)', border: 'rgba(245,158,11,0.35)' },
                        { bar: 'linear-gradient(90deg,#6366f1,#ec4899)', border: 'rgba(99,102,241,0.35)' },
                        { bar: 'linear-gradient(90deg,#14b8a6,#a855f7)', border: 'rgba(20,184,166,0.35)' },
                        { bar: 'linear-gradient(90deg,#f97316,#f43f5e)', border: 'rgba(249,115,22,0.35)' },
                        { bar: 'linear-gradient(90deg,#8b5cf6,#10b981)', border: 'rgba(139,92,246,0.35)' },
                      ];
                      const c = cardColors[idx % cardColors.length];
                      return (
                        <motion.div
                          layout
                          key={project.title}
                          variants={itemVariants}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          className="glass project-card"
                          whileHover={{ scale: 1.02, y: -6 }}
                          style={{ borderTop: `2px solid transparent`, borderImage: `${c.bar} 1`, overflow: 'hidden', position: 'relative' }}
                        >
                          {/* Colored top bar */}
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c.bar }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '8px' }}>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{project.title}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{project.year}</span>
                          </div>
                          <p style={{ margin: '14px 0', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{project.description}</p>
                          <div className="tag-group">
                            {project.tags.map(tag => <span key={tag} className="tag" style={{ fontSize: '0.75rem' }}>{tag}</span>)}
                          </div>
                          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
                              <Github size={14} /> GitHub
                            </a>
                            {project.demo && (
                              <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'none' }}>
                                <ExternalLink size={14} /> Live Demo
                              </a>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </section>

            <section id="skills" style={{ marginBottom: '80px' }}>
              <h2 className="section-title"><span></span>Technical Stack</h2>
              <motion.div
                className="card-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                {skillGroups.map((group, idx) => {
                  const groupColors = [
                    { bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.22)', icon: 'rgba(244,63,94,0.18)', glow: '#f43f5e' },
                    { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.22)', icon: 'rgba(168,85,247,0.18)', glow: '#a855f7' },
                    { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.22)', icon: 'rgba(16,185,129,0.18)', glow: '#10b981' },
                    { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.22)', icon: 'rgba(99,102,241,0.18)', glow: '#6366f1' },
                  ];
                  const gc = groupColors[idx % groupColors.length];
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="glass"
                      style={{ padding: '24px', position: 'relative', overflow: 'hidden', background: gc.bg, borderColor: gc.border }}
                      whileHover={{ scale: 1.02, borderColor: gc.glow + '66' }}
                    >
                      {/* Subtle corner glow */}
                      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: gc.glow + '18', filter: 'blur(20px)', pointerEvents: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ padding: '8px', background: gc.icon, borderRadius: '10px', boxShadow: `0 0 14px ${gc.glow}44` }}>
                          {group.icon}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.5px' }}>{group.name}</h3>
                      </div>
                      <div className="tag-group">
                        {group.items.map(item => (
                          <motion.span
                            key={item}
                            className="tag"
                            onHoverStart={() => setHoveredSkill(item)}
                            onHoverEnd={() => setHoveredSkill(null)}
                            whileHover={{ scale: 1.15, y: -2 }}
                            style={{
                              border: '1px solid',
                              borderColor: hoveredSkill === item ? gc.glow : 'var(--glass-border)',
                              background: hoveredSkill === item ? gc.glow + '33' : 'rgba(255,255,255,0.02)',
                              cursor: 'default', transition: 'background 0.2s, border-color 0.2s',
                              boxShadow: hoveredSkill === item ? `0 0 12px ${gc.glow}55` : 'none'
                            }}
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>

            <section id="education" style={{ marginBottom: '80px' }}>
              <h2 className="section-title"><span></span>Academic Background</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {(resumeData?.education || []).map((ed: any, idx: number) => {
                    const edColors = ['#a855f7', '#10b981', '#f59e0b', '#6366f1'];
                    const col = edColors[idx % edColors.length];
                    const isBCA = ed.degree?.includes('BCA');

                    return (
                      <div key={idx} className="glass" style={{
                        padding: '24px',
                        borderTop: isBCA ? '4px solid var(--accent)' : `3px solid ${col}`,
                        gridColumn: isBCA ? '1 / -1' : 'auto'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: isBCA ? '1.3rem' : '1.1rem', color: isBCA ? 'var(--text-main)' : col }}>
                            {ed.degree}
                          </h3>
                          <span className="tag">{ed.period}</span>
                        </div>
                        <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>{ed.institution}</p>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
                          <div style={{
                            background: 'var(--bg-darker)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: `1px solid ${isBCA ? 'var(--accent)' : col}`
                          }}>
                            <span style={{ color: isBCA ? 'var(--accent)' : col, fontWeight: 700, fontSize: '1rem' }}>
                              {ed.score}
                            </span>
                          </div>
                          {isBCA && (
                            <div className="tag" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid gold', color: 'gold' }}>
                              <Award size={14} style={{ marginRight: '6px' }} /> Dean's List Award
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section id="certifications" style={{ marginBottom: '80px' }}>
              <h2 className="section-title"><span></span>Certifications</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {certifications.map((cert, i) => {
                  const certColors = ['#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#6366f1', '#14b8a6'];
                  const col = certColors[i % certColors.length];
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03, y: -4 }}
                      style={{
                        background: `${col}12`,
                        border: `1px solid ${col}44`,
                        borderRadius: '14px', padding: '16px 18px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {/* Top accent line */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${col}, transparent)` }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle2 size={18} style={{ color: col, flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4 }}>{cert.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', padding: '3px 10px', borderRadius: '20px', background: `${col}22`, color: col, alignSelf: 'flex-start' }}>
                        {cert.issuer}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <section id="leadership" style={{ marginBottom: '80px' }}>
              <h2 className="section-title"><span></span>Leadership &amp; Roles</h2>
              <div className="card-grid">
                {[
                  {
                    icon: <User size={22} />,
                    title: 'Batch Representative (BR)',
                    gradient: 'linear-gradient(135deg, var(--secondary), #06b6d4)',
                    desc: 'Elected leader for the BCA batch at Bennett University, responsible for bridge-building between faculty and students and managing student affairs.',
                  },
                  {
                    icon: <Briefcase size={22} />,
                    title: 'Team Leader',
                    gradient: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                    desc: 'Steering groups of developers and students in academic projects to deliver efficient, deadline-driven software and AI solutions.',
                  },
                ].map(role => (
                  <motion.div
                    key={role.title}
                    className="glass"
                    whileHover={{ scale: 1.02, y: -5 }}
                    style={{ overflow: 'hidden', padding: 0 }}
                  >
                    <div style={{ background: role.gradient, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {role.icon}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{role.title}</h3>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{role.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="lifestyle" style={{ marginBottom: '80px' }}>
              <h2 className="section-title"><span></span>Interests &amp; Hobbies</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                {[
                  { emoji: '📚', label: 'Reading', desc: 'Books & articles', color: '#f43f5e' },
                  { emoji: '✈️', label: 'Traveling', desc: 'Exploring cultures', color: '#a855f7' },
                  { emoji: '🤖', label: 'Exploring AI Trends', desc: 'Always up to date', color: '#10b981' },
                  { emoji: '🎵', label: 'Music', desc: 'Beats & melodies', color: '#f59e0b' },
                ].map(h => (
                  <motion.div
                    key={h.label}
                    whileHover={{ scale: 1.06, y: -5 }}
                    style={{
                      background: `${h.color}12`, border: `1px solid ${h.color}33`,
                      borderRadius: '18px', padding: '22px 18px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                      textAlign: 'center', cursor: 'default',
                    }}
                  >
                    <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>{h.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: h.color }}>{h.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.desc}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          <aside className="sidebar">
            <div id="chat" className="chat-container glass" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <div className="chat-header">
                <div className="status-dot"></div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Vrinda's AI Recruiter</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Ready for Interview Prep</p>
                </div>
                <Sparkles size={20} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />
              </div>
              <Chat />
            </div>

            {/* Contact moved to top of content side */}
          </aside>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '18px 0' }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)',
        }}>
          {/* Left — name + tagline */}
          <span style={{ fontWeight: 700, color: 'var(--text-main)', letterSpacing: '1px' }}>
            VRINDA JINDAL <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>· AI Engineer · Bennett University 2026</span>
          </span>

          {/* Center — contact */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span><Mail size={11} style={{ marginRight: '5px', verticalAlign: 'middle' }} />e23bcau0076@bennett.edu.in</span>
            <span><Phone size={11} style={{ marginRight: '5px', verticalAlign: 'middle' }} />6397874630</span>
          </div>

          {/* Right — socials */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="https://github.com" style={{ color: 'var(--text-muted)', display: 'flex' }} title="GitHub"><Github size={17} /></a>
            <a href="https://www.linkedin.com/in/vrinda-jindal-936749361" style={{ color: 'var(--text-muted)', display: 'flex' }} title="LinkedIn"><Linkedin size={17} /></a>
          </div>
        </div>
      </footer>


      {/* ── Floating Theme Switcher ── */}
      <div style={{ position: 'fixed', bottom: '28px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        {/* Swatches panel */}
        <AnimatePresence>
          {themeOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ duration: 0.22 }}
              style={{
                background: 'rgba(20,16,30,0.92)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
                Theme
              </div>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTheme(t.id); setThemeOpen(false); }}
                  title={t.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: activeTheme === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: activeTheme === t.id ? `1px solid ${t.accent}55` : '1px solid transparent',
                    borderRadius: '10px', padding: '6px 10px', cursor: 'pointer',
                    transition: 'all 0.2s', width: '130px',
                  }}
                >
                  {/* Dual swatch */}
                  <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.accent, boxShadow: `0 0 8px ${t.accent}99` }} />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.secondary, boxShadow: `0 0 8px ${t.secondary}99` }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: activeTheme === t.id ? t.accent : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                    {t.label}
                  </span>
                  {activeTheme === t.id && (
                    <span style={{ marginLeft: 'auto', color: t.accent, fontSize: '0.7rem' }}>✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          onClick={() => setThemeOpen(o => !o)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Change theme"
          style={{
            width: '48px', height: '48px', borderRadius: '50%', border: 'none',
            background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px var(--accent-glow)',
            fontSize: '1.3rem',
          }}
        >
          🎨
        </motion.button>
      </div>

      {/* ── Auto Chat Popup ── */}
      <AnimatePresence>
        {showChatPopup && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', bottom: '90px', left: '24px', zIndex: 998,
              width: '300px',
              background: 'rgba(18,14,28,0.95)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--accent)44',
              borderRadius: '20px', padding: '20px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Close button */}
            <button
              onClick={dismissPopup}
              style={{
                position: 'absolute', top: '12px', right: '14px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.35)', fontSize: '1.1rem', lineHeight: 1,
              }}
            >✕</button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', boxShadow: '0 0 16px var(--accent-glow)',
                }}
              >
                ✨
              </motion.div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Vrinda's AI Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>Online now</span>
                </div>
              </div>
            </div>

            {/* Message bubble */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 12px 4px',
              padding: '12px 14px', marginBottom: '16px',
              fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6,
            }}>
              👋 Hi! I'm Vrinda's AI. Ask me about her <strong style={{ color: 'var(--text-main)' }}>projects, skills, or experience</strong> — I reply instantly!
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <motion.a
                href="#chat"
                onClick={dismissPopup}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: '10px', textAlign: 'center', textDecoration: 'none',
                  background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                  borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700,
                  color: 'white', boxShadow: '0 4px 14px var(--accent-glow)',
                }}
              >
                Chat Now →
              </motion.a>
              <button
                onClick={dismissPopup}
                style={{
                  padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600,
                }}
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
