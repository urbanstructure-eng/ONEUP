/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, animate } from 'motion/react';
import { Instagram, Twitter, Linkedin, ChevronUp, X, ChevronLeft, ChevronRight, Send, ArrowUpRight, Smile, Menu, Play, Pause } from 'lucide-react';
import ReactPlayer from 'react-player';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  heroImage?: string;
  colSpan: string;
  contain?: boolean;
  location?: string;
}

const PROJECTS: Project[] = [
  { id: 11, title: "Voltique", category: "Service Design", image: "https://lh3.googleusercontent.com/d/1gusf69CAd1am1JcsIyc1qiGekzmZLEUP", colSpan: "md:col-span-12" },
  { id: 12, title: "Pulso Health", category: "AI Health / Branding", image: "https://lh3.googleusercontent.com/d/1ONCooNfgYuYu5trUJrFZcZq1HxYSFZrr", colSpan: "md:col-span-4" },
  { id: 13, title: "BuyDrop", category: "Logistic Company", image: "https://lh3.googleusercontent.com/d/1qpd246hL-TbgCSgf9j2qxBk15FMW2FuF", heroImage: "https://lh3.googleusercontent.com/d/1nZNLMGhECM67AST6qbGCmYiXUhN0RF-C", colSpan: "md:col-span-4" },
  { id: 14, title: "UNITY Community Hub", category: "Community / Branding", image: "https://lh3.googleusercontent.com/d/1SaZAxfG-M0ouGb0w0wCRxmzKQ3U8S5uT", heroImage: "https://lh3.googleusercontent.com/d/1zBFr8LhCxzjxucFpkMMXeekayY2JLk9g", colSpan: "md:col-span-4" },
  { id: 15, title: "Atelier d'art", category: "Art Direction / Branding", image: "https://lh3.googleusercontent.com/d/1sAcH9tLsKt9mXswTCynb7bnRcS5qAYJT", colSpan: "md:col-span-12", location: "Paris, France" },
  { id: 1, title: "Aura Identity", category: "Branding", image: "https://picsum.photos/seed/aura/1200/800", colSpan: "md:col-span-4" },
  { id: 3, title: "Padelux", category: "Branding", image: "https://lh3.googleusercontent.com/d/1l4lV4DJ1v17tOBJxEC3l32mjxqTjTdH-", colSpan: "md:col-span-4" },
  { id: 4, title: "Nova Campaign", category: "Art Direction", image: "https://picsum.photos/seed/nova/800/800", colSpan: "md:col-span-4" },
  { id: 5, title: "Zenith Web", category: "Development", image: "https://picsum.photos/seed/zenith/800/1000", colSpan: "md:col-span-4" },
  { id: 6, title: "Pulse Motion", category: "Animation", image: "https://picsum.photos/seed/pulse/1200/675", colSpan: "md:col-span-6" },
  { id: 7, title: "Echo Sound", category: "Audio", image: "https://picsum.photos/seed/echo/1200/675", colSpan: "md:col-span-6" },
  { id: 8, title: "Stellar App", category: "Mobile", image: "https://picsum.photos/seed/stellar/1600/600", colSpan: "md:col-span-12" },
  { id: 9, title: "Flux Brand", category: "Strategy", image: "https://picsum.photos/seed/flux/800/800", colSpan: "md:col-span-6" },
  { id: 10, title: "Orbit Space", category: "Exhibition", image: "https://picsum.photos/seed/orbit/1200/750", colSpan: "md:col-span-6" },
  { id: 16, title: "edere restaurant", category: "Culinary / Branding", image: "https://lh3.googleusercontent.com/d/1xwwm8qTPTaFktoSelqGyTUz5tYsOCK7W", colSpan: "md:col-span-12", location: "Global" },
];

const SubtleMotionImage = ({ src, alt, className, objectPosition = "center", contain = false, cinematic = false }: { src: string, alt: string, className?: string, objectPosition?: string, contain?: boolean, cinematic?: boolean }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`${className} w-full h-full ${contain ? 'object-contain p-8' : 'object-cover'}`}
    style={{ objectPosition }}
    referrerPolicy="no-referrer"
    initial={{ opacity: 0, scale: cinematic ? 1.05 : 1 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: cinematic ? 2.5 : 1, ease: [0.22, 1, 0.36, 1] }}
  />
);

