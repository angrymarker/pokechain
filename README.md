# PokeChain
A from-scratch block chain, drawing inspiration from Nimiq. Made to inspire you to collect all the pokemon

## Features
  * SHA256 encryption
  * Pokemon based collectible cryptocurrency
  * Bitcoin based mining scheme
  * Basic tamper prevention including chain reversion on faulty block creation

## Usage
### Require file file
```javascript
//Need to update require location
const pokechain = require('./main.js');
```

### Initialize blockchain
```javascript
//pokecoin is not used after this, looking into dropping this requirement
var pokecoin = new pokechain();
```

### 'Create' a wallet
```javascript
//Ensure user remembers private key, and is secret to them
var key = pokechain.grabKey('Enter a private key here');
//Public key is their address, should be known by whoever he wants to interact with 
const curraddr = key.getPublic('hex');
```

### Mine a block 
```javascript
//Miner is awarded 6 pokemon
pokechain.mineTransactions(curraddr);
```

### Find "Balance"
```javascript
//This crawls the blockchain, finding all transactions involving the curraddr, and consolidating down as needed
var userbox = pokechain.getUserbox(curraddr);
```

### Create a transaction
```javascript
//If you need a a pokemon id to trade:
//Had issues when not using JSON.parse - to fix
var pokemonid = JSON.parse(userbox[0]);
pokemonid = pokemonid.id;

//Create transaction
pokechain.addTransaction(curraddr, "recievingaddr", pokemonid, key);
```



## Contributions
Any and all contributions/feedback welcome!
