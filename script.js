const form = document.getElementById("financeForm");
const list = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("finalBalance");
const monthFilter = document.getElementById("monthFilter");
const categoryFilter = document.getElementById("categoryFilter");
const clearBtn = document.getElementById("clearDataBtn");
const languageBtn = document.getElementById("languageBtn");

const incomeLabel = document.getElementById("incomeLabel");
const expenseLabel = document.getElementById("expenseLabel");
const balanceLabel = document.getElementById("balanceLabel");
const addBtn = document.getElementById("addBtn");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const typePlaceholder = document.getElementById("typePlaceholder");
const categoryPlaceholder = document.getElementById("categoryPlaceholder");

const descriptionInput = document.getElementById("description");
const valueInput = document.getElementById("value");
const dateInput = document.getElementById("date");

let transactions = JSON.parse(localStorage.getItem("expensescontrol_transactions")) || [];
let currentLanguage = "pt";


function saveToLocalStorage() {
    localStorage.setItem("expensescontrol_transactions", JSON.stringify(transactions));
}


function formatCurrency(value) {
    return currentLanguage === "pt"
        ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}


form.addEventListener("submit", function (e) {
    e.preventDefault();
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();
    const value = parseFloat(valueInput.value);
    const category = categorySelect.value;
    const date = dateInput.value;

    if (!type || !description || value <= 0 || !category || !date) {
        alert(currentLanguage === "pt" ? "Preencha todos os campos corretamente." : "Fill all fields correctly.");
        return;
    }

    transactions.push({ id: Date.now(), type, description, value, category, date });
    saveToLocalStorage();
    form.reset();
    render();
});


function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    render();
}


function getFilteredTransactions() {
    let filtered = [...transactions];
    if (monthFilter.value) filtered = filtered.filter(t => t.date.startsWith(monthFilter.value));
    if (categoryFilter.value) filtered = filtered.filter(t => t.category === categoryFilter.value);
    return filtered.sort((a,b)=>new Date(b.date)-new Date(a.date));
}


function render() {
    list.innerHTML = "";
    const filtered = getFilteredTransactions();

    let totalIncome = 0, totalExpense = 0;

    filtered.forEach(t=>{
        const li = document.createElement("li");
        const sign = t.type==="income"?"+":"-";
        const color = t.type==="income"?"#7ee787":"#ff7b72";

        li.innerHTML = `<span>${t.date} | ${t.description} (${t.category})</span>
        <span style="color:${color}">${sign} ${formatCurrency(t.value)}
        <button onclick="deleteTransaction(${t.id})" style="margin-left:10px;background:none;border:none;color:#aaa;cursor:pointer;">✖</button>
        </span>`;

        li.classList.add(t.type);
        list.appendChild(li);

        if(t.type==="income") totalIncome+=t.value;
        else totalExpense+=t.value;
    });

    const balance = totalIncome - totalExpense;
    totalIncomeEl.textContent = formatCurrency(totalIncome);
    totalExpenseEl.textContent = formatCurrency(totalExpense);
    balanceEl.textContent = formatCurrency(balance);

    balanceEl.classList.remove("negative","positive");
    balanceEl.classList.add(balance<0?"negative":"positive");

    updateMonthOptions();
    updateLabels();
}


function updateMonthOptions() {
    const months = [...new Set(transactions.map(t=>t.date.slice(0,7)))];
    monthFilter.innerHTML = `<option value="">${currentLanguage==="pt"?"Mês":"Month"}</option>`;
    months.forEach(m=>{
        const option=document.createElement("option");
        option.value=m;
        option.textContent=m;
        monthFilter.appendChild(option);
    });
}


clearBtn.addEventListener("click", ()=>{
    if(confirm(currentLanguage==="pt"?"Deseja apagar todos os dados?":"Delete all data?")){
        transactions=[];
        saveToLocalStorage();
        render();
    }
});


languageBtn.addEventListener("click", ()=>{
    currentLanguage = currentLanguage==="pt"?"en":"pt";
    languageBtn.textContent = currentLanguage==="pt"?"EN":"PT";
    render();
});


function updateLabels(){
    if(currentLanguage==="pt"){
        incomeLabel.textContent="Receitas";
        expenseLabel.textContent="Despesas";
        balanceLabel.textContent="Saldo";
        addBtn.textContent="Adicionar";
        typePlaceholder.textContent="Tipo";
        categoryPlaceholder.textContent="Categoria";
        descriptionInput.placeholder="Descrição";
        valueInput.placeholder="Valor";
        dateInput.placeholder="";
        monthFilter.options[0].textContent="Mês";
        categoryFilter.options[0].textContent="Categoria";

        typeSelect.options[1].textContent="Receita";
        typeSelect.options[2].textContent="Despesa";

        categorySelect.options[1].textContent="Alimentação";
        categorySelect.options[2].textContent="Transporte";
        categorySelect.options[3].textContent="Lazer";
        categorySelect.options[4].textContent="Moradia";
        categorySelect.options[5].textContent="Outros";

        clearBtn.textContent="Limpar";
    }else{
        incomeLabel.textContent="Income";
        expenseLabel.textContent="Expenses";
        balanceLabel.textContent="Balance";
        addBtn.textContent="Add";
        typePlaceholder.textContent="Type";
        categoryPlaceholder.textContent="Category";
        descriptionInput.placeholder="Description";
        valueInput.placeholder="Value";
        dateInput.placeholder="";
        monthFilter.options[0].textContent="Month";
        categoryFilter.options[0].textContent="Category";

        typeSelect.options[1].textContent="Income";
        typeSelect.options[2].textContent="Expense";

        categorySelect.options[1].textContent="Food";
        categorySelect.options[2].textContent="Transport";
        categorySelect.options[3].textContent="Leisure";
        categorySelect.options[4].textContent="Housing";
        categorySelect.options[5].textContent="Others";

        clearBtn.textContent="Clear";
    }
}


monthFilter.addEventListener("change",render);
categoryFilter.addEventListener("change",render);


render();