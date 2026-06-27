'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Trash2, Shield, Eye, Edit3, GraduationCap, Code2, FileText, Save, Settings, Database, Mail, History, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'

const roles = [
  { value: 'admin', label: 'Admin', icon: Shield, desc: 'Full access to everything' },
  { value: 'blog_editor', label: 'Blog Editor', icon: Edit3, desc: 'Can manage blogs and todos' },
  { value: 'project_editor', label: 'Project Editor', icon: Eye, desc: 'Can manage projects and todos' },
  { value: 'course_editor', label: 'Course Editor', icon: GraduationCap, desc: 'Can manage courses and todos' },
  { value: 'viewer', label: 'Viewer', icon: Eye, desc: 'Read-only dashboard access' },
]

const ALL_PERMISSIONS = [
  { key: 'blogs', label: 'Blogs', icon: FileText },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'courses', label: 'Courses', icon: GraduationCap },
  { key: 'snippets', label: 'Code Snippets', icon: Code2 },
  { key: 'todos', label: 'Todos', icon: FileText },
  { key: 'messages', label: 'Messages', icon: Mail },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'backup', label: 'Backup', icon: Database },
  { key: 'logs', label: 'Operation Logs', icon: History },
  { key: 'users', label: 'Manage Users', icon: UserPlus },
]

interface UserPermissions {
  blogs?: boolean; projects?: boolean; courses?: boolean; snippets?: boolean;
  todos?: boolean; messages?: boolean; settings?: boolean; backup?: boolean;
  logs?: boolean; users?: boolean;
}

interface User {
  id: string
  username: string
  role: string
  permissions: string
  totpEnabled: boolean
  createdAt: string
}

function parsePerms(p: string): UserPermissions {
  try { return JSON.parse(p) } catch { return {} }
}

export function UserManager() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'viewer' })
  const [newPerms, setNewPerms] = useState<UserPermissions>({})

  // Edit permissions dialog
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editPerms, setEditPerms] = useState<UserPermissions>({})
  const [editRole, setEditRole] = useState('')
  const [savingPerms, setSavingPerms] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin-users')
      if (res.ok) setUsers(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.username.trim() || !newUser.password.trim()) return
    try {
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, permissions: newPerms }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create user')
      }
      toast({ title: 'User created', description: `${newUser.username} has been added.` })
      setNewUser({ username: '', password: '', role: 'viewer' })
      setNewPerms({})
      fetchUsers()
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete user "${username}"?`)) return
    try {
      const res = await fetch(`/api/admin-users?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      toast({ title: 'User deleted', description: `${username} has been removed.` })
      fetchUsers()
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' })
    }
  }

  const openEditPerms = (user: User) => {
    setEditUser(user)
    setEditPerms(parsePerms(user.permissions))
    setEditRole(user.role)
  }

  const savePerms = async () => {
    if (!editUser) return
    setSavingPerms(true)
    try {
      const res = await fetch('/api/admin-users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editUser.id, role: editRole, permissions: editPerms }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'User updated', description: `${editUser.username} permissions saved.` })
      setEditUser(null)
      fetchUsers()
    } catch {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' })
    } finally { setSavingPerms(false) }
  }

  const toggleNewPerm = (key: string) => {
    setNewPerms(p => ({ ...p, [key]: !p[key as keyof UserPermissions] }))
  }

  const toggleEditPerm = (key: string) => {
    setEditPerms(p => ({ ...p, [key]: !p[key as keyof UserPermissions] }))
  }

  return (
    <div className="space-y-6">
      {/* Create User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><UserPlus className="h-4 w-4" />Add New User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-4 items-end">
            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input placeholder="username" value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input type="password" placeholder="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={newUser.role}
                onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
              >
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <Button type="submit" className="gap-2"><UserPlus className="h-4 w-4" />Add User</Button>
          </form>

          {/* Permission checkboxes for new user */}
          <div>
            <p className="text-sm font-medium mb-2">Permissions</p>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {ALL_PERMISSIONS.map(p => (
                <label key={p.key} className="flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!newPerms[p.key as keyof UserPermissions]}
                    onChange={() => toggleNewPerm(p.key)}
                    className="rounded border-input"
                  />
                  <p.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium">{p.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Admin role gets all permissions automatically. Only set checkboxes for non-admin roles.</p>
          </div>
        </CardContent>
      </Card>

      {/* All Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
          ) : (
            <div className="space-y-2">
              {users.map(user => {
                const roleInfo = roles.find(r => r.value === user.role)
                const perms = parsePerms(user.permissions)
                const permCount = Object.values(perms).filter(Boolean).length
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(user.createdAt).toLocaleDateString()}
                          {permCount > 0 && ` · ${permCount} permission${permCount > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className="gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      >
                        {roleInfo && <roleInfo.icon className="h-3 w-3" />}
                        {roleInfo?.label || user.role}
                      </Badge>
                      {user.totpEnabled && <Badge variant="secondary" className="text-xs">2FA</Badge>}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditPerms(user)} title="Edit permissions">
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(user.id, user.username)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map(r => (
              <div key={r.value} className="flex items-start gap-3 p-3 rounded-lg border">
                <r.icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Permissions Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User: {editUser?.username}</DialogTitle>
            <DialogDescription>Change role and granular permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
              >
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Permissions</p>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                {ALL_PERMISSIONS.map(p => (
                  <label key={p.key} className="flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer hover:bg-accent/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!editPerms[p.key as keyof UserPermissions]}
                      onChange={() => toggleEditPerm(p.key)}
                      className="rounded border-input"
                    />
                    <p.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={savePerms} disabled={savingPerms}>
              {savingPerms ? 'Saving...' : <><Save className="h-4 w-4 mr-1" />Save</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}