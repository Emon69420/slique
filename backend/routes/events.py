from flask import Blueprint, request, jsonify, current_app
from services.event_service import EventService
from middleware.validation import validate_json

events_bp = Blueprint('events', __name__)

@events_bp.route('/events', methods=['POST'])
@validate_json(['organizer_id', 'name'])
def create_event():
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        event_service = EventService(current_app.config['SUPABASE'])
        event = event_service.create_event(data)
        
        return jsonify({
            "success": True,
            "message": "Event created successfully",
            "data": event
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@events_bp.route('/events', methods=['GET'])
def get_all_events():
    try:
        event_service = EventService(current_app.config['SUPABASE'])
        events = event_service.get_all_events()
        
        return jsonify({
            "success": True,
            "data": events,
            "count": len(events)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@events_bp.route('/events/<event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event_service = EventService(current_app.config['SUPABASE'])
        event = event_service.get_event_by_id(event_id)
        
        if not event:
            return jsonify({"success": False, "error": "Event not found"}), 404
        
        return jsonify({
            "success": True,
            "data": event
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@events_bp.route('/events/<event_id>/distribute-swag', methods=['POST'])
@validate_json(['token_id', 'recipient_ids'])
def distribute_swag(event_id):
    try:
        # Check auth
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"success": False, "error": "Authorization required"}), 401
        
        data = request.get_json()
        data['event_id'] = event_id
        
        event_service = EventService(current_app.config['SUPABASE'])
        distributions = event_service.distribute_swag(data)
        
        return jsonify({
            "success": True,
            "message": f"Swag distributed to {len(distributions)} recipients",
            "data": distributions
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@events_bp.route('/events/<event_id>/distributions', methods=['GET'])
def get_event_distributions(event_id):
    try:
        event_service = EventService(current_app.config['SUPABASE'])
        distributions = event_service.get_event_distributions(event_id)
        
        return jsonify({
            "success": True,
            "data": distributions,
            "count": len(distributions)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400