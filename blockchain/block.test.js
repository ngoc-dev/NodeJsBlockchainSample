const Block = require('./block');

describe('Block', () => {

  let data, lastBlock, block;

  // テスト対象を初期化する時に使う。 beforeEach
  beforeEach( () => {
    data = 'sato';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('data test', () => {
    expect(block.data).toEqual(data);
    //expect(block.data).toEqual("suzuki");
  });

  it('hash test', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
    //expect(block.lastHash).toEqual("test");
  });

  // ハッシュ値として、指定難易度の数だけ、先頭にゼロが並んでいるはず、らしい。
  it('指定難易度のハッシュ値生成テスト', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    console.log(block.toString());
  });

  it('低速ブロック採掘で難易度を下げるテスト', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 36000)).toEqual(block.difficulty - 1);
  });

  it('高速ブロック採掘で難易度を上げるテスト', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });

});
