import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Coins, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getUserTokens } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './MyTokensModal.css';

const MyTokensModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState([]);  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserTokens = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getUserTokens(user.id);
      if (response.data.success) {
        setTokens(response.data.data);
      }
    } catch (err) {
      setError('Failed to load tokens');
      console.error('Fetch tokens error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserTokens();
    }
  }, [isOpen, user, fetchUserTokens]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content my-tokens-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Coins size={24} />
            My Tokens
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
              <p>Loading your tokens...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="empty-state">
              <Coins size={48} />
              <h3>No Tokens Found</h3>
              <p>You haven't tokenized any assets yet. Convert your assets to tokens to get started!</p>
            </div>
          ) : (
            <div className="tokens-grid">
              {tokens.map((token) => (
                <div key={token.id} className="token-card">
                  <div className="token-header">
                    <div className="token-icon">
                      <Coins size={24} />
                    </div>
                    <div className="token-name">
                      <h3>{token.assets?.name || token.name || 'Token'}</h3>
                      <span className="token-symbol">{token.symbol}</span>
                    </div>
                  </div>                  <div className="token-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Supply</span>
                      <span className="stat-value">{token.total_supply?.toLocaleString()} tokens</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Per Token</span>
                      <span className="stat-value">{token.total_supply === 100 ? '1%' : `${(100/token.total_supply).toFixed(2)}%`}</span>
                    </div>
                  </div>

                  <div className="token-ownership-info" style={{
                    padding: '12px',
                    background: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    💡 Each token = {token.total_supply === 100 ? '1%' : `${(100/token.total_supply).toFixed(2)}%`} ownership
                    <br />
                    Example: Buy 5 tokens = {token.total_supply === 100 ? '5%' : `${(5 * 100/token.total_supply).toFixed(2)}%`} ownership
                  </div>

                  <div className="token-valuation" style={{
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      TOTAL ASSET VALUE
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-orange)' }}>
                      ₹{token.assets?.valuation?.toLocaleString() || '0'}
                    </div>
                    {token.total_supply && token.assets?.valuation && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Price per token: ₹{Math.floor(token.assets.valuation / token.total_supply).toLocaleString()}
                      </div>
                    )}
                  </div>                  <div className="token-status">
                    {(token.mint_address || token.contract_address) ? (
                      <div 
                        className="status-badge success" 
                        title={`Contract Address: ${token.mint_address || token.contract_address}`}
                        style={{ cursor: 'help' }}
                      >
                        <CheckCircle size={14} />
                        🔗 {(token.mint_address || token.contract_address).slice(0, 6)}...{(token.mint_address || token.contract_address).slice(-4)}
                      </div>
                    ) : (
                      <div className="status-badge warning">
                        <XCircle size={14} />
                        📄 Database
                      </div>
                    )}
                    <div className="status-badge success">
                      {token.total_supply} Tokens
                    </div>
                  </div>

                  {token.mint_address && (
                    <div className="token-address">
                      <span className="address-label">Mint Address:</span>
                      <code>{token.mint_address.substring(0, 20)}...</code>
                    </div>
                  )}

                  <div className="token-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{new Date(token.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
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

export default MyTokensModal;
