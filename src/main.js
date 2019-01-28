const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const config = require('../config/config.json');
var fs = require('fs');

// Your private key goes here
const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
console.log("key " + myKey);
// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');
console.log("wallet " + myWalletAddress);

//create pokecoins 
const chain = loadblockchain();
var pokecoins = new Blockchain(chain);

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

// Create first transaction
createtransaction(myWalletAddress, 'address2', 'fCIZv6UQe2PsHhdi00AFF');

// Mine block
pokecoins.minePendingTransactions(myWalletAddress);

// Create second transaction
createtransaction(myWalletAddress, 'address2', 'TXBfs2UaEIqsM5kHoNZJ_');

// Mine block
pokecoins.minePendingTransactions(myWalletAddress);

//console.log(`Balance of xavier is ${pokecoins.getUserPokebox(myWalletAddress)}`);
var pokebox = pokecoins.getUserPokebox(myWalletAddress);

for (var p = 0; p < pokebox.length; p++)
{
	var pokemon = JSON.parse(pokebox[p]);
	pokemon = pokemon.Pokemon;
	//console.log(pokemon.id + " - " + pokemon.name.english);
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
function selectfrompokebox(id, userbox)
{
	for (var p = 0; p < userbox.length; p++)
	{
		var pokemon;
		try
		{
			pokemon = JSON.parse(userbox[p]);
		}
		catch
		{
			pokemon = userbox[p];
		}
		var compid = pokemon.id;
		if (compid == id)
		{
			return [pokemon];
		}
	}
	return -1;
}

function createtransaction(fromaddr, toaddr, pokemon)
{
	var userbox = pokecoins.getUserPokebox(fromaddr);
	pokemon = selectfrompokebox(pokemon, userbox);
	console.log("here");
	if (pokemon == -1)
	{
		throw new Error('You can\'t trade a pokemon you don\'t have!');
	}
	else
	{
		//can trade
		const tx1 = new Transaction(fromaddr, toaddr, pokemon);
		tx1.signTransaction(myKey);
		pokecoins.addTransaction(tx1);
	}
	
}