from flask import Blueprint, request, jsonify, current_app
from services.ownership_service import OwnershipService

ownership_bp = Blueprint('ownership', __name__)

@ownership_bp.route('/ownership/transfer', methods=['POST'])
def transfer_ownership():
    try:
        data = request.get_json()
        ownership_service = OwnershipService(current_app.config['SUPABASE'])
        result = ownership_service.transfer_ownership(data)
        return jsonify({"success": True, "transfer": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@ownership_bp.route('/ownership/token/<token_id>', methods=['GET'])
def get_token_owners(token_id):
    try:
        ownership_service = OwnershipService(current_app.config['SUPABASE'])
        owners = ownership_service.get_token_owners(token_id)
        return jsonify({"success": True, "owners": owners}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@ownership_bp.route('/ownership/user/<user_id>', methods=['GET'])
def get_user_tokens(user_id):
    try:
        ownership_service = OwnershipService(current_app.config['SUPABASE'])
        tokens = ownership_service.get_user_owned_tokens(user_id)
        return jsonify({"success": True, "tokens": tokens}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400