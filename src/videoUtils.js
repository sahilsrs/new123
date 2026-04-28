export const getYoutubeId = (url = "") => {
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

export const getDriveId = (url = "") => {
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch?.[1]) return openMatch[1];

  return null;
};

export const withQueryParams = (url, params) => {
  const [base, query = ""] = url.split("?");
  const searchParams = new URLSearchParams(query);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, value);
  });

  const nextQuery = searchParams.toString();
  return nextQuery ? `${base}?${nextQuery}` : base;
};

export const getSiteOrigin = () => {
  if (typeof window === "undefined") return "";
  const origin = window.location?.origin;
  if (!origin || origin === "null") return "";
  return origin;
};

export const getPlatformType = (url = "") => {
  if (getDriveId(url)) return "drive";
  if (getYoutubeId(url)) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  return "web";
};

export const getPlayableUrl = (url = "") => {
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

export const getSourceUrl = (url = "") => {
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

export const getDriveStreamSources = (url = "") => {
  const driveId = getDriveId(url);
  if (!driveId) return [];

  return [
    `https://drive.usercontent.google.com/uc?id=${driveId}&export=download`,
    `https://drive.google.com/uc?export=download&id=${driveId}`,
    `https://drive.google.com/uc?export=view&id=${driveId}`
  ];
};

export const getThumbnailSources = ({ url, thumb, fallback = "" }) => {
  const sources = [];

  if (thumb) sources.push(thumb);

  if (!url) {
    if (fallback) sources.push(fallback);
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

  if (fallback) sources.push(fallback);

  return [...new Set(sources.filter(Boolean))];
};
