const display = document.getElementById('result');
const grid = document.querySelector('.mainGrid'); 
let currentExpression = "";

grid.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName !== 'BUTTON') return;

    const id = target.id;
    const text = target.innerText;

    if (id === 'equal') {
        calculateManualInfix();
    } else if (id === 'clear') {
        currentExpression = "";
    } else if (id === 'erase' || text === 'Back') {
        currentExpression = currentExpression.slice(0, -1);
    } else {
        if (id === 'add') currentExpression += '+';
        else if (id === 'subtract') currentExpression += '-';
        else if (id === 'multiply') currentExpression += '*';
        else if (id === 'divide') currentExpression += '/';
        else {
            currentExpression += text;
        }
    }
    
    display.value = currentExpression || "0";
});

//Keyboard Events
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


function calculateManualInfix() {
    try {
        if (!currentExpression) return;

        
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
                ops.push(token);
            } 
            else if (token === ')') {
                while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                    executeOperation();
                }
                ops.pop(); 
            } 
            else {
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