"use client";

import { useState, useEffect, useCallback , useMemo} from "react";
import { motion, AnimatePresence } from "framer-motion";
  import {
    Plus, Edit3, Trash2, Search, Eye, X, Save, ChevronUp, ChevronDown,
    Code2, FileText, Database, GitBranch, Server, Sparkles, GripVertical,
    Copy, Check, ExternalLink, Image, Link2, Terminal, Play, CheckSquare,
    Clock,
  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmbedUrlInput } from "@/components/embed-renderer"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";



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
  tabs: string; // JSON
  comment: string;
  demoType: string;
  demoUrl: string;
  demoOutput: string;
  category: string;
  scheduledAt: string;
  published: boolean;
  includeInRag: boolean;
  createdAt: string;
  updatedAt: string;
  embeds: string; // <-- ADD THIS LINE
}

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Dart", "Scala", "R", "SQL", "Shell/Bash",
  "HTML", "CSS", "SCSS", "JSON", "YAML", "XML", "Markdown", "GraphQL",
  "Dockerfile", "Lua", "Perl", "Haskell", "Elixir", "Clojure", "Other",
];

const DEMO_TYPES = [
  { value: "", label: "None" },
  { value: "image", label: "Image" },
  { value: "link", label: "External Link" },
  { value: "output", label: "Terminal Output" },
];

const PRESET_TYPES = [
  "code", "hld", "lld", "api-design", "db-design",
];

// ─── Constants ───────────────────────────────────────────── for Category suggestions and language colors
const CATEGORY_SUGGESTIONS = [
  "Algorithm", "Data Structure", "Backend", "Frontend", "DevOps", "Database", "API", "Utility",
];


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
  swift: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  kotlin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
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
  scala: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  r: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  xml: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  lua: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

