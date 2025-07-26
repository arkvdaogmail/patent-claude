# Vercel Deployment Guide

## 🚀 Your Vercel Deployment is Ready!

Since you've already set up the environment variables in Vercel, here's how to verify and use your deployment.

## 📋 Environment Variables in Vercel

Make sure you have these environment variables configured in your Vercel dashboard:

### Required for VeChain Integration
```
VECHAIN_PRIVATE_KEY=your_vechain_private_key_here
VECHAIN_NODE_URL=https://testnet.veblocks.net
NODE_ENV=production
```

### Optional (for full functionality)
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

## 🔍 How to Test Your Vercel Deployment

### 1. Test Environment Variables
```bash
# Test local environment (for development)
npm run test:env

# Test Vercel deployment (replace with your URL)
npm run test:vercel https://your-app.vercel.app
```

### 2. Test VeChain Integration
```bash
# Test basic functionality
npm run test:vechain

# Test advanced functionality (requires private key)
npm run test:vechain:real
```

### 3. Test API Endpoints
Your Vercel deployment includes these API endpoints:

- `GET /api/health` - Health check
- `GET /api/files` - List uploaded files
- `POST /api/upload` - Upload files
- `POST /api/hash-and-chain` - Hash and store on VeChain
- `GET /api/lookup` - Lookup documents

## 🌐 Vercel Dashboard Configuration

### 1. Environment Variables
In your Vercel dashboard:
1. Go to your project
2. Click on "Settings"
3. Go to "Environment Variables"
4. Add each variable with the correct values

### 2. Deployment Settings
- **Framework Preset**: Node.js
- **Build Command**: `npm install`
- **Output Directory**: `api`
- **Install Command**: `npm install`

### 3. Domain Configuration
Your app will be available at:
- `https://your-app.vercel.app` (production)
- `https://your-app-git-main-your-username.vercel.app` (preview)

## 🔧 Testing Your Deployment

### Test Health Check
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running!"
}
```

### Test File Upload
```bash
curl -X POST https://your-app.vercel.app/api/upload \
  -F "files=@test-document.txt"
```

### Test VeChain Integration
```bash
curl -X POST https://your-app.vercel.app/api/hash-and-chain \
  -F "document=@test-document.txt" \
  -F "paymentIntentId=test" \
  -F "userId=test-user"
```

## 📊 Monitoring Your Deployment

### Vercel Analytics
- View deployment logs in Vercel dashboard
- Monitor function execution times
- Check for errors and performance issues

### Environment Variable Status
Use the test script to verify environment variables:
```bash
npm run test:env
```

### VeChain Integration Status
```bash
npm run test:vechain:real
```

## 🔒 Security Considerations

### Environment Variables
- ✅ Never commit private keys to git
- ✅ Use Vercel's environment variable encryption
- ✅ Rotate keys regularly
- ✅ Use different keys for development/production

### VeChain Security
- ✅ Use testnet for development
- ✅ Use mainnet for production
- ✅ Keep private keys secure
- ✅ Monitor wallet balances

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   ```bash
   # Check if variables are set
   npm run test:env
   ```

2. **VeChain Connection Issues**
   ```bash
   # Test VeChain integration
   npm run test:vechain:real
   ```

3. **API Endpoints Not Responding**
   ```bash
   # Test health endpoint
   curl https://your-app.vercel.app/api/health
   ```

4. **Deployment Failures**
   - Check Vercel build logs
   - Verify package.json dependencies
   - Check vercel.json configuration

### Debug Commands
```bash
# Test local environment
npm run test:env

# Test VeChain integration
npm run test:vechain

# Test file upload
npm run test:upload

# List documents
npm run lookup:list
```

## 📈 Performance Optimization

### Vercel Function Limits
- **Execution Time**: 10 seconds (Hobby), 60 seconds (Pro)
- **Payload Size**: 4.5MB
- **Memory**: 1024MB

### Optimization Tips
1. **Use Edge Functions** for simple operations
2. **Optimize Dependencies** - only include what you need
3. **Cache Responses** where appropriate
4. **Use CDN** for static assets

## 🔄 Continuous Deployment

### Automatic Deployments
- Push to main branch → automatic deployment
- Create pull request → preview deployment
- Merge to main → production deployment

### Environment-Specific Variables
- **Production**: Set in Vercel dashboard
- **Preview**: Can override for testing
- **Development**: Use local .env file

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Status](https://vercel-status.com)

### VeChain Support
- [VeChain Documentation](https://docs.vechain.org/)
- [VeChain Explorer](https://explore.vechain.org/)
- [VeChain Community](https://community.vechain.org/)

## ✅ Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] VECHAIN_PRIVATE_KEY set (for real transactions)
- [ ] VECHAIN_NODE_URL configured
- [ ] NODE_ENV set to production
- [ ] Health check endpoint working
- [ ] File upload endpoint working
- [ ] VeChain integration tested
- [ ] Lookup functionality working
- [ ] Domain configured (optional)
- [ ] SSL certificate active (automatic)

Your Vercel deployment is now ready to handle document uploads with VeChain blockchain integration! 🎉