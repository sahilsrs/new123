import React, { useEffect, useMemo, useState } from 'react';
import { Play, X, Mail, ArrowUpRight, MapPin, Globe, Download, Award, BookOpen, Music, Film, Smartphone, Sun, Moon, TrendingUp, CheckCircle2, Share2, Box, Mic, ExternalLink, Landmark, Quote, ShoppingBag, Sparkles, Disc, Briefcase, Phone } from 'lucide-react';
import profileImage from './assets/profile-photo.jpeg';
import davinciLogo from './assets/davinci-resolve-logo-from-doc.png';

const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1492691523567-30730029ad0a?q=80&w=1000&auto=format&fit=crop";

const getYoutubeId = (url = "") => {
  const embedMatch = url.match(/\/embed\/([^/?]+)/);
  if (embedMatch?.[1]) return embedMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^/?]+)/);
  if (shortMatch?.[1]) return shortMatch[1];

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return watchMatch[1];

  const shortsMatch = url.match(/\/shorts\/([^/?]+)/);
  if (shortsMatch?.[1]) return shortsMatch[1];

  return null;
};

const getDriveId = (url = "") => {
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch?.[1]) return openMatch[1];

  return null;
};

const getThumbnailSources = ({ url, thumb, fallback = DEFAULT_FALLBACK_IMG }) => {
  const sources = [];

  if (thumb) sources.push(thumb);

  if (!url) {
    sources.push(fallback);
    return [...new Set(sources)];
  }

  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    sources.push(
      `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    );
  }

  const driveId = getDriveId(url);
  if (driveId) {
    sources.push(
      `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`,
      `https://lh3.googleusercontent.com/d/${driveId}=w1600`,
      `https://drive.google.com/uc?export=view&id=${driveId}`
    );
  }

  if (!youtubeId && !driveId) {
    sources.push(url);
  }

  sources.push(fallback);

  return [...new Set(sources.filter(Boolean))];
};

const withQueryParams = (url, params) => {
  const [base, query = ""] = url.split("?");
  const searchParams = new URLSearchParams(query);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, value);
  });

  const nextQuery = searchParams.toString();
  return nextQuery ? `${base}?${nextQuery}` : base;
};

const getSiteOrigin = () => {
  if (typeof window === "undefined") return "";
  const origin = window.location?.origin;
  if (!origin || origin === "null") return "";
  return origin;
};

const getPlatformType = (url = "") => {
  if (getDriveId(url)) return "drive";
  if (getYoutubeId(url)) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  return "web";
};

const getPlayableUrl = (url = "") => {
  if (!url) return url;
  const siteOrigin = getSiteOrigin();

  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return withQueryParams(`https://www.youtube.com/embed/${youtubeId}`, {
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      mute: "1",
      origin: siteOrigin || undefined,
      widget_referrer: siteOrigin || undefined
    });
  }

  const driveId = getDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }

  if (url.includes("instagram.com")) {
    const instaMatch = url.match(/instagram\.com\/(reels?|p)\/([^/?#]+)/);
    if (instaMatch?.[1] && instaMatch?.[2]) {
      const contentType = instaMatch[1] === "reels" ? "reel" : instaMatch[1];
      return withQueryParams(`https://www.instagram.com/${contentType}/${instaMatch[2]}/embed/captioned/`, {
        autoplay: "1"
      });
    }
  }

  return url;
};

const getSourceUrl = (url = "") => {
  if (!url) return url;

  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  const driveId = getDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/view`;
  }

  if (url.includes("instagram.com")) {
    const instaMatch = url.match(/instagram\.com\/(reels?|p)\/([^/?#]+)/);
    if (instaMatch?.[1] && instaMatch?.[2]) {
      const contentType = instaMatch[1] === "reels" ? "reel" : instaMatch[1];
      return `https://www.instagram.com/${contentType}/${instaMatch[2]}/`;
    }
  }

  return url;
};

