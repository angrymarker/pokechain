const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

//create pokecoins 
const pokecoins = new Blockchain();

const config = require('../config/config.json');

var fs = require('fs');


function validatechain()
{
	if (pokecoins.checkValid() == true)
	{
		console.log(pokecoins);
	}
	else
	{
		console.log('blockchain invalid');
		pokecoins.fixChain();
	}
}

function updatejsonfile(json)
{
	json = JSON.stringify(json);
	fs.writeFile(config.Main.blockchainfile, json, 'utf8', function(data){}); // write it back 
}

function loadblockchain()
{
	var jsonfile = config.Main.blockchainfile;
	if (fs.existsSync(jsonfile) == true)
	{
		var chain = fs.readFileSync(jsonfile).toString();
		chain = JSON.parse(chain);
		pokecoins = new blockchain(chain);
	}
	else
	{
		pokecoins = new blockchain();
	}
}

const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
pokecoins.addTransaction(tx1);

// Mine block
pokecoins.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
pokecoins.addTransaction(tx2);

// Mine block
pokecoins.minePendingTransactions(myWalletAddress);

console.log();
console.log(`Balance of xavier is ${pokecoins.getUserPokebox(myWalletAddress)}`);

// Uncomment this line if you want to test tampering with the chain
// pokecoins.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', pokecoins.isValid() ? 'Yes' : 'No');

//loadblockchain();

//updatejsonfile(pokecoins.chain);

