'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, type Transition } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  GraduationCap,
  Mail,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  ShieldCheck,
  Database,
  CheckSquare,
  Users,
  Bot,
  Code2,
  ScrollText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AdminDashboard } from './admin-dashboard'
import { BlogManager } from './blog-manager'
import { ProjectManager } from './project-manager'
import { CourseManager } from './course-manager'
import { MessageManager } from './message-manager'
import { ProfileSettings } from './profile-settings'
import { BackupManager } from './backup-manager'
import { TodoManager } from './todo-manager'
import { UserManager } from './user-manager'
import { RagSettings } from './rag-settings'
import { SnippetManager } from './snippet-manager'
import OperationLogsViewer from "./operation-logs-viewer";

type Section = 'dashboard' | 'blogs' | 'projects' | 'courses' | 'snippets' | 'messages' | 'comments' | 'todos' | 'backup' | 'rag-bot' | 'users' | 'settings' | 'logs';

interface NavItem {
  id: Section
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'blogs', label: 'Blogs', icon: FileText },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'courses', label: 'Courses', icon: GraduationCap },
  { id: 'snippets', label: 'Snippets', icon: Code2 },
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'todos', label: 'Todos', icon: CheckSquare },
  { id: 'rag-bot', label: 'AI Chat Bot', icon: Bot },
  { id: 'backup', label: 'Backup', icon: Database },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const rolePermissions: Record<string, string[]> = {
  admin: ['dashboard', 'blogs', 'projects', 'courses', 'snippets', 'logs', 'messages', 'todos', 'rag-bot', 'backup', 'settings', 'users'],
  blog_editor: ['dashboard', 'blogs', 'todos'],
  project_editor: ['dashboard', 'projects', 'todos'],
  course_editor: ['dashboard', 'courses', 'todos'],
  viewer: ['dashboard'],
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
 const [mounted, setMounted] = useState(false)

React.useEffect(() => {
  const timeout = setTimeout(() => setMounted(true), 0)
  return () => clearTimeout(timeout)
}, [])

if (!mounted) {
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9">
      <Sun className="h-4 w-4" />
    </Button>
  )
}

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function SidebarContent({
  activeSection,
  onNavigate,
  onLogout,
  items,
}: {
  activeSection: Section
  onNavigate: (section: Section) => void
  onLogout: () => void
  items: NavItem[]
}) {
  return (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">Admin Panel</span>
          <span className="text-xs text-muted-foreground">Gokul Saraswat</span>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = activeSection === item.id
            return (
              <TooltipProvider key={item.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="flex items-center gap-2 p-3">
        <ThemeToggle />
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start gap-2 text-muted-foreground hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}


  const pageTransition: Transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.2,
  }

export function AdminLayout({ onLogout, role = 'admin' }: { onLogout: () => void; role?: string }) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  const allowedSections = rolePermissions[role] || rolePermissions.admin
  const filteredNavItems = navItems.filter(item => allowedSections.includes(item.id))

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section)
    setMobileOpen(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        // return <AdminDashboard onNavigate={handleNavigate} /> Error as AdminDashboard expects a function that takes a string, but handleNavigate expects a Section type. We can cast the section to Section type to fix this.
        return <AdminDashboard onNavigate={(section: string) => handleNavigate(section as Section)} />
      case 'blogs':
        return <BlogManager />
      case 'projects':
        return <ProjectManager />
      case 'courses':
        return <CourseManager />
      case 'snippets':
        return <SnippetManager />
      case 'logs':
        return <OperationLogsViewer />
      case 'messages':
        return <MessageManager />
      case 'todos':
        return <TodoManager />
      case 'rag-bot':
        return <RagSettings />
      case 'backup':
        return <BackupManager />
      case 'users':
        return <UserManager />
      case 'settings':
        return <ProfileSettings />
      default:
        return <AdminDashboard onNavigate={handleNavigate} />
    }
  }

  const sectionTitle = filteredNavItems.find((item) => item.id === activeSection)?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r lg:block">
        <SidebarContent
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onLogout={onLogout}
          items={filteredNavItems}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onLogout={onLogout}
            items={filteredNavItems}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex items-center gap-3"
            >
              <div className="lg:hidden w-8" />
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">{sectionTitle}</h1>
                    {role !== 'admin' && (
                      <Badge variant="secondary" className="text-xs">
                        {role.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage your portfolio content
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Page Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}