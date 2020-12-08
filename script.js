"use strict";
// budget
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetFeedback = document.querySelector(".budget-feedback");
const budgetAmount = document.getElementById("budget-amount");
// expense
const expenseForm = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense-input");
const amountInput = document.getElementById("amount-input");
const expenseFeedback = document.querySelector(".expense-feedback");
const expenseList = document.getElementById("expense-list");
const expenseAmount = document.getElementById("expense-amount");
// balance
const balanceAmount = document.getElementById("balance-amount");
const balance = document.getElementById("balance");
// array of expense objects
let itemList = [];
let itemID = 0;

const totalExpense = () => {
  let total = 0;
  if (itemList.length > 0) {
    total = itemList.reduce((acc, curr) => {
      acc += curr.amount;
      return acc;
    }, 0);
  }
  expenseAmount.textContent = total;
  return total;
};

const showBalance = () => {
  const expense = totalExpense();
  const total = parseInt(budgetAmount.textContent) - expense;
  balanceAmount.textContent = total;
  if (total < 0) {
    balance.classList.remove("showGreen", "showBlack");
    balance.classList.add("showRed");
  } else if (total > 0) {
    balance.classList.remove("showRed", "showBlack");
    balance.classList.add("showGreen");
  } else if (total === 0) {
    balance.classList.remove("showRed", "showGreen");
    balance.classList.add("showBlack");
  }
};

const addExpense = (expense) => {
  const div = document.createElement("div");
  div.classList.add("expense");
  div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">
      <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
      <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
      <div class="expense-icons list-item">
        <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fa fa-edit"></i>
        </a>
        <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fa fa-trash"></i>
        </a>
      </div>
    </div>
  `;
  expenseList.appendChild(div);
};

const editExpense = (element) => {
  let id = parseInt(element.dataset.id);
  let parent = element.parentElement.parentElement.parentElement;
  expenseList.removeChild(parent);
  let expense = itemList.filter((item) => {
    return item.id === id;
  }) 
  expenseInput.value = expense[0].title;
  amountInput.value = expense[0].amount;
  let tempList = itemList.filter((item) => {
    return item.id !== id;
  })
  itemList = tempList;
  showBalance();
}


const deleteExpense = (element) => {
  let id = parseInt(element.dataset.id);
  let parent = element.parentElement.parentElement.parentElement;
  expenseList.removeChild(parent);
  let tempList = itemList.filter((item) => {
    return item.id !== id;
  })
  itemList = tempList;
  showBalance();
}


budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const budgetValue = budgetInput.value;
  if (budgetValue === "" || budgetValue < 0) {
    budgetFeedback.classList.add("showItem");
    budgetFeedback.innerHTML = "<p>Value cannot be empty or negative</p>";
    setTimeout(() => {
      budgetFeedback.classList.remove("showItem");
    }, 4000);
  } else {
    budgetAmount.textContent = budgetValue;
    budgetInput.value = "";
    showBalance();
  }
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const expenseValue = expenseInput.value;
  const amountValue = amountInput.value;
  if (expenseValue === "" || amountValue === "" || amountValue < 0) {
    expenseFeedback.classList.add("showItem");
    expenseFeedback.innerHTML = "<p>Values cannot be empty or negative</p>";
    setTimeout(() => {
      expenseFeedback.classList.remove("showItem");
    }, 4000);
  } else {
    let amount = parseInt(amountValue);
    expenseInput.value = "";
    amountInput.value = "";
    let expense = {
      id: itemID,
      title: expenseValue,
      amount: amount,
    };
    itemID++;
    itemList.push(expense);
    addExpense(expense);
    showBalance();
  }
});

expenseList.addEventListener('click', (e) => {
  if(e.target.parentElement.classList.contains('edit-icon')) {
    editExpense(e.target.parentElement);
  } else if(e.target.parentElement.classList.contains('delete-icon')) {
    deleteExpense(e.target.parentElement);
  }
})
