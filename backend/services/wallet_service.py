from supabase import Client
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
import requests

class WalletService:
    def __init__(self, supabase: Client, token_service=None):
        self.supabase = supabase
        self.token_service = token_service
    
    def register_user_with_wallet(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Register new user with their first wallet"""
        try:
            # Check if user with email already exists
            existing_user = self.supabase.table('users').select('*').eq('email', user_data['email']).execute()
            if existing_user.data:
                raise Exception("User with this email already exists")
            
            # Check if wallet is already registered
            existing_wallet = self.supabase.table('user_wallets').select('*').eq('wallet_address', user_data['wallet_address']).execute()
            if existing_wallet.data:
                raise Exception("This wallet is already registered")
            
            # Create user first
            user_record = {
                'id': str(uuid.uuid4()),
                'username': user_data.get('username'),
                'email': user_data.get('email'),
                'display_name': user_data.get('display_name', user_data.get('username')),
                'created_at': datetime.now().isoformat()
            }
            
            user_result = self.supabase.table('users').insert(user_record).execute()
            
            if not user_result.data:
                raise Exception("Failed to create user")
            
            user = user_result.data[0]
            
            # Create wallet linked to user
            wallet_record = {
                'id': str(uuid.uuid4()),
                'user_id': user['id'],
                'wallet_address': user_data['wallet_address'],
                'wallet_type': user_data.get('wallet_type', 'phantom'),
                'nickname': user_data.get('nickname', 'Primary Wallet'),
                'is_primary': True,
                'first_connected': datetime.now().isoformat(),
                'last_connected': datetime.now().isoformat(),
                'connection_count': 1
            }
            
            wallet_result = self.supabase.table('user_wallets').insert(wallet_record).execute()
            
            if not wallet_result.data:
                raise Exception("Failed to create wallet")
            
            wallet = wallet_result.data[0]
            
            # Give welcome bonus
            welcome_bonus = self._give_welcome_bonus(user['id'], wallet['id'], wallet['wallet_address'])
            
            return {
                'user': user,
                'wallet': wallet,
                'welcome_bonus': welcome_bonus,
                'message': f'Account created! Welcome bonus: {welcome_bonus["amount"]} VAULT'
            }
            
        except Exception as e:
            raise Exception(f"Register user error: {str(e)}")
    
    def connect_existing_wallet(self, wallet_address: str) -> Dict[str, Any]:
        """Connect existing wallet"""
        try:
            wallet_result = self.supabase.table('user_wallets').select(
                '*, users(*)'
            ).eq('wallet_address', wallet_address).execute()
            
            if not wallet_result.data:
                raise Exception("Wallet not found. Please register first.")
            
            wallet = wallet_result.data[0]
            
            # Update connection info
            self.supabase.table('user_wallets').update({
                'last_connected': datetime.now().isoformat(),
                'connection_count': wallet.get('connection_count', 0) + 1
            }).eq('wallet_address', wallet_address).execute()
            
            return {
                'user': wallet['users'],
                'wallet': wallet,
                'message': f'Welcome back, {wallet["users"]["display_name"]}!'
            }
            
        except Exception as e:
            raise Exception(f"Connect wallet error: {str(e)}")
    
    def add_wallet_to_user(self, user_id: str, wallet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add additional wallet to existing user"""
        try:
            # Check if user exists
            user_result = self.supabase.table('users').select('*').eq('id', user_id).execute()
            if not user_result.data:
                raise Exception("User not found")
            
            # Check if wallet already exists
            existing_wallet = self.supabase.table('user_wallets').select('*').eq('wallet_address', wallet_data['wallet_address']).execute()
            if existing_wallet.data:
                raise Exception("This wallet is already registered")
            
            # Create new wallet for user
            wallet_record = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'wallet_address': wallet_data['wallet_address'],
                'wallet_type': wallet_data.get('wallet_type', 'phantom'),
                'nickname': wallet_data.get('nickname', f"{wallet_data.get('wallet_type', 'phantom').title()} Wallet"),
                'is_primary': False,  # Additional wallets are not primary
                'first_connected': datetime.now().isoformat(),
                'last_connected': datetime.now().isoformat(),
                'connection_count': 1
            }
            
            wallet_result = self.supabase.table('user_wallets').insert(wallet_record).execute()
            
            if not wallet_result.data:
                raise Exception("Failed to add wallet")
            
            return wallet_result.data[0]
            
        except Exception as e:
            raise Exception(f"Add wallet error: {str(e)}")
    
    def _give_welcome_bonus(self, user_id: str, wallet_id: str, wallet_address: str) -> Dict[str, Any]:
        """Give welcome bonus with full tracking"""
        try:
            if not self.token_service:
                return {'amount': 0, 'tx': None}
            
            # Mint VAULT welcome bonus
            bonus_tx = self.token_service.mint_vault_reward(
                recipient_wallet=wallet_address,
                amount=50,
                reason="welcome_bonus"
            )
            
            # Record detailed reward
            reward_data = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'user_wallet_id': wallet_id,
                'user_wallet_address': wallet_address,
                'reward_type': 'welcome_bonus',
                'vault_amount': 50,
                'reason': 'New user registration bonus',
                'blockchain_tx': bonus_tx,
                'created_at': datetime.now().isoformat()
            }
            
            self.supabase.table('vault_rewards').insert(reward_data).execute()
            
            return {'amount': 50, 'tx': bonus_tx, 'message': 'Welcome bonus sent!'}
            
        except Exception as e:
            print(f"Welcome bonus failed: {e}")
            return {'amount': 0, 'tx': None}
    
    def buy_asset_with_complete_tracking(self, purchase_data: Dict[str, Any]) -> Dict[str, Any]:
        """Buy asset with complete user and transaction tracking"""
        try:
            wallet_address = purchase_data['wallet_address']
            token_id = purchase_data['token_id']
            shares_to_buy = purchase_data['shares_to_buy']
            payment_method = purchase_data.get('payment_method', 'sol')
            payment_amount = purchase_data['payment_amount']
            
            # Get buyer wallet info with user
            wallet_result = self.supabase.table('user_wallets').select(
                '*, users(*)'
            ).eq('wallet_address', wallet_address).execute()
            
            if not wallet_result.data:
                raise Exception("Wallet not found. Please register first.")
            
            buyer_wallet = wallet_result.data[0]
            buyer_user = buyer_wallet['users']
            
            # Get asset token info
            token_result = self.supabase.table('tokens').select(
                '*, assets(*)'
            ).eq('id', token_id).execute()
            
            if not token_result.data:
                raise Exception("Asset not found")
            
            token = token_result.data[0]
            asset = token['assets']
            
            # Calculate transaction details
            share_price_usd = asset['valuation'] / token['total_supply']
            total_cost_usd = share_price_usd * shares_to_buy
            purchase_percentage = (shares_to_buy / token['total_supply']) * 100
            vault_reward_amount = (purchase_percentage / 100) * 100
            
            print(f"🛒 Processing purchase for user {buyer_user['display_name']}")
            print(f"📦 Asset: {asset['name']} | Shares: {shares_to_buy}")
            print(f"💰 Cost: ${total_cost_usd:.2f} | VAULT Reward: {vault_reward_amount:.2f}")
            
            # Process payment (simplified for now)
            payment_tx = f"{payment_method}_payment_{str(uuid.uuid4())[:8]}"
            
            # Mint asset tokens to buyer
            asset_mint_tx = self.token_service.mint_fractional_tokens(
                token_id=token_id,
                recipient_wallet=wallet_address,
                amount=shares_to_buy
            )
            
            # Mint VAULT reward
            vault_reward_tx = self.token_service.mint_vault_reward(
                recipient_wallet=wallet_address,
                amount=vault_reward_amount,
                reason="asset_purchase",
                asset_id=asset['id']
            )
            
            # Create complete transaction record using new asset_transactions table
            transaction_data = {
                'id': str(uuid.uuid4()),
                'transaction_type': 'purchase',
                
                # Asset Info
                'asset_id': asset['id'],
                'token_id': token_id,
                'asset_name': asset['name'],
                'asset_category': asset.get('category'),
                
                # Buyer Info (from platform)
                'buyer_user_id': buyer_user['id'],
                'buyer_wallet_id': buyer_wallet['id'],
                'buyer_wallet_address': wallet_address,
                
                # Seller Info (NULL for primary purchase from platform)
                'seller_user_id': None,
                'seller_wallet_id': None,
                'seller_wallet_address': None,
                
                # Transaction Details
                'shares_amount': shares_to_buy,
                'share_price_usd': share_price_usd,
                'total_cost_usd': total_cost_usd,
                'purchase_percentage': purchase_percentage,
                
                # Payment Info
                'payment_method': payment_method,
                'payment_amount': payment_amount,
                'payment_tx': payment_tx,
                
                # VAULT Rewards
                'vault_reward_amount': vault_reward_amount,
                'vault_reward_tx': vault_reward_tx,
                
                # Blockchain Transactions
                'asset_mint_tx': asset_mint_tx,
                
                'transaction_date': datetime.now().isoformat(),
                'status': 'completed'
            }
            
            # Store transaction
            transaction_result = self.supabase.table('asset_transactions').insert(transaction_data).execute()
            transaction_record = transaction_result.data[0]
            
            # Store VAULT reward record
            reward_data = {
                'id': str(uuid.uuid4()),
                'user_id': buyer_user['id'],
                'user_wallet_id': buyer_wallet['id'],
                'user_wallet_address': wallet_address,
                'reward_type': 'asset_purchase',
                'vault_amount': vault_reward_amount,
                'reason': f'Purchase reward for {asset["name"]}',
                'asset_id': asset['id'],
                'token_id': token_id,
                'transaction_id': transaction_record['id'],
                'blockchain_tx': vault_reward_tx,
                'created_at': datetime.now().isoformat()
            }
            
            self.supabase.table('vault_rewards').insert(reward_data).execute()
            
            # Asset ownership is automatically updated by database trigger
            
            return {
                'success': True,
                'transaction': transaction_record,
                'buyer': {
                    'user_id': buyer_user['id'],
                    'username': buyer_user['display_name'],
                    'wallet_address': wallet_address
                },
                'asset': {
                    'name': asset['name'],
                    'shares_purchased': shares_to_buy,
                    'ownership_percentage': purchase_percentage
                },
                'rewards': {
                    'vault_amount': vault_reward_amount,
                    'vault_tx': vault_reward_tx
                },
                'blockchain': {
                    'asset_mint_tx': asset_mint_tx,
                    'vault_reward_tx': vault_reward_tx
                }
            }
            
        except Exception as e:
            raise Exception(f"Buy asset with tracking error: {str(e)}")
    
    def get_user_complete_profile(self, user_id: str = None, wallet_address: str = None) -> Dict[str, Any]:
        """Get complete user profile with all transactions and ownership"""
        try:
            # Get user and wallets
            if user_id:
                user_result = self.supabase.table('users').select('*').eq('id', user_id).execute()
                wallets_result = self.supabase.table('user_wallets').select('*').eq('user_id', user_id).execute()
            elif wallet_address:
                wallet_result = self.supabase.table('user_wallets').select(
                    '*, users(*)'
                ).eq('wallet_address', wallet_address).execute()
                
                if not wallet_result.data:
                    raise Exception("Wallet not found")
                
                user_result = {'data': [wallet_result.data[0]['users']]}
                wallets_result = {'data': [wallet_result.data[0]]}
                user_id = user_result['data'][0]['id']
            else:
                raise Exception("Either user_id or wallet_address required")
            
            if not user_result['data']:
                raise Exception("User not found")
            
            user = user_result['data'][0]
            wallets = wallets_result['data']
            primary_wallet = next((w for w in wallets if w['is_primary']), wallets[0] if wallets else None)
            
            # Get all transactions
            transactions_result = self.supabase.table('asset_transactions').select(
                '*, assets(name, category), tokens(mint_address)'
            ).eq('buyer_user_id', user_id).order('transaction_date', desc=True).execute()
            
            # Get all VAULT rewards
            vault_rewards_result = self.supabase.table('vault_rewards').select(
                '*, assets(name)'
            ).eq('user_id', user_id).order('created_at', desc=True).execute()
            
            # Get asset ownership
            ownership_result = self.supabase.table('asset_ownership').select(
                '*, assets(name, category, valuation), tokens(mint_address)'
            ).eq('user_id', user_id).execute()
            
            # Calculate totals
            total_invested = sum(t['total_cost_usd'] for t in transactions_result.data)
            total_vault_earned = sum(r['vault_amount'] for r in vault_rewards_result.data)
            total_assets_owned = len(ownership_result.data)
            
            return {
                'user': user,
                'wallets': wallets,
                'primary_wallet': primary_wallet,
                'stats': {
                    'total_transactions': len(transactions_result.data),
                    'total_invested_usd': total_invested,
                    'total_vault_earned': total_vault_earned,
                    'total_assets_owned': total_assets_owned
                },
                'transactions': transactions_result.data,
                'vault_rewards': vault_rewards_result.data,
                'asset_ownership': ownership_result.data
            }
            
        except Exception as e:
            raise Exception(f"Get user profile error: {str(e)}")
    
    def get_marketplace_for_wallet(self, wallet_address: str = None) -> List[Dict[str, Any]]:
        """Get marketplace with wallet-specific info"""
        try:
            # Get all available tokens
            tokens_result = self.supabase.table('tokens').select(
                '*, assets(name, description, category, valuation, image_url)'
            ).neq('asset_id', None).execute()  # Exclude platform tokens
            
            marketplace_items = []
            user_ownership = {}
            
            # If wallet provided, get user's ownership data
            if wallet_address:
                wallet_result = self.supabase.table('user_wallets').select('user_id').eq('wallet_address', wallet_address).execute()
                if wallet_result.data:
                    user_id = wallet_result.data[0]['user_id']
                    ownership_result = self.supabase.table('asset_ownership').select('*').eq('user_id', user_id).execute()
                    user_ownership = {o['asset_id']: o for o in ownership_result.data}
            
            for token in tokens_result.data:
                asset = token['assets']
                
                # Calculate pricing
                share_price_usd = asset['valuation'] / token['total_supply'] if token['total_supply'] > 0 else 0
                sol_price = self._get_sol_price()
                share_price_sol = share_price_usd / sol_price
                
                # Check user ownership
                ownership = user_ownership.get(asset['id'], {})
                user_shares = ownership.get('shares_owned', 0)
                user_percentage = ownership.get('ownership_percentage', 0)
                
                marketplace_item = {
                    'token_id': token['id'],
                    'asset_id': asset['id'],
                    'asset_name': asset['name'],
                    'asset_description': asset['description'],
                    'asset_category': asset['category'],
                    'asset_image': asset.get('image_url'),
                    'asset_valuation': asset['valuation'],
                    'token_symbol': token.get('symbol', 'AST'),
                    'total_shares': token['total_supply'],
                    'share_price_usd': round(share_price_usd, 2),
                    'share_price_sol': round(share_price_sol, 4),
                    'min_investment_usd': round(share_price_usd, 2),
                    'min_investment_sol': round(share_price_sol, 4),
                    'user_ownership': user_shares,
                    'ownership_percentage': round(user_percentage, 4),
                    'can_afford_sol': True,  # You could check user's SOL balance here
                    'vault_reward_estimate': round((1 / token['total_supply']) * 100, 4)  # VAULT reward for buying 1 share
                }
                
                marketplace_items.append(marketplace_item)
            
            return marketplace_items
            
        except Exception as e:
            raise Exception(f"Get marketplace error: {str(e)}")
    
    def _get_sol_price(self) -> float:
        """Get current SOL/USD price"""
        try:
            response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', timeout=5)
            return response.json()['solana']['usd']
        except:
            return 100.0  # Fallback price