const wanHelper = require('./wanchain-helper');
const toAddrs = require('./toAddrs.json');
const erc20Abi = require('./erc20abi.json');
const Web3 = require('web3');
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };


/*********** Fill Information Here ****************** */
// Should have some WAN for gas fee
let fromAddr = ""; 

const privateKey = ""; // without 0x prefix

let tokenSmartContractAddr = "";

const chainId = 3; // 1:mainnet, 3:testnet
/**************************************************** */

const nodeUrlTestnet = "https://gwan-ssl.wandevs.org:46891"; // testnet
const nodeUrlMainnet = "https://gwan-ssl.wandevs.org:56891"; // testnet
const nodeUrl = chainId === 1 ? nodeUrlMainnet : nodeUrlTestnet;

console.log("Ready transfer to:", toAddrs);
fromAddr = fromAddr.toLowerCase();
tokenSmartContractAddr = tokenSmartContractAddr.toLowerCase();

let web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
let contract = new web3.eth.Contract(erc20Abi, tokenSmartContractAddr);

async function main() {
  let nonce = await web3.eth.getTransactionCount(fromAddr);
  console.log('nonce:', nonce);

  for (let i = 0; i < toAddrs.length; i++) {
    await sendTx(toAddrs[i].address, web3.utils.toWei(toAddrs[i].amount), nonce);
    nonce++;
  }
}

async function sendTx(toAddr, amount, nonce) {
  let times = 5;
  while (times > 0) {
    try {
      const data = contract.methods.transfer(toAddr.toLowerCase(), amount).encodeABI();
      const rawTx = wanHelper.signTx(nonce, data, privateKey, tokenSmartContractAddr, chainId);
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