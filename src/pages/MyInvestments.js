import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Vote, 
  DollarSign,
  Calendar,
  Award,
  ExternalLink,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const MyInvestments = () => {
  const [activeTab, setActiveTab] = useState('assets');

  const myAssets = [
    {
      id: 1,
      name: "Solar Farm Portfolio TX",
      type: "Green Energy",
      ownershipPercentage: 2.5,
      currentValue: 32750,
      initialInvestment: 25000,
      performance: 31.0,
      lastDividend: 125,
      dividendDate: "Nov 15, 2024",
      status: "Active",
      votingPending: false,
      nftId: "VH-SF-001"
    },
    {
      id: 2,
      name: "Downtown Office Complex",
      type: "Real Estate", 
      ownershipPercentage: 1.8,
      currentValue: 45200,
      initialInvestment: 40000,
      performance: 13.0,
      lastDividend: 280,
      dividendDate: "Nov 1, 2024",
      status: "Active",
      votingPending: true,
      nftId: "VH-RE-002"
    },
    {
      id: 3,
      name: "Manhattan Art Collection",
      type: "Fine Art",
      ownershipPercentage: 3.2,
      currentValue: 28900,
      initialInvestment: 30000,
      performance: -3.7,
      lastDividend: 0,
      dividendDate: null,
      status: "Active",
      votingPending: false,
      nftId: "VH-ART-003"
    },
    {
      id: 4,
      name: "Austin Tech Startup",
      type: "Startup Equity",
      ownershipPercentage: 0.8,
      currentValue: 18950,
      initialInvestment: 15000,
      performance: 26.3,
      lastDividend: 0,
      dividendDate: null,
      status: "Active",
      votingPending: false,
      nftId: "VH-ST-004"
    }
  ];

  const nftCollection = [
    {
      id: "VH-SF-001",
      name: "Solar Farm Portfolio TX",
      image: "/api/placeholder/200/200",
      rarity: "Rare",
      mintDate: "Oct 15, 2024"
    },
    {
      id: "VH-RE-002", 
      name: "Downtown Office Complex",
      image: "/api/placeholder/200/200",
      rarity: "Epic",
      mintDate: "Sep 22, 2024"
    },
    {
      id: "VH-ART-003",
      name: "Manhattan Art Collection", 
      image: "/api/placeholder/200/200",
      rarity: "Legendary",
      mintDate: "Aug 8, 2024"
    },
    {
      id: "VH-ST-004",
      name: "Austin Tech Startup",
      image: "/api/placeholder/200/200", 
      rarity: "Common",
      mintDate: "Nov 3, 2024"
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'var(--text-secondary)';
      case 'Rare': return 'var(--primary-orange)';
      case 'Epic': return 'var(--secondary-orange)';
      case 'Legendary': return 'var(--warning-yellow)';
      default: return 'var(--text-secondary)';
    }
  };

  const totalPortfolioValue = myAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalInvestment = myAssets.reduce((sum, asset) => sum + asset.initialInvestment, 0);
  const totalPerformance = ((totalPortfolioValue - totalInvestment) / totalInvestment) * 100;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
              My <span className="gradient-text">Investments</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Track and manage your fractional ownership portfolio
            </p>
          </div>

          {/* Portfolio Summary */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Total Portfolio Value
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px' }}>
                  ₹{totalPortfolioValue.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {totalPerformance > 0 ? (
                    <TrendingUp size={16} style={{ color: 'var(--success-green)' }} />
                  ) : (
                    <TrendingDown size={16} style={{ color: 'var(--error-red)' }} />
                  )}
                  <span style={{ 
                    color: totalPerformance > 0 ? 'var(--success-green)' : 'var(--error-red)',
                    fontWeight: '600'
                  }}>
                    {totalPerformance > 0 ? '+' : ''}{totalPerformance.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Total Invested
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  ₹{totalInvestment.toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Active Assets
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-orange)' }}>
                  {myAssets.length}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Monthly Dividends
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-green)' }}>
                  ₹405
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setActiveTab('assets')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'assets' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'assets' ? '2px solid var(--primary-orange)' : 'none'
                }}
              >
                My Assets
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'nfts' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'nfts' ? '2px solid var(--primary-orange)' : 'none'
                }}
              >
                NFT Vault
              </button>
            </div>
          </div>

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '20px', alignItems: 'center' }}>
                      {/* Asset Thumbnail */}
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'var(--border-color)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem'
                      }}>
                        Asset
                      </div>

                      {/* Asset Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                            {asset.name}
                          </h3>
                          <span style={{ 
                            padding: '2px 8px', 
                            background: 'var(--bg-secondary)', 
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                          }}>
                            {asset.type}
                          </span>
                          {asset.votingPending && (
                            <span style={{ 
                              padding: '2px 8px', 
                              background: 'var(--warning-yellow)', 
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              color: 'black',
                              fontWeight: '600'
                            }}>
                              Vote Pending
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontSize: '0.9rem' }}>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Ownership</div>
                            <div style={{ fontWeight: '600' }}>{asset.ownershipPercentage}%</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Current Value</div>
                            <div style={{ fontWeight: '600' }}>₹{asset.currentValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Performance</div>
                            <div style={{ 
                              fontWeight: '600',
                              color: asset.performance > 0 ? 'var(--success-green)' : 'var(--error-red)'
                            }}>
                              {asset.performance > 0 ? '+' : ''}{asset.performance}%
                            </div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Last Dividend</div>
                            <div style={{ fontWeight: '600', color: 'var(--success-green)' }}>
                              {asset.lastDividend > 0 ? `₹${asset.lastDividend}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Indicator */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
                          {asset.performance > 0 ? (
                            <TrendingUp size={20} style={{ color: 'var(--success-green)' }} />
                          ) : (
                            <TrendingDown size={20} style={{ color: 'var(--error-red)' }} />
                          )}
                          <span style={{ 
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: asset.performance > 0 ? 'var(--success-green)' : 'var(--error-red)'
                          }}>
                            {asset.performance > 0 ? '+' : ''}{asset.performance}%
                          </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          +₹{(asset.currentValue - asset.initialInvestment).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                        <Eye size={16} />
                        Details
                      </button>
                      {asset.votingPending && (
                        <button className="btn btn-primary" style={{ padding: '8px 12px' }}>
                          <Vote size={16} />
                          Vote
                        </button>
                      )}
                      <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                        <DollarSign size={16} />
                        Sell
                      </button>
                      <button style={{ 
                        padding: '8px 12px',
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* NFT Vault Tab */}
          {activeTab === 'nfts' && (
            <div>
              <div className="card" style={{ marginBottom: '32px', textAlign: 'center' }}>
                <Award size={48} style={{ color: 'var(--primary-orange)', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>
                  Your NFT Vault
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Collect unique NFTs representing your fractional ownership in premium assets
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button className="btn btn-primary">
                    <Share2 size={16} />
                    Share Collection
                  </button>
                  <button className="btn btn-secondary">
                    <ExternalLink size={16} />
                    View on OpenSea
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {nftCollection.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{ 
                      height: '200px', 
                      background: 'var(--border-color)', 
                      borderRadius: '8px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      position: 'relative'
                    }}>
                      NFT Image
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: getRarityColor(nft.rarity),
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: nft.rarity === 'Common' ? 'white' : 'black'
                      }}>
                        {nft.rarity}
                      </div>
                    </div>
                    
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                      {nft.name}
                    </h4>
                    
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      ID: {nft.id}
                    </div>
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Minted: {nft.mintDate}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyInvestments;