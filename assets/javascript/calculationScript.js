class Calculator {
    constructor() {

        this.result = document.querySelector('.calculator__result-primary');
        this.subRes = document.querySelector('.calculator__result-secondary');
        this.numbers = [...document.querySelectorAll('[data-number]')];
        this.options = [...document.querySelectorAll('[data-option]')];
        this.operators = [...document.querySelectorAll('[data-operator]')];

        this.numbers.forEach(number => number.addEventListener('click', this.addNumber));
        this.options.forEach(option => option.addEventListener('click', this.addOption));
        this.operators.forEach(operator => operator.addEventListener('click', this.calculate));

        this.calculations = [];
        this.newNumber = false;
        this.reset = false;
        this.lastOperator = null;
        this.currentResult = 0;

        this.clear();

        this.result.addEventListener('input', this.adjustFontSize);
    }

    adjustFontSize = () => {
        if (resultInput.value.length >= 21) {
            resultInput.style.fontSize = '1.85rem';
        } else if (resultInput.value.length >= 20) {
            resultInput.style.fontSize = '1.95rem';
        } else if (resultInput.value.length >= 19) {
            resultInput.style.fontSize = '2rem';
        } else if (resultInput.value.length >= 18) {
            resultInput.style.fontSize = '2.12rem';
        } else if (resultInput.value.length >= 17) {
            resultInput.style.fontSize = '2.28rem';
        } else {
            resultInput.style.fontSize = '2.45rem';
        }
    }

    addNumber = (e) => {

        if (this.reset) this.clear();

        this.number = e.target.textContent;

        if (this.result.value === '0') this.result.value = this.number;
        else if (this.newNumber) this.result.value = this.number;
        else if (this.result.value.length < 21) this.result.value += this.number;

        this.result.value = this.formatInputNumber(this.result.value);

        this.newNumber = false;
        this.adjustFontSize();
    }

    formatInputNumber = (num) => {
        let numStr = num.replace(/,/g, ''); // remove existing commas
        let numParts = numStr.split('.'); // separate integer and decimal parts
        let integerPart = numParts[0];
        let decimalPart = numParts[1] || '';

        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // add commas to integer part

        return integerPart + (decimalPart ? '.' + decimalPart : '');
    }

    addOption = (e) => {

        this.option = e.target.dataset.option;
        this.lastChar = this.result.value[this.result.value.length - 1];

        if (this.option === 'dot') {
            (this.lastChar === '.' || this.result.value.indexOf('.') !== -1)
                ? this.result.value
                : this.result.value += '.';
        }

        else if (this.option === 'clearEntry') this.result.value = '0';

        else if (this.option === 'clear') this.clear();

        else if (this.option === 'reverse') this.result.value = this.result.value * -1;

        else if (this.option === 'undo') {

            (this.result.value.length === 1)
                ? this.result.value = '0'
                : this.result.value = this.result.value.substring(0, this.result.value.length - 1);
        }
        this.adjustFontSize();
    }
    calculate = (e) => {

        this.operator = e.target.dataset.operator;
        this.value = Number(this.result.value.replace(/,/g, '')); // remove commas for calculation
        this.subRes.style.visibility = 'visible';

        if (this.operator === 'pow') {
            this.subRes.value = ` sqr(${this.result.value})`;
            this.result.value = Math.pow(this.value, 2).toLocaleString(); // keep commas in result
        }

        else if (this.operator === 'sqrt') {
            this.subRes.value = `√(${this.result.value})`;
            this.result.value = Math.sqrt(this.value).toLocaleString(); // keep commas in result
        }

        else if (this.operator === 'fraction') {
            this.subRes.value = ` 1/(${this.result.value})`;
            this.result.value = (1 / this.value).toLocaleString(); // keep commas in result
        }

        else if (this.operator === 'percent') {
            this.result.value = parseFloat(((this.currentResult * this.value) / 100).toPrecision(14)).toLocaleString(); // keep commas in result
        }

        else {

            if (this.operator === 'equal' && this.newNumber && this.lastOperator !== null && this.lastOperator !== 'equal') {

                if (this.calculations.length > 2)
                    this.value = this.calculations.map(item => item).reverse().find(item => typeof item === 'number');

                this.calculations = [this.currentResult, Calculations.returnOperator(this.lastOperator), this.value, Calculations.returnOperator(this.operator)];

                this.currentResult = Calculations.doMath(this.currentResult, this.value, this.lastOperator);
                this.currentResult = (parseFloat(this.currentResult.toPrecision(14)));

                this.result.value = this.currentResult.toLocaleString(); // keep commas in result
                this.subRes.value = this.calculations.join(' ');

            } else {

                if (this.newNumber) {
                    this.lastOperator = this.operator;
                    this.calculations[this.calculations.length - 1] = Calculations.returnOperator(this.operator);
                    this.subRes.value = this.calculations.join(' ');
                    this.reset = false;
                    return;
                }

                (this.lastOperator === null)
                    ? this.currentResult = this.value
                    : this.currentResult = Calculations.doMath(this.currentResult, this.value, this.lastOperator);

                (this.operator !== 'equal')
                    ? this.lastOperator = this.operator
                    : this.reset = true;

                this.newNumber = true;
                this.calculations.push(this.value);
                this.calculations.push(Calculations.returnOperator(this.operator));

                this.currentResult = (parseFloat(this.currentResult.toPrecision(14)));
                this.result.value = this.currentResult.toLocaleString(); // keep commas in result

                this.subRes.value = this.calculations.join(' ');
            }
        }
        this.adjustFontSize();
    }

    clear = () => {
        this.subRes.style.visibility = 'hidden';
        this.result.value = '0';
        this.subRes.value = '';
        this.calculations = [];
        this.newNumber = false;
        this.reset = false;
        this.lastOperator = null;
        this.currentResult = 0;
    }
}

// Calculations
class Calculations {

    static doMath = (currentResult = null, value = null, operator = null) => {

        switch (operator) {
            case 'plus':
                return currentResult + value;

            case 'minus':
                return currentResult - value;

            case 'multiply':
                return currentResult * value;

            case 'divide':
                return currentResult / value;
        }
    }

    static returnOperator = (operator = null) => {

        switch (operator) {
            case 'plus':
                return '+';

            case 'minus':
                return '−';

            case 'multiply':
                return '×';

            case 'divide':
                return '÷';

            case 'equal':
                return '=';
        }
    }
}