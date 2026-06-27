"use client";

import { useState } from "react";
import { X, Plus, User, Link2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface Contributor {
  name: string;
  role: string;
  avatar?: string;
  url?: string;
  hidden?: boolean;
}

interface ContributorsInputProps {
  value: string; // JSON string
  onChange: (val: string) => void;
}

export function ContributorsInput({ value, onChange }: ContributorsInputProps) {
  let contributors: Contributor[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed)) contributors = parsed;
  } catch {
    contributors = [];
  }

  const update = (next: Contributor[]) => {
    onChange(JSON.stringify(next));
  };

  const addContributor = () => {
    update([...contributors, { name: "", role: "Contributor", hidden: false }]);
  };

  const removeContributor = (index: number) => {
    update(contributors.filter((_, i) => i !== index));
  };

  const updateContributor = (index: number, field: keyof Contributor, val: string | boolean) => {
    const next = [...contributors];
    next[index] = { ...next[index], [field]: val };
    update(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label>Team / Contributors</Label>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Add people who contributed to this project. Toggle visibility per person.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addContributor} className="h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add Person
        </Button>
      </div>

      {contributors.length === 0 && (
        <div className="text-center py-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 text-sm">
          <User className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
          No contributors added yet
        </div>
      )}

      <div className="space-y-2">
        {contributors.map((c, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3 space-y-2 transition-colors ${
              c.hidden
                ? "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 opacity-60"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                #{i + 1} {c.hidden && <span className="text-gray-400">(hidden)</span>}
              </span>
              <div className="flex items-center gap-1.5">
                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={() => updateContributor(i, "hidden", !c.hidden)}
                  className={`p-1 rounded-md transition-colors ${
                    c.hidden
                      ? "text-gray-400 hover:text-gray-600"
                      : "text-green-600 dark:text-green-400 hover:text-green-700"
                  }`}
                  title={c.hidden ? "Hidden from public" : "Visible to public"}
                >
                  {c.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeContributor(i)}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={c.name}
                onChange={(e) => updateContributor(i, "name", e.target.value)}
                placeholder="Name"
                className="text-sm"
              />
              <Input
                value={c.role}
                onChange={(e) => updateContributor(i, "role", e.target.value)}
                placeholder="Role (e.g. Frontend Dev)"
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={c.avatar || ""}
                onChange={(e) => updateContributor(i, "avatar", e.target.value)}
                placeholder="Avatar URL (optional)"
                className="text-sm"
              />
              <Input
                value={c.url || ""}
                onChange={(e) => updateContributor(i, "url", e.target.value)}
                placeholder="Profile URL (optional)"
                className="text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Public Contributors Display ──────────────────────────────

interface ContributorsDisplayProps {
  contributorsJson: string;
  showTeam: boolean;
}

export function ContributorsDisplay({ contributorsJson, showTeam }: ContributorsDisplayProps) {
  if (!showTeam) return null;

  let contributors: Contributor[] = [];
  try {
    const parsed = JSON.parse(contributorsJson || "[]");
    if (Array.isArray(parsed)) contributors = parsed;
  } catch {
    return null;
  }

  const visible = contributors.filter((c) => !c.hidden);
  if (visible.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contributors</h3>
      <div className="flex flex-wrap gap-3">
        {visible.map((c, i) => {
          const Wrapper = c.url ? "a" : "div";
          return (
            <Wrapper
              key={i}
              {...(c.url ? { href: c.url, target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 transition-colors ${
                c.url ? "hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm" : ""
              }`}
            >
              {c.avatar ? (
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {c.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</div>
                {c.role && (
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">{c.role}</div>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}