// 1. Select the display input
const display = document.querySelector('.dispInp');
const buttons = document.querySelectorAll('.calcButton');

let currentExpression = "";

// 2. Handle Button Clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.innerText;

        if (value === 'C') {
            currentExpression = "";
        } else if (value === 'BackSpace' || value === '←') {
            currentExpression = currentExpression.slice(0, -1);
        } else if (value === '=') {
            calculateManualInfix();
        } else {
            // Map UI 'X' to '*' for the logic
            const char = value === 'X' ? '*' : value;
            currentExpression += char;
        }
        updateDisplay();
    });
});

// 3. Handle Keyboard Events (Numbers Only)
window.addEventListener('keydown', (event) => {
    if (/[0-9]/.test(event.key)) {
        currentExpression += event.key;
        updateDisplay();
    } 
    else if (event.key === 'Enter') {
        calculateManualInfix();
    }
    else if (event.key === 'Backspace') {
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    }
    else if (event.key.length === 1) { 
        alert("Only numbers are allowed");
    }
});

function updateDisplay() {
    display.value = currentExpression || "0";
}

// 4. Manual Infix Evaluator Logic (Supporting Parentheses)
function calculateManualInfix() {
    try {
        if (!currentExpression) return;

        // Tokenizer: Now includes ( and )
        const tokens = currentExpression.match(/\d+\.?\d*|[\+\-\*\/\%\(\)]/g);
        if (!tokens) return;

        const values = []; 
        const ops = [];    

        const precedence = {
            '+': 1, '-': 1,
            '*': 2, '/': 2, '%': 2
        };

        const executeOperation = () => {
            if (values.length < 2) return; 
            const val2 = values.pop();
            const val1 = values.pop();
            const op = ops.pop();

            switch (op) {
                case '+': values.push(val1 + val2); break;
                case '-': values.push(val1 - val2); break;
                case '*': values.push(val1 * val2); break;
                case '/': 
                    if (val2 === 0) throw new Error("DivByZero");
                    values.push(val1 / val2); 
                    break;
                case '%': values.push(val1 % val2); break;
            }
        };

        

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (!isNaN(token)) {
                values.push(parseFloat(token));
            } 
            else if (token === '(') {
                // Left parenthesis always goes to the operator stack
                ops.push(token);
            } 
            else if (token === ')') {
                // Right parenthesis: solve everything back to the matching '('
                while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                    executeOperation();
                }
                ops.pop(); // Remove the '(' from stack
            } 
            else {
                // For + - * / %
                while (
                    ops.length > 0 && 
                    ops[ops.length - 1] !== '(' && 
                    precedence[ops[ops.length - 1]] >= precedence[token]
                ) {
                    executeOperation();
                }
                ops.push(token);
            }
        }

        // Final cleanup
        while (ops.length > 0) {
            executeOperation();
        }

        currentExpression = values[0].toString();
        
    } catch (error) {
        alert(error.message === "DivByZero" ? "Cannot divide by zero" : "Invalid Expression");
        currentExpression = "";
    }
    updateDisplay();
}