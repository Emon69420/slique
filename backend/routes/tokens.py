from flask import Blueprint, request, jsonify, current_app
from services.token_service import TokenService
from middleware.validation import validate_json

tokens_bp = Blueprint('tokens', __name__)

# Blockchain status endpoint
@tokens_bp.route('/blockchain-status', methods=['GET'])
def get_blockchain_status():
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        status = token_service.get_blockchain_status()
        
        return jsonify({
            "success": True,
            "data": status
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens', methods=['POST'])
@validate_json(['asset_id'])  # Remove mint_address - blockchain will generate it
def create_token():
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        token_service = TokenService(current_app.config['SUPABASE'])
        token = token_service.create_token(data)
        
        message = "Real SPL token created on Solana blockchain!" if token.get('is_blockchain_token') else "Token created in database"
        
        return jsonify({
            "success": True,
            "message": message,
            "data": token,
            "explorer_url": f"https://explorer.solana.com/address/{token['mint_address']}?cluster=devnet" if token.get('is_blockchain_token') else None
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# Create VaultHive platform token (VAULT)
@tokens_bp.route('/platform-token', methods=['POST'])
def create_platform_token():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        token_service = TokenService(current_app.config['SUPABASE'])
        
        # Create VAULT token with 1 billion supply
        vault_token = token_service.create_platform_token(
            name="VaultHive Token",
            symbol="VAULT", 
            decimals=9,
            supply=1_000_000_000  # 1 billion tokens
        )
        
        return jsonify({
            "success": True,
            "message": "VaultHive platform token (VAULT) created on Solana!",
            "data": vault_token,
            "explorer_url": f"https://explorer.solana.com/address/{vault_token['mint_address']}?cluster=devnet"
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# Mint platform tokens to users
@tokens_bp.route('/platform-token/mint', methods=['POST'])
@validate_json(['recipient_wallet', 'amount'])
def mint_platform_tokens(token_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        token_service = TokenService(current_app.config['SUPABASE'])
        
        mint_tx = token_service.mint_platform_tokens(
            data['recipient_wallet'],
            data['amount']
        )
        
        return jsonify({
            "success": True,
            "message": f"Minted {data['amount']} VAULT tokens",
            "transaction_signature": mint_tx,
            "explorer_url": f"https://explorer.solana.com/tx/{mint_tx}?cluster=devnet"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# Get wallet tokens from blockchain
@tokens_bp.route('/wallets/<wallet_address>/tokens', methods=['GET'])
def get_wallet_tokens(wallet_address):
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        tokens = token_service.get_wallet_tokens(wallet_address)
        
        return jsonify({
            "success": True,
            "data": tokens,
            "count": len(tokens),
            "message": "Tokens fetched directly from Solana blockchain"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# Mint fractional tokens
@tokens_bp.route('/tokens/<token_id>/mint-fractional', methods=['POST'])
@validate_json(['recipient_wallet', 'amount'])
def mint_fractional_tokens(token_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        token_service = TokenService(current_app.config['SUPABASE'])
        
        mint_tx = token_service.mint_fractional_tokens(
            token_id,
            data['recipient_wallet'],
            data['amount']
        )
        
        return jsonify({
            "success": True,
            "message": f"Minted {data['amount']} fractional tokens on blockchain",
            "transaction_signature": mint_tx,
            "explorer_url": f"https://explorer.solana.com/tx/{mint_tx}?cluster=devnet"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens', methods=['GET'])
def get_all_tokens():
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        tokens = token_service.get_all_tokens()
        
        return jsonify({
            "success": True,
            "data": tokens,
            "count": len(tokens)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/user/<user_id>', methods=['GET'])
def get_user_tokens(user_id):
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        tokens = token_service.get_user_tokens(user_id)
        
        return jsonify({
            "success": True,
            "data": tokens,
            "count": len(tokens)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/<token_id>', methods=['GET'])
def get_token(token_id):
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        token = token_service.get_token_by_id(token_id)
        
        if not token:
            return jsonify({"success": False, "error": "Token not found"}), 404
        
        # Add blockchain explorer link
        if token.get('is_blockchain_token') and token.get('mint_address'):
            token['explorer_url'] = f"https://explorer.solana.com/address/{token['mint_address']}?cluster=devnet"
        
        return jsonify({
            "success": True,
            "data": token
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/asset/<asset_id>', methods=['GET'])
def get_tokens_by_asset(asset_id):
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        tokens = token_service.get_tokens_by_asset(asset_id)
        
        return jsonify({
            "success": True,
            "data": tokens,
            "count": len(tokens)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/<token_id>/fractionalize', methods=['POST'])
@validate_json(['total_supply'])
def fractionalize_token(token_id):
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        token_service = TokenService(current_app.config['SUPABASE'])
        token = token_service.fractionalize_token(token_id, data['total_supply'])
        
        if not token:
            return jsonify({"success": False, "error": "Token not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Token fractionalized successfully",
            "data": token
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/<token_id>/owners', methods=['GET'])
def get_token_owners(token_id):
    try:
        token_service = TokenService(current_app.config['SUPABASE'])
        owners = token_service.get_token_owners(token_id)
        
        return jsonify({
            "success": True,
            "data": owners,
            "count": len(owners)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/<token_id>/add-owner', methods=['POST'])
@validate_json(['owner_id', 'percentage'])
def add_token_owner(token_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        token_service = TokenService(current_app.config['SUPABASE'])
        ownership = token_service.add_ownership(
            token_id, 
            data['owner_id'], 
            data['percentage'],
            data.get('price', 0)
        )
        
        return jsonify({
            "success": True,
            "message": "Ownership added successfully",
            "data": ownership
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@tokens_bp.route('/tokens/<token_id>/metadata', methods=['PUT'])
def update_token_metadata(token_id):
    try:
        data = request.get_json()
        token_service = TokenService(current_app.config['SUPABASE'])
        updated_token = token_service.update_token_metadata(token_id, data)
        return jsonify({"success": True, "token": updated_token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400