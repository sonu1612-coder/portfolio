import React, { useEffect, useRef, useState } from 'react';
import { Globe, ArrowRight, Mail, Phone, Sparkles, Terminal, Cpu, Code, Coffee, Layers } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import profilePic from './assets/profile.png';
import faceEmotionPic from './assets/face_emotion_detection.png';
import carbonFootprintPic from './assets/carbon_footprint.png';
import {
  getProfile,
  getServices,
  getProjects,
  type ProfileData,
  type ServiceData,
  type ProjectData,
} from './sanity';

// --- INLINE SVGS FOR BRAND ICONS (Lucide v1.x fallback) ---
const Instagram: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// --- REUSABLE COMPONENTS ---

// 1. ContactButton Component - Opens mailto
const ContactButton: React.FC<{ email?: string }> = ({ email = 'dakshchoudhary160@gmail.com' }) => (
  <a
    href={`mailto:${email}`}
    style={{
      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      outline: '2px solid white',
      outlineOffset: '-3px',
    }}
    className="rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 inline-block text-center"
  >
    Contact Me
  </a>
);

// 2. LiveProjectButton Component
const LiveProjectButton: React.FC<{ href?: string }> = ({ href = '#' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 cursor-pointer transition-colors duration-200 inline-block text-center"
  >
    Live Project
  </a>
);

// 3. FadeIn Component using motion.create()
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
}) => {
  const MotionComponent = motion.create(as as any);

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

// 4. Magnet Component (mouse-following magnetic hover effect)
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');
  const [transition, setTransition] = useState('');

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const isWithinBounds =
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;

    if (isWithinBounds) {
      const x = distanceX / strength;
      const y = distanceY / strength;
      setTransform(`translate3d(${x}px, ${y}px, 0px)`);
      setTransition(activeTransition);
    } else {
      setTransform('translate3d(0px, 0px, 0px)');
      setTransition(inactiveTransition);
    }
  };

  const handleMouseLeave = () => {
    setTransform('translate3d(0px, 0px, 0px)');
    setTransition(inactiveTransition);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
};

// 5. AnimatedText Component (Character-by-character scroll reveal)
const Character: React.FC<{
  progress: any;
  range: [number, number];
  children: string;
}> = ({ progress, range, children }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block whitespace-pre">
      <span className="opacity-20">{children}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {children}
      </motion.span>
    </span>
  );
};

const AnimatedText: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');

  return (
    <p
      ref={ref}
      className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] text-[clamp(1rem,2vw,1.35rem)]"
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, cIdx) => {
            const charIdx = words.slice(0, wIdx).join('').length + cIdx;
            const totalChars = words.join('').length;
            const start = charIdx / totalChars;
            const end = (charIdx + 1) / totalChars;
            return (
              <Character key={cIdx} progress={scrollYProgress} range={[start, end]}>
                {char}
              </Character>
            );
          })}
          {/* Add space between words */}
          {wIdx < words.length - 1 && (
            <Character
              progress={scrollYProgress}
              range={[
                (words.slice(0, wIdx + 1).join('').length) / words.join('').length,
                (words.slice(0, wIdx + 1).join('').length + 1) / words.join('').length,
              ]}
            >
              {' '}
            </Character>
          )}
        </span>
      ))}
    </p>
  );
};

