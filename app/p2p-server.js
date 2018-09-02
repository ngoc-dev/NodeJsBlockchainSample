const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CAIN',
  transaction: 'TRANSACTION',
  clear_transaction: 'CLEAR_TRANSACTION'  // 5-39
};
console.log(`PORT=${P2P_PORT}, PEERS=${peers} .`);

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server( { port : P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));
    this.connectPeers();
  }

  connectPeers() {
    peers.forEach( peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
  }

  // 関数外だし
  sendChain(socket) {
    //socket.send(JSON.stringify(this.blockchain.chain));
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  // 同期メソッド・すべてのソケットに自分のブロックチェーンを送信していくテスト。
  syncChains() {
    this.sockets.forEach( socket => {
      this.sendChain(socket);
    });
  }

  // 5-34 
  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transaction: // 5-39
          this.transactionPool.clear();
          break;
      }
      // 5-34削除this.blockchain.replaceChain(data);
      console.log('data', data);
    });
  }

  // 5-34 全てのソケットへトランザクションをブロードキャストする
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  // 5-39
  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(
      JSON.stringify( {
        type: MESSAGE_TYPES.clear_transaction
      })
    ));
  }
}

module.exports = P2pServer;
