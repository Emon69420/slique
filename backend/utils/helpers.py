import uuid
from datetime import datetime
from typing import Dict, Any

def generate_uuid() -> str:
    """Generate a new UUID string"""
    return str(uuid.uuid4())

def current_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat()

def format_response(success: bool, data: Any = None, error: str = None) -> Dict[str, Any]:
    """Format API response"""
    response = {"success": success}
    
    if data is not None:
        response["data"] = data
    
    if error:
        response["error"] = error
    
    return response