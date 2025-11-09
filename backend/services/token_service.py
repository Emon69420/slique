from supabase import Client
from typing import List, Dict, Any
import uuid
from datetime import datetime
import os
import json

print("🔄 Loading TokenService...")

# Create a simple mock keypair class
class MockKeypair:
    def __init__(self):
        self.public_key = f"VaultHive{str(uuid.uuid4()).replace('-', '')[:32]}"
        self.secret_key = [i for i in range(64)]  # Mock 64-byte secret key
    
    @classmethod
    def from_secret_key(cls, secret_key_bytes):
        instance = cls()
        if isinstance(secret_key_bytes, (list, tuple)):
            instance.secret_key = list(secret_key_bytes)
        return instance
    
    def __str__(self):
        return self.public_key

# Import blockchain services with fallback
try:
    print("📦 Importing SolanaService...")
    from services.solana_service import SolanaService
    
    print("📦 Importing Keypair...")
    try:
        from solders.keypair import Keypair
        print("✅ Using solders.keypair.Keypair")
    except ImportError:
        try:
            from solana.keypair import Keypair
            print("✅ Using solana.keypair.Keypair")
        except ImportError:
            print("⚠️ Using MockKeypair fallback")
            Keypair = MockKeypair
    
    BLOCKCHAIN_ENABLED = True
    print("🚀 Blockchain integration enabled!")
    
except Exception as e:
    BLOCKCHAIN_ENABLED = False
    Keypair = MockKeypair
    print(f"⚠️ Blockchain disabled: {e}")

