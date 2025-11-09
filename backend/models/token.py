from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime

@dataclass
class Token:
    id: Optional[str] = None
    name: str = ""
    description: str = ""
    image_url: str = ""
    token_type: str = ""  # physical_item, event_ticket, swag
    total_supply: int = 1
    price: float = 0.0
    creator_id: str = ""
    mint_address: str = ""
    metadata_uri: str = ""
    created_at: Optional[datetime] = None
    is_fractional: bool = False
    status: str = "active"  # active, sold, burned
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image_url': self.image_url,
            'token_type': self.token_type,
            'total_supply': self.total_supply,
            'price': self.price,
            'creator_id': self.creator_id,
            'mint_address': self.mint_address,
            'metadata_uri': self.metadata_uri,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_fractional': self.is_fractional,
            'status': self.status
        }