'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar, Footer } from '@/components/site/navbar'
import { CourseCard, LoadingCards } from '@/components/site/cards'

interface Course { id: string; title: string; slug: string; description: string; banner: string; _count?: { chapters: number } }

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(data => { setCourses(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">Courses</h1>
            <p className="mt-2 text-muted-foreground">Structured learning paths I&apos;ve created</p>
          </motion.div>

          {loading ? <LoadingCards count={2} /> : courses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-16 text-center">
              <p className="text-muted-foreground">No courses yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}