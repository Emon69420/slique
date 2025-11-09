import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Zap,
  Target,
  ArrowRight,
  Search,
  UserPlus,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { ShaderAnimation } from '../components/ui/shader-animation';
import { GlowCard } from '../components/ui/display-cards';
import { FeaturesSectionWithHoverEffects } from '../components/FeaturesSectionWithHoverEffects';


const LandingPage = () => {
  const { isDarkMode } = useTheme();

  const stats = [
    { number: "₹2.4B+", label: "Assets Under Management" },
    { number: "50K+", label: "Active Investors" },
    { number: "1,200+", label: "Available Assets" },
    { number: "94%", label: "Investor Satisfaction" }
  ];

  return (
    <div className="landing-page" style={{ position: 'relative' }}>
      {/* Hero Section */}
      <section className="hero-section relative">
        {/* Shader Animation Background */}
        <div className="absolute inset-0 w-full h-full">
          <ShaderAnimation />
        </div>
        <div className="hero-bg"></div>
        <div className="container relative z-10">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Invest Big.{' '}
              <span className="gradient-text">Together.</span>
            </h1>
            <p className="hero-subtitle">
              Democratizing Ownership, One Slice at a Time. Co-own high-value assets
              with like-minded investors and build wealth through fractional ownership.
            </p>
            <div className="hero-cta">
              <Link to="/auth" className="btn btn-primary">
                Start Investing
                <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-number gradient-text">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
              Powerful Features for{' '}
              <span className="gradient-text">Smart Investing</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Experience the future of fractional ownership with our cutting-edge platform
            </p>
          </motion.div>

          <FeaturesSectionWithHoverEffects />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Discover Assets",
                description: "Browse curated high-value assets across real estate, art, startups, and green energy.",
                icon: <Search size={32} />
              },
              {
                step: "02", 
                title: "Join Syndicates",
                description: "Get matched with compatible investors and co-invest in fractional ownership opportunities.",
                icon: <UserPlus size={32} />
              },
              {
                step: "03",
                title: "Track & Trade", 
                description: "Monitor your portfolio performance and trade shares during monthly liquidity windows.",
                icon: <BarChart3 size={32} />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <GlowCard 
                  glowColor="orange"
                  size="md"
                  className="text-center"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <div className="text-2xl font-bold text-orange-500">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isDarkMode
            ? 'rgba(10, 10, 10, 0.3)'
            : 'rgba(248, 249, 250, 0.3)',
          zIndex: 1
        }}></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
              Ready to Transform Your{' '}
              <span className="gradient-text">Investment Journey?</span>
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Join thousands of investors who are already building wealth through fractional ownership
            </p>
            <Link to="/auth" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Start Investing Today
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;