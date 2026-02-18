# Database Migrations

This directory contains the complete SQL schema for the ClipForge database.

## Quick Start

### Option 1: Using Node.js Script (Recommended)

```bash
cd server
node migrations/run-migrations.js
```

This will automatically run the complete schema file.

### Option 2: Manual PostgreSQL

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database

# Run the complete schema
\i migrations/complete_schema.sql
```

### Option 3: Using psql command line

```bash
psql -U your_username -d your_database -f server/migrations/complete_schema.sql
```

## Database Schema

### User Management Tables

- **users** - User accounts (email/password and Google OAuth)
  - Supports both traditional email/password and Google OAuth authentication
  - Role-based access control (user/admin)
  - Email verification status tracking

- **sessions** - Refresh tokens for multi-device support
  - Manages JWT refresh tokens
  - Tracks device information for each session
  - Automatic cleanup on user deletion

- **tokens** - Temporary tokens for email verification and password reset
  - Time-limited tokens with expiration
  - Supports both verification and password reset flows

### Video Processing Tables

- **videos** - Uploaded and processed videos
  - Supports both file uploads and YouTube downloads
  - Tracks processing status (pending, processing, completed, failed)
  - Stores video metadata (duration, file size, resolution)
  - Optional subtitle support

- **clips** - AI-generated viral clips from videos
  - AI-detected emotional tone (joy, excitement, surprise, humor)
  - Viral potential score (0.00 to 1.00)
  - Precise timestamp tracking (start_time, end_time, duration)
  - Clip-specific transcripts and metadata

## Features

✅ **Complete Schema** - All tables, indexes, and triggers in one file  
✅ **UUID Primary Keys** - Secure, globally unique identifiers  
✅ **Foreign Key Constraints** - Data integrity with CASCADE delete  
✅ **Performance Indexes** - 15+ indexes for optimal query speed  
✅ **Auto-Update Triggers** - Automatic timestamp management  
✅ **Comprehensive Comments** - Detailed documentation in SQL  
✅ **Seed Data** - Default admin account for testing  

## Default Admin Account

After running the schema, a default admin account is created:

- **Email**: admin@example.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change this password immediately in production!

## Utility Scripts

### Clear Video Data Only

If you want to keep users but clear all videos and clips:

```bash
cd server
node scripts/clearVideoData.js
```

### Reset Complete Database

To drop and recreate everything:

```bash
cd server
node scripts/resetDatabase.js
```

## Schema Updates

The `complete_schema.sql` file includes a DROP TABLE section at the beginning. If you want to preserve existing data:

1. Comment out the DROP TABLE section
2. Or use ALTER TABLE statements for schema changes

## Troubleshooting

### Error: "relation does not exist"
- Check database connection
- Verify `.env` file has correct database credentials

### Error: "permission denied"
- Ensure database user has proper permissions
- Run: `GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;`

### Script hangs
- Verify PostgreSQL server is running
- Check if port 5432 is accessible

## Database Relationships

```
users (1) ──→ (many) sessions
users (1) ──→ (many) tokens
users (1) ──→ (many) videos
users (1) ──→ (many) clips
videos (1) ──→ (many) clips
```

All relationships use CASCADE DELETE for automatic cleanup.

## Notes

- All timestamps are in UTC
- File paths are stored as relative paths from the server downloads folder
- JSONB columns are used for flexible metadata storage
- The schema supports multi-tenancy through user_id foreign keys
