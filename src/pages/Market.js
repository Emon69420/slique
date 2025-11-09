import React, { useState } from 'react';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Gavel,
  Eye,
  Filter,
  ArrowUpDown,
  Timer
} from 'lucide-react';
import { motion } from 'framer-motion';

const Market = () => {
  const [activeTab, setActiveTab] = useState('market');

  const myShares = [
    {
      id: 1,
      assetName: "Solar Farm Portfolio TX",
      ownershipPercentage: 1.2,
      currentValue: 15750,
      askingPrice: 16200,
      status: "Listed",
      listedDate: "Nov 10, 2024"
    },
    {
      id: 2,
      assetName: "Manhattan Art Collection", 
      ownershipPercentage: 0.8,
      currentValue: 8900,
      askingPrice: 9500,
      status: "Draft",
      listedDate: null
    }
  ];

  const marketListings = [
    {
      id: 1,
      assetName: "Downtown Office Complex",
      seller: "Investor_A47",
      ownershipPercentage: 2.1,
      currentBid: 28500,
      askingPrice: 32000,
      timeRemaining: "2d 14h",
      bidders: 7,
      assetType: "Real Estate",
      performance: 15.2
    },
    {
      id: 2,
      assetName: "Wind Energy Project",
      seller: "GreenInvestor23",
      ownershipPercentage: 1.5,
      currentBid: 18750,
      askingPrice: 22000,
      timeRemaining: "5d 8h",
      bidders: 12,
      assetType: "Green Energy", 
      performance: 22.8
    },
    {
      id: 3,
      assetName: "Vintage Wine Collection",
      seller: "WineConnoisseur",
      ownershipPercentage: 3.2,
      currentBid: 45200,
      askingPrice: 48000,
      timeRemaining: "1d 3h",
      bidders: 5,
      assetType: "Collectibles",
      performance: 8.7
    },
    {
      id: 4,
      assetName: "Austin Tech Startup",
      seller: "TechInvestor99",
      ownershipPercentage: 0.6,
      currentBid: 12300,
      askingPrice: 15000,
      timeRemaining: "6d 12h",
      bidders: 15,
      assetType: "Startup Equity",
      performance: 31.5
    }
  ];

  const upcomingWindows = [
    {
      assetName: "Solar Farm Portfolio TX",
      windowDate: "Dec 15, 2024",
      totalShares: "8.5%",
      estimatedValue: 125000,
      participants: 23
    },
    {
      assetName: "Downtown Office Complex",
      windowDate: "Dec 22, 2024", 
      totalShares: "12.3%",
      estimatedValue: 285000,
      participants: 41
    },
    {
      assetName: "Manhattan Art Collection",
      windowDate: "Jan 5, 2025",
      totalShares: "6.7%",
      estimatedValue: 95000,
      participants: 18
    }
  ];

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
              Secondary <span className="gradient-text">Market</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Trade fractional ownership shares during monthly liquidity windows
            </p>
          </div>

          {/* Market Stats */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-orange)', marginBottom: '8px' }}>
                  ₹2.4M
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>Trading Volume (30d)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--success-green)', marginBottom: '8px' }}>
                  156
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>Active Listings</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--warning-yellow)', marginBottom: '8px' }}>
                  3
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>Days Until Next Window</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  94%
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>Avg. Fill Rate</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setActiveTab('market')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'market' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'market' ? '2px solid var(--primary-orange)' : 'none'
                }}
              >
                Open Market
              </button>
              <button
                onClick={() => setActiveTab('myshares')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'myshares' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'myshares' ? '2px solid var(--primary-orange)' : 'none'
                }}
              >
                My Shares for Sale
              </button>
              <button
                onClick={() => setActiveTab('windows')}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'windows' ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'windows' ? '2px solid var(--primary-orange)' : 'none'
                }}
              >
                Upcoming Windows
              </button>
            </div>
          </div>

          {/* Open Market Tab */}
          {activeTab === 'market' && (
            <div>
              {/* Filters */}
              <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary">
                    <Filter size={16} />
                    Asset Type
                  </button>
                  <button className="btn btn-secondary">
                    <DollarSign size={16} />
                    Price Range
                  </button>
                  <button className="btn btn-secondary">
                    <Clock size={16} />
                    Time Remaining
                  </button>
                  <button className="btn btn-secondary">
                    <ArrowUpDown size={16} />
                    Sort by Bid
                  </button>
                </div>
              </div>

              {/* Market Listings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {marketListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
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

                        {/* Listing Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                              {listing.assetName}
                            </h3>
                            <span style={{ 
                              padding: '2px 8px', 
                              background: 'var(--bg-secondary)', 
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              color: 'var(--text-secondary)'
                            }}>
                              {listing.assetType}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', fontSize: '0.9rem' }}>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Seller</div>
                              <div style={{ fontWeight: '600' }}>{listing.seller}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Share</div>
                              <div style={{ fontWeight: '600' }}>{listing.ownershipPercentage}%</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Current Bid</div>
                              <div style={{ fontWeight: '600', color: 'var(--success-green)' }}>
                                ₹{listing.currentBid.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Asking Price</div>
                              <div style={{ fontWeight: '600' }}>
                                ₹{listing.askingPrice.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Time Left</div>
                              <div style={{ fontWeight: '600', color: 'var(--warning-yellow)' }}>
                                {listing.timeRemaining}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Performance & Bidders */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
                            <TrendingUp size={16} style={{ color: 'var(--success-green)' }} />
                            <span style={{ 
                              fontSize: '1.1rem',
                              fontWeight: '700',
                              color: 'var(--success-green)'
                            }}>
                              +{listing.performance}%
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <Users size={14} />
                            {listing.bidders} bidders
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                          <Eye size={16} />
                          Details
                        </button>
                        <button className="btn btn-primary" style={{ padding: '8px 12px' }}>
                          <Gavel size={16} />
                          Bid Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* My Shares Tab */}
          {activeTab === 'myshares' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                    My Shares for Sale
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your listed shares and create new listings
                  </p>
                </div>
                <button className="btn btn-primary">
                  List New Share
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {myShares.map((share, index) => (
                  <motion.div
                    key={share.id}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
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
                        
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>
                            {share.assetName}
                          </h4>
                          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <span>Share: {share.ownershipPercentage}%</span>
                            <span>Current Value: ₹{share.currentValue.toLocaleString()}</span>
                            <span>Asking: ₹{share.askingPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          background: share.status === 'Listed' ? 'var(--success-green)' : 'var(--warning-yellow)',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: 'black'
                        }}>
                          {share.status}
                        </span>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                          Edit
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                          {share.status === 'Listed' ? 'Remove' : 'Publish'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Windows Tab */}
          {activeTab === 'windows' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                  Upcoming Liquidity Windows
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Monthly trading windows for each asset with scheduled dates
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {upcomingWindows.map((window, index) => (
                  <motion.div
                    key={index}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          background: 'var(--primary-orange)', 
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <Timer size={24} />
                        </div>
                        
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                            {window.assetName}
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontSize: '0.9rem' }}>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Window Date</div>
                              <div style={{ fontWeight: '600', color: 'var(--primary-orange)' }}>
                                {window.windowDate}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Total Shares</div>
                              <div style={{ fontWeight: '600' }}>{window.totalShares}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Est. Value</div>
                              <div style={{ fontWeight: '600' }}>₹{window.estimatedValue.toLocaleString()}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Participants</div>
                              <div style={{ fontWeight: '600' }}>{window.participants}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="btn btn-primary">
                        Set Alert
                      </button>
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

export default Market;