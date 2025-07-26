const fs = require('fs');
const path = require('path');

// Lookup utility for finding documents
function lookupDocument(identifier) {
  try {
    const lookupDir = path.join(__dirname, 'lookup-data');
    
    if (!fs.existsSync(lookupDir)) {
      console.log('❌ Lookup data directory not found. Run tests first to generate data.');
      return null;
    }
    
    // Try to find by transaction ID
    const txFilepath = path.join(lookupDir, `${identifier}.json`);
    if (fs.existsSync(txFilepath)) {
      const data = JSON.parse(fs.readFileSync(txFilepath, 'utf8'));
      console.log('✅ Document found by Transaction ID:', identifier);
      return data;
    }
    
    // Try to find by document ID
    const docFilepath = path.join(lookupDir, `${identifier}.json`);
    if (fs.existsSync(docFilepath)) {
      const data = JSON.parse(fs.readFileSync(docFilepath, 'utf8'));
      console.log('✅ Document found by Document ID:', identifier);
      return data;
    }
    
    // Check index file for partial matches
    const indexFilepath = path.join(lookupDir, 'index.json');
    if (fs.existsSync(indexFilepath)) {
      const index = JSON.parse(fs.readFileSync(indexFilepath, 'utf8'));
      const matches = index.filter(item => 
        item.document_id.includes(identifier) || 
        item.tx_id.includes(identifier) ||
        item.file_name.toLowerCase().includes(identifier.toLowerCase())
      );
      
      if (matches.length > 0) {
        console.log(`✅ Found ${matches.length} potential matches:`);
        matches.forEach((match, i) => {
          console.log(`  ${i + 1}. ${match.file_name} (${match.document_id})`);
        });
        return matches;
      }
    }
    
    console.log('❌ Document not found for identifier:', identifier);
    return null;
  } catch (error) {
    console.error('❌ Lookup failed:', error.message);
    return null;
  }
}

// Display document information
function displayDocumentInfo(document) {
  if (!document) {
    console.log('❌ No document to display');
    return;
  }
  
  console.log('\n📋 --- Document Information ---');
  console.log('File Name:', document.file_name);
  console.log('File Size:', document.file_size, 'bytes');
  
  if (document.content_hash) {
    console.log('Content Hash:', document.content_hash);
  }
  if (document.combined_hash) {
    console.log('Combined Hash:', document.combined_hash);
  }
  if (document.original_hash) {
    console.log('Original Hash:', document.original_hash);
  }
  
  console.log('Transaction ID:', document.vechain_tx_id);
  console.log('Document ID:', document.document_id);
  console.log('Explorer URL:', document.vechain_explorer_url);
  console.log('Created At:', document.created_at);
  console.log('Status:', document.status);
  console.log('Network:', document.network);
  
  if (document.transaction_type) {
    console.log('Transaction Type:', document.transaction_type);
  }
  if (document.verification_status) {
    console.log('Verification Status:', document.verification_status);
  }
  
  console.log('\n🔍 --- Lookup Instructions ---');
  console.log('Lookup by Transaction ID:', document.vechain_tx_id);
  console.log('Lookup by Document ID:', document.document_id);
  console.log('Explorer URL:', document.vechain_explorer_url);
}

// List all documents
function listAllDocuments() {
  try {
    const lookupDir = path.join(__dirname, 'lookup-data');
    const indexFilepath = path.join(lookupDir, 'index.json');
    
    if (!fs.existsSync(indexFilepath)) {
      console.log('❌ No documents found. Run tests first to generate data.');
      return;
    }
    
    const index = JSON.parse(fs.readFileSync(indexFilepath, 'utf8'));
    
    console.log(`\n📚 --- All Documents (${index.length} total) ---`);
    index.forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.file_name}`);
      console.log(`   Document ID: ${doc.document_id}`);
      console.log(`   Transaction ID: ${doc.tx_id}`);
      console.log(`   Created: ${doc.created_at}`);
      console.log(`   Status: ${doc.status}`);
    });
    
    return index;
  } catch (error) {
    console.error('❌ Failed to list documents:', error.message);
    return null;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 VeChain Document Lookup Utility');
    console.log('\nUsage:');
    console.log('  node lookup-utility.js <transaction_id_or_document_id>');
    console.log('  node lookup-utility.js --list');
    console.log('  node lookup-utility.js --help');
    console.log('\nExamples:');
    console.log('  node lookup-utility.js 0x3f9ddb3a72dafbaf6dec9ec08f5d3bb898b4e359c2144e2b3fe1518214971cf7');
    console.log('  node lookup-utility.js 4d828937-d205-452c-b6ec-cf8eb67825de');
    console.log('  node lookup-utility.js test-document');
    console.log('  node lookup-utility.js --list');
    return;
  }
  
  if (args[0] === '--help' || args[0] === '-h') {
    console.log('🔍 VeChain Document Lookup Utility');
    console.log('\nThis utility allows you to lookup documents that have been processed');
    console.log('and stored with VeChain blockchain integration.');
    console.log('\nCommands:');
    console.log('  <identifier>  - Lookup document by transaction ID, document ID, or filename');
    console.log('  --list        - List all available documents');
    console.log('  --help        - Show this help message');
    return;
  }
  
  if (args[0] === '--list' || args[0] === '-l') {
    listAllDocuments();
    return;
  }
  
  const identifier = args[0];
  console.log(`🔍 Looking up document with identifier: ${identifier}`);
  
  const document = lookupDocument(identifier);
  
  if (Array.isArray(document)) {
    // Multiple matches found
    console.log('\nMultiple matches found. Please use a more specific identifier.');
  } else if (document) {
    // Single document found
    displayDocumentInfo(document);
  } else {
    console.log('\n💡 Tip: Use --list to see all available documents');
  }
}

// Run the utility
if (require.main === module) {
  main();
}

module.exports = {
  lookupDocument,
  displayDocumentInfo,
  listAllDocuments
};