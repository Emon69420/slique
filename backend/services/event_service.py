from supabase import Client
from typing import List, Dict, Any
import uuid
from datetime import datetime

class EventService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    def create_event(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            event_data = {
                'id': str(uuid.uuid4()),
                'organizer_id': data['organizer_id'],
                'name': data['name'],
                'description': data.get('description', ''),
                'event_date': data.get('event_date'),
                'created_at': datetime.now().isoformat()
            }
            
            result = self.supabase.table('events').insert(event_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Create event error: {str(e)}")
    
    def get_all_events(self) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('events').select('*, users(username, email)').execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get events error: {str(e)}")
    
    def get_event_by_id(self, event_id: str) -> Dict[str, Any]:
        try:
            result = self.supabase.table('events').select('*, users(username, email)').eq('id', event_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Get event error: {str(e)}")
    
    def distribute_swag(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            distributions = []
            
            for recipient_id in data['recipient_ids']:
                distribution_data = {
                    'id': str(uuid.uuid4()),
                    'event_id': data['event_id'],
                    'token_id': data['token_id'],
                    'recipient_id': recipient_id,
                    'distributed_at': datetime.now().isoformat()
                }
                distributions.append(distribution_data)
            
            result = self.supabase.table('swag_distributions').insert(distributions).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Distribute swag error: {str(e)}")
    
    def get_event_distributions(self, event_id: str) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.table('swag_distributions').select('*, tokens(*, assets(*)), users(username, email)').eq('event_id', event_id).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Get event distributions error: {str(e)}")