// Test script for upload and blockchain functionality
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Create a test file
function createTestFile() {
  const testContent = 'This is a test document for notarization testing.';
  const testFilePath = path.join(__dirname, 'test-document.txt');
  fs.writeFileSync(testFilePath, testContent);
  console.log('✅ Test file created:', testFilePath);
  return testFilePath;
}

// Test file hashing
function testFileHashing(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');
    console.log('✅ File hash generated:', fileHash);
    return fileHash;
  } catch (error) {
    console.error('❌ File hashing failed:', error.message);
    return null;
  }
}

// Test VeChain SDK imports
function testVeChainImports() {
  try {
    // Test if VeChain SDK can be imported
    const { Thor } = require('@vechain/sdk-core');
    console.log('✅ VeChain SDK imports working');
    return true;
  } catch (error) {
    console.error('❌ VeChain SDK import failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Starting upload and blockchain tests...\n');
  
  // Test 1: File creation
  const testFile = createTestFile();
  
  // Test 2: File hashing
  const hash = testFileHashing(testFile);
  
  // Test 3: VeChain SDK
  const sdkWorking = testVeChainImports();
  
  // Cleanup
  fs.unlinkSync(testFile);
  console.log('✅ Test file cleaned up');
  
  console.log('\n--- Test Summary ---');
  console.log('File Creation:', '✅');
  console.log('File Hashing:', hash ? '✅' : '❌');
  console.log('VeChain SDK:', sdkWorking ? '✅' : '❌');
  
  return hash && sdkWorking;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
});

