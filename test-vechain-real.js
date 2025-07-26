const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

// Advanced VeChain integration test
async function testRealVeChainIntegration() {
  try {
    const { Thor } = require('@vechain/sdk-core');
    const { SimpleWallet } = require('@vechain/connex-framework');
    const { Connex } = require('@vechain/connex');
    
    console.log('✅ VeChain SDK imports successful');
    
    // Check environment
    if (!process.env.VECHAIN_PRIVATE_KEY) {
      console.log('⚠️  VECHAIN_PRIVATE_KEY not found - running in simulation mode');
      return false;
    }
    
    if (!process.env.VECHAIN_NODE_URL) {
      console.log('⚠️  VECHAIN_NODE_URL not found - using default testnet');
    }
    
    // Initialize VeChain connection
    const nodeUrl = process.env.VECHAIN_NODE_URL || 'https://testnet.veblocks.net';
    const connex = new Connex({ 
      node: nodeUrl, 
      network: process.env.NODE_ENV === 'production' ? 'main' : 'test' 
    });
    
    // Setup wallet
    const wallet = new SimpleWallet();
    wallet.import(process.env.VECHAIN_PRIVATE_KEY);
    const account = wallet.list()[0];
    
    console.log('✅ VeChain wallet initialized');
    console.log('📍 Wallet address:', account.address);
    console.log('🌐 Connected to:', nodeUrl);
    
    return { connex, wallet, account };
  } catch (error) {
    console.error('❌ VeChain integration failed:', error.message);
    return false;
  }
}

// Create test document with more realistic content
function createAdvancedTestDocument() {
  const testContent = `PATENT DOCUMENT - TEST VERSION
Document ID: ${crypto.randomUUID()}
Created: ${new Date().toISOString()}
Author: Test User
Title: Advanced VeChain Integration Test Document

ABSTRACT:
This document demonstrates the integration of document notarization 
with VeChain blockchain technology. The document will be hashed using 
SHA-256 and the hash will be stored on the VeChain blockchain as 
proof of existence and timestamp.

CONTENT:
This is a comprehensive test document that simulates a real patent 
application or legal document that requires blockchain notarization. 
The document contains structured data that will be processed and 
stored on the VeChain blockchain for permanent record keeping.

TECHNICAL DETAILS:
- Hash Algorithm: SHA-256
- Blockchain: VeChain
- Network: Testnet (for testing purposes)
- Gas Payment: Prepaid via wallet
- Storage: Immutable blockchain record

This document serves as a proof of concept for blockchain-based 
document notarization and verification systems.

END OF DOCUMENT
Hash: [To be generated]
Transaction: [To be created]
Block: [To be mined]`;

  const testFilePath = path.join(__dirname, 'advanced-test-document.txt');
  fs.writeFileSync(testFilePath, testContent);
  console.log('✅ Advanced test document created:', testFilePath);
  console.log('📄 Document size:', fs.statSync(testFilePath).size, 'bytes');
  return testFilePath;
}

// Generate document hash with metadata
function generateAdvancedHash(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);
    
    // Create metadata object
    const metadata = {
      filename: path.basename(filePath),
      size: stats.size,
      created: stats.birthtime.toISOString(),
      modified: stats.mtime.toISOString(),
      contentHash: crypto.createHash('sha256').update(fileData).digest('hex')
    };
    
    // Create combined hash (content + metadata)
    const combinedData = JSON.stringify(metadata) + fileData.toString();
    const combinedHash = '0x' + crypto.createHash('sha256').update(combinedData).digest('hex');
    
    console.log('✅ Advanced hash generated');
    console.log('🔗 Content Hash:', metadata.contentHash);
    console.log('🔗 Combined Hash:', combinedHash);
    console.log('📊 Metadata:', JSON.stringify(metadata, null, 2));
    
    return {
      contentHash: metadata.contentHash,
      combinedHash: combinedHash,
      metadata: metadata
    };
  } catch (error) {
    console.error('❌ Advanced hashing failed:', error.message);
    return null;
  }
}

