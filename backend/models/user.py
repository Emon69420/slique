from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class User:
    id: Optional[str] = None
    email: str = ""
    username: str = ""
    wallet_address: str = ""
    profile_image: str = ""
    bio: str = ""
    created_at: Optional[datetime] = None
    is_verified: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'wallet_address': self.wallet_address,
            'profile_image': self.profile_image,
            'bio': self.bio,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_verified': self.is_verified
        }