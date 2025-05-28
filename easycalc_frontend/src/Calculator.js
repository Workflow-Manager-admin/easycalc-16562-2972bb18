import React, { useState } from "react";

/*
  PUBLIC_INTERFACE
  EasyCalc Calculator Main Container Component

  Features:
  - Display area for input/result
  - Responsive button grid for digits, point, operators, C, and =
  - Supports addition, subtraction, multiplication, division, decimal input, clear, and chaining
  - Styled per EasyCalc theme (light, primary: #fff, secondary: #f0f0f0, accent: #007bff)
*/

const BUTTONS = [
  // Each row is an array: [label, type]
  [
    { label: "C", type: "control" },
    { label: "÷", type: "operator" },
    { label: "×", type: "operator" },
    { label: "←", type: "control" },
  ],
  [
    { label: "7", type: "digit" },
    { label: "8", type: "digit" },
    { label: "9", type: "digit" },
    { label: "-", type: "operator" },
  ],
  [
    { label: "4", type: "digit" },
    { label: "5", type: "digit" },
    { label: "6", type: "digit" },
    { label: "+", type: "operator" },
  ],
  [
    { label: "1", type: "digit" },
    { label: "2", type: "digit" },
    { label: "3", type: "digit" },
    { label: "=", type: "equal" },
  ],
  [
    { label: "0", type: "digit", wide: true },
    { label: ".", type: "digit" },
  ],
];

const OPERATORS = {
  "+": { precedence: 1, fn: (a, b) => a + b },
  "-": { precedence: 1, fn: (a, b) => a - b },
  "×": { precedence: 2, fn: (a, b) => a * b },
  "÷": { 
    precedence: 2, 
    fn: (a, b) => b === 0 ? "Error" : a / b 
  },
};

// Returns true if the string represents a valid number
function isValidNumber(str) {
  return /^-?\d*\.?\d+$/.test(str);
}

// Evaluate sequence, left-to-right, respecting operator precedence
function evaluateExpression(sequence) {
  // Flatten sequence: ["12", "+", "5", "×", "2"] => handle ×/÷ before +/-
  const nums = [];
  const ops = [];

  let i = 0;
  while (i < sequence.length) {
    const curr = sequence[i];
    if (["+", "-", "×", "÷"].includes(curr)) {
      while (
        ops.length &&
        OPERATORS[ops[ops.length - 1]] &&
        OPERATORS[ops[ops.length - 1]].precedence >= OPERATORS[curr].precedence
      ) {
        const op = ops.pop();
        const b = nums.pop();
        const a = nums.pop();
        let value = OPERATORS[op].fn(a, b);
        if (value === "Error") return "Error";
        nums.push(value);
      }
      ops.push(curr);
    } else {
      const num = parseFloat(curr);
      if (isNaN(num)) return "Error";
      nums.push(num);
    }
    i++;
  }
  while (ops.length) {
    const op = ops.pop();
    const b = nums.pop();
    const a = nums.pop();
    let value = OPERATORS[op].fn(a, b);
    if (value === "Error") return "Error";
    nums.push(value);
  }
  return nums.length === 1 ? nums[0] : "Error";
}

const Calculator = () => {
  const [display, setDisplay] = useState("0"); // What user sees
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expr, setExpr] = useState([]); // Array of [number, operator, number, ...]

  // Handle any button press
  const handleButtonClick = (btn) => {
    const { label, type } = btn;

    if (type === "digit") {
      if (display === "Error" || (waitingForOperand && !["."].includes(label))) {
        // Start new number entry after operator
        setDisplay(label === "." ? "0." : label);
        setWaitingForOperand(false);
      } else if (label === ".") {
        // Prevent multiple decimals
        if (!display.includes(".")) setDisplay(display + ".");
      } else if (display === "0" && label !== ".") {
        setDisplay(label);
      } else {
        setDisplay(display + label);
      }
    } else if (type === "operator") {
      if (display === "Error") {
        setDisplay("0");
        setExpr([]);
        setWaitingForOperand(false);
      } else {
        const last =
          expr.length > 0 ? expr[expr.length - 1] : null;
        let newExpr = [...expr];
        // If last was operator, replace; else, push value and op
        if (
          ["+", "-", "×", "÷"].includes(last)
        ) {
          newExpr[newExpr.length - 1] = label;
        } else {
          newExpr.push(display, label);
        }
        setExpr(newExpr);
        setWaitingForOperand(true);
      }
    } else if (type === "equal") {
      if (display === "Error") {
        setDisplay("0");
        setExpr([]);
        setWaitingForOperand(false);
      } else {
        let fullExpr = [...expr, display];
        // Remove trailing operator if present
        if (["+", "-", "×", "÷"].includes(fullExpr[fullExpr.length - 1])) {
          fullExpr.pop();
        }
        const result = evaluateExpression(fullExpr);
        setDisplay(
          typeof result === "number"
            ? (Number.isFinite(result) ? result.toString() : "Error")
            : result
        );
        setExpr([]);
        setWaitingForOperand(false);
      }
    } else if (label === "C") {
      setDisplay("0");
      setExpr([]);
      setWaitingForOperand(false);
    } else if (label === "←") {
      // Backspace: only for digits
      if (display.length === 1 || display === "Error") {
        setDisplay("0");
      } else {
        setDisplay(display.slice(0, -1));
      }
    }
  };

  // --- Styling ---
  // Primary: #fff, Secondary: #f0f0f0, Accent: #007bff
  // Responsive: max 350px wide, nice padding, button grid gaps

  return (
    <div style={styles.calculatorContainer}>
      <div style={styles.display} data-testid="calc-display">
        {display}
      </div>
      <div style={styles.buttonGrid}>
        {BUTTONS.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.buttonRow}>
            {row.map((btn, i) => (
              <button
                key={btn.label}
                type="button"
                aria-label={btn.label}
                onClick={() => handleButtonClick(btn)}
                style={{
                  ...styles.button,
                  ...(btn.type === "operator"
                    ? styles.buttonAccent
                    : btn.type === "equal"
                    ? styles.buttonAccentBold
                    : btn.type === "control"
                    ? styles.buttonSecondary
                    : {}),
                  ...(btn.wide ? styles.buttonWide : {}),
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Inline styling for theme and responsive design ---
const styles = {
  calculatorContainer: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 1.5px 8px rgba(0,0,0,0.07)",
    maxWidth: "340px",
    margin: "48px auto 0",
    padding: "24px 16px 16px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minHeight: "430px",
    width: "100%",
  },
  display: {
    background: "#f0f0f0",
    color: "#232323",
    borderRadius: "8px",
    fontSize: "2.4rem",
    fontWeight: "600",
    padding: "24px 12px",
    marginBottom: "20px",
    minHeight: "56px",
    textAlign: "right",
    wordBreak: "break-all",
    letterSpacing: "1.6px",
    userSelect: "all",
    boxShadow: "0 1px 2.5px rgba(0,0,0,0.04)",
  },
  buttonGrid: {
    display: "grid",
    gridTemplateRows: "repeat(5, 1fr)",
    gap: "10px",
    width: "100%",
  },
  buttonRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    width: "100%",
  },
  button: {
    background: "#f0f0f0",
    borderRadius: "7px",
    border: "none",
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#222",
    padding: "18px 4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    outline: "none",
    minWidth: 0,
  },
  buttonWide: {
    gridColumn: "1 / 3",
  },
  buttonAccent: {
    background: "#007bff",
    color: "#fff",
    fontWeight: "600",
  },
  buttonAccentBold: {
    background: "#007bff",
    color: "#fff",
    fontWeight: 700,
    boxShadow: "0 2px 8px rgba(0,123,255,0.07)",
  },
  buttonSecondary: {
    background: "#e3eaf4",
    color: "#2d4568",
    fontWeight: "500",
  },
};

export default Calculator;
