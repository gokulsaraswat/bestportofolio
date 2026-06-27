'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AdminLayout } from '@/components/admin/admin-layout'

function LoginForm({ onLogin }: { onLogin: (username: string, role?: string) => void }) {
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) throw new Error(data.error || 'Invalid credentials')

      localStorage.setItem('adminAuth', JSON.stringify({
        username: data.username,
        role: data.role || 'admin',
        loggedIn: true,
      }))
      toast({ title: 'Welcome back!', description: `Logged in as ${data.username}` })
      onLogin(data.username, data.role)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials'
      setError(msg)
      toast({ title: 'Login failed', description: msg, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary"
            >
              <Lock className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-xl">Admin Access</CardTitle>
            <CardDescription>Sign in to manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <motion.p
          className="mt-4 text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Portfolio Admin &middot; Gokul Saraswat
        </motion.p>
      </motion.div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [role, setRole] = useState('admin')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminAuth')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.loggedIn) {
          setIsAuthenticated(true)
          setRole(parsed.role || 'admin')
        }
      }
    } catch { /* not logged in */ } finally { setChecking(false) }
  }, [])

  const handleLogin = (_username: string, r?: string) => {
    setIsAuthenticated(true)
    setRole(r || 'admin')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    setRole('admin')
    router.push('/')
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />
  return <AdminLayout onLogout={handleLogout} role={role} />
}