# MULTI TRANSFER TOKENS

# ONLINE USAGE

Fill fromAddr, privateKey, tokenSmartContractAddr in index.js.

```
/*********** Fill Information Here ****************** */
// Should have some WAN for gas fee
let fromAddr = "";   

const privateKey = ""; // without 0x prefix

let tokenSmartContractAddr = "";

const chainId = 1; // 1:mainnet, 3:testnet
/**************************************************** */
```

Fill To Addresses and amount in toAddrs.json

```
[
    {
        "address":"0x5c7803c933c909727CEc5FB27A7DA10f7CC5a48f",
        "amount":"1.234"
    },{
        "address":"0x58e99F9c970868A58e9a4D4050D2572d03B4f801",
        "amount":"2.234"
    },{
        "address":"0x26Db909964f62216C907bE4E1dfCa2f7D67bf54f",
        "amount":"3.234"
    }
]
```

Run command to execute:

```
npm i
node index.js

```

# OFFLINE USAGE

Please use offline.js, online.js


1) download the script: git clone https://github.com/lolieatapple/multiTransfer

After you have cloned the script locally, enter the multiTranfer directory and run `npm i`

2) copy the script directory to the offline computer after installation;

3) modify the `toAddrs.json` file and fill in the transfer address and amount;

4) open `offline.js` in offline computer, and modify it according to the following figure:

```
let keystorePath

let password

let nonce

let tokenSmartContractAddr

const chainId
```

The value of Nonce can be obtained from the online wallet. After filling in, the value will be automatically increased:

5) run `node offline.js` on the offline computer after saving

6) copy `txdata.json` generated in the directory to the script directory of the online computer;

7) execute `node online.js` on the online computer

8) done.