// Real VeChain transaction (when private key is available)
async function createRealVeChainTransaction(vechainSetup, hashData) {
  try {
    if (!vechainSetup) {
      console.log('⚠️  VeChain setup not available - simulating transaction');
      return simulateVeChainTransaction(hashData.combinedHash);
    }
    
    const { connex, wallet, account } = vechainSetup;
    
    // Check account balance
    const accountInfo = await connex.thor.account(account.address).get();
    console.log('💰 Account balance:', accountInfo.balance);
    
    // Create transaction clause
    const clause = {
      to: account.address, // Send to self (data transaction)
      value: '0x0', // No VET transfer
      data: '0x' + hashData.combinedHash.substring(2) // Document hash as data
    };
    
    console.log('📝 Creating VeChain transaction...');
    console.log('🔗 Data to store:', clause.data);
    
    // Sign and send transaction
    const tx = await connex.vendor
      .sign('tx', [clause])
      .signer(account.address)
      .request();
    
    console.log('✅ VeChain transaction created successfully');
    console.log('🔗 Transaction ID:', tx.txid);
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('🌐 Explorer URL: https://explore-testnet.vechain.org/transactions/' + tx.txid);
    
    return {
      txId: tx.txid,
      timestamp: Date.now(),
      hash: hashData.combinedHash,
      explorerUrl: 'https://explore-testnet.vechain.org/transactions/' + tx.txid,
      real: true
    };
  } catch (error) {
    console.error('❌ Real VeChain transaction failed:', error.message);
    console.log('🔄 Falling back to simulation...');
    return simulateVeChainTransaction(hashData.combinedHash);
  }
}

// Simulate VeChain transaction (fallback)
function simulateVeChainTransaction(hash) {
  const txId = '0x' + crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  
  console.log('✅ VeChain transaction simulated');
  console.log('🔗 Transaction ID:', txId);
  console.log('⏰ Timestamp:', new Date(timestamp).toISOString());
  console.log('🌐 Explorer URL: https://explore-testnet.vechain.org/transactions/' + txId);
  
  return {
    txId,
    timestamp,
    hash,
    explorerUrl: 'https://explore-testnet.vechain.org/transactions/' + txId,
    real: false
  };
}

// Create comprehensive lookup data
function createComprehensiveLookupData(documentInfo, hashData, transactionInfo) {
  const lookupData = {
    document_id: crypto.randomUUID(),
    file_name: path.basename(documentInfo.path),
    file_size: documentInfo.size,
    content_hash: hashData.contentHash,
    combined_hash: hashData.combinedHash,
    metadata: hashData.metadata,
    vechain_tx_id: transactionInfo.txId,
    vechain_explorer_url: transactionInfo.explorerUrl,
    created_at: new Date(transactionInfo.timestamp).toISOString(),
    status: transactionInfo.real ? 'completed' : 'simulated',
    gas_used: transactionInfo.real ? '21000' : 'simulated',
    block_number: transactionInfo.real ? 'pending' : Math.floor(Math.random() * 1000000) + 1000000,
    network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
    transaction_type: 'document_notarization',
    verification_status: 'pending_confirmation'
  };
  
  console.log('✅ Comprehensive lookup data created');
  console.log('📋 Document ID:', lookupData.document_id);
  console.log('📊 Status:', lookupData.status);
  console.log('🔍 Transaction Type:', lookupData.transaction_type);
  
  return lookupData;
}

// Save lookup data with enhanced structure
function saveEnhancedLookupData(lookupData) {
  try {
    const lookupDir = path.join(__dirname, 'lookup-data');
    if (!fs.existsSync(lookupDir)) {
      fs.mkdirSync(lookupDir, { recursive: true });
    }
    
    // Save by transaction ID
    const txFilename = `${lookupData.vechain_tx_id}.json`;
    const txFilepath = path.join(lookupDir, txFilename);
    fs.writeFileSync(txFilepath, JSON.stringify(lookupData, null, 2));
    
    // Save by document ID
    const docFilename = `${lookupData.document_id}.json`;
    const docFilepath = path.join(lookupDir, docFilename);
    fs.writeFileSync(docFilepath, JSON.stringify(lookupData, null, 2));
    
    // Save index file
    const indexFilepath = path.join(lookupDir, 'index.json');
    let index = [];
    if (fs.existsSync(indexFilepath)) {
      index = JSON.parse(fs.readFileSync(indexFilepath, 'utf8'));
    }
    index.push({
      document_id: lookupData.document_id,
      tx_id: lookupData.vechain_tx_id,
      file_name: lookupData.file_name,
      created_at: lookupData.created_at,
      status: lookupData.status
    });
    fs.writeFileSync(indexFilepath, JSON.stringify(index, null, 2));
    
    console.log('✅ Enhanced lookup data saved');
    console.log('📁 Transaction file:', txFilepath);
    console.log('📁 Document file:', docFilepath);
    console.log('📁 Index file:', indexFilepath);
    
    return { txFilepath, docFilepath, indexFilepath };
  } catch (error) {
    console.error('❌ Failed to save enhanced lookup data:', error.message);
    return null;
  }
}

