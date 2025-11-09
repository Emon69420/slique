import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, User, Sun, Moon, LogOut, Wallet, ChevronDown, Package, Coins } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  connectPhantomWallet, 
  getWalletBalance, 
  saveConnectedWallet, 
  getConnectedWallet,
  disconnectWallet
} from '../services/wallet';
import { getVaultBalance } from '../services/api';
import CreateAssetModal from './CreateAssetModal';
import MyAssetsModal from './MyAssetsModal';
import MyTokensModal from './MyTokensModal';
import './Navbar.css';

const Navbar = () => {  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isMyAssetsModalOpen, setIsMyAssetsModalOpen] = useState(false);
  const [isMyTokensModalOpen, setIsMyTokensModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const isAuth = location.pathname === '/auth';
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedWallet = getConnectedWallet();
    if (savedWallet) {
      setWalletAddress(savedWallet);
      fetchWalletBalance(savedWallet);
    }
  }, []);

  // Fetch VAULT balance when user is authenticated
  useEffect(() => {
    const fetchVaultBalance = async () => {
      if (user?.id) {
        try {
          const response = await getVaultBalance(user.id);
          if (response.data.success) {
            setVaultBalance(response.data.data.balance);
          }
        } catch (error) {
          console.error('Failed to fetch VAULT balance:', error);
          setVaultBalance(0);
        }
      }
    };

    fetchVaultBalance();
  }, [user]);

  const handleLogout = () => {
    logout();
    disconnectWallet();
    setWalletAddress(null);
    setWalletBalance(null);
    navigate('/');
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      const address = await connectPhantomWallet();
      setWalletAddress(address);
      saveConnectedWallet(address);
      await fetchWalletBalance(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnectingWallet(false);
    }
  };
  const fetchWalletBalance = async (address) => {
    try {
      const balanceData = await getWalletBalance(address);
      if (balanceData.success && balanceData.data) {
        // Extract MON balance from the response
        const monBalance = balanceData.data.balance.native;
        // Remove "MON" text if present and parse the number
        const numericBalance = parseFloat(monBalance.toString().replace(' MON', ''));
        setWalletBalance(numericBalance);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      setWalletBalance(0);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return '0.00';
    return parseFloat(balance).toFixed(4);
  };
  const handleAssetCreated = (asset) => {
    console.log('Asset created:', asset);
    // You can add a success message or refresh data here
  };

  const handleTokenCreated = (token) => {
    console.log('Token created:', token);
    // Refresh tokens list if needed
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/discover', label: 'Discover' },
    { path: '/investments', label: 'My Investments' },
    { path: '/market', label: 'Market' },
    { path: '/impact', label: 'Impact' }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-text">Slique</span>
          </Link>

          {!isLanding && !isAuth && isAuthenticated && (
            <>
              <div className="nav-links">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>              <div className="nav-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsAssetModalOpen(true)}
                >
                  <Plus size={16} />
                  Asset
                </button>
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* User Dropdown Menu */}
                <div className="user-dropdown" ref={dropdownRef}>
                  <button 
                    className="user-menu-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <User size={20} />
                    <span className="user-name">{user?.name || user?.email || 'User'}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="dropdown-menu">                      <div className="dropdown-header">
                        <div className="user-info">
                          <User size={32} />
                          <div>
                            <div className="user-info-name">{user?.name || 'User'}</div>
                            <div className="user-info-email">{user?.email}</div>
                          </div>
                        </div>
                        
                        {/* VAULT Balance Display */}
                        <div className="vault-balance-display">
                          <Coins size={20} style={{ color: '#FFD700' }} />
                          <div>
                            <div className="vault-balance-label">VAULT Coins</div>
                            <div className="vault-balance-amount">{vaultBalance.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      {/* Wallet Section */}
                      <div className="dropdown-section">
                        {walletAddress ? (
                          <div className="wallet-connected">
                            <div className="wallet-address">
                              <Wallet size={16} />
                              <span>{formatAddress(walletAddress)}</span>
                            </div>
                            <div className="wallet-balance">
                              <span className="balance-label">MON Balance:</span>
                              <span className="balance-amount">{formatBalance(walletBalance)} MON</span>
                            </div>
                          </div>
                        ) : (
                          <button 
                            className="dropdown-item wallet-connect-btn"
                            onClick={handleConnectWallet}
                            disabled={isConnectingWallet}
                          >
                            <Wallet size={16} />
                            {isConnectingWallet ? 'Connecting...' : 'Connect Phantom Wallet'}
                          </button>
                        )}
                      </div>
                        <div className="dropdown-divider"></div>
                      
                      {/* My Assets & My Tokens Buttons */}
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          setIsMyAssetsModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Package size={16} />
                        My Assets
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          setIsMyTokensModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Coins size={16} />
                        My Tokens
                      </button>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {(isLanding || isAuth) && (
            <div className="nav-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="mobile-menu">
            {!isLanding && !isAuth && isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                className="mobile-nav-link"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
              >
                Logout
              </button>
            )}          </div>
        )}
      </div>      {/* Create Asset Modal */}
      <CreateAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onAssetCreated={handleAssetCreated}
      />

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
    </nav>
  );
};

export default Navbar;