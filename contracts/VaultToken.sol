// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title VaultToken
 * @dev VAULT platform token - ERC20 token for VaultHive platform rewards and governance
 * Users earn VAULT tokens by participating in asset tokenization, trading, and other platform activities
 */
contract VaultToken is ERC20, ERC20Burnable, Ownable, Pausable {
    
    // Maximum supply of VAULT tokens (100 million with 18 decimals)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    // Reward rates for different activities (in basis points, 10000 = 100%)
    uint256 public constant TOKENIZATION_REWARD_RATE = 100; // 1% of asset value in VAULT
    uint256 public constant TRADING_REWARD_RATE = 50; // 0.5% of trade value in VAULT
    uint256 public constant LIQUIDITY_REWARD_RATE = 200; // 2% APY for providing liquidity
    
    // Authorized minter addresses (backend services, other contracts)
    mapping(address => bool) public authorizedMinters;
    
    // User reward tracking
    mapping(address => uint256) public totalRewardsEarned;
    mapping(address => uint256) public lastActivityBlock;
    
    // Events
    event RewardMinted(address indexed recipient, uint256 amount, string reason);
    event MinterAuthorized(address indexed minter, bool authorized);
    event RewardRateUpdated(string rewardType, uint256 newRate);
    
    constructor(
        address _initialOwner,
        uint256 _initialSupply
    ) ERC20("VaultToken", "VAULT") {
        require(_initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum");
        _transferOwnership(_initialOwner);
        
        if (_initialSupply > 0) {
            _mint(_initialOwner, _initialSupply);
        }
    }
    
    /**
     * @dev Mint VAULT tokens as rewards for platform activities
     * Only authorized minters (backend services) can call this
     */
    function mintReward(
        address _recipient, 
        uint256 _amount, 
        string calldata _reason
    ) external whenNotPaused {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be positive");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(_recipient, _amount);
        
        // Update user tracking
        totalRewardsEarned[_recipient] += _amount;
        lastActivityBlock[_recipient] = block.number;
        
        emit RewardMinted(_recipient, _amount, _reason);
    }
    
    /**
     * @dev Batch mint rewards to multiple recipients
     */
    function batchMintRewards(
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string calldata _reason
    ) external whenNotPaused {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(_recipients.length == _amounts.length, "Array length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Would exceed max supply");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            if (_recipients[i] != address(0) && _amounts[i] > 0) {
                _mint(_recipients[i], _amounts[i]);
                totalRewardsEarned[_recipients[i]] += _amounts[i];
                lastActivityBlock[_recipients[i]] = block.number;
                emit RewardMinted(_recipients[i], _amounts[i], _reason);
            }
        }
    }
    
    /**
     * @dev Calculate reward amount for asset tokenization
     */
    function calculateTokenizationReward(uint256 _assetValue) public pure returns (uint256) {
        return (_assetValue * TOKENIZATION_REWARD_RATE) / 10000;
    }
    
    /**
     * @dev Calculate reward amount for trading activity
     */
    function calculateTradingReward(uint256 _tradeValue) public pure returns (uint256) {
        return (_tradeValue * TRADING_REWARD_RATE) / 10000;
    }
    
    /**
     * @dev Set authorization for minter addresses
     */
    function setMinterAuthorization(address _minter, bool _authorized) external onlyOwner {
        authorizedMinters[_minter] = _authorized;
        emit MinterAuthorized(_minter, _authorized);
    }
    
    /**
     * @dev Emergency pause functionality
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to add pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Get user's platform activity stats
     */
    function getUserStats(address _user) external view returns (
        uint256 balance,
        uint256 totalRewards,
        uint256 lastActivity,
        bool isActive
    ) {
        balance = balanceOf(_user);
        totalRewards = totalRewardsEarned[_user];
        lastActivity = lastActivityBlock[_user];
        isActive = (block.number - lastActivity) < 50000; // Active within ~7 days
    }
    
    /**
     * @dev Get contract information
     */
    function getContractInfo() external view returns (
        uint256 currentSupply,
        uint256 maxSupply,
        uint256 remainingSupply,
        bool isPaused
    ) {
        currentSupply = totalSupply();
        maxSupply = MAX_SUPPLY;
        remainingSupply = MAX_SUPPLY - currentSupply;
        isPaused = paused();
    }
}
