const Transaction = require('../wallet/transaction'); // 5-36

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if(transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  // 5-36
  validTransactions() {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce(
        (total, output) => { return total + output.amount; }, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`不正な取引です。 ${transaction.input.address}`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`不正な署名です。 ${transaction.input.address}`);
        return;
      }

      return transaction;
    });
  }

  // 5-38
  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
