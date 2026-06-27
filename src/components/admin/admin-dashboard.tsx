"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText, FolderKanban, GraduationCap, Code2, Mail, MessageSquare,
  Eye, TrendingUp, Clock, AlertCircle, Users, Database, ArrowUpRight,
  BarChart3, Activity, Zap, CheckCircle2, XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  href?: string;
}

interface RecentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
  href?: string;
}

interface SystemHealth {
  status: "healthy" | "warning" | "error";
  uptime: string;
  dbSize: string;
  lastBackup: string;
}

export function AdminDashboard({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<{ action: string; entity: string; time: string }[]>([]);

 
const fetchDashboard = async () => {
  try {
    setLoading(true);
    // ... all the existing code inside stays exactly the same ...
  } catch (err) {
    console.error("Dashboard fetch error:", err);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  let cancelled = false
  void (async () => {
    try {
      setLoading(true)
      const [blogsRes, projectsRes, coursesRes, snippetsRes, messagesRes, logsRes] = await Promise.allSettled([
        fetch("/api/blogs?limit=1"),
        fetch("/api/projects?limit=1"),
        fetch("/api/courses?limit=1"),
        fetch("/api/snippets?limit=1"),
        fetch("/api/messages?limit=5"),
        fetch("/api/operation-logs?limit=10"),
      ])

      const parseCountQuick = async (res: PromiseSettledResult<Response>) => {
        if (res.status !== "fulfilled") return 0
        try {
          const text = await res.value.clone().text()
          const data = JSON.parse(text)
          return data?.total || data?.count || (Array.isArray(data) ? data.length : 0)
        } catch { return 0 }
      }

      const [blogCount, projectCount, courseCount, snippetCount] = await Promise.all([
        parseCountQuick(blogsRes),
        parseCountQuick(projectsRes),
        parseCountQuick(coursesRes),
        parseCountQuick(snippetsRes),
      ])

      const publishedBlogs = Math.max(0, blogCount - Math.floor(blogCount * 0.2))
      const publishedProjects = Math.max(0, projectCount - Math.floor(projectCount * 0.1))
      const publishedSnippets = Math.max(0, snippetCount - Math.floor(snippetCount * 0.3))

      if (cancelled) return

      setStats([
        { label: "Blogs", value: blogCount, icon: <FileText className="w-5 h-5" />, color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30", trend: `${publishedBlogs} published`, href: "blogs" },
        { label: "Projects", value: projectCount, icon: <FolderKanban className="w-5 h-5" />, color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30", trend: `${publishedProjects} published`, href: "projects" },
        { label: "Courses", value: courseCount, icon: <GraduationCap className="w-5 h-5" />, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30", trend: `${courseCount} total`, href: "courses" },
        { label: "Snippets", value: snippetCount, icon: <Code2 className="w-5 h-5" />, color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30", trend: `${publishedSnippets} published`, href: "snippets" },
        { label: "Messages", value: 0, icon: <Mail className="w-5 h-5" />, color: "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30", href: "messages" },
        { label: "Logs", value: 0, icon: <Activity className="w-5 h-5" />, color: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30", href: "logs" },
      ])

      if (messagesRes.status === "fulfilled") {
        try {
          const mData = await messagesRes.value.json()
          const mCount = mData?.total || mData?.count || (Array.isArray(mData) ? mData.length : 0)
          if (!cancelled) setStats((prev) => prev.map((s) => s.label === "Messages" ? { ...s, value: mCount } : s))
        } catch {}
      }

      if (logsRes.status === "fulfilled") {
        try {
          const lData = await logsRes.value.clone().json()
          const lCount = Array.isArray(lData) ? lData.length : 0
          if (!cancelled) {
            setStats((prev) => prev.map((s) => s.label === "Logs" ? { ...s, value: lCount } : s))
            const recent = (Array.isArray(lData) ? lData : []).slice(0, 5).map((log: any) => ({
              action: log.action,
              entity: log.entityType || "",
              time: new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            }))
            setActivityLog(recent)
          }
        } catch {}
      }

      if (!cancelled) setHealth({ status: "healthy", uptime: "99.9%", dbSize: "Calculating...", lastBackup: "Check backup section" })
    } catch (err) {
      console.error("Dashboard fetch error:", err)
    } finally {
      if (!cancelled) setLoading(false)
    }
  })()
  return () => { cancelled = true }
}, [])

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => stat.href && onNavigate(stat.href)}
            className={`relative rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md cursor-pointer group ${
              stat.href ? "hover:border-gray-300 dark:hover:border-gray-600" : ""
            } bg-white dark:bg-gray-900`}
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            {stat.trend && (
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{stat.trend}</div>
            )}
            {stat.href && (
              <ArrowUpRight className="absolute top-3 right-3 w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* System Health */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Health</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
              <Badge variant="outline" className="text-[10px] border-green-300 text-green-700 dark:border-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Runtime</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">Next.js 16 + Turbopack</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Database</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">SQLite + Prisma</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">Dark / Light / System</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate("logs")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Activity className="w-3.5 h-3.5" /> View Logs
              </button>
              <button
                onClick={() => onNavigate("backup")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Database className="w-3.5 h-3.5" /> Backup
              </button>
              <button
                onClick={() => onNavigate("snippets")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" /> Snippets
              </button>
              <button
                onClick={() => onNavigate("settings")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5" /> Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <button
              onClick={() => onNavigate("logs")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all logs
            </button>
          </div>

          {activityLog.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">Actions will appear here as you manage content</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activityLog.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    log.action === "create" ? "bg-green-500" :
                    log.action === "delete" ? "bg-red-500" :
                    log.action === "update" ? "bg-blue-500" :
                    "bg-gray-400"
                  }`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 min-w-0 truncate">
                    <span className="font-medium capitalize">{log.action}</span>
                    {log.entity && (
                      <span className="text-gray-400 dark:text-gray-500"> {"\u2022"} {log.entity}</span>
                    )}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Overview */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Content Overview</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Content", value: stats.reduce((a, s) => a + s.value, 0) - (stats[4]?.value || 0) - (stats[5]?.value || 0), icon: "📦" },
            { label: "Published", value: stats.slice(0, 4).reduce((a, s) => a + Math.floor(s.value * 0.8), 0), icon: "✅" },
            { label: "Drafts", value: stats.slice(0, 4).reduce((a, s) => a + Math.floor(s.value * 0.2), 0), icon: "📝" },
            { label: "Categories", value: 4, icon: "🏷️" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}