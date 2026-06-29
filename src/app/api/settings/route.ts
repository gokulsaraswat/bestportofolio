import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── Mapping: settings UI keys → Profile model fields ────────────
const PROFILE_FIELD_MAP: Record<string, string> = {
  name: 'name',
  email: 'email',
  location: 'location',
  avatarUrl: 'avatar',
  resumeUrl: 'resumeUrl',
  githubUrl: 'github',
  linkedinUrl: 'linkedin',
  twitterUrl: 'twitter',
  websiteUrl: 'website',
  youtube: 'youtube',
  spotify: 'spotify',
  heroTypingLines: 'typingLines',
  chatBotEnabled: 'chatBotEnabled',
}

// Keys that should be stored in the siteSettings JSON blob (not direct Profile fields)
const SITE_SETTINGS_KEYS = new Set([
  'title', 'description', 'heroGreeting', 'heroCtaText', 'heroCtaUrl',
  'primaryColor', 'accentColor', 'fontFamily', 'layoutStyle',
  'enableAnimations', 'enableParticles', 'roundedCorners',
  'siteUrl', 'ogImage', 'favicon',
  'enableComments', 'enableRag', 'enableContact', 'enableBlog',
  'enableProjects', 'enableCourses', 'enableSnippets', 'contactEmail',
  'showVisitorCount', 'showGithubStats', 'enableCustomCursor',
  'cursorMagneticSnap', 'enableAutoEmbeds', 'footerText', 'copyrightName',
])

function parseSiteSettings(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export async function GET() {
  try {
    const profile = await db.profile.findFirst()
    if (!profile) {
      return NextResponse.json({})
    }

    // Start with siteSettings JSON blob
    const siteSettings = parseSiteSettings(profile.siteSettings)
    const result: Record<string, unknown> = { ...siteSettings }

    // Overlay direct Profile field mappings
    for (const [settingsKey, profileField] of Object.entries(PROFILE_FIELD_MAP)) {
      const val = (profile as Record<string, unknown>)[profileField]
      if (val !== undefined && val !== null && val !== '' && val !== '[]' && val !== '{}') {
        result[settingsKey] = val
      }
    }

    // Also expose raw profile fields that the frontend expects
    result.name = profile.name
    result.email = profile.email
    result.location = profile.location

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const existing = await db.profile.findFirst()

    if (!existing) {
      // Create profile with defaults
      const profileData: Record<string, unknown> = { name: 'Gokul Saraswat' }
      const ss: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(body)) {
        if (PROFILE_FIELD_MAP[key]) {
          profileData[PROFILE_FIELD_MAP[key]] = value
        } else if (SITE_SETTINGS_KEYS.has(key)) {
          ss[key] = value
        }
      }

      profileData.siteSettings = JSON.stringify(ss)
      const profile = await db.profile.create({ data: profileData as never })
      return NextResponse.json(profile, { status: 201 })
    }

    // Separate updates into Profile fields and siteSettings JSON
    const profileData: Record<string, unknown> = {}
    const siteSettings = parseSiteSettings(existing.siteSettings)

    for (const [key, value] of Object.entries(body)) {
      if (PROFILE_FIELD_MAP[key]) {
        profileData[PROFILE_FIELD_MAP[key]] = value
      } else if (SITE_SETTINGS_KEYS.has(key)) {
        siteSettings[key] = value
      }
    }

    // Update Profile fields
    if (Object.keys(profileData).length > 0) {
      await db.profile.update({
        where: { id: existing.id },
        data: profileData,
      })
    }

    // Update siteSettings JSON blob
    await db.profile.update({
      where: { id: existing.id },
      data: { siteSettings: JSON.stringify(siteSettings) },
    })

    // Return merged result
    const updated = await db.profile.findFirst({ where: { id: existing.id } })
    const finalSettings = { ...parseSiteSettings(updated?.siteSettings || '{}') }
    for (const [settingsKey, profileField] of Object.entries(PROFILE_FIELD_MAP)) {
      if (updated && (updated as Record<string, unknown>)[profileField]) {
        finalSettings[settingsKey] = (updated as Record<string, unknown>)[profileField]
      }
    }

    return NextResponse.json(finalSettings)
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}