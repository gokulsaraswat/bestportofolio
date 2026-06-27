'use client'

import { motion } from 'framer-motion'

const skillCategories = [
  {
    name: 'Languages',
    skills: ['Java 8/17', 'SQL', 'PL/SQL', 'C++', 'Python', 'JavaScript', 'TypeScript'],
  },
  {
    name: 'Frameworks',
    skills: ['Spring Boot', 'Oracle JET', 'Knockout.js', 'JUnit', 'Mockito', 'React', 'Next.js'],
  },
  {
    name: 'Cloud & DevOps',
    skills: ['Kubernetes', 'Docker', 'AWS', 'GCP', 'OCI', 'Terraform', 'Grafana', 'Prometheus'],
  },
  {
    name: 'APIs & Architecture',
    skills: ['RESTful APIs', 'SOAP', 'Microservices', 'JWT', 'OAuth 2.0', 'GraphQL'],
  },
  {
    name: 'Tools & Platforms',
    skills: ['Git', 'Linux', 'Postman', 'Flyway', 'Weblogic', 'Flexcube', 'Oracle BIP'],
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function SkillsMatrix({
  activeSkills,
  onSkillToggle,
  maxSkills = 5,
}: {
  activeSkills: string[]
  onSkillToggle: (skill: string) => void
  maxSkills?: number
}) {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {skillCategories.map((cat) => (
        <motion.div key={cat.name} variants={item}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{cat.name}</h3>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill) => {
              const isActive = activeSkills.includes(skill)
              const isMaxed = activeSkills.length >= maxSkills && !isActive
              return (
                <button
                  key={skill}
                  onClick={() => !isMaxed && onSkillToggle(skill)}
                  disabled={isMaxed}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : isMaxed
                        ? 'border-border bg-card opacity-40 cursor-not-allowed'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-accent cursor-pointer'
                  }`}
                  title={isMaxed ? `Maximum ${maxSkills} skills selected` : `Filter by ${skill}`}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}