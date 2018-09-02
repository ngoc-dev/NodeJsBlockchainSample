const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');

// 5-33
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const P2pServer = require('./p2p-server');

// 5-39
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();

app.use(bodyParser.json());

const bc = new Blockchain();
// 5-33
const wallet = new Wallet();
const tp = new TransactionPool();

const p2pServer = new P2pServer(bc, tp);  // 5-34
const miner = new Miner(bc, tp, wallet, p2pServer); // 5-39

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  console.log(`データは、 ${req.body.data}ですわ。`);
  console.log(`テストは、 ${req.body.test}です。`);
  const block = bc.addBlock(req.body.data);
  console.log(`ブロックが追加されました。 ${block.toString()}`);
  p2pServer.syncChains();  // 5-23
  res.redirect('/blocks');
});

// 5-33
app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

// 5-33
app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);
  // リダイレクトする。
  res.redirect('/transactions');
});

// 5-35 公開鍵の取得API
app.get('/public-key', (req, res) => {
  res.json({publickey : wallet.publicKey});
});

// 5-39 取引の採掘API
app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`ブロックが生成されました。 ${block.toString()}`);
  res.redirect('/blocks');
});


app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

p2pServer.listen();
