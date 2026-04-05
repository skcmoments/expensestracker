const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = [];
let myChart = null;

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = Math.abs(amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0)).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;

    updateChart(income, expense);
}

function updateChart(income, expense) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            cutout: '80%'
        }
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedType = document.querySelector('input[name="type"]:checked').value;
    let amountVal = parseFloat(amount.value);

    // If 'expense' is picked, turn the number negative
    if (selectedType === 'expense') {
        amountVal = -Math.abs(amountVal);
    } else {
        amountVal = Math.abs(amountVal);
    }

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: text.value,
        amount: amountVal
    };

    transactions.push(transaction);
    updateValues();

    text.value = '';
    amount.value = '';
});

const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
    // 1. Confirm with the user
    if (confirm("Are you sure you want to clear all data?")) {
        
        // 2. Clear Data Variables
        income = 0;
        expenses = 0;
        transactionList = []; // If you have a list of items

        // 3. Clear Local Storage
        localStorage.removeItem('expenseData');

        // 4. Reset UI Text
        document.getElementById('total-income').innerText = "$0";
        document.getElementById('total-expenses').innerText = "$0";
        document.getElementById('balance').innerText = "$0";

        // 5. Reset the Chart
        if (myChart) {
            myChart.destroy(); // Completely removes the old chart
            renderChart(0, 0); // Re-draws an empty/zero chart
        }

        alert("Data cleared successfully!");
    }
});
