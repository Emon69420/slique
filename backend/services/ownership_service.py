from supabase import Client
from typing import List, Dict, Any
import uuid
from datetime import datetime

class OwnershipService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    def transfer_ownership(self, data: Dict[str, Any]) -> Dict[str, Any]:
        ownership_data = {
            'id': str(uuid.uuid4()),
            'token_id': data['token_id'],
            'owner_id': data['new_owner_id'],
            'percentage': data.get('percentage', 100.0),
            'acquired_at': datetime.now().isoformat(),
            'acquisition_price': data.get('price', 0.0)
        }
        
        result = self.supabase.table('ownerships').insert(ownership_data).execute()
        return result.data[0] if result.data else None
    
    def get_token_owners(self, token_id: str) -> List[Dict[str, Any]]:
        result = self.supabase.table('ownerships').select('*, users(username, wallet_address)').eq('token_id', token_id).execute()
        return result.data
    
    def get_user_owned_tokens(self, user_id: str) -> List[Dict[str, Any]]:
        result = self.supabase.table('ownerships').select('*, tokens(*)').eq('owner_id', user_id).execute()
        return result.data