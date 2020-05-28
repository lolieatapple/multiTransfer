const Web3 = require('web3');
const fs = require('fs');
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };


/*********** Fill Information Here ****************** */
const chainId = 1; // 1:mainnet, 3:testnet
/**************************************************** */

const nodeUrlTestnet = "https://gwan-ssl.wandevs.org:46891"; // testnet
const nodeUrlMainnet = "https://gwan-ssl.wandevs.org:56891"; // testnet
const nodeUrl = chainId === 1 ? nodeUrlMainnet : nodeUrlTestnet;

let web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));

async function main() {
  let output = JSON.parse(fs.readFileSync('txData.json', 'utf8'));
  console.log(output);
  for (let i = 0; i < output.length; i++) {
    await sendTx(output[i].raw);
  }
}

async function sendTx(rawTx) {
  let times = 5;
  while (times > 0) {
    try {
      const receipt = await web3.eth.sendSignedTransaction(rawTx);
      if (receipt.status == true && receipt.logs.length > 0) {
        console.log('tx success');
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