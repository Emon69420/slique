from functools import wraps
from flask import request, jsonify, current_app
from services.auth_service import AuthService

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header required'}), 401
        
        try:
            auth_service = AuthService(current_app.config['SUPABASE'])
            user = auth_service.get_user_profile(auth_header)
            request.current_user = user
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    
    return decorated_function