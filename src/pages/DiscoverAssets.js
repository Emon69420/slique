import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllTokens } from '../services/api';

const DiscoverAssets = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await getAllTokens();
        if (response.data.success) {
          setTokens(response.data.data.filter(token => token.assets?.image_url));
        }
      } catch (error) {
        setTokens([]);
      } finally {
        setIsLoadingTokens(false);
      }
    };
    fetchTokens();
  }, []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px' }}>
            Discover <span className="gradient-text">Assets</span>
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {isLoadingTokens ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading tokens...
              </div>
            ) : tokens.length > 0 ? (
              tokens.map(token => (
                <div key={token.id} className="card" style={{ padding: '12px', cursor: 'pointer' }} onClick={() => setSelectedAsset(token)}>
                  <img
                    src={token.assets.image_url}
                    alt={token.assets?.name || 'Asset'}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginTop: '8px', textAlign: 'center' }}>
                    {token.assets?.name || token.name || 'Token Name'}
                  </h4>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No assets with images found.
              </div>
            )}
          </div>
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
        </motion.div>
      </div>
    </div>
  );
};

export default DiscoverAssets;