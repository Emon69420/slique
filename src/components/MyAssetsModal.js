import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Package, Calendar, DollarSign, Coins } from 'lucide-react';
import { getUserAssets, tokenizeAsset } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './MyAssetsModal.css';

const MyAssetsModal = ({ isOpen, onClose, onTokenCreated }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  const [tokenizing, setTokenizing] = useState(null);
  const [error, setError] = useState('');

  const fetchUserAssets = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getUserAssets(user.id);
      if (response.data.success) {
        // Filter out already tokenized assets
        const nonTokenizedAssets = response.data.data.filter(asset => !asset.is_tokenized);
        setAssets(nonTokenizedAssets);
      }
    } catch (err) {
      setError('Failed to load assets');
      console.error('Fetch assets error:', err);    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserAssets();
    }
  }, [isOpen, user, fetchUserAssets]);
  const handleTokenize = async (assetId) => {
    setTokenizing(assetId);
    setError('');
    
    try {
      // Get wallet address from localStorage (set when wallet is connected)
      const walletAddress = localStorage.getItem('walletAddress');
      
      // If no wallet connected, prompt user
      if (!walletAddress) {
        const shouldConnect = window.confirm(
          '⚠️ No wallet connected!\n\n' +
          'To tokenize assets on the Monad blockchain, you need to connect your Phantom wallet.\n\n' +
          'Would you like to continue without connecting? (Tokens will be created but not linked to your wallet)'
        );
        
        if (!shouldConnect) {
          setTokenizing(null);
          return;
        }
      }
      
      const response = await tokenizeAsset(assetId, walletAddress);
      
      if (response.data.success) {
        // Remove the tokenized asset from the list
        setAssets(assets.filter(a => a.id !== assetId));
        
        // Show success message with VAULT reward and wallet info
        const walletInfo = walletAddress 
          ? `\n👤 Linked to wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : '\n⚠️ Not linked to wallet (connect wallet first)';
        
        alert(
          `🎉 Asset tokenized successfully!\n\n` +
          `📊 Created 100 tokens (Each token = 1% ownership)\n` +
          `💡 Users can buy 5 tokens = 5% ownership\n\n` +
          `💰 You earned 100 VAULT coins as a reward!` +
          walletInfo
        );
        
        if (onTokenCreated) {
          onTokenCreated(response.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to tokenize asset');
      console.error('Tokenization error:', err);
    } finally {
      setTokenizing(null);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content my-assets-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Package size={24} />
            My Assets
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <h3>No Assets Found</h3>
              <p>You haven't created any assets yet, or all your assets have been tokenized.</p>
            </div>
          ) : (
            <div className="assets-grid">
              {assets.map((asset) => (
                <div key={asset.id} className="asset-card">
                  {asset.image_url && (
                    <div className="asset-image">
                      <img src={asset.image_url} alt={asset.name} />
                    </div>
                  )}
                  
                  <div className="asset-info">
                    <h3>{asset.name}</h3>
                    <p className="asset-description">{asset.description}</p>
                    
                    <div className="asset-meta">
                      <div className="meta-item">
                        <DollarSign size={16} />
                        <span>₹{asset.valuation?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="asset-category">
                      <span className="category-badge">{asset.category || 'Miscellaneous'}</span>
                    </div>
                  </div>
                  
                  <button
                    className="btn btn-primary tokenize-btn"
                    onClick={() => handleTokenize(asset.id)}
                    disabled={tokenizing === asset.id}
                  >
                    {tokenizing === asset.id ? (
                      <>
                        <div className="btn-spinner"></div>
                        Tokenizing...
                      </>
                    ) : (
                      <>
                        <Coins size={16} />
                        Convert to Token
                        <span className="reward-badge">+100 VAULT</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MyAssetsModal;
