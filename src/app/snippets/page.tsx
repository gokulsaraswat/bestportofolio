"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Light as SyntaxHighlighter,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import rust from "react-syntax-highlighter/dist/esm/languages/hljs/rust";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import kotlin from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import scss from "react-syntax-highlighter/dist/esm/languages/hljs/scss";
import dart from "react-syntax-highlighter/dist/esm/languages/hljs/dart";
import scala from "react-syntax-highlighter/dist/esm/languages/hljs/scala";
import r from "react-syntax-highlighter/dist/esm/languages/hljs/r";
import lua from "react-syntax-highlighter/dist/esm/languages/hljs/lua";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Search, Copy, Check, Share2, X, GitCompare, ExternalLink, Terminal, Play,
  Code2, GitBranch, FileText, Database, Server, Sparkles, Filter,
  ChevronDown, ArrowLeft, ArrowRight,
} from "lucide-react";
import { EmbedList } from "@/components/embed-renderer";
import { Navbar, Footer } from "@/components/site/navbar";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("c++", cpp);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("dart", dart);
SyntaxHighlighter.registerLanguage("scala", scala);
SyntaxHighlighter.registerLanguage("r", r);
SyntaxHighlighter.registerLanguage("lua", lua);

// ─── Types ───────────────────────────────────────────────────────
interface SnippetTab {
  name: string;
  language: string;
  content: string;
}

interface CodeSnippet {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  language: string;
  tags: string;
  content: string;
  tabs: string;
  comment: string;
  demoType: string;
  demoUrl: string;
  demoOutput: string;
  published: boolean;
  includeInRag: boolean;
  createdAt: string;
  updatedAt: string;
  embeds: string;
}

// ─── Constants ───────────────────────────────────────────────────
const SNIPPET_TYPES = ["code", "hld", "lld", "api-design", "db-design"];

const TYPE_COLORS: Record<string, string> = {
  code: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  hld: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  lld: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "api-design": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "db-design": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  code: <Code2 className="w-3 h-3" />,
  hld: <GitBranch className="w-3 h-3" />,
  lld: <FileText className="w-3 h-3" />,
  "api-design": <Server className="w-3 h-3" />,
  "db-design": <Database className="w-3 h-3" />,
};

