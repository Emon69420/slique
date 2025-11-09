from flask import Blueprint, request, jsonify, current_app
from services.asset_service import AssetService
from services.auth_service import AuthService
from middleware.validation import validate_json

assets_bp = Blueprint('assets', __name__)

@assets_bp.route('/assets', methods=['POST'])
@validate_json(['name', 'owner_id'])
def create_asset():
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        asset_service = AssetService(current_app.config['SUPABASE'])
        asset = asset_service.create_asset(data)
        
        return jsonify({
            "success": True,
            "message": "Asset created successfully", 
            "data": asset
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@assets_bp.route('/assets', methods=['GET'])
def get_all_assets():
    try:
        asset_service = AssetService(current_app.config['SUPABASE'])
        assets = asset_service.get_all_assets()
        
        return jsonify({
            "success": True,
            "data": assets,
            "count": len(assets)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@assets_bp.route('/assets/<asset_id>', methods=['GET'])
def get_asset(asset_id):
    try:
        asset_service = AssetService(current_app.config['SUPABASE'])
        asset = asset_service.get_asset_by_id(asset_id)
        
        if not asset:
            return jsonify({"success": False, "error": "Asset not found"}), 404
        
        return jsonify({
            "success": True,
            "data": asset
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@assets_bp.route('/assets/user/<user_id>', methods=['GET'])
def get_user_assets(user_id):
    try:
        asset_service = AssetService(current_app.config['SUPABASE'])
        assets = asset_service.get_user_assets(user_id)
        
        return jsonify({
            "success": True,
            "data": assets,
            "count": len(assets)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@assets_bp.route('/assets/<asset_id>', methods=['PUT'])
def update_asset(asset_id):
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        asset_service = AssetService(current_app.config['SUPABASE'])
        asset = asset_service.update_asset(asset_id, data)
        
        if not asset:
            return jsonify({"success": False, "error": "Asset not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Asset updated successfully",
            "data": asset
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@assets_bp.route('/assets/<asset_id>/tokenize', methods=['POST'])
def tokenize_asset(asset_id):
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        # Get wallet address from request body
        data = request.get_json() or {}
        owner_wallet_address = data.get('wallet_address')
        
        from services.token_service import TokenService
        
        asset_service = AssetService(current_app.config['SUPABASE'])
        token_service = TokenService(current_app.config['SUPABASE'])
        
        # Get the asset
        asset = asset_service.get_asset_by_id(asset_id)
        if not asset:
            return jsonify({"success": False, "error": "Asset not found"}), 404
        
        # Create token from asset with 100 total supply
        # Each token = 1% ownership, so 5 tokens = 5% ownership
        token_data = {
            'asset_id': asset_id,
            'owner_id': asset['owner_id'],
            'owner_wallet_address': owner_wallet_address,  # Attach wallet address
            'name': asset['name'],
            'symbol': asset['name'][:4].upper(),  # First 4 letters as symbol
            'total_supply': 100,  # 100 tokens = 100% ownership
            'decimals': 0  # No decimal places, whole tokens only
        }
        
        token = token_service.create_token(token_data)
        
        # Award 100 VAULT coins to user
        vault_reward = token_service.award_vault_coins(asset['owner_id'], 100)
        
        return jsonify({
            "success": True,
            "message": f"Asset tokenized into 100 tokens! Each token = 1% ownership. You earned 100 VAULT coins!",
            "data": token,
            "vault_reward": vault_reward,
            "ownership_info": {
                "total_tokens": 100,
                "per_token_percentage": 1.0,
                "example": "Buy 5 tokens = 5% ownership"
            }
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400