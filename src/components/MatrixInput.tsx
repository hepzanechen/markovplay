import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';  // Import Bulma styles

interface MatrixInputFormProps {
  size: number;
  setSize: (size: number) => void;
  setMatrix: (matrix: number[][]) => void;
  setStateNames: (names: string[]) => void;
}

const MatrixInputForm: React.FC<MatrixInputFormProps> = ({ size, setSize, setMatrix, setStateNames }) => {
  const [stateNamesInput, setStateNamesInput] = useState<string[]>([]);
  const [matrixInput, setMatrixInput] = useState<number[][]>([]);
  const [isMatrixFolded, setIsMatrixFolded] = useState(true);
// Update local state when initialMatrix changes
  useEffect(() => {
    setStateNamesInput(Array.from({ length: size }, (_, i) => `State ${String.fromCharCode(65 + i)}`));
    setMatrixInput(Array.from({ length: size }, () => Array(size).fill(1 / size)));
  }, [size]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.max(2, Math.min(100, parseInt(e.target.value, 10))); // Allow up to 100 states
    setSize(newSize);
  };

  const handleStateNameChange = (index: number, value: string) => {
    const newNames = [...stateNamesInput];
    newNames[index] = value;
    setStateNamesInput(newNames);
  };

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = matrixInput.map((r, rowIndex) =>
      rowIndex === row ? r.map((c, colIndex) => (colIndex === col ? parseFloat(value) || 0 : c)) : r
    );
    setMatrixInput(newMatrix);
  };

  const handleApply = () => {
    setSize(stateNamesInput.length);
    setMatrix(matrixInput);
    setStateNames(stateNamesInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter((row) => row.trim() !== '');
        const newMatrix = rows.map((row) => row.split(',').map(Number));
        setMatrix(newMatrix);
        setSize(newMatrix.length);
        setStateNamesInput(Array.from({ length: newMatrix.length }, (_, i) => `State ${String.fromCharCode(65 + i)}`));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="box has-background-grey-light">
      <div className="field">
      <h4 className="title is-5">Number of States</h4>
        <div className="control">
          <input
            type="number"
            value={size}
            min="2"
            max="100"
            onChange={handleSizeChange}
            className="input"
          />
        </div>
      </div>
      <div className="field">
        <h4 className="title is-5">State Names and Transition Matrix</h4>
        <button
          onClick={() => setIsMatrixFolded(!isMatrixFolded)}
          className="button is-link mb-3"
        >
          {isMatrixFolded ? 'Expand State Names and Matrix' : 'Fold State Names and Matrix'}
        </button>
        {isMatrixFolded ? (
          <p className="help">State names and matrix are folded. Click "Expand State Names and Matrix" to view and edit.</p>
        ) : (
          <div className="columns">
            <div className="column is-one-quarter">
              <div className="state-names-list">
                <h5 className="title is-6">State Names</h5>
                {stateNamesInput.map((name, i) => (
                  <div key={i} className="control mb-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleStateNameChange(i, e.target.value)}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="column">
              <div className="matrix-container">
                <h5 className="title is-6">Transition Matrix</h5>
                <div className="matrix-grid" style={{ display: 'grid', gridTemplateRows: `repeat(${size}, auto)`, gap: '10px' }}>
                  {matrixInput.map((row, rowIndex) => (
                    <div key={rowIndex} className="matrix-row" style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 80px)`, gap: '10px' }}>
                      {row.map((value, colIndex) => (
                        <input
                          key={`${rowIndex}-${colIndex}`}
                          type="number"
                          value={value}
                          step="0.1"
                          min="0"
                          max="1"
                          onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                          className="input matrix-input-field"
                        />
                      ))}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
      <div className="field">

        <div className="control">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input"
          />
        </div>
      </div>
      <div className="field">
        <button onClick={handleApply} className="button is-success">Apply Changes</button>
      </div>
    </div>
  );
};

export default MatrixInputForm;
