import React, { useEffect, useMemo, useState } from 'react';
import { Play, X, Mail, ArrowUpRight, MapPin, Globe, Download, Award, BookOpen, Music, Film, Smartphone, Sun, Moon, TrendingUp, CheckCircle2, Share2, Box, Mic, ExternalLink, Landmark, Quote, ShoppingBag, Sparkles, Disc, Briefcase, Phone } from 'lucide-react';
import profileImage from './assets/profile-photo.jpeg';

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

const getPlayableUrl = (url = "") => {
  if (!url) return url;

  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const driveId = getDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }

  if (url.includes("instagram.com")) {
    const instaMatch = url.match(/instagram\.com\/(reels?|p)\/([^/?#]+)/);
    if (instaMatch?.[1] && instaMatch?.[2]) {
      const contentType = instaMatch[1] === "reels" ? "reel" : instaMatch[1];
      return `https://www.instagram.com/${contentType}/${instaMatch[2]}/embed`;
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

const App = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fallbackImg = DEFAULT_FALLBACK_IMG;

  // Contact Constants
  const contactInfo = {
    phone: "9326349121",
    email: "tatkekomal@gmail.com",
    linkedin: "https://www.linkedin.com/in/komal-tatke-8a8192236/"
  };

  const openProject = (project, extra = {}) => {
    setSelectedProject({
      ...project,
      ...extra,
      videoUrl: getPlayableUrl(project.videoUrl || project.url)
    });
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
    { id: "motion-1", title: "Visual Narrative Explainer", category: "Infographics / Motion", url: "https://drive.google.com/file/d/1aE0I16SNjLbVIDROXAYYGgmgb3Inn68j/view?usp=sharing", thumb: "/thumbnails/motion-1.jpg" },
    { id: "motion-2", title: "Dynamic Typography", category: "Title Design", url: "https://drive.google.com/file/d/1sUQC77Ydpi4rJMuFWXVbNRsngYQUwgf8/view?usp=sharing", thumb: "/thumbnails/motion-2.jpg" },
    { id: "motion-3", title: "Abstract Motion Flow", category: "Experimental", url: "https://drive.google.com/file/d/1Tp-FZx_bxsRvaxqKsmEAFJcEy24MwiCX/view?usp=sharing", thumb: "/thumbnails/motion-3.jpg" },
    { id: "motion-4", title: "Brand Logo Reveal", category: "VFX / Animation", url: "https://drive.google.com/file/d/1C6C_NVWX4zeWaPrp-XfCxMysS4buQEAJ/view?usp=sharing", thumb: "/thumbnails/motion-4.jpg" }
  ];

  // 3. Testimonials
  const testimonials = [
    { id: "test-1", title: "Client Feedback #1", client: "Brand Partner", url: "https://drive.google.com/file/d/18GO8NAu2Mfqa2J-N7iCE-34lfnbhzJhC/view?usp=sharing", thumb: "/thumbnails/test-1.jpg" },
    { id: "test-2", title: "Client Feedback #2", client: "Creative Director", url: "https://drive.google.com/file/d/12pf7Nfa7DcvDjWH2rUZHSKjGUlfX0AfQ/view?usp=sharing", thumb: "/thumbnails/test-2.jpg" },
    { id: "test-3", title: "Client Feedback #3", client: "Music Producer", url: "https://drive.google.com/file/d/1GLbWysDZs497pwXGqruDysHaj5Doj5CS/view?usp=sharing", thumb: "/thumbnails/test-3.jpg" }
  ];

  // 4. BFSI
  const bfsiProjects = [
    { id: "bfsi-1", title: "Corporate Finance Narrative", category: "BFSI / Commercial", url: "https://drive.google.com/file/d/1o85NXR7EPACRb0yoddQxDJtTi2eFtm1d/view?usp=sharing", thumb: "/thumbnails/bfsi-1.jpg" },
    { id: "bfsi-2", title: "Banking System Showcase", category: "BFSI / Motion Graphics", url: "https://drive.google.com/file/d/1YrYdfK9nh0XMiKdHRKY01tffAC2Lve-E/view?usp=sharing", thumb: "/thumbnails/bfsi-2.jpg" }
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

  // 6. Licious
  const liciousProjects = [
    { id: "licious-1", title: "Licious Brand Showcase", category: "Retail / Food Brand", url: "https://drive.google.com/file/d/1CUdlT4hQW76MyQdL647hH_p2XH_bftDO/view?usp=sharing", thumb: "/thumbnails/licious-1.jpg" },
    { id: "licious-2", title: "Licious Product Narrative", category: "Commercial / Editorial", url: "https://drive.google.com/file/d/1usUA8kWO_kv5tsJjIreNKDobeADdo_T2/view?usp=sharing", thumb: "/thumbnails/licious-2.jpg" }
  ];

  // 7. Fashion
  const fashionProjects = [
    { id: "fashion-1", title: "Cinematic Fashion Edit I", category: "Fashion / Lifestyle", url: "https://drive.google.com/file/d/1igcqQPy9YScTuelb40Nvwb5pfp-uKvRH/view?usp=sharing", thumb: "/thumbnails/fashion-1.jpg" },
    { id: "fashion-2", title: "Cinematic Fashion Edit II", category: "Fashion / Visuals", url: "https://drive.google.com/file/d/1XkwIXnIXKM9iWtRN55lSOa2e30oE3y0m/view?usp=sharing", thumb: "/thumbnails/fashion-2.jpg" },
    { id: "fashion-3", title: "Cinematic Fashion Edit III", category: "Fashion / Editorial", url: "https://drive.google.com/file/d/1dxgO9G-iiA3As--83xpH--_p0yYdLZXP/view?usp=sharing", thumb: "/thumbnails/fashion-3.jpg" }
  ];

  // 8. Corporate
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

  // Featured projects for the bottom section
  const featuredProjects = [
    {
      id: 0,
      title: "OFFICIAL SHOWREEL",
      client: "Komal Tatke",
      year: "2026",
      role: "Lead Editor / Motion Designer",
      url: "https://drive.google.com/file/d/1CUdlT4hQW76MyQdL647hH_p2XH_bftDO/view?usp=sharing",
      thumb: "/thumbnails/featured-0.jpg",
      description: "A comprehensive showcase of cinematic editing, high-energy transitions, and advanced color grading work."
    },
    {
      id: 5,
      title: "DROOLS x BRAND CAMPAIGN",
      client: "Drools / Cutting Fillums",
      year: "2024",
      role: "Senior Video Editor",
      url: "https://drive.google.com/file/d/1vSLFCrqKRd1DOiC1AY8HJ9col-_lgI86/view?usp=sharing",
      thumb: "/thumbnails/featured-5.jpg",
      description: "A high-performance brand film focusing on visual storytelling and rhythmic editing for a premium retail audience."
    }
  ];

  const experience = [
    { role: "Creative Designer & Video Editor", company: "OneNative Studio", year: "2026" },
    { role: "Senior Video Editor", company: "Cutting Fillums Entertainment", year: "2023" },
    { role: "Senior Video Editor", company: "Avadhut Sathe Trading Academy", year: "2022" },
    { role: "Video Editor", company: "Mahesh Tutorial", year: "2021" }
  ];

  const education = [
    { degree: "M.A. English Literature", institution: "University of Mumbai", year: "2023" },
    { degree: "BA Mass Media (Advertising)", institution: "Smt. P.N Doshi College", year: "2022" }
  ];

  const expertise = ["Video Editing", "Product Shoots", "Social Media Handling", "Professional Videography", "Motion Graphics", "Content Creation", "Graphic Designing", "Photography"];
  
  const software = [
    { name: "Davinci Resolve", icon: "https://cdn.simpleicons.org/davinciresolve" },
    { name: "After Effects", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg" },
    { name: "Premiere Pro", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" },
    { name: "Photoshop", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" },
    { name: "Illustrator", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" },
    { name: "Figma", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-stone-50 text-zinc-900'} font-sans transition-colors duration-500 overflow-x-hidden pb-20`}>
      
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
          <div className="relative aspect-[3/4] w-64 md:w-80 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out shadow-2xl rounded-sm">
            <img src={profileImage} alt="Komal Tatke" className="w-full h-full object-cover" onError={(e) => e.target.src = fallbackImg}/>
            <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDarkMode ? 'from-zinc-950' : 'from-stone-50'}`}></div>
          </div>
          <div className="mt-8 text-center md:absolute md:bottom-[-20%] md:left-[-10%] md:text-left">
            <p className="text-2xl md:text-4xl font-bold tracking-tight"><span className="text-red-600 mr-4 font-normal">//</span>Komal Tatke</p>
            <p className="text-xl md:text-2xl font-light text-zinc-500 mt-1 uppercase tracking-widest">Video Editor / Visual Designer</p>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <div className={`w-full py-6 border-b ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 group transition-colors hover:text-red-600">
            <div className="p-2 bg-red-600/10 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
              <Phone size={16} />
            </div>
            <span className="text-sm font-mono tracking-widest">{contactInfo.phone}</span>
          </a>
          <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 group transition-colors hover:text-red-600">
            <div className="p-2 bg-red-600/10 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
              <Mail size={16} />
            </div>
            <span className="text-sm font-mono tracking-widest uppercase">{contactInfo.email}</span>
          </a>
          <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group transition-colors hover:text-red-600">
            <div className="p-2 bg-red-600/10 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
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
            <div className="absolute -left-4 -top-4 w-full h-full border-2 border-red-600 z-0"></div>
            <div className="relative z-10 aspect-[4/5] overflow-hidden grayscale-0 hover:grayscale-0 transition-all duration-700 bg-zinc-800 rounded-sm shadow-xl">
               <img 
                 src={profileImage}
                 className="w-full h-full object-cover" 
                 alt="Komal Datta Tatke" 
                 onError={(e) => {
                   // Generic fallback that matches the aesthetic if the local file isn't found
                   e.target.src = "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1000&auto=format&fit=crop";
                 }}
               />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Hi, I am <span className="text-red-600">Komal Datta Tatke</span></h2>
              <p className={`text-lg md:text-xl font-light leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Passionate creator specializing in Video Editing, Motion Design, and AI-driven Visual Storytelling. With over six years of professional experience, I turn ideas into meaningful visual narratives through thoughtful execution and creative precision.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
              <div className="flex items-center gap-4"><div className="w-1 h-12 bg-red-600"></div><div><p className="text-2xl font-black">6+ yrs</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Experience</p></div></div>
              <div className="flex items-center gap-4"><div className="w-1 h-12 bg-red-600"></div><div><p className="text-2xl font-black">500+</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Videos Done</p></div></div>
              <div className="flex items-center gap-4"><div className="w-1 h-12 bg-red-600"></div><div><p className="text-2xl font-black">50+</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Brands</p></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-10">
          <ArrowUpRight className="text-red-600" size={32} />
          <h3 className="text-3xl font-black uppercase tracking-tighter">Expertise & Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="grid grid-cols-1 gap-y-4">
            {expertise.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
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
            <Mic className="text-red-600" size={32} />
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Podcast <span className="text-red-600 italic">Highlights</span></h3>
          </div>
          <a href="https://drive.google.com/drive/folders/1o37O-yUNTxqv00tyQm4bpaF1TzxBKny0" target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-2 text-xs uppercase tracking-widest font-bold border-b-2 pb-1 transition-all ${isDarkMode ? 'border-red-600/30 hover:border-red-600' : 'border-red-200 hover:border-red-600'}`}>
            View Full Library <ExternalLink size={14} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {podcasts.map((pod) => (
            <div key={pod.id} onClick={() => openProject(pod, { isVertical: true })} className="group cursor-pointer space-y-4">
              <div className={`aspect-[9/16] w-full overflow-hidden rounded-2xl border transition-all duration-500 relative ${isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
                <ThumbnailImage
                  url={pod.url}
                  thumb={pod.thumb}
                  alt={pod.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-4 bg-red-600 rounded-full text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-500"><Play size={24} fill="currentColor" /></div>
                </div>
              </div>
              <p className="px-2 font-bold uppercase tracking-tight text-xs group-hover:text-red-600 transition-colors">{pod.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. MOTION GRAPHICS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <ArrowUpRight className="text-red-600" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Motion <span className="text-red-600">Graphics</span></h3>
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
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"><Play size={24} className="text-white fill-white" /></div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-2">{item.category}</p>
                <h4 className="text-xl font-bold uppercase tracking-tight leading-tight">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIALS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Quote className="text-red-600" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Client <span className="text-red-600 italic">Testimonials</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div key={test.id} onClick={() => openProject(test)} className="group cursor-pointer space-y-6">
              <div className={`aspect-video w-full overflow-hidden rounded-xl border-2 transition-all duration-500 relative ${isDarkMode ? 'border-zinc-800 bg-zinc-900 group-hover:border-red-600/50' : 'border-zinc-200 bg-white group-hover:border-red-600/30 shadow-sm'}`}>
                <ThumbnailImage
                  url={test.url}
                  thumb={test.thumb}
                  alt={test.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"><div className="p-4 bg-white text-red-600 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500"><Play size={20} fill="currentColor" /></div></div>
              </div>
              <div className="px-2 border-l-2 border-red-600/20 group-hover:border-red-600 transition-colors pl-4">
                <h4 className="font-bold uppercase tracking-tight text-lg group-hover:text-red-600 transition-colors leading-none">{test.title}</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2 font-black">{test.client}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BFSI SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Landmark className="text-red-600" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">BFSI <span className="text-red-600 italic">Campaigns</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {bfsiProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
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
                <p className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MUSIC SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
          <div className="flex items-center gap-3">
            <Disc className="text-red-600" size={32} />
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Music & <span className="text-red-600 italic">Visuals</span></h3>
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
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-[10px] font-black uppercase tracking-tighter text-white">{music.title}</p>
                <div className="mt-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"><Play size={10} className="fill-white text-white" /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LICIOUS SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <ShoppingBag className="text-red-600" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Licious <span className="text-red-600 italic">Campaigns</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {liciousProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
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
                <p className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FASHION SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Sparkles className="text-red-600" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Fashion <span className="text-red-600 italic">Visuals</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fashionProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className={`aspect-[4/5] w-full overflow-hidden rounded-xl border-2 transition-all duration-700 relative ${isDarkMode ? 'border-zinc-800 bg-zinc-900 group-hover:border-red-600/50' : 'border-zinc-200 bg-white group-hover:border-red-600/30'}`}>
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play size={40} className="text-white fill-white" /></div>
              </div>
              <div className="mt-6 px-2">
                <p className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors leading-tight">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CORPORATE SECTION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-16">
          <Briefcase className="text-red-600" size={32} />
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Corporate <span className="text-red-600 italic">Solutions</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {corporateProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-lg">
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
                <p className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-1">{project.category}</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RESUME / EDUCATION */}
      <section className={`py-24 px-6 md:px-12 max-w-6xl mx-auto border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
          <div>
            <div className="flex items-center gap-3 mb-12"><ArrowUpRight className="text-red-600" size={32} /><h3 className="text-3xl font-black uppercase tracking-tighter">Education</h3></div>
            <div className="space-y-10">{education.map((item, index) => (<div key={index} className={`relative pb-6 border-b transition-all group ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}><div className="flex justify-between items-start"><div><h4 className="text-lg font-bold uppercase tracking-tight group-hover:text-red-500 transition-colors">{item.degree}</h4><p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest">{item.institution}</p></div><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">{item.year}</span></div></div>))}</div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-12"><ArrowUpRight className="text-red-600" size={32} /><h3 className="text-3xl font-black uppercase tracking-tighter">Experience</h3></div>
            <div className="space-y-10">{experience.map((item, index) => (<div key={index} className={`relative pb-6 border-b transition-all group ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}><div className="flex justify-between items-start"><div><h4 className="text-lg font-bold uppercase tracking-tight group-hover:text-red-500 transition-colors">{item.role}</h4><p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest">{item.company}</p></div><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">{item.year}</span></div></div>))}</div>
          </div>
        </div>
      </section>

      {/* SHOWREEL & FEATURED */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16">Featured Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featuredProjects.map((project) => (
            <div key={project.id} onClick={() => openProject(project)} className="group cursor-pointer">
              <div className="aspect-video w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-zinc-900 border border-zinc-800 relative rounded-sm">
                <ThumbnailImage
                  url={project.url}
                  thumb={project.thumb}
                  alt={project.title}
                  fallback={fallbackImg}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Featured</div>
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div><h4 className="text-2xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors">{project.title}</h4></div>
                <div className={`p-4 border rounded-full transition-all group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}><Play size={20} fill="currentColor" /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-20 px-6 md:px-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-stone-100'}`}>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black uppercase tracking-tighter">Komal Tatke</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] mt-2">Visual Designer & Video Editor</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-8 text-sm uppercase tracking-widest font-bold">
             <a href={`mailto:${contactInfo.email}`} className="hover:text-red-600 transition-colors">Email</a>
             <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">LinkedIn</a>
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-2 tracking-widest">{contactInfo.phone}</p>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-600">(c) 2026 Crafted for Impact.</div>
      </footer>

      {/* VIDEO MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={() => setSelectedProject(null)}></div>
          <div className={`relative w-full z-10 border border-zinc-800 shadow-2xl overflow-hidden bg-zinc-950 ${selectedProject.isVertical ? 'max-w-[400px] aspect-[9/16]' : 'max-w-5xl aspect-video'}`}>
            <button onClick={() => setSelectedProject(null)} className="absolute -top-10 right-0 text-white hover:rotate-90 transition-transform"><X size={24} /></button>
            <div className="w-full h-full bg-black"><iframe src={selectedProject.videoUrl || selectedProject.url} className="w-full h-full" allow="autoplay; fullscreen" frameBorder="0"></iframe></div>
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
