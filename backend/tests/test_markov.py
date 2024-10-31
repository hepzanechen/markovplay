import unittest
from utils.markov_utils import (
    calculate_steady_state,
    n_step_transition_probability,
    absorption_probabilities,
    expected_steps_to_absorption,
    mean_first_passage_time,
    transient_recurrent_classification,
    hitting_probability
)

class TestMarkovUtils(unittest.TestCase):

    def setUp(self):
        # Example transition matrix for testing
        self.transition_matrix = [
            [0.5, 0.5, 0.0],
            [0.0, 0.5, 0.5],
            [0.0, 0.0, 1.0]
        ]

    def test_calculate_steady_state(self):
        expected = [0.0, 0.0, 1.0]  # Long-term probabilities
        result = calculate_steady_state(self.transition_matrix)
        for r, e in zip(result, expected):
            self.assertAlmostEqual(r, e, places=4)

    def test_n_step_transition_probability(self):
        n = 2
        expected = [
            [0.25, 0.25, 0.5],
            [0.0, 0.25, 0.75],
            [0.0, 0.0, 1.0]
        ]
        result = n_step_transition_probability(self.transition_matrix, n)
        self.assertEqual(result, expected)

    def test_absorption_probabilities(self):
        expected = [
            [1.0, 0.0],
            [0.0, 1.0]
        ]
        result = absorption_probabilities(self.transition_matrix)
        self.assertEqual(result, expected)

    def test_expected_steps_to_absorption(self):
        expected = [2.0, 2.0]  # Expected steps from each transient state to absorption
        result = expected_steps_to_absorption(self.transition_matrix)
        for r, e in zip(result, expected):
            self.assertAlmostEqual(r, e, places=4)

    def test_mean_first_passage_time(self):
        expected = 2.0  # Expected steps to reach state 2 from state 0
        result = mean_first_passage_time(self.transition_matrix, start_state=0, target_state=2)
        self.assertAlmostEqual(result, expected, places=4)

    def test_transient_recurrent_classification(self):
        expected = {
            'recurrent_states': [2],
            'transient_states': [0, 1]
        }
        result = transient_recurrent_classification(self.transition_matrix)
        self.assertEqual(result, expected)

    def test_hitting_probability(self):
        expected = [0.5, 0.5, 1.0]  # Probability of hitting state 2 from state 0 and 1
        for start_state in range(3):
            result = hitting_probability(self.transition_matrix, start_state, target_state=2)
            self.assertAlmostEqual(result[start_state], expected[start_state], places=4)

if __name__ == '__main__':
    unittest.main()
)
