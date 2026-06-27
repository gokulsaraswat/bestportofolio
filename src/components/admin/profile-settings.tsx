"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save, RotateCcw, Loader2, Eye, User, Palette, Layout,
  Type, Zap, Monitor, Moon, Sun, Globe, Code2, MessageSquare,
  Plus, Trash2, AlertCircle, CheckCircle2, MousePointer2, Video,
  Users, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";

interface SiteSettings {
  name: string; title: string; description: string; email: string; location: string;
  avatarUrl: string; resumeUrl: string; githubUrl: string; linkedinUrl: string;
  twitterUrl: string; websiteUrl: string; heroGreeting: string; heroTypingLines: string;
  heroCtaText: string; heroCtaUrl: string; primaryColor: string; accentColor: string;
  fontFamily: string; layoutStyle: string; enableAnimations: boolean; enableParticles: boolean;
  roundedCorners: boolean; siteUrl: string; ogImage: string; favicon: string;
  enableComments: boolean; enableRag: boolean; enableContact: boolean; enableBlog: boolean;
  enableProjects: boolean; enableCourses: boolean; enableSnippets: boolean; contactEmail: string;
  showVisitorCount: boolean; showGithubStats: boolean; enableCustomCursor: boolean;
  cursorMagneticSnap: boolean; enableAutoEmbeds: boolean; footerText: string;
  copyrightName: string; [key: string]: string | boolean | number | undefined;
}

const DEFAULT_SETTINGS: SiteSettings = {
  name: "Gokul Saraswat", title: "Full Stack Developer", description: "", email: "",
  location: "", avatarUrl: "", resumeUrl: "", githubUrl: "", linkedinUrl: "",
  twitterUrl: "", websiteUrl: "", heroGreeting: "Hi, I'm",
  heroTypingLines: '["Full Stack Developer","Problem Solver"]', heroCtaText: "Get in Touch",
  heroCtaUrl: "/contact", primaryColor: "#3b82f6", accentColor: "#8b5cf6",
  fontFamily: "Inter", layoutStyle: "modern", enableAnimations: true, enableParticles: false,
  roundedCorners: true, siteUrl: "", ogImage: "", favicon: "", enableComments: true,
  enableRag: false, enableContact: true, enableBlog: true, enableProjects: true,
  enableCourses: true, enableSnippets: true, contactEmail: "", showVisitorCount: true,
  showGithubStats: true, enableCustomCursor: false, cursorMagneticSnap: true,
  enableAutoEmbeds: true, footerText: "", copyrightName: "Gokul Saraswat",
};

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "hero", label: "Hero", icon: Type },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "features", label: "Features", icon: Zap },
  { id: "experiments", label: "Experiments", icon: MousePointer2 },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "footer", label: "Footer", icon: Layout },
];

function safeParseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((i) => typeof i === "string");
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return [];
    try { const p = JSON.parse(t); if (Array.isArray(p)) return p.filter((i: unknown) => typeof i === "string"); if (typeof p === "string") return [p]; return []; } catch { return [t]; }
  }
  return [];
}
function safeStringifyArray(lines: string[]): string { try { return JSON.stringify(lines); } catch { return "[]"; } }

