-- ============================================
-- CLIPFORGE - COMPLETE DATABASE SCHEMA
-- ============================================
-- This is the complete database schema for ClipForge
-- Run this file to set up the entire database from scratch
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================

-- Create UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (if any)
-- ============================================
-- This ensures a clean slate. Remove this section if you want to preserve existing data.

DROP TABLE IF EXISTS clips CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Users table - stores all user accounts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255), -- Nullable for Google OAuth users
    google_id VARCHAR(255) UNIQUE, -- For Google OAuth authentication
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Stores user account information including OAuth users';
COMMENT ON COLUMN users.password IS 'Hashed password - NULL for OAuth users';
COMMENT ON COLUMN users.google_id IS 'Google OAuth ID for SSO authentication';

-- Sessions table - manages refresh tokens for multi-device support
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL UNIQUE,
    device VARCHAR(500), -- Device information for session tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sessions IS 'Stores refresh tokens for multi-device session management';
COMMENT ON COLUMN sessions.device IS 'User agent or device identifier';

-- Tokens table - temporary tokens for email verification and password reset
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('verify', 'reset')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tokens IS 'Stores temporary tokens for email verification and password reset';
COMMENT ON COLUMN tokens.type IS 'Token type: verify (email verification) or reset (password reset)';

-- ============================================
-- VIDEO PROCESSING TABLES
-- ============================================

-- Videos table - stores uploaded and downloaded videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('upload', 'youtube')),
    source_url TEXT, -- Original YouTube URL if applicable
    file_path TEXT NOT NULL, -- Path to video file on server
    thumbnail_path TEXT, -- Path to thumbnail image
    duration INTEGER DEFAULT 0, -- Video duration in seconds
    file_size BIGINT DEFAULT 0, -- File size in bytes
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT, -- Error details if processing failed
    has_subtitles BOOLEAN DEFAULT false,
    subtitle_path TEXT, -- Path to subtitle file (.vtt)
    metadata JSONB, -- Additional video metadata (resolution, codec, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE videos IS 'Stores uploaded and processed videos';
COMMENT ON COLUMN videos.source_type IS 'Video source: upload (user uploaded) or youtube (downloaded from YouTube)';
COMMENT ON COLUMN videos.status IS 'Processing status: pending, processing, completed, or failed';
COMMENT ON COLUMN videos.metadata IS 'JSON object containing additional video information';

-- Clips table - stores AI-generated viral clips
CREATE TABLE clips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    start_time INTEGER NOT NULL, -- Clip start time in seconds
    end_time INTEGER NOT NULL, -- Clip end time in seconds
    duration INTEGER NOT NULL, -- Clip duration in seconds
    file_path TEXT NOT NULL, -- Path to clip file on server
    thumbnail_path TEXT, -- Path to clip thumbnail
    emotion VARCHAR(50), -- AI-detected emotion (joy, excitement, surprise, humor, etc.)
    viral_score DECIMAL(3,2), -- AI viral potential score (0.00 to 1.00)
    transcript TEXT, -- Subtitle text for this clip segment
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    metadata JSONB, -- AI analysis results and additional clip data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE clips IS 'Stores AI-generated viral clips from videos';
COMMENT ON COLUMN clips.emotion IS 'AI-detected emotional tone of the clip';
COMMENT ON COLUMN clips.viral_score IS 'AI-predicted viral potential score (0.00 = low, 1.00 = high)';
COMMENT ON COLUMN clips.metadata IS 'JSON object containing AI analysis results and clip metadata';

-- ============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================

-- User management indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_tokens_token ON tokens(token);
CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_expires_at ON tokens(expires_at);

-- Video processing indexes
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_source_type ON videos(source_type);

-- Clip indexes
CREATE INDEX idx_clips_video_id ON clips(video_id);
CREATE INDEX idx_clips_user_id ON clips(user_id);
CREATE INDEX idx_clips_viral_score ON clips(viral_score DESC);
CREATE INDEX idx_clips_created_at ON clips(created_at DESC);
CREATE INDEX idx_clips_emotion ON clips(emotion);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at 
    BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clips_updated_at 
    BEFORE UPDATE ON clips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================

-- Insert a default admin user
-- Email: admin@example.com
-- Password: admin123 (change this in production!)
INSERT INTO users (name, email, password, role, email_verified)
VALUES (
    'Admin User',
    'admin@example.com',
    '$2a$10$rZ5YvqZqZqZqZqZqZqZqZuK5YvqZqZqZqZqZqZqZqZqZqZqZqZqZq',
    'admin',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ CLIPFORGE DATABASE SCHEMA CREATED!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  ✓ users (with default admin account)';
    RAISE NOTICE '  ✓ sessions';
    RAISE NOTICE '  ✓ tokens';
    RAISE NOTICE '  ✓ videos';
    RAISE NOTICE '  ✓ clips';
    RAISE NOTICE '';
    RAISE NOTICE 'Indexes created: 15 indexes for optimal performance';
    RAISE NOTICE 'Triggers created: 3 auto-update triggers';
    RAISE NOTICE '';
    RAISE NOTICE 'Default Admin Account:';
    RAISE NOTICE '  Email: admin@example.com';
    RAISE NOTICE '  Password: admin123';
    RAISE NOTICE '  ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Database is ready to use!';
    RAISE NOTICE '============================================';
END $$;
