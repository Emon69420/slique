from flask import Blueprint, request, jsonify, current_app
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        auth_service = AuthService(current_app.config['SUPABASE'])
        user = auth_service.register_user(data)
        return jsonify({"success": True, "user": user}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        auth_service = AuthService(current_app.config['SUPABASE'])
        result = auth_service.login_user(data)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        auth_header = request.headers.get('Authorization')
        auth_service = AuthService(current_app.config['SUPABASE'])
        profile = auth_service.get_user_profile(auth_header)
        return jsonify({"success": True, "profile": profile}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401