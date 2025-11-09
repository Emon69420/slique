from flask import Blueprint, request, jsonify, current_app
from services.swag_service import SwagService

swag_bp = Blueprint('swag', __name__)

@swag_bp.route('/swag/distribute', methods=['POST'])
def distribute_swag():
    try:
        data = request.get_json()
        swag_service = SwagService(current_app.config['SUPABASE'])
        result = swag_service.distribute_event_swag(data)
        return jsonify({"success": True, "distribution": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@swag_bp.route('/swag/event/<event_id>', methods=['GET'])
def get_event_swag(event_id):
    try:
        swag_service = SwagService(current_app.config['SUPABASE'])
        swag_items = swag_service.get_event_swag_items(event_id)
        return jsonify({"success": True, "swag_items": swag_items}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400