import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => {
  return api.post('/api/auth/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/api/auth/login', credentials);
};

export const getUserProfile = () => {
  return api.get('/api/auth/profile');
};

// Token/Asset endpoints
export const getAllTokens = () => {
  return api.get('/api/tokens');
};

export const getAllAssets = () => {
  return api.get('/api/assets');
};

export const createAsset = (assetData) => {
  return api.post('/api/assets', assetData);
};

export const getTokensByAsset = (assetId) => {
  return api.get(`/api/tokens/asset/${assetId}`);
};

// Get user's assets
export const getUserAssets = (userId) => {
  return api.get(`/api/assets/user/${userId}`);
};

// Get user's tokens
export const getUserTokens = (userId) => {
  return api.get(`/api/tokens/user/${userId}`);
};

// Tokenize an asset (convert to token)
export const tokenizeAsset = (assetId, walletAddress = null) => {
  return api.post(`/api/assets/${assetId}/tokenize`, {
    wallet_address: walletAddress
  });
};

// Get user's VAULT balance
export const getVaultBalance = (userId) => {
  return api.get(`/api/vault/balance/${userId}`);
};

// Get user's VAULT rewards history
export const getVaultRewards = (userId) => {
  return api.get(`/api/vault/rewards/${userId}`);
};

export default api;
