"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Edit3,
  PlusCircle,
  Eye,
  Clock,
  ArrowUpDown,
  X,
} from "lucide-react";

interface OperationLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  actor: string;
  createdAt: string;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  create: <PlusCircle className="w-3.5 h-3.5 text-green-500" />,
  update: <Edit3 className="w-3.5 h-3.5 text-blue-500" />,
  delete: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
  view: <Eye className="w-3.5 h-3.5 text-gray-400" />,
  error: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
  login: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  view: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  login: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const ENTITY_COLORS: Record<string, string> = {
  snippet: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  blog: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  project: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  course: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  comment: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  auth: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default function OperationLogsViewer() {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/operation-logs");
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch operation logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs
    .filter((log) => {
      if (actionFilter !== "all" && log.action !== actionFilter) return false;
      if (entityFilter !== "all" && log.entityType !== entityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.entityType.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.actor.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return sortAsc ? tA - tB : tB - tA;
    });

  const uniqueActions = [...new Set(logs.map((l) => l.action))].sort();
  const uniqueEntities = [...new Set(logs.map((l) => l.entityType))].sort();

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFullTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setActionFilter("all");
    setEntityFilter("all");
  };

  const hasActiveFilters = search || actionFilter !== "all" || entityFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Operation Logs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {logs.length} total entries
            {hasActiveFilters && ` · ${filteredLogs.length} shown`}
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs by action, entity, details, actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/50"
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
          <ChevronDown
            className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Filter Dropdowns */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Action
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Entity Type
            </label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Entities</option>
              {uniqueEntities.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sort Toggle */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <ArrowUpDown className="w-3 h-3" />
        <span>Sorted by: newest first</span>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          {sortAsc ? "Switch to newest" : "Switch to oldest"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Loading logs...
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No operation logs yet.</p>
          <p className="text-xs mt-1">
            Logs will appear here as you create, update, or delete content.
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && logs.length > 0 && filteredLogs.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No logs match your filters.</p>
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Logs List */}
      {!loading && filteredLogs.length > 0 && (
        <div className="space-y-1.5">
          {filteredLogs.map((log) => {
            const isExpanded = expandedId === log.id;
            const actionIcon = ACTION_ICONS[log.action] || (
              <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
            );
            const actionColor =
              ACTION_COLORS[log.action] ||
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
            const entityColor =
              ENTITY_COLORS[log.entityType] ||
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

            return (
              <div
                key={log.id}
                className={`group rounded-lg border transition-colors cursor-pointer ${
                  isExpanded
                    ? "border-blue-300 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : log.id)}
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">{actionIcon}</div>

                  {/* Action Badge */}
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${actionColor}`}
                  >
                    {log.action}
                  </span>

                  {/* Entity Badge */}
                  {log.entityType && (
                    <span
                      className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entityColor}`}
                    >
                      {log.entityType}
                    </span>
                  )}

                  {/* Details (truncated) */}
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate min-w-0">
                    {log.details || log.entityId}
                  </span>

                  {/* Actor */}
                  {log.actor && (
                    <span className="hidden sm:inline-flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                      by {log.actor}
                    </span>
                  )}

                  {/* Time */}
                  <span
                    className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500"
                    title={formatFullTime(log.createdAt)}
                  >
                    {formatTime(log.createdAt)}
                  </span>

                  {/* Expand chevron */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Log ID:
                        </span>
                        <span className="ml-1 font-mono text-gray-700 dark:text-gray-300 break-all">
                          {log.id}
                        </span>
                      </div>
                      {log.entityId && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Entity ID:
                          </span>
                          <span className="ml-1 font-mono text-gray-700 dark:text-gray-300 break-all">
                            {log.entityId}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Timestamp:
                        </span>
                        <span className="ml-1 text-gray-700 dark:text-gray-300">
                          {formatFullTime(log.createdAt)}
                        </span>
                      </div>
                      {log.actor && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Actor:
                          </span>
                          <span className="ml-1 text-gray-700 dark:text-gray-300">
                            {log.actor}
                          </span>
                        </div>
                      )}
                    </div>
                    {log.details && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Details:
                        </span>
                        <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words bg-white dark:bg-gray-800 rounded-md p-2 border border-gray-200 dark:border-gray-700">
                          {log.details}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}