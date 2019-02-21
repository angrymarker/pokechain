# PokeChain
A from-scratch block chain, drawing inspiration from Nimiq. Made to inspire you to collect all the pokemon

## Features
  * SHA256 encryption
  * Pokemon based collectible cryptocurrency
  * Bitcoin based mining scheme
  * Basic tamper prevention including chain reversion on faulty block creation

## Usage
### Require file 
```javascript
//Need to update require location
const pokechain = require('pokechain');
```

### Initialize blockchain
```javascript
//pokecoin is not used after this, looking into dropping this requirement
var pokecoin = new pokechain();
```

### "Create" a wallet
```javascript
//You have 2 options to create a key/wallet, based on the private key. You can use an eliptic curve to create one
var newkey = pokechain.generatekey(); //uses 'secp256k1' curve by default
console.log(newkey);
var key = newkey;

//Alternatively you can pass a custom string/privatekey to generate a keyset. Highly recommended to have a large string to increase security
var key = pokechain.grabKey('Enter a private key here');

//Public key is their address, should be known by whoever he wants to interact with 
const curraddr = key.getPublic('hex');

//Ensure user remembers private key, and is secret to them
//It will be needed for transactions. 
```

### Mine a block 
```javascript
//Miner is awarded 6 pokemon
//This mines using the server. Looking into client side mining.
var result = pokechain.mineTransactions(curraddr);
console.log(result); //Returns "Transaction Complete!" or an error
```

### Find "Balance"
```javascript
//This crawls the blockchain, finding all transactions involving the curraddr, and consolidating down as needed
//Json array object
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
### Config
```javascript
//Recommended to change location for accessibility and prevent overwriting
"Main": {
   "blockchainfile": "./data/blockchain.json"
 }
 //Change available pokemon
 {
 "Pokemon": {
   "MinID": 1,    //based on pokedex, this is bulbasaur
   "MaxID": 809,  //based on pokedex, this is melmetal. change to 151 if you want just gen 1
   "ShinyMin": 0,    //Update shiny odds. Generates a random number. If the number == 420, is shiny
   "ShinyMax": 8191, //Odds match that of actual games. Update for special events if you want
   "StatsMin": 0,    //Update IV odds. IVs are from 0-31. 
   "StatsMax": 31    //Update for special events if you want. 31 is "perfect"
 },
```

## Contributions
Any and all contributions/feedback welcome!
