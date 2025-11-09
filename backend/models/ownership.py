from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class Ownership:
    id: Optional[str] = None
    token_id: str = ""
    owner_id: str = ""
    percentage: float = 100.0
    acquired_at: Optional[datetime] = None
    acquisition_price: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'token_id': self.token_id,
            'owner_id': self.owner_id,
            'percentage': self.percentage,
            'acquired_at': self.acquired_at.isoformat() if self.acquired_at else None,
            'acquisition_price': self.acquisition_price
        }

@dataclass
class Vote:
    id: Optional[str] = None
    token_id: str = ""
    proposal_id: str = ""
    voter_id: str = ""
    vote_choice: str = ""  # yes, no, abstain
    voting_power: float = 0.0
    created_at: Optional[datetime] = None