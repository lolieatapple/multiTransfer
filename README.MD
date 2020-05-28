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