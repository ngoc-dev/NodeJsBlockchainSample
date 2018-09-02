# NodeJsBlockchainSample
ブロックチェーンのサンプルです。

## パッケージ
npm install nodemon --save-dev  
npm install crypto-js --save  
npm install jest --save-dev  
npm install body-parser --save  
npm install ws --save  
npm install elliptic --save  
npm install uuid --save  

## 内容
P2Pサーバー実装  
マイニング実装  
blockchain検証  

## 使い方
学習教材から抜粋。node.js(windows)で使えます。

起動方法  
windows power shell を使って、環境変数を指定して起動すれば、複数のノードを実行できます。

・ひとつめ  
```
npm run dev  
```

・ふたつめ  
```
$env:HTTP_PORT=3002  
$env:P2P_PORT=5002  
$env:PEERS="ws://localhost:5001"  
npm run dev  
```

・みっつめ
```
$env:HTTP_PORT=3003  
$env:P2P_PORT=5003  
$env:PEERS="ws://localhost:5002,ws://localhost:5002"  
npm run dev
```
 ：  