const LANG_COLORS: Record<string, string> = {
  javascript: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  typescript: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  python: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  java: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "c++": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  "c#": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  go: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  rust: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  ruby: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  php: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  sql: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  html: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  css: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shell: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  bash: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  json: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  yaml: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  dockerfile: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  graphql: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  markdown: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  dart: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  swift: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  kotlin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  scala: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  r: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  lua: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  perl: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  haskell: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  xml: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const MAX_TAG_FILTERS = 4;

const langMap: Record<string, string> = {
  "c#": "csharp",
  "c++": "cpp",
  shell: "bash",
  dockerfile: "dockerfile",
};

function getHljsLang(lang: string): string {
  return langMap[lang.toLowerCase()] || lang.toLowerCase() || "plaintext";
}

function getTypeColor(type: string): string {
  return TYPE_COLORS[type] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
}

function getTypeIcon(type: string) {
  return TYPE_ICONS[type] || <Sparkles className="w-3 h-3" />;
}

function getLangColor(lang: string): string {
  return LANG_COLORS[lang.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
}

// ─── Component ───────────────────────────────────────────────────
export default function SnippetsPage() {
  const { resolvedTheme } = useTheme();
  const [snippets, setSnippets] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [allTags, setAllTags] = useState<string[]>([]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // ─── Fetch ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ published: "true", limit: "200" });
        const res = await fetch(`/api/snippets?${params}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.snippets || [];
        if (cancelled) return;
        setSnippets(list);

        const tagSet = new Set<string>();
        list.forEach((s: CodeSnippet) =>
          s.tags.split(",").forEach((t) => {
            const trimmed = t.trim().toLowerCase();
            if (trimmed) tagSet.add(trimmed);
          })
        );
        setAllTags([...tagSet].sort());
      } catch {
        console.error("Failed to fetch snippets");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close tag dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Filtered list ──────────────────────────────────────
  const filtered = (snippets || []).filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (tagFilters.length > 0) {
      const snippetTags = s.tags.split(",").map((t) => t.trim().toLowerCase());
      if (!tagFilters.every((tf) => snippetTags.includes(tf))) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q) ||
        s.tags.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ─── Scroll to detail on open ─────────────────────────
  useEffect(() => {
    if (detailId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [detailId]);

  // ─── Keyboard navigation (j/k/Enter//) ──────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if ((e.target as HTMLElement).isContentEditable) return;

      const key = e.key.toLowerCase();

      if (key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (key === "j" || key === "arrowdown") {
        e.preventDefault();
        setFocusedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (key === "k" || key === "arrowup") {
        e.preventDefault();
        setFocusedIdx((prev) => Math.max(prev - 1, 0));
      } else if (key === "enter" && focusedIdx >= 0 && focusedIdx < filtered.length) {
        e.preventDefault();
        setDetailId(filtered[focusedIdx].id);
        setDetailTab(0);
      } else if (key === "escape") {
        if (detailId) {
          setDetailId(null);
          setDetailTab(0);
        } else if (compareIds.size > 0) {
          setCompareIds(new Set());
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedIdx, filtered?.length, detailId, compareIds]);

  // Scroll focused card into view
  useEffect(() => {
    if (focusedIdx >= 0 && cardRefs.current[focusedIdx]) {
      cardRefs.current[focusedIdx]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedIdx]);

  // ─── Actions ─────────────────────────────────────────────
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const addTagFilter = (tag: string) => {
    const t = tag.toLowerCase();
    if (tagFilters.includes(t)) {
      setTagFilters(tagFilters.filter((x) => x !== t));
    } else if (tagFilters.length < MAX_TAG_FILTERS) {
      setTagFilters([...tagFilters, t]);
    }
  };

  const removeTagFilter = (tag: string) => {
    setTagFilters(tagFilters.filter((t) => t !== tag));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareSnippet = (s: CodeSnippet) => {
    const url = `${window.location.origin}/snippets?view=${s.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (text: string) => (text || "").split("\n").length;

  const compareSnippets = (snippets || []).filter((s) => compareIds.has(s.id));
  const detailSnippet = (snippets || []).find((s) => s.id === detailId);

  const similarSnippets = detailSnippet
    ? (snippets || [])
        .filter((s) => s.id !== detailSnippet.id)
        .filter((s) => {
          const dTags = detailSnippet.tags.split(",").map((t) => t.trim().toLowerCase());
          const sTags = s.tags.split(",").map((t) => t.trim().toLowerCase());
          return dTags.some((t) => sTags.includes(t)) || s.type === detailSnippet.type || s.language === detailSnippet.language;
        })
        .slice(0, 4)
    : [];

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 relative">
      <Navbar />
      
      {/* FIXED LAYOUT BREAKING: 
        Added `pt-24` (or similar depending on navbar height) to the main element so it avoids overlapping under the fixed navbar.
      */}
      <main className="flex-1 w-full mx-auto max-w-6xl px-4 pt-24 pb-8 sm:px-6 lg:px-8"> 
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Code Snippets</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Code, HLD, LLD, API designs &amp; more. Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">/</kbd> to search, <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">j</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">k</kbd> to navigate, <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Enter</kbd> to open.
          </p>
        </motion.div>

        {/* Type Filter Bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setTypeFilter("all")}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              typeFilter === "all"
                ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            All
          </button>
          {SNIPPET_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                typeFilter === type
                  ? `${getTypeColor(type)} border-current`
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {getTypeIcon(type)} {type}
            </button>
          ))}
        </div>

        {/* Search + Tag Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search snippets... (press / to focus)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFocusedIdx(-1); }}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Tag Filter Dropdown */}
          <div className="relative" ref={tagDropdownRef}>
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className={`inline-flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border transition-colors whitespace-nowrap ${
                tagFilters.length > 0
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/50"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Tags {tagFilters.length > 0 && `(${tagFilters.length}/${MAX_TAG_FILTERS})`}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showTagDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 max-h-60 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
                <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Select up to {MAX_TAG_FILTERS} tags
                  </p>
                </div>
                {allTags.length === 0 ? (
                  <div className="p-3 text-sm text-gray-400 text-center">No tags available</div>
                ) : (
                  <div className="p-1">
                    {allTags.map((tag) => {
                      const isActive = tagFilters.includes(tag);
                      const isDisabled = !isActive && tagFilters.length >= MAX_TAG_FILTERS;
                      return (
                        <button
                          key={tag}
                          onClick={() => !isDisabled && addTagFilter(tag)}
                          disabled={isDisabled}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            isActive
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : isDisabled
                              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>#{tag}</span>
                          {isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Tag Filters */}
        {tagFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Filtering by:</span>
            {tagFilters.map((tag) => (
              <button
                key={tag}
                onClick={() => removeTagFilter(tag)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                #{tag} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={() => setTagFilters([])} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              Clear all
            </button>
          </div>
        )}

        {/* Compare bar */}
        {compareIds.size > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
            <GitCompare className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Comparing {compareIds.size}/3 snippets
            </span>
            <button
              onClick={() => setCompareIds(new Set())}
              className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* ─── Loading ─────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span className="ml-3 text-sm">Loading snippets...</span>
          </div>
        )}

        {/* ─── Empty ───────────────────────────────────────── */}
        {!loading && (snippets || []).length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Code2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No snippets yet</p>
            <p className="text-sm mt-1">Check back later for code, designs, and more.</p>
          </div>
        )}

        {/* ─── No Results ─────────────────────────────────── */}
        {!loading && (snippets || []).length > 0 && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No results match your filters</p>
            <button onClick={() => { setSearch(""); setTypeFilter("all"); setTagFilters([]); }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1">
              Clear all filters
            </button>
          </div>
        )}

        {/* ─── Snippet Cards Grid ─────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filtered.map((s, idx) => {
              const isCompared = compareIds.has(s.id);
              const isFocused = focusedIdx === idx;

              return (
                <motion.div
                  key={s.id}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => { setDetailId(s.id); setDetailTab(0); }}
                  className={`group relative rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    isCompared
                      ? "border-blue-400 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-400/30"
                      : isFocused
                      ? "border-blue-500 dark:border-blue-400 bg-gray-50 dark:bg-gray-800/50 ring-2 ring-blue-500/30"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">{s.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompare(s.id); }}
                        className={`p-1 rounded-md transition-colors ${isCompared ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                        title={isCompared ? "Remove from compare" : "Compare (max 3)"}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${getTypeColor(s.type)}`}>
                      {getTypeIcon(s.type)} {s.type}
                    </span>
                    {s.language && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getLangColor(s.language)}`}>
                        {s.language}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {s.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{s.description}</p>
                  )}

                  {/* Tags */}
                  {s.tags && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {s.tags.split(",").filter(Boolean).slice(0, 3).map((t) => (
                        <button
                          key={t}
                          onClick={(e) => { e.stopPropagation(); addTagFilter(t.trim()); }}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          #{t.trim()}
                        </button>
                      ))}
                      {s.tags.split(",").filter(Boolean).length > 3 && (
                        <span className="text-[10px] text-gray-400">+{s.tags.split(",").length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{lineCount(s.content)} lines</span>
                    <span>{new Date(s.updatedAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            COMPARE VIEW
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {compareIds.size >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <GitCompare className="w-5 h-5" /> Comparison
              </h2>
              <div className={`grid gap-3 ${compareIds.size === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"}`}>
                {compareSnippets.map((s) => (
                  <div key={s.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getTypeColor(s.type)}`}>{s.type}</span>
                        {s.language && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getLangColor(s.language)}`}>{s.language}</span>
                        )}
                      </div>
                    </div>
                    <div className="overflow-auto max-h-[500px]">
                      <SyntaxHighlighter
                        language={getHljsLang(s.language)}
                        style={resolvedTheme === "dark" ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.8125rem",
                          lineHeight: "1.6",
                        }}
                        showLineNumbers
                      >
                        {s.content || "// empty"}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
            FIXED DETAIL VIEW (MODAL)
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {detailSnippet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
              <motion.div
                ref={detailRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden relative"
              >
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 shrink-0 bg-white dark:bg-gray-900">
                  <button
                    onClick={() => { setDetailId(null); setDetailTab(0); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to all snippets
                  </button>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{detailSnippet.title}</h2>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor(detailSnippet.type)}`}>
                          {getTypeIcon(detailSnippet.type)} {detailSnippet.type}
                        </span>
                        {detailSnippet.language && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLangColor(detailSnippet.language)}`}>
                            {detailSnippet.language}
                          </span>
                        )}
                      </div>
                      {detailSnippet.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{detailSnippet.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => copyToClipboard(detailSnippet.content)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => shareSnippet(detailSnippet)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setDetailId(null); setDetailTab(0); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {detailSnippet.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {detailSnippet.tags.split(",").filter(Boolean).map((t) => (
                        <button
                          key={t}
                          onClick={() => { setDetailId(null); addTagFilter(t.trim()); }}
                          className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          #{t.trim()}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tabs */}
                  {(() => {
                    let parsedTabs: SnippetTab[] = [];
                    try { parsedTabs = JSON.parse(detailSnippet.tabs || "[]"); } catch { parsedTabs = []; }
                    const allTabs = [
                      { name: "Main", language: detailSnippet.language || "text", content: detailSnippet.content },
                      ...parsedTabs,
                    ];
                    if (detailSnippet.demoType) {
                      allTabs.push({ name: "Demo", language: "", content: "" });
                    }

                    return (
                      <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
                        {allTabs.map((tab, i) => (
                          <button
                            key={i}
                            onClick={() => setDetailTab(i)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              detailTab === i
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {tab.name}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Body — wider for big screens */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                  {(() => {
                    let parsedTabs: SnippetTab[] = [];
                    try { parsedTabs = JSON.parse(detailSnippet.tabs || "[]"); } catch { parsedTabs = []; }
                    const allTabs = [
                      { name: "Main", language: detailSnippet.language || "text", content: detailSnippet.content },
                      ...parsedTabs,
                    ];
                    if (detailSnippet.demoType) {
                      allTabs.push({ name: "Demo", language: "", content: "" });
                    }

                    const activeTab = allTabs[detailTab] || allTabs[0];

                    // Demo tab
                    if (activeTab.name === "Demo") {
                      return (
                        <div className="space-y-3">
                          {detailSnippet.demoType === "link" && detailSnippet.demoUrl && (
                            <a
                              href={detailSnippet.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <ExternalLink className="w-4 h-4" /> Open Demo
                            </a>
                          )}
                          {detailSnippet.demoType === "output" && detailSnippet.demoOutput && (
                            <div className="rounded-xl bg-gray-950 p-4 overflow-auto max-h-[400px]">
                              <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs">
                                <Terminal className="w-3.5 h-3.5" /> Output
                              </div>
                              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{detailSnippet.demoOutput}</pre>
                            </div>
                          )}
                          {detailSnippet.demoType === "image" && (
                            <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 text-center text-sm text-gray-500">
                              Demo image configured
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Code tab — wider on big screens
                    return (
                      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{activeTab.name} {activeTab.language && `· ${activeTab.language}`}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{lineCount(activeTab.content)} lines</span>
                            <button
                              onClick={() => copyToClipboard(activeTab.content)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        {/* Full-width code block */}
                        <div className="overflow-auto max-h-[60vh]">
                          <SyntaxHighlighter
                            language={getHljsLang(activeTab.language)}
                            style={resolvedTheme === "dark" ? oneDark : oneLight}
                            customStyle={{
                              margin: 0,
                              padding: "1rem",
                              fontSize: "0.8125rem",
                              lineHeight: "1.6",
                            }}
                            showLineNumbers
                          >
                            {activeTab.content || "// empty"}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Comment */}
                  {detailSnippet.comment && (
                    <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{detailSnippet.comment}</p>
                    </div>
                  )}

                  {/* Embeds */}
                  {detailSnippet.embeds && (
                    <div className="mt-4">
                      <EmbedList urls={detailSnippet.embeds} />
                    </div>
                  )}

                  {/* Similar Snippets */}
                  {similarSnippets.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Similar Snippets</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {similarSnippets.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => { setDetailId(s.id); setDetailTab(0); }}
                            className="text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.title}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getTypeColor(s.type)}`}>{s.type}</span>
                              {s.language && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getLangColor(s.language)}`}>{s.language}</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Keyboard hint */}
        <div className="fixed bottom-4 right-4 hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 text-[10px] text-gray-400 z-40">
          <span><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">/</kbd> search</span>
          <span><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">j</kbd><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">k</kbd> nav</span>
          <span><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Enter</kbd> open</span>
          <span><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Esc</kbd> close</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}