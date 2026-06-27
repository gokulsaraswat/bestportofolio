"use client";

import { useState, useCallback } from "react";

// ─── URL Pattern Matchers ──────────────────────────────────────

interface EmbedInfo {
  type: "youtube" | "spotify" | "twitter" | "custom";
  url: string;
  embedUrl: string;
  title?: string;
  aspectRatio?: string;
}

function parseYouTube(url: string): EmbedInfo | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) {
      return {
        type: "youtube",
        url,
        embedUrl: `https://www.youtube.com/embed/${m[1]}?rel=0`,
        title: "YouTube Video",
        aspectRatio: "16/9",
      };
    }
  }
  return null;
}

function parseSpotify(url: string): EmbedInfo | null {
  const patterns = [
    /spotify\.com\/(track|album|playlist|episode|show|podcast)\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/(track|album|playlist|episode|show|podcast)\/([a-zA-Z0-9]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) {
      return {
        type: "spotify",
        url,
        embedUrl: `https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0`,
        title: `Spotify ${m[1].charAt(0).toUpperCase() + m[1].slice(1)}`,
        aspectRatio: undefined,
      };
    }
  }
  return null;
}

function parseTwitter(url: string): EmbedInfo | null {
  const patterns = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    /(?:twitter\.com|x\.com)\/i\/status\/(\d+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) {
      return {
        type: "twitter",
        url,
        embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${m[1]}`,
        title: "Tweet",
        aspectRatio: undefined,
      };
    }
  }
  return null;
}

export function parseEmbedUrl(url: string): EmbedInfo | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  return parseYouTube(trimmed) || parseSpotify(trimmed) || parseTwitter(trimmed) || null;
}

export function parseCustomEmbed(url: string, title?: string): EmbedInfo | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Try known types first
  const known = parseEmbedUrl(trimmed);
  if (known) return known;

  // Generic iframe embed
  return {
    type: "custom",
    url: trimmed,
    embedUrl: trimmed,
    title: title || "Embedded Content",
    aspectRatio: "16/9",
  };
}

// ─── Extract embeddable URLs from text content ────────────────
const URL_REGEX = /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|open\.spotify\.com|spotify\.com|twitter\.com|x\.com)\/[^\s<>"')\]]+/gi;

export function extractEmbedsFromText(text: string): { cleanText: string; embeds: EmbedInfo[] } {
  if (!text) return { cleanText: text, embeds: [] };

  const embeds: EmbedInfo[] = [];
  let cleanText = text;

  const urls = text.match(URL_REGEX) || [];
  const seen = new Set<string>();

  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    const parsed = parseEmbedUrl(url);
    if (parsed) {
      embeds.push(parsed);
      // Remove the bare URL from text (it will be rendered as embed instead)
      cleanText = cleanText.replace(new RegExp(`\\s*${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, "g"), "\n\n");
    }
  }

  return { cleanText: cleanText.replace(/\n{3,}/g, "\n\n").trim(), embeds };
}

// ─── Embed Type Icons ──────────────────────────────────────────
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Individual Embed Renderers ────────────────────────────────