function getTypeColor(type: string): string {
  switch (type) {
    case "code": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "hld": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "lld": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
    case "api-design": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "db-design": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "code": return <Code2 className="w-3.5 h-3.5" />;
    case "hld": return <GitBranch className="w-3.5 h-3.5" />;
    case "lld": return <FileText className="w-3.5 h-3.5" />;
    case "api-design": return <Server className="w-3.5 h-3.5" />;
    case "db-design": return <Database className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
}

// ─── Slug helper ─────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatScheduledDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}




// ─── Component ───────────────────────────────────────────────────
export function SnippetManager() {
  const { toast } = useToast();


  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<"updatedAt" | "createdAt" | "title">("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Dialog states
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);


  // Form state
  const emptyForm = {
    title: "", slug: "", description: "", type: "code", language: "",
    tags: "", content: "", comment: "", demoType: "", demoUrl: "", demoOutput: "",
    published: false, includeInRag: false, embeds: "", category: "", scheduledAt: "",

  };
  const [form, setForm] = useState(emptyForm);
  const [tabs, setTabs] = useState<SnippetTab[]>([]);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────
  const fetchSnippets = async () => {
  try {
    setLoading(true)
    const res = await fetch("/api/snippets?limit=200")
    if (!res.ok) throw new Error("Failed")
    const data = await res.json()
    setSnippets(Array.isArray(data) ? data : data.snippets || [])
  } catch {
    console.error("Failed to fetch snippets")
  } finally {
    setLoading(false)
  }
}


useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/snippets?limit=200")
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        if (!cancelled) {
          setSnippets(Array.isArray(data) ? data : data.snippets || [])
        }
      } catch {
        console.error("Failed to fetch snippets")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])
  // ─── CRUD handlers ────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm);
    setTabs([]);
    setSelectedId(null);
    setEditOpen(true);
  };

 const openEdit = (s: CodeSnippet) => {
    setForm({
      title: s.title, slug: s.slug, description: s.description,
      type: s.type, language: s.language, tags: s.tags, content: s.content,
      comment: s.comment, demoType: s.demoType, demoUrl: s.demoUrl,
      demoOutput: s.demoOutput, published: s.published, includeInRag: s.includeInRag,
      embeds: s.embeds || "", category: s.category || "",
      scheduledAt: toDatetimeLocal(s.scheduledAt),

    });
    try { setTabs(JSON.parse(s.tabs || "[]")); } catch { setTabs([]); }
    setSelectedId(s.id);
    setEditOpen(true);
  };

  const openPreview = (s: CodeSnippet) => {
    setSelectedId(s.id);
    setPreviewOpen(true);
  };

  const openDelete = (s: CodeSnippet) => {
    setSelectedId(s.id);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const scheduledAt = form.scheduledAt ? new Date(form.scheduledAt).toISOString() : "";
      const body = { ...form, tabs: JSON.stringify(tabs), scheduledAt };
      const url = selectedId ? `/api/snippets/${selectedId}` : "/api/snippets";
      const method = selectedId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      setEditOpen(false);
      // Changed fetchSnippets to fetch the updated list of snippets after save
      void (async () => {
        const res = await fetch("/api/snippets?limit=200")
        if (res.ok) {
          const data = await res.json()
          setSnippets(Array.isArray(data) ? data : data.snippets || [])
        }
      })()
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await fetch(`/api/snippets/${selectedId}`, { method: "DELETE" });
      setDeleteOpen(false);
      // Changed fetchSnippets to fetch the updated list of snippets after save
      void (async () => {
        const res = await fetch("/api/snippets?limit=200")
        if (res.ok) {
          const data = await res.json()
          setSnippets(Array.isArray(data) ? data : data.snippets || [])
        }
      })()

    } catch (err) {
      console.error(err);
    }
  };

   // ─── Filter & Sort ───────────────────────────────────────
  const filtered = useMemo(() => {
    return snippets
      .filter((s) => {
        if (typeFilter !== "all" && s.type !== typeFilter) return false;

        if (search) {
          const q = search.toLowerCase();
          return (
            s.title.toLowerCase().includes(q) ||
            s.tags.toLowerCase().includes(q) ||
            s.language.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;

        if (sortField === "title") {
          return dir * a.title.localeCompare(b.title);
        }

        return (
          dir *
          (new Date(a[sortField]).getTime() -
            new Date(b[sortField]).getTime())
        );
      });
  }, [snippets, search, typeFilter, sortField, sortDir]);

    
  // ─── Bulk selection helpers ───────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((s) => s.id));
    });
  };

  const deselectAll = () => setSelectedIds(new Set());

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < filtered.length;

  // ─── Refresh helper ───────────────────────────────────────
  const refreshSnippets = async () => {
    try {
      const res = await fetch("/api/snippets?limit=200");
      if (res.ok) {
        const data = await res.json();
        setSnippets(Array.isArray(data) ? data : data.snippets || []);
      }
    } catch {
      toast({ title: "Failed to refresh snippets", variant: "destructive" });
    }
  };

  // ─── Bulk actions ─────────────────────────────────────────
  const bulkPublish = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    let success = 0;
    let failed = 0;
    const ids = [...selectedIds];
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/snippets/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: true }),
          });
          if (res.ok) success++;
          else failed++;
        } catch {
          failed++;
        }
      })
    );
    setBulkLoading(false);
    setSelectedIds(new Set());
    toast({
      title: "Bulk Publish Complete",
      description: `${success} published, ${failed} failed.`,
      variant: failed > 0 ? "destructive" : "default",
    });
    void refreshSnippets();
  };

  const bulkUnpublish = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    let success = 0;
    let failed = 0;
    const ids = [...selectedIds];
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/snippets/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: false }),
          });
          if (res.ok) success++;
          else failed++;
        } catch {
          failed++;
        }
      })
    );
    setBulkLoading(false);
    setSelectedIds(new Set());
    toast({
      title: "Bulk Unpublish Complete",
      description: `${success} unpublished, ${failed} failed.`,
      variant: failed > 0 ? "destructive" : "default",
    });
    void refreshSnippets();
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    let success = 0;
    let failed = 0;
    const ids = [...selectedIds];
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
          if (res.ok) success++;
          else failed++;
        } catch {
          failed++;
        }
      })
    );
    setBulkLoading(false);
    setBulkDeleteOpen(false);
    setSelectedIds(new Set());
    toast({
      title: "Bulk Delete Complete",
      description: `${success} deleted, ${failed} failed.`,
      variant: failed > 0 ? "destructive" : "default",
    });
    void refreshSnippets();
  };


  // ─── Tab management ──────────────────────────────────────
  const addTab = () => setTabs([...tabs, { name: "", language: "JavaScript", content: "" }]);
  const removeTab = (i: number) => setTabs(tabs.filter((_, idx) => idx !== i));
  const updateTab = (i: number, field: keyof SnippetTab, value: string) => {
    const next = [...tabs];
    next[i] = { ...next[i], [field]: value };
    setTabs(next);
  };

  

  const uniqueTypes = [...new Set(snippets.map((s) => s.type))].sort();
  const previewSnippet = snippets.find((s) => s.id === selectedId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (text: string) => (text || "").split("\n").length;

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Code Snippets</h2>
          <Badge variant="secondary" className="text-xs">{snippets.length} total</Badge>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-1.5" /> New Snippet
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button
            onClick={() => { setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
          >
            {sortDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Title</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 dark:text-gray-400">Language</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Tags</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Lines</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{s.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{s.description || s.slug}</div>
                    {s.category && (
                      <Badge variant="outline" className="text-[10px] mt-1">{s.category}</Badge>
                    )}

                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor(s.type)}`}>
                      {getTypeIcon(s.type)} {s.type}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {s.language && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${LANG_COLORS[s.language.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {s.language}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {s.tags.split(",").filter(Boolean).slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t.trim()}</Badge>
                      ))}
                      {s.tags.split(",").filter(Boolean).length > 3 && (
                        <span className="text-[10px] text-gray-400">+{s.tags.split(",").length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400 text-xs">
                    {lineCount(s.content)}
                  </td>
                  <td className="px-3 py-3">
                    {/*  Changed the status display to include scheduled date if available                  */}
                    <div className="flex flex-col gap-1">
                      <Badge variant={s.published ? "default" : "secondary"} className="text-[10px] w-fit">
                        {s.published ? "Published" : "Draft"}
                      </Badge>
                      {s.scheduledAt && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" /> {formatScheduledDate(s.scheduledAt)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPreview(s)} title="Preview">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)} title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => openDelete(s)} title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    {snippets.length === 0 ? "No snippets yet. Create your first one!" : "No results match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-2">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 dark:text-white truncate">{s.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.description || s.slug}</div>
              </div>
              <Badge variant={s.published ? "default" : "secondary"} className="text-[10px] shrink-0">
                {s.published ? "Live" : "Draft"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor(s.type)}`}>
                {getTypeIcon(s.type)} {s.type}
              </span>
              {s.language && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${LANG_COLORS[s.language.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                  {s.language}
                </span>
              )}
              <span className="text-xs text-gray-400">{lineCount(s.content)} lines</span>
            </div>
            {(s.tags || s.category) && (
              <div className="flex flex-wrap gap-1">
                {/* Display category and tags as badges */}
                {s.category && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{s.category}</Badge>
                )}
                {s.tags && s.tags.split(",").filter(Boolean).slice(0, 3).map((t) => (

                  <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t.trim()}</Badge>
                ))}
              </div>
            )}

            {/* Added */}
            {s.scheduledAt && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Clock className="w-3 h-3" /> {formatScheduledDate(s.scheduledAt)}
              </div>
            )}

            <div className="flex items-center justify-end gap-1 pt-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openPreview(s)}>
                <Eye className="w-3 h-3 mr-1" /> Preview
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEdit(s)}>
                <Edit3 className="w-3 h-3 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500" onClick={() => openDelete(s)}>
                <Trash2 className="w-3 h-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            {snippets.length === 0 ? "No snippets yet." : "No results match."}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          CREATE / EDIT DIALOG
          ═══════════════════════════════════════════════════════ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedId ? "Edit Snippet" : "New Snippet"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                placeholder="Snippet title"
              />
            </div>

            {/* Slug */}
            <div className="sm:col-span-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
            </div>

            {/* Type — preset buttons + custom input */}
            <div className="sm:col-span-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.type === t
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/50"
                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {getTypeIcon(t)} {t}
                  </button>
                ))}
              </div>
              <Input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Or type any custom type..."
                className="text-sm"
              />
              <p className="text-[11px] text-gray-400 mt-1">Click a preset above or type your own custom type</p>
            </div>

            {/* Language */}
            <div>
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mt-1"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, hooks, custom-hook" className="mt-1" />
            </div>
            
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Algorithm" className="mt-1" />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>



            {/* Description */}
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What this snippet does..." rows={2} className="mt-1" />
            </div>

              {/* ADD THIS EMBEDS BLOCK HERE */}
            <div className="sm:col-span-2">
              <Label>Embeds</Label>
              <div className="mt-1">
                <EmbedUrlInput 
                  value={form.embeds} 
                  onChange={(v) => setForm({ ...form, embeds: v })} 
                />
              </div>
            </div>
            {/* END OF ADDITION */}
            
            {/* Main Code */}
            <div className="sm:col-span-2">
              <Label htmlFor="content">Main Code</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Paste your code here..."
                rows={10}
                className="mt-1 font-mono text-sm"
              />
              <p className="text-[11px] text-gray-400 mt-1">{lineCount(form.content)} lines</p>
            </div>

            {/* ─── Tabs ─────────────────────────────────── */}
            <div className="sm:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Multi-Language Tabs</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTab} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add Tab
                </Button>
              </div>
              {tabs.length === 0 && (
                <p className="text-xs text-gray-400">No extra tabs. Click &quot;Add Tab&quot; for alternate language versions.</p>
              )}
              {tabs.map((tab, i) => (
                <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tab {i + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeTab(i)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input value={tab.name} onChange={(e) => updateTab(i, "name", e.target.value)} placeholder="Tab name (e.g. Types)" className="text-sm" />
                    <select
                      value={tab.language}
                      onChange={(e) => updateTab(i, "language", e.target.value)}
                      className="px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <Textarea
                    value={tab.content}
                    onChange={(e) => updateTab(i, "content", e.target.value)}
                    placeholder="Code for this tab..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Comment */}
            <div className="sm:col-span-2">
              <Label htmlFor="comment">Comment / Notes</Label>
              <Textarea id="comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Internal notes..." rows={2} className="mt-1" />
            </div>

            {/* ─── Demo Section ──────────────────────────── */}
            <div className="sm:col-span-2 space-y-3">
              <Label>Demo Section</Label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  value={form.demoType}
                  onChange={(e) => setForm({ ...form, demoType: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {DEMO_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                {form.demoType === "link" && (
                  <Input
                    value={form.demoUrl}
                    onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="sm:col-span-3"
                  />
                )}
              </div>
              {form.demoType === "output" && (
                <Textarea
                  value={form.demoOutput}
                  onChange={(e) => setForm({ ...form, demoOutput: e.target.value })}
                  placeholder="Expected terminal output..."
                  rows={4}
                  className="font-mono text-sm"
                />
              )}
            </div>

            {/* ─── Toggles ───────────────────────────────── */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="published" className="cursor-pointer">Published</Label>

                {form.scheduledAt && !form.published && (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-[10px]">Scheduled</Badge>
                )}
                {form.scheduledAt && form.published && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 text-[10px]">Published</Badge>
                )}

              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="rag"
                  checked={form.includeInRag}
                  onCheckedChange={(v) => setForm({ ...form, includeInRag: v })}
                />
                <Label htmlFor="rag" className="cursor-pointer">Include in RAG</Label>
              </div>
            </div>

            
            {/* Schedule Publishing */}
            <div className="sm:col-span-2">
              <Label htmlFor="scheduledAt">Schedule Publishing</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="mt-1"
              />
              {form.scheduledAt && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Will auto-publish at {formatScheduledDate(form.scheduledAt)}
                </p>
              )}
            </div>

          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
              {saving ? <><GripVertical className="w-4 h-4 animate-spin mr-1" /> Saving...</> : <><Save className="w-4 h-4 mr-1" /> Save</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════
          PREVIEW DIALOG (Fixed UI)
          ═══════════════════════════════════════════════════════ */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {previewSnippet && (() => {
            const ps = previewSnippet;
            let parsedTabs: SnippetTab[] = [];
            try { parsedTabs = JSON.parse(ps.tabs || "[]"); } catch { parsedTabs = []; }

            const allTabs = [
              { name: "Main", language: ps.language || "text", content: ps.content },
              ...parsedTabs,
            ];

            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    <DialogTitle className="text-lg">{ps.title}</DialogTitle>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor(ps.type)}`}>
                      {getTypeIcon(ps.type)} {ps.type}
                    </span>
                    {ps.language && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${LANG_COLORS[ps.language.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {ps.language}
                      </span>
                    )}
                    <Badge variant={ps.published ? "default" : "secondary"} className="text-[10px]">
                      {ps.published ? "Published" : "Draft"}
                    </Badge>
                    {ps.includeInRag && (
                      <Badge variant="outline" className="text-[10px] border-purple-400 text-purple-600 dark:text-purple-400">RAG</Badge>
                    )}
                  </div>
                  {ps.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ps.description}</p>
                  )}
                </DialogHeader>

                {/* Tags */}
                {ps.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {ps.tags.split(",").filter(Boolean).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t.trim()}</Badge>
                    ))}
                  </div>
                )}

                {/* Code Tabs */}
                <div className="mt-4 space-y-3">
                  {allTabs.map((tab, i) => (
                    <div key={i} className="rounded-xl border border-gray-700 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{tab.name}</span>
                          {tab.language && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${LANG_COLORS[tab.language.toLowerCase()] || "bg-gray-700 text-gray-400"}`}>
                              {tab.language}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500">{lineCount(tab.content)} lines</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard(tab.content)}
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                      <div className="overflow-auto max-h-[500px]">
                        <pre className="p-4 text-sm leading-relaxed">
                          <code className="text-gray-200 whitespace-pre">{tab.content || "(empty)"}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Demo */}
                {ps.demoType && (
                  <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-sm font-medium">
                      <Play className="w-3.5 h-3.5" /> Demo
                    </div>
                    <div className="p-4">
                      {ps.demoType === "link" && ps.demoUrl && (
                        <a href={ps.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline text-sm">
                          <ExternalLink className="w-3.5 h-3.5" /> {ps.demoUrl}
                        </a>
                      )}
                      {ps.demoType === "output" && ps.demoOutput && (
                        <div className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 overflow-auto max-h-[300px]">
                          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{ps.demoOutput}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Comment */}
                {ps.comment && (
                  <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ps.comment}</p>
                  </div>
                )}

                {/* Meta */}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400">
                  <span>Slug: <span className="font-mono">{ps.slug}</span></span>
                  <span>Created: {new Date(ps.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(ps.updatedAt).toLocaleDateString()}</span>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════
          DELETE DIALOG
          ═══════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Snippet?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The snippet and all its data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}