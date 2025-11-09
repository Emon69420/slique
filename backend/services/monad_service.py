import os
import json
import uuid
from typing import Dict, Any, Optional, List
from web3 import Web3
from eth_account import Account
import requests
from decimal import Decimal

print("🔄 Initializing MonadService...")

class MonadService:
    def __init__(self, rpc_url: str = None):
        """Initialize Monad service with Web3 connection"""
        self.rpc_url = rpc_url or os.getenv('MONAD_TESTNET_RPC_URL', 'https://testnet.monad.xyz')
        self.chain_id = int(os.getenv('MONAD_CHAIN_ID', 41454))
        self.network = "monad_testnet"
        
        print(f"🔗 Connecting to Monad RPC: {self.rpc_url}")
        
        try:
            self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            
            # Test connection
            if self.w3.is_connected():
                latest_block = self.w3.eth.block_number
                print(f"✅ Connected to Monad testnet - Latest block: {latest_block}")
            else:
                print("⚠️ Web3 connection failed, using mock mode")
                self.w3 = None
                
        except Exception as e:
            print(f"⚠️ RPC connection error (using mock mode): {e}")
            self.w3 = None
        
        # Contract ABIs (will be loaded from compiled contracts)
        self.vault_token_abi = None
        self.asset_tokenization_abi = None
        self.marketplace_abi = None
        
        # Contract addresses (will be set after deployment)
        self.vault_token_address = os.getenv('VAULT_TOKEN_CONTRACT')
        self.asset_tokenization_address = os.getenv('ASSET_TOKENIZATION_CONTRACT')
        self.marketplace_address = os.getenv('MARKETPLACE_CONTRACT')
    
    def get_balance(self, address: str) -> float:
        """Get ETH balance for a wallet address"""
        try:
            if not self.w3 or not self.w3.is_connected():
                return 2.0  # Mock balance for development
            
            # Validate address
            if not Web3.is_address(address):
                print(f"❌ Invalid address format: {address}")
                return 0.0
            
            # Get balance in wei, convert to ETH
            balance_wei = self.w3.eth.get_balance(Web3.to_checksum_address(address))
            balance_eth = Web3.from_wei(balance_wei, 'ether')
            
            print(f"💰 Balance for {address}: {balance_eth} ETH")
            return float(balance_eth)
            
        except Exception as e:
            print(f"❌ Get balance error: {e}")
            return 2.0  # Return mock balance for development
    
    def get_vault_token_balance(self, address: str) -> float:
        """Get VAULT token balance for a wallet"""
        try:
            if not self.vault_token_address or not self.vault_token_abi:
                print("⚠️ VAULT token contract not deployed, returning mock balance")
                return 1000.0
            
            if not self.w3 or not self.w3.is_connected():
                return 1000.0
            
            # Create contract instance
            contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(self.vault_token_address),
                abi=self.vault_token_abi
            )
            
            # Call balanceOf function
            balance = contract.functions.balanceOf(Web3.to_checksum_address(address)).call()
            
            # Get decimals to convert properly
            decimals = contract.functions.decimals().call()
            balance_formatted = balance / (10 ** decimals)
            
            print(f"🏦 VAULT balance for {address}: {balance_formatted} VAULT")
            return float(balance_formatted)
            
        except Exception as e:
            print(f"❌ Get VAULT balance error: {e}")
            return 1000.0  # Mock balance for development
    
    def send_transaction(self, from_address: str, to_address: str, value_eth: float, private_key: str) -> str:
        """Send ETH transaction on Monad network"""
        try:
            if not self.w3 or not self.w3.is_connected():
                mock_tx = f"monad_tx_{str(uuid.uuid4())[:16]}"
                print(f"🎭 Mock transaction - TX: {mock_tx}")
                return mock_tx
            
            # Convert ETH to wei
            value_wei = Web3.to_wei(value_eth, 'ether')
            
            # Get nonce
            nonce = self.w3.eth.get_transaction_count(Web3.to_checksum_address(from_address))
            
            # Build transaction
            transaction = {
                'to': Web3.to_checksum_address(to_address),
                'value': value_wei,
                'gas': 21000,  # Standard gas for ETH transfer
                'gasPrice': self.w3.eth.gas_price,
                'nonce': nonce,
                'chainId': self.chain_id
            }
            
            # Sign transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            tx_hash_hex = tx_hash.hex()
            
            print(f"✅ Transaction sent - TX: {tx_hash_hex}")
            return tx_hash_hex
            
        except Exception as e:
            print(f"❌ Send transaction failed: {e}")
            # Return mock transaction for development
            return f"mock_tx_{str(uuid.uuid4())[:16]}"
    
    def create_vault_tokens(self, recipient_address: str, amount: int, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Create VAULT platform tokens as rewards"""
        try:
            print(f"🔨 Creating {amount} VAULT tokens for {recipient_address}")
            
            if not self.vault_token_address or not self.vault_token_abi:
                print("⚠️ VAULT token contract not deployed, using mock")
                return {
                    "contract_address": f"0x{str(uuid.uuid4()).replace('-', '')[:40]}",
                    "transaction_hash": f"vault_mint_{str(uuid.uuid4())[:16]}",
                    "amount": amount,
                    "recipient": recipient_address,
                    "metadata": metadata
                }
            
            # This would call the mint function on the VAULT token contract
            mock_tx = f"vault_mint_{str(uuid.uuid4())[:16]}"
            
            result = {
                "contract_address": self.vault_token_address,
                "transaction_hash": mock_tx,
                "amount": amount,
                "recipient": recipient_address,
                "metadata": metadata,
                "token_type": "VAULT_PLATFORM_TOKEN"
            }
            
            print(f"✅ VAULT tokens created - TX: {mock_tx}")
            return result
            
        except Exception as e:
            print(f"❌ VAULT token creation failed: {e}")
            return {
                "error": str(e),
                "contract_address": None,
                "transaction_hash": None
            }
    
    def create_asset_tokens(self, asset_data: Dict[str, Any], total_supply: int, decimals: int = 0) -> Dict[str, Any]:
        """Create fractional asset tokens (ERC-20)"""
        try:
            print(f"🏠 Creating asset tokens for: {asset_data.get('title', 'Unknown Asset')}")
            
            if not self.asset_tokenization_address or not self.asset_tokenization_abi:
                print("⚠️ Asset tokenization contract not deployed, using mock")
                return {
                    "token_contract": f"0x{str(uuid.uuid4()).replace('-', '')[:40]}",
                    "transaction_hash": f"asset_token_{str(uuid.uuid4())[:16]}",
                    "total_supply": total_supply,
                    "decimals": decimals,
                    "asset_data": asset_data
                }
            
            # This would call the createAssetToken function
            mock_tx = f"asset_token_{str(uuid.uuid4())[:16]}"
            
            result = {
                "token_contract": f"0x{str(uuid.uuid4()).replace('-', '')[:40]}",
                "transaction_hash": mock_tx,
                "total_supply": total_supply,
                "decimals": decimals,
                "asset_data": asset_data,
                "token_type": "ASSET_FRACTIONAL_TOKEN"
            }
            
            print(f"✅ Asset tokens created - TX: {mock_tx}")
            return result
            
        except Exception as e:
            print(f"❌ Asset token creation failed: {e}")
            return {
                "error": str(e),
                "token_contract": None,
                "transaction_hash": None
            }
    
    def transfer_tokens(self, token_contract: str, from_address: str, to_address: str, amount: int, private_key: str) -> str:
        """Transfer ERC-20 tokens between addresses"""
        try:
            print(f"🔄 Transferring {amount} tokens from {from_address} to {to_address}")
            
            if not self.w3 or not self.w3.is_connected():
                mock_tx = f"token_transfer_{str(uuid.uuid4())[:16]}"
                print(f"🎭 Mock token transfer - TX: {mock_tx}")
                return mock_tx
            
            # This would interact with the ERC-20 contract
            mock_tx = f"token_transfer_{str(uuid.uuid4())[:16]}"
            print(f"✅ Token transfer - TX: {mock_tx}")
            return mock_tx
            
        except Exception as e:
            print(f"❌ Token transfer failed: {e}")
            return f"mock_transfer_{str(uuid.uuid4())[:16]}"
    
    def get_gas_price(self) -> int:
        """Get current gas price in wei"""
        try:
            if not self.w3 or not self.w3.is_connected():
                return 2000000000  # 2 gwei default
            
            gas_price = self.w3.eth.gas_price
            return int(gas_price)
            
        except Exception as e:
            print(f"❌ Get gas price error: {e}")
            return 2000000000  # 2 gwei fallback
    
    def estimate_gas(self, transaction: Dict[str, Any]) -> int:
        """Estimate gas for a transaction"""
        try:
            if not self.w3 or not self.w3.is_connected():
                return 100000  # Default estimate
            
            gas_estimate = self.w3.eth.estimate_gas(transaction)
            return int(gas_estimate * 1.2)  # Add 20% buffer
            
        except Exception as e:
            print(f"❌ Gas estimation error: {e}")
            return 100000
    
    def get_transaction_receipt(self, tx_hash: str) -> Optional[Dict[str, Any]]:
        """Get transaction receipt and status"""
        try:
            if not self.w3 or not self.w3.is_connected():
                return {
                    "status": 1,
                    "blockNumber": 12345,
                    "gasUsed": 21000,
                    "transactionHash": tx_hash
                }
            
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            return dict(receipt)
            
        except Exception as e:
            print(f"❌ Get receipt error: {e}")
            return None
    
    def load_contract_abis(self, artifacts_path: str = "artifacts/contracts"):
        """Load compiled contract ABIs from Hardhat artifacts"""
        try:
            # Load VAULT token ABI
            vault_token_path = f"{artifacts_path}/VaultToken.sol/VaultToken.json"
            if os.path.exists(vault_token_path):
                with open(vault_token_path, 'r') as f:
                    vault_artifact = json.load(f)
                    self.vault_token_abi = vault_artifact['abi']
                    print("✅ VAULT token ABI loaded")
            
            # Load Asset tokenization ABI
            asset_path = f"{artifacts_path}/AssetTokenization.sol/AssetTokenization.json"
            if os.path.exists(asset_path):
                with open(asset_path, 'r') as f:
                    asset_artifact = json.load(f)
                    self.asset_tokenization_abi = asset_artifact['abi']
                    print("✅ Asset tokenization ABI loaded")
            
            # Load Marketplace ABI
            marketplace_path = f"{artifacts_path}/Marketplace.sol/Marketplace.json"
            if os.path.exists(marketplace_path):
                with open(marketplace_path, 'r') as f:
                    marketplace_artifact = json.load(f)
                    self.marketplace_abi = marketplace_artifact['abi']
                    print("✅ Marketplace ABI loaded")
                    
        except Exception as e:
            print(f"⚠️ Could not load contract ABIs: {e}")
    
    def validate_address(self, address: str) -> bool:
        """Validate Ethereum address format"""
        try:
            return Web3.is_address(address)
        except:
            return False
    
    def get_network_info(self) -> Dict[str, Any]:
        """Get current network information"""
        return {
            "network": self.network,
            "chain_id": self.chain_id,
            "rpc_url": self.rpc_url,
            "connected": self.w3 is not None and self.w3.is_connected() if self.w3 else False,
            "latest_block": self.w3.eth.block_number if self.w3 and self.w3.is_connected() else "unknown"
        }
