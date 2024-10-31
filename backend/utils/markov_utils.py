import numpy as np

def calculate_steady_state(transition_matrix):
    P = np.array(transition_matrix)
    n = P.shape[0]
    A = np.append(P.T - np.eye(n), np.ones((1, n)), axis=0)
    b = np.zeros(n + 1)
    b[-1] = 1
    steady_state_vector = np.linalg.lstsq(A, b, rcond=None)[0]
    return steady_state_vector.tolist()

def n_step_transition_probability(transition_matrix, n):
    P = np.array(transition_matrix)
    return np.linalg.matrix_power(P, n).tolist()

def absorption_probabilities(transition_matrix):
    P = np.array(transition_matrix)
    n = P.shape[0]
    
    # Identify transient and absorbing states
    absorbing_states = np.where(np.isclose(P.sum(axis=1), 1))[0]
    transient_states = np.where(~np.isin(np.arange(n), absorbing_states))[0]
    
    if len(transient_states) == 0:
        return "No transient states"
    
    Q = P[np.ix_(transient_states, transient_states)]
    R = P[np.ix_(transient_states, absorbing_states)]
    
    # Fundamental matrix
    N = np.linalg.inv(np.eye(Q.shape[0]) - Q)
    absorption_prob = N @ R
    return absorption_prob.tolist()

def expected_steps_to_absorption(transition_matrix):
    P = np.array(transition_matrix)
    n = P.shape[0]
    
    absorbing_states = np.where(np.isclose(P.sum(axis=1), 1))[0]
    transient_states = np.where(~np.isin(np.arange(n), absorbing_states))[0]
    
    if len(transient_states) == 0:
        return "No transient states"
    
    Q = P[np.ix_(transient_states, transient_states)]
    
    N = np.linalg.inv(np.eye(Q.shape[0]) - Q)
    expected_steps = np.sum(N, axis=1)
    return expected_steps.tolist()

def mean_first_passage_time(transition_matrix, start_state, target_state):
    P = np.array(transition_matrix)
    n = P.shape[0]
    
    # Create a system of equations
    equations = np.zeros(n)
    for i in range(n):
        if i == target_state:
            equations[i] = 0
        else:
            equations[i] = 1 + sum(P[i, j] * equations[j] for j in range(n))
    
    return equations[start_state]

def transient_recurrent_classification(transition_matrix):
    P = np.array(transition_matrix)
    n = P.shape[0]
    recurrent_states = []
    transient_states = []
    
    for i in range(n):
        if P[i, i] > 0:
            recurrent_states.append(i)
        else:
            transient_states.append(i)
    
    return {
        'recurrent_states': recurrent_states,
        'transient_states': transient_states
    }

def hitting_probability(transition_matrix, start_state, target_state):
    P = np.array(transition_matrix)
    n = P.shape[0]
    
    equations = np.zeros(n)
    equations[target_state] = 1
    
    for i in range(n):
        if i != target_state:
            equations[i] = sum(P[i, j] * equations[j] for j in range(n))
    
    return equations[start_state]
