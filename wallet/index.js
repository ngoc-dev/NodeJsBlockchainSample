const Transaction = require('./transaction'); // 5-32
const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }

  // 署名
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  // 5-32
  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);
    if (amount > this.balance) {
      console.log(`金額: ${amount} が残高超過しています。`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  // 5-40 
  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(
      block => block.data.forEach(
        t => {
          transactions.push(t);
        }
      )
    );

    const walletInputTs = transactions.filter(
      t => t.address === this.publicKey
    );

    let startTime = 0;

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) =>
          prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInputT.outputs.find(
        output =>
          output.address === this.publicKey
      ).amount;

      startTime = recentInputT.input.timestamp;

      transactions.forEach(
        t => {
          if (t.input.timestamp > startTime) {
            t.outputs.find(
              output => {
                if (output.address === this.publicKey) {
                  balance += output.amount;
                }
              }
            )
          }
        }
      );
    }

    return balance;
  }  

  // 5-37 ブロックチェーン口座を作成するメソッド
  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-address';
    return blockchainWallet;
  }
}

module.exports = Wallet;
