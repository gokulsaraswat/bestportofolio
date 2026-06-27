-- =====================================================
-- RAG Chatbot Schema for Supabase (Free Tier)
-- Optimized for Google Gemini Embeddings
-- =====================================================

-- Enable pgvector extension (available on Supabase Free Tier)
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table: stores text chunks with their embeddings
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('resume', 'blog', 'project', 'course', 'profile', 'general')),
  source_id TEXT DEFAULT '',        -- e.g. blog slug, project slug
  source_title TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(768),            -- UPDATED: Set to 768 to match Gemini standard/truncated sizing
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster vector search
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Create type index
CREATE INDEX IF NOT EXISTS documents_type_idx ON documents (type);

-- Match function: finds the top N most relevant document chunks
-- Uses cosine similarity (Gemini natively supports cosine distance)
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),      -- MATCHED: Perfectly matches table dimension sizing
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  filter_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  type TEXT,
  source_id TEXT,
  source_title TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    d.id,
    d.content,
    d.type,
    d.source_id,
    d.source_title,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE
    (filter_type IS NULL OR d.type = filter_type)
    AND (d.embedding IS NOT NULL)
    AND (1 - (d.embedding <=> query_embedding)) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Chat logs table (optional, for analytics)
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT DEFAULT '',
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
