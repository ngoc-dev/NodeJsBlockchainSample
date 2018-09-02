const Wallet = require('./wallet');

const wallet = new Wallet();

console.log(wallet.toString());


// const Blockchain = require('./blockchain');

// const bc = new Blockchain();

// for ( let i = 0; i < 10; i++ ) {
//   console.log(bc.addBlock(`hello ${i}`).toString());
// }


// const Block = require('./block');

// const block = new Block("sato", "suzuki", "yamada", "kitagawa");

// //console.log(block.toString());
// //console.log(Block.genesis().toString());

// const fooBlock = Block.mineBlock(Block.genesis(), "hoge");

// console.log(fooBlock.toString());
