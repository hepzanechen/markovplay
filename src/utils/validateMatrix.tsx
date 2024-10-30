// Import necessary modules if needed
// import React, { useState, useEffect } from 'react';

// Define the function
const validateMatrix = (matrix) => {
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const rowSum = row.reduce((acc, value) => acc + value, 0);

    // Check if all entries are between 0 and 1
    for (let j = 0; j < row.length; j++) {
      if (row[j] < 0 || row[j] > 1) {
        return `Invalid value at row ${i + 1}, column ${j + 1}. All values must be between 0 and 1.`;
      }
    }

    // Check if the row sum is approximately equal to 1
    if (Math.abs(rowSum - 1) > 0.01) {
      return `Invalid row ${i + 1}. The sum of probabilities in each row must be 1.`;
    }
  }
  return null;
};

// Export the function as the default export
export default validateMatrix;