const ThumbnailImage = ({ url, thumb, alt, className, fallback = DEFAULT_FALLBACK_IMG }) => {
  const sources = useMemo(
    () => getThumbnailSources({ url, thumb, fallback }),
    [url, thumb, fallback]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [sources]);

  const handleError = () => {
    setActiveIndex((current) => (current < sources.length - 1 ? current + 1 : current));
  };

  return (
    <img
      src={sources[activeIndex]}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};

const EmbeddedPlayer = ({ project, className, title }) => {
  const mediaUrl = project?.videoUrl || project?.url || "";
  const sourceUrl = project?.sourceUrl || mediaUrl;
  const platformType = project?.platformType || getPlatformType(sourceUrl);
  const iframeUrl =
    platformType === "drive"
      ? getPlayableUrl(sourceUrl)
      : mediaUrl;

  return (
    <iframe
      key={iframeUrl}
      src={iframeUrl}
      title={title}
      className={className}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      frameBorder="0"
    ></iframe>
  );
};

const App = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePodcastId, setActivePodcastId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fallbackImg = DEFAULT_FALLBACK_IMG;

  // Contact Constants
  const contactInfo = {
    phone: "9326349121",
    email: "tatkekomal@gmail.com",
    linkedin: "https://www.linkedin.com/in/komal-tatke-8a8192236/"
  };

  const openProject = (project) => {
    const sourceUrl = project.videoUrl || project.url;
    const normalizedSourceUrl = getSourceUrl(sourceUrl);
    setActivePodcastId(null);
    window.location.href = normalizedSourceUrl;
  };

  // 1. Podcast Highlights
  const podcasts = [
    { id: "pod-1", title: "Podcast Highlight #1", platform: "YouTube", url: "https://www.youtube.com/shorts/AsxI829nfnY", thumb: "/thumbnails/pod-1.jpg" },
    { id: "pod-2", title: "Podcast Highlight #2", platform: "YouTube", url: "https://www.youtube.com/shorts/drCYpsql3HI", thumb: "/thumbnails/pod-2.jpg" },
    { id: "pod-3", title: "Podcast Highlight #3", platform: "YouTube", url: "https://www.youtube.com/shorts/Q_DlpZz827s", thumb: "/thumbnails/pod-3.jpg" },
    { id: "pod-4", title: "Podcast Highlight #4", platform: "Google Drive", url: "https://drive.google.com/file/d/1cvISx8C0136p3ieZ6HJjqKT9UpI0YPDA/view?usp=sharing", thumb: "/thumbnails/pod-4.jpg" }
  ];

  // 2. Motion Graphics
  const motionGraphics = [
    { id: "motion-1", title: "Royal Sundara", category: "Infographics / Motion", url: "https://drive.google.com/file/d/1aE0I16SNjLbVIDROXAYYGgmgb3Inn68j/view?usp=sharing", thumb: "/thumbnails/motion-1.jpg" },
    { id: "motion-2", title: "HDFC Sky", category: "Title Design", url: "https://drive.google.com/file/d/1sUQC77Ydpi4rJMuFWXVbNRsngYQUwgf8/view?usp=sharing", thumb: "/thumbnails/motion-2.jpg" },
    { id: "motion-3", title: "Athena", category: "Experimental", url: "https://drive.google.com/file/d/1Tp-FZx_bxsRvaxqKsmEAFJcEy24MwiCX/view?usp=sharing", thumb: "/thumbnails/motion-3.jpg" },
    { id: "motion-4", title: "Utkarsh Small Finance Bank", category: "VFX / Animation", url: "https://drive.google.com/file/d/1C6C_NVWX4zeWaPrp-XfCxMysS4buQEAJ/view?usp=sharing", thumb: "/thumbnails/motion-4.jpg" }
  ];

  // 3. Testimonials
  const testimonials = [
    { id: "test-1", title: "Client Feedback #1", client: "Brand Partner", url: "https://drive.google.com/file/d/18GO8NAu2Mfqa2J-N7iCE-34lfnbhzJhC/view?usp=sharing", thumb: "/thumbnails/test-1.jpg" },
    { id: "test-2", title: "Client Feedback #2", client: "Creative Director", url: "https://drive.google.com/file/d/12pf7Nfa7DcvDjWH2rUZHSKjGUlfX0AfQ/view?usp=sharing", thumb: "/thumbnails/test-2.jpg" },
    { id: "test-3", title: "Client Feedback #3", client: "Music Producer", url: "https://drive.google.com/file/d/1GLbWysDZs497pwXGqruDysHaj5Doj5CS/view?usp=sharing", thumb: "/thumbnails/test-3.jpg" }
  ];

  // 4. BFSI
  const bfsiProjects = [
    { id: "bfsi-1", title: "HDFC Sky Campaign", category: "BFSI / Commercial", url: "https://drive.google.com/file/d/1o85NXR7EPACRb0yoddQxDJtTi2eFtm1d/view?usp=sharing", thumb: "/thumbnails/bfsi-1.jpg" },
    { id: "bfsi-2", title: "Utkarsh Small Finance Bank Campaign", category: "BFSI / Motion Graphics", url: "https://drive.google.com/file/d/1YrYdfK9nh0XMiKdHRKY01tffAC2Lve-E/view?usp=sharing", thumb: "/thumbnails/bfsi-2.jpg" }
  ];

  // 5. Music
  const musicProjects = [
    { id: "music-1", title: "AT Azaad Visual", url: "https://www.instagram.com/reel/DWnhtvUIUnY/?igsh=MWUzcmo4bWptb2M4NQ==", thumb: "/thumbnails/music-1.jpg" },
    { id: "music-2", title: "Rhythmic Flow", url: "https://www.instagram.com/reels/DVTZjS4DJ8y/", thumb: "/thumbnails/music-2.jpg" },
    { id: "music-3", title: "Label Showcase", url: "https://www.instagram.com/reel/DUGB0FWjJQg/?igsh=dm95ZnpucHhvODVv", thumb: "/thumbnails/music-3.jpg" },
    { id: "music-4", title: "Artist Spotlight", url: "https://www.instagram.com/reel/DWT0BiiiC40/?igsh=azBqaHh3cDIzN2J0", thumb: "/thumbnails/music-4.jpg" },
    { id: "music-5", title: "Studio Sessions", url: "https://www.instagram.com/p/DWI0UkwCO5L/", thumb: "/thumbnails/music-5.jpg" },
    { id: "music-6", title: "Visual Narrative", url: "https://www.instagram.com/p/DTh3q6iiF68/", thumb: "/thumbnails/music-6.jpg" },
    { id: "music-7", title: "Music Visual #7", url: "https://www.instagram.com/p/DSkV-hjCGbg/", thumb: "/thumbnails/music-7.jpg" },
    { id: "music-8", title: "Music Visual #8", url: "https://www.instagram.com/p/DPglgjiAGvV/", thumb: "/thumbnails/music-8.jpg" },
    { id: "music-9", title: "Music Visual #9", url: "https://www.instagram.com/p/DVOUdUhDA5Z/", thumb: "/thumbnails/music-9.jpg" },
    { id: "music-10", title: "Music Visual #10", url: "https://www.instagram.com/p/DVTMtgOiR4D/", thumb: "/thumbnails/music-10.jpg" },
    { id: "music-11", title: "Music Visual #11", url: "https://www.instagram.com/p/DP6cv9qjMG8/", thumb: "/thumbnails/music-11.jpg" },
    { id: "music-12", title: "Music Visual #12", url: "https://www.instagram.com/p/DUlEjiNDGI8/", thumb: "/thumbnails/music-12.jpg" }
  ];

  // 6. Drools
  const droolsProjects = [
    { id: "drools-1", title: "Drools Brand Showcase", category: "Food / Commercial", url: "https://drive.google.com/file/d/1vSLFCrqKRd1DOiC1AY8HJ9col-_lgI86/view?usp=sharing", thumb: "/thumbnails/drools-1.jpg" }
  ];

  // 7. Licious
  const liciousProjects = [
    { id: "licious-1", title: "Licious Brand Showcase", category: "Retail / Food Brand", url: "https://drive.google.com/file/d/1CUdlT4hQW76MyQdL647hH_p2XH_bftDO/view?usp=sharing", thumb: "/thumbnails/licious-1.jpg" },
    { id: "licious-2", title: "Licious Product Narrative", category: "Commercial / Editorial", url: "https://drive.google.com/file/d/1usUA8kWO_kv5tsJjIreNKDobeADdo_T2/view?usp=sharing", thumb: "/thumbnails/licious-2.jpg" }
  ];

  // 8. Fashion
  const fashionProjects = [
    { id: "fashion-1", title: "Cinematic Fashion Edit I", category: "Fashion / Lifestyle", url: "https://drive.google.com/file/d/1igcqQPy9YScTuelb40Nvwb5pfp-uKvRH/view?usp=sharing", thumb: "/thumbnails/fashion-1.jpg" },
    { id: "fashion-2", title: "Cinematic Fashion Edit II", category: "Fashion / Visuals", url: "https://drive.google.com/file/d/1XkwIXnIXKM9iWtRN55lSOa2e30oE3y0m/view?usp=sharing", thumb: "/thumbnails/fashion-2.jpg" },
    { id: "fashion-3", title: "Cinematic Fashion Edit III", category: "Fashion / Editorial", url: "https://drive.google.com/file/d/1dxgO9G-iiA3As--83xpH--_p0yYdLZXP/view?usp=sharing", thumb: "/thumbnails/fashion-3.jpg" }
  ];

  // 9. Corporate
  const corporateProjects = [
    {
      id: "corp-1",
      title: "Corporate Brand Narrative",
      category: "Corporate / B2B",
      url: "https://drive.google.com/file/d/12JMTvtuoccreU0VJiF-RF0j4yeDU9Pn6/view?usp=sharing",
      thumb: "/thumbnails/corp-1.jpg"
    },
    {
      id: "corp-2",
      title: "Corporate Project II",
      category: "Corporate / B2B",
      url: "https://drive.google.com/file/d/1i5sxS97VK07id2huc2sx-JCPy5TOWOki/view?usp=drive_link",
      thumb: "/thumbnails/corp-2.jpg"
    }
  ];

  const expertise = ["Video Editing", "Product Shoots", "Social Media Handling", "Professional Videography", "Motion Graphics", "Content Creation", "Graphic Designing", "Photography"];
  
  const software = [
    { name: "Davinci Resolve", icon: davinciLogo },
    { name: "After Effects", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg" },
    { name: "Premiere Pro", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" },
    { name: "Photoshop", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" },
    { name: "Illustrator", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" }
  ];

  return (
    <div className={`hq-grain ${isDarkMode ? 'hq-grain-dark text-white' : 'hq-grain-light text-zinc-900'} min-h-screen font-sans transition-colors duration-500 overflow-x-hidden pb-20`}>
      
      {/* HERO SECTION */}
      <section className={`relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`absolute top-8 right-8 z-50 p-3 rounded-full transition-all duration-300 shadow-xl ${isDarkMode ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700' : 'bg-white text-zinc-800 shadow-md hover:bg-zinc-50'}`}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="absolute top-12 left-0 right-0 px-8 flex justify-between uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold opacity-40">
          <span>Video Editor</span>
          <span>Work Portfolio</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h1 className={`text-[22vw] font-black tracking-tighter leading-none opacity-[0.08] ${isDarkMode ? 'text-white' : 'text-black'}`}>PORTFOLIO</h1>
        </div>
        <div className="relative z-10 w-full max-w-lg md:max-w-2xl px-4 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-64 md:w-80 overflow-hidden transition-all duration-700 ease-in-out shadow-2xl rounded-sm">
            <img src={profileImage} alt="Komal Tatke" className="w-full h-full object-cover" onError={(e) => e.target.src = fallbackImg}/>
            <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDarkMode ? 'from-zinc-950' : 'from-stone-50'}`}></div>
          </div>
          <div className="mt-8 text-center md:absolute md:bottom-[-20%] md:left-[-10%] md:text-left">
            <p className="text-2xl md:text-4xl font-bold tracking-tight"><span className="text-yellow-400 mr-4 font-normal">//</span>Komal Tatke</p>
            <p className="text-xl md:text-2xl font-light text-zinc-500 mt-1 uppercase tracking-widest">Video Editor / Visual Designer</p>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <div className={`w-full py-6 border-b ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 group transition-colors hover:text-yellow-400">
            <div className="p-2 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400 group-hover:text-white transition-all">
              <Phone size={16} />
            </div>
            <span className="text-sm font-mono tracking-widest">{contactInfo.phone}</span>
          </a>
          <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 group transition-colors hover:text-yellow-400 max-w-full">
            <div className="p-2 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400 group-hover:text-white transition-all">
              <Mail size={16} />
            </div>
            <span className="text-sm font-mono tracking-wide normal-case break-all md:break-normal">{contactInfo.email}</span>
          </a>
          <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group transition-colors hover:text-yellow-400">
            <div className="p-2 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400 group-hover:text-white transition-all">
              <Globe size={16} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">LinkedIn Profile</span>
          </a>
        </div>
      </div>

      {/* PROFILE SECTION - Updated with user image */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="relative w-full max-w-sm shrink-0">
            <div className="absolute -left-4 -top-4 w-full h-full border-2 border-yellow-400 z-0"></div>
            <div className="relative z-10 aspect-[4/5] overflow-hidden transition-all duration-700 bg-zinc-800 rounded-sm shadow-xl">
               <img 
                 src={profileImage}
                 className="w-full h-full object-cover" 
                 alt="Komal Tatke" 
                 onError={(e) => {
                   // Generic fallback that matches the aesthetic if the local file isn't found
                   e.target.src = "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1000&auto=format&fit=crop";
                 }}
               />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Hi, I am <span className="text-yellow-400">Komal Tatke</span></h2>
              <div className={`space-y-4 text-lg md:text-xl font-light leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <p>Passionate creator specializing in Video Editing, Motion Design, and AI-driven Visual Storytelling, with over four years of professional experience shaping ideas into compelling visual narratives.</p>
                <p>My work exists at the intersection of creativity and technology, where I blend storytelling instinct with evolving AI tools to create visuals that feel both contemporary and meaningful.</p>
                <p>With a keen eye for detail, rhythm, and composition, I approach every project with a balance of creative exploration and strategic thinking so each piece aligns with its narrative while standing out in a fast-paced digital landscape.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
              <div className="flex items-center gap-4"><div className="w-1 h-12 bg-yellow-400"></div><div><p className="text-2xl font-black">4+ yrs</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Experience</p></div></div>
              <div className="flex items-center gap-4"><div className="w-1 h-12 bg-yellow-400"></div><div><p className="text-2xl font-black">500+</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Videos Done</p></div></div>
              <div className="flex items-center gap-4"><div className="w-1 h-12 bg-yellow-400"></div><div><p className="text-2xl font-black">50+</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Brands</p></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-10">
          <ArrowUpRight className="text-yellow-400" size={32} />
          <h3 className="text-3xl font-black uppercase tracking-tighter">Expertise & Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="grid grid-cols-1 gap-y-4">
            {expertise.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                 <p className={`text-lg font-medium tracking-tight ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{item}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-start">
            {software.map((tool, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 p-2 rounded-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'} border flex items-center justify-center`}>
                  <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" />
                </div>
                <p className="font-bold text-[8px] uppercase tracking-widest text-center">{tool.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. PODCAST SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
          <div className="flex items-center gap-3">
            <Mic className="text-yellow-400" size={32} />
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Podcast <span className="text-yellow-400 italic">Highlights</span></h3>
          </div>
          <a href="https://drive.google.com/drive/folders/1PaXQakOU9u2nYo_gBAXpZDXokTlQj7ZC" target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-2 text-xs uppercase tracking-widest font-bold border-b-2 pb-1 transition-all ${isDarkMode ? 'border-yellow-400/30 hover:border-yellow-400' : 'border-yellow-200 hover:border-yellow-400'}`}>
            View Full Library <ExternalLink size={14} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {podcasts.map((pod) => {
            const isActive = activePodcastId === pod.id;
            const playableUrl = getPlayableUrl(pod.url);
            const playableProject = {
              ...pod,
              platformType: getPlatformType(pod.url),
              sourceUrl: getSourceUrl(pod.url),
              videoUrl: playableUrl
            };

            return (
              <div key={pod.id} className="space-y-4">
                <div
                  onClick={() => {
                    window.location.href = getSourceUrl(pod.url);
                  }}
                  className="group cursor-pointer"
                >
                  <div className={`aspect-[9/16] w-full overflow-hidden rounded-2xl border transition-all duration-500 relative ${isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
                    {isActive ? (
                      <EmbeddedPlayer
                        project={playableProject}
                        title={pod.title}
                        className="w-full h-full"
                      />
                    ) : (
                      <>
                        <ThumbnailImage
                          url={pod.url}
                          thumb={pod.thumb}
                          alt={pod.title}
                          fallback={fallbackImg}
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="p-4 bg-yellow-400 rounded-full text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-500"><Play size={24} fill="currentColor" /></div>
                        </div>
                      </>
                    )}
                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePodcastId(null);
                        }}
                        className="absolute right-2 top-2 z-20 rounded-full bg-black/60 p-1.5 text-white hover:rotate-90 transition-transform"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className={`px-2 font-bold uppercase tracking-tight text-xs transition-colors ${isActive ? 'text-yellow-400' : 'hover:text-yellow-400'}`}>{pod.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. MOTION GRAPHICS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <ArrowUpRight className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Motion <span className="text-yellow-400">Graphics</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {motionGraphics.map((item) => (
            <div key={item.id} onClick={() => openProject(item, { role: item.category })} className="group cursor-pointer flex flex-col md:flex-row gap-6 p-6 transition-all border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 rounded-xl">
              <div className="w-full md:w-56 aspect-video overflow-hidden rounded-lg relative bg-zinc-900 border border-zinc-800 shrink-0">
                <ThumbnailImage
                  url={item.url}
                  thumb={item.thumb}
                  alt={item.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"><Play size={24} className="text-white fill-white" /></div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-lg md:text-xl font-semibold uppercase tracking-tight leading-tight text-yellow-400">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIALS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Quote className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter"><span className="text-yellow-400 italic">Testimonials</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div key={test.id} onClick={() => openProject(test)} className="group cursor-pointer space-y-6">
              <div className={`aspect-video w-full overflow-hidden rounded-xl border-2 transition-all duration-500 relative ${isDarkMode ? 'border-zinc-800 bg-zinc-900 group-hover:border-yellow-400/50' : 'border-zinc-200 bg-white group-hover:border-yellow-400/30 shadow-sm'}`}>
                <ThumbnailImage
                  url={test.url}
                  thumb={test.thumb}
                  alt={test.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"><div className="p-4 bg-white text-yellow-400 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500"><Play size={20} fill="currentColor" /></div></div>
              </div>
              <div className="px-2 border-l-2 border-yellow-400/20 group-hover:border-yellow-400 transition-colors pl-4">
                <h4 className="font-bold uppercase tracking-tight text-lg group-hover:text-yellow-400 transition-colors leading-none">{test.title}</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2 font-black">{test.client}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BFSI SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Landmark className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">BFSI <span className="text-yellow-400 italic">Campaigns</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {bfsiProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play size={48} className="text-white fill-white" /></div>
              </div>
              <div className="mt-6">
                <p className="text-yellow-400 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-yellow-400 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MUSIC SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
          <div className="flex items-center gap-3">
            <Disc className="text-yellow-400" size={32} />
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter"><span className="text-yellow-400 italic">Music</span></h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {musicProjects.map((music) => (
            <div key={music.id} onClick={() => openProject(music, { isVertical: true })} className="group cursor-pointer aspect-square relative overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
              <ThumbnailImage
                url={music.url}
                thumb={music.thumb}
                alt={music.title}
                fallback={fallbackImg}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-[10px] font-black uppercase tracking-tighter text-white">{music.title}</p>
                <div className="mt-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"><Play size={10} className="fill-white text-white" /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DROOLS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Film className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter"><span className="text-yellow-400 italic">Drools</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {droolsProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play size={48} className="text-white fill-white" /></div>
              </div>
              <div className="mt-6">
                <p className="text-yellow-400 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-yellow-400 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LICIOUS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <ShoppingBag className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter"><span className="text-yellow-400 italic">Food</span> Campaigns</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {liciousProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play size={48} className="text-white fill-white" /></div>
              </div>
              <div className="mt-6">
                <p className="text-yellow-400 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-yellow-400 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FASHION SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Sparkles className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Fashion <span className="text-yellow-400 italic">Visuals</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fashionProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className={`aspect-[4/5] w-full overflow-hidden rounded-xl border-2 transition-all duration-700 relative ${isDarkMode ? 'border-zinc-800 bg-zinc-900 group-hover:border-yellow-400/50' : 'border-zinc-200 bg-white group-hover:border-yellow-400/30'}`}>
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play size={40} className="text-white fill-white" /></div>
              </div>
              <div className="mt-6 px-2">
                <p className="text-yellow-400 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-xl font-bold uppercase tracking-tight group-hover:text-yellow-400 transition-colors leading-tight">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CORPORATE SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Briefcase className="text-yellow-400" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Corporate <span className="text-yellow-400 italic">Solutions</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {corporateProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play size={48} className="text-white fill-white" /></div>
              </div>
              <div className="mt-6">
                <p className="text-yellow-400 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-yellow-400 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-20 px-6 md:px-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 ${isDarkMode ? 'border-zinc-700/70 bg-black/45 backdrop-blur-[1px]' : 'border-zinc-300/70 bg-white/70 backdrop-blur-[1px]'}`}>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black uppercase tracking-tighter">Komal Tatke</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] mt-2">Visual Designer & Video Editor</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-8 text-sm uppercase tracking-widest font-bold">
             <a href={`mailto:${contactInfo.email}`} className="hover:text-yellow-400 transition-colors">Email</a>
             <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">LinkedIn</a>
          </div>
          <div className="space-y-1 text-center md:text-right">
            <a href={`mailto:${contactInfo.email}`} className="block text-sm font-mono text-zinc-300 break-all hover:text-yellow-400 transition-colors">
              <span className="text-zinc-500 mr-2">Email:</span>{contactInfo.email}
            </a>
            <a href={`tel:${contactInfo.phone}`} className="block text-sm font-mono text-zinc-300 tracking-wider hover:text-yellow-400 transition-colors">
              <span className="text-zinc-500 mr-2">Phone:</span>{contactInfo.phone}
            </a>
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="block text-sm font-mono text-zinc-300 break-all hover:text-yellow-400 transition-colors">
              <span className="text-zinc-500 mr-2">LinkedIn:</span>{contactInfo.linkedin}
            </a>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-600">(c) 2026 Crafted for Impact.</div>
      </footer>

      {/* VIDEO MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={() => setSelectedProject(null)}></div>
          <div className={`relative w-full z-10 border border-zinc-800 shadow-2xl overflow-hidden bg-zinc-950 ${selectedProject.isVertical ? 'max-w-[400px] aspect-[9/16]' : 'max-w-5xl aspect-video'}`}>
            <a
              href={selectedProject.sourceUrl || selectedProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-widest text-zinc-200 hover:text-yellow-400 transition-colors"
            >
              Open Video <ExternalLink size={14} />
            </a>
            <button onClick={() => setSelectedProject(null)} className="absolute right-3 top-3 z-20 rounded-full bg-black/60 p-2 text-white hover:rotate-90 transition-transform"><X size={20} /></button>
            <div className="w-full h-full bg-black">
              <EmbeddedPlayer
                project={selectedProject}
                title={selectedProject.title || "Project video"}
                className="w-full h-full"
              />
            </div>
            {!selectedProject.isVertical && (
              <div className="p-8 bg-zinc-950 border-t border-zinc-800 text-white">
                <h4 className="text-3xl font-black uppercase tracking-tight mb-2">{selectedProject.title}</h4>
                <p className="text-base text-zinc-400">{selectedProject.description || "Professional project showcase."}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