function YouTubeEmbed({ info }: { info: EmbedInfo }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-xs font-medium">
        <YouTubeIcon />
        <span>YouTube</span>
        <span className="ml-auto opacity-70 text-[10px] truncate max-w-[200px]">{info.url}</span>
      </div>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={info.embedUrl}
          title={info.title || "YouTube video"}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function SpotifyEmbed({ info }: { info: EmbedInfo }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1DB954] text-white text-xs font-medium">
        <SpotifyIcon />
        <span>{info.title || "Spotify"}</span>
      </div>
      <div className="bg-black">
        <iframe
          src={info.embedUrl}
          title={info.title || "Spotify embed"}
          className="w-full"
          style={{ height: "352px" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function TwitterEmbed({ info }: { info: EmbedInfo }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-medium">
        <TwitterIcon />
        <span>Post</span>
      </div>
      <div className="bg-white dark:bg-gray-900">
        <iframe
          src={info.embedUrl}
          title={info.title || "Tweet"}
          className="w-full"
          style={{ height: "400px", maxWidth: "550px", margin: "0 auto", display: "block" }}
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function CustomEmbed({ info }: { info: EmbedInfo }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span>{info.title || "Embedded Content"}</span>
      </div>
      <div className="relative w-full" style={info.aspectRatio ? { paddingBottom: "56.25%" } : { height: "400px" }}>
        <iframe
          src={info.embedUrl}
          title={info.title || "Embed"}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}

// ─── Main Embed Renderer Component ─────────────────────────────

export function EmbedRenderer({ url, title, className }: { url: string; title?: string; className?: string }) {
  const info = parseCustomEmbed(url, title);
  if (!info) return null;

  return (
    <div className={className || "my-4"}>
      {info.type === "youtube" && <YouTubeEmbed info={info} />}
      {info.type === "spotify" && <SpotifyEmbed info={info} />}
      {info.type === "twitter" && <TwitterEmbed info={info} />}
      {info.type === "custom" && <CustomEmbed info={info} />}
    </div>
  );
}

// ─── Multi-Embed List (for stored embed URLs) ──────────────────

export function EmbedList({ urls, className }: { urls: string; className?: string }) {
  if (!urls) return null;

  const urlList = urls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  if (urlList.length === 0) return null;

  return (
    <div className={className || "space-y-4 my-4"}>
      {urlList.map((url, i) => (
        <EmbedRenderer key={i} url={url} />
      ))}
    </div>
  );
}

// ─── Content + Auto-detected Embeds ────────────────────────────

export function ContentWithEmbeds({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  if (!content) return null;

  const { cleanText, embeds } = extractEmbedsFromText(content);

  return (
    <div className={className}>
      {cleanText && (
        <div className="prose prose-gray dark:prose-invert max-w-none whitespace-pre-wrap">
          {cleanText}
        </div>
      )}
      {embeds.length > 0 && (
        <div className="space-y-4 my-4">
          {embeds.map((embed, i) => (
            <div key={i}>
              {embed.type === "youtube" && <YouTubeEmbed info={embed} />}
              {embed.type === "spotify" && <SpotifyEmbed info={embed} />}
              {embed.type === "twitter" && <TwitterEmbed info={embed} />}
              {embed.type === "custom" && <CustomEmbed info={embed} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin: Embed URL Input Helper ─────────────────────────────

export function EmbedUrlInput({
  value,
  onChange,
  label = "Embed URLs",
  description = "One URL per line. Supports: YouTube, Spotify, Twitter/X, or any iframe-able URL.",
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  description?: string;
}) {
  const [preview, setPreview] = useState<string[]>([]);

  const handleBlur = () => {
    const urls = value.split("\n").map((u) => u.trim()).filter(Boolean);
    setPreview(urls);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        {preview.length > 0 && (
          <span className="text-[10px] text-gray-400">{preview.length} embed(s) detected</span>
        )}
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={"https://youtube.com/watch?v=...\nhttps://open.spotify.com/track/...\nhttps://x.com/user/status/..."}
        rows={3}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
      />
      {/* Preview detected embeds */}
      {preview.length > 0 && (
        <div className="space-y-2 mt-2">
          {preview.map((url, i) => {
            const info = parseEmbedUrl(url);
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                {info ? (
                  <>
                    {info.type === "youtube" && <YouTubeIcon />}
                    {info.type === "spotify" && <SpotifyIcon />}
                    {info.type === "twitter" && <TwitterIcon />}
                    {info.type === "custom" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /></svg>}
                    <span className="text-green-600 dark:text-green-400 font-medium capitalize">{info.type}</span>
                    <span className="text-gray-400 truncate flex-1">{url}</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    <span className="text-gray-400 truncate flex-1">{url}</span>
                    <span className="text-yellow-500">Unknown — will try iframe</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}