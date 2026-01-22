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
  Award
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsAnimated) return;

      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [statsAnimated, end, duration]);

    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold text-white">
              Hela Fund
            </span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-600/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 backdrop-blur-sm border border-blue-600/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Empowering Student Communities</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-slide-up">
            <span className="text-white">
              Help Each Other.
            </span>
            <br />
            <span className="text-blue-400">Build Together.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
            A micro help & support platform where university students can find lost items, 
            fund small needs, and build a stronger community through trust and collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
            <button 
              onClick={() => navigate('/signup')}
              className="group px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              <span className="flex items-center gap-2 justify-center">
                Start Helping Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Floating cards preview */}
        <div className="max-w-7xl mx-auto mt-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
            {[
              { icon: Search, title: "Lost & Found", color: "bg-blue-600" },
              { icon: HandHeart, title: "Micro-Funding", color: "bg-slate-700" },
              { icon: Users, title: "Community Help", color: "bg-teal-600" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">Quick access to community support</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-animate id="features-header">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-white">
                Everything You Need
              </span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-100 ${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Powerful features designed to make helping and getting help seamless
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: Search,
                title: "Lost & Found Network",
                description: "Instantly connect with students who found or lost items on campus. Real-time notifications and verified matches.",
                gradient: "from-blue-600/10 to-blue-600/5",
                iconColor: "bg-blue-600",
                features: ["Real-time alerts", "Campus-wide reach", "Photo verification"]
              },
              {
                icon: HandHeart,
                title: "Micro-Funding Support",
                description: "Request or provide small financial help for books, meals, or emergencies. Transparent and secure.",
                gradient: "from-slate-700/10 to-slate-700/5",
                iconColor: "bg-slate-700",
                features: ["Secure payments", "Transparent tracking", "Quick disbursement"]
              },
              {
                icon: Users,
                title: "Community Help Hub",
                description: "Get academic help, ride sharing, study groups, and more. Build meaningful connections.",
                gradient: "from-teal-600/10 to-teal-600/5",
                iconColor: "bg-teal-600",
                features: ["Study partners", "Skill sharing", "Event coordination"]
              },
              {
                icon: Shield,
                title: "Trust & Verification",
                description: "University-verified profiles, ratings, and secure transactions ensure safety and reliability.",
                gradient: "from-emerald-600/10 to-emerald-600/5",
                iconColor: "bg-emerald-600",
                features: ["ID verification", "Rating system", "Secure platform"]
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                data-animate
                id={`feature-${idx}`}
                className={`group p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer ${isVisible[`feature-${idx}`] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-xl`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.features.map((item, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-sm border border-white/10 text-gray-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Storytelling Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-animate id="story-content">
              <div className={`transition-all duration-1000 ${isVisible['story-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
                  <HeartHandshake className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Our Mission</span>
                </div>
                <h2 className="text-5xl font-bold mb-6 leading-tight">
                  Building a Culture of
                  <span className="text-blue-400"> Mutual Support</span>
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  University life is full of small challenges. A lost ID, emergency book money, 
                  or finding a study partner. Hela Fund makes solving these problems effortless 
                  through the power of community.
                </p>
                <div className="space-y-4">
                  {[
                    "Connect with verified students instantly",
                    "Build trust through transparent interactions",
                    "Create lasting impact with small acts of kindness"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <span className="text-gray-400 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div data-animate id="story-visual" className={`relative transition-all duration-1000 delay-300 ${isVisible['story-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] blur-3xl" />
                <div className="relative grid grid-cols-2 gap-6 p-8">
                  {[
                    { icon: Search, label: "Lost Items Found", value: "1000+", color: "bg-blue-600" },
                    { icon: HandHeart, label: "Funds Raised", value: "LKR 2M+", color: "bg-slate-700" },
                    { icon: Users, label: "Active Students", value: "12K+", color: "bg-teal-600" },
                    { icon: HeartHandshake, label: "Acts of Help", value: "8.7K+", color: "bg-emerald-600" }
                  ].map((stat, idx) => (
                    <div 
                      key={idx}
                      className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20" data-animate id="how-header">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible['how-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-white">
                How It Works
              </span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-100 ${isVisible['how-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Getting help or helping others is just a few clicks away
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-blue-600/20 hidden lg:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description: "Create your account with university email verification",
                  icon: Users,
                  color: "bg-blue-600"
                },
                {
                  step: "02",
                  title: "Post or Browse",
                  description: "Create a request or browse existing community needs",
                  icon: Search,
                  color: "bg-slate-700"
                },
                {
                  step: "03",
                  title: "Connect",
                  description: "Match with verified students and communicate securely",
                  icon: HeartHandshake,
                  color: "bg-teal-600"
                },
                {
                  step: "04",
                  title: "Complete",
                  description: "Fulfill the request and build your trust score",
                  icon: Award,
                  color: "bg-emerald-600"
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  data-animate
                  id={`step-${idx}`}
                  className={`relative transition-all duration-1000 ${isVisible[`step-${idx}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="relative group">
                    {/* Step number */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-all z-10">
                      <span className="text-blue-400">
                        {step.step}
                      </span>
                    </div>
                    
                    <div className="mt-12 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer min-h-[280px] flex flex-col">
                      <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-xl`}>
                        <step.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section ref={statsRef} className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="p-12 rounded-[3rem] bg-blue-600/5 backdrop-blur-xl border border-white/10 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Real-Time Impact</span>
                </div>
                <h2 className="text-5xl font-bold mb-4">
                  <span className="text-white">
                    Making a Difference Together
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Every day, students help each other succeed</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { value: 15000, suffix: "+", label: "Active Students", icon: Users },
                  { value: 3500, suffix: "+", label: "Requests Fulfilled", icon: CheckCircle2 },
                  { value: 98, suffix: "%", label: "Success Rate", icon: TrendingUp },
                  { value: 24, suffix: "h", label: "Avg Response Time", icon: Clock }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center group cursor-pointer">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-all shadow-xl">
                        <stat.icon className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold mb-2 text-blue-400">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div data-animate id="cta-section" className={`transition-all duration-1000 ${isVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Join the Movement</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Ready to Make
              <br />
              <span className="text-blue-400">
                an Impact?
              </span>
            </h2>
            
            <p className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who are building a stronger, more supportive 
              community. Your next act of kindness starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => navigate('/signup')}
                className="group px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-bold text-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
              >
                <span className="flex items-center gap-2 justify-center">
                  Get Started Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 font-bold text-xl"
              >
                Sign In
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>University verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>100% secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-white">
                Hela Fund
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 Hela Fund. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
