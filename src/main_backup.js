const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const config = require('../config/config.json');
var fs = require('fs');

// Your private key goes here
const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

//create pokecoins 
const chain = loadblockchain();
var pokecoins = new Blockchain(chain);

function validatechain()
{
	if (pokecoins.checkValid() == true)
	{
		console.log('chain valid');
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
		return chain;
	}
	else
	{
		//download chain and return it
		return null;
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

//console.log(`Balance of xavier is ${pokecoins.getUserPokebox(myWalletAddress)}`);
var pokebox = pokecoins.getUserPokebox(myWalletAddress);

for (var p = 0; p < pokebox.length; p++)
{
	var pokemon = JSON.parse(pokebox[p]);
	pokemon = pokemon.Pokemon;
	console.log(pokemon.id + " - " + pokemon.name.english);
}

// Uncomment this line if you want to test tampering with the chain
// pokecoins.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
var pokecoinvalidity = pokecoins.isValid();
if (pokecoinvalidity == -1)
{
	console.log('Blockchain valid.');
}
else
{
	console.log('Blockchain invalid! Block id: ' + pokecoinvalidity);
	console.log('fixing');
	var fixedchain = [];
	for (var p = 0; p < pokecoinvalidity; p++)
	{
		fixedchain.push(pokecoins.chain[p]);
	}
	pokecoins.chain = fixedchain;
}
updatejsonfile(pokecoins.chain);
console.log('saved');
//loadblockchain();


