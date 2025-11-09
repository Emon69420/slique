import os
from supabase import create_client, Client

class DatabaseConfig:
    def __init__(self):
        self.url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_ANON_KEY")
    
    def get_client(self) -> Client:
        return create_client(self.url, self.key)