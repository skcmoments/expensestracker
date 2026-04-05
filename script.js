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

const ctx = document.getElementById('expenseChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [incomeValue, expenseValue],
            backgroundColor: ['#006ce1', '#6366f1'] // Using your portfolio colors
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true, // Keeps it a perfect circle
        plugins: {
            legend: {
                position: 'bottom', // Moves labels to the bottom for better centering
            }
        }
    }
});