class TokenService:
    def __init__(self, supabase: Client):
        print("🔄 Initializing TokenService...")
        self.supabase = supabase
        
        self.monad_rpc_url = "https://testnet-rpc.monad.xyz/"
        self.monad_chain_id = 10143
        self.monad_private_key = "0x4fed3d010cb047bd644a4ec9a9cf55e440c11985204d4558b8218a5f7bac3e0c"
        
        if BLOCKCHAIN_ENABLED:
          
            try:
                print("🔗 Creating SolanaService instance...")
                self.solana = SolanaService()
                
                print("🔑 Setting up platform keypair...")
                self.platform_keypair = self._get_platform_keypair()
                
                print(f"✅ TokenService ready with blockchain integration")
                
            except Exception as e:
                print(f"❌ Blockchain service failed, using mocks: {e}")
                self.solana = None
                self.platform_keypair = MockKeypair()
        else:
            print("📊 TokenService running in database-only mode")
            self.solana = None
            self.platform_keypair = None

    def _get_platform_keypair(self):
        """Get or create platform keypair"""
        try:
            keypair_path = "platform_keypair.json"
            
            if os.path.exists(keypair_path):
                with open(keypair_path, 'r') as f:
                    keypair_data = json.load(f)
                    keypair = Keypair.from_secret_key(keypair_data)
                    print(f"📋 Loaded platform wallet: {keypair.public_key}")
                    return keypair
            else:
                # Create new keypair
                keypair = Keypair()
                
                with open(keypair_path, 'w') as f:
                    json.dump(keypair.secret_key, f)
                
                print(f"🎉 Created platform wallet: {keypair.public_key}")
                
                # Try airdrop
                if self.solana:
                    try:
                        airdrop_sig = self.solana.request_airdrop(str(keypair.public_key), 2.0)
                        print(f"✅ Airdropped 2 SOL - TX: {airdrop_sig}")
                    except Exception as e:
                        print(f"⚠️ Airdrop failed: {e}")
                
                return keypair
                
        except Exception as e:
            print(f"❌ Keypair setup failed: {e}")
            return MockKeypair()

    def get_blockchain_status(self) -> Dict[str, Any]:
        """Get blockchain integration status"""
        status = {
            "blockchain_enabled": BLOCKCHAIN_ENABLED,
            "network": "solana-devnet" if BLOCKCHAIN_ENABLED else None,
            "platform_wallet": str(self.platform_keypair.public_key) if self.platform_keypair else None
        }
        
        if BLOCKCHAIN_ENABLED and self.platform_keypair and self.solana:
            try:
                balance = self.solana.get_balance(str(self.platform_keypair.public_key))
                status['platform_wallet_balance'] = f"{balance:.4f} SOL"
                status['ready_for_operations'] = balance > 0.01
            except Exception as e:
                status['error'] = str(e)
                status['ready_for_operations'] = True  # Allow operations anyway
        
        return status

    def create_platform_token(self, name: str, symbol: str, decimals: int = 9, supply: int = 1_000_000_000) -> Dict[str, Any]:
        """Create VaultHive platform token (VAULT) - using existing columns only"""
        try:
            print(f"🏭 Creating platform token: {name} ({symbol})")
            print(f"📊 Supply: {supply:,} tokens with {decimals} decimals")
            
            if BLOCKCHAIN_ENABLED and self.platform_keypair:
                # Create SPL token on Solana
                blockchain_result = self.solana.create_spl_token(
                    self.platform_keypair,
                    decimals=decimals,
                    initial_supply=supply
                )
                mint_address = blockchain_result['mint_address']
            else:
                mint_address = f"VAULT_{str(uuid.uuid4())[:8]}"
            
            # Store platform token using ONLY columns that exist
            platform_token_data = {
                'id': str(uuid.uuid4()),
                'asset_id': None,  # Platform token doesn't belong to specific asset
                'mint_address': mint_address,
                'token_type': 'platform',
                'total_supply': supply,
                'decimals': decimals,
                'is_fractionalized': True,
                'created_at': datetime.now().isoformat()
            }
            
            result = self.supabase.table('tokens').insert(platform_token_data).execute()
            
            if result.data:
                token = result.data[0]
                # Add metadata that wasn't stored
                token['name'] = name
                token['symbol'] = symbol
                token['is_platform_token'] = True
                token['is_blockchain_token'] = BLOCKCHAIN_ENABLED and self.platform_keypair is not None
                print(f"✅ Platform token created: {token['mint_address']}")
                return token
            
            raise Exception("Failed to store platform token")
            
        except Exception as e:
            raise Exception(f"Create platform token error: {str(e)}")

    def mint_platform_tokens(self, recipient_wallet: str, amount: float) -> str:
        """Mint VAULT tokens to a user"""
        try:
            if not BLOCKCHAIN_ENABLED:
                raise Exception("Blockchain features not enabled")
            
            # Get platform token info
            platform_token_result = self.supabase.table('tokens').select('*').eq('is_platform_token', True).execute()
            
            if not platform_token_result.data:
                raise Exception("Platform token not found - create it first")
            
            platform_token = platform_token_result.data[0]
            
            if not self.solana.validate_wallet_address(recipient_wallet):
                raise Exception("Invalid recipient wallet address")
            
            # Convert amount to token units
            token_amount = int(amount * (10 ** platform_token['decimals']))
            
            print(f"🪙 Minting {amount:,} VAULT tokens ({token_amount:,} units) to {recipient_wallet}")
            
            # Mint tokens on blockchain
            mint_tx = self.solana.mint_tokens_to_wallet(
                self.platform_keypair,
                platform_token['mint_address'],
                recipient_wallet,
                token_amount
            )
            
            return mint_tx
        except Exception as e:
            raise Exception(f"Mint platform tokens error: {str(e)}")
    
    def create_token(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create token with blockchain integration"""
        try:
            token_type = data.get('token_type', 'nft')
            decimals = 0 if token_type == 'nft' else 6
            
            if BLOCKCHAIN_ENABLED and self.platform_keypair:
                try:
                    print(f"🔨 Creating {token_type} token on Solana...")
                    
                    # Create SPL token on blockchain
                    blockchain_result = self.solana.create_spl_token(
                        self.platform_keypair,
                        decimals=decimals
                    )
                    
                    mint_address = blockchain_result['mint_address']
                    blockchain_data = {
                        'blockchain_network': 'solana-devnet',
                        'mint_authority': blockchain_result['mint_authority'],
                        'freeze_authority': blockchain_result.get('freeze_authority'),
                        'creation_tx': blockchain_result['transaction_signature'],
                        'is_blockchain_token': True
                    }
                    
                except Exception as e:
                    print(f"⚠️ Blockchain creation failed: {e}")
                    mint_address = f"mint_{str(uuid.uuid4())[:12]}"
                    blockchain_data = {'is_blockchain_token': False}
            else:
                mint_address = f"mint_{str(uuid.uuid4())[:12]}"
                blockchain_data = {'is_blockchain_token': False}
              # Store in database
            token_data = {
                'id': str(uuid.uuid4()),
                'asset_id': data['asset_id'],
                'owner_id': data.get('owner_id'),  # Link to user account
                'owner_wallet_address': data.get('owner_wallet_address'),  # Link to wallet
                'mint_address': mint_address,
                'token_type': token_type,
                'total_supply': data.get('total_supply', 1),
                'decimals': decimals,
                'is_fractionalized': data.get('is_fractionalized', False),
                'is_platform_token': False,
                'created_at': datetime.now().isoformat(),
                **blockchain_data
            }
            
            # Log wallet attachment
            if data.get('owner_wallet_address'):
                print(f"👤 Attaching wallet: {data['owner_wallet_address']}")
            
            result = self.supabase.table('tokens').insert(token_data).execute()
            
            if result.data:
                token = result.data[0]
                
                # If NFT with owner wallet, mint 1 token
                if (token_type == 'nft' and 
                    'initial_owner_wallet' in data and 
                    token.get('is_blockchain_token')):
                    
                    try:
                        print(f"🎨 Minting NFT to {data['initial_owner_wallet']}...")
                        
                        mint_tx = self.solana.mint_tokens_to_wallet(
                            self.platform_keypair,
                            mint_address,
                            data['initial_owner_wallet'],
                            1
                        )
                        
                        # Update with mint transaction
                        self.supabase.table('tokens').update({
                            'mint_tx': mint_tx
                        }).eq('id', token['id']).execute()
                        
                        token['mint_tx'] = mint_tx
                        
                    except Exception as mint_error:
                        print(f"⚠️ Token created but minting failed: {mint_error}")
                
                return token
            
            return None
        except Exception as e:
            raise Exception(f"Create token error: {str(e)}")
    
    def create_token_with_vault_reward(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create token and reward asset owner with 100 VAULT tokens"""
        try:
            # Create the regular token first
            token = self.create_token(data)
            
            if token and data.get('owner_wallet'):
                # Reward asset owner with 100 VAULT tokens
                try:
                    vault_reward_tx = self.mint_vault_reward(
                        recipient_wallet=data['owner_wallet'],
                        amount=100,
                        reason="asset_listing",
                        asset_id=data['asset_id']
                    )
                    
                    # Store the reward transaction
                    reward_data = {
                        'id': str(uuid.uuid4()),
                        'user_wallet': data['owner_wallet'],
                        'reward_type': 'asset_listing',
                        'vault_amount': 100,
                        'asset_id': data['asset_id'],
                        'token_id': token['id'],
                        'transaction_id': vault_reward_tx,
                        'created_at': datetime.now().isoformat()
                    }
                    
                    self.supabase.table('vault_rewards').insert(reward_data).execute()
                    
                    token['vault_reward_tx'] = vault_reward_tx
                    print(f"🎁 Rewarded asset owner with 100 VAULT tokens: {vault_reward_tx}")
                    
                except Exception as reward_error:
                    print(f"⚠️ Token created but VAULT reward failed: {reward_error}")
            
            return token
            
        except Exception as e:
            raise Exception(f"Create token with VAULT reward error: {str(e)}")

    def mint_vault_reward(self, recipient_wallet: str, amount: float, reason: str, asset_id: str = None) -> str:
        """Mint VAULT tokens as rewards"""
        try:
            if not BLOCKCHAIN_ENABLED:
                return f"mock_vault_reward_{str(uuid.uuid4())[:8]}"
            
            # Get platform VAULT token
            vault_token_result = self.supabase.table('tokens').select('*').eq('token_type', 'platform').execute()
            
            if not vault_token_result.data:
                raise Exception("VAULT platform token not found - create it first")
            
            vault_token = vault_token_result.data[0]
            
            # Convert amount to token units (9 decimals for VAULT)
            token_amount = int(amount * (10 ** vault_token['decimals']))
            
            print(f"🪙 Minting {amount} VAULT reward ({reason}) to {recipient_wallet}")
            
            # Mint VAULT tokens
            mint_tx = self.solana.mint_tokens_to_wallet(
                self.platform_keypair,
                vault_token['mint_address'],
                recipient_wallet,
                token_amount
            )
            
            return mint_tx
            
        except Exception as e:
            raise Exception(f"Mint VAULT reward error: {str(e)}")

    def mint_fractional_tokens(self, token_id: str, recipient_wallet: str, amount: float) -> str:
        """Mint fractional tokens to recipient"""
        try:
            if not BLOCKCHAIN_ENABLED:
                raise Exception("Blockchain features not enabled")
            
            token = self.get_token_by_id(token_id)
            if not token:
                raise Exception("Token not found")
            
            if not token.get('is_blockchain_token'):
                raise Exception("Token is not a blockchain token")
            
            if not self.solana.validate_wallet_address(recipient_wallet):
                raise Exception("Invalid recipient wallet address")
            
            # Convert to token units
            token_amount = int(amount * (10 ** token['decimals']))
            
            print(f"🪙 Minting {amount} fractional tokens to {recipient_wallet}")
            
            mint_tx = self.solana.mint_tokens_to_wallet(
                self.platform_keypair,
                token['mint_address'],
                recipient_wallet,
                token_amount
            )
            
            return mint_tx
        except Exception as e:
            raise Exception(f"Mint fractional tokens error: {str(e)}")
    
    def get_wallet_tokens(self, wallet_address: str) -> List[Dict[str, Any]]:
        """Get tokens in wallet from blockchain"""
        try:
            if not BLOCKCHAIN_ENABLED:
                return []
            
            if not self.solana.validate_wallet_address(wallet_address):
                raise Exception("Invalid wallet address")
            
            token_accounts = self.solana.get_token_accounts(wallet_address)
            
            wallet_tokens = []
            for account in token_accounts:
                try:
                    account_data = account['account']['data']['parsed']['info']
                    mint_address = account_data['mint']
                    balance = float(account_data['tokenAmount']['uiAmount'] or 0)
                    
                    if balance > 0:
                        # Get token metadata from database
                        token_result = self.supabase.table('tokens').select(
                            '*, assets(*)'
                        ).eq('mint_address', mint_address).execute()
                        
                        if token_result.data:
                            token_info = token_result.data[0]
                            token_info['balance'] = balance
                            token_info['token_account'] = account['pubkey']
                            wallet_tokens.append(token_info)
                        else:
                            # Unknown token
                            wallet_tokens.append({
                                'mint_address': mint_address,
                                'balance': balance,
                                'token_account': account['pubkey'],
                                'unknown_token': True,
                                'name': f"Unknown Token ({mint_address[:8]}...)"
                            })
                except Exception as e:
                    print(f"Error processing token: {e}")
                    continue
            
            return wallet_tokens
        except Exception as e:
            raise Exception(f"Get wallet tokens error: {str(e)}")
    
    def get_all_tokens(self) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('tokens').select('*, assets(name, description, valuation)').execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get tokens error: {str(e)}")
    
    def get_token_by_id(self, token_id: str) -> Dict[str, Any]:
        try:
            result = self.supabase.table('tokens').select('*, assets(*)').eq('id', token_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Get token error: {str(e)}")
    
    def get_tokens_by_asset(self, asset_id: str) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('tokens').select('*').eq('asset_id', asset_id).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get tokens by asset error: {str(e)}")
    
    def fractionalize_token(self, token_id: str, total_supply: int) -> Dict[str, Any]:
        try:
            update_data = {
                'token_type': 'fractional',
                'total_supply': total_supply,
                'decimals': 6,
                'is_fractionalized': True
            }
            
            result = self.supabase.table('tokens').update(update_data).eq('id', token_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Fractionalize token error: {str(e)}")
    
    def get_token_owners(self, token_id: str) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('token_ownerships').select(
                '*, users(username, email, wallet_address)'
            ).eq('token_id', token_id).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get token owners error: {str(e)}")
    
    def add_ownership(self, token_id: str, owner_id: str, percentage: float, price: float = 0) -> Dict[str, Any]:
        try:
            ownership_data = {
                'id': str(uuid.uuid4()),
                'token_id': token_id,
                'owner_id': owner_id,
                'percentage': percentage,
                'acquisition_price': price,
                'acquired_at': datetime.now().isoformat()
            }
            
            result = self.supabase.table('token_ownerships').insert(ownership_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Add ownership error: {str(e)}")
    
    def get_user_tokens(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all tokens created by a specific user"""
        try:
            # Get tokens where the asset owner is the user
            result = self.supabase.table('tokens').select(
                '*, assets(name, description, valuation, category, owner_id, image_url)'
            ).eq('assets.owner_id', user_id).execute()
            
            return result.data
        except Exception as e:
            raise Exception(f"Get user tokens error: {str(e)}")
    
    def award_vault_coins(self, user_id: str, amount: int) -> Dict[str, Any]:
        """Award VAULT coins to a user for tokenizing an asset"""
        try:
            # Check if user has a vault_balance record
            balance_result = self.supabase.table('vault_balances').select('*').eq('user_id', user_id).execute()
            
            if balance_result.data:
                # Update existing balance
                current_balance = balance_result.data[0]['balance']
                new_balance = current_balance + amount
                
                self.supabase.table('vault_balances').update({
                    'balance': new_balance,
                    'updated_at': datetime.now().isoformat()
                }).eq('user_id', user_id).execute()
            else:
                # Create new balance record
                balance_data = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'balance': amount,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                self.supabase.table('vault_balances').insert(balance_data).execute()
            
            # Record the reward transaction
            reward_data = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'amount': amount,
                'reason': 'asset_tokenization',
                'created_at': datetime.now().isoformat()
            }
            
            reward_result = self.supabase.table('vault_rewards').insert(reward_data).execute()
            
            return {
                'amount': amount,
                'new_balance': balance_result.data[0]['balance'] + amount if balance_result.data else amount,
                'reward_id': reward_result.data[0]['id'] if reward_result.data else None
            }
        except Exception as e:
            print(f"Error awarding VAULT coins: {str(e)}")
            # Return a mock reward if database fails
            return {
                'amount': amount,
                'new_balance': amount,
                'reward_id': str(uuid.uuid4()),
                'mock': True
            }
    
    def update_token_metadata(self, token_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            result = self.supabase.table('tokens').update(data).eq('id', token_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Update token metadata error: {str(e)}")

    def create_property_token(self, asset_id: str, property_name: str, total_shares: int, price_per_share_usd: float) -> Dict[str, Any]:
        """Create SPL token for a specific property (no platform currency needed)"""
        try:
            # Create property-specific token symbol
            # "Miami Beach House" → "MBH"
            symbol = ''.join([word[0] for word in property_name.split()[:3]]).upper()
            
            print(f"🏠 Creating property token: {property_name} ({symbol})")
            print(f"📊 {total_shares:,} shares at ${price_per_share_usd} each")
            
            if BLOCKCHAIN_ENABLED and self.platform_keypair:
                # Create SPL token on Solana for this specific property
                blockchain_result = self.solana.create_spl_token(
                    self.platform_keypair,
                    decimals=0,  # Whole shares only (1 token = 1 share)
                    initial_supply=total_shares
                )
                
                mint_address = blockchain_result['mint_address']
                is_blockchain_token = True
            else:
                mint_address = f"mock_{symbol}_{str(uuid.uuid4())[:8]}"
                is_blockchain_token = False
            
            # Store property token
            token_data = {
                'id': str(uuid.uuid4()),
                'asset_id': asset_id,
                'name': f"{property_name} Shares",
                'symbol': symbol,
                'mint_address': mint_address,
                'token_type': 'property_shares',
                'total_supply': total_shares,
                'available_shares': total_shares,
                'price_per_share_usd': price_per_share_usd,
                'decimals': 0,
                'is_fractionalized': True,
                'is_blockchain_token': is_blockchain_token,
                'created_at': datetime.now().isoformat()
            }
            
            result = self.supabase.table('property_tokens').insert(token_data).execute()
            return result.data[0] if result.data else None
            
        except Exception as e:
            raise Exception(f"Create property token error: {str(e)}")

    def buy_property_shares_with_sol(self, user_wallet: str, token_id: str, shares_to_buy: int, sol_amount: float) -> str:
        """User buys property shares by paying SOL"""
        try:
            # Get property token info
            token = self.get_token_by_id(token_id)
            if not token:
                raise Exception("Property token not found")
            
            if shares_to_buy > token['available_shares']:
                raise Exception(f"Only {token['available_shares']} shares available")
            
            # Calculate required SOL (you'd get real SOL/USD price from an API)
            usd_cost = shares_to_buy * token['price_per_share_usd']
            sol_price_usd = 100  # Example: 1 SOL = $100 (get from API)
            required_sol = usd_cost / sol_price_usd
            
            if sol_amount < required_sol:
                raise Exception(f"Need {required_sol:.4f} SOL, got {sol_amount:.4f}")
            
            print(f"💰 User buying {shares_to_buy} shares for {sol_amount:.4f} SOL")
            
            if token.get('is_blockchain_token'):
                # Mint property tokens to user's wallet on Solana
                mint_tx = self.solana.mint_tokens_to_wallet(
                    self.platform_keypair,
                    token['mint_address'],
                    user_wallet,
                    shares_to_buy  # No decimals, so 1 token = 1 share
                )
            else:
                mint_tx = f"mock_mint_{str(uuid.uuid4())[:8]}"
            
            # Update available shares
            new_available = token['available_shares'] - shares_to_buy
            self.supabase.table('property_tokens').update({
                'available_shares': new_available
            }).eq('id', token_id).execute()
            
            # Record the purchase
            purchase_data = {
                'id': str(uuid.uuid4()),
                'user_wallet': user_wallet,
                'token_id': token_id,
                'shares_purchased': shares_to_buy,
                'sol_paid': sol_amount,
                'usd_value': usd_cost,
                'mint_tx': mint_tx,
                'purchase_date': datetime.now().isoformat()
            }
            
            self.supabase.table('property_purchases').insert(purchase_data).execute()
            
            return mint_tx
            
        except Exception as e:
            raise Exception(f"Buy property shares error: {str(e)}")

    def buy_shares_with_vault_rewards(self, user_wallet: str, token_id: str, shares_to_buy: int, payment_amount: float) -> Dict[str, Any]:
        """Buy asset shares and receive proportional VAULT rewards"""
        try:
            # Get asset token info
            token_result = self.supabase.table('tokens').select(
                '*, assets(name, valuation)'
            ).eq('id', token_id).execute()
            
            if not token_result.data:
                raise Exception("Asset token not found")
            
            token = token_result.data[0]
            asset = token['assets']
            
            # Calculate purchase percentage
            purchase_percentage = (shares_to_buy / token['total_supply']) * 100
            
            # Calculate VAULT reward based on percentage purchased
            vault_reward_amount = (purchase_percentage / 100) * 100
            
            print(f"💰 User buying {shares_to_buy} shares ({purchase_percentage:.2f}%)")
            print(f"🎁 VAULT reward: {vault_reward_amount:.2f} tokens")
            
            # Mint the fractional asset tokens
            asset_mint_tx = self.mint_fractional_tokens(
                token_id=token_id,
                recipient_wallet=user_wallet,
                amount=shares_to_buy
            )
            
            # Mint VAULT reward tokens
            vault_reward_tx = self.mint_vault_reward(
                recipient_wallet=user_wallet,
                amount=vault_reward_amount,
                reason="asset_purchase",
                asset_id=token['asset_id']
            )
            
            # Record the complete transaction
            purchase_data = {
                'id': str(uuid.uuid4()),
                'user_wallet': user_wallet,
                'token_id': token_id,
                'asset_name': asset['name'],
                'shares_purchased': shares_to_buy,
                'purchase_percentage': purchase_percentage,
                'payment_amount': payment_amount,
                'vault_reward_amount': vault_reward_amount,
                'asset_mint_tx': asset_mint_tx,
                'vault_reward_tx': vault_reward_tx,
                'purchase_date': datetime.now().isoformat()
            }
            
            # Store in purchases table
            self.supabase.table('asset_purchases_with_rewards').insert(purchase_data).execute()
            
            # Store VAULT reward record
            reward_data = {
                'id': str(uuid.uuid4()),
                'user_wallet': user_wallet,
                'reward_type': 'asset_purchase',
                'vault_amount': vault_reward_amount,
                'asset_id': token['asset_id'],
                'token_id': token_id,
                'transaction_id': vault_reward_tx,
                'purchase_percentage': purchase_percentage,
                'created_at': datetime.now().isoformat()
            }
            
            self.supabase.table('vault_rewards').insert(reward_data).execute()
            
            print(f"✅ Purchase complete! Asset TX: {asset_mint_tx}, VAULT Reward TX: {vault_reward_tx}")
            
            return {
                'purchase_data': purchase_data,
                'asset_mint_tx': asset_mint_tx,
                'vault_reward_tx': vault_reward_tx,
                'vault_reward_amount': vault_reward_amount
            }
            
        except Exception as e:
            raise Exception(f"Buy shares with VAULT rewards error: {str(e)}")

    def get_user_vault_balance(self, wallet_address: str) -> float:
        """Get user's total VAULT token balance"""
        try:
            vault_token_result = self.supabase.table('tokens').select('mint_address').eq('token_type', 'platform').execute()
            
            if not vault_token_result.data:
                return 0.0
            
            vault_mint = vault_token_result.data[0]['mint_address']
            
            if BLOCKCHAIN_ENABLED and self.solana:
                balance = self.solana.get_token_balance(wallet_address, vault_mint)
                return balance
            else:
                # Mock mode - sum from rewards table
                rewards_result = self.supabase.table('vault_rewards').select('vault_amount').eq('user_wallet', wallet_address).execute()
                return sum(reward['vault_amount'] for reward in rewards_result.data)
                
        except Exception as e:
            print(f"Error getting VAULT balance: {e}")
            return 0.0

    def get_vault_reward_history(self, wallet_address: str) -> List[Dict[str, Any]]:
        """Get user's VAULT reward earning history"""
        try:
            result = self.supabase.table('vault_rewards').select(
                '*, assets(name), tokens(mint_address)'
            ).eq('user_wallet', wallet_address).order('created_at', desc=True).execute()
            
            return result.data
            
        except Exception as e:
            raise Exception(f"Get VAULT reward history error: {str(e)}")