const CompactVideoPlayer = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube) {
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
    <div className="relative w-full h-full flex items-center justify-center bg-black group cursor-default overflow-hidden">
      <div className={`w-full h-full transition-opacity duration-700 ${isYouTube || isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {!error ? (
          isYouTube ? (
            (() => {
              const Player = ReactPlayer as any;
              return (
                <div className="absolute inset-0 pointer-events-none scale-[1.01]">
                  <Player
                    url={src}
                    playing={isPlaying}
                    loop
                    muted
                    width="100%"
                    height="100%"
                    onReady={() => setIsLoaded(true)}
                    onError={() => setError(true)}
                    config={{
                      youtube: {
                        playerVars: {
                          rel: 0, 
                          iv_load_policy: 3, 
                          modestbranding: 1,
                          disablekb: 1,
                          controls: 0,
                          showinfo: 0,
                          autohide: 1,
                          playsinline: 1
                        }
                      }
                    }}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              );
            })()
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

      {/* Modern Minimalist Controls */}
      <div className="absolute inset-0 flex items-center justify-center">
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
        className={`max-w-[90vw] max-h-[90vh] object-contain shadow-2xl cursor-pointer`}
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
        tag: 'Design & Technology',
        title: 'INNOVATIVE DIGITAL EXPERIENCES.',
        desc: 'We create innovative digital experiences tailored for the modern market, focusing on experimental concepts and effective branding strategies.',
        cta: 'Start a Project',
        scroll: 'Scroll to explore'
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
        tag: 'Our Approach',
        title: 'WE COMBINE <span className="text-accent">CREATIVITY</span> AND TECHNOLOGY TO ELEVATE BRAND PRESENCE.',
        desc: 'Our approach combines creativity and technology to engage audiences and elevate brand presence in a competitive landscape.',
        points: ['Our Approach', 'Research Driven', 'Aesthetic Precision', 'Technical Excellence']
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
        "https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez"
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
        project.image,
        "https://lh3.googleusercontent.com/d/19C-4W9Vpb5EgIzhZZO9jJB19_b10ejYO",
        "https://lh3.googleusercontent.com/d/1GY7keTnEI3Jayucac9QegpwS8rk-vOMJ",
        "https://lh3.googleusercontent.com/d/1Mux8yWx0pRNv-P3p1-92vHZH7nkO9rRh",
        "https://lh3.googleusercontent.com/d/19Gt0niVC8EL5JdpHNmsRdCLTrBeeIbcu",
        "https://lh3.googleusercontent.com/d/1KswSnGMZRZkyOOaVJXWTKkUqWwdzxTqB",
        `https://picsum.photos/seed/edere-vision/1200/800`
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
    const images = getProjectImages(selectedProject);
    const currentIndex = images.indexOf(fullscreenImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setFullscreenImage(images[nextIndex]);
  };

  const prevFullscreenImage = () => {
    if (!selectedProject || !fullscreenImage) return;
    const images = getProjectImages(selectedProject);
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
      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-12 md:py-6 flex justify-between items-center backdrop-blur-md border-b border-white/10 bg-[#1a1a1a]/80">
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
            <h1 className="text-[10vw] md:text-[7vw] font-bold leading-[0.85] tracking-tighter mb-12 text-accent">
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
          <span className="text-[13px] uppercase tracking-[0.3em] font-bold text-white/20 font-mono hidden md:block">2022 — 2024</span>
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
                  className={`w-full h-full ${project.contain ? 'object-contain p-8' : 'object-cover'} grayscale-0 lg:grayscale brightness-100 lg:brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700`}
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
            className="h-32 md:h-48 w-auto transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </a>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20 font-mono bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          © 2024 oneup. {lang === 'en' ? 'Design studio / Creative studio' : lang === 'fr' ? 'Studio de design / Atelier de création' : 'Estudio de diseño / Taller creativo'}
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
                  oneup © 2024 Design studio / Atelier de création
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
              <nav className="sticky top-0 w-full px-4 py-4 md:px-12 md:py-8 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 border-b border-black/5">
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

              <main className="flex-grow px-6 md:px-12 py-12 md:py-24 max-w-7xl mx-auto w-full">
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
                      <span className="text-sm font-medium">2024</span>
                    </div>
                    <div>
                      <span className="text-[13px] uppercase tracking-[0.2em] font-bold text-black/30 block mb-2">{t[lang].modal.role}</span>
                      <span className="text-sm font-medium">Lead Design</span>
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
                  className="aspect-video overflow-hidden bg-black/5 cursor-zoom-in rounded-sm mb-24 md:mb-40"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                            className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="relative overflow-hidden rounded-sm aspect-video md:aspect-[21/9] bg-transparent cursor-zoom-in"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                        className="relative overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video group"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="relative overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video group"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
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
                  ) : selectedProject.title === "edere restaurant" ? (
                    <>
                      {/* Edere Restaurant Section 1: Culinary Identity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Culinary Identity</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Edere restaurant redefines the culinary experience through a visual language that balances modern gastronomy with traditional warmth. The branding focuses on organic textures and a minimalist color palette."
                            ) : lang === 'fr' ? (
                              "Le restaurant Edere redéfinit l'expérience culinaire à travers un langage visuel qui équilibre gastronomie moderne et chaleur traditionnelle."
                            ) : (
                              "El restaurante Edere redefine la experiencia culinaria a través de un lenguaje visual que equilibra la gastronomía moderna con la calidez tradicional."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1xwwm8qTPTaFktoSelqGyTUz5tYsOCK7W")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1xwwm8qTPTaFktoSelqGyTUz5tYsOCK7W" 
                            alt="Edere Restaurant Visual"
                          />
                        </div>
                      </div>

                      {/* Edere Restaurant Section 2: Strategic Vision */}
                      <div className="space-y-12 mb-24 md:mb-40">
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://picsum.photos/seed/edere-vision/1200/800")}
                        >
                          <SubtleMotionImage 
                            src="https://picsum.photos/seed/edere-vision/1200/800" 
                            alt="Edere Vision"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Strategic Vision</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The project aims to create a sensory journey for every guest, where the graphic design and environmental architecture work in harmony to elevate the dining experience."
                            ) : lang === 'fr' ? (
                              "Le projet vise à créer un voyage sensoriel pour chaque convive, où le design graphique et l'architecture environnementale travaillent en harmonie."
                            ) : (
                              "El proyecto busca crear un viaje sensorial para cada comensal, donde el diseño gráfico y la arquitectura ambiental trabajen en armonía."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 3: Visual Detail */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/19C-4W9Vpb5EgIzhZZO9jJB19_b10ejYO")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/19C-4W9Vpb5EgIzhZZO9jJB19_b10ejYO" 
                            alt="Edere Visual Detail"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Visual Detail</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Attentive to detail, every branding element of the restaurant creates a tactile and memorable connection with the guest, reinforcing the restaurant's commitment to excellence."
                            ) : lang === 'fr' ? (
                              "Attentif aux détails, chaque élément de branding du restaurant crée une connexion tactile et mémorable avec le client."
                            ) : (
                              "Atento a los detalles, cada elemento de branding del restaurante crea una conexión táctil y memorable con el comensal."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 4: Brand Legacy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Brand Legacy</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The brand's legacy is built on a foundation of refined craftsmanship, where every visual element serves as a testament to the restaurant's commitment to culinary storytelling."
                            ) : lang === 'fr' ? (
                              "L'héritage de la marque repose sur un savoir-faire raffiné, où chaque élément visuel témoigne de l'engagement du restaurant."
                            ) : (
                              "El legado de la marca se basa en una artesanía refinada, donde cada elemento visual sirve como testimonio del compromiso del restaurante."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1GY7keTnEI3Jayucac9QegpwS8rk-vOMJ")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1GY7keTnEI3Jayucac9QegpwS8rk-vOMJ" 
                            alt="Edere Brand Legacy"
                          />
                        </div>
                      </div>

                      {/* Edere Restaurant Section 5: Material Connection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div 
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1Mux8yWx0pRNv-P3p1-92vHZH7nkO9rRh")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1Mux8yWx0pRNv-P3p1-92vHZH7nkO9rRh" 
                            alt="Edere Material Connection"
                          />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Material Connection</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The selection of raw materials and organic textures establishes a tactile bridge between the space and the guest, grounding the high-end experience in natural authenticity."
                            ) : lang === 'fr' ? (
                              "La sélection de matières premières et de textures organiques établit un pont tactile entre l'espace et le client."
                            ) : (
                              "La selección de materias primas y texturas orgánicas establece un puente táctil entre el espacio y el comensal."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Edere Restaurant Section 6: Gastronomic Excellence */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="space-y-6">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block">Gastronomic Excellence</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "Every plate is a canvas. The visual identity extends into the culinary presentation, where precision and creativity converge to define the new standard of modern fine dining."
                            ) : lang === 'fr' ? (
                              "Chaque assiette est une toile. L'identité visuelle s'étend jusqu'à la présentation culinaire."
                            ) : (
                              "Cada plato es un lienzo. La identidad visual se extiende hasta la presentación culinaria."
                            )}
                          </p>
                        </div>
                        <div 
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-[4/5]"
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-video md:aspect-[21/9]"
                          onClick={() => setFullscreenImage("https://lh3.googleusercontent.com/d/1KswSnGMZRZkyOOaVJXWTKkUqWwdzxTqB")}
                        >
                          <SubtleMotionImage 
                            src="https://lh3.googleusercontent.com/d/1KswSnGMZRZkyOOaVJXWTKkUqWwdzxTqB" 
                            alt="Edere Experiential Atmosphere"
                            cinematic={true}
                          />
                        </div>
                        <div className="max-w-3xl">
                          <span className="text-accent text-[13px] font-bold tracking-[0.3em] uppercase block mb-6">Experiential Atmosphere</span>
                          <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                            {lang === 'en' ? (
                              "The architectural integration of the brand ensures that the identity is felt in every corner of the space, creating an immersive atmosphere that transcends a standard dining experience."
                            ) : lang === 'fr' ? (
                              "L'intégration architecturale de la marque garantit que l'identité est ressentie dans chaque recoin de l'espace, créant une atmosphère immersive."
                            ) : (
                              "La integración arquitectónica de la marca asegura que la identidad se sienta en cada rincón del espacio, creando una atmósfera inmersiva."
                            )}
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
                          className="overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square md:aspect-[4/3]"
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
                          className="order-2 md:order-1 overflow-hidden bg-black/5 cursor-zoom-in rounded-sm aspect-square md:aspect-[4/3]"
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
                  oneup © 2024 {lang === 'en' ? 'Design studio / Atelier de création' : 'Studio de design / Atelier de création'}
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
              {fullscreenImage === "https://lh3.googleusercontent.com/d/1RVsPoBhYK0_TGE6UZB1GksNG0Nai43ez" ? (
                <div className="relative w-full max-w-[90vw] h-[90vh] overflow-hidden rounded-sm bg-transparent">
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




