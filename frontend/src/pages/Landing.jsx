import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Shield,
  Sparkles,
  Search,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  HandHeart,
  Award,
  Mail,
  Send,
  Star,
  Quote,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Reusable: card that reacts to the cursor with a soft radial glow    */
/* ------------------------------------------------------------------ */
const GlowCard = ({ className = '', children, style, ...rest }) => {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      style={style}
      className={`group relative overflow-hidden ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(59,130,246,0.18), transparent 60%)',
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Live counter: animates up once `active`, then keeps updating forever */
/*   mode 'grow'      -> ticks steadily upward (e.g. active students)    */
/*   mode 'fluctuate' -> drifts within [min, max] (e.g. success rate)    */
/* ------------------------------------------------------------------ */
const LiveCounter = ({ active, start, target, mode, range, suffix = '' }) => {
  const [display, setDisplay] = useState(start);
  const valueRef = useRef(start);
  const targetRef = useRef(start);

  // Smoothly tween the displayed value toward the current target
  useEffect(() => {
    let raf;
    const tick = () => {
      const diff = targetRef.current - valueRef.current;
      valueRef.current = Math.abs(diff) > 0.4 ? valueRef.current + diff * 0.06 : targetRef.current;
      setDisplay(valueRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Once in view: head to the headline target, then keep it alive — never stops
  useEffect(() => {
    if (!active) return;
    targetRef.current = target;
    const id = setInterval(() => {
      if (mode === 'grow') {
        targetRef.current += Math.floor(Math.random() * 3) + 1;
      } else {
        const [min, max] = range;
        targetRef.current = min + Math.floor(Math.random() * (max - min + 1));
      }
    }, mode === 'grow' ? 2200 : 3200);
    return () => clearInterval(id);
  }, [active, target, mode, range]);

  return (
    <span>
      {Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [wordIdx, setWordIdx] = useState(0);
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const rotatingWords = ['Find Lost Items', 'Fund Small Needs', 'Help Each Other'];

  /* scroll position + progress bar */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* cursor spotlight across the whole page */
  useEffect(() => {
    const handleMouse = (e) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  /* rotating hero word */
  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % rotatingWords.length), 2400);
    return () => clearInterval(id);
  }, [rotatingWords.length]);

  /* reveal-on-scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* stat counters */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) setStatsAnimated(true);
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsAnimated]);

  const marqueeItems = [
    'Lost & Found', 'Micro-Funding', 'Study Buddies', 'Ride Sharing',
    'Book Exchange', 'Emergency Help', 'Skill Sharing', 'Verified Students',
  ];

  return (
    <div className="font-body relative min-h-screen overflow-hidden bg-[#070b18] text-white antialiased">
      {/* ===== Scroll progress bar ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-500 shadow-[0_0_12px_rgba(56,189,248,0.7)] transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ===== Aurora / mesh background ===== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#070b18]" />
        <div
          className="animate-aurora absolute -top-40 -left-40 h-[42rem] w-[42rem] rounded-full bg-blue-600/25 blur-[120px]"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        />
        <div
          className="animate-aurora absolute top-1/4 -right-40 h-[40rem] w-[40rem] rounded-full bg-indigo-600/20 blur-[130px] [animation-delay:-6s]"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div
          className="animate-aurora absolute bottom-0 left-1/3 h-[38rem] w-[38rem] rounded-full bg-cyan-500/15 blur-[130px] [animation-delay:-12s]"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)',
          }}
        />
        {/* cursor spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(56,189,248,0.10), transparent 55%)`,
          }}
        />
      </div>

      {/* ===== Navigation ===== */}
      <nav className="relative z-50 px-6 py-5">
        <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 px-5 py-3 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/40 blur-md" />
              <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="relative h-11 w-11" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">Hela Fund</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <a href="#impact" className="transition-colors hover:text-white">Impact</a>
            <a href="#contact" className="transition-colors hover:text-white">Contact</a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="relative overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative z-10 px-6 pt-16 pb-24 md:pt-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
              </span>
              <span className="text-sm font-medium text-gray-200">Empowering student communities</span>
            </div>

            <h1 className="font-display animate-slide-up mb-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem]">
              <span className="block text-white">Together, students</span>
              <span
                key={wordIdx}
                className="animate-word-in animate-gradient-text mt-2 inline-block whitespace-nowrap bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent"
              >
                {rotatingWords[wordIdx]}
              </span>
            </h1>

            <p className="animate-slide-up delay-100 mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-400 lg:mx-0">
              A micro help &amp; support platform where university students find lost items, fund small
              needs, and build a stronger community through trust and collaboration.
            </p>

            <div className="animate-slide-up delay-200 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                onClick={() => navigate('/signup')}
                className="group relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold shadow-xl shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Helping Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
              >
                Sign In
              </button>
            </div>

            {/* trust row */}
            <div className="animate-fade-in delay-300 mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-400 lg:justify-start">
              <div className="flex -space-x-3">
                {['from-blue-500 to-cyan-400', 'from-indigo-500 to-blue-400', 'from-teal-500 to-emerald-400', 'from-violet-500 to-fuchsia-400'].map((g, i) => (
                  <div key={i} className={`h-9 w-9 rounded-full border-2 border-[#070b18] bg-gradient-to-br ${g}`} />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-300">Loved by <strong className="text-white">15,000+</strong> students</span>
              </div>
            </div>
          </div>

          {/* Right — orbiting logo orb */}
          <div className="relative flex items-center justify-center">
            <div className="animate-float relative aspect-square w-full max-w-md">
              {/* glow */}
              <div className="animate-glow absolute inset-8 rounded-full bg-blue-500/30 blur-3xl" />

              {/* orbit rings */}
              <div className="animate-spin-slow absolute inset-0 rounded-full border border-white/10" />
              <div className="animate-spin-reverse absolute inset-10 rounded-full border border-dashed border-blue-400/20" />
              <div className="animate-spin-slow absolute inset-20 rounded-full border border-white/5 [animation-delay:-8s]" />

              {/* orbiting icon chips */}
              {[
                { icon: Search, label: 'Lost & Found', pos: 'top-0 left-1/2 -translate-x-1/2', color: 'from-blue-500 to-cyan-400' },
                { icon: HandHeart, label: 'Funding', pos: 'top-1/2 right-0 -translate-y-1/2', color: 'from-indigo-500 to-blue-400' },
                { icon: Users, label: 'Community', pos: 'bottom-0 left-1/2 -translate-x-1/2', color: 'from-teal-500 to-emerald-400' },
                { icon: Shield, label: 'Verified', pos: 'top-1/2 left-0 -translate-y-1/2', color: 'from-violet-500 to-fuchsia-400' },
              ].map((chip, i) => (
                <div
                  key={i}
                  className={`absolute ${chip.pos} animate-float-slow`}
                  style={{ animationDelay: `${i * 0.7}s` }}
                >
                  <div className="glass flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 shadow-xl">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${chip.color}`}>
                      <chip.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="pr-1 text-xs font-semibold text-gray-100">{chip.label}</span>
                  </div>
                </div>
              ))}

              {/* center logo */}
              <div className="absolute inset-1/4 flex items-center justify-center">
                <img
                  src="/images/logoCircle.png"
                  alt="Hela Fund Logo"
                  className="h-full w-full object-contain drop-shadow-[0_10px_40px_rgba(56,189,248,0.45)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Marquee ribbon ===== */}
      <div className="relative z-10 border-y border-white/5 bg-white/[0.02] py-5">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="font-display text-lg font-semibold text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Features — bento grid ===== */}
      <section id="features" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center" data-animate id="features-header">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">What we offer</span>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-6xl">Everything you need</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Powerful features designed to make helping — and getting help — effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            {/* Big feature */}
            <GlowCard
              data-animate
              id="feat-0"
              className={`glass rounded-3xl border border-white/10 p-8 transition-all duration-700 hover:border-white/20 md:col-span-4 md:row-span-2 ${isVisible['feat-0'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="flex h-full flex-col">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/30 transition-transform group-hover:scale-110">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold md:text-3xl">Lost &amp; Found Network</h3>
                <p className="mt-3 max-w-md text-gray-400">
                  Instantly connect with students who found or lost items on campus. Real-time notifications,
                  photo verification, and campus-wide reach so nothing stays lost for long.
                </p>
                <div className="mt-auto grid grid-cols-3 gap-3 pt-8">
                  {['Real-time alerts', 'Campus-wide reach', 'Photo verification'].map((t, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs font-medium text-gray-300">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>

            {/* Two stacked */}
            <GlowCard
              data-animate
              id="feat-1"
              className={`glass rounded-3xl border border-white/10 p-7 transition-all duration-700 hover:border-white/20 md:col-span-2 ${isVisible['feat-1'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: '120ms' }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg transition-transform group-hover:scale-110">
                <HandHeart className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold">Micro-Funding</h3>
              <p className="mt-2 text-sm text-gray-400">
                Request or provide small financial help for books, meals, or emergencies — secure and transparent.
              </p>
            </GlowCard>

            <GlowCard
              data-animate
              id="feat-2"
              className={`glass rounded-3xl border border-white/10 p-7 transition-all duration-700 hover:border-white/20 md:col-span-2 ${isVisible['feat-2'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: '240ms' }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 shadow-lg transition-transform group-hover:scale-110">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold">Community Hub</h3>
              <p className="mt-2 text-sm text-gray-400">
                Study partners, ride sharing, skill swaps and events — build meaningful connections on campus.
              </p>
            </GlowCard>

            {/* Wide trust */}
            <GlowCard
              data-animate
              id="feat-3"
              className={`glass relative rounded-3xl border border-white/10 p-8 transition-all duration-700 hover:border-white/20 md:col-span-6 ${isVisible['feat-3'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: '360ms' }}
            >
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-lg transition-transform group-hover:scale-110">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">Trust &amp; Verification</h3>
                    <p className="mt-1 max-w-xl text-gray-400">
                      University-verified profiles, ratings, and secure transactions keep every interaction safe.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['ID verification', 'Rating system', 'Secure payments'].map((t, i) => (
                    <span key={i} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* ===== Mission / story ===== */}
      <section className="relative z-10 px-6 py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div data-animate id="story-content">
            <div className={`transition-all duration-1000 ${isVisible['story-content'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2">
                <HeartHandshake className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-200">Our mission</span>
              </div>
              <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
                Building a culture of{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">mutual support</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                University life is full of small challenges — a lost ID, emergency book money, or finding a
                study partner. Hela Fund makes solving these problems effortless through the power of community.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Connect with verified students instantly',
                  'Build trust through transparent interactions',
                  'Create lasting impact with small acts of kindness',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-lg text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            data-animate
            id="story-visual"
            className={`relative transition-all duration-1000 delay-300 ${isVisible['story-visual'] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
          >
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Search, label: 'Lost Items Found', value: '1,000+', color: 'from-blue-600 to-cyan-500', mt: '' },
                { icon: HandHeart, label: 'Funds Raised', value: 'LKR 2M+', color: 'from-indigo-600 to-blue-500', mt: 'mt-8' },
                { icon: Users, label: 'Active Students', value: '12K+', color: 'from-teal-600 to-emerald-500', mt: '-mt-8' },
                { icon: HeartHandshake, label: 'Acts of Help', value: '8.7K+', color: 'from-violet-600 to-fuchsia-500', mt: '' },
              ].map((stat, idx) => (
                <GlowCard
                  key={idx}
                  className={`glass rounded-3xl border border-white/10 p-6 transition-transform duration-300 hover:-translate-y-1 ${stat.mt}`}
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="font-display text-3xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </GlowCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== How it works — timeline ===== */}
      <section id="how" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center" data-animate id="how-header">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Simple by design</span>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-6xl">How it works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Getting help or helping others is just a few clicks away.
            </p>
          </div>

          <div className="relative">
            {/* connecting line + travelling beam */}
            <div className="absolute left-0 right-0 top-[4.5rem] hidden h-px overflow-hidden bg-gradient-to-r from-transparent via-blue-500/30 to-transparent lg:block">
              <div className="animate-marquee h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '01', title: 'Sign Up', description: 'Create your account with university email verification.', icon: Users, color: 'from-blue-600 to-cyan-500' },
                { step: '02', title: 'Post or Browse', description: 'Create a request or browse existing community needs.', icon: Search, color: 'from-indigo-600 to-blue-500' },
                { step: '03', title: 'Connect', description: 'Match with verified students and communicate securely.', icon: HeartHandshake, color: 'from-teal-600 to-emerald-500' },
                { step: '04', title: 'Complete', description: 'Fulfill the request and build your trust score.', icon: Award, color: 'from-violet-600 to-fuchsia-500' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  data-animate
                  id={`step-${idx}`}
                  className={`relative transition-all duration-700 ${isVisible[`step-${idx}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* node */}
                  <div className="mx-auto mb-6 flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/30 bg-[#070b18] lg:relative lg:z-10">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  </div>

                  <GlowCard className="glass flex min-h-[260px] flex-col rounded-3xl border border-white/10 p-7 transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg transition-transform group-hover:scale-110`}>
                        <step.icon className="h-7 w-7" />
                      </div>
                      <span className="font-display text-5xl font-extrabold text-white/10">{step.step}</span>
                    </div>
                    <h3 className="font-display mt-6 text-2xl font-bold">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-gray-400">{step.description}</p>
                  </GlowCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Impact stats ===== */}
      <section id="impact" ref={statsRef} className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-cyan-500/10 p-10 md:p-16">
            {/* dotted texture */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />
            <div className="animate-glow absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/30 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-14 text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-200">Real-time impact</span>
                </div>
                <h2 className="font-display text-4xl font-bold md:text-5xl">Making a difference together</h2>
                <p className="mt-4 text-lg text-gray-400">Every day, students help each other succeed.</p>
              </div>

              <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                {[
                  { start: 14600, target: 15000, mode: 'grow', suffix: '+', label: 'Active Students', icon: Users },
                  { start: 3380, target: 3500, mode: 'grow', suffix: '+', label: 'Requests Fulfilled', icon: CheckCircle2 },
                  { start: 94, target: 98, mode: 'fluctuate', range: [95, 99], suffix: '%', label: 'Success Rate', icon: TrendingUp },
                  { start: 26, target: 24, mode: 'fluctuate', range: [21, 26], suffix: 'h', label: 'Avg Response Time', icon: Clock },
                ].map((stat, idx) => (
                  <div key={idx} className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl shadow-blue-600/30 transition-transform group-hover:scale-110">
                        <stat.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="font-display bg-gradient-to-r from-white to-blue-200 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
                      <LiveCounter
                        active={statsAnimated}
                        start={stat.start}
                        target={stat.target}
                        mode={stat.mode}
                        range={stat.range}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="mt-2 font-medium text-gray-400">{stat.label}</div>
                    {stat.mode === 'grow' && (
                      <div className="mt-1.5 flex items-center justify-center gap-1 text-xs font-medium text-emerald-400">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Live
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center" data-animate id="testi-header">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Loved on campus</span>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-6xl">What students say</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { quote: 'Lost my laptop bag before finals — someone returned it within hours through Hela Fund. Genuinely saved my semester.', name: 'Tharushi P.', role: 'Engineering, Y3', g: 'from-blue-500 to-cyan-400' },
              { quote: 'I needed quick money for a textbook and the community came through. Now I help others whenever I can.', name: 'Kasun W.', role: 'Business, Y2', g: 'from-indigo-500 to-blue-400' },
              { quote: 'Found my study group and a ride home for the holidays here. It feels like the campus actually has my back.', name: 'Nethmi S.', role: 'Science, Y1', g: 'from-teal-500 to-emerald-400' },
            ].map((t, idx) => (
              <GlowCard
                key={idx}
                data-animate
                id={`testi-${idx}`}
                className={`glass flex flex-col rounded-3xl border border-white/10 p-7 transition-all duration-700 hover:border-white/20 ${isVisible[`testi-${idx}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <Quote className="h-8 w-8 text-blue-400/40" />
                <p className="mt-4 flex-1 leading-relaxed text-gray-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.g} font-semibold`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="relative z-10 px-6 py-28">
        <div
          data-animate
          id="cta-section"
          className={`mx-auto max-w-5xl transition-all duration-1000 ${isVisible['cta-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-cyan-500/15 px-8 py-16 text-center md:px-16 md:py-20">
            <div className="animate-glow absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="animate-glow absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl [animation-delay:-2s]" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-200">Join the movement</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
                Ready to make{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">an impact?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
                Join thousands of students building a stronger, more supportive community. Your next act of
                kindness starts here.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate('/signup')}
                  className="group relative overflow-hidden rounded-2xl bg-blue-600 px-10 py-5 text-lg font-bold shadow-xl shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-bold backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                >
                  Sign In
                </button>
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-gray-400">
                {['No credit card required', 'University verified', '100% secure'].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section id="contact" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
              <Mail className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">Get in touch</span>
            </div>
            <h2 className="font-display text-4xl font-bold md:text-5xl">Contact us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="glass rounded-3xl border border-white/10 p-8 md:p-12">
            {submitStatus === 'success' && (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-600/30 bg-green-600/20 p-4 text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <span>Thank you! We'll get back to you soon.</span>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 rounded-xl border border-red-600/30 bg-red-600/20 p-4 text-red-300">
                Something went wrong. Please try again.
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setTimeout(() => {
                  setSubmitStatus('success');
                  setIsSubmitting(false);
                  setContactForm({ name: '', email: '', message: '' });
                  setTimeout(() => setSubmitStatus(null), 5000);
                }, 1000);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">Your Message</label>
                <textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows="5"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-8 py-3.5 text-lg font-semibold shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600/50 md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative flex items-center gap-2">
                        Send Message
                        <Send className="h-5 w-5" />
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="h-10 w-10" />
                <span className="font-display text-xl font-bold text-white">Hela Fund</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
                A micro help &amp; support platform helping university students find lost items, fund small
                needs, and build a stronger community.
              </p>
            </div>
            <div>
              <h4 className="font-display mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Platform</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#how" className="transition-colors hover:text-white">How it works</a></li>
                <li><a href="#impact" className="transition-colors hover:text-white">Impact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Get started</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><button onClick={() => navigate('/signup')} className="transition-colors hover:text-white">Create account</button></li>
                <li><button onClick={() => navigate('/login')} className="transition-colors hover:text-white">Sign in</button></li>
                <li><a href="#contact" className="transition-colors hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-gray-500 md:flex-row">
            <span>© 2026 Hela Fund. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
