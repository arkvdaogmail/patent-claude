{
  "name": "vdao-core-test",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "formidable": "^3.5.1",
    "fs": "0.0.1-security",
    "crypto": "^1.0.1"
  }
}```

**File 2: `vercel.json`** (Tells Vercel how to run the backend API)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}


