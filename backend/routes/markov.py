from flask import Blueprint, request, jsonify
from utils.markov_utils import calculate_steady_state

bp = Blueprint('markov', __name__)

@bp.route('/steady-state', methods=['POST'])
def steady_state():
    data = request.json
    transition_matrix = data['matrix']
    steady_state_vector = calculate_steady_state(transition_matrix)
    return jsonify({'steady_state': steady_state_vector})