export function ProfileSettings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [typingLines, setTypingLines] = useState<string[]>(["Full Stack Developer", "Problem Solver"]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const merged = { ...DEFAULT_SETTINGS, ...data };
        const pl = safeParseStringArray(merged.heroTypingLines);
        setTypingLines(pl.length > 0 ? pl : ["Full Stack Developer", "Problem Solver"]);
        merged.heroTypingLines = safeStringifyArray(pl.length > 0 ? pl : ["Full Stack Developer", "Problem Solver"]);
        setSettings(merged);
        setOriginalSettings(merged);
      }
    } catch { setTypingLines(["Full Stack Developer", "Problem Solver"]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);
  const us = (key: keyof SiteSettings, value: string | boolean) => setSettings((p) => ({ ...p, [key]: value }));
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSave = async () => {
    setSaving(true);
    try {
      const stl = safeStringifyArray(typingLines.filter((l) => l.trim()));
      const payload = { ...settings, heroTypingLines: stl };
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setOriginalSettings({ ...settings, heroTypingLines: stl });
      showMessage("success", "Settings saved successfully!");
    } catch { showMessage("error", "Failed to save settings."); }
    finally { setSaving(false); }
  };

  const handleReset = () => { setSettings(originalSettings); setTypingLines(safeParseStringArray(originalSettings.heroTypingLines)); };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-3" /><span className="text-gray-400">Loading...</span></div>;

  const FeatureRow = ({ k, label, desc, icon }: { k: keyof SiteSettings; label: string; desc: string; icon: React.ReactNode }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-3"><div className="text-gray-400 dark:text-gray-500">{icon}</div><div><div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div><div className="text-[11px] text-gray-500 dark:text-gray-400">{desc}</div></div></div>
      <Switch checked={!!settings[k]} onCheckedChange={(v) => us(k, v)} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2><p className="text-sm text-gray-500 dark:text-gray-400">Manage your portfolio</p></div>
        <div className="flex items-center gap-2">
          {hasChanges && <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="w-3.5 h-3.5 mr-1" />Undo</Button>}
          <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}>{saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}Save</Button>
        </div>
      </div>
      {message && <div className={`flex items-center gap-2 p-3 rounded-xl border ${message.type === "success" ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400"}`}>{message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}<span className="text-sm">{message.text}</span></div>}

      <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide border-b border-gray-200 dark:border-gray-700">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <tab.icon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-white dark:bg-gray-900">

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={settings.name} onChange={(e) => us("name", e.target.value)} className="mt-1" /></div>
              <div><Label>Title / Role</Label><Input value={settings.title} onChange={(e) => us("title", e.target.value)} className="mt-1" /></div>
              <div className="sm:col-span-2"><Label>Bio</Label><Textarea value={settings.description} onChange={(e) => us("description", e.target.value)} rows={3} className="mt-1" /></div>
              <div><Label>Email</Label><Input type="email" value={settings.email} onChange={(e) => us("email", e.target.value)} className="mt-1" /></div>
              <div><Label>Location</Label><Input value={settings.location} onChange={(e) => us("location", e.target.value)} className="mt-1" /></div>
              <div><Label>Avatar URL</Label><Input value={settings.avatarUrl} onChange={(e) => us("avatarUrl", e.target.value)} className="mt-1" /></div>
              <div><Label>Resume URL</Label><Input value={settings.resumeUrl} onChange={(e) => us("resumeUrl", e.target.value)} className="mt-1" /></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-6 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>GitHub</Label><Input value={settings.githubUrl} onChange={(e) => us("githubUrl", e.target.value)} className="mt-1" /></div>
              <div><Label>LinkedIn</Label><Input value={settings.linkedinUrl} onChange={(e) => us("linkedinUrl", e.target.value)} className="mt-1" /></div>
              <div><Label>Twitter / X</Label><Input value={settings.twitterUrl} onChange={(e) => us("twitterUrl", e.target.value)} className="mt-1" /></div>
              <div><Label>Website</Label><Input value={settings.websiteUrl} onChange={(e) => us("websiteUrl", e.target.value)} className="mt-1" /></div>
            </div>
          </div>
        )}

        {/* HERO */}
        {activeTab === "hero" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Hero Section</h3>
            <div><Label>Greeting</Label><Input value={settings.heroGreeting} onChange={(e) => us("heroGreeting", e.target.value)} className="mt-1" /></div>
            <div>
              <div className="flex items-center justify-between mb-2"><Label>Typing Lines</Label><Button type="button" variant="outline" size="sm" onClick={() => setTypingLines([...typingLines, ""])} className="h-7 text-xs"><Plus className="w-3 h-3 mr-1" />Add</Button></div>
              <div className="space-y-2">{typingLines.map((line, i) => (<div key={i} className="flex items-center gap-2"><span className="text-xs text-gray-400 w-6 shrink-0 text-right">{i + 1}.</span><Input value={line} onChange={(e) => { const n = [...typingLines]; n[i] = e.target.value; setTypingLines(n); }} className="flex-1" /><Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-500" onClick={() => typingLines.length > 1 && setTypingLines(typingLines.filter((_, idx) => idx !== i))}><Trash2 className="w-3.5 h-3.5" /></Button></div>))}</div>
              <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="text-[10px] text-gray-400 mb-1 font-medium">PREVIEW</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{settings.heroGreeting} <span className="text-blue-600 dark:text-blue-400 font-semibold">{typingLines[0] || "..."}</span><span className="animate-pulse text-gray-400">|</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div><Label>CTA Text</Label><Input value={settings.heroCtaText} onChange={(e) => us("heroCtaText", e.target.value)} className="mt-1" /></div>
              <div><Label>CTA URL</Label><Input value={settings.heroCtaUrl} onChange={(e) => us("heroCtaUrl", e.target.value)} className="mt-1" /></div>
            </div>
          </div>
        )}

        {/* APPEARANCE */}
        {activeTab === "appearance" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div><div className="text-sm font-medium text-gray-900 dark:text-white">Preview</div></div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setTheme("light")} className={`p-2 rounded-lg ${theme === "light" ? "bg-white shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Sun className="w-4 h-4" /></button>
                <button onClick={() => setTheme("dark")} className={`p-2 rounded-lg ${theme === "dark" ? "bg-gray-800 shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Moon className="w-4 h-4" /></button>
                <button onClick={() => setTheme("system")} className={`p-2 rounded-lg ${theme === "system" ? "bg-gray-200 shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Monitor className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Primary Color</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={settings.primaryColor} onChange={(e) => us("primaryColor", e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" /><Input value={settings.primaryColor} onChange={(e) => us("primaryColor", e.target.value)} className="flex-1 font-mono text-sm" /></div></div>
              <div><Label>Accent</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={settings.accentColor} onChange={(e) => us("accentColor", e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" /><Input value={settings.accentColor} onChange={(e) => us("accentColor", e.target.value)} className="flex-1 font-mono text-sm" /></div></div>
            </div>
            <div className="space-y-3 pt-2">
              <FeatureRow k="enableAnimations" label="Animations" desc="Transitions and hover effects" icon={<Zap className="w-4 h-4" />} />
              <FeatureRow k="enableParticles" label="Particles" desc="Background particles" icon={<Zap className="w-4 h-4" />} />
              <FeatureRow k="roundedCorners" label="Rounded" desc="Rounded cards and buttons" icon={<Layout className="w-4 h-4" />} />
            </div>
          </div>
        )}

        {/* FEATURES */}
        {activeTab === "features" && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
            <FeatureRow k="enableBlog" label="Blog" desc="Blog section" icon={<MessageSquare className="w-4 h-4" />} />
            <FeatureRow k="enableProjects" label="Projects" desc="Projects section" icon={<Layout className="w-4 h-4" />} />
            <FeatureRow k="enableCourses" label="Courses" desc="Courses section" icon={<GraduationCap className="w-4 h-4" />} />
            <FeatureRow k="enableSnippets" label="Snippets" desc="Code snippets section" icon={<Code2 className="w-4 h-4" />} />
            <FeatureRow k="enableComments" label="Comments" desc="Allow comments" icon={<MessageSquare className="w-4 h-4" />} />
            <FeatureRow k="enableRag" label="AI Chat" desc="RAG chatbot" icon={<Zap className="w-4 h-4" />} />
            <FeatureRow k="enableContact" label="Contact" desc="Contact form" icon={<Globe className="w-4 h-4" />} />
            <FeatureRow k="showVisitorCount" label="Visitor Counter" desc="Public visitor count" icon={<Eye className="w-4 h-4" />} />
            <FeatureRow k="showGithubStats" label="GitHub Stats" desc="Contribution stats" icon={<Code2 className="w-4 h-4" />} />
            <div className="pt-2"><Label>Contact Email</Label><Input value={settings.contactEmail} onChange={(e) => us("contactEmail", e.target.value)} className="mt-1" /></div>
          </div>
        )}

        {/* EXPERIMENTS — NEW */}
        {activeTab === "experiments" && (
          <div className="space-y-5">
            <div><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Experimental</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Toggle off if issues occur.</p></div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400"><MousePointer2 className="w-5 h-5" /></div>
                  <div><div className="text-sm font-semibold text-gray-900 dark:text-white">Custom Cursor</div><p className="text-[11px] text-gray-500 dark:text-gray-400">Dot + delayed circle following mouse</p></div>
                </div>
                <Switch checked={!!settings.enableCustomCursor} onCheckedChange={(v) => us("enableCustomCursor", v)} />
              </div>
              {!!settings.enableCustomCursor && (
                <div className="ml-[52px]">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div><div className="text-xs font-medium text-gray-900 dark:text-white">Magnetic Snap</div><div className="text-[10px] text-gray-500 dark:text-gray-400">Circle snaps to interactive elements</div></div>
                    <Switch checked={!!settings.cursorMagneticSnap} onCheckedChange={(v) => us("cursorMagneticSnap", v)} className="scale-75" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400"><Video className="w-5 h-5" /></div>
                  <div><div className="text-sm font-semibold text-gray-900 dark:text-white">Auto-Embed</div><p className="text-[11px] text-gray-500 dark:text-gray-400">YouTube/Spotify/Twitter auto-embed</p></div>
                </div>
                <Switch checked={!!settings.enableAutoEmbeds} onCheckedChange={(v) => us("enableAutoEmbeds", v)} />
              </div>
              <div className="ml-[52px] mt-2">
                <p className="text-[10px] text-gray-400">Pasting URLs in blogs, snippets, or courses auto-renders embedded players. You can also add embeds manually via the &quot;Embed URLs&quot; field in each editor.</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[{ l: "YouTube", c: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" }, { l: "Spotify", c: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" }, { l: "Twitter/X", c: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" }, { l: "Custom iframe", c: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" }].map((t) => (
                    <span key={t.l} className={`px-2 py-0.5 rounded text-[10px] font-medium ${t.c}`}>{t.l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">SEO</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Label>Site URL</Label><Input value={settings.siteUrl} onChange={(e) => us("siteUrl", e.target.value)} className="mt-1" /></div>
              <div className="sm:col-span-2"><Label>OG Image</Label><Input value={settings.ogImage} onChange={(e) => us("ogImage", e.target.value)} className="mt-1" /></div>
              <div><Label>Favicon</Label><Input value={settings.favicon} onChange={(e) => us("favicon", e.target.value)} className="mt-1" /></div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {activeTab === "footer" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Footer</h3>
            <div><Label>Footer Text</Label><Textarea value={settings.footerText} onChange={(e) => us("footerText", e.target.value)} rows={2} className="mt-1" /></div>
            <div><Label>Copyright Name</Label><Input value={settings.copyrightName} onChange={(e) => us("copyrightName", e.target.value)} className="mt-1" /></div>
          </div>
        )}
      </div>

      {hasChanges && <div className="fixed bottom-0 left-0 right-0 p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 lg:hidden z-40"><Button onClick={handleSave} disabled={saving} className="w-full">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}Save</Button></div>}
    </div>
  );
}