const wanHelper = require('./wanchain-helper');
// const toAddrs = require('./toAddrs.json');
const faucetAbi = require('./faucetAbi.json');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json');
const axios = require('axios');

const db = low(adapter);
db.defaults({ timestamp: 0 })
  .write();

const Web3 = require('web3');
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };


/*********** Fill Information Here ****************** */
// Should have some WAN for gas fee
let fromAddr = ""; 

const privateKey = ""; // without 0x prefix

let faucetScAddr = "0x428b9b49f68a71b320b4a2437b76c1cd7070466b";

const chainId = 3; // 1:mainnet, 3:testnet
/**************************************************** */

const nodeUrlTestnet = "https://gwan-ssl.wandevs.org:46891"; // testnet
const nodeUrlMainnet = "https://gwan-ssl.wandevs.org:56891"; // testnet
const nodeUrl = chainId === 1 ? nodeUrlMainnet : nodeUrlTestnet;

// console.log("Ready transfer to:", toAddrs);
// fromAddr = fromAddr.toLowerCase();

let web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
let faucet = new web3.eth.Contract(faucetAbi, faucetScAddr.toLowerCase());

async function main() {
  let sendInfo = [];
  let users = await faucet.methods.getUserInfo().call();
  console.log('users', users);
  let totalCnt = 0;
  let totalValue = 0;
  let timestamp = db.get('timestamp').value();
  let lastTimeStamp = timestamp;
  for (let i=0; i<users.length; i++) {
    if (Number(users[i].paidTime) <= Number(timestamp)) {
      continue;
    }

    let user = {
      address: users[i].user.toLowerCase(),
      amount: Math.random()*90000 + 10000
    };
    sendInfo.push(user);
    totalCnt++;
    totalValue += user.amount;
    lastTimeStamp = users[i].paidTime;
  }

  console.log('total cnt', totalCnt, 'total value', totalValue, sendInfo);


  let nonce = await web3.eth.getTransactionCount(fromAddr);
  let balance = await web3.eth.getBalance(fromAddr);

  console.log('nonce:', nonce);
  let toAddrs = sendInfo;

  for (let i = 0; i < toAddrs.length; i++) {
    await sendTx(toAddrs[i].address, toAddrs[i].amount, nonce);
    nonce++;
  }

  db.set('timestamp', lastTimeStamp).write();
  dingdingSend('今日申请storeman填表人数：' + totalCnt + ', 今日总发放WAN币：' + totalValue + ", 测试币剩余总量：" + web3.utils.fromWei(balance.toString()));
}

async function dingdingSend(msg) {
  let format = {
    "msgtype": "text",
    "text": {
      "content": msg
    },
  };
  let ret = await axios.post('https://oapi.dingtalk.com/robot/send?access_token=1dc5dac099ef42e0ba17927593b24d0f7b79460d5d7c3887cd4a81b1b6d70d83', format);
  console.log(ret.data);
}

async function sendTx(toAddr, amount, nonce) {
  let times = 5;
  while (times > 0) {
    try {
      const rawTx = wanHelper.signTxWan(nonce, "0x" + web3.utils.toBN(web3.utils.toWei(amount.toString())).toString('hex'), privateKey, toAddr, chainId);
      const receipt = await web3.eth.sendSignedTransaction(rawTx);
      if (receipt.status == true) {
        console.log('tx success', nonce, toAddr, amount.toString());
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