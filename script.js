// Top of script.js
let income = 0;
let expenses = 0;
let myChart; // Global variable for the chart

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

document.getElementById('reset-btn').addEventListener('click', () => {
    // 1. Clear the "Engine" (Data)
    income = 0;
    expenses = 0;
    localStorage.clear(); // Wipes everything from the browser memory

    // 2. Clear the "Dashboard" (UI)
    // Double-check these IDs match your HTML exactly!
    document.getElementById('total-income').textContent = "$0";
    document.getElementById('total-expenses').textContent = "$0";
    document.getElementById('balance').textContent = "$0";
    
    // Clear the list of items if you have one
    const list = document.getElementById('transaction-list');
    if (list) list.innerHTML = ""; 

    // 3. Clear the "Visuals" (Chart)
    if (myChart) {
        myChart.destroy(); // Deletes the old chart object
        renderChart(0, 0); // Draws a fresh, empty chart
    }
    
    alert("System Reset Complete.");
});

const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
    // A professional safety check
    const isConfirmed = confirm("Warning: This will permanently delete all your expense data. Continue?");
    
    if (isConfirmed) {
        performReset(); // Call your reset logic here
    }
});
