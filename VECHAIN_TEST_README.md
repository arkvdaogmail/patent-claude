# VeChain Document Upload & Hash Testing

This project includes comprehensive testing for document upload with VeChain blockchain integration, skipping Stripe payment bugs and focusing on document hashing and blockchain storage.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Add your VeChain private key to the `.env` file:
```
VECHAIN_PRIVATE_KEY=your_actual_private_key_here
VECHAIN_NODE_URL=https://testnet.veblocks.net
NODE_ENV=development
```

### 3. Run Tests

#### Basic Test (Simulation Mode)
```bash
npm run test:vechain
```
This test runs in simulation mode and doesn't require a real VeChain private key.

#### Advanced Test (Real Blockchain Integration)
```bash
npm run test:vechain:real
```
This test requires a real VeChain private key and will create actual blockchain transactions.

## 📋 Test Features

### Document Upload & Hashing
- ✅ Creates test documents with realistic content
- ✅ Generates SHA-256 hashes for document verification
- ✅ Includes metadata (filename, size, timestamps)
- ✅ Creates combined hashes (content + metadata)

### VeChain Integration
- ✅ Connects to VeChain testnet/mainnet
- ✅ Uses private key for gas prepayment
- ✅ Creates blockchain transactions with document hashes
- ✅ Provides transaction IDs and explorer URLs
- ✅ Falls back to simulation if private key unavailable

### Lookup Functionality
- ✅ Stores document data locally (simulating database)
- ✅ Supports lookup by transaction ID
- ✅ Supports lookup by document ID
- ✅ Maintains index of all documents
- ✅ Provides comprehensive document information

## 🔧 Test Files

### `test-vechain-upload.js`
Basic test that simulates the complete flow:
- Document creation
- Hash generation
- Transaction simulation
- Lookup data creation
- Data persistence testing

### `test-vechain-real.js`
Advanced test with real blockchain integration:
- Real VeChain wallet connection
- Actual blockchain transactions
- Enhanced metadata handling
- Comprehensive lookup system
- Fallback to simulation if needed

## 📊 Test Output

The tests provide detailed output including:

```
🚀 Starting VeChain Document Upload Test

--- Step 1: VeChain Setup ---
✅ VeChain SDK imports working
✅ VeChain private key found in .env

--- Step 2: Document Creation ---
✅ Test document created: /path/to/test-document.txt
📄 Document size: 1234 bytes

--- Step 3: Document Hashing ---
✅ Document hash generated: 0x1234...

--- Step 4: VeChain Transaction ---
✅ VeChain transaction created successfully
🔗 Transaction ID: 0x5678...
🌐 Explorer URL: https://explore-testnet.vechain.org/transactions/0x5678...

--- Step 5: Lookup Data Creation ---
✅ Lookup data structure created
📋 Document ID: uuid-here

--- Step 6: Data Persistence ---
✅ Lookup data saved to: /path/to/lookup-data/0x5678.json

--- Step 7: Lookup Testing ---
✅ Lookup successful for TX ID: 0x5678...

🎉 --- Test Summary ---
✅ VeChain Setup: PASSED
✅ Document Creation: PASSED
✅ Document Hashing: PASSED
✅ VeChain Transaction: PASSED
✅ Lookup Data Creation: PASSED
✅ Data Persistence: PASSED
✅ Lookup Functionality: PASSED
```

## 🔍 Lookup Instructions

After running the test, you can lookup documents using:

1. **Transaction ID**: Use the VeChain transaction ID to find the document
2. **Document ID**: Use the generated UUID to find the document
3. **Explorer URL**: Visit the VeChain explorer to see the transaction

### Example Lookup Data
```json
{
  "document_id": "uuid-here",
  "file_name": "test-document.txt",
  "file_size": 1234,
  "content_hash": "0x1234...",
  "combined_hash": "0x5678...",
  "vechain_tx_id": "0x9abc...",
  "vechain_explorer_url": "https://explore-testnet.vechain.org/transactions/0x9abc...",
  "created_at": "2024-01-01T12:00:00.000Z",
  "status": "completed",
  "network": "testnet",
  "transaction_type": "document_notarization"
}
```

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VECHAIN_PRIVATE_KEY` | Your VeChain wallet private key | Yes (for real tests) | None |
| `VECHAIN_NODE_URL` | VeChain node URL | No | `https://testnet.veblocks.net` |
| `NODE_ENV` | Environment mode | No | `development` |

### Network Configuration
- **Testnet**: Uses VeChain testnet for development and testing
- **Mainnet**: Uses VeChain mainnet for production (set `NODE_ENV=production`)

## 🔒 Security Notes

- ⚠️ **Never commit your private key to version control**
- ⚠️ **Use testnet for development and testing**
- ⚠️ **Keep your private key secure and backed up**
- ✅ **The .env file is already in .gitignore**

## 🐛 Troubleshooting

### Common Issues

1. **VeChain SDK Import Failed**
   ```bash
   npm install @vechain/sdk-core @vechain/connex @vechain/connex-framework
   ```

2. **Private Key Not Found**
   - Check your `.env` file exists
   - Verify `VECHAIN_PRIVATE_KEY` is set correctly
   - Test will run in simulation mode if not found

3. **Network Connection Issues**
   - Check your internet connection
   - Verify the VeChain node URL is accessible
   - Try using a different node URL

4. **Transaction Failed**
   - Check your wallet has sufficient VET for gas
   - Verify you're using the correct network (testnet/mainnet)
   - Check the VeChain network status

## 📁 File Structure

```
├── test-vechain-upload.js      # Basic simulation test
├── test-vechain-real.js        # Advanced real blockchain test
├── .env.example                # Environment variables template
├── lookup-data/                # Generated lookup data (created during tests)
│   ├── index.json             # Index of all documents
│   ├── 0x1234...json          # Document data by transaction ID
│   └── uuid-here.json         # Document data by document ID
└── VECHAIN_TEST_README.md     # This file
```

## 🎯 Next Steps

1. **Run the basic test** to verify everything works
2. **Add your VeChain private key** to enable real blockchain transactions
3. **Run the advanced test** to create real blockchain records
4. **Test the lookup functionality** with the generated transaction IDs
5. **Integrate with your main application** using the provided APIs

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your environment variables are set correctly
3. Ensure you have the latest dependencies installed
4. Check the VeChain network status and your wallet balance