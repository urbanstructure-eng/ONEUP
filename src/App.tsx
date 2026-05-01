/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, animate } from 'motion/react';
import { Instagram, Twitter, Linkedin, ChevronUp, X, ChevronLeft, ChevronRight, Send, ArrowUpRight, Smile, Menu, Play, Pause } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  heroImage?: string;
  colSpan: string;
  contain?: boolean;
  location?: string;
  year?: string;
  role?: string;
}

const PROJECTS: Project[] = [
  { id: 11, title: "Voltique", category: "Service Design", image: "https://lh3.googleusercontent.com/d/1gusf69CAd1am1JcsIyc1qiGekzmZLEUP", colSpan: "md:col-span-12", year: "2024", role: "Lead Design" },
  { id: 12, title: "Pulso Health", category: "AI Health / Branding", image: "https://lh3.googleusercontent.com/d/1ONCooNfgYuYu5trUJrFZcZq1HxYSFZrr", colSpan: "md:col-span-4", year: "2023", role: "Brand Identity" },
  { id: 13, title: "BuyDrop", category: "Logistic Company", image: "https://lh3.googleusercontent.com/d/1qpd246hL-TbgCSgf9j2qxBk15FMW2FuF", heroImage: "https://lh3.googleusercontent.com/d/1nZNLMGhECM67AST6qbGCmYiXUhN0RF-C", colSpan: "md:col-span-4", year: "2024", role: "Creative Direction" },
  { id: 14, title: "UNITY Community Hub", category: "Community / Branding", image: "https://lh3.googleusercontent.com/d/1SaZAxfG-M0ouGb0w0wCRxmzKQ3U8S5uT", heroImage: "https://lh3.googleusercontent.com/d/1zBFr8LhCxzjxucFpkMMXeekayY2JLk9g", colSpan: "md:col-span-4", year: "2024", role: "Lead Design" },
  { id: 15, title: "Atelier d'art", category: "Art Direction / Branding", image: "https://lh3.googleusercontent.com/d/1sAcH9tLsKt9mXswTCynb7bnRcS5qAYJT", colSpan: "md:col-span-12", location: "Paris, France", year: "2024", role: "Art Direction" },
  { id: 16, title: "edere restaurant", category: "Branding / Environment", image: "https://lh3.googleusercontent.com/d/19Gt0niVC8EL5JdpHNmsRdCLTrBeeIbcu", colSpan: "md:col-span-12", location: "Rome, Italy", year: "2022", role: "Project Identity" },
  { id: 3, title: "Padelux", category: "Branding", image: "https://lh3.googleusercontent.com/d/1l4lV4DJ1v17tOBJxEC3l32mjxqTjTdH-", colSpan: "md:col-span-6", year: "2023", role: "Identity Design" },
  { id: 17, title: "Insurly", category: "Insurance / Platform", image: "https://lh3.googleusercontent.com/d/1Pv55tjArCkD6pSyKqgpmqBrAsIUyZCgJ", colSpan: "md:col-span-6", year: "2024", role: "Branding Design for Global Insurance Provider" },
  { id: 18, title: "organic cosmetic", category: "Branding / Packaging", image: "https://lh3.googleusercontent.com/d/1DlAdlFYlYmujpUEC1uzvAu4EIc9uRiHu", colSpan: "md:col-span-12", year: "2021", role: "Creative Direction" },
  { id: 19, title: "Integrated Marketing Campaign", category: "campaign", image: "https://lh3.googleusercontent.com/d/1oHOYP6MO2Fadp1BhAKnP8iCwCaMsoBlZ", colSpan: "md:col-span-12", location: "UK, England", year: "2025", role: "Campaign Design" },
];

const SubtleMotionImage = ({ src, alt, className, objectPosition = "center", contain = false, cinematic = false }: { src: string, alt: string, className?: string, objectPosition?: string, contain?: boolean, cinematic?: boolean }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`${className} w-full h-full ${contain ? 'object-contain p-8' : 'object-cover'}`}
    style={{ objectPosition, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
    referrerPolicy="no-referrer"
    initial={{ opacity: 0, scale: cinematic ? 1.05 : 1 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: cinematic ? 2.5 : 1, ease: [0.22, 1, 0.36, 1] }}
  />
);

const CinematicScrollImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  return (
    <div className={`${className} overflow-hidden relative transform-gpu`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.1, x: "-2%", y: "-2%" }}
        animate={{ 
          scale: 1.18, 
          x: "2%",
          y: "2%" 
        }}
        transition={{ 
          duration: 25, 
          ease: "linear", 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transform-gpu"
      />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
    </div>
  );
};

const CompactVideoPlayer = ({ src, alt, className, useGif = false, onClick }: { src: string, alt: string, className?: string, useGif?: boolean, onClick?: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  
  // Extract YouTube ID
  const youtubeMatch = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/\S+|live\/))([^\?&"'>]+)/);
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null;
  const isYouTube = !!youtubeId && !useGif;

  const driveMatch = src.match(/[-\w]{25,}/);
  const driveId = src.includes('drive.google.com') && driveMatch ? driveMatch[0] : null;
  const isDrive = !!driveId && !useGif;

  // Load YouTube API
  useEffect(() => {
    if (isYouTube && !window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsAPIReady(true);
      };
    } else if (isYouTube && window.YT) {
      setIsAPIReady(true);
    }
  }, [isYouTube]);

  // Initialize YouTube Player
  useEffect(() => {
    if (isYouTube && isAPIReady && containerRef.current && !playerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          showinfo: 0,
          disablekb: 1,
          playsinline: 1,
          loop: 0 // We handle loop manually for "stay on last frame" effect
        },
        events: {
          onReady: (event: any) => {
            setIsLoaded(true);
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED is 0
            if (event.data === 0) {
              // Stay on last frame for 2 seconds then restart
              setTimeout(() => {
                if (playerRef.current) {
                  playerRef.current.seekTo(0);
                  playerRef.current.playVideo();
                }
              }, 2000);
            }
          }
        }
      });
    }

    return () => {
      if (playerRef.current) {
        // Cleaning up the player is important to prevent memory leaks and ghost audio
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.error("Error destroying YT player", e);
        }
      }
    };
  }, [isYouTube, isAPIReady, youtubeId]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube && playerRef.current) {
      const state = playerRef.current.getPlayerState();
      if (state === 1) { // 1 is Playing
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (isDrive) {
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center bg-black group overflow-hidden transform-gpu ${onClick ? 'cursor-zoom-in' : 'cursor-default'}`}
      onClick={onClick}
    >
      <div 
        className={`w-full h-full transition-opacity duration-1000 ${isYouTube || isDrive || isLoaded || useGif ? 'opacity-100' : 'opacity-0'}`}
      >
        {!error ? (
          useGif ? (
            <div className="absolute inset-0 bg-black">
              <img 
                src={src} 
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover transform-gpu scale-[1.01]"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : isYouTube ? (
            <div className="absolute inset-0 pointer-events-auto">
              <iframe
                src={`https://drive.google.com/file/d/${driveId}/preview?autoplay=1&mute=1`}
                className="w-full h-full border-none"
                allow="autoplay; encrypted-media"
                onLoad={() => setIsLoaded(true)}
              />
              <div 
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={togglePlay}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              key={src}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsLoaded(true)}
              onError={() => setError(true)}
              className={`${className} w-full h-full object-cover`}
            >
              <source src={src} type="video/mp4" />
              <source src={src} type="video/webm" />
              <source src={src} type="video/ogg" />
            </video>
          )
        ) : (
          <motion.img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`${className} w-full h-full object-cover`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          onClick={togglePlay}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isPlaying ? 0 : 1,
            scale: isPlaying ? 0.8 : 1 
          }}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/20 group/btn opacity-0 group-hover:opacity-100 pointer-events-auto z-30"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-current" />
          ) : (
            <Play className="w-8 h-8 text-white fill-current translate-x-1" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const FullscreenPreloaderImage = ({ src, alt, onNext }: { src: string, alt: string, onNext: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none bg-black/90">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.4em] text-white/20 z-10">
          Preview unavailable
        </div>
      )}
      <motion.img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`max-w-[90vw] max-h-[90vh] object-contain shadow-2xl cursor-pointer rounded-2xl`}
        referrerPolicy="no-referrer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      />
    </div>
  );
};

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
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isFolding, setIsFolding] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Brand Identity',
    message: ''
  });

  const [lang, setLang] = useState<'en' | 'fr' | 'es'>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = {
    en: {
      nav: { work: 'work', services: 'services', about: 'about', contact: 'contact' },
      hero: {
        tag: 'Design & Technology Studio',
        title: 'Experimental Design<br />& Innovative Marketing',
        desc: 'oneup is an experimental graphic design studio crafting innovative marketing campaigns and digital experiences. We focus on distinctive visual identities for the modern market.',
        cta: 'Start a Project',
        scroll: 'Explore our design portfolio'
      },
      work: { tag: 'Portfolio', title: 'SELECTED WORK' },
      services: { 
        tag: 'Expertise', 
        title: 'SERVICES',
        items: [
          { title: "Brand Identity", desc: "Crafting unique visual languages that define your brand's essence and resonance." },
          { title: "Digital Design", desc: "Creating intuitive, high-performance interfaces for web and mobile platforms." },
          { title: "Art Direction", desc: "Leading the creative vision to ensure consistency and impact across all media." }
        ]
      },
      about: {
        tag: 'Experimental Approach',
        title: 'WE COMBINE <span className="text-accent">GRAPHIC DESIGN</span> AND MARKETING TO ELEVATE BRAND PRESENCE.',
        desc: 'Our experimental approach combines graphic design and marketing technology to engage audiences and elevate digital brand presence in today\'s competitive landscape.',
        points: ['Experimental Research', 'Aesthetic Precision', 'Marketing Strategy', 'Technical Excellence']
      },
      contact: {
        tag: 'Get in touch',
        title: "LET'S CREATE SOMETHING EXTRAORDINARY.",
        email: 'Email us',
        follow: 'Follow us'
      },
      modal: {
        category: 'Category',
        year: 'Year',
        role: 'Role',
        close: 'Close Project'
      },
      form: {
        tag: 'Inquiry',
        title: 'START A PROJECT',
        name: 'Name',
        namePlaceholder: 'Your Name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        phone: 'Phone (Optional)',
        phonePlaceholder: '+1 (555) 000-0000',
        service: 'Service',
        message: 'Message',
        messagePlaceholder: 'Tell us about your project...',
        submit: 'Send Inquiry',
        sending: 'Sending...',
        thankYou: 'THANK YOU',
        successMsg: 'Your inquiry has taken flight. We\'ll get back to you shortly.',
        close: 'Close Window'
      }
    },
    fr: {
      nav: { work: 'projets', services: 'services', about: 'à propos', contact: 'contact' },
      hero: {
        tag: 'Design & Technologie',
        title: 'EXPÉRIENCES DIGITALES INNOVANTES.',
        desc: 'Nous créons des expériences numériques innovantes adaptées au marché moderne, en nous concentrant sur des concepts expérimentaux et des stratégies de marque efficaces.',
        cta: 'Démarrer un Projet',
        scroll: 'Défiler pour explorer'
      },
      work: { tag: 'Portfolio', title: 'TRAVAUX SÉLECTIONNÉS' },
      services: { 
        tag: 'Expertise', 
        title: 'SERVICES',
        items: [
          { title: "Identité de Marque", desc: "Création de langages visuels uniques qui définissent l'essence et la résonance de votre marque." },
          { title: "Design Numérique", desc: "Création d'interfaces intuitives et performantes pour les plateformes web et mobiles." },
          { title: "Direction Artistique", desc: "Diriger la vision créative pour assurer la cohérence et l'impact sur tous les supports." }
        ]
      },
      about: {
        tag: 'Notre Approche',
        title: 'NOUS COMBINONS <span className="text-accent">CRÉATIVITÉ</span> ET TECHNOLOGIE POUR ÉLEVER VOTRE PRÉSENCE.',
        desc: 'Notre approche combine créativité et technologie pour engager les audiences et élever la présence de la marque dans un paysage concurrentiel.',
        points: ['Notre Approche', 'Axé sur la Recherche', 'Précision Esthétique', 'Excellence Technique']
      },
      contact: {
        tag: 'Contactez-nous',
        title: "CRÉONS QUELQUE CHOSE D'EXTRAORDINAIRE.",
        email: 'Écrivez-nous',
        follow: 'Suivez-nous'
      },
      modal: {
        category: 'Catégorie',
        year: 'Année',
        role: 'Rôle',
        close: 'Fermer le Projet'
      },
      form: {
        tag: 'Demande',
        title: 'DÉMARRER UN PROJET',
        name: 'Nom',
        namePlaceholder: 'Votre Nom',
        email: 'Email',
        emailPlaceholder: 'votre@email.com',
        phone: 'Téléphone (Optionnel)',
        phonePlaceholder: '+33 (0) 6 00 00 00 00',
        service: 'Service',
        message: 'Message',
        messagePlaceholder: 'Parlez-nous de votre projet...',
        submit: 'Envoyer la Demande',
        sending: 'Envoi en cours...',
        thankYou: 'MERCI',
        successMsg: 'Votre demande a pris son envol. Nous vous répondrons sous peu.',
        close: 'Fermer la Fenêtre'
      }
    },
    es: {
      nav: { work: 'proyectos', services: 'servicios', about: 'nosotros', contact: 'contacto' },
      hero: {
        tag: 'Diseño y Tecnología',
        title: 'EXPERIENCIAS DIGITALES INNOVADORAS.',
        desc: 'Creamos experiencias digitales innovadoras adaptadas al mercado moderno, centrándonos en conceptos experimentales y estrategias de marca efectivas.',
        cta: 'Iniciar un Proyecto',
        scroll: 'Deslizar para explorar'
      },
      work: { tag: 'Portafolio', title: 'TRABAJOS SELECCIONADOS' },
      services: { 
        tag: 'Experiencia', 
        title: 'SERVICIOS',
        items: [
          { title: "Identidad de Marca", desc: "Creación de lenguajes visuales únicos que definen la esencia y resonancia de su marca." },
          { title: "Diseño Digital", desc: "Creación de interfaces intuitivas y de alto rendimiento para plataformas web y móviles." },
          { title: "Dirección de Arte", desc: "Liderando la visión creativa para asegurar la consistencia y el impacto en todos los medios." }
        ]
      },
      about: {
        tag: 'Nuestra Filosofía',
        title: 'COMBINAMOS <span className="text-accent">CREATIVIDAD</span> Y TECNOLOGÍA PARA ELEVAR LA PRESENCIA DE MARCA.',
        desc: 'Nuestro enfoque combina creatividad y tecnología para involucrar a las audiencias y elevar la presencia de la marca en un panorama competitivo.',
        points: ['Nuestro Enfoque', 'Basado en la Investigación', 'Precisión Estética', 'Excelencia Técnica']
      },
      contact: {
        tag: 'Ponte en contacto',
        title: "CREEMOS ALGO EXTRAORDINARIO.",
        email: 'Envíanos un correo',
        follow: 'Síguenos'
      },
      modal: {
        category: 'Categoría',
        year: 'Año',
        role: 'Rol',
        close: 'Cerrar Proyecto'
      },
      form: {
        tag: 'Consulta',
        title: 'INICIAR UN PROYECTO',
        name: 'Nombre',
        namePlaceholder: 'Tu Nombre',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@email.com',
        phone: 'Teléfono (Opcional)',
        phonePlaceholder: '+1 (555) 000-0000',
        service: 'Servicio',
        message: 'Mensaje',
        messagePlaceholder: 'Cuéntanos sobre tu proyecto...',
        submit: 'Enviar Consulta',
        sending: 'Enviando...',
        thankYou: 'GRACIAS',
        successMsg: 'Tu consulta ha tomado vuelo. Nos pondremos en contacto contigo pronto.',
        close: 'Cerrar Ventana'
      }
    }
  };

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

  const getProjectImages = (project: typeof PROJECTS[0]) => {
    if (project.title === "Pulso Health") {
      return [
        project.image,
        "https://lh3.googleusercontent.com/d/1pWnjLekDDJw2nyvaITIkbyyYCyyVqhrN",
        "https://lh3.googleusercontent.com/d/1HV38KNGMYygGYoRFDoFe2P5v0By10sDC",
        "https://lh3.googleusercontent.com/d/1C9aaZv2jODy3L2G_f70176rmthMvJ7y9",
        "https://lh3.googleusercontent.com/d/1JclpfUaRLdnfi-Y8bFiYZjgMoumw4E_U",
        "https://lh3.googleusercontent.com/d/14dOgWst9Yy4S-uenpiuTiJSF5owIrT6M",
        "https://lh3.googleusercontent.com/d/16PjI9KDz2z6IFWutld9YKRkwVTNw5Htk",
        "https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez",
        "https://lh3.googleusercontent.com/d/1490HNQUNQowTbcizbN6YKqIw7YNr3gxG"
      ];
    }
    if (project.title === "Padelux") {
      return [
        project.image,
        "https://lh3.googleusercontent.com/d/1p6uNNFVC96xiAjRJvtsiCn3MhA330SpH",
        "https://lh3.googleusercontent.com/d/1fpYurGgn-hjRjtOVQN9bAVnEBKu_tkOD",
        "https://lh3.googleusercontent.com/d/126FAgbfA4FCK8e5Ym6OCZKgsoF5SKenI",
        "https://lh3.googleusercontent.com/d/1Zr9R_Z3bMjuCJo5xykDJIPVcxvgVeFar",
        "https://lh3.googleusercontent.com/d/169Pww9eoPuFuC3gU5bx9E02cOV7037zl",
        "https://lh3.googleusercontent.com/d/1KbD64ig98ArfbH_BLpk8aa_KtIWZ-rfv"
      ];
    }
    if (project.title === "Voltique") {
      return [
        project.image,
        "https://lh3.googleusercontent.com/d/18okrA2Rgsx9gzhggIOu89nuz6QcWu-Hi",
        "https://lh3.googleusercontent.com/d/1LP7r24WA012N3hkibYdehCPnKasGT4jB",
        "https://lh3.googleusercontent.com/d/1Ad-O2_nnkJHtfNLqVneCvzqufYPEpP-t",
        "https://lh3.googleusercontent.com/d/1C6c6M2Sf0EchjHqKsylmecO9Z__707lY",
        "https://lh3.googleusercontent.com/d/1tJkKFKLTwo-zkp6K_EVdVRz7rCviD-F0",
        "https://lh3.googleusercontent.com/d/1RYRWf7_CSv27PD95PfnPPKLs534PhOQD",
        "https://lh3.googleusercontent.com/d/1IbhBUuJuXIiKMGleLfoHvwAlE78GdwG_"
      ];
    }
    if (project.title === "BuyDrop") {
      return [
        project.heroImage || project.image,
        "https://lh3.googleusercontent.com/d/1qpd246hL-TbgCSgf9j2qxBk15FMW2FuF",
        "https://lh3.googleusercontent.com/d/1jxksiMAxUtLXBxGL8bNC7jcizLTyxXR0",
        "https://lh3.googleusercontent.com/d/1NV4L745ah-lWi0pZtmULvNTiJHefN6J9",
        "https://lh3.googleusercontent.com/d/16nVARSrN4RZielAgzspDx6mkKm6VUs_3",
        "https://lh3.googleusercontent.com/d/1rxQVm2VX7vOD1Z0HPFx7DgVC1s5iwzXH"
      ];
    }
    if (project.title === "UNITY Community Hub") {
      return [
        project.heroImage || project.image,
        project.image,
        "https://lh3.googleusercontent.com/d/11wP3BfkI3AFIZP49UH1WSwpXPZEvmHc6",
        "https://lh3.googleusercontent.com/d/1M-1AUscx9JJ7guyEjAeF1ziTjLxrnbWK",
        "https://lh3.googleusercontent.com/d/1JL_vUWyn2sn9wFsdgCnL-XekDbMnzJ4t",
        "https://lh3.googleusercontent.com/d/178fpIdVUsFAnFVgY89ztj_hRTVaxAWsw",
        "https://lh3.googleusercontent.com/d/18gqdiRXLF7McIOK9DyD33TilFTV1OwYX"
      ];
    }
    if (project.title === "Atelier d'art") {
      return [
        project.image,
        "https://lh3.googleusercontent.com/d/1osUANG5WeR0Ww3n_OQtdiaNXBxQLIA7f",
        "https://lh3.googleusercontent.com/d/1el8VLirLeFCbYzVJmjInCWc_1ndww9-9",
        "https://lh3.googleusercontent.com/d/16PMa4p6HKCfzF56Ny_JoEGR6OBJqU-Jj",
        "https://lh3.googleusercontent.com/d/1T9CIXul6wnGY6caACLxwvlW1gAR-EDzi"
      ];
    }
    if (project.title === "edere restaurant") {
      return [
        project.image, // Hero
        "https://lh3.googleusercontent.com/d/1k8q8V3zvS4uYnfp0s6unRNpWiaAbIqa9", // Sec 1
        "https://lh3.googleusercontent.com/d/1Lg4ePRrMplc3GDzN8ixUcuL9MbPwqBxg", // Sec 2
        "https://lh3.googleusercontent.com/d/19C-4W9Vpb5EgIzhZZO9jJB19_b10ejYO", // Sec 3
        "https://lh3.googleusercontent.com/d/1GY7keTnEI3Jayucac9QegpwS8rk-vOMJ", // Sec 4
        "https://lh3.googleusercontent.com/d/1Mux8yWx0pRNv-P3p1-92vHZH7nkO9rRh", // Sec 5
        "https://lh3.googleusercontent.com/d/19Gt0niVC8EL5JdpHNmsRdCLTrBeeIbcu", // Sec 6 (Same as Hero)
        "https://lh3.googleusercontent.com/d/1KswSnGMZRZkyOOaVJXWTKkUqWwdzxTqB", // Sec 7
        "https://lh3.googleusercontent.com/d/1xwwm8qTPTaFktoSelqGyTUz5tYsOCK7W", // Sec 8
        "https://lh3.googleusercontent.com/d/1nzAd11wQwe07yeFdZdSLS2-xexHfCIsa"  // Sec 9
      ];
    }
    if (project.title === "Insurly") {
      return [
        project.image,
        "https://lh3.googleusercontent.com/d/10Na1qqypVRFoARcL01kFD_mbdaZdQMP6",
        "https://lh3.googleusercontent.com/d/1TeSUFMoUj56pjCeP4PKvfrLC9QKIEnOg",
        "https://lh3.googleusercontent.com/d/1ZYz8F6REOrPju1PSGE42hzL-HcNck6Yh",
        "https://lh3.googleusercontent.com/d/1SMqz6HPzVZHCXfErDSBNVoJzHxltdPGY",
        "https://lh3.googleusercontent.com/d/1WhPpMX954NfJUF-1ncQ5VfV__3Ao7FbX",
        "https://lh3.googleusercontent.com/d/1-pLYowWBDuGOLikvx_Qow6PN1AuxJUJj",
        "https://lh3.googleusercontent.com/d/1m8koR6xj0qa1Ijn53Le5HUiT1SjQDZHW",
        "https://lh3.googleusercontent.com/d/1w_ctPlIrM484s3rr8ZT9hut7L-1QKE-3"
      ];
    }
    if (project.title === "organic cosmetic") {
      return [
        "https://lh3.googleusercontent.com/d/1DlAdlFYlYmujpUEC1uzvAu4EIc9uRiHu",
        "https://lh3.googleusercontent.com/d/1grDf1nKeXz2GbtfBFF0lyqSzyEY2Z7is",
        "https://lh3.googleusercontent.com/d/1EtZot-anCp8jl1iTfBOlQ6j7wD7nx2q9",
        "https://lh3.googleusercontent.com/d/1ZBbLFTGD-0Lsn3fwnj4Q-MmdmoHC904o",
        "https://lh3.googleusercontent.com/d/1LPXu6hViyRbN0Hw2hsqCA327AMuKjBrU",
        "https://lh3.googleusercontent.com/d/17oO2Xu9QGfAgygzxJ7Z7-L8uCKBalvS9",
        "https://lh3.googleusercontent.com/d/1yTOuRj336bqdzjiHDddXK4cDcLPacMu7",
        "https://lh3.googleusercontent.com/d/1cJX-YdWCW_Fy6_yDvkIqk6VaWwao7qeR"
      ];
    }
    if (project.title === "Integrated Marketing Campaign") {
      return [
        "https://lh3.googleusercontent.com/d/1oHOYP6MO2Fadp1BhAKnP8iCwCaMsoBlZ",
        "https://lh3.googleusercontent.com/d/1QRwzjvDFCvj300hn5OBdpjgYEOx626py",
        "https://lh3.googleusercontent.com/d/1SQmNFdF01PdC0wBREQlofEXLhd6i9XfT",
        "https://lh3.googleusercontent.com/d/1Lr4S469gDL8yvA4-DjDWdAuX17PzdlhB",
        "https://lh3.googleusercontent.com/d/1u0EskKOHj0n5i53wG2XJi9z4bxLVqLuu",
        "https://lh3.googleusercontent.com/d/1OiRPp_ywOrfgWl_xMc2XftvMo50NTfzw",
        "https://lh3.googleusercontent.com/d/18aRHBJ0NPKGpTnVHT51KAl-ZvIoD2PTL",
        "https://lh3.googleusercontent.com/d/1xZLp2sYZh1WetJBLOzffBLRF0YuYrmMh"
      ];
    }
    return [
      project.image,
      `https://picsum.photos/seed/${project.id + 100}/1200/800`,
      `https://picsum.photos/seed/${project.id + 200}/1200/800`
    ];
  };

  const nextFullscreenImage = () => {
    if (!selectedProject || !fullscreenImage) return;
    const images = Array.from(new Set(getProjectImages(selectedProject)));
    const currentIndex = images.indexOf(fullscreenImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setFullscreenImage(images[nextIndex]);
  };

  const prevFullscreenImage = () => {
    if (!selectedProject || !fullscreenImage) return;
    const images = Array.from(new Set(getProjectImages(selectedProject)));
    const currentIndex = images.indexOf(fullscreenImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setFullscreenImage(images[prevIndex]);
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
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      animate(window.scrollY, offsetPosition, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#1a1a1a] text-white selection:bg-accent selection:text-black font-sans relative">
      {/* Navigation (Static/Fixed) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-12 md:py-6 flex justify-between items-center backdrop-blur-md border-b border-white/10 bg-[#1a1a1a]/80 safe-top">
        <div 
          onClick={() => {
            scrollToTop();
            setIsMobileMenuOpen(false);
          }}
          className="cursor-pointer group flex items-center shrink-0"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/17xzztOYQ2Sk3ZTlPOY0Pan1g0jfZikyP" 
            alt="oneup logo" 
            className="h-8 md:h-12 w-auto transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-xl md:text-2xl font-bold tracking-tighter">oneup</span>';
            }}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">
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
                {t[lang].nav[id as keyof typeof t.en.nav]}
              </a>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-8 h-4">
            <button 
              onClick={() => setLang('en')}
              className={`text-[9px] font-bold tracking-widest transition-colors ${lang === 'en' ? 'text-accent' : 'text-white/20 hover:text-white/40'}`}
            >
              EN
            </button>
            <div className="w-px h-2 bg-white/10" />
            <button 
              onClick={() => setLang('fr')}
              className={`text-[9px] font-bold tracking-widest transition-colors ${lang === 'fr' ? 'text-accent' : 'text-white/20 hover:text-white/40'}`}
            >
              FR
            </button>
            <div className="w-px h-2 bg-white/10" />
            <button 
              onClick={() => setLang('es')}
              className={`text-[9px] font-bold tracking-widest transition-colors ${lang === 'es' ? 'text-accent' : 'text-white/20 hover:text-white/40'}`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold border-r border-white/10 pr-4 mr-2">
            {(['en', 'fr', 'es'] as const).map((l, i) => (
              <React.Fragment key={l}>
                <button 
                  onClick={() => setLang(l)}
                  className={`transition-colors ${lang === l ? 'text-accent' : 'text-white/40'}`}
                >
                  {l.toUpperCase()}
                </button>
                {i < 2 && <span className="text-white/10">/</span>}
              </React.Fragment>
            ))}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/60 hover:text-accent transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#1a1a1a] flex flex-col pt-32 px-12 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {['work', 'services', 'about', 'contact'].map((id, index) => (
                <motion.a 
                  key={id}
                  href={`#${id}`} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  onClick={(e) => {
                    scrollToSection(e, id);
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-4xl font-bold tracking-tighter hover:text-accent transition-colors uppercase"
                >
                  {t[lang].nav[id as keyof typeof t.en.nav]}
                </motion.a>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto mb-12"
            >
              <div className="flex gap-6">
                <a href="https://x.com/one_experiences" target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-accent transition-colors"><Twitter className="w-5 h-5 text-white/40" /></a>
                <a href="https://www.instagram.com/onecx2026/" target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-accent transition-colors"><Instagram className="w-5 h-5 text-white/40" /></a>
                <a href="https://www.linkedin.com/company/112942100/" target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-accent transition-colors"><Linkedin className="w-5 h-5 text-white/40" /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden border-b border-white/10">
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
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{
                duration: 15,
                ease: "easeOut"
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
              {t[lang].hero.tag}
            </div>
            <h1 className="text-[9vw] md:text-[6.5vw] font-bold leading-[0.85] tracking-tighter mb-12 text-accent">
              {t[lang].hero.title.split('<br />').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < t[lang].hero.title.split('<br />').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="max-w-md text-lg md:text-xl text-white/70 leading-relaxed mb-12 font-light">
              {t[lang].hero.desc}
            </p>
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => setShowContactForm(true)}
                className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all"
              >
                {t[lang].hero.cta}
              </button>
              <div className="flex gap-2 items-center text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">
                <div className="w-12 h-px bg-white/10" />
                {t[lang].hero.scroll}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="relative z-10 px-6 md:px-12 py-24 md:py-40">
        <div className="flex justify-between items-end mb-24 border-b border-white/10 pb-12">
          <div>
            <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase mb-4 block">{t[lang].work.tag}</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t[lang].work.title}</h2>
          </div>
          <span className="text-[13px] uppercase tracking-[0.3em] font-bold text-white/20 font-mono hidden md:block">2022 — 2025</span>
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
              <div className="relative h-[320px] overflow-hidden bg-[#262626] rounded-2xl">
                <motion.img 
                  whileHover={{ scale: project.contain ? 1 : 1.05 }}
                  initial={{ scale: 1, x: 0, y: 0 }}
                  whileInView={project.contain ? { scale: 1 } : {
                    scale: 1.08,
                    x: index % 2 === 0 ? -10 : 10,
                    y: index % 3 === 0 ? 8 : -8
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 12,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.05
                  }}
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full transform-gpu ${project.contain ? 'object-contain p-8' : 'object-cover'} grayscale-0 lg:grayscale brightness-100 lg:brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-accent text-[8px] font-bold tracking-[0.3em] uppercase">{project.category}</span>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-1">{project.title}</h3>
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
            <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase mb-4 block">{t[lang].services.tag}</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t[lang].services.title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/10">
          {t[lang].services.items.map((service, i) => (
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
            <span className="text-accent text-[14px] font-black tracking-[0.7em] uppercase mb-12 block">{t[lang].about.tag}</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              {lang === 'en' ? (
                <>WE COMBINE <span className="text-accent">CREATIVITY</span> AND TECHNOLOGY TO ELEVATE BRAND PRESENCE.</>
              ) : lang === 'fr' ? (
                <>NOUS COMBINONS <span className="text-accent">CRÉATIVITÉ</span> ET TECHNOLOGIE POUR ÉLEVER VOTRE PRÉSENCE.</>
              ) : (
                <>COMBINAMOS <span className="text-accent">CREATIVIDAD</span> Y TECNOLOGÍA PARA ELEVAR LA PRESENCIA DE MARCA.</>
              )}
            </h2>
          </div>
          <div className="md:col-span-4 pt-8 pb-12 md:pt-16 md:pb-24 px-12 border-r border-b border-white/10 flex flex-col justify-between bg-[#262626]/30">
            <p className="text-xl text-white/40 leading-relaxed font-light mb-12">
              {t[lang].about.desc}
            </p>
            <div className="space-y-12">
              <div className="space-y-4">
                {t[lang].about.points.map((item) => (
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
            <span className="text-accent text-[13px] uppercase tracking-[0.5em] font-bold mb-12 block">{t[lang].contact.tag}</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">
              {lang === 'en' ? (
                <>READY TO BUILD SOMETHING <span className="text-accent">EXTRAORDINARY</span>?</>
              ) : lang === 'fr' ? (
                <>PRÊT À CONSTRUIRE QUELQUE CHOSE D'<span className="text-accent">EXTRAORDINAIRE</span>?</>
              ) : (
                <>¿LISTO PARA CONSTRUIR ALGO <span className="text-accent">EXTRAORDINARIO</span>?</>
              )}
            </h2>
          </div>
          <div className="p-12 md:p-24 border-r border-b border-white/10 flex flex-col justify-center items-center text-center bg-[#262626]/50">
            <div 
              onClick={() => setShowContactForm(true)}
              className="group cursor-pointer mb-16 flex flex-col items-center"
            >
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter group-hover:text-accent transition-all">
                {lang === 'en' ? 'SAY HELLO' : lang === 'fr' ? 'DITES BONJOUR' : 'HOLA'}
              </h2>
              <div className="flex items-center gap-4 mt-8 group-hover:gap-6 transition-all">
                <div className="h-[1px] w-12 bg-accent/30 group-hover:w-20 transition-all" />
                <span className="text-accent text-xl md:text-3xl uppercase tracking-[0.2em] font-black whitespace-nowrap">
                  {t[lang].hero.cta}
                </span>
                <div className="h-[1px] w-12 bg-accent/30 group-hover:w-20 transition-all" />
              </div>
            </div>
            
            <div className="flex gap-8 justify-center">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/onecx2026/" },
                { Icon: Twitter, href: "https://x.com/one_experiences" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/112942100/" }
              ].map(({ Icon, href }, i) => (
                <motion.a 
                  key={i} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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

      {/* Post-Contact Signature Image */}
      <div className="relative z-10 flex justify-center py-24 bg-[#1a1a1a] border-t border-white/5">
        <a 
          href="https://www.onenow.shop/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1M-EDoDT8Ex1EWXMUU8HaPfhECDSggPxq" 
            alt="Studio Signature" 
            className="h-32 md:h-48 w-auto transition-transform duration-700 group-hover:scale-105 rounded-2xl"
            referrerPolicy="no-referrer"
          />
        </a>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 font-mono bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          © 2025 oneup. {lang === 'en' ? 'Graphic Design & Marketing Studio' : lang === 'fr' ? 'Studio de design / Atelier de création' : 'Estudio de diseño / Taller creativo'}
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => setShowLoginPanel(true)} 
            className="bg-accent text-white px-4 py-2 rounded-full flex items-center gap-2 hover:brightness-110 transition-all duration-300 shadow-lg shadow-accent/20 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            {lang === 'en' ? 'Client Login' : lang === 'fr' ? 'Connexion Client' : 'Acceso Clientes'}
          </button>
        </div>

        <div className="flex gap-12">
          <button onClick={() => setShowLegalModal(true)} className="hover:text-white transition-colors">
            {lang === 'en' ? 'Privacy Policy' : lang === 'fr' ? 'Politique de Confidentialité' : 'Política de Privacidad'}
          </button>
          <button onClick={() => setShowLegalModal(true)} className="hover:text-white transition-colors">
            {lang === 'en' ? 'Terms of Service' : lang === 'fr' ? 'Conditions d\'Utilisation' : 'Términos de Servicio'}
          </button>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          {lang === 'en' ? 'globally yours!' : lang === 'fr' ? 'mondialement vôtre!' : '¡globalmente tuyos!'}
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
            className="fixed inset-0 z-[150] flex items-start justify-center p-6 md:p-12 bg-black/90 backdrop-blur-xl overflow-y-auto safe-top safe-bottom motion-safe-gpu"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl overflow-hidden relative my-12 md:my-24 motion-safe-gpu"
              animate={isSent ? { 
                scale: 1, 
                opacity: 1, 
                x: 0, 
                y: 0
              } : (isFolding ? {
                scale: [1, 0.8, 0],
                x: [0, 0, 800],
                y: [0, 0, -400],
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
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t[lang].form.thankYou}</h2>
                      <p className="text-white/40 text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed">
                        {t[lang].form.successMsg}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowContactForm(false)}
                      className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent hover:text-white transition-colors pt-8"
                    >
                      {t[lang].form.close}
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
                          <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">{t[lang].form.tag}</span>
                          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t[lang].form.title}</h2>
                        </div>

                        <form className="space-y-8" onSubmit={handleFormSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 group">
                              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">{t[lang].form.name}</label>
                              <input 
                                required
                                type="text" 
                                placeholder={t[lang].form.namePlaceholder}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                              />
                            </div>
                            <div className="space-y-2 group">
                              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">{t[lang].form.email}</label>
                              <input 
                                required
                                type="email" 
                                placeholder={t[lang].form.emailPlaceholder}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                              />
                            </div>
                            <div className="space-y-2 group md:col-span-2 lg:col-span-1">
                              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">{t[lang].form.phone}</label>
                              <input 
                                type="tel" 
                                placeholder={t[lang].form.phonePlaceholder}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">{t[lang].form.service}</label>
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
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 group-focus-within:text-accent transition-colors">{t[lang].form.message}</label>
                            <textarea 
                              required
                              rows={4}
                              placeholder={t[lang].form.messagePlaceholder}
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
                            {isFolding ? t[lang].form.sending : t[lang].form.submit}
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
        {showLoginPanel && (
          <div className="fixed inset-0 z-[300] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginPanel(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#1a1a1a] shadow-2xl border-l border-white/10 p-12 flex flex-col"
            >
              <button 
                onClick={() => setShowLoginPanel(false)}
                className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mt-20 space-y-12">
                <div>
                  <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Secure Portal</span>
                  <h2 className="text-4xl font-bold tracking-tighter text-white uppercase">CLIENT LOGIN</h2>
                  <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-4">Authorized access only</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white focus:border-accent outline-none transition-colors rounded-sm"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white focus:border-accent outline-none transition-colors rounded-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <button className="w-full bg-accent text-white py-4 font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-sm">
                    Enter Portal
                  </button>
                </form>

                <div className="pt-12 border-t border-white/10">
                  <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-widest">
                    Problems accessing your account? <br />
                    Contact your project manager or <br />
                    email support@oneup.com
                  </p>
                </div>
              </div>

              <div className="mt-auto opacity-30">
                 <img 
                    src="https://lh3.googleusercontent.com/d/17xzztOYQ2Sk3ZTlPOY0Pan1g0jfZikyP" 
                    alt="oneup logo" 
                    className="h-10 w-auto"
                    referrerPolicy="no-referrer"
                  />
              </div>
            </motion.div>
          </div>
        )}

        {showLegalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black text-white overflow-y-auto"
          >
            <div className="min-h-full flex flex-col">
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
                  oneup © 2025 Experimental Graphic Design & Marketing Studio
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
            className="fixed inset-0 z-[100] bg-white text-black overflow-y-auto motion-safe-gpu"
          >
            <div className="min-h-full flex flex-col">
              <nav className="sticky top-0 w-full px-4 py-4 md:px-12 md:py-8 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 border-b border-black/5 safe-top">
                <div 
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center cursor-pointer group shrink-0"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/d/1N6Tfo4zos_u-SMF0PDBggzLPxjNA9XBG" 
                    alt="oneup logo" 
                    className="h-8 md:h-12 w-auto transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-xl md:text-2xl font-bold tracking-tighter">oneup</span>';
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-2 md:gap-8">
                  <div className="flex items-center border border-black/10 rounded-full p-0.5 md:p-1 scale-90 md:scale-100">
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

              <main className="flex-grow px-6 md:px-12 py-12 md:py-24 max-w-7xl mx-auto w-full safe-bottom">
                {/* Project Header */}
                <div className="mb-24">
                  <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase mb-4 block">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-12">
                    {selectedProject.title.split(' ')[0]} <br />
                    <span className="text-black/10">{selectedProject.title.split(' ')[1] || ''}</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-black/10">
                    <div>
                      <span className="text-[13px] uppercase tracking-[0.2em] font-bold text-black/30 block mb-2">{t[lang].modal.year}</span>
                      <span className="text-sm font-medium">{selectedProject.year || "2024"}</span>
                    </div>
                    <div>
                      <span className="text-[13px] uppercase tracking-[0.2em] font-bold text-black/30 block mb-2">{t[lang].modal.role}</span>
                      <span className="text-sm font-medium">{selectedProject.role || "Lead Design"}</span>
                    </div>
                    <div>
                      <span className="text-[13px] uppercase tracking-[0.2em] font-bold text-black/30 block mb-2">Location</span>
                      <span className="text-sm font-medium">{selectedProject.location || "Global"}</span>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="aspect-video overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl mb-24 md:mb-40"
                  onClick={() => setFullscreenImage(selectedProject.heroImage || selectedProject.image)}
                >
                  <SubtleMotionImage 
                    src={selectedProject.heroImage || selectedProject.image} 
                    alt={selectedProject.title}
                  />
                </motion.div>

                {/* Alternating Content Sections */}
                <div className="space-y-24 md:space-y-48">
                  {selectedProject.title === "Pulso Health" ? (
                    <>
                      {/* Pulso Health Section 1: The Vision */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">The Vision</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Pulso is focused on branding across various platforms, including web, email campaigns, and environmental design, for a global AI health company."
                            ) : lang === 'fr' ? (
                              "Pulso se concentre sur le branding multi-plateforme, incluant le web, l'e-mailing et le design environnemental pour une entreprise mondiale de santé IA."
                            ) : (
                              "Pulso se centra en el branding a través de diversas plataformas, incluyendo web, campañas de correo electrónico y diseño ambiental para una empresa global de salud con IA."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1pWnjLekDDJw2nyvaITIkbyyYCyyVqhrN")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1pWnjLekDDJw2nyvaITIkbyyYCyyVqhrN" 
                            alt="Pulso Health Innovation"
                          />
                        </div>
                      </div>

                      {/* Pulso Health Section 2: Visual Identity */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1HV38KNGMYygGYoRFDoFe2P5v0By10sDC")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1HV38KNGMYygGYoRFDoFe2P5v0By10sDC" 
                            alt="Pulso Health Identity"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Identity</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "This comprehensive approach ensures a cohesive and impactful brand presence that resonates with diverse audiences."
                            ) : lang === 'fr' ? (
                              "Cette approche globale garantit une présence de marque cohérente et percutante qui résonne auprès de divers publics."
                            ) : (
                              "Este enfoque integral garantiza una presencia de marca cohesiva e impactante que resuena en diversas audiencias."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Pulso Health Section 3: Engagement Strategy */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1C9aaZv2jODy3L2G_f70176rmthMvJ7y9")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1C9aaZv2jODy3L2G_f70176rmthMvJ7y9" 
                            alt="Pulso Health Strategy Landscape"
                            cinematic={true}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                          <div className="space-y-6">
                            <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                              {lang === 'en' ? (
                                "By integrating innovative design strategies and effective communication methods, Pulso aims to enhance the visibility and recognition of the AI health brand."
                              ) : lang === 'fr' ? (
                                "En intégrant des stratégies de design innovantes, Pulso vise à renforcer la visibilité et la reconnaissance de la marque de santé IA."
                              ) : (
                                "Al integrar estrategias de diseño innovadoras y métodos de comunicación efectivos, Pulso busca mejorar la visibilidad y el reconocimiento de la marca."
                              )}
                            </p>
                          </div>
                          <div 
                            className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                            onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1JclpfUaRLdnfi-Y8bFiYZjgMoumw4E_U")}
                          >
                            <SubtleMotionImage 
                              src="https://lh3.googleusercontent.com/d/1JclpfUaRLdnfi-Y8bFiYZjgMoumw4E_U" 
                              alt="Pulso Health Strategy Square"
                            />
                          </div>
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Strategic Engagement</span>
                        </div>
                      </div>

                      {/* Pulso Health Section 4: Global Leadership */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/14dOgWst9Yy4S-uenpiuTiJSF5owIrT6M")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/14dOgWst9Yy4S-uenpiuTiJSF5owIrT6M" 
                            alt="Pulso Health Global Leadership"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Market Position</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "This commitment to excellence in branding is essential for establishing a strong market position in the competitive landscape of global health technology."
                            ) : lang === 'fr' ? (
                              "Cet engagement envers l'excellence du branding est essentiel pour établir une position de marché forte."
                            ) : (
                              "Este compromiso con la excelencia en el branding es esencial para establecer una posición de mercado sólida."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Pulso Health Section 5: Connectivity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/16PjI9KDz2z6IFWutld9YKRkwVTNw5Htk")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/16PjI9KDz2z6IFWutld9YKRkwVTNw5Htk" 
                            alt="Pulso Health Connectivity"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Ecosystem Presence</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                               "Focusing on large-scale visibility through environmental design and digital ecosystems, Pulso ensures the brand remains recognizable across every touchpoint."
                            ) : lang === 'fr' ? (
                               "En se concentrant sur une visibilité à grande échelle via le design environnemental, Pulso assure la reconnaissance de la marque."
                            ) : (
                               "Centrándose en la visibilidad a gran escala a través del diseño ambiental, Pulso garantiza que la marca sea reconocible en cada punto de contacto."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Pulso Health Section 6: Brand Panorama (Endless Scroller) */}
                      <div className="space-y-12">
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Brand Panorama</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "A holistic brand journey spanning digital and physical environments, reflecting the commitment to excellence in the global health landscape."
                            ) : lang === 'fr' ? (
                              "Un parcours de marque complet couvrant les environnements numériques et physiques."
                            ) : (
                              "Un viaje de marca holístico que abarca entornos digitales y físicos."
                            )}
                          </p>
                        </div>
                        
                        <div 
                          className="relative overflow-hidden rounded-2xl aspect-video md:aspect-[21/9] bg-transparent cursor-zoom-in"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez")}
                        >
                          <motion.div 
                            className="w-full flex flex-col"
                            animate={{ y: ["0%", "-50%"] }}
                            transition={{
                              duration: 80,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <img 
                              src="https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez" 
                              alt="Pulso Health Panorama"
                              className="w-full h-auto object-cover flex-shrink-0 opacity-80"
                              style={{ filter: 'brightness(1.05) blur(0.6px)' }}
                              referrerPolicy="no-referrer"
                            />
                            <img 
                              src="https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez" 
                              alt="Pulso Health Panorama Duplicate"
                              className="w-full h-auto object-cover flex-shrink-0 opacity-80"
                              style={{ filter: 'brightness(1.05) blur(0.6px)' }}
                              referrerPolicy="no-referrer"
                            />
                          </motion.div>
                          
                          {/* Subtle Gradients to fade edges */}
                          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-neutral-50/90 to-transparent pointer-events-none" />
                          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-neutral-50/90 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* Pulso Health Section 7: Future Intelligence */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1490HNQUNQowTbcizbN6YKqIw7YNr3gxG")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1490HNQUNQowTbcizbN6YKqIw7YNr3gxG" 
                            alt="Pulso Health Future Intelligence"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Future Intelligence</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The integration of AI into health services demands a visual language that balances clinical precision with human empathy, paving the way for the next generation of medical care."
                            ) : lang === 'fr' ? (
                              "L'intégration de l'IA dans les services de santé exige un langage visuel qui équilibre précision clinique et empathie humaine, ouvrant la voie à la prochaine génération de soins médicaux."
                            ) : (
                              "La integración de la IA en los servicios de salud requiere un lenguaje visual que equilibre la precisión clínica con la empatía humana, allanando el camino para la próxima generación de atención médica."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "Padelux" ? (
                    <>
                      {/* Section 1: Intro Text + Image (The Challenge) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">The Challenge</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The challenge for Padelux was to create a minimalist branding identity for an exclusive padel club with a global presence. The design emphasizes elegance and simplicity, ensuring that the brand stands out in a competitive market."
                            ) : lang === 'fr' ? (
                              "Le défi pour Padelux était de créer une identité de marque minimaliste pour un club de padel exclusif avec une présence mondiale. Le design met l'accent sur l'élégance et la simplicité, garantissant que la marque se démarque sur un marché concurrentiel."
                            ) : (
                              "El desafío para Padelux fue crear una identidad de marca minimalista para un club de pádel exclusivo con presencia global. El diseño enfatiza la elegancia y la simplicidad, asegurando que la marca se destaque en un mercado competitivo."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1p6uNNFVC96xiAjRJvtsiCn3MhA330SpH")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1p6uNNFVC96xiAjRJvtsiCn3MhA330SpH" 
                            alt="Padelux Detail 1"
                          />
                        </div>
                      </div>

                      {/* Section 2: Image + Text (Process) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1fpYurGgn-hjRjtOVQN9bAVnEBKu_tkOD")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1fpYurGgn-hjRjtOVQN9bAVnEBKu_tkOD" 
                            alt="Padelux Detail 2"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Process</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Throughout the branding process, a consistent minimalist approach was maintained, reflecting the club's sophisticated image. This strategy not only enhances the club's appeal but also aligns with its vision."
                            ) : lang === 'fr' ? (
                              "Tout au long du processus de branding, une approche minimaliste cohérente a été maintenue, reflétant l'image sophistiquée du club. Cette stratégie renforce l'attrait du club."
                            ) : (
                              "A lo largo del proceso de branding, se mantuvo un enfoque minimalista constante, reflejando la imagen sofisticada del club. Esta estrategia no solo mejora el atractivo del club."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Section 3 (Spot 4) - Wayfinding/Coordinates (Image 4) */}
                      <div 
                        className="relative overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video group"
                        onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/126FAgbfA4FCK8e5Ym6OCZKgsoF5SKenI")}
                      >
                        <SubtleMotionImage 
                          src="https://lh3.googleusercontent.com/d/126FAgbfA4FCK8e5Ym6OCZKgsoF5SKenI" 
                          alt="Padelux Wayfinding"
                          objectPosition="top"
                        />
                        
                        {/* Coordinates Overlay - Story View */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, letterSpacing: "0.2em" }}
                            whileInView={{ opacity: 1, scale: 1, letterSpacing: "1em" }}
                            viewport={{ once: true }}
                            transition={{ 
                              duration: 3, 
                              delay: 0.5, 
                              ease: [0.16, 1, 0.3, 1] 
                            }}
                            className="text-white text-base md:text-2xl font-bold uppercase tracking-[1em] whitespace-nowrap drop-shadow-2xl"
                          >
                            40.7246° N, 74.0019° W
                          </motion.div>
                        </div>

                        {/* Click feedback overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                        
                        {/* Subtle Vignette for readability */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-60 pointer-events-none" />
                      </div>

                      {/* Section 4: Large Image or Full Video grid (History) */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1Zr9R_Z3bMjuCJo5xykDJIPVcxvgVeFar")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1Zr9R_Z3bMjuCJo5xykDJIPVcxvgVeFar" 
                            alt="Padelux Lifestyle"
                          />
                        </div>
                        <p className="max-w-2xl text-sm text-black/40 leading-relaxed uppercase tracking-wider font-medium">
                          {lang === 'en' ? (
                            "Padel, a sport that originated in Acapulco, Mexico, was created by Enrique Corcuera. This innovative game has since gained immense popularity, expanding its reach across the globe."
                          ) : lang === 'fr' ? (
                            "Le Padel, un sport originaire d'Acapulco, au Mexique, a été créé par Enrique Corcuera. Ce jeu innovant a depuis acquis une immense popularité."
                          ) : (
                            "El pádel, un deporte que se originó en Acapulco, México, fue creado por Enrique Corcuera. Este juego innovador ha ganado desde entonces una inmensa popularidad."
                          )}
                        </p>
                      </div>

                      {/* Section 5: Vertical Mood Image (Identity) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/169Pww9eoPuFuC3gU5bx9E02cOV7037zl")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/169Pww9eoPuFuC3gU5bx9E02cOV7037zl" 
                            alt="Padelux Detail 5"
                          />
                        </div>
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Identity</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Visual cues and architectural references served as the foundation for the club's distinctive identity, bridging the gap between sport and lifestyle."
                            ) : lang === 'fr' ? (
                              "Les indices visuels et les références architecturales ont servi de base à l'identité distinctive du club, comblant le fossé entre le sport et le mode de vie."
                            ) : (
                              "Las pistas visuales y las referencias arquitectónicas sirvieron como base para la identidad distintiva del club, cerrando la brecha entre el deporte y el estilo de vida."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Section 6: Image + Text (Lifestyle) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1KbD64ig98ArfbH_BLpk8aa_KtIWZ-rfv")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1KbD64ig98ArfbH_BLpk8aa_KtIWZ-rfv" 
                            alt="Padelux Heritage"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Experience</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Padelux is more than a sport; it's a social destination. We curated a lifestyle experience that resonates with a community of enthusiasts who value both performance and social connection."
                            ) : lang === 'fr' ? (
                              "Padelux est plus qu'un sport ; c'est une destination sociale. Nous avons organisé une expérience de style de vie qui résonne avec une communauté de passionnés."
                            ) : (
                              "Padelux es más que un deporte; es un destino social. Curamos una experiencia de estilo de vida que resuena con una comunidad de entusiastas."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "Voltique" ? (
                    <>
                      {/* Voltique Story Section 1: The Challenge */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">The Challenge</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light italic">
                            {lang === 'en' ? (
                              "The primary branding challenge was to create an identity that felt modern, clean, futuristic, and high-end—positioning Voltique as the definitive future of electric car service stations while maintaining the familiarity of traditional infrastructure."
                            ) : lang === 'fr' ? (
                              "Le principal défi de branding était de créer une identité à la fois moderne, épurée, futuriste et haut de gamme."
                            ) : (
                              "El principal desafío de marca fue crear una identidad que se sintiera moderna, limpia, futurista y de alta gama."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/18okrA2Rgsx9gzhggIOu89nuz6QcWu-Hi")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/18okrA2Rgsx9gzhggIOu89nuz6QcWu-Hi" 
                            alt="Voltique Architectural Language"
                          />
                        </div>
                      </div>

                      {/* Voltique Story Section 2: Future Infrastructure */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1LP7r24WA012N3hkibYdehCPnKasGT4jB")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1LP7r24WA012N3hkibYdehCPnKasGT4jB" 
                            alt="Voltique Innovation"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Innovation</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Defining the visual language of next-generation service hubs, blending sustainable technology with premium architectural aesthetics."
                            ) : lang === 'fr' ? (
                              "Définir le langage visuel des hubs de services de nouvelle génération, alliant technologie durable et esthétique architecturale haut de gamme."
                            ) : (
                              "Definiendo el lenguaje visual de los centros de servicio de próxima generación, combinando tecnología sostenible con estética arquitectónica de alta gama."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Voltique Story Section 3: Lifestyle Sanctuary */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1Ad-O2_nnkJHtfNLqVneCvzqufYPEpP-t")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1Ad-O2_nnkJHtfNLqVneCvzqufYPEpP-t" 
                            alt="Voltique Lifestyle Lounge"
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Lifestyle Sanctuary</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "These state-of-the-art facilities offer a range of amenities, including specialized car washes tailored for electric vehicles and comfortable lounges where customers can relax and enjoy coffee while they wait."
                            ) : lang === 'fr' ? (
                              "Ces installations de pointe offrent une gamme d'équipements, notamment des lave-autos spécialisés et des salons confortables."
                            ) : (
                              "Estas instalaciones de última generación ofrecen una gama de servicios, incluidos lavados de autos especializados y salones cómodos."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Voltique Story Section 4: Experience & Convenience */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Total Service Experience</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Voltique locations are equipped with multiple EV charging stations, ensuring convenience for drivers. This comprehensive electric service experience is aimed at enhancing the overall journey for EV owners."
                            ) : lang === 'fr' ? (
                              "Les sites Voltique sont équipés de plusieurs bornes de recharge pour VE, garantissant ainsi la commodité des conducteurs."
                            ) : (
                              "Las ubicaciones de Voltique están equipadas con múltiples estaciones de carga de vehículos eléctricos, lo que garantiza la comodidad de los conductores."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1C6c6M2Sf0EchjHqKsylmecO9Z__707lY")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1C6c6M2Sf0EchjHqKsylmecO9Z__707lY" 
                            alt="Voltique EV Infrastructure"
                          />
                        </div>
                      </div>

                      {/* Voltique Story Section 5: Brand Ecosystem */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1tJkKFKLTwo-zkp6K_EVdVRz7rCviD-F0")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1tJkKFKLTwo-zkp6K_EVdVRz7rCviD-F0" 
                            alt="Voltique Brand Identity"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Brand Ecosystem</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Our brand ecosystem unites digital and physical touchpoints, creating a seamless high-end experience that defines the future of premium electric vehicle infrastructure."
                            ) : lang === 'fr' ? (
                              "Notre écosystème de marque unit les points de contact numériques et physiques, créant une expérience haut de gamme fluide."
                            ) : (
                              "Nuestro ecosistema de marca une los puntos de contacto digitales y físicos, creando una experiencia fluida de alta gama."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Voltique Story Section 6: Future Vision */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1RYRWf7_CSv27PD95PfnPPKLs534PhOQD")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1RYRWf7_CSv27PD95PfnPPKLs534PhOQD" 
                            alt="Voltique Future Vision"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Future Vision</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Looking forward, Voltique continues to push boundaries, evolving the aesthetics of energy into a global standard for clean, premium transportation infrastructure."
                            ) : lang === 'fr' ? (
                              "À l'avenir, Voltique continue de repousser les limites, transformant l'esthétique de l'énergie en une norme mondiale pour les infrastructures de transport propres et haut de gamme."
                            ) : (
                              "Mirando hacia el futuro, Voltique continúa superando los límites, haciendo evolucionar la estética de la energía hacia un estándar global para infraestructuras de transporte limpias y de alta gama."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Voltique Story Section 7: Impact & Sustainability */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1IbhBUuJuXIiKMGleLfoHvwAlE78GdwG_")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1IbhBUuJuXIiKMGleLfoHvwAlE78GdwG_" 
                            alt="Voltique Impact"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Global Impact</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Voltique's vision extends beyond mere utility, creating a sustainable benchmark for premium urban mobility and energy infrastructure worldwide."
                            ) : lang === 'fr' ? (
                              "La vision de Voltique dépasse la simple utilité, créant une référence durable pour la mobilité urbaine haut de gamme."
                            ) : (
                              "La visión de Voltique va más allá de la mera utilidad, creando un referente sostenible para la movilidad urbana de alta gama."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "BuyDrop" ? (
                    <>
                      {/* BuyDrop Section 0: The Ecosystem (Square Detail) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1qpd246hL-TbgCSgf9j2qxBk15FMW2FuF")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1qpd246hL-TbgCSgf9j2qxBk15FMW2FuF" 
                            alt="BuyDrop Ecosystem"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Strategic Vision</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "BuyDrop is an advanced logistics ecosystem designed for optimized global distribution and supply chain transparency."
                            ) : lang === 'fr' ? (
                              "BuyDrop est un écosystème logistique avancé conçu pour une distribution mondiale optimisée."
                            ) : (
                              "BuyDrop es un ecosistema logístico avanzado diseñado para una distribución global optimizada."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* BuyDrop Section 1: Full-Width Cinematic (The Concept) */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1jxksiMAxUtLXBxGL8bNC7jcizLTyxXR0")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1jxksiMAxUtLXBxGL8bNC7jcizLTyxXR0" 
                            alt="BuyDrop Environment"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">The Concept</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "It redefines efficiency through real-time tracking and automated freight coordination, ensuring seamless integration across all maritime and land-based networks."
                            ) : lang === 'fr' ? (
                              "Il redéfinit l'efficacité grâce au suivi en temps réel et à la coordination automatisée du fret."
                            ) : (
                              "Redefine la eficiencia a través del seguimiento en tiempo real y la coordinación automatizada de carga."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* BuyDrop Section 2: Image + Text (System Architecture) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1NV4L745ah-lWi0pZtmULvNTiJHefN6J9")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1NV4L745ah-lWi0pZtmULvNTiJHefN6J9" 
                            alt="BuyDrop System"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">System Architecture</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The backend infrastructure supports millions of concurrent transactions, ensuring that every 'drop' is executed with millisecond precision."
                            ) : lang === 'fr' ? (
                              "L'infrastructure backend prend en charge des millions de transactions simultanées."
                            ) : (
                              "La infraestructura backend soporta millones de transacciones simultáneas."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* BuyDrop Section 3: Cinematic / Precision Overlay (Full Width Image) */}
                      <div className="space-y-12">
                        <div 
                          className="relative overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video group"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/16nVARSrN4RZielAgzspDx6mkKm6VUs_3")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/16nVARSrN4RZielAgzspDx6mkKm6VUs_3" 
                            alt="BuyDrop Precision"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Visual DNA</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The visual identity emphasizes precision and reliability—utilizing structured grid systems and dynamic motion to represent the fluid movement of global trade."
                            ) : lang === 'fr' ? (
                              "L'identité visuelle met l'accent sur la précision et la fiabilité—en utilisant des systèmes de grille structurés."
                            ) : (
                              "La identidad visual enfatiza la precisión y confiabilidad, utilizando sistemas de cuadrícula estructurados."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* BuyDrop Section 4: Final Impact */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1rxQVm2VX7vOD1Z0HPFx7DgVC1s5iwzXH")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1rxQVm2VX7vOD1Z0HPFx7DgVC1s5iwzXH" 
                            alt="BuyDrop Distribution"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Global Network</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Bridging continents through a unified digital layer, BuyDrop creates a seamless map of distribution that empowers local markets on a global scale."
                            ) : lang === 'fr' ? (
                              "Relier les continents via une couche numérique unifiée."
                            ) : (
                              "Conectando continentes a través de una capa digital unificada."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "UNITY Community Hub" ? (
                    <>
                      {/* UNITY Section 1: Intro */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">The Mission</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "UNITY serves as a global mental health hub dedicated to supporting youth facing mental health challenges and anxiety. Its primary goal is to connect these individuals with the resources and assistance they need to navigate their struggles effectively."
                            ) : lang === 'fr' ? (
                              "UNITY sert de hub mondial pour la santé mentale dédié à soutenir les jeunes confrontés à des défis de santé mentale et à l'anxiété. Son objectif principal est de connecter ces individus aux ressources et à l'assistance dont ils ont besoin."
                            ) : (
                              "UNITY sirve como un hub global de salud mental dedicado a apoyar a los jóvenes que enfrentan desafíos de salud mental y ansiedad. Su objetivo principal es conectar a estas personas con los recursos y la asistencia que necesitan."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1SaZAxfG-M0ouGb0w0wCRxmzKQ3U8S5uT")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1SaZAxfG-M0ouGb0w0wCRxmzKQ3U8S5uT" 
                            alt="UNITY Mission"
                          />
                        </div>
                      </div>

                      {/* UNITY Section 2: Branding Strategy */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/11wP3BfkI3AFIZP49UH1WSwpXPZEvmHc6")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/11wP3BfkI3AFIZP49UH1WSwpXPZEvmHc6" 
                            alt="UNITY Branding"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Branding Strategy</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The branding strategy focuses on creating a clear and accessible identity that resonates with a wide audience. This approach emphasizes simplicity and cleanliness, ensuring that the branding is easily applicable across various collateral, websites, and environmental signage."
                            ) : lang === 'fr' ? (
                              "La stratégie de branding se concentre sur la création d'une identité claire et accessible qui résonne auprès d'un large public. Cette approche met l'accent sur la simplicité et la propreté."
                            ) : (
                              "La estrategia de marca se centra en crear una identidad clara y accesible que resuene con una audiencia amplia. Este enfoque enfatiza la simplicidad y la limpieza."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* UNITY Section 3: Visual Language */}
                      <div className="max-w-3xl space-y-6">
                        <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Visual Language</span>
                        <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                          {lang === 'en' ? (
                            "The visual system uses a soothing and optimistic palette, designed to provide a safe digital environment for users to explore and seek support."
                          ) : lang === 'fr' ? (
                            "Le système visuel utilise une palette apaisante et optimiste, conçue pour offrir un environnement numérique sûr."
                          ) : (
                            "El sistema visual utiliza una paleta relajante y optimista, diseñada para proporcionar un entorno digital seguro."
                          )}
                        </p>
                      </div>

                      {/* UNITY Section 4: Physical Touchpoints */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1M-1AUscx9JJ7guyEjAeF1ziTjLxrnbWK")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1M-1AUscx9JJ7guyEjAeF1ziTjLxrnbWK" 
                            alt="UNITY Physical Touchpoints"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Environmental Presence</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Expanding beyond the digital realm, the identity seamlessly adapts to physical environments, creating a consistent and comforting presence in real-world safe spaces."
                            ) : lang === 'fr' ? (
                              "S'étendant au-delà du domaine numérique, l'identité s'adaptant parfaitement aux environnements physiques."
                            ) : (
                              "Expandiéndose más allá del ámbito digital, la identidad se adapta perfectamente a los entornos físicos."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* UNITY Section 5: Visual Detail */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Identity & Design</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Every visual element was meticulously crafted to ensure maximum impact and clarity, providing an essential resource for those navigating therapeutic journeys."
                            ) : lang === 'fr' ? (
                              "Chaque élément visuel a été méticuleusement conçu pour garantir un impact et une clarté maximum."
                            ) : (
                              "Cada elemento visual fue meticulosamente diseñado para garantizar el máximo impacto y claridad."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1JL_vUWyn2sn9wFsdgCnL-XekDbMnzJ4t")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1JL_vUWyn2sn9wFsdgCnL-XekDbMnzJ4t" 
                            alt="UNITY Detail"
                          />
                        </div>
                      </div>

                      {/* UNITY Section 6: Community Connection */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/178fpIdVUsFAnFVgY89ztj_hRTVaxAWsw")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/178fpIdVUsFAnFVgY89ztj_hRTVaxAWsw" 
                            alt="UNITY Community"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Community Reach</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The hub serves as a testament to the power of design in bridging gaps and building resilient support networks for youth across the globe."
                            ) : lang === 'fr' ? (
                              "Le hub témoigne du pouvoir du design pour combler les lacunes et construire des réseaux de soutien résilients."
                            ) : (
                              "El centro sirve como testimonio del poder del diseño para cerrar brechas y construir redes de apoyo resilientes."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* UNITY Section 7: Brand Precision */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/18gqdiRXLF7McIOK9DyD33TilFTV1OwYX")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/18gqdiRXLF7McIOK9DyD33TilFTV1OwYX" 
                            alt="UNITY Brand Precision"
                          />
                        </div>
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Brand Precision</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The brand's visual system is defined by extreme precision and clarity, ensuring that every touchpoint reflects the hub's core values of reliability and support."
                            ) : lang === 'fr' ? (
                              "Le système visuel de la marque se définit par une précision et une clarté extrêmes, garantissant que chaque point de contact reflète les valeurs de fiabilité."
                            ) : (
                              "El sistema visual de la marca se define por una precisión y claridad extremas, asegurando que cada punto de contacto refleje los valores fundamentales."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "Atelier d'art" ? (
                    <>
                      {/* Atelier Section 1: Branding Strategy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Branding Strategy</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The branding strategy aims to establish a cohesive identity for the festival, ensuring that all promotional elements resonate with the target audience. The campaign conveys the specific identity of the 13 French regions: Auvergne-Rhône-Alpes, Bretagne, Bourgogne-Franche-Comté, Centre-Val de Loire, Corse, Grand Est, Hauts-de-France, Île-de-France (Paris), Normandie, Nouvelle-Aquitaine, Occitanie, Pays de la Loire, and Provence-Alpes-Côte d'Azur."
                            ) : lang === 'fr' ? (
                              "La stratégie de marque vise à établir une identité cohérente pour le festival, garantissant que tous les éléments promotionnels résonnent auprès du public cible. Elle véhicule l'identité des 13 régions françaises : Auvergne-Rhône-Alpes, Bretagne, Bourgogne-Franche-Comté, Centre-Val de Loire, Corse, Grand Est, Hauts-de-France, Île-de-France (Paris), Normandie, Nouvelle-Aquitaine, Occitanie, Pays de la Loire et Provence-Alpes-Côte d'Azur."
                            ) : (
                              "La estrategia de branding busca establecer una identidad cohesiva para el festival, asegurando que todos los elementos promocionales resuenen con el público objetivo. La campaña transmite la identidad de las 13 regiones francesas: Auvergne-Rhône-Alpes, Bretagne, Bourgogne-Franche-Comté, Centre-Val de Loire, Corse, Grand Est, Hauts-de-France, Île-de-France (Paris), Normandie, Nouvelle-Aquitaine, Occitanie, Pays de la Loire y Provence-Alpes-Côte d'Azur."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1osUANG5WeR0Ww3n_OQtdiaNXBxQLIA7f")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1osUANG5WeR0Ww3n_OQtdiaNXBxQLIA7f" 
                            alt="Atelier Branding Strategy"
                          />
                        </div>
                      </div>

                      {/* Atelier Section 2: Visual Language (Cinematic) */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1el8VLirLeFCbYzVJmjInCWc_1ndww9-9")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1el8VLirLeFCbYzVJmjInCWc_1ndww9-9" 
                            alt="Atelier Visual Language"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Visual Language</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "A sophisticated visual system using minimalist typography and bold layouts to represent the duality of classical inspiration and modern execution."
                            ) : lang === 'fr' ? (
                              "Un système visuel sophistiqué utilisant une typographie minimaliste et des mises en page audacieuses."
                            ) : (
                              "Un sistema visual sofisticado que utiliza tipografía minimalista y diseños audaces."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Atelier Section 3: Artistic Precision */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/16PMa4p6HKCfzF56Ny_JoEGR6OBJqU-Jj")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/16PMa4p6HKCfzF56Ny_JoEGR6OBJqU-Jj" 
                            alt="Atelier Precision"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Artistic Precision</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Every detail of the campaign was crafted to honor the craftsmanship of the featured artists, ensuring that even the smallest promotional element carries the weight of the festival's artistic vision."
                            ) : lang === 'fr' ? (
                              "Chaque détail de la campagne a été conçu pour honorer le savoir-faire des artistes présentés."
                            ) : (
                              "Cada detalle de la campaña fue diseñado para honrar la artesanía de los artistas destacados."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Atelier Section 4: Cultural Heritage (Final Impact) */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1T9CIXul6wnGY6caACLxwvlW1gAR-EDzi")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1T9CIXul6wnGY6caACLxwvlW1gAR-EDzi" 
                            alt="Atelier d'art Cultural Heritage"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Cultural Heritage</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "By emphasizing the rich cultural heritage of French art, the campaign fostered a deep appreciation for artistic expression across all generations."
                            ) : lang === 'fr' ? (
                              "En mettant l'accent sur le riche patrimoine culturel de l'art français, la campagne a favorisé une profonde appréciation pour l'expression artistique."
                            ) : (
                              "Al enfatizar el rico patrimonio cultural del arte francés, la campaña fomentó un profundo aprecio por la expresión artística."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "Insurly" ? (
                    <>
                      {/* Insurly Section 1: The Challenge */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">The Challenge</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Insurly is a convenient mobile app that allows users to quickly obtain insurance coverage for travel, health, or visits to other countries. Its user-friendly interface and straightforward branding effectively convey the essential message of fast and reliable insurance solutions."
                            ) : lang === 'fr' ? (
                              "Insurly est une application mobile pratique qui permet aux utilisateurs d'obtenir rapidement une couverture d'assurance pour les voyages, la santé ou les visites dans d'autres pays. Son interface conviviale et son image de marque simple transmettent efficacement le message."
                            ) : (
                              "Insurly es una aplicación móvil conveniente que permite a los usuarios obtener rápidamente cobertura de seguro para viajes, salud o visitas a otros países. Su interfaz fácil de usar y su marca sencilla transmiten el mensaje de forma eficaz."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/10Na1qqypVRFoARcL01kFD_mbdaZdQMP6")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/10Na1qqypVRFoARcL01kFD_mbdaZdQMP6" 
                            alt="Insurly Mobile Interface"
                          />
                        </div>
                      </div>

                      {/* Insurly Section: Narrative Overview */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1TeSUFMoUj56pjCeP4PKvfrLC9QKIEnOg")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1TeSUFMoUj56pjCeP4PKvfrLC9QKIEnOg" 
                            alt="Insurly Brand System"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Insurly Section 2: Seamless Experience */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1ZYz8F6REOrPju1PSGE42hzL-HcNck6Yh")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1ZYz8F6REOrPju1PSGE42hzL-HcNck6Yh" 
                            alt="Insurly Seamless Experience"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">User Experience</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "With Insurly, users can secure their policies on the go, ensuring peace of mind while traveling. The app's clean design enhances the overall experience, making it easy for anyone to access 24/7 easy insurance everywhere without hassle."
                            ) : lang === 'fr' ? (
                              "Avec Insurly, les utilisateurs peuvent sécuriser leurs polices en déplacement. La conception épurée de l'application facilite l'accès à une assurance simple 24/7, partout et sans tracas."
                            ) : (
                              "Con Insurly, los usuarios pueden asegurar sus pólizas sobre la marcha. El diseño limpio de la aplicación facilita el acceso a un seguro sencillo las 24 horas, los 7 días de la semana, en cualquier lugar y sin complicaciones."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1SMqz6HPzVZHCXfErDSBNVoJzHxltdPGY")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1SMqz6HPzVZHCXfErDSBNVoJzHxltdPGY" 
                            alt="Insurly App Interface"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Insurly Section 3: Global Coverage */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1WhPpMX954NfJUF-1ncQ5VfV__3Ao7FbX")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1WhPpMX954NfJUF-1ncQ5VfV__3Ao7FbX" 
                            alt="Insurly Global Coverage"
                          />
                        </div>
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Global Reach</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Providing a universal solution for international travelers, ensuring high-quality protection no matter where your journey takes you."
                            ) : lang === 'fr' ? (
                              "Fournir une solution universelle pour les voyageurs internationaux, garantissant une protection de haute qualité peu importe votre destination."
                            ) : (
                              "Brindando una solución universal para viajeros internacionales, asegurando una protección de alta calidad sin importar a dónde te lleve tu viaje."
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1-pLYowWBDuGOLikvx_Qow6PN1AuxJUJj")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1-pLYowWBDuGOLikvx_Qow6PN1AuxJUJj" 
                            alt="Insurly Global Reach Solution"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Insurly Section 5: Brand Impact */}
                      <div className="space-y-12 pb-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1m8koR6xj0qa1Ijn53Le5HUiT1SjQDZHW")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1m8koR6xj0qa1Ijn53Le5HUiT1SjQDZHW" 
                            alt="Insurly Brand Impact"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Insurly Section 4: Cinematic Experience */}
                      <div className="space-y-12">
                        <div className="overflow-hidden bg-black rounded-2xl aspect-video relative group/video">
                          <CompactVideoPlayer 
                            src="https://lh3.googleusercontent.com/d/1w_ctPlIrM484s3rr8ZT9hut7L-1QKE-3" 
                            alt="Insurly Cinematic Brand Animation"
                            useGif={true}
                            onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1w_ctPlIrM484s3rr8ZT9hut7L-1QKE-3")}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Visual Storytelling</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Our cinematic strategy captures the fast-paced nature of modern travel, translating reliable insurance into a dynamic visual narrative."
                            ) : lang === 'fr' ? (
                              "Notre stratégie cinématique capture la nature trépidante des voyages modernes."
                            ) : (
                              "Nuestra estrategia cinematográfica captura la naturaleza acelerada de los viajes modernos."
                            )}
                          </p>
                        </div>
                      </div>

                    </>
                  ) : selectedProject.title === "organic cosmetic" ? (
                    <>
                      {/* Organic Cosmetic Section 1: Brand Concept */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Brand Concept</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "One assisted an organic brand in developing a simple yet elegant and memorable identity for its nature-curated cosmetic line. The scope encompassed branding, collateral print, and environmental brand integration. The products are crafted from 100% organic, non-allergenic ingredients, ensuring safety and quality for consumers."
                            ) : lang === 'fr' ? (
                              "Nous avons aidé une marque biologique à développer une identité simple, élégante et mémorable pour sa ligne de cosmétiques. Le projet comprenait l'image de marque, les supports imprimés et l'intégration environnementale de la marque."
                            ) : (
                              "Ayudamos a una marca orgánica a desarrollar una identidad sencilla, elegante y memorable. El proyecto incluyó branding, colaterales impresos e integración de marca ambiental."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1grDf1nKeXz2GbtfBFF0lyqSzyEY2Z7is")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1grDf1nKeXz2GbtfBFF0lyqSzyEY2Z7is" 
                            alt="Organic Cosmetic Brand Animation"
                            contain={true}
                          />
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 2: Visual Narrative */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Visual Narrative</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "This branding approach emphasizes the brand's commitment to natural beauty while appealing to a discerning audience. By focusing on the purity of its ingredients and the aesthetic of its presentation, the brand effectively communicates its values and mission in the competitive cosmetics market."
                            ) : lang === 'fr' ? (
                              "Cette approche souligne l'engagement de la marque envers la beauté naturelle tout en séduisant un public exigeant. En se concentrant sur la pureté de ses ingrédients et l'esthétique de sa présentation, la marque communique efficacement ses valeurs."
                            ) : (
                              "Este enfoque de marca enfatiza el compromiso con la belleza natural a la vez que atrae a un público exigente. Al centrarse en la pureza de sus ingredientes y la estética de su presentación, la marca comunica eficazmente sus valores."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1DlAdlFYlYmujpUEC1uzvAu4EIc9uRiHu")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1DlAdlFYlYmujpUEC1uzvAu4EIc9uRiHu" 
                            alt="Organic Cosmetic Purity"
                          />
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 3: Lifestyle / Atmosphere */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1EtZot-anCp8jl1iTfBOlQ6j7wD7nx2q9")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1EtZot-anCp8jl1iTfBOlQ6j7wD7nx2q9" 
                            alt="Organic Cosmetic Lifestyle"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 4: Brand Mood */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1ZBbLFTGD-0Lsn3fwnj4Q-MmdmoHC904o")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1ZBbLFTGD-0Lsn3fwnj4Q-MmdmoHC904o" 
                            alt="Organic Cosmetic Brand Mood"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 5: Packaging & Detail */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1LPXu6hViyRbN0Hw2hsqCA327AMuKjBrU")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1LPXu6hViyRbN0Hw2hsqCA327AMuKjBrU" 
                            alt="Organic Cosmetic Packaging Detail"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 6: Natural Essence */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/17oO2Xu9QGfAgygzxJ7Z7-L8uCKBalvS9")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/17oO2Xu9QGfAgygzxJ7Z7-L8uCKBalvS9" 
                            alt="Organic Cosmetic Natural Essence"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 7: Brand Excellence Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5] order-2 md:order-1"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1yTOuRj336bqdzjiHDddXK4cDcLPacMu7")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1yTOuRj336bqdzjiHDddXK4cDcLPacMu7" 
                            alt="Organic Cosmetic Brand Excellence"
                          />
                        </div>
                        <div className="space-y-6 order-1 md:order-2">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Brand Excellence</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The meticulous attention to detail in packaging and identity reflects the brand's premium positioning and dedication to providing an elevated self-care experience."
                            ) : lang === 'fr' ? (
                              "L'attention méticuleuse portée aux détails de l'emballage et de l'identité reflète le positionnement haut de gamme de la marque et son dévouement à offrir une expérience de soin de soi exceptionnelle."
                            ) : (
                              "La meticulosa atención al detalle en el empaque y la identidad refleja el posicionamiento premium de la marca y su dedicación a brindar una experiencia de autocuidado elevada."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Organic Cosmetic Section 8: Tactile Integrity */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1cJX-YdWCW_Fy6_yDvkIqk6VaWwao7qeR")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1cJX-YdWCW_Fy6_yDvkIqk6VaWwao7qeR" 
                            alt="Organic Cosmetic Tactile Material Integrity"
                            cinematic={true}
                          />
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "edere restaurant" ? (
                    <>
                      {/* Edere Restaurant Section 1: Branding Strategy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Branding Strategy</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The development of a refined branding strategy for a vibrant restaurant in Rome, Italy, is essential to capture the essence of this historic city. By embracing the rich tapestry of ancient Roman culture, the branding reflects the unique character and charm that Rome offers."
                            ) : lang === 'fr' ? (
                              "Le développement d'une stratégie de marque raffinée pour un restaurant dynamique à Rome est essentiel pour capturer l'essence de cette ville historique."
                            ) : (
                              "El desarrollo de una estrategia de marca refinada para un restaurante vibrante en Roma es esencial para capturar la esencia de esta ciudad histórica."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1k8q8V3zvS4uYnfp0s6unRNpWiaAbIqa9")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1k8q8V3zvS4uYnfp0s6unRNpWiaAbIqa9" 
                            alt="Edere Branding Strategy"
                          />
                        </div>
                      </div>

                      {/* Edere Restaurant Section 2: Cultural Heritage */}
                      <div className="space-y-12 mb-24 md:mb-40">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1Lg4ePRrMplc3GDzN8ixUcuL9MbPwqBxg")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1Lg4ePRrMplc3GDzN8ixUcuL9MbPwqBxg" 
                            alt="Edere Cultural Heritage"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Cultural Heritage</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "This approach highlights the restaurant's commitment to authenticity, creating a welcoming atmosphere that resonates with both locals and tourists through elements that evoke the city's storied past."
                            ) : lang === 'fr' ? (
                              "Cette approche souligne l'engagement du restaurant envers l'authenticité, créant une atmosphère accueillante qui résonne auprès de tous."
                            ) : (
                              "Este enfoque destaca el compromiso del restaurante con la autenticidad, creando una atmósfera acogedora que resuena con todos."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 3: Design Experience */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/19C-4W9Vpb5EgIzhZZO9jJB19_b10ejYO")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/19C-4W9Vpb5EgIzhZZO9jJB19_b10ejYO" 
                            alt="Edere Visual Detail"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Design Experience</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "From the logo to the interior decor, design elements evoke Rome's past while providing a modern dining experience that appeals to a diverse and sophisticated clientele."
                            ) : lang === 'fr' ? (
                              "Du logo au décor intérieur, les éléments de design évoquent le passé de Rome tout en offrant une expérience culinaire moderne."
                            ) : (
                              "Desde el logotipo hasta la decoración interior, los elementos de diseño evocan el pasado de Roma ofreciendo una experiencia moderna."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 4: Social Gathering */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Social Gathering</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The restaurant aims to be a cherished gathering place for friends and family, offering a delightful escape after a long day at work in the heart of the city."
                            ) : lang === 'fr' ? (
                              "Le restaurant se veut un lieu de rencontre privilégié pour les amis et la famille, offrant une évasion délicieuse après le travail."
                            ) : (
                              "el restaurante pretende ser un lugar de encuentro apreciado por amigos y familiares, ofreciendo un escape encantador después del trabajo."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1GY7keTnEI3Jayucac9QegpwS8rk-vOMJ")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1GY7keTnEI3Jayucac9QegpwS8rk-vOMJ" 
                            alt="Edere Brand Legacy"
                          />
                        </div>
                      </div>

                      {/* Edere Restaurant Section 5: Culinary Roots */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1Mux8yWx0pRNv-P3p1-92vHZH7nkO9rRh")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1Mux8yWx0pRNv-P3p1-92vHZH7nkO9rRh" 
                            alt="Edere Material Connection"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Culinary Roots</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "With a menu that celebrates traditional Italian cuisine, patrons can indulge in a variety of dishes that showcase the region's rich culinary heritage."
                            ) : lang === 'fr' ? (
                              "Avec une carte qui célèbre la cuisine italienne traditionnelle, les clients peuvent découvrir le riche patrimoine culinaire de la région."
                            ) : (
                              "Con una carta que celebra la cocina tradicional italiana, los clientes pueden disfrutar del rico patrimonio culinario de la región."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 6: Community Hub */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Community Hub</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Ambiance designed to foster connection and relaxation. By positioning itself as a community hub, the restaurant cultivates a profound sense of belonging."
                            ) : lang === 'fr' ? (
                              "Une ambiance conçue pour favoriser la connexion. En se positionnant comme un hub communautaire, le restaurant cultive un sens de l'appartenance."
                            ) : (
                              "Un ambiente diseñado para fomentar la conexión. Al posicionarse como un centro comunitario, el restaurante cultiva un sentido de pertenencia."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/19Gt0niVC8EL5JdpHNmsRdCLTrBeeIbcu")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/19Gt0niVC8EL5JdpHNmsRdCLTrBeeIbcu" 
                            alt="Edere Gastronomic Excellence"
                          />
                        </div>
                      </div>

                      {/* Edere Restaurant Section 7: Experiential Atmosphere */}
                      <div className="space-y-12">
                        <div 
                          className="cursor-zoom-in"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1KswSnGMZRZkyOOaVJXWTKkUqWwdzxTqB")}
                        >
                          <CinematicScrollImage 
                            src="https://lh3.googleusercontent.com/d/1KswSnGMZRZkyOOaVJXWTKkUqWwdzxTqB" 
                            alt="Edere Experiential Atmosphere"
                            className="aspect-video md:aspect-[21/9] rounded-2xl"
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Experiential Atmosphere</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Encouraging guests to unwind over a glass of wine or a hearty meal, making it a beloved destination in the heart of Rome."
                            ) : lang === 'fr' ? (
                              "Encourager les invités à se détendre autour d'un verre de vin, en faisant une destination privilégiée au cœur de Rome."
                            ) : (
                              "Alentando a los huéspedes a relajarse con una copa de vino, convirtiéndolo en un destino querido en el corazón de Roma."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 8: Design Philosophy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-24 md:mb-40">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1xwwm8qTPTaFktoSelqGyTUz5tYsOCK7W")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1xwwm8qTPTaFktoSelqGyTUz5tYsOCK7W" 
                            alt="Edere Design Philosophy"
                          />
                        </div>
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Design Philosophy</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Meticulous attention to visual storytelling and material integrity ensures every branding detail resonates with Rome's artisanal excellence."
                            ) : lang === 'fr' ? (
                              "Une attention méticuleuse à la narration visuelle et à l'intégrité des matériaux garantit que chaque détail de branding résonne avec l'excellence de Rome."
                            ) : (
                              "La atención meticulosa a la narrativa visual y la integridad de los materiales asegura que cada detalle de branding resuene con la excelencia artesanal de Roma."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 9: Brand Extension */}
                      <div className="space-y-12 mb-24 md:mb-40">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1nzAd11wQwe07yeFdZdSLS2-xexHfCIsa")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1nzAd11wQwe07yeFdZdSLS2-xexHfCIsa" 
                            alt="Edere Brand Extension"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Brand Extension</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Expanding the visual language across various touchpoints ensures a cohesive and powerful brand presence that resonates at every scale."
                            ) : lang === 'fr' ? (
                              "L'extension de l'identité visuelle sur différents supports garantit une présence de marque cohérente et puissante à chaque échelle."
                            ) : (
                              "Expandir el lenguaje visual a través de diversos puntos de contacto asegura una presencia de marca cohesiva y poderosa que resuena en cada escala."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.title === "Integrated Marketing Campaign" ? (
                    <>
                      {/* Campaign Section 1: Visual Identity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Campaign Design</span>
                          <div className="space-y-6">
                            <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                              {lang === 'en' ? (
                                "ONEup specializes in crafting impactful marketing campaigns for your brand, both in physical spaces and online. Our focus is on creating memorable experiences that leverage the latest technology, from interactive screens to data capture initiatives."
                              ) : lang === 'fr' ? (
                                "ONEup se spécialise dans la création de campagnes marketing percutantes pour votre marque, tant dans les espaces physiques qu'en ligne."
                              ) : (
                                "ONEup se especializa en crear campañas de marketing impactantes para su marca, tanto en espacios físicos como online."
                              )}
                            </p>
                            <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                              {lang === 'en' ? (
                                "By integrating innovative solutions, we ensure that your campaigns not only stand out but also engage your audience effectively, using experimental digital and print to convey your brand message in today's market. Let us help you elevate your brand presence and connect with customers in meaningful ways."
                              ) : lang === 'fr' ? (
                                "En intégrant des solutions innovantes, nous veillons à ce que vos campagnes se démarquent et engagent votre public efficacement."
                              ) : (
                                "Al integrar soluciones innovadoras, nos aseguramos de que sus campañas no solo se destaquen sino que también involucren a su audiencia de manera efectiva."
                              )}
                            </p>
                          </div>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1QRwzjvDFCvj300hn5OBdpjgYEOx626py")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1QRwzjvDFCvj300hn5OBdpjgYEOx626py" 
                            alt="Campaign Design Strategy"
                          />
                        </div>
                      </div>

                      {/* Campaign Section 2: Detailed Execution */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1SQmNFdF01PdC0wBREQlofEXLhd6i9XfT")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1SQmNFdF01PdC0wBREQlofEXLhd6i9XfT" 
                            alt="Physical and Online Campaign Detail Work"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Campaign Section 3: Motion Experience */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1Lr4S469gDL8yvA4-DjDWdAuX17PzdlhB")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1Lr4S469gDL8yvA4-DjDWdAuX17PzdlhB" 
                            alt="Campaign Motion Experience"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Campaign Section 4: Physical Engagement */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1u0EskKOHj0n5i53wG2XJi9z4bxLVqLuu")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1u0EskKOHj0n5i53wG2XJi9z4bxLVqLuu" 
                            alt="Physical Marketing Engagement"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Campaign Section 5: Brand Presence */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1OiRPp_ywOrfgWl_xMc2XftvMo50NTfzw")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1OiRPp_ywOrfgWl_xMc2XftvMo50NTfzw" 
                            alt="Physical Marketing Brand Presence"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Campaign Section 6: Digital & Physical Integration */}
                      <div className="space-y-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/18aRHBJ0NPKGpTnVHT51KAl-ZvIoD2PTL")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/18aRHBJ0NPKGpTnVHT51KAl-ZvIoD2PTL" 
                            alt="Integrated Strategy Visual"
                            cinematic={true}
                          />
                        </div>
                      </div>

                      {/* Campaign Section 7: Global Campaign Strategy */}
                      <div className="space-y-12 pb-12">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1xZLp2sYZh1WetJBLOzffBLRF0YuYrmMh")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1xZLp2sYZh1WetJBLOzffBLRF0YuYrmMh" 
                            alt="Global Campaign Integrated Strategy"
                            cinematic={true}
                          />
                        </div>
                        
                        <div className="max-w-3xl space-y-6">
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            Integrated marketing campaigns featuring signage throughout the city and at the football stadium aim to enhance brand awareness. Users can engage with the brand app by scanning QR codes, which allows them to participate in special events and win prizes.
                          </p>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            This strategy not only fosters brand recognition but also encourages customer loyalty. By creating interactive experiences, the campaign effectively connects with the audience, driving both engagement and retention.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Generic Project Alternating Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                            <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                              {lang === 'en' ? (
                                `A deep dive into the creative process for ${selectedProject.title}. We focused on delivering a unique visual language that resonates with the target audience while maintaining technical excellence.`
                              ) : lang === 'fr' ? (
                                `Une plongée profonde dans le processus créatif pour ${selectedProject.title}. Nous nous sommes concentrés sur la création d'un langage visuel unique qui résonne avec le public cible.`
                              ) : (
                                `Una inmersión profunda en el proceso creativo para ${selectedProject.title}. Nos enfocamos en ofrecer un lenguaje visual único que resuene con el público objetivo.`
                              )}
                            </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square md:aspect-[4/3]"
                          onClick={() => setFullscreenImage(`https://picsum.photos/seed/${selectedProject.id + 100}/1200/800`)}
                        >
                          <SubtleMotionImage 
                            src={`https://picsum.photos/seed/${selectedProject.id + 100}/1200/800`} 
                            alt="Detail 1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-2xl aspect-square md:aspect-[4/3]"
                          onClick={() => setFullscreenImage(`https://picsum.photos/seed/${selectedProject.id + 200}/1200/800`)}
                        >
                          <SubtleMotionImage 
                            src={`https://picsum.photos/seed/${selectedProject.id + 200}/1200/800`} 
                            alt="Detail 2"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <p className="text-lg text-black/60 leading-relaxed italic">
                            {lang === 'en' ? (
                              "The integration of modern design principles allowed us to achieve a seamless user experience that feels both familiar and avant-garde."
                            ) : lang === 'fr' ? (
                              "L'intégration de principes de design modernes nous a permis d'atteindre une expérience utilisateur fluide."
                            ) : (
                              "La integración de principios de diseño modernos nos permitió lograr una experiencia de usuario fluida."
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </main>

              <footer className="px-6 md:px-12 py-12 border-t border-black/10 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold hover:text-accent transition-colors"
                >
                  {t[lang].modal.close}
                </button>
                <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/20">
                  oneup © 2025 {lang === 'en' ? 'Graphic Design & Marketing Studio' : 'Studio de design / Atelier de création'}
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') nextFullscreenImage();
              if (e.key === 'ArrowLeft') prevFullscreenImage();
              if (e.key === 'Escape') setFullscreenImage(null);
            }}
          >
            {/* Background Overlay to close */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setFullscreenImage(null)} 
            />

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}
              className="absolute top-8 right-8 z-50 p-2 text-white/50 hover:text-white transition-colors group"
            >
              <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center select-none">
              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 pointer-events-none z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevFullscreenImage();
                  }}
                  className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all pointer-events-auto group backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextFullscreenImage();
                  }}
                  className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all pointer-events-auto group backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {fullscreenImage === "https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez" ? (
                <div className="relative w-full max-w-[90vw] h-[90vh] overflow-hidden rounded-2xl bg-transparent">
                  <motion.div 
                    className="w-full flex flex-col"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      duration: 80,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <img 
                      src="https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez" 
                      alt="Pulso Health Panorama Fullscreen"
                      className="w-full h-auto object-cover flex-shrink-0 opacity-80"
                      style={{ filter: 'brightness(1.05) blur(0.6px)' }}
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src="https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez" 
                      alt="Pulso Health Panorama Duplicate Fullscreen"
                      className="w-full h-auto object-cover flex-shrink-0 opacity-80"
                      style={{ filter: 'brightness(1.05) blur(0.6px)' }}
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                  {/* Subtle Gradients to fade edges - Softened */}
                  <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-neutral-50/40 via-neutral-50/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-neutral-50/40 via-neutral-50/10 to-transparent pointer-events-none" />
                  
                  {/* Click area to go next */}
                  <div 
                    className="absolute inset-0 z-10 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      nextFullscreenImage();
                    }} 
                  />
                </div>
              ) : (
                <FullscreenPreloaderImage 
                  src={fullscreenImage} 
                  alt="Fullscreen view" 
                  onNext={nextFullscreenImage} 
                />
              )}

              {fullscreenImage === "https://lh3.googleusercontent.com/d/126FAgbfA4FCK8e5Ym6OCZKgsoF5SKenI" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, letterSpacing: "0.2em" }}
                    animate={{ opacity: 1, scale: 1, letterSpacing: "1.2em" }}
                    transition={{ 
                      duration: 4, 
                      delay: 0.6, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="text-white text-4xl md:text-[10vw] font-black uppercase tracking-[1.2em] whitespace-nowrap drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-10 text-center w-full"
                  >
                    40.7246° N, 74.0019° W
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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