// --- CINEMATIC HERO SECTION (PAGE 1) ---
const CinematicHero: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  const startFade = (targetOpacity: number, duration: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const video = videoRef.current;
    if (!video) return;
    const initialOpacity = parseFloat(video.style.opacity || '0');
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newOpacity = initialOpacity + (targetOpacity - initialOpacity) * progress;
      video.style.opacity = newOpacity.toString();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= 0.55 && !fadingOutRef.current) {
      fadingOutRef.current = true;
      startFade(0, 500);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Swipe down transition (scroll to next section smoothly)
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });

    video.style.opacity = '0';
    setTimeout(() => {
      video.currentTime = 0;
      video.play()
        .then(() => {
          fadingOutRef.current = false;
          startFade(1, 500);
        })
        .catch((err) => console.log('Video error:', err));
    }, 1000);
  };

  const handlePlay = () => {
    if (!fadingOutRef.current) {
      startFade(1, 500);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.style.opacity = '0';
      video.play()
        .then(() => startFade(1, 500))
        .catch((err) => {
          console.log('Autoplay waiting/blocked:', err);
          video.style.opacity = '1'; // Ensure it's not a black screen if autoplay fails
        });
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-between select-none">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none"
        src="/my_video.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={handlePlay}
      />
      <nav className="relative z-20 px-6 py-6 w-full">
        <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <Globe className="w-6 h-6 text-white" />
              <span>{profile.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'About'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors text-sm font-medium"
            >
              GitHub
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </nav>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <div className="relative group mb-6">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-md group-hover:bg-white/20 transition-all duration-300 pointer-events-none" />
          <img
            src={profile.profilePicture || profilePic}
            alt="User Profile"
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h1
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
        >
          {profile.heroTitle}
        </h1>
        <div className="max-w-xl w-full space-y-4 flex flex-col items-center">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 text-base"
            />
            <button className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors flex items-center justify-center cursor-pointer shrink-0">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/60 text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>
          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-2">
            Manifesto
          </button>
        </div>
      </main>
      <footer className="relative z-10 flex justify-center gap-4 pb-12 w-full">
        {[
          { Icon: Github, label: 'GitHub', href: profile.githubUrl },
          { Icon: Linkedin, label: 'LinkedIn', href: profile.linkedinUrl },
          { Icon: Instagram, label: 'Instagram', href: profile.instagramUrl },
          { Icon: Globe, label: 'Website', href: '#website' },
        ].map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
          >
            <Icon className="w-5.5 h-5.5 text-white" />
          </a>
        ))}
      </footer>
    </div>
  );
};

// --- DAKSH'S HERO SECTION ---
const DakshHero: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  return (
    <section className="relative min-h-screen bg-[#0C0C0C] flex flex-col justify-between overflow-hidden group">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full">
        <nav className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 w-full z-30 relative">
          <span className="text-[#D7E2EA] font-semibold text-lg tracking-wider">{profile.name.toUpperCase()}</span>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            {['About', 'Services', 'Projects', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#daksh-${link.toLowerCase()}`}
                className="text-[#D7E2EA] text-xs sm:text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      {/* Main Content (Heading + Portrait) */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-10 w-full z-10 relative mt-8 sm:mt-12">
        <div className="overflow-hidden w-full flex justify-center mb-6 sm:mb-10">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none text-center select-none text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[10vw] w-full break-words">
              Hi, i&apos;m {profile.name.toLowerCase()}
            </h1>
          </FadeIn>
        </div>
        
        <FadeIn delay={0.6} y={30} className="z-20 w-[200px] sm:w-[260px] md:w-[320px] lg:w-[360px]">
          <Magnet padding={100} strength={3}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              src={profile.profilePicture || profilePic}
              alt={`${profile.name} Portrait`}
              className="w-full rounded-2xl border-4 border-[#D7E2EA]/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] object-cover pointer-events-auto select-none cursor-pointer transition-transform duration-300"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 pt-10 flex flex-col sm:flex-row items-center sm:items-end justify-between z-30 relative gap-6 sm:gap-0">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-center sm:text-left text-[clamp(0.75rem,1.4vw,1.5rem)] max-w-[280px] sm:max-w-[220px] md:max-w-[320px]">
            {profile.heroDescription}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton email={profile.email} />
        </FadeIn>
      </div>
    </section>
  );
};

// 2. MarqueeSection Component
const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const currentOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const row1Images = [
    'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
    'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
    'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
    'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
    'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
    'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
    'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  ];

  const row2Images = [
    'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
    'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
    'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
    'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
  ];

  const tripledRow1 = [...row1Images, ...row1Images, ...row1Images];
  const tripledRow2 = [...row2Images, ...row2Images, ...row2Images];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 relative z-10"
    >
      <div
        className="flex gap-3 whitespace-nowrap"
        style={{
          transform: `translateX(${offset - 200}px)`,
          willChange: 'transform',
        }}
      >
        {tripledRow1.map((url, i) => (
          <img
            key={`row1-${i}`}
            src={url}
            alt="Marquee Item"
            className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 select-none pointer-events-none"
            loading="lazy"
          />
        ))}
      </div>
      <div
        className="flex gap-3 whitespace-nowrap"
        style={{
          transform: `translateX(${-(offset - 200)}px)`,
          willChange: 'transform',
        }}
      >
        {tripledRow2.map((url, i) => (
          <img
            key={`row2-${i}`}
            src={url}
            alt="Marquee Item"
            className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 select-none pointer-events-none"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
};

// 3. AboutSection Component
const AboutSection: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  return (
    <section
      id="daksh-about"
      className="relative min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 z-10 overflow-hidden"
    >
      {/* Decorative 3D Images */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none select-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon Icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] object-contain"
        />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none select-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="3D Object"
          className="w-[100px] sm:w-[140px] md:w-[180px] object-contain"
        />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none select-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego Icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] object-contain"
        />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none select-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D Group"
          className="w-[130px] sm:w-[170px] md:w-[220px] object-contain"
        />
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 z-10 w-full">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
            About me
          </h2>
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 w-full">
          <AnimatedText text={profile.aboutText} />
          <FadeIn delay={0.2} y={20}>
            <ContactButton email={profile.email} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// 4. ServicesSection Component (Personalized for Daksh)
const ServicesSection: React.FC<{ services: ServiceData[] }> = ({ services }) => {
  return (
    <section id="daksh-services" className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-20 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <FadeIn delay={0}>
          <h2 className="text-[#0C0C0C] font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28">
            Services
          </h2>
        </FadeIn>
        <div className="w-full border-t border-[#0C0C0C]/15">
          {services.map((svc, i) => (
            <FadeIn key={svc.num + '-' + i} delay={i * 0.1} y={30} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[#0C0C0C]/15 gap-4 sm:gap-10">
                <span className="font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)] leading-none select-none">
                  {svc.num}
                </span>
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)]">
                    {svc.name}
                  </h3>
                  <p className="font-light leading-relaxed text-[#0C0C0C] opacity-60 max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)]">
                    {svc.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4.5 SkillsSection Component (Personalized for Daksh)
interface SkillData {
  name: string;
  category: string;
  desc: string;
  badge: string;
  icon: React.ComponentType<any>;
  color: string;
  glowColor: string;
}

const skillsList: SkillData[] = [
  {
    name: "AI-Assisted Engineering",
    category: "Vibe Coding & Prompts",
    badge: "AI-Powered",
    desc: "Leveraging advanced language models to accelerate project prototyping, code generation, and iterative problem-solving. Maximizing development velocity through agentic workflows.",
    icon: Sparkles,
    color: "from-purple-500 via-pink-500 to-red-500",
    glowColor: "rgba(236, 72, 153, 0.15)",
  },
  {
    name: "Python",
    category: "Languages",
    badge: "Core Development",
    desc: "Writing clean, efficient scripts for automation, data processing, and backend logic. Experienced in rapid API integrations and developing utility tools.",
    icon: Terminal,
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.15)",
  },
  {
    name: "C Language",
    category: "Languages",
    badge: "Systems & Fundamentals",
    desc: "Understanding computer architecture, hardware-software interaction, memory management, and pointers. Solid foundation in code execution efficiency.",
    icon: Cpu,
    color: "from-indigo-500 to-purple-600",
    glowColor: "rgba(99, 102, 241, 0.15)",
  },
  {
    name: "C++",
    category: "Languages",
    badge: "Systems & OOP",
    desc: "Implementing object-oriented design and modular components. Utilizing C++ structure for performance-driven system concepts.",
    icon: Code,
    color: "from-blue-600 to-indigo-600",
    glowColor: "rgba(79, 70, 229, 0.15)",
  },
  {
    name: "Java",
    category: "Languages",
    badge: "Object-Oriented (Foundational)",
    desc: "A solid grasp of class structures, inheritance, polymorphism, and Java fundamentals. Building multi-platform software prototypes.",
    icon: Coffee,
    color: "from-orange-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.15)",
  },
  {
    name: "HTML",
    category: "Web Frontend",
    badge: "Semantic Markup (Foundational)",
    desc: "Designing the foundation of web pages with structured, accessible HTML tags. Ensuring search-engine-optimized and responsive layout outlines.",
    icon: Layers,
    color: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.15)",
  },
];

const SkillsSection: React.FC = () => {
  return (
    <section
      id="daksh-skills"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-20 relative px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <FadeIn delay={0}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,12vw,160px)] mb-6">
            Skills
          </h2>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <p className="text-[#D7E2EA]/50 text-center font-light uppercase tracking-widest text-[clamp(0.7rem,1.5vw,1rem)] mb-16 max-w-lg mx-auto leading-relaxed">
            Translating core programming logic and modern AI workflows into high-performance software
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
          {skillsList.map((skill, i) => (
            <FadeIn key={skill.name + '-' + i} delay={i * 0.1} y={35} className="h-full">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative group rounded-3xl p-6 md:p-8 bg-[#141414] border border-[#D7E2EA]/10 overflow-hidden flex flex-col justify-between h-full hover:border-[#D7E2EA]/20 transition-colors duration-300"
                style={{
                  boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.7)'
                }}
              >
                {/* Background glow effect on hover */}
                <div 
                  className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at center, ${skill.glowColor}, transparent 70%)`
                  }}
                />
                
                <div className="relative z-10">
                  {/* Header with Icon and Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${skill.color} text-white shadow-lg`}>
                      <skill.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider text-[#D7E2EA]/40 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {skill.badge}
                    </span>
                  </div>

                  {/* Skill Details */}
                  <span className="text-[#D7E2EA]/40 text-xs uppercase tracking-widest block mb-1">
                    {skill.category}
                  </span>
                  <h3 className="text-[#D7E2EA] font-bold text-xl sm:text-2xl mb-3 tracking-wide group-hover:text-white transition-colors duration-300">
                    {skill.name}
                  </h3>
                  <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm sm:text-base">
                    {skill.desc}
                  </p>
                </div>

                {/* Accent Footer Bar */}
                <div className={`h-1.5 w-0 group-hover:w-full bg-gradient-to-r ${skill.color} absolute bottom-0 left-0 transition-all duration-300 rounded-b-3xl`} />
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. ProjectsSection Component (Personalized for Daksh)
const ProjectCard: React.FC<{
  index: number;
  project: any;
  range: [number, number];
  targetScale: number;
  progress: any;
}> = ({ index, project, range, targetScale, progress }) => {
  const scale = useTransform(progress, range, [1, targetScale]);
  const hasMultipleImages = !!(project.img1 && project.img2);

  return (
    <div
      className="sticky w-full h-[85vh] flex items-center justify-center top-24 md:top-32"
      style={{
        top: `${index * 28}px`,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between w-full border-b border-[#D7E2EA]/10 pb-4 md:pb-6 gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <span className="font-black text-[#D7E2EA] text-3xl sm:text-4xl md:text-5xl leading-none">
              {project.num}
            </span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA]/50 uppercase tracking-widest text-[10px] sm:text-xs">
                {project.category}
              </span>
              <h3 className="text-[#D7E2EA] uppercase font-bold text-sm sm:text-lg md:text-2xl tracking-wide">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.link} />
        </div>
        <div className="flex-1 w-full mt-4 md:mt-6 overflow-hidden">
          {hasMultipleImages ? (
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
              <div className="md:col-span-2 flex flex-col gap-3 h-full overflow-hidden">
                <img
                  src={project.img1}
                  alt="Project Image 1"
                  className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover h-[clamp(130px,16vw,230px)] shadow-lg"
                />
                <img
                  src={project.img2}
                  alt="Project Image 2"
                  className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover flex-1 h-[clamp(160px,22vw,340px)] shadow-lg"
                />
              </div>
              <div className="md:col-span-3 h-full overflow-hidden">
                <img
                  src={project.img3}
                  alt="Project Image 3"
                  className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover shadow-lg"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              <img
                src={project.img3}
                alt="Project Screenshot"
                className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover object-top shadow-lg"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC<{ projects: ProjectData[] }> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      id="daksh-projects"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-20 relative px-5 sm:px-8 md:px-10 py-20 pb-20"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <FadeIn delay={0}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,12vw,160px)] mb-16">
            Projects
          </h2>
        </FadeIn>
        <div className="w-full flex flex-col gap-24 relative mt-10">
          {projects.map((proj, i) => {
            const targetScale = 1 - (projects.length - 1 - i) * 0.03;
            const range = [i * 0.25, 1] as [number, number];
            return (
              <ProjectCard
                key={proj.name + '-' + i}
                index={i}
                project={proj}
                range={range}
                targetScale={targetScale}
                progress={scrollYProgress}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- DAKSH'S CONTACT & FOOTER SECTION ---
const ContactFooterSection: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  return (
    <section
      id="daksh-contact"
      className="bg-[#0C0C0C] relative z-20 px-6 py-20 border-t border-[#D7E2EA]/10"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-12">
        <FadeIn delay={0} y={30}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,120px)]">
            Get In Touch
          </h2>
        </FadeIn>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl text-left">
          <FadeIn delay={0.15} y={20}>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-4 p-6 rounded-3xl border border-[#D7E2EA]/10 hover:border-[#D7E2EA]/30 hover:bg-white/5 transition-all duration-300"
            >
              <div className="bg-[#D7E2EA]/10 p-4 rounded-2xl text-[#D7E2EA]">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#D7E2EA]/40 text-xs uppercase tracking-wider">Email</span>
                <span className="text-[#D7E2EA] font-semibold text-sm sm:text-base break-all">
                  {profile.email}
                </span>
              </div>
            </a>
          </FadeIn>

          <FadeIn delay={0.25} y={20}>
            <a
              href={`tel:${profile.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-4 p-6 rounded-3xl border border-[#D7E2EA]/10 hover:border-[#D7E2EA]/30 hover:bg-white/5 transition-all duration-300"
            >
              <div className="bg-[#D7E2EA]/10 p-4 rounded-2xl text-[#D7E2EA]">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#D7E2EA]/40 text-xs uppercase tracking-wider">Phone</span>
                <span className="text-[#D7E2EA] font-semibold text-sm sm:text-base">
                  {profile.phone}
                </span>
              </div>
            </a>
          </FadeIn>
        </div>

        {/* Social Profile links */}
        <div className="flex items-center gap-4 mt-4">
          {[
            { Icon: Github, label: 'GitHub', href: profile.githubUrl },
            { Icon: Linkedin, label: 'LinkedIn', href: profile.linkedinUrl },
            { Icon: Instagram, label: 'Instagram', href: profile.instagramUrl },
            { Icon: Twitter, label: 'Twitter', href: profile.twitterUrl || '#twitter' },
          ].map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="liquid-glass rounded-full p-4 text-[#D7E2EA] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center shadow-lg"
            >
              <Icon className="w-5.5 h-5.5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <FadeIn delay={0.35} y={10}>
          <span className="text-[#D7E2EA]/30 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} {profile.name.toUpperCase()}. ALL RIGHTS RESERVED.
          </span>
        </FadeIn>
      </div>
    </section>
  );
};

// --- DEFAULT FALLBACK DATA ---
const defaultProfile: ProfileData = {
  name: 'Daksh',
  heroTitle: 'Built for the curious',
  heroDescription: 'a developer & content creator driven by crafting modern web solutions and passionate about AI',
  aboutText: "With more than five years of experience in development and content creation, i focus on web applications, AI integration, and sharing coding tutorials. I truly enjoy building systems that leverage artificial intelligence to solve real-world problems. Let's create something incredible together!",
  email: 'dakshchoudhary160@gmail.com',
  phone: '+91 80823 27782',
  profilePicture: profilePic,
  githubUrl: 'https://github.com/sonu1612-coder',
  linkedinUrl: 'https://www.linkedin.com/in/daksh-choudhary-a56a6b320/',
  instagramUrl: 'https://www.instagram.com/daksh.331/',
  twitterUrl: '#twitter',
};

const defaultServices: ServiceData[] = [
  {
    num: '01',
    name: 'Web Development',
    desc: 'Building responsive, modern, and high-performance web applications using React, TypeScript, and Tailwind CSS.',
  },
  {
    num: '02',
    name: 'AI Integration',
    desc: 'Leveraging large language models and AI APIs to build intelligent agents, chatbots, and automation workflows.',
  },
  {
    num: '03',
    name: 'Content Creation',
    desc: 'Producing programming tutorials, technical articles, and developer education content to share knowledge with the community.',
  },
  {
    num: '04',
    name: 'UI/UX Design',
    desc: 'Designing intuitive and clean user interfaces that ensure smooth and accessible user experiences.',
  },
  {
    num: '05',
    name: 'Open Source',
    desc: 'Contributing to developer tooling, libraries, and collaborating with global creators on GitHub.',
  },
];

const defaultProjects: ProjectData[] = [
  {
    num: '01',
    category: 'Computer Vision & AI',
    name: 'Face & Emotion Detection',
    link: 'https://github.com/sonu1612-coder',
    img1: '',
    img2: '',
    img3: faceEmotionPic,
  },
  {
    num: '02',
    category: 'Sustainability & Analytics',
    name: 'Carbon Footprint Calculator',
    link: 'https://github.com/sonu1612-coder',
    img1: '',
    img2: '',
    img3: carbonFootprintPic,
  },
];

// --- MAIN APP ---
function App() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [services, setServices] = useState<ServiceData[]>(defaultServices);
  const [projects, setProjects] = useState<ProjectData[]>(defaultProjects);

  useEffect(() => {
    document.title = `${profile.name} -- Developer & Content Creator`;
  }, [profile.name]);

  useEffect(() => {
    const fetchCMSData = async () => {
      const cmsProfile = await getProfile();
      if (cmsProfile) {
        setProfile((prev) => ({
          ...prev,
          ...cmsProfile,
          profilePicture: cmsProfile.profilePicture || prev.profilePicture,
        }));
      }

      const cmsServices = await getServices();
      if (cmsServices && cmsServices.length > 0) {
        setServices(cmsServices);
      }

      const cmsProjects = await getProjects();
      if (cmsProjects && cmsProjects.length > 0) {
        const filteredCMS = cmsProjects.filter(
          (p) =>
            !p.name.includes("AI Agent") &&
            !p.name.includes("DevEdu") &&
            !p.name.includes("CLI")
        );
        setProjects([...defaultProjects, ...filteredCMS]);
      } else {
        setProjects(defaultProjects);
      }
    };

    fetchCMSData();
  }, []);

  return (
    <div style={{ overflowX: 'clip' }} className="w-full bg-[#0C0C0C] relative">
      <CinematicHero profile={profile} />
      <DakshHero profile={profile} />
      <MarqueeSection />
      <AboutSection profile={profile} />
      <ServicesSection services={services} />
      <SkillsSection />
      <ProjectsSection projects={projects} />
      <ContactFooterSection profile={profile} />
    </div>
  );
}

export default App;
