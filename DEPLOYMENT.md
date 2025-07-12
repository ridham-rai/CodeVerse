# 🚀 Deployment Guide - Advanced Online Code Editor

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (for production database)
- Vercel account (for frontend deployment)
- Render/Railway account (for backend deployment)

## 🏗️ Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd code-editor

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeeditor
NODE_ENV=development
```

**For Production:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeeditor
NODE_ENV=production
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Production Deployment

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP addresses
5. Get the connection string

### 2. Backend Deployment (Render)

1. **Create Render Account**: Sign up at render.com
2. **Connect Repository**: Link your GitHub repository
3. **Create Web Service**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeeditor
   NODE_ENV=production
   ```
5. **Deploy**: Click deploy and wait for completion

### 3. Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**:
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Configure Environment**:
   - Update API URLs in frontend to point to your deployed backend
   - Set up custom domain if needed

### 4. Alternative: Railway Deployment

**Backend on Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Frontend on Netlify:**
```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop dist folder)
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔧 Configuration Updates for Production

### 1. Update API URLs

**Frontend (src/components/ShareModal.tsx):**
```typescript
// Replace localhost with your deployed backend URL
const response = await fetch('https://your-backend-url.onrender.com/api/code/save', {
  // ... rest of the code
});
```

### 2. CORS Configuration

**Backend (server.js):**
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### 3. Build Optimization

**Frontend (vite.config.ts):**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          monaco: ['@monaco-editor/react']
        }
      }
    }
  }
});
```

## 📊 Performance Optimization

### 1. Frontend Optimizations

- **Code Splitting**: Monaco Editor is loaded separately
- **Lazy Loading**: Components load on demand
- **Bundle Analysis**: Use `npm run build -- --analyze`

### 2. Backend Optimizations

- **Database Indexing**: Indexes on frequently queried fields
- **Compression**: Gzip compression enabled
- **Caching**: Redis for session management (optional)

## 🔒 Security Considerations

### 1. API Security

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Input validation
const { body, validationResult } = require('express-validator');
app.post('/api/code/save', [
  body('htmlCode').isLength({ max: 50000 }),
  body('cssCode').isLength({ max: 50000 }),
  body('jsCode').isLength({ max: 50000 })
], (req, res) => {
  // Handle validation errors
});
```

### 2. Frontend Security

- **Content Security Policy**: Restrict iframe sources
- **XSS Prevention**: Sanitize user input
- **HTTPS Only**: Force HTTPS in production

## 🧪 Testing

### 1. Frontend Testing

```bash
cd frontend
npm run test
```

### 2. Backend Testing

```bash
cd backend
npm test
```

### 3. E2E Testing

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

## 📈 Monitoring

### 1. Error Tracking

- **Sentry**: For error monitoring
- **LogRocket**: For session replay
- **Google Analytics**: For usage analytics

### 2. Performance Monitoring

- **Vercel Analytics**: Frontend performance
- **Render Metrics**: Backend performance
- **MongoDB Atlas Monitoring**: Database performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm ci && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Post-Deployment Checklist

- [ ] All features working in production
- [ ] Database connections stable
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] Error monitoring set up
- [ ] Performance metrics tracking
- [ ] Backup strategy implemented
- [ ] Domain configured (if custom)
- [ ] CDN configured (optional)
- [ ] Load testing completed

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Database Connection**: Verify MongoDB URI and network access
3. **Build Failures**: Check Node.js version compatibility
4. **Monaco Editor Loading**: Ensure proper CDN access
5. **Memory Issues**: Increase server memory limits

### Debug Commands

```bash
# Check logs
vercel logs
railway logs

# Test API endpoints
curl https://your-backend-url.onrender.com/health

# Check build output
npm run build -- --verbose
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test locally with production settings
4. Contact platform support if needed

---

🎉 **Congratulations!** Your advanced online code editor is now deployed and ready for users!
