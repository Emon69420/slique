from flask import Blueprint, request, jsonify, current_app
from services.token_service import TokenService

vault_bp = Blueprint('vault', __name__)

@vault_bp.route('/vault/balance/<user_id>', methods=['GET'])
def get_vault_balance(user_id):
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        # Get balance from vault_balances table
        supabase = current_app.config['SUPABASE']
        result = supabase.table('vault_balances').select('*').eq('user_id', user_id).execute()
        
        if result.data:
            balance = result.data[0]['balance']
        else:
            balance = 0
        
        return jsonify({
            "success": True,
            "data": {
                "user_id": user_id,
                "balance": balance
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@vault_bp.route('/vault/rewards/<user_id>', methods=['GET'])
def get_vault_rewards(user_id):
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        supabase = current_app.config['SUPABASE']
        result = supabase.table('vault_rewards').select(
            '*, assets(name), tokens(symbol)'
        ).eq('user_id', user_id).order('created_at', desc=True).execute()
        
        return jsonify({
            "success": True,
            "data": result.data,
            "count": len(result.data)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400
