import re
from typing import Any

def is_valid_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_wallet_address(address: str) -> bool:
    """Validate Solana wallet address format"""
    if len(address) < 32 or len(address) > 44:
        return False
    
    # Basic base58 character check
    valid_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    return all(c in valid_chars for c in address)

def validate_token_type(token_type: str) -> bool:
    """Validate token type"""
    valid_types = ["physical_item", "event_ticket", "swag"]
    return token_type in valid_types