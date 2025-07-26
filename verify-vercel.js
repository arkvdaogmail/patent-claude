#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test endpoint
async function testEndpoint(baseUrl, endpoint, expectedStatus = 200) {
  const url = `${baseUrl}${endpoint}`;
  log(`\n🔍 Testing: ${endpoint}`, 'blue');
  
  try {
    const response = await makeRequest(url);
    
    if (response.status === expectedStatus) {
      log(`✅ Status: ${response.status}`, 'green');
      
      if (response.data && typeof response.data === 'object') {
        log(`📄 Response: ${JSON.stringify(response.data, null, 2)}`, 'green');
      } else {
        log(`📄 Response: ${response.data}`, 'green');
      }
      
      return true;
    } else {
      log(`❌ Status: ${response.status} (expected ${expectedStatus})`, 'red');
      log(`📄 Response: ${JSON.stringify(response.data, null, 2)}`, 'red');
      return false;
    }
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

// Main verification function
async function verifyVercelDeployment(baseUrl) {
  log('🚀 Vercel Deployment Verification', 'bold');
  log('================================', 'bold');
  log(`🌐 Base URL: ${baseUrl}`, 'blue');
  
  const tests = [
    { endpoint: '/api/health', expectedStatus: 200, name: 'Health Check' },
    { endpoint: '/api/files', expectedStatus: 200, name: 'Files List' },
    { endpoint: '/', expectedStatus: 200, name: 'Root Page' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    log(`\n📋 ${test.name}`, 'yellow');
    const success = await testEndpoint(baseUrl, test.endpoint, test.expectedStatus);
    if (success) passed++;
  }
  
  log(`\n📊 Test Results: ${passed}/${total} passed`, passed === total ? 'green' : 'red');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Your Vercel deployment is working correctly.', 'green');
    log('\n💡 Next steps:', 'blue');
    log('   1. Test file upload: curl -X POST ' + baseUrl + '/api/upload -F "files=@test-document.txt"', 'blue');
    log('   2. Test VeChain integration: npm run test:vechain:real', 'blue');
    log('   3. Check environment variables: npm run test:env', 'blue');
  } else {
    log('\n⚠️  Some tests failed. Check your deployment configuration.', 'yellow');
    log('\n🔧 Troubleshooting:', 'blue');
    log('   1. Check Vercel deployment logs', 'blue');
    log('   2. Verify environment variables are set', 'blue');
    log('   3. Check vercel.json configuration', 'blue');
  }
  
  return passed === total;
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('🔍 Vercel Deployment Verification Tool', 'bold');
    log('\nUsage:', 'blue');
    log('  node verify-vercel.js <vercel-url>', 'blue');
    log('\nExample:', 'blue');
    log('  node verify-vercel.js https://your-app.vercel.app', 'blue');
    log('\nThis tool will test:', 'blue');
    log('  ✅ Health check endpoint', 'green');
    log('  ✅ Files list endpoint', 'green');
    log('  ✅ Root page', 'green');
    return;
  }
  
  const vercelUrl = args[0];
  
  if (!vercelUrl.startsWith('http')) {
    log('❌ Please provide a valid URL starting with http:// or https://', 'red');
    return;
  }
  
  verifyVercelDeployment(vercelUrl).then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log(`💥 Verification failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  verifyVercelDeployment,
  testEndpoint
};