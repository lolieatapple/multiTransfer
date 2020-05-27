const WanTx = require('wanchainjs-tx');
const crypto = require('crypto');
const BN = require('bn.js');
const secp256k1 = require('secp256k1');
const util = require('ethereumjs-util');

function signTx(nonce, data, prvKey, to, chainId) {
  const txParams = {
    Txtype: 0x01,
    nonce: nonce,
    gasPrice: '0x3B9ACA00',
    gasLimit: '0x989680',
    to: to,
    value: '0x0',
    data: data,
    chainId: parseInt(chainId, 16),
  };

  // console.log(JSON.stringify(txParams));
  const privateKey = Buffer.from(prvKey, 'hex');

  const tx = new WanTx(txParams);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  return '0x' + serializedTx.toString('hex');
}

module.exports = {
  signTx
};