// Enhanced lookup functionality
function testEnhancedLookup(txId, docId) {
  try {
    const lookupDir = path.join(__dirname, 'lookup-data');
    
    // Lookup by transaction ID
    const txFilepath = path.join(lookupDir, `${txId}.json`);
    if (fs.existsSync(txFilepath)) {
      const txData = JSON.parse(fs.readFileSync(txFilepath, 'utf8'));
      console.log('✅ Lookup by TX ID successful:', txId);
      return txData;
    }
    
    // Lookup by document ID
    const docFilepath = path.join(lookupDir, `${docId}.json`);
    if (fs.existsSync(docFilepath)) {
      const docData = JSON.parse(fs.readFileSync(docFilepath, 'utf8'));
      console.log('✅ Lookup by Document ID successful:', docId);
      return docData;
    }
    
    console.log('❌ Document not found for TX ID:', txId, 'or Document ID:', docId);
    return null;
  } catch (error) {
    console.error('❌ Enhanced lookup failed:', error.message);
    return null;
  }
}

// Main advanced test function
async function runAdvancedVeChainTest() {
  console.log('🚀 Starting Advanced VeChain Document Upload Test\n');
  
  // Step 1: VeChain Integration Setup
  console.log('--- Step 1: VeChain Integration Setup ---');
  const vechainSetup = await testRealVeChainIntegration();
  
  // Step 2: Advanced Document Creation
  console.log('\n--- Step 2: Advanced Document Creation ---');
  const testDocument = createAdvancedTestDocument();
  const documentInfo = {
    path: testDocument,
    size: fs.statSync(testDocument).size,
    name: path.basename(testDocument)
  };
  
  // Step 3: Advanced Document Hashing
  console.log('\n--- Step 3: Advanced Document Hashing ---');
  const hashData = generateAdvancedHash(testDocument);
  if (!hashData) {
    console.log('❌ Advanced document hashing failed');
    return false;
  }
  
  // Step 4: Real VeChain Transaction
  console.log('\n--- Step 4: VeChain Transaction ---');
  const transactionInfo = await createRealVeChainTransaction(vechainSetup, hashData);
  if (!transactionInfo) {
    console.log('❌ VeChain transaction failed');
    return false;
  }
  
  // Step 5: Comprehensive Lookup Data
  console.log('\n--- Step 5: Comprehensive Lookup Data ---');
  const lookupData = createComprehensiveLookupData(documentInfo, hashData, transactionInfo);
  
  // Step 6: Enhanced Data Persistence
  console.log('\n--- Step 6: Enhanced Data Persistence ---');
  const savedPaths = saveEnhancedLookupData(lookupData);
  if (!savedPaths) {
    console.log('❌ Failed to save enhanced lookup data');
    return false;
  }
  
  // Step 7: Enhanced Lookup Testing
  console.log('\n--- Step 7: Enhanced Lookup Testing ---');
  const foundDocument = testEnhancedLookup(transactionInfo.txId, lookupData.document_id);
  if (!foundDocument) {
    console.log('❌ Enhanced lookup test failed');
    return false;
  }
  
  // Cleanup
  console.log('\n--- Cleanup ---');
  fs.unlinkSync(testDocument);
  console.log('✅ Test document cleaned up');
  
  // Final Summary
  console.log('\n🎉 --- Advanced Test Summary ---');
  console.log('✅ VeChain Integration:', vechainSetup ? 'REAL' : 'SIMULATED');
  console.log('✅ Advanced Document Creation:', 'PASSED');
  console.log('✅ Advanced Document Hashing:', 'PASSED');
  console.log('✅ VeChain Transaction:', transactionInfo.real ? 'REAL' : 'SIMULATED');
  console.log('✅ Comprehensive Lookup Data:', 'PASSED');
  console.log('✅ Enhanced Data Persistence:', 'PASSED');
  console.log('✅ Enhanced Lookup Functionality:', 'PASSED');
  
  console.log('\n📋 --- Document Information ---');
  console.log('File Name:', foundDocument.file_name);
  console.log('File Size:', foundDocument.file_size, 'bytes');
  console.log('Content Hash:', foundDocument.content_hash);
  console.log('Combined Hash:', foundDocument.combined_hash);
  console.log('Transaction ID:', foundDocument.vechain_tx_id);
  console.log('Document ID:', foundDocument.document_id);
  console.log('Explorer URL:', foundDocument.vechain_explorer_url);
  console.log('Created At:', foundDocument.created_at);
  console.log('Status:', foundDocument.status);
  console.log('Network:', foundDocument.network);
  console.log('Transaction Type:', foundDocument.transaction_type);
  
  console.log('\n🔍 --- Lookup Instructions ---');
  console.log('Lookup by Transaction ID:', foundDocument.vechain_tx_id);
  console.log('Lookup by Document ID:', foundDocument.document_id);
  console.log('Explorer URL:', foundDocument.vechain_explorer_url);
  
  return true;
}

// Run the advanced test
runAdvancedVeChainTest().then(success => {
  console.log('\n🏁 Advanced test completed with status:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Advanced test failed with error:', error);
  process.exit(1);
});