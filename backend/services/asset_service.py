from supabase import Client
from typing import List, Dict, Any
import uuid
from datetime import datetime

class AssetService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    def create_asset(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            asset_data = {
                'id': str(uuid.uuid4()),
                'owner_id': data['owner_id'],
                'name': data['name'],
                'description': data.get('description', ''),
                'category': data.get('category', 'miscellaneous'),
                'valuation': data.get('valuation', 0),
                'image_url': data.get('image_url'),
                'created_at': datetime.now().isoformat()
            }
            
            result = self.supabase.table('assets').insert(asset_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Create asset error: {str(e)}")
    
    def get_all_assets(self) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('assets').select('*, users(username, email)').execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get assets error: {str(e)}")
    
    def get_asset_by_id(self, asset_id: str) -> Dict[str, Any]:
        try:
            result = self.supabase.table('assets').select('*, users(username, email)').eq('id', asset_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Get asset error: {str(e)}")
    
    def get_user_assets(self, user_id: str) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('assets').select('*').eq('owner_id', user_id).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get user assets error: {str(e)}")
    
    def update_asset(self, asset_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            result = self.supabase.table('assets').update(data).eq('id', asset_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Update asset error: {str(e)}")