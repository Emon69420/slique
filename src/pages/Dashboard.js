import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Award,
  Activity,
  Target,
  Package,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getConnectedWallet, getWalletBalance } from '../services/wallet';
import { getAllTokens } from '../services/api';
import MyAssetsModal from '../components/MyAssetsModal';
import MyTokensModal from '../components/MyTokensModal';

const Dashboard = () => {
  const { user } = useAuth();  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [tokens, setTokens] = useState([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [isMyAssetsModalOpen, setIsMyAssetsModalOpen] = useState(false);
  const [isMyTokensModalOpen, setIsMyTokensModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Fetch wallet balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const savedWallet = getConnectedWallet();
        if (savedWallet) {
          const balanceData = await getWalletBalance(savedWallet);
          if (balanceData.success && balanceData.data) {
            const monBalance = balanceData.data.balance.native;
            const numericBalance = parseFloat(monBalance.toString().replace(' MON', ''));
            setWalletBalance(numericBalance);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        setWalletBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, []);

  // Custom filter: show only tokens where the logged-in user's wallet address matches the token's owner_wallet_address
  const fetchTokens = React.useCallback(async () => {
    try {
      const response = await getAllTokens();
      if (response.data.success) {
        // Show all tokens, no filters
        setTokens(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setTokens([]);
    } finally {
      setIsLoadingTokens(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Debug: log tokens to verify created_at
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      console.log('Filtered tokens:', tokens.map(t => ({ id: t.id, created_at: t.created_at })));
    }
  }, [tokens]);

  const handleTokenCreated = (token) => {
    console.log('Token created:', token);
    // Refresh the tokens list
    fetchTokens();
  };
  const portfolioData = {
    totalValue: walletBalance,
    change: 8.5,
    changeAmount: 9850
  };
  // MON to INR conversion rate
  const MON_TO_INR = 1.36;
  const portfolioValueInINR = walletBalance * MON_TO_INR;

  const impactScore = {
    grade: 'A+',
    progress: 85
  };

  const liquidityWindows = [
    {
      asset: "Downtown Office Complex",
      share: "2.5%",
      date: "Dec 15, 2024",
      value: 15750
    },
    {
      asset: "Renewable Energy Fund",
      share: "1.8%",
      date: "Dec 22, 2024",
      value: 8900
    }
  ];

  const recentActivity = [
    {
      type: "dividend",
      message: "Micro-dividend received from Solar Farm Portfolio TX",
      amount: 125,
      time: "2 hours ago"
    },
    {
      type: "syndicate",
      message: "Joined new syndicate for Manhattan Art Collection",
      time: "1 day ago"
    },
    {
      type: "vote",
      message: "Voting required: Austin Tech Startup expansion proposal",
      time: "2 days ago"
    },
    {
      type: "alert",
      message: "Downtown Office Complex sentiment score increased to 8.2",
      time: "3 days ago"
    }
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px' }}>
            Welcome back, <span className="gradient-text">{user?.name || user?.username || user?.email || 'User'}</span>
          </h1>

          <div className="dashboard-grid">
            {/* Portfolio Overview */}
            <div className="card portfolio-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Total Portfolio Value
                  </h2>                  <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '8px' }}>
                    {portfolioData.totalValue.toFixed(4)} MON
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Wallet: {getConnectedWallet() || 'Not connected'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: 'var(--success-green)' }} />
                    <span style={{
                      color: 'var(--success-green)',
                      fontWeight: '600'
                    }}>
                      {portfolioData.totalValue.toFixed(4)} MON × ₹{MON_TO_INR} = ₹{portfolioValueInINR.toFixed(2)}
                    </span>
                  </div>                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setIsMyAssetsModalOpen(true)}
                  >
                    <Package size={16} />
                    My Assets
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsMyTokensModalOpen(true)}
                  >
                    <Coins size={16} />
                    My Tokens
                  </button>
                </div>
              </div>

              {/* Simple performance chart placeholder */}
              <div style={{
                height: '120px',
                background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.05))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                Portfolio Performance Chart
              </div>
            </div>

            {/* Impact Score */}
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: 'var(--primary-orange)' }} />
                Impact Score
              </h3>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: 'var(--success-green)',
                  marginBottom: '12px'
                }}>
                  {impactScore.grade}
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--border-color)',
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: `${impactScore.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--success-green), var(--primary-orange))',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  View Impact Report
                </button>
              </div>
            </div>

            {/* Recommended Syndicates */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} style={{ color: 'var(--primary-orange)' }} />
                  Recommended Syndicates
                </h3>
                <button className="btn btn-secondary">See All</button>
              </div>              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {isLoadingTokens ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading tokens...
                  </div>
                ) : tokens.length > 0 ? (
                  tokens.slice(0, 4).map((token) => (
                    <div key={token.id} className="card" style={{ padding: '16px' }}>
                      <div style={{
                        height: '120px',
                        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.05))',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: 0
                      }}>
                        {token.assets?.image_url ? (
                          <img
                            src={token.assets.image_url}
                            alt={token.assets?.name || 'Asset'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <span style={{ color: 'var(--primary-orange)', fontWeight: '600', fontSize: '1.2rem' }}>
                            {token.symbol || 'TOKEN'}
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                        {token.assets?.name || token.name || 'Token Name'}
                      </h4>                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                        {token.symbol} · {token.total_supply ? `${token.total_supply.toLocaleString()} supply` : 'N/A'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {token.mint_address || token.contract_address ? (
                            <span title={token.mint_address || token.contract_address}>
                              🔗 {(token.mint_address || token.contract_address).slice(0, 6)}...{(token.mint_address || token.contract_address).slice(-4)}
                            </span>
                          ) : '📄 Database'}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--success-green)' }}>
                          {token.is_fractionalized ? '✓ Fractionalized' : 'Whole Token'}
                        </span>
                      </div>
                      {token.assets?.valuation && (
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: 'var(--primary-orange)', 
                          fontWeight: '600',
                          marginBottom: '12px'
                        }}>
                          ₹{parseFloat(token.assets.valuation).toLocaleString()} valuation
                        </div>
                      )}
                      <button className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No tokens available yet. Create your first token!
                  </div>
                )}
              </div>
            </div>

            {/* Discover Assets section: show all tokens with image_url */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} style={{ color: 'var(--primary-orange)' }} />
                  Discover Assets
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                {tokens.filter(token => token.assets?.image_url).map((token) => (
                  <div key={token.id} className="card" style={{ padding: '8px', cursor: 'pointer' }}
                    onClick={() => setSelectedAsset(token)}>
                    <img
                      src={token.assets.image_url}
                      alt={token.assets?.name || 'Asset'}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginTop: '8px', textAlign: 'center' }}>
                      {token.assets?.name || token.name || 'Token Name'}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Modal for enlarged image */}
            {selectedAsset && (
              <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedAsset(null)}>
                <div className="modal-content" style={{ background: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '480px', width: '90%', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                  <img src={selectedAsset.assets.image_url} alt={selectedAsset.assets?.name || 'Asset'} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>{selectedAsset.assets?.name || selectedAsset.name || 'Token Name'}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{selectedAsset.assets?.description || 'No description available.'}</p>
                  <button className="btn btn-secondary" style={{ position: 'absolute', top: '16px', right: '16px' }} onClick={() => setSelectedAsset(null)}>Close</button>
                </div>
              </div>
            )}

            {/* Upcoming Liquidity Windows */}
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} style={{ color: 'var(--primary-orange)' }} />
                Liquidity Windows
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {liquidityWindows.map((window, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {window.asset}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Your share: {window.share} • ₹{window.value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary-orange)' }}>
                      {window.date}
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }}>
                Go to Market
              </button>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} style={{ color: 'var(--primary-orange)' }} />
                Recent Activity
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary-orange)',
                      marginTop: '6px',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                        {activity.message}
                        {activity.amount && (
                          <span style={{ color: 'var(--success-green)', fontWeight: '600', marginLeft: '8px' }}>
                            +₹{activity.amount}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>          </div>
        </motion.div>
      </div>

      {/* My Assets Modal */}
      <MyAssetsModal
        isOpen={isMyAssetsModalOpen}
        onClose={() => setIsMyAssetsModalOpen(false)}
        onTokenCreated={handleTokenCreated}
      />

      {/* My Tokens Modal */}
      <MyTokensModal
        isOpen={isMyTokensModalOpen}
        onClose={() => setIsMyTokensModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;