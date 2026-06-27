import { db } from './src/lib/db'

async function seed() {
  console.log('Seeding database...')

  await db.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Gokul Saraswat',
      shortname: 'Gokul',
      avatar: '/avatar.jpeg',
      occupation: 'Backend Engineer',
      company: 'Oracle Financial Services Software',
      email: 'gokulsaraswat07@gmail.com',
      phone: '+91-9829086012',
      location: 'Bangalore, India',
      bio: `Backend Engineer with three years of experience architecting high-availability microservices for enterprise banking. Proficient in Java 8/17, Spring Boot, and SQL with expertise in Core Banking Systems (CBS), EOD/payment migrations. Proven track record of minimizing transaction latency, optimizing system performance, and building real-time financial services.

Experienced in building reporting services and handling complex regulatory compliance integrations that helped stakeholders improve smoother operations and real business impact. Owns the end-to-end SDLC from API design to production deployments and RCA, delivering scalable solutions that drive data-driven decision-making.`,
      tagline: 'Backend Engineer architecting high-availability microservices for enterprise banking — specializing in Java, Spring Boot, and distributed systems that drive real business impact.',
      resumeUrl: '/Gokul_Saraswat.pdf',
      twitter: 'https://twitter.com/gokulsaraswat',
      linkedin: 'https://www.linkedin.com/in/gokulsaraswat',
      github: 'https://github.com/gokulsaraswat',
      website: 'https://gokulsaraswat.com',
      codeReviewPhilosophy: 'I believe in constructive, empathetic code reviews. I focus on maintaining consistency with project style guides, keeping PRs small and manageable, and treating reviews as a collaborative learning opportunity rather than a gatekeeping exercise. Every review should leave the codebase better than it was found.',
      agileExperience: 'Experienced in Sprint Planning, backlog grooming, and breaking down monolithic business requirements into technical Jira tickets. I thrive in iterative environments where feedback loops are short and collaboration drives quality outcomes.',
      skills: JSON.stringify([
        { category: 'Languages', items: ['Java 8/17', 'SQL', 'PL/SQL', 'C++', 'Python', 'JavaScript', 'TypeScript'] },
        { category: 'Frameworks', items: ['Spring Boot', 'Oracle JET', 'Knockout.js', 'JUnit', 'Mockito', 'React', 'Next.js'] },
        { category: 'Cloud & DevOps', items: ['Kubernetes', 'Docker', 'AWS', 'GCP', 'OCI', 'Terraform', 'Grafana', 'Prometheus'] },
        { category: 'APIs & Architecture', items: ['RESTful APIs', 'SOAP', 'Microservices', 'JWT', 'OAuth 2.0', 'GraphQL'] },
        { category: 'Tools', items: ['Git', 'Linux', 'Postman', 'Flyway', 'Weblogic', 'Flexcube', 'Oracle BIP'] },
      ]),
      certifications: JSON.stringify(['Oracle Java 8', 'Oracle DB/SQL', 'GDSC Cloud Track']),
    },
  })
  console.log('Profile created')

  const blogs = [
    {
      title: 'Dockerize Your Go Applications',
      slug: 'dockerize-go',
      excerpt: 'Learn how to containerize your Go applications using Docker for consistent development and deployment.',
      content: `# Dockerize Your Go Applications\n\nDocker has revolutionized the way we build, ship, and run applications. In this guide, we explore how to effectively containerize Go applications.\n\n## Why Docker for Go?\n\nGo compiles to a single binary, making it an excellent candidate for containerization.\n\n## Multi-Stage Builds\n\n\`\`\`dockerfile\nFROM golang:1.21-alpine AS builder\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -o server .\n\nFROM alpine:latest\nCOPY --from=builder /app/server /server\nEXPOSE 8080\nCMD ["/server"]\n\`\`\``,
      tags: 'docker,go,devops',
      type: 'article',
      published: true,
    },
    {
      title: 'Getting Started with NATS',
      slug: 'getting-started-nats',
      excerpt: 'An introduction to NATS, the high-performance messaging system for distributed systems.',
      content: `# Getting Started with NATS\n\nNATS is a lightweight, high-performance messaging system for cloud-native applications and microservices.\n\n## Core Concepts\n\n### Subjects\nSubjects use hierarchical naming: \`orders.new\`, \`orders.*\`, \`orders.>\`\n\n### Publish/Subscribe\n\n\`\`\`go\nnc.Publish("orders.new", []byte(orderJSON))\nnc.Subscribe("orders.new", func(msg *nats.Msg) {\n    fmt.Printf("Received: %s\\n", string(msg.Data))\n})\n\`\`\``,
      tags: 'nats,messaging,distributed',
      type: 'article',
      published: true,
    },
    {
      title: 'Introduction to IaC with Terraform',
      slug: 'introduction-iac-terraform',
      excerpt: 'Learn Infrastructure as Code fundamentals with Terraform for managing cloud resources declaratively.',
      content: `# Infrastructure as Code with Terraform\n\nIaC is the practice of managing infrastructure through machine-readable configuration files.\n\n## Example: AWS EC2\n\n\`\`\`hcl\nprovider "aws" { region = "us-east-1" }\n\nresource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"\n  tags = { Name = "WebServer" }\n}\n\`\`\``,
      tags: 'terraform,iac,aws,devops',
      type: 'article',
      published: true,
    },
    {
      title: 'Vite is Too Fast',
      slug: 'vite-is-too-fast',
      excerpt: 'Why Vite has become the go-to build tool for modern web development with lightning-fast HMR.',
      content: `# Vite is Too Fast\n\nVite leverages native ES modules for development and esbuild for production builds.\n\n## Build Times\n\n| Tool | Cold Start | HMR |\n|------|-----------|-----|\n| Webpack | 30-60s | 1-3s |\n| Vite | <1s | <50ms |`,
      tags: 'vite,frontend,javascript',
      type: 'article',
      published: true,
    },
    {
      title: 'System Design Fundamentals',
      slug: 'system-design-fundamentals',
      excerpt: 'Comprehensive course covering system design from networking basics to designing scalable distributed systems.',
      content: `# System Design - The Complete Course\n\nLearn networking fundamentals, load balancing, caching, databases, microservices, and real-world system designs.`,
      tags: 'system-design,architecture,scalability',
      type: 'article',
      published: true,
    },
  ]

  for (const blog of blogs) {
    await db.blogPost.upsert({ where: { slug: blog.slug }, update: {}, create: blog })
  }
  console.log(`${blogs.length} blogs created`)

  await db.project.upsert({
    where: { slug: 'oracle-clinical-trials' },
    update: {},
    create: {
      title: 'Banking Microservices Platform',
      slug: 'oracle-clinical-trials',
      description: 'Designed and implemented a Report Microservice to aggregate complex transactional and audit data from Oracle BIP using optimized SQL. Engineered end-to-end backend integrations and WebLogic server optimizations. Formulated 30+ RESTful APIs using standardized microservices configuration. Delivered Tier-3 production support maintaining 98% system uptime.',
      shortDesc: 'Enterprise banking microservices with 30% API latency reduction and 98% uptime',
      website: 'https://www.oracle.com',
      stack: JSON.stringify(['Java', 'Spring Boot', 'SQL', 'REST APIs', 'WebLogic', 'Docker', 'Kubernetes', 'Grafana']),
      featured: true,
      role: 'Associate Consultant - Backend Engineer',
      results: 'Reduced API transaction latency by 30% across multiple global banking rollouts. Resolved 100+ critical production bottlenecks maintaining 98% system uptime. Managed EOD batch processing with 99.9% data integrity.',
      performanceMetrics: 'API latency reduced from ~200ms to ~140ms (30% reduction). 98% system uptime maintained over 3 years. 99.9% data integrity across 1 year of historical transaction migration.',
      securityImplementation: 'OAuth 2.0 for service authentication, role-based access control, encrypted data transmission, HIPAA and GDPR compliance measures.',
    },
  })
  console.log('Project created')

  for (const [title, slug] of [['Learn Go', 'go'], ['System Design', 'system-design']]) {
    await db.course.upsert({ where: { slug }, update: {}, create: { title, slug, description: `Master ${title} from fundamentals to advanced topics.` } })
  }
  console.log('2 courses created')

  // Seed some TODO items as examples of what the user needs to fill in
  const todos = [
    { title: 'Add project screenshots', description: 'Upload high-res WebP screenshots for Banking Microservices Platform', status: 'draft', priority: 'high', entityType: 'project' },
    { title: 'Add architecture diagram', description: 'Create and upload a Draw.io/Lucidchart architecture diagram showing microservices communication', status: 'draft', priority: 'high', entityType: 'project' },
    { title: 'Add ER diagram', description: 'Create Entity Relationship diagram for the database schema', status: 'draft', priority: 'medium', entityType: 'project' },
    { title: 'Write ADR: Why Spring Boot', description: 'Architectural Decision Record explaining the choice of Spring Boot', status: 'draft', priority: 'medium', entityType: 'project' },
    { title: 'Add CI/CD pipeline screenshot', description: 'Screenshot of Jenkins/GitHub Actions configuration showing automated testing stages', status: 'draft', priority: 'medium', entityType: 'project' },
    { title: 'Add Terraform/Docker Compose snippets', description: 'Display Infrastructure as Code snippets proving environment understanding', status: 'draft', priority: 'medium', entityType: 'project' },
    { title: 'Add Grafana dashboard screenshot', description: 'Screenshot showing application health monitoring', status: 'draft', priority: 'low', entityType: 'project' },
    { title: 'Add test coverage report', description: 'Screenshot of Jacoco/SonarQube showing >80% code coverage', status: 'draft', priority: 'medium', entityType: 'project' },
    { title: 'Embed Swagger UI', description: 'Host a live Swagger/OpenAPI client for API documentation', status: 'draft', priority: 'low', entityType: 'project' },
    { title: 'Record terminal session', description: 'Use Asciinema to record application startup or complex CLI task', status: 'draft', priority: 'low', entityType: 'project' },
    { title: 'Add behind-the-scenes content', description: 'Wireframes, sketches, or failed iterations showing problem-solving process', status: 'draft', priority: 'low', entityType: 'project' },
    { title: 'Migrate remaining blog posts', description: 'Import all 40+ MDX blog posts from the old portfolio into the new CMS', status: 'draft', priority: 'high', entityType: 'blog' },
    { title: 'Upload resume PDF', description: 'Place the latest resume PDF in the public folder', status: 'completed', priority: 'high', entityType: 'blog' },
    { title: 'Add YouTube video blog post', description: 'Create a blog post with type "youtube" and paste a YouTube URL', status: 'draft', priority: 'low', entityType: 'blog' },
    { title: 'Add Spotify playlist blog post', description: 'Create a blog post with type "spotify" and paste a Spotify playlist URL', status: 'draft', priority: 'low', entityType: 'blog' },
    { title: 'Set up SSL certificate', description: 'Ensure HTTPS is active on the deployed domain', status: 'draft', priority: 'high', entityType: 'blog' },
    { title: 'Add course chapters', description: 'Import Go and System Design course chapters into the CMS', status: 'draft', priority: 'medium', entityType: 'course' },
  ]

  for (const todo of todos) {
    await db.todo.create({ data: todo })
  }
  console.log(`${todos.length} todo items created`)

  console.log('Seeding complete!')
}

seed().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())