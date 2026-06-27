#!/bin/bash
# ============================================================
#  Portfolio — Major Update v3
#  Embeds, Custom Cursor, Contributors, Settings
#
#  Usage:
#    cd ~/Desktop/New\ folder
#    bash update-v3.sh
# ============================================================

set -e

echo ""
echo "============================================"
echo " Portfolio Update v3"
echo " Embeds + Cursor + Contributors + Settings"
echo "============================================"
echo ""

SRC="Updates"
TOTAL=8
CURRENT=0

step() {
  CURRENT=$((CURRENT + 1))
  echo "[$CURRENT/$TOTAL] $1..."
}

# ── 1. Embed Renderer Component ──
step "Installing embed renderer (YouTube, Spotify, Twitter, custom)"
mkdir -p src/components
cp "$SRC/src/components/embed-renderer.tsx" "src/components/embed-renderer.tsx"

# ── 2. Custom Cursor Component ──
step "Installing custom magnetic cursor"
cp "$SRC/src/components/custom-cursor.tsx" "src/components/custom-cursor.tsx"

# ── 3. Settings-Aware Cursor Wrapper ──
step "Installing settings-aware cursor wrapper"
cp "$SRC/src/components/settings-aware-cursor.tsx" "src/components/settings-aware-cursor.tsx"

# ── 4. Contributors Input Component ──
step "Installing contributors input + display"
cp "$SRC/src/components/contributors-input.tsx" "src/components/contributors-input.tsx"

# ── 5. App Settings Hook ──
step "Installing useAppSettings hook"
mkdir -p src/hooks
cp "$SRC/src/hooks/use-app-settings.ts" "src/hooks/use-app-settings.ts"

# ── 6. Updated Profile Settings ──
step "Updating settings (cursor toggle + embed toggle + experiments tab)"
mkdir -p src/components/admin
cp "$SRC/src/components/admin/profile-settings.tsx" "src/components/admin/profile-settings.tsx"

# ── 7. Schema additions reference ──
step "Copying schema reference file"
mkdir -p prisma
cp "$SRC/prisma/schema-additions.prisma" "prisma/schema-additions-REFERENCE.txt"

# ── 8. Clear cache ──
step "Clearing .next cache"
rm -rf .next

echo ""
echo "============================================"
echo " All $TOTAL files installed!"
echo "============================================"
echo ""
echo " MANUAL STEPS REQUIRED:"
echo ""
echo " 1. EDIT prisma/schema.prisma — add these fields:"
echo ""
echo "    In model Project (before closing }):"
echo '      contributors  String   @default("[]")'
echo '      showTeam      Boolean  @default(false)'
echo '      embeds        String   @default("")'
echo ""
echo "    In model Blog (before closing }):"
echo '      embeds        String   @default("")'
echo ""
echo "    In model CodeSnippet (before closing }):"
echo '      embeds        String   @default("")'
echo ""
echo "    If you have a Course model, add:"
echo '      embeds        String   @default("")'
echo ""
echo " 2. Run schema migration:"
echo "     bun run db:push"
echo ""
echo " 3. EDIT src/app/layout.tsx — add cursor wrapper:"
echo '     import { SettingsAwareCursor } from "@/components/settings-aware-cursor"'
echo '     // Add inside <body> BEFORE {children}:'
echo '     <SettingsAwareCursor />'
echo ""
echo " 4. In your blog/snippet/course forms, add embed input:"
echo '     import { EmbedUrlInput } from "@/components/embed-renderer"'
echo '     // Add to your form:'
echo '     <EmbedUrlInput value={form.embeds} onChange={(v) => setForm({...form, embeds: v})} />'
echo ""
echo " 5. In public pages, render embeds:"
echo '     import { EmbedList } from "@/components/embed-renderer"'
echo '     <EmbedList urls={post.embeds} />'
echo ""
echo " 6. For project contributors:"
echo '     import { ContributorsInput } from "@/components/contributors-input"'
echo '     import { ContributorsDisplay } from "@/components/contributors-input"'
echo ""
echo " 7. Restart dev server:"
echo "     rm -rf .next && bun run dev"
echo ""