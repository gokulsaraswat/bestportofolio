'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar, Footer } from '@/components/site/navbar'
import { FileDown, ExternalLink } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const } }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const certifications = [
  { name: 'Oracle Java 8', url: 'https://education.oracle.com/' },
  { name: 'Oracle DB/SQL', url: 'https://education.oracle.com/' },
  { name: 'GDSC Cloud Track', url: 'https://developers.google.com/community/gdsc' },
]

const achievements = [
  { title: '3 Stars', subtitle: 'CodeChef Rating: 1414', description: '500+ problems across LeetCode, CodeChef, and GeeksforGeeks', url: 'https://www.codechef.com/' },
  { title: '30%', subtitle: 'API Latency Reduction', description: 'Through WebLogic optimizations across global banking rollouts', url: '' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="text-3xl font-bold sm:text-4xl">About Me</h1>
            <p className="mt-2 text-lg text-muted-foreground">Backend Engineer &middot; Oracle Financial Services Software</p>
          </motion.div>

          {/* Summary */}
          <motion.section className="mb-12 space-y-4" initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="text-lg leading-relaxed text-foreground/90" variants={item}>
              Backend Engineer with three years of experience architecting high-availability microservices for enterprise banking.
              Proficient in Java 8/17, Spring Boot, and SQL with expertise in Core Banking Systems (CBS), EOD/payment migrations.
            </motion.p>
            <motion.p className="text-lg leading-relaxed text-muted-foreground" variants={item}>
              Experienced in building reporting services and handling complex regulatory compliance integrations that helped
              stakeholders improve smoother operations and real business impact. Owns the end-to-end SDLC from API design
              to production deployments and RCA, delivering scalable solutions that drive data-driven decision-making.
            </motion.p>
          </motion.section>

          {/* Experience */}
          <motion.section className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}>
            <h2 className="text-xl font-bold mb-6">Experience</h2>
            <div className="space-y-8">
              <motion.div className="relative pl-8 border-l-2 border-primary/20" variants={item}>
                <motion.div
                  className="absolute left-0 top-0 h-4 w-4 -translate-x-[9px] rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring' }}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h3 className="font-semibold">Associate Consultant</h3>
                  <span className="text-sm text-muted-foreground">3 Years</span>
                </div>
                <p className="text-sm font-medium text-primary mb-3">Oracle Financial Services Software &middot; Bangalore, India</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Designed and implemented a Report Microservice to aggregate complex transactional and audit data from Oracle BIP using optimized SQL, delivering Base64-encoded PDF/Excel output via Spring Boot REST APIs.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Integrated reporting services as virtual layers in Oracle Banking Microservices Architecture (OBX) using OJET, designing dynamic menu hierarchies for custom enterprise banking modules.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Engineered end-to-end backend integrations and WebLogic server optimizations, <span className="font-semibold text-foreground">decreasing API transaction latency by 30%</span> across multiple global banking rollouts.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Formulated 30+ RESTful APIs utilizing standardized microservices configuration, mitigating system integration friction and ensuring atomic transactional behavior.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Delivered Tier-3 production support for high-availability banking apps, resolving 100+ critical production bottlenecks (RCA) to maintain <span className="font-semibold text-foreground">98% system uptime</span>.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Managed EOD batch processing and data migration for 1 year of historical core banking transactions, guaranteeing <span className="font-semibold text-foreground">99.9% data integrity</span> and zero cutover loss.</span></li>
                </ul>
              </motion.div>

              <motion.div className="relative pl-8 border-l-2 border-primary/20" variants={item}>
                <motion.div
                  className="absolute left-0 top-0 h-4 w-4 -translate-x-[9px] rounded-full bg-primary/60"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring' }}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h3 className="font-semibold">SDE Intern</h3>
                  <span className="text-sm text-muted-foreground">Feb 2023 &ndash; Jul 2023</span>
                </div>
                <p className="text-sm font-medium text-primary mb-3">Devsnest &middot; Bangalore, India</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Developed a React-JS frontend featuring Firebase Authentication and Redis caching, reducing application latency by 30%.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-1 shrink-0">&#x2022;</span><span>Contributed to an Agile team of 5, ensuring timely sprint deliveries and high-quality feature implementation.</span></li>
                </ul>
              </motion.div>
            </div>
          </motion.section>

          {/* Education */}
          <motion.section className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}>
            <h2 className="text-xl font-bold mb-6">Education</h2>
            <motion.div className="rounded-xl border p-6 hover:shadow-sm transition-shadow" variants={item}>
              <h3 className="font-semibold">BE in Information Science and Engineering</h3>
              <p className="text-sm text-muted-foreground">BMS Institute Of Technology and Management &middot; August 2019 &ndash; June 2023</p>
              <p className="text-sm text-muted-foreground">Bangalore, India</p>
            </motion.div>
          </motion.section>

          {/* Certifications — clickable links */}
          <motion.section className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}>
            <h2 className="text-xl font-bold mb-6">Certifications</h2>
            <motion.div className="flex flex-wrap gap-3" variants={stagger}>
              {certifications.map((cert) => (
                <motion.a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 transition-colors group"
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                >
                  {cert.name}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </motion.div>
          </motion.section>

          {/* Achievements — clickable links */}
          <motion.section className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}>
            <h2 className="text-xl font-bold mb-6">Achievements</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map((ach, i) => (
                <motion.div key={i} variants={item} whileHover={{ y: -2 }}>
                  {ach.url ? (
                    <a href={ach.url} target="_blank" rel="noreferrer" className="block">
                      <div className="rounded-xl border p-6 hover:shadow-sm hover:border-primary/30 transition-all group">
                        <p className="text-3xl font-bold text-primary">{ach.title}</p>
                        <p className="text-sm font-medium mt-1">{ach.subtitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">{ach.description}</p>
                        <ExternalLink className="h-3.5 w-3.5 mt-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </a>
                  ) : (
                    <div className="rounded-xl border p-6 hover:shadow-sm transition-shadow">
                      <p className="text-3xl font-bold text-primary">{ach.title}</p>
                      <p className="text-sm font-medium mt-1">{ach.subtitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ach.description}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Connect / Resume Download */}
          <motion.section className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}>
            <h2 className="text-xl font-bold mb-6">Connect</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://twitter.com/gokulsaraswat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                Twitter / X
              </a>
              <a
                href="https://www.linkedin.com/in/gokulsaraswat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/gokulsaraswat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                GitHub
              </a>
              {/* Resume Download */}
              <Link
                href="/Gokul_Saraswat.pdf"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <FileDown className="h-4 w-4" />
                Resume
              </Link>
            </div>
          </motion.section>

          {/* Engineering Philosophy */}
          <motion.section className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={0}>
            <h2 className="text-xl font-bold mb-6">Engineering Philosophy</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <motion.div className="rounded-xl border p-6 hover:shadow-sm transition-shadow" variants={item} whileHover={{ y: -2 }}>
                <h3 className="font-semibold mb-2">Code Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  I believe in constructive, empathetic code reviews. I focus on maintaining consistency with project style guides,
                  keeping PRs small and manageable, and treating reviews as a collaborative learning opportunity rather than a gatekeeping exercise.
                  Every review should leave the codebase better than it was found.
                </p>
              </motion.div>
              <motion.div className="rounded-xl border p-6 hover:shadow-sm transition-shadow" variants={item} whileHover={{ y: -2 }}>
                <h3 className="font-semibold mb-2">Agile &amp; Scrum</h3>
                <p className="text-sm text-muted-foreground">
                  Experienced in Sprint Planning, backlog grooming, and breaking down monolithic business requirements into technical tasks.
                  I thrive in iterative environments where feedback loops are short and collaboration drives quality outcomes.
                </p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  )
}