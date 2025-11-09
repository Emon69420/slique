from supabase import Client
from typing import Dict, Any
import uuid
from datetime import datetime

class AuthService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    def register_user(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Register with Supabase Auth
            auth_response = self.supabase.auth.sign_up({
                "email": data['email'],
                "password": data['password']
            })
            
            if auth_response.user:
                # Automatically create user profile in your users table
                user_profile = {
                    'id': auth_response.user.id,
                    'email': data['email'],
                    'username': data.get('username', ''),
                    'wallet_address': data['wallet_address'],
                    'org_status': data.get('org_status', False),
                    'created_at': datetime.now().isoformat()  # Convert to string!
                }
                
                # Insert into your users table
                profile_result = self.supabase.table('users').insert(user_profile).execute()
                
                return {
                    'user_id': auth_response.user.id,
                    'email': auth_response.user.email,
                    'session_token': auth_response.session.access_token if auth_response.session else None,
                    'profile': profile_result.data[0] if profile_result.data else None
                }
            
            raise Exception("Registration failed")
        except Exception as e:
            raise Exception(f"Registration error: {str(e)}")
    
    def login_user(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": data['email'],
                "password": data['password']
            })
            
            if auth_response.user:
                # Get user profile from your users table
                profile = self.supabase.table('users').select('*').eq('id', auth_response.user.id).execute()
                
                return {
                    'user_id': auth_response.user.id,
                    'email': auth_response.user.email,
                    'session_token': auth_response.session.access_token if auth_response.session else None,
                    'profile': profile.data[0] if profile.data else None
                }
            
            raise Exception("Login failed")
        except Exception as e:
            raise Exception(f"Login error: {str(e)}")
    
    def get_user_profile(self, auth_header: str) -> Dict[str, Any]:
        if not auth_header or not auth_header.startswith('Bearer '):
            raise Exception("Invalid authorization header")
        
        token = auth_header.split(' ')[1]
        user = self.supabase.auth.get_user(token)
        
        if user:
            profile = self.supabase.table('users').select('*').eq('id', user.user.id).execute()
            return profile.data[0] if profile.data else None
        
        raise Exception("User not found")