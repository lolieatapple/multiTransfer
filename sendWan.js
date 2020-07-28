const wanHelper = require('./wanchain-helper');

const erc20Abi = require('./erc20abi.json');
const Web3 = require('web3');
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };


/*********** Fill Information Here ****************** */
// Should have some WAN for gas fee
let fromAddr = ""; 

const privateKey = ""; // without 0x prefix

const toAddr = "";

const amount = 0.01;

const chainId = 1; // 1:mainnet, 3:testnet
/**************************************************** */

const nodeUrlTestnet = "https://gwan-ssl.wandevs.org:46891"; // testnet
const nodeUrlMainnet = "https://gwan-ssl.wandevs.org:56891"; // testnet
const nodeUrl = chainId === 1 ? nodeUrlMainnet : nodeUrlTestnet;

console.log("Ready transfer to:", toAddr);
fromAddr = fromAddr.toLowerCase();
tokenSmartContractAddr = tokenSmartContractAddr.toLowerCase();

let web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
let contract = new web3.eth.Contract(erc20Abi, tokenSmartContractAddr);

async function main() {
  let nonce = await web3.eth.getTransactionCount(fromAddr);
  console.log('nonce:', nonce);

  await sendTx(toAddr, web3.utils.toWei(amount.toString()), nonce);
}

async function sendTx(toAddr, amount, nonce) {
  let times = 5;
  while (times > 0) {
    try {
      const rawTx = wanHelper.signTxWan(nonce, web3.utils.toWei(amount.toString()), privateKey, toAddr, chainId);
      const receipt = await web3.eth.sendSignedTransaction(rawTx);
      if (receipt.status == true && receipt.logs.length > 0) {
        console.log('tx success', toAddr, web3.utils.fromWei(amount));
        return;
      } else {
        console.log('tx failed');
        console.log('receipt:', receipt);
        process.exit(1);
      }
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