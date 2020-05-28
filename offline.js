const wanHelper = require('./wanchain-helper');
const toAddrs = require('./toAddrs.json');
const erc20Abi = require('./erc20abi.json');
const Web3 = require('web3');
const fs = require('fs');
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };


/*********** Fill Information Here ****************** */
// Should have some WAN for gas fee
let keystorePath = "/Users/molin/Desktop/bf2.keystore.json";

let password = "";

let nonce = 15627;

let tokenSmartContractAddr = "";

const chainId = 1; // 1:mainnet, 3:testnet
/**************************************************** */

const keythereum = require("keythereum");
let keyPassword = password;

let keystoreStr = fs.readFileSync(keystorePath, "utf8");
let keystore = JSON.parse(keystoreStr);
let keyAObj = {version:keystore.version, crypto:keystore.crypto};
var rawPrivateKey = keythereum.recover(keyPassword, keyAObj);
let fromAddr = keystore.address.toLowerCase();
if (fromAddr.indexOf('0x') !== 0) {
  fromAddr = "0x" + fromAddr;
}
console.log('fromAddr:', fromAddr);
let privateKey = rawPrivateKey.toString('hex');
console.log('privateKey:', privateKey);

console.log("Ready transfer to:", toAddrs);
fromAddr = fromAddr.toLowerCase();
tokenSmartContractAddr = tokenSmartContractAddr.toLowerCase();

let web3 = new Web3();
let contract = new web3.eth.Contract(erc20Abi, tokenSmartContractAddr);
let output = [];

async function main() {
  console.log('nonce:', nonce);

  for (let i = 0; i < toAddrs.length; i++) {
    await sendTx(toAddrs[i].address, web3.utils.toWei(toAddrs[i].amount), nonce);
    nonce++;
  }

  fs.writeFileSync('txData.json', JSON.stringify(output, null, 4), { flag: 'w', encoding: 'utf8', mode: '0666' });
}

async function sendTx(toAddr, amount, nonce) {
  let times = 5;
  while (times > 0) {
    try {
      const data = contract.methods.transfer(toAddr.toLowerCase(), amount).encodeABI();
      const rawTx = wanHelper.signTx(nonce, data, privateKey, tokenSmartContractAddr, chainId);
      output.push({raw: rawTx});
      console.log('finish:', toAddr, amount, 'nonce:', nonce);
      return;
      // const receipt = await web3.eth.sendSignedTransaction(rawTx);
      // if (receipt.status == true && receipt.logs.length > 0) {
      //   console.log('tx success', toAddr, web3.utils.fromWei(amount));
      //   return;
      // } else {
      //   console.log('tx failed');
      //   console.log('receipt:', receipt);
      //   process.exit(1);
      // }
    } catch (error) {
      console.log(error);
      console.log('*******Failed! Retry After 5 seconds********');
      await sleep(5000);
    }
  }

  if (times <= 0) {
    console.log("Send Failed!");
    process.exit(1);
  }
}

main();