# AI Career Ecosystem

A comprehensive AI-powered career management platform that connects students/job seekers with recruiters through intelligent matching, resume analysis, interview simulation, and career roadmapping.

## 🚀 Features

### For Students
- **AI Resume Analyzer** - Upload PDF/DOC resumes for AI-powered parsing and auto-profile filling
- **Career Roadmap Generator** - Personalized 5-year career roadmaps with milestones
- **Interview Simulator** - AI-generated interview questions with real-time scoring
- **Skill Gap Analyzer** - Compare your skills against job requirements
- **GitHub Verifier** - Connect and verify coding skills through repository analysis
- **Job Recommendations** - AI-matched job opportunities based on your profile

### For Recruiters
- **Advanced Talent Search** - Multi-filter search with boolean operators
- **AI Matching Engine** - 92% accuracy candidate-to-job matching
- **Smart Job Posting** - AI-generated job descriptions from keywords
- **Application Management** - Kanban-style pipeline management
- **Daily AI Briefing** - Personalized daily digest of top candidates
- **Analytics Dashboard** - Track recruitment metrics and ROI

### For Admins
- **Master Control Panel** - System-wide management and monitoring
- **User Management** - Complete user lifecycle with role management
- **Verification Hub** - Approve GitHub verifications and skill badges
- **Global Broadcast** - Send targeted notifications with images
- **System Health Monitor** - Real-time monitoring of all services
- **Audit Logs** - Complete forensic logging of all actions

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: NextAuth.js with JWT
- **AI/ML**: OpenRouter (GPT-4, Claude, Gemini)
- **File Storage**: Cloudinary
- **Cache**: Redis
- **Deployment**: Docker, Docker Compose

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- Cloudinary account
- OpenRouter API key

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourorg/ai-career-ecosystem.git
cd ai-career-ecosystem
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

This will start:
- Next.js app on port 3000
- MongoDB on port 27017
- Redis on port 6379

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/career-ecosystem

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenRouter (AI)
OPENROUTER_API_KEY=your-openrouter-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── student/           # Student dashboard
│   │   ├── recruiter/         # Recruiter dashboard
│   │   └── admin/             # Admin panel
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Reusable UI components
│   │   ├── student/           # Student-specific components
│   │   ├── recruiter/         # Recruiter-specific components
│   │   └── admin/             # Admin-specific components
│   ├── lib/
│   │   ├── mongodb/           # Database connection & models
│   │   ├── ai/                # AI service integration
│   │   ├── cloudinary/        # File upload utilities
│   │   ├── github/            # GitHub verification
│   │   └── utils/             # Utility functions
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
├── public/                    # Static assets
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Production build
└── README.md
```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Railway/Render

1. Connect your GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically on push

### AWS/GCP/Azure

Use the provided Dockerfile for containerized deployment on any cloud platform.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [OpenRouter](https://openrouter.ai/) - AI Model Access
- [Cloudinary](https://cloudinary.com/) - Media Management

## 📧 Contact

For questions or support, please contact: support@aicareereco.com

---

Built with ❤️ by the AI Career Ecosystem Team
