-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "totpSecret" TEXT NOT NULL DEFAULT '',
    "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Gokul Saraswat',
    "shortname" TEXT NOT NULL DEFAULT 'Gokul',
    "avatar" TEXT NOT NULL DEFAULT '/avatar.jpeg',
    "occupation" TEXT NOT NULL DEFAULT 'Backend Engineer',
    "company" TEXT NOT NULL DEFAULT 'Oracle Financial Services Software',
    "email" TEXT NOT NULL DEFAULT 'gokulsaraswat07@gmail.com',
    "phone" TEXT NOT NULL DEFAULT '+91-9829086012',
    "location" TEXT NOT NULL DEFAULT 'Bangalore, India',
    "bio" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "resumeUrl" TEXT NOT NULL DEFAULT '/Gokul_Saraswat.pdf',
    "twitter" TEXT NOT NULL DEFAULT 'https://twitter.com/gokulsaraswat',
    "linkedin" TEXT NOT NULL DEFAULT 'https://www.linkedin.com/in/gokulsaraswat',
    "github" TEXT NOT NULL DEFAULT 'https://github.com/gokulsaraswat',
    "youtube" TEXT NOT NULL DEFAULT '',
    "spotify" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT 'https://gokulsaraswat.com',
    "codechef" TEXT NOT NULL DEFAULT '',
    "leetcode" TEXT NOT NULL DEFAULT '',
    "codeReviewPhilosophy" TEXT NOT NULL DEFAULT '',
    "agileExperience" TEXT NOT NULL DEFAULT '',
    "skills" TEXT NOT NULL DEFAULT '[]',
    "certifications" TEXT NOT NULL DEFAULT '[]',
    "carouselImages" TEXT NOT NULL DEFAULT '[]',
    "typingLines" TEXT NOT NULL DEFAULT '[]',
    "chatBotEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'article',
    "embedUrl" TEXT NOT NULL DEFAULT '',
    "behindTheScenes" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embeds" TEXT NOT NULL DEFAULT '',
    "acceptedBy" TEXT DEFAULT '',
    "writtenBy" TEXT DEFAULT '',

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL DEFAULT '',
    "banner" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "downloadLink" TEXT NOT NULL DEFAULT '',
    "repository" TEXT NOT NULL DEFAULT '',
    "stack" TEXT NOT NULL DEFAULT '[]',
    "screenshots" TEXT NOT NULL DEFAULT '[]',
    "role" TEXT NOT NULL DEFAULT '',
    "process" TEXT NOT NULL DEFAULT '',
    "results" TEXT NOT NULL DEFAULT '',
    "architectureDiagramUrl" TEXT NOT NULL DEFAULT '',
    "dbSchemaUrl" TEXT NOT NULL DEFAULT '',
    "adrContent" TEXT NOT NULL DEFAULT '',
    "cicdSnippet" TEXT NOT NULL DEFAULT '',
    "iacSnippet" TEXT NOT NULL DEFAULT '',
    "observabilityUrl" TEXT NOT NULL DEFAULT '',
    "testCoverageUrl" TEXT NOT NULL DEFAULT '',
    "performanceMetrics" TEXT NOT NULL DEFAULT '',
    "securityImplementation" TEXT NOT NULL DEFAULT '',
    "swaggerUrl" TEXT NOT NULL DEFAULT '',
    "terminalSessionUrl" TEXT NOT NULL DEFAULT '',
    "behindTheScenes" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "complexity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contributors" TEXT NOT NULL DEFAULT '[]',
    "showTeam" BOOLEAN NOT NULL DEFAULT false,
    "embeds" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "banner" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embeds" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseChapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "sectionName" TEXT NOT NULL DEFAULT '',
    "courseId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chapterType" TEXT NOT NULL DEFAULT 'content',

    CONSTRAINT "CourseChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "entityType" TEXT NOT NULL DEFAULT '',
    "entityId" TEXT NOT NULL DEFAULT '',
    "assignee" TEXT NOT NULL DEFAULT '',
    "remarks" TEXT NOT NULL DEFAULT '',
    "completedAt" TIMESTAMP(3),
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoHistory" (
    "id" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT NOT NULL DEFAULT '',
    "oldValue" TEXT NOT NULL DEFAULT '',
    "newValue" TEXT NOT NULL DEFAULT '',
    "actor" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TodoHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSnippet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'code',
    "language" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "tabs" TEXT NOT NULL DEFAULT '[]',
    "comment" TEXT NOT NULL DEFAULT '',
    "demoType" TEXT NOT NULL DEFAULT '',
    "demoUrl" TEXT NOT NULL DEFAULT '',
    "demoOutput" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "includeInRag" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embeds" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CodeSnippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL DEFAULT '',
    "entityId" TEXT NOT NULL DEFAULT '',
    "details" TEXT NOT NULL DEFAULT '',
    "actor" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CodeSnippet_slug_key" ON "CodeSnippet"("slug");

-- AddForeignKey
ALTER TABLE "CourseChapter" ADD CONSTRAINT "CourseChapter_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CourseChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseChapter" ADD CONSTRAINT "CourseChapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoHistory" ADD CONSTRAINT "TodoHistory_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
