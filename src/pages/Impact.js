import React from 'react';
import { 
  Award, 
  Leaf, 
  Users, 
  Shield, 
  TrendingUp,
  Target,
  Globe,
  Heart,
  Zap,
  Trophy,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Impact = () => {
  const impactScore = {
    overall: 'A+',
    points: 8750,
    nextLevel: 10000,
    progress: 87.5
  };

  const categoryScores = [
    {
      category: 'Environmental',
      score: 9.2,
      icon: <Leaf size={24} />,
      color: 'var(--success-green)',
      description: 'Carbon reduction & renewable energy',
      investments: 5,
      impact: '2,450 tons CO2 saved'
    },
    {
      category: 'Social',
      score: 8.1,
      icon: <Users size={24} />,
      color: 'var(--primary-orange)',
      description: 'Community development & job creation',
      investments: 3,
      impact: '127 jobs created'
    },
    {
      category: 'Governance',
      score: 7.8,
      icon: <Shield size={24} />,
      color: 'var(--secondary-orange)',
      description: 'Transparency & ethical practices',
      investments: 4,
      impact: '98% transparency score'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Green Pioneer',
      description: 'Invested in 5+ renewable energy projects',
      icon: <Leaf size={32} />,
      earned: true,
      rarity: 'Epic',
      earnedDate: 'Oct 2024'
    },
    {
      id: 2,
      title: 'Community Builder',
      description: 'Supported 3+ social impact initiatives',
      icon: <Heart size={32} />,
      earned: true,
      rarity: 'Rare',
      earnedDate: 'Sep 2024'
    },
    {
      id: 3,
      title: 'Impact Investor',
      description: 'Achieved A+ overall impact score',
      icon: <Award size={32} />,
      earned: true,
      rarity: 'Legendary',
      earnedDate: 'Nov 2024'
    },
    {
      id: 4,
      title: 'Carbon Neutral',
      description: 'Offset 5,000+ tons of CO2',
      icon: <Globe size={32} />,
      earned: false,
      rarity: 'Legendary',
      progress: 49
    },
    {
      id: 5,
      title: 'Tech for Good',
      description: 'Invest in 10+ tech startups with social impact',
      icon: <Zap size={32} />,
      earned: false,
      rarity: 'Epic',
      progress: 20
    },
    {
      id: 6,
      title: 'ESG Champion',
      description: 'Maintain 9.0+ ESG score for 12 months',
      icon: <Trophy size={32} />,
      earned: false,
      rarity: 'Legendary',
      progress: 75
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'EcoInvestor_Pro', score: 'S+', points: 15420 },
    { rank: 2, name: 'GreenFuture23', score: 'S', points: 12890 },
    { rank: 3, name: 'SustainableWealth', score: 'A+', points: 11250 },
    { rank: 4, name: 'You (Alex)', score: 'A+', points: 8750, isUser: true },
    { rank: 5, name: 'ClimateChampion', score: 'A', points: 8200 }
  ];

  const impactInvestments = [
    {
      name: 'Solar Farm Portfolio TX',
      type: 'Renewable Energy',
      esgScore: 9.5,
      impact: '1,200 tons CO2 saved annually',
      investment: 25000,
      icon: <Leaf size={20} />
    },
    {
      name: 'Community Housing Project',
      type: 'Social Impact',
      esgScore: 8.8,
      impact: '45 affordable homes built',
      investment: 15000,
      icon: <Users size={20} />
    },
    {
      name: 'Clean Water Initiative',
      type: 'Environmental',
      esgScore: 9.2,
      impact: '10,000 people served',
      investment: 12000,
      icon: <Globe size={20} />
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
              Impact <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Track your positive impact and ESG contributions across all investments
            </p>
          </div>

          {/* Impact Score Overview */}
          <div className="card" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '40px', alignItems: 'center' }}>
              <div>
                <div style={{ 
                  fontSize: '4rem', 
                  fontWeight: '900', 
                  color: 'var(--success-green)',
                  marginBottom: '8px'
                }}>
                  {impactScore.overall}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  Overall Impact Score
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                    {impactScore.points.toLocaleString()} / {impactScore.nextLevel.toLocaleString()} points
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '12px', 
                    background: 'var(--border-color)', 
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${impactScore.progress}%`, 
                      height: '100%', 
                      background: 'linear-gradient(135deg, var(--success-green), var(--primary-orange))',
                      borderRadius: '6px'
                    }}></div>
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {(impactScore.nextLevel - impactScore.points).toLocaleString()} points to next level
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary">
                  <Target size={16} />
                  Discover Impact Investments
                </button>
                <button className="btn btn-secondary">
                  <Award size={16} />
                  View Certificates
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
            {/* Category Breakdown */}
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>
                Impact by Category
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {categoryScores.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '20px',
                      padding: '20px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: category.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {category.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                          {category.category}
                        </h4>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '900', 
                          color: category.color 
                        }}>
                          {category.score}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {category.description}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
                        <span>{category.investments} investments</span>
                        <span style={{ color: category.color, fontWeight: '600' }}>
                          {category.impact}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={24} style={{ color: 'var(--warning-yellow)' }} />
                Top Impact Investors
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px',
                      background: entry.isUser ? 'rgba(255, 107, 53, 0.1)' : 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: entry.isUser ? '1px solid var(--primary-orange)' : 'none'
                    }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%',
                      background: entry.rank <= 3 ? 'var(--warning-yellow)' : 'var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: entry.rank <= 3 ? 'black' : 'white',
                      fontSize: '0.9rem'
                    }}>
                      {entry.rank}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        {entry.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {entry.points.toLocaleString()} points
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '4px 8px', 
                      background: 'var(--success-green)',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'black'
                    }}>
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>
              Impact Achievements
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card"
                  style={{ 
                    padding: '20px',
                    opacity: achievement.earned ? 1 : 0.6,
                    border: achievement.earned ? `1px solid ${getRarityColor(achievement.rarity)}` : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: achievement.earned ? getRarityColor(achievement.rarity) : 'var(--border-color)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: achievement.earned ? (achievement.rarity === 'Legendary' ? 'black' : 'white') : 'var(--text-muted)'
                    }}>
                      {achievement.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                          {achievement.title}
                        </h4>
                        <span style={{ 
                          padding: '2px 6px', 
                          background: getRarityColor(achievement.rarity),
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          color: achievement.rarity === 'Legendary' ? 'black' : 'white'
                        }}>
                          {achievement.rarity}
                        </span>
                      </div>
                      
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                        {achievement.description}
                      </p>
                      
                      {achievement.earned ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--success-green)', fontWeight: '600' }}>
                          ✓ Earned {achievement.earnedDate}
                        </div>
                      ) : (
                        <div>
                          <div style={{ 
                            width: '100%', 
                            height: '6px', 
                            background: 'var(--border-color)', 
                            borderRadius: '3px',
                            marginBottom: '4px'
                          }}>
                            <div style={{ 
                              width: `${achievement.progress}%`, 
                              height: '100%', 
                              background: 'var(--primary-orange)',
                              borderRadius: '3px'
                            }}></div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {achievement.progress}% complete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Impact Investments */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                Your Impact Investments
              </h3>
              <button className="btn btn-primary">
                <ArrowRight size={16} />
                View All
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {impactInvestments.map((investment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  style={{ 
                    padding: '20px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'var(--success-green)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {investment.icon}
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>
                        {investment.name}
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {investment.type}
                      </div>
                    </div>
                    
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Star size={12} style={{ color: 'var(--warning-yellow)' }} />
                        <span style={{ fontWeight: '600' }}>{investment.esgScore}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        ESG Score
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Impact Generated
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--success-green)' }}>
                      {investment.impact}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Investment: ₹{investment.investment.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Impact;