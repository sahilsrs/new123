import assert from "node:assert/strict";
import {
  getDriveId,
  getDriveStreamSources,
  getPlayableUrl,
  getPlatformType,
  getSourceUrl,
  getThumbnailSources,
  getYoutubeId
} from "../src/videoUtils.js";

const run = () => {
  // YouTube URL parsing + playable embed
  assert.equal(getYoutubeId("https://www.youtube.com/shorts/AsxI829nfnY"), "AsxI829nfnY");
  const ytPlayable = getPlayableUrl("https://www.youtube.com/shorts/AsxI829nfnY");
  assert.match(ytPlayable, /youtube\.com\/embed\/AsxI829nfnY/);
  assert.match(ytPlayable, /autoplay=1/);
  assert.match(ytPlayable, /mute=1/);

  // Drive URL parsing + stream source fallbacks
  assert.equal(getDriveId("https://drive.google.com/file/d/1abcDEF_12-34/view?usp=sharing"), "1abcDEF_12-34");
  const driveSources = getDriveStreamSources("https://drive.google.com/file/d/1abcDEF_12-34/view");
  assert.equal(driveSources.length, 3);
  assert.match(driveSources[0], /drive\.usercontent\.google\.com/);

  // Instagram canonical source URL
  assert.equal(
    getSourceUrl("https://www.instagram.com/reels/DVTZjS4DJ8y/"),
    "https://www.instagram.com/reel/DVTZjS4DJ8y/"
  );

  // Platform type detection
  assert.equal(getPlatformType("https://www.youtube.com/watch?v=abc"), "youtube");
  assert.equal(getPlatformType("https://drive.google.com/file/d/xyz/view"), "drive");
  assert.equal(getPlatformType("https://www.instagram.com/reel/abc/"), "instagram");

  // Thumbnail source generation includes provided thumb and fallback
  const thumbs = getThumbnailSources({
    url: "https://www.youtube.com/watch?v=AsxI829nfnY",
    thumb: "/thumbnails/pod-1.jpg",
    fallback: "https://example.com/fallback.jpg"
  });
  assert.equal(thumbs[0], "/thumbnails/pod-1.jpg");
  assert.ok(thumbs.some((item) => item.includes("img.youtube.com/vi/AsxI829nfnY")));
  assert.equal(thumbs[thumbs.length - 1], "https://example.com/fallback.jpg");
};

run();
console.log("Playback utility tests passed.");
