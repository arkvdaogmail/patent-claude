const https = require('https');
const http = require('http');

// Test Vercel deployment
async function testVercelDeployment(baseUrl) {
  console.log(`🔍 Testing Vercel deployment at: ${baseUrl}`);
  
  const endpoints = [
    '/api/health',
    '/api/files',
    '/'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `${baseUrl}${endpoint}`;
      console.log(`\n📡 Testing: ${url}`);
      
      const response = await makeRequest(url);
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Make HTTP/HTTPS request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test environment variables (local)
function testLocalEnvironment() {
  console.log('🔧 Testing Local Environment Variables');
  console.log('=====================================');
  
  const envVars = [
    'VECHAIN_PRIVATE_KEY',
    'VECHAIN_NODE_URL',
    'NODE_ENV',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Mask sensitive values
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
        ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`⚠️  ${varName}: Not set`);
    }
  });
}

// Test VeChain integration with environment
function testVeChainEnvironment() {
  console.log('\n🔗 Testing VeChain Environment Integration');
  console.log('==========================================');
  
  try {
    // Test if VeChain SDK can be imported
    const { Thor } = require('@vechain/sdk-core');
    console.log('✅ VeChain SDK imports working');
    
    // Check environment variables
    if (process.env.VECHAIN_PRIVATE_KEY) {
      console.log('✅ VECHAIN_PRIVATE_KEY found');
      
      // Test wallet creation
      const { SimpleWallet } = require('@vechain/connex-framework');
      const wallet = new SimpleWallet();
      wallet.import(process.env.VECHAIN_PRIVATE_KEY);
      const account = wallet.list()[0];
      console.log('✅ Wallet created successfully');
      console.log(`📍 Wallet address: ${account.address}`);
    } else {
      console.log('⚠️  VECHAIN_PRIVATE_KEY not found - will run in simulation mode');
    }
    
    if (process.env.VECHAIN_NODE_URL) {
      console.log(`✅ VECHAIN_NODE_URL: ${process.env.VECHAIN_NODE_URL}`);
    } else {
      console.log('⚠️  VECHAIN_NODE_URL not found - will use default testnet');
    }
    
    console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    console.error('❌ VeChain environment test failed:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Vercel Deployment & Environment Test');
  console.log('=======================================\n');
  
  // Test local environment
  testLocalEnvironment();
  
  // Test VeChain environment
  testVeChainEnvironment();
  
  // Test Vercel deployment (if URL provided)
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const vercelUrl = args[0];
    console.log('\n🌐 Testing Vercel Deployment');
    console.log('============================');
    await testVercelDeployment(vercelUrl);
  } else {
    console.log('\n💡 To test Vercel deployment, provide your deployment URL:');
    console.log('   node test-vercel-deployment.js https://your-app.vercel.app');
  }
  
  console.log('\n✅ Environment test completed!');
}

// Run the test
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testVercelDeployment,
  testLocalEnvironment,
  testVeChainEnvironment
};