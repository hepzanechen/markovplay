// markovCalculations.ts
export interface CalculationResponse {
  steadyState?: number[];
  // You can add more properties as needed for future calculations
}

// Function to call the Flask backend
const fetchSteadyState = async (matrix: number[][]): Promise<number[]> => {
  const response = await fetch('http://localhost:5000/steady-state', { // Updated endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ matrix }), // Send the matrix as JSON
  });

  if (!response.ok) {
    throw new Error('Failed to calculate steady state');
  }

  const data = await response.json();
  return data.steady_state; // Adjust based on your backend response structure
};

export const calculateSteadyState = async (matrix: number[][]): Promise<CalculationResponse> => {
  try {
    const steadyState = await fetchSteadyState(matrix);
    return { steadyState };
  } catch (error) {
    throw new Error(error.message);
  }
};

// You can also create a more generic calculation function
export const calculateMarkovProperties = async (matrix: number[][], property: string): Promise<CalculationResponse> => {
  switch (property) {
    case 'steadyState':
      return await calculateSteadyState(matrix);
    // Add more cases for other properties in the future
    default:
      throw new Error('Property not supported');
  }
};
