"use client";

import { useState, useCallback } from "react";
import {
  Database, Download, Upload, RefreshCw, HardDrive, FileText, FolderKanban,
  GraduationCap, Code2, Trash2, CheckCircle2, AlertCircle, Loader2, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BackupMeta {
  name: string;
  size: string;
  date: string;
  types: string[];
}

export function BackupManager() {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backupStats, setBackupStats] = useState<{ blogs: number; projects: number; courses: number; snippets: number; messages: number } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Fetch counts for backup stats
  const fetchStats = useCallback(async () => {
    try {
      const [blogsRes, projectsRes, coursesRes, snippetsRes, msgsRes] = await Promise.allSettled([
        fetch("/api/blogs?limit=1"),
        fetch("/api/projects?limit=1"),
        fetch("/api/courses?limit=1"),
        fetch("/api/snippets?limit=1"),
        fetch("/api/messages?limit=1"),
      ]);

      const getCount = async (res: PromiseSettledResult<Response>): Promise<number> => {
        if (res.status !== "fulfilled") return 0;
        try {
          const text = await res.value.clone().text();
          const data = JSON.parse(text);
          return data?.total || data?.count || (Array.isArray(data) ? data.length : 0);
        } catch { return 0; }
      };

      const [blogs, projects, courses, snippets, messages] = await Promise.all([
        getCount(blogsRes), getCount(projectsRes), getCount(coursesRes),
        getCount(snippetsRes), getCount(msgsRes),
      ]);

      setBackupStats({ blogs, projects, courses, snippets, messages });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useState(() => { fetchStats(); });

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/backup/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `portfolio-backup-${now}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", "Backup exported successfully!");
    } catch (err) {
      showMessage("error", "Failed to export backup. Make sure the export API is available.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;
    setRestoring(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Restore failed");
      showMessage("success", "Backup restored successfully! Refresh the page to see changes.");
      setRestoreDialog(false);
      setSelectedFile(null);
    } catch (err) {
      showMessage("error", "Failed to restore backup. Check the file format.");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Backup & Restore</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Export and import all portfolio data including snippets</p>
        </div>
        <Button onClick={handleExport} disabled={loading} className="w-full sm:w-auto">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Download className="w-4 h-4 mr-1.5" />}
          Export Backup
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border ${
          message.type === "success"
            ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400"
            : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Content Stats */}
      {backupStats && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Content Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Blogs", count: backupStats.blogs, icon: <FileText className="w-4 h-4" />, color: "text-blue-500" },
              { label: "Projects", count: backupStats.projects, icon: <FolderKanban className="w-4 h-4" />, color: "text-purple-500" },
              { label: "Courses", count: backupStats.courses, icon: <GraduationCap className="w-4 h-4" />, color: "text-green-500" },
              { label: "Snippets", count: backupStats.snippets, icon: <Code2 className="w-4 h-4" />, color: "text-orange-500" },
              { label: "Messages", count: backupStats.messages, icon: <Trash2 className="w-4 h-4" />, color: "text-pink-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className={item.color}>{item.icon}</div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restore Section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-3">
          <Upload className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Restore from Backup</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Upload a previously exported JSON file to restore all data. This will merge with existing content.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-colors bg-gray-50 dark:bg-gray-800/30">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedFile ? selectedFile.name : "Choose backup file..."}
            </span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
              }}
            />
          </label>
          <Button
            variant="outline"
            onClick={() => selectedFile && setRestoreDialog(true)}
            disabled={!selectedFile}
            className="self-end"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Restore
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Auto-backup</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manual backup recommended before making major changes. Use the Export button above to create a full snapshot.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">What&apos;s included</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Blogs, Projects, Courses, Code Snippets (with tabs, demos, tags), Messages, and all related metadata are included in the backup.
          </p>
        </div>
      </div>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialog} onOpenChange={setRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore data from &quot;{selectedFile?.name}&quot;. Existing content with matching IDs will be updated. New content will be created. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} disabled={restoring}>
              {restoring ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              {restoring ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}