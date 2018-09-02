const ChainUtil = require('../chain-util');

// 5-37
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, receipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`金額: ${amount} が残高を超過しております。`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    // 取引明細に起票する。
    this.outputs.push( { amount, address: receipient});
    // トランザクションに署名する
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static newTransaction(senderWallet, receipient, amount) {
    if ( amount > senderWallet.balance) {
      console.log(`金額： ${amount}が残高超過しています`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, 
      [
        {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
        {amount, address: receipient}
      ]);

    // const transaction = new this();

    // transaction.outputs.push(...[
    //   { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
    //   { amount, address: receipient}
    // ]);

    // this.signTransaction(transaction, senderWallet);

    // return transaction;
  }

  // 5-37 報酬受け取りメソッド
  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet,
      [
        {amount: MINING_REWARD, address: minerWallet.publicKey}
      ]);
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
