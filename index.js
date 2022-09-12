const sectionTransaction = document.querySelector('.transaction-output');
const sectionKeys = document.querySelector('.keys-output');

const buttonsValues = [
    { key: 'C', value: 'delete', action:true},
    { key: 'CE', value: 'clean', action:true},
    { key: '%', value: 'percentage', action:true},
    { key: '/', value: 'divide', action:true},
    { key: '7', value: 'number', action:false},
    { key: '8', value: 'number', action:false},
    { key: '9', value: 'number', action:false},
    { key: '*', value: 'multiply', action:true},
    { key: '4', value: 'number', action:false},
    { key: '5', value: 'number', action:false},
    { key: '6', value: 'number', action:false},
    { key: '-', value: 'subtract', action:true},
    { key: '1', value: 'number', action:false},
    { key: '2', value: 'number', action:false},
    { key: '3', value: 'number', action:false},
    { key: '+', value: 'add', action:true},
    { key: '-/+', value: 'opposite', action:false},
    { key: '0', value: 'number', action:false},
    { key: '.', value: 'point', action:false},
    { key: '=', value: 'equal', action:true},
];

const DISPLAY_MAX_NUMBER = 17;

let mathItUp = {
    '+': (x, y) =>  x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => !y ? null : x / y,
}

buttonsValues.map(btn => {
    sectionKeys.insertAdjacentHTML('beforeend',
        `<button class="key_btn key_${btn.value}" data-value="${btn.value}" data-action="${btn.action}">${btn.key}</button>`)
});

let orangeColorElements = document.querySelectorAll('.key_btn:not(.key_number,.key_point)');

orangeColorElements.forEach(el => el.classList.add('orange-color'));

const newDisplayRowFirstValue = document.createElement('p');

sectionTransaction.appendChild(newDisplayRowFirstValue);

let firstOperand = '0';
let secondOperand = '';
let operator = '';
let calculatedValue = null;
let isCalculateAction = false;

updateDisplay();

const numberKeys = sectionKeys.querySelectorAll('.key_btn[data-action="false"]');

numberKeys.forEach(key => {key.addEventListener('click', e => {
    if(isCalculateAction && !operator) {
        cleanDisplay();
        isCalculateAction = false;
    }

    switch (e.currentTarget.dataset.value) {
        case "number":
            setOperand(updateOperand, key);
            break;
        case "point":
            setOperand(addPointToNumber, key);
            break;
        case "opposite":
            setOperand(changeSignOfNumber, key);
            break;
    }

    updateDisplay(firstOperand, operator, secondOperand);

    });
});

const actionKeys = sectionKeys.querySelectorAll('.key_btn[data-action="true"]');

actionKeys.forEach(key => {key.addEventListener('click', e => {

    switch (e.currentTarget.dataset.value) {
        case "delete":
            setOperand(deleteLastDigit, key);
            break;
        case "clean":
            cleanDisplay();
            break;
        case "add":
        case "subtract":
        case "divide":
        case "multiply":

            [firstOperand, secondOperand] = updateOperandsOnMathAction(firstOperand, operator, secondOperand);

            operator = e.currentTarget.textContent;

            break;
        case "percentage":
            let secondOperandValue = secondOperand/100*firstOperand;

            if(secondOperand.length > 0) {
                secondOperand = secondOperand + e.currentTarget.textContent;
            }

            if(operator !== '' && secondOperand.length > 0) {
                calculatedValue = calculate(firstOperand, operator, secondOperandValue);
                firstOperand = calculatedValue;
                secondOperand = '';
                operator = '';
            } else {
                operator = e.currentTarget.textContent;
            }

            break;
        case "equal":

            [firstOperand, secondOperand] = updateOperandsOnMathAction(firstOperand, operator, secondOperand);
            operator = '';

            break;
    }

    updateDisplay(firstOperand, operator, secondOperand);
    });
});

function updateDisplay(firstOperand = 0, operator = '', secondOperand)
{
    newDisplayRowFirstValue.textContent = secondOperand ? `${firstOperand} ${operator} ${secondOperand}` : `${firstOperand} ${operator}`;
}

function calculate(firstOperand, operator, secondOperand)
{
    isCalculateAction = true;
    firstOperand = parseFloat(firstOperand);
    secondOperand = parseFloat(secondOperand);

    let result = mathItUp[operator](firstOperand, secondOperand);

    if(!result) {
        return;
        //TODO handle division on 0
    }

    return result ? result.toString().slice(0, DISPLAY_MAX_NUMBER) : '';
}

function updateOperand(operand, key)
{
    if(!operand || operand == '0') {
        operand = key.textContent;
    } else if(operand.length < DISPLAY_MAX_NUMBER) {
        operand += key.textContent;
    }

    return operand;
}

function addPointToNumber(operand, key)
{
    if(!operand.includes('.')) {
        operand += key.textContent;
    }

    return operand;
}

function changeSignOfNumber(operand)
{
    if(operand !== 0) {
        if(operand.charAt(0) == '-') {
            operand = operand.substring(1);
        } else {
            operand = `-${operand}`;
        }
    }

    return operand;
}

function deleteLastDigit(operand)
{
    if(operand !== 0) {
        operand = operand.slice(0, -1);

        if(operand.length == 0) {
            operand = 0;
        }
    }

    return operand;
}

function setOperand(functionSetOperand, key) {
    if(operator !== '') {
        if(operator !== '%') {
            secondOperand = functionSetOperand(secondOperand, key);
        }
    } else {
        firstOperand = functionSetOperand(firstOperand, key);
    }
}

function updateOperandsOnMathAction(firstOperand, operator, secondOperand)
{
    if(operator !== '' && secondOperand.length > 0) {
        calculatedValue = calculate(firstOperand, operator, secondOperand);
        firstOperand = calculatedValue;
        secondOperand = '';
    }

    return [firstOperand, secondOperand];
}

function cleanDisplay()
{
    firstOperand = '0';
    operator = '';
    secondOperand = '';
}
