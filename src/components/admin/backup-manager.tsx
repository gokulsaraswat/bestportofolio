"use client";

import { useState, useCallback, useEffect } from "react";
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

// FIX: Configurable backup entity types
const BACKUP_ENTITIES = [
  { key: "blogs", label: "Blogs", icon: <FileText className="w-4 h-4" />, color: "text-blue-500" },
  { key: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" />, color: "text-purple-500" },
  { key: "courses", label: "Courses", icon: <GraduationCap className="w-4 h-4" />, color: "text-green-500" },
  { key: "snippets", label: "Snippets", icon: <Code2 className="w-4 h-4" />, color: "text-orange-500" },
  { key: "messages", label: "Messages", icon: <Trash2 className="w-4 h-4" />, color: "text-pink-500" },
  { key: "todos", label: "Todos", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-amber-500" },
  { key: "profile", label: "Profile & Settings", icon: <Database className="w-4 h-4" />, color: "text-cyan-500" },
  { key: "comments", label: "Comments", icon: <FileText className="w-4 h-4" />, color: "text-teal-500" },
  { key: "users", label: "Admin Users", icon: <Database className="w-4 h-4" />, color: "text-rose-500" },
] as const;

type BackupEntityKey = typeof BACKUP_ENTITIES[number]["key"];

export function BackupManager() {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backupStats, setBackupStats] = useState<Record<string, number> | null>(null);

  // FIX: Track which entities to include in backup
// Track which entities to include in backup (initially none selected)
  const [selectedEntities, setSelectedEntities] = useState<Set<BackupEntityKey>>(
    new Set()
  );

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const toggleEntity = (key: BackupEntityKey) => {
    setSelectedEntities(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedEntities.size === BACKUP_ENTITIES.length) {
      setSelectedEntities(new Set());
    } else {
      setSelectedEntities(new Set(BACKUP_ENTITIES.map(e => e.key)));
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const [blogsRes, projectsRes, coursesRes, snippetsRes, msgsRes, todosRes] = await Promise.allSettled([
        fetch("/api/blogs?limit=1"),
        fetch("/api/projects?limit=1"),
        fetch("/api/courses?limit=1"),
        fetch("/api/snippets?limit=1"),
        fetch("/api/messages?limit=1"),
        fetch("/api/todos?limit=1"),
      ]);

      const getCount = async (res: PromiseSettledResult<Response>): Promise<number> => {
        if (res.status !== "fulfilled") return 0;
        try {
          const text = await res.value.clone().text();
          const data = JSON.parse(text);
          return data?.total || data?.count || (Array.isArray(data) ? data.length : 0);
        } catch { return 0; }
      };

      const [blogs, projects, courses, snippets, messages, todos] = await Promise.all([
        getCount(blogsRes), getCount(projectsRes), getCount(coursesRes),
        getCount(snippetsRes), getCount(msgsRes), getCount(todosRes),
      ]);

      setBackupStats({ blogs, projects, courses, snippets, messages, todos });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleExport = async () => {
    if (selectedEntities.size === 0) {
      showMessage("error", "Select at least one entity to export.");
      return;
    }

    setLoading(true);
    try {
      const entities = Array.from(selectedEntities).join(",");
      const res = await fetch(`/api/backup?entities=${encodeURIComponent(entities)}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `portfolio-backup-${now}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", `Backup exported successfully! (${selectedEntities.size} entities)`);
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

      const res = await fetch("/api/backup", {
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

  const allSelected = selectedEntities.size === BACKUP_ENTITIES.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Backup & Restore</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select what to include, then export or import</p>
        </div>
        <Button onClick={handleExport} disabled={loading || selectedEntities.size === 0} className="w-full sm:w-auto">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Download className="w-4 h-4 mr-1.5" />}
          Export Backup ({selectedEntities.size} items)
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

      {/* FIX: Select entities to backup */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Select Entities to Backup</h3>
          </div>
          <button
            onClick={selectAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {BACKUP_ENTITIES.map((entity) => {
            const isSelected = selectedEntities.has(entity.key);
            const count = backupStats ? (backupStats[entity.key] ?? 0) : null;
            return (
              <button
                key={entity.key}
                onClick={() => toggleEntity(entity.key)}
                className={`flex items-center gap-2.5 p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors shrink-0 ${
                  isSelected
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="min-w-0">
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                    <span className={isSelected ? "" : entity.color}>{entity.icon}</span>
                    {entity.label}
                  </div>
                  {count !== null && (
                    <div className="text-[10px] text-gray-400 mt-0.5">{count} items</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Stats */}
      {backupStats && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Content Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Blogs", count: backupStats.blogs || 0, icon: <FileText className="w-4 h-4" />, color: "text-blue-500" },
              { label: "Projects", count: backupStats.projects || 0, icon: <FolderKanban className="w-4 h-4" />, color: "text-purple-500" },
              { label: "Courses", count: backupStats.courses || 0, icon: <GraduationCap className="w-4 h-4" />, color: "text-green-500" },
              { label: "Snippets", count: backupStats.snippets || 0, icon: <Code2 className="w-4 h-4" />, color: "text-orange-500" },
              { label: "Messages", count: backupStats.messages || 0, icon: <Trash2 className="w-4 h-4" />, color: "text-pink-500" },
              { label: "Todos", count: backupStats.todos || 0, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-amber-500" },
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
            Select which entities to include: Blogs, Projects, Courses, Code Snippets, Messages, Todos, Profile, Comments, and Admin Users. Check/uncheck above.
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