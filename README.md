# 🎬 ClipForge AI

**AI-Powered Video Clipping Platform** - Transform long videos into viral-ready clips automatically using AI.

## 🌟 Features

- 🤖 **AI-Powered Analysis** - Gemini AI identifies viral moments automatically
- 📝 **Auto Subtitles** - Whisper AI generates accurate subtitles
- ✂️ **Smart Clipping** - FFmpeg creates clips with burned-in subtitles
- 📊 **Viral Scoring** - Each clip gets a viral potential score (0-100%)
- 🎯 **Emotion Detection** - Identifies joy, excitement, surprise, and more
- 📥 **YouTube Download** - Download and process YouTube videos
- 🔐 **Secure Authentication** - JWT + Google OAuth
- 💾 **Database Storage** - PostgreSQL for video and clip management

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- PostgreSQL
- FFmpeg ([Download](https://ffmpeg.org/download.html))

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd clipforge

# 2. Install Node.js dependencies
cd server && npm install
cd ../client && npm install

# 3. Install Python dependencies
cd ../server
pip install -r requirements.txt

# 4. Setup environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit server/.env with your credentials

# 5. Setup database
cd server
node migrations/run-migrations.js

# 6. Start servers (3 terminals)
# Terminal 1: Flask (video processing)
cd server && python app.py

# Terminal 2: Node.js (API)
cd server && node Server.js

# Terminal 3: React (frontend)
cd client && npm run dev

# 7. Open browser
# http://localhost:5173
```

## 📖 Usage

1. **Upload Video**: Go to `/demo` and upload a video or paste YouTube URL
2. **AI Processing**: Click "Generate Viral Clips with AI"
3. **View Results**: Check `/dashboard/videos` and `/dashboard/clips`
4. **Download**: Download clips directly from the dashboard

### Processing Time
- 5-minute video: ~2-5 minutes
- First run: +2-3 minutes (Whisper model download)

## 🏗️ Architecture

```
React Frontend (Port 5173)
    ↓
Node.js API (Port 5000) ← → Python Flask (Port 5001)
    ↓                           ↓
PostgreSQL Database      Video Processing (Whisper + Gemini + FFmpeg)
```

## 🛠️ Tech Stack

**Frontend**: React, Vite, Tailwind CSS, React Router  
**Backend**: Node.js, Express, Python Flask, PostgreSQL  
**AI**: OpenAI Whisper, Google Gemini, FFmpeg, yt-dlp

## 🔧 Configuration

### Environment Variables

**server/.env**:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/clipforge
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**client/.env**:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Adjust Processing

**Whisper Model** (speed vs accuracy):
```python
# In server/video_processor.py
model = self.load_whisper_model("base")  
# Options: tiny, base, small, medium, large
```

**Video Quality**:
```python
# In server/video_processor.py
'-crf', '23',  # 0-51 (lower = better quality)
'-preset', 'fast',  # ultrafast, fast, medium, slow
```

## 📁 Project Structure

```
clipforge/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Utilities
│   └── public/          # Static assets
├── server/              # Backend
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── migrations/      # Database migrations
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities
│   ├── app.py           # Flask server
│   ├── Server.js        # Node.js server
│   └── video_processor.py  # Video processing
└── README.md
```

## 🐛 Troubleshooting

**FFmpeg not found**: Install FFmpeg and add to PATH  
**Whisper downloading**: Normal on first run (2-3 minutes)  
**Gemini API error**: Check API key in `.env`  
**Processing slow**: Use smaller Whisper model or shorter videos  
**Database error**: Verify PostgreSQL is running and credentials are correct

## 📝 API Endpoints

### Node.js (Port 5000)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/videos/my-videos` - Get user's videos
- `GET /api/clips/my-clips` - Get user's clips

### Flask (Port 5001)
- `POST /download` - Download YouTube video
- `POST /upload` - Upload video file
- `POST /process` - Process video with AI
- `GET /video/{filename}` - Serve video/subtitle files

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📄 License

MIT License

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- Google Gemini for AI analysis
- FFmpeg for video processing
- yt-dlp for YouTube downloads

---

**Made with ❤️ for content creators**
