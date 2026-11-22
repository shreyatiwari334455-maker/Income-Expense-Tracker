
const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionList = document.getElementById("transactionList");

function loadTransactions() {
    try {
        const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
        return Array.isArray(savedTransactions) ? savedTransactions : [];
    } catch (error) {
        console.error("Unable to read saved transactions:", error);
        return [];
    }
}

let transactions = loadTransactions();

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function formatCurrency(value) {
    return `₹${value.toFixed(2)}`;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const desc = description.value.trim();
    const money = Number(amount.value);
    const transactionType = type.value;
    const transactionCategory = category.value.trim();
    const transactionDate = date.value;

    if (
        desc === "" ||
        !Number.isFinite(money) ||
        money <= 0 ||
        (transactionType !== "income" && transactionType !== "expense") ||
        transactionCategory === "" ||
        transactionDate === ""
    ) {
        alert("Please enter valid details!");
        return;
    }

    transactions.push({
        id: Date.now(),
        description: desc,
        amount: money,
        type: transactionType,
        category: transactionCategory,
        date: transactionDate
    });

    saveTransactions();
    displayTransactions();
    updateSummary();
    form.reset();
});

function displayTransactions() {
    transactionList.replaceChildren();

    if (transactions.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No transactions yet. Add your first transaction!";
        transactionList.appendChild(emptyMessage);
        return;
    }

    transactions.forEach(function (item) {
        const transactionAmount = Number(item.amount);

        const div = document.createElement("div");
        div.style.padding = "10px";
        div.style.borderBottom = "1px solid #ddd";

        const heading = document.createElement("h3");
        heading.textContent = item.description;

        const categoryText = document.createElement("p");
        categoryText.textContent = `Category: ${item.category}`;

        const dateText = document.createElement("p");
        dateText.textContent = `Date: ${item.date}`;

        const amountText = document.createElement("p");
        amountText.style.color = item.type === "income" ? "green" : "red";
        amountText.style.fontWeight = "bold";
        amountText.textContent =
            `${item.type === "income" ? "+" : "-"} ${formatCurrency(transactionAmount)}`;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteTransaction(item.id);
        });

        div.append(heading, categoryText, dateText, amountText, deleteButton);
        transactionList.appendChild(div);
    });
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (item) {
        const transactionAmount = Number(item.amount);
        if (!Number.isFinite(transactionAmount)) {
            return;
        }

        if (item.type === "income") {
            totalIncome += transactionAmount;
        } else if (item.type === "expense") {
            totalExpense += transactionAmount;
        }
    });

    income.textContent = formatCurrency(totalIncome);
    expense.textContent = formatCurrency(totalExpense);
    balance.textContent = formatCurrency(totalIncome - totalExpense);
}

function deleteTransaction(id) {
    transactions = transactions.filter(function (item) {
        return item.id !== id;
    });

    saveTransactions();
    displayTransactions();
    updateSummary();
}

displayTransactions();
updateSummary();
