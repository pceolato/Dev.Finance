const Modal = {
  open() {
      //abrir modal
      //adicionar a class active modal 
      document.querySelector('.modal-overlay')
      .classList.add('active')
  },
  close () {
     //fehar modal
     //remover a class active modal
  document.querySelector('.modal-overlay')
      .classList.remove('active')
  }
}

const Storage = {

get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
  all: Storage.get(), 

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },
  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },
  incomes () {
    //somar as entradas
    let income = 0
    
    // pegar todas as transações
    // para cada transação
    Transaction.all.forEach(transaction => {
      //se for maior que 0 
      if(transaction.amount > 0) {
        income += transaction.amount;
      }
    }) 
    // retorna a variavel
    return income;


  },
  expenses() {
    //somar as saídas 
     let expense = 0
    
     // pegar todas as transações
     // para cada transação
     Transaction.all.forEach(transaction => {
       //se for menor que 0 
       if(transaction.amount < 0) {
         expense += transaction.amount;
       }
     }) 
     // retorna a variavel
     return expense;
 
  },
  total() {
    //entradas - saídas
    return Transaction.incomes() + Transaction.expenses();

  }
}

//colocar(substituir) as transações do meu ojeto JS no HTML
const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLtransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionContainer.appendChild(tr)
  },

  //mudar e incluir palavra para as classes do css
  innerHTMLtransaction(transaction,index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
    <tr>
      <td class="description">${transaction.description}</td>
      <td class=${CSSclass}>${amount}</td>
      <td class="data">${transaction.date}</td>
      <td>
        <img  onclick="Transaction.remove(${index})"src="./assets/minus.svg" alt="Remover Transação">
      </td>
    </tr>
    `
    return html
  },

  //colocar (substituir) as a soma de entradas e saidas do html
  updateBalance() {
    document
      .getElementById('incomeDisplay')
      //pegar os números reais de "Utils"
      .innerHTML = Utils.formatCurrency(
        Transaction.incomes()
      ) 

    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(
        Transaction.expenses())

    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(
        Transaction.total())
},

clearTransactions() {
  DOM.transactionContainer.innerHTML = ""
  }
}

//transformar os números do amount em números reais
const Utils = {
  formatAmount(value) {
    value = value * 100
    return Math.round(value)
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value 
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  formatValues(transaction) {
    let { description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)
    
    return {
      description,
      amount,
      date
    }
  },

  clearFileds() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  
  submit(event) {
    event.preventDefault()
    //verificar se todas as informações foram preenchidas
    // "required" no HTML
     
    //formatar os dados para salvar
    const transaction = Form.formatValues()

    //salvar
     Transaction.add(transaction)

    //apagar os dados do formulario
    Form.clearFileds()

    //modal feche
    Modal.close()
     
    //atualizar a aplicação
  }
}

const App = {
  init() {
    //**forEach** função existe para objetos do tipo array
    
    
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()

    Storage.set(Transaction.all)
    
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()



