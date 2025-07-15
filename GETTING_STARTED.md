# 🦉 Owl App - Getting Started

## ✅ Your App is Now Running!

Your application is now fully functional and ready for development and testing.

### 🚀 How to Run Your App

1. **Start the Development Server:**
   ```bash
   npm start
   ```
   This starts the Express server on port 3000

2. **For Frontend Development:**
   ```bash
   npm run dev
   ```
   This starts the Vite development server on port 5173 with hot reload

3. **Build for Production:**
   ```bash
   npm run build
   ```
   This creates a production-ready build in the `dist` directory

### 🧪 What You Can Test Right Now

#### 1. **API Testing**
- **Health Check Endpoint:** `http://localhost:3000/api/health`
- **Test with curl:** `curl http://localhost:3000/api/health`
- **Expected Response:** `{"status":"OK","message":"Server is running!"`

#### 2. **File Upload Testing**
- **Upload Endpoint:** `http://localhost:3000/api/upload`
- **Test with curl:** `curl -X POST -F "files=@yourfile.txt" http://localhost:3000/api/upload`
- **View Files:** `http://localhost:3000/api/files`
- **Access File:** `http://localhost:3000/api/files/filename.ext`

#### 3. **Frontend Testing**
- **Main App:** `http://localhost:3000/`
- **Development Server:** `http://localhost:5173/` (when using `npm run dev`)
- **Features to Test:**
  - Server connection status display
  - **Drag & Drop File Upload** 📁
  - **Click to Select Files** 
  - **File Type Validation** (Images, PDFs, Documents, Text)
  - **File Size Validation** (10MB limit)
  - **Upload Progress Indicator**
  - **File List Management** (View, Remove)
  - **Real-time Upload Status**
  - Responsive design
  - React component rendering

#### 4. **Full-Stack Integration**
- The React app automatically calls the `/api/health` endpoint
- **File uploads are saved to `uploads/` directory**
- **Files are processed through Express + Multer**
- **Frontend communicates with backend API**
- Check browser console for any errors
- Verify the server status shows "✅ Server is running!"

### 🧪 Setting Up Tests

To add proper testing to your application:

1. **Install Testing Dependencies:**
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
   ```

2. **Create Test Files:**
   - `src/__tests__/App.test.jsx` - React component tests
   - `tests/api.test.js` - API endpoint tests
   - `tests/integration.test.js` - Full-stack integration tests

3. **Add Test Scripts to package.json:**
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:watch": "vitest --watch"
     }
   }
   ```

### 📁 Project Structure

```
owl/
├── src/                           # React frontend source
│   ├── components/               # React components
│   │   ├── FileUpload.jsx       # File upload component
│   │   └── FileUpload.css       # Upload component styles
│   ├── App.jsx                  # Main React component
│   ├── main.jsx                 # React entry point
│   ├── App.css                  # Main app styles
│   └── index.css                # Global styles
├── uploads/                      # Uploaded files (auto-created)
├── dist/                        # Built frontend files
├── index.js                     # Express server with file upload
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
└── GETTING_STARTED.md           # This guide
```

### 🔧 Next Development Steps

1. **Add VeChain Integration:** Use the `@vechain/connex` dependency
2. **Setup Supabase:** Configure your Supabase credentials in `.env`
3. **Add More API Routes:** Extend the Express server
4. **Add More React Components:** Build your frontend features
5. **Write Tests:** Add comprehensive test coverage

### 🌐 Environment Setup

Update your `.env` file with real values:
```env
SUPABASE_URL=your_actual_supabase_url
SUPABASE_ANON_KEY=your_actual_supabase_key
```

### 📝 Available Commands

- `npm start` - Start production server
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run dev:server` - Start server with nodemon (auto-restart)

Your app is ready to go! 🎉