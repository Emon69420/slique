import api from './api';

// Detect Phantom Wallet
export const detectPhantomWallet = () => {
  if (window.phantom?.ethereum?.isPhantom) {
    return window.phantom.ethereum;
  }
  return null;
};

// Connect to Phantom Wallet
export const connectPhantomWallet = async () => {
  const provider = detectPhantomWallet();
  
  if (!provider) {
    throw new Error('Phantom wallet not installed. Please install Phantom extension.');
  }

  try {
    // Request account access
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    
    if (accounts && accounts.length > 0) {
      const walletAddress = accounts[0];
      
      // Send wallet address to backend
      await api.post('/api/wallets/connect', { 
        wallet_address: walletAddress 
      });
      
      return walletAddress;
    }
    
    throw new Error('No accounts found');
  } catch (error) {
    console.error('Error connecting to Phantom:', error);
    throw error;
  }
};

// Get wallet balance from backend
export const getWalletBalance = async (walletAddress) => {
  try {
    const response = await api.get('/api/wallets/balance', {
      params: { address: walletAddress }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

// Get wallet info from backend
export const getWalletInfo = async (walletAddress) => {
  try {
    const response = await api.get('/api/wallets/info', {
      params: { wallet_address: walletAddress }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = () => {
  // Clear wallet from localStorage or state
  localStorage.removeItem('walletAddress');
};

// Check if wallet is already connected
export const getConnectedWallet = () => {
  return localStorage.getItem('walletAddress');
};

// Save connected wallet
export const saveConnectedWallet = (address) => {
  localStorage.setItem('walletAddress', address);
};
