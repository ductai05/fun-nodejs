# Deploy to Vercel - Setup Guide

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Ftodo-app)

## 📋 Prerequisites

1. **MongoDB Atlas Account**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster (free tier is fine)
   - Get connection string

2. **Vercel Account**
   - Sign up at [Vercel](https://vercel.com)
   - Connect your GitHub account

## 🔧 Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

```bash
# Example connection string format:
mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
```

**Important**: 
- Replace `username` and `password` with your actual credentials
- Make sure to whitelist all IP addresses (0.0.0.0/0) for Vercel

### 2. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 3. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables:

**Environment Variables to set in Vercel:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
NODE_ENV=production
```

### 4. Configure Build Settings

Vercel will automatically detect the configuration from `vercel.json`:

```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  }
}
```

**Key changes from previous version:**
- ✅ Removed conflicting `builds` and `routes` properties  
- ✅ Uses modern Vercel Functions configuration
- ✅ Increased timeout to 30 seconds for database operations

### 5. Deploy!

Click "Deploy" and wait for deployment to complete.

## 🔍 Verification

After deployment:

1. **Check API Health**: `https://your-app.vercel.app/api/health`
2. **Test Todos API**: `https://your-app.vercel.app/api/todos`
3. **Access App**: `https://your-app.vercel.app`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set up database
npm run setup

# Start development server
npm run dev
```

## 📁 Project Structure for Vercel

```
todo-app/
├── api/
│   └── index.js          # Main API file (Vercel function)
├── public/
│   ├── index.html        # Frontend files
│   ├── script.js
│   └── style.css
├── vercel.json           # Vercel configuration
├── package.json
└── .env                  # Local environment (not deployed)
```

## ⚡ Serverless Optimizations

The API is optimized for Vercel's serverless environment:

- **Connection Caching**: Reuses MongoDB connections
- **Timeout Handling**: 10-second function timeout
- **CORS Configuration**: Allows cross-origin requests
- **Error Handling**: Proper error responses for production

## 🔧 Environment Variables

**Local (.env)**:
```env
MONGODB_URI=mongodb+srv://your-connection-string
NODE_ENV=development
```

**Vercel (Dashboard)**:
```env
MONGODB_URI=mongodb+srv://your-connection-string
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot connect to database"**
   - Check MONGODB_URI environment variable
   - Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0

2. **"Function timeout"**
   - MongoDB connection might be slow
   - Check database region vs Vercel region

3. **"Static files not found"**
   - Verify `vercel.json` routing configuration
   - Check `public/` directory structure

### Debug Commands:

```bash
# Check environment variables locally
node -e "console.log(process.env.MONGODB_URI)"

# Test database connection
npm run setup

# Test API locally
curl http://localhost:3000/api/health
```

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard > Your Project > Settings > Domains
2. Add your custom domain
3. Configure DNS settings as instructed

## 📊 Analytics & Monitoring

Vercel provides built-in:
- **Function Logs**: See API execution logs
- **Analytics**: Usage statistics
- **Speed Insights**: Performance metrics

Access via: Vercel Dashboard > Your Project > Functions/Analytics

---

## 🎉 Success!

Your todo app is now deployed and accessible worldwide at:
`https://your-app-name.vercel.app`

Need help? Check [Vercel Documentation](https://vercel.com/docs) or create an issue in this repository.
