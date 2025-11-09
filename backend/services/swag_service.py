from supabase import Client
from typing import List, Dict, Any
import uuid
from datetime import datetime

class SwagService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    def distribute_event_swag(self, data: Dict[str, Any]) -> Dict[str, Any]:
        distributions = []
        
        for participant_id in data['participant_ids']:
            distribution_data = {
                'id': str(uuid.uuid4()),
                'event_id': data['event_id'],
                'swag_token_id': data['swag_token_id'],
                'recipient_id': participant_id,
                'distributed_at': datetime.now().isoformat(),
                'status': 'distributed'
            }
            distributions.append(distribution_data)
        
        result = self.supabase.table('swag_distributions').insert(distributions).execute()
        return result.data
    
    def get_event_swag_items(self, event_id: str) -> List[Dict[str, Any]]:
        result = self.supabase.table('swag_distributions').select('*, tokens(*)').eq('event_id', event_id).execute()
        return result.data