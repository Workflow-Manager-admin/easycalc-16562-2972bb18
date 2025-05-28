import React, { useState } from "react";
import "./EasyCalc.css";

/**
 * EasyCalc Main Calculator Container
 * Implements a basic calculator with responsive, light UI and all standard features.
 * Colors/theme: primary #ffffff, secondary #f0f0f0, accent #007bff, text #222
 */

// PUBLIC_INTERFACE
function EasyCalc() {
  // Calculator state: display value, first operand, operator, awaiting input
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // PUBLIC_INTERFACE
  const handleDigit = (digit) => {
    if (display.length > 12) return; // Prevent overflow
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else if (display === "0") {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  // PUBLIC_INTERFACE
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // PUBLIC_INTERFACE
  const handleClear = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputValue = () => parseFloat(display);

  // PUBLIC_INTERFACE
  const performOperation = (nextOperator) => {
    const value = inputValue();

    if (operator && firstOperand != null && !waitingForOperand) {
      const computed = calculate(firstOperand, value, operator);
      setDisplay(String(computed).length > 12 ? String(computed).slice(0, 12) : String(computed));
      setFirstOperand(computed);
    } else {
      setFirstOperand(value);
    }
    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  // PUBLIC_INTERFACE
  const handleEquals = () => {
    if (operator && firstOperand != null && !waitingForOperand) {
      const value = inputValue();
      const computed = calculate(firstOperand, value, operator);
      setDisplay(
        String(computed).length > 12 ? String(computed).slice(0, 12) : String(computed)
      );
      setFirstOperand(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  // Helper function for calculation
  function calculate(a, b, op) {
    let res;
    switch (op) {
      case "+":
        res = a + b;
        break;
      case "-":
        res = a - b;
        break;
      case "×":
        res = a * b;
        break;
      case "÷":
        if (b === 0) return "Error";
        res = a / b;
        break;
      default:
        return b;
    }
    // Fix floating point errors, keep max 8 decimal places
    res = +parseFloat(res.toFixed(8));
    return res;
  }

  // Buttons config for grid layout
  const buttons = [
    { label: "C", type: "action", onClick: handleClear },
    { label: "÷", type: "operator", onClick: () => performOperation("÷") },
    { label: "×", type: "operator", onClick: () => performOperation("×") },
    { label: "-", type: "operator", onClick: () => performOperation("-") },
    { label: "7", type: "digit", onClick: () => handleDigit("7") },
    { label: "8", type: "digit", onClick: () => handleDigit("8") },
    { label: "9", type: "digit", onClick: () => handleDigit("9") },
    { label: "+", type: "operator", onClick: () => performOperation("+") },
    { label: "4", type: "digit", onClick: () => handleDigit("4") },
    { label: "5", type: "digit", onClick: () => handleDigit("5") },
    { label: "6", type: "digit", onClick: () => handleDigit("6") },
    { label: "=", type: "equals", onClick: handleEquals, className: "equals" },
    { label: "1", type: "digit", onClick: () => handleDigit("1") },
    { label: "2", type: "digit", onClick: () => handleDigit("2") },
    { label: "3", type: "digit", onClick: () => handleDigit("3") },
    { label: "0", type: "digit", onClick: () => handleDigit("0"), className: "zero" },
    { label: ".", type: "digit", onClick: handleDecimal },
  ];

  return (
    <div className="easycalc-container">
      <div className="easycalc">
        <div className="easycalc-display" data-testid="calculator-display" title={display}>
          {display}
        </div>
        <div className="easycalc-buttons">
          {buttons.map((btn, idx) => {
            // for zero: span 2 columns
            if (btn.label === "0") {
              return (
                <button
                  key={btn.label}
                  className={`easycalc-btn zero ${btn.type === "operator" ? "operator" : ""} ${btn.type === "action" ? "action" : ""}`}
                  onClick={btn.onClick}
                  style={{ gridColumn: "1 / span 2" }}
                  tabIndex={0}
                >
                  {btn.label}
                </button>
              );
            }
            // for equals: span two rows
            if (btn.label === "=") {
              return (
                <button
                  key={btn.label}
                  className={`easycalc-btn equals`}
                  onClick={btn.onClick}
                  style={{ gridRow: "4 / span 2", gridColumn: 4 }}
                  tabIndex={0}
                >
                  {btn.label}
                </button>
              );
            }
            return (
              <button
                key={btn.label}
                className={`easycalc-btn ${btn.type === "operator" ? "operator" : ""} ${btn.type === "action" ? "action" : ""}`}
                onClick={btn.onClick}
                tabIndex={0}
                aria-label={btn.label}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EasyCalc;
