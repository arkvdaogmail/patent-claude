import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import './WalletConnect.css'

// Handle ethers.js v6 compatibility
const { JsonRpcProvider, Web3Provider, formatEther, parseEther } = ethers

function WalletConnect({ amount, currency, onSuccess, onError, onWalletChange }) {
  const [wallet, setWallet] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [walletType, setWalletType] = useState(null)
  const [provider, setProvider] = useState(null)

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect with MetaMask browser extension',
      available: typeof window !== 'undefined' && window.ethereum
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect with mobile wallets',
      available: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🟦',
      description: 'Connect with Coinbase Wallet',
      available: typeof window !== 'undefined' && window.ethereum
    }
  ]

  useEffect(() => {
    if (wallet) {
      onWalletChange(wallet)
    }
  }, [wallet, onWalletChange])

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    const provider = new Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const balance = await provider.getBalance(address)
    const network = await provider.getNetwork()

    return {
      address,
      balance: formatEther(balance),
      network: network.name,
      provider,
      signer
    }
  }

  const connectWalletConnect = async () => {
    const provider = new WalletConnectProvider({
      infuraId: process.env.REACT_APP_INFURA_ID || "your-infura-id", // Replace with your Infura ID
      qrcode: true,
      qrcodeModalOptions: {
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
        ],
      },
    })

    await provider.enable()

    const ethersProvider = new Web3Provider(provider)
    const signer = await ethersProvider.getSigner()
    const address = await signer.getAddress()
    const balance = await ethersProvider.getBalance(address)
    const network = await ethersProvider.getNetwork()

    return {
      address,
      balance: formatEther(balance),
      network: network.name,
      provider: ethersProvider,
      signer,
      walletConnectProvider: provider
    }
  }

  const connectWallet = async (type) => {
    setIsConnecting(true)
    setWalletType(type)

    try {
      let walletInfo

      switch (type) {
        case 'metamask':
          walletInfo = await connectMetaMask()
          break
        case 'walletconnect':
          walletInfo = await connectWalletConnect()
          break
        case 'coinbase':
          walletInfo = await connectMetaMask() // Same as MetaMask for now
          break
        default:
          throw new Error('Unsupported wallet type')
      }

      setWallet(walletInfo)
      setProvider(walletInfo.provider)
      
    } catch (error) {
      console.error('Wallet connection error:', error)
      onError(error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    if (wallet && wallet.walletConnectProvider) {
      await wallet.walletConnectProvider.disconnect()
    }
    setWallet(null)
    setProvider(null)
    setWalletType(null)
    onWalletChange(null)
  }

  const sendPayment = async () => {
    if (!wallet || !wallet.signer) {
      onError(new Error('No wallet connected'))
      return
    }

    setIsProcessing(true)

    try {
      // Convert USD to ETH (simplified - in real app, use an exchange rate API)
      const ethAmount = (amount / 100) * 0.0005 // Rough conversion for demo
      
      const transaction = {
        to: process.env.REACT_APP_PAYMENT_ADDRESS || "0x742d35Cc6634C0532925a3b8D5C9d2C9C7C0b0F1", // Replace with your payment address
        value: parseEther(ethAmount.toString()),
        gasLimit: 21000,
      }

      const txResponse = await wallet.signer.sendTransaction(transaction)
      const receipt = await txResponse.wait()

      onSuccess({
        transaction: txResponse,
        receipt,
        amount: ethAmount,
        currency: 'ETH',
        method: 'wallet',
        walletType: walletType
      })

    } catch (error) {
      console.error('Payment error:', error)
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(cents / 100)
  }

  return (
    <div className="wallet-connect">
      <div className="wallet-header">
        <h3>🦊 Crypto Wallet Payment</h3>
        <div className="payment-amount">
          Total: <strong>{formatAmount(amount)}</strong>
        </div>
      </div>

      {!wallet ? (
        <div className="wallet-connection">
          <p>Connect your crypto wallet to continue with payment</p>
          <div className="wallet-options">
            {walletOptions.map(option => (
              <button
                key={option.id}
                className={`wallet-option ${!option.available ? 'disabled' : ''}`}
                onClick={() => connectWallet(option.id)}
                disabled={isConnecting || !option.available}
              >
                <div className="wallet-icon">{option.icon}</div>
                <div className="wallet-info">
                  <div className="wallet-name">{option.name}</div>
                  <div className="wallet-description">{option.description}</div>
                </div>
                {!option.available && (
                  <div className="wallet-status">Not Available</div>
                )}
              </button>
            ))}
          </div>
          
          {isConnecting && (
            <div className="connecting-status">
              <div className="spinner"></div>
              <span>Connecting to {walletType}...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info-display">
            <div className="wallet-avatar">
              {walletType === 'metamask' ? '🦊' : walletType === 'walletconnect' ? '🔗' : '🟦'}
            </div>
            <div className="wallet-details">
              <div className="wallet-address">
                <strong>Address:</strong> {formatAddress(wallet.address)}
              </div>
              <div className="wallet-balance">
                <strong>Balance:</strong> {parseFloat(wallet.balance).toFixed(4)} ETH
              </div>
              <div className="wallet-network">
                <strong>Network:</strong> {wallet.network}
              </div>
            </div>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </div>

          <div className="payment-section">
            <div className="payment-conversion">
              <p>Payment will be converted to ETH</p>
              <div className="conversion-rate">
                {formatAmount(amount)} ≈ {((amount / 100) * 0.0005).toFixed(6)} ETH
              </div>
              <small>*Exchange rate is estimated for demo purposes</small>
            </div>

            <button
              onClick={sendPayment}
              disabled={isProcessing}
              className="pay-button"
            >
              {isProcessing ? (
                <span className="processing">
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : (
                `Pay with ${walletType === 'metamask' ? 'MetaMask' : walletType === 'walletconnect' ? 'WalletConnect' : 'Coinbase'}`
              )}
            </button>
          </div>
        </div>
      )}

      <div className="wallet-security">
        <h4>🔐 Security Features</h4>
        <ul>
          <li>✅ Your private keys never leave your wallet</li>
          <li>✅ Transactions are signed locally</li>
          <li>✅ Blockchain-verified payments</li>
          <li>✅ Decentralized and trustless</li>
        </ul>
      </div>
    </div>
  )
}

export default WalletConnect