from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Import routes
from routes.auth import auth_bp
from routes.assets import assets_bp  # Make sure this exists
from routes.tokens import tokens_bp
from routes.events import events_bp
from routes.wallet import wallet_bp
from routes.vault import vault_bp
#from routes.test import test_bp  # Add this line

load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase configuration
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# Make supabase available globally
app.config['SUPABASE'] = supabase
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "dev-secret-key")

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(assets_bp, url_prefix='/api')  # Add this line
app.register_blueprint(tokens_bp, url_prefix='/api')
app.register_blueprint(events_bp, url_prefix='/api')
app.register_blueprint(wallet_bp, url_prefix='/api')
app.register_blueprint(vault_bp, url_prefix='/api')
#app.register_blueprint(test_bp, url_prefix='/api')  # Add this line

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "VaultHive Tokenization API is running",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/*",
            "assets": "/api/assets/*",
            "tokens": "/api/tokens/*",
            "events": "/api/events/*",
            "wallets": "/api/wallets/*",  # Add this
            "test": "/api/test/*"  # Add this
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 Starting VaultHive API...")
    print("📍 Health check: http://localhost:5000/api/health")
    print("🔐 Auth endpoints: http://localhost:5000/api/auth/*")
    print("🏠 Asset endpoints: http://localhost:5000/api/assets/*")
    print("🪙 Token endpoints: http://localhost:5000/api/tokens/*")
    print("🎉 Event endpoints: http://localhost:5000/api/events/*")
    print("💰 Wallet endpoints: http://localhost:5000/api/wallets/*")  # Add this
    print("🧪 Test endpoints: http://localhost:5000/api/test/*")  # Add this
    app.run(debug=True, port=5000)