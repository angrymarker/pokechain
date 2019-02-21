const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const config = require('../config/config.json');
var fs = require('fs');
var pokechain;

function updatejsonfile(json)
{
	if (json == null)
	{
		throw new Error('Chain is blank! Unable to save.');
	}
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
		if (chain.length == 0)
		{
			return null;
		}
		return chain;
	}
	else
	{
		//download chain and return it
		return null;
	}
}

function selectfrompokebox(id, userbox)
{
	for (var p = 0; p < userbox.length; p++)
	{
		var pokemon;
		try
		{
			pokemon = JSON.parse(userbox[p]);
			//pokemon = userbox[p];
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

function mineTransactions(rewardaddr) {
	var result = pokechain.minePendingTransactions(rewardaddr);
	updatejsonfile(pokechain.chain);
	return result;
}
module.exports.mineTransactions = mineTransactions;

module.exports.getUserbox = function(addr)
{
	if (addr == null)
	{
		throw new Error('Please provide an address to grab the user box for.');
	}
	var userbox = pokechain.getUserPokebox(addr);
	userbox = JSON.stringify(userbox);
	userbox = JSON.parse(userbox);
	return userbox;
}

function addTransaction(fromaddr, toaddr, pokemon, key)
{
	if (pokemon == null || fromaddr == null || toaddr == null || key == null)
	{
		throw new Error('Unable to post transaction! Please make sure all data is entered.');
	}
	var userbox = pokechain.getUserPokebox(fromaddr);
	pokemon = selectfrompokebox(pokemon, userbox);
	
	if (pokemon == -1)
	{
		throw new Error('You can\'t trade a pokemon you don\'t have!');
	}
	else
	{
		const tx1 = new Transaction(fromaddr, toaddr, pokemon);
		tx1.signTransaction(key);
		pokechain.addTransaction(tx1);
		return "Transaction Complete!";
	}
	return "Transaction failed";
}
module.exports.addTransaction = addTransaction;

function grabkey(privatekey)
{
	if (privatekey == null)
	{
		throw new Error('Missing private key!');
	}
	const Key = ec.keyFromPrivate(privatekey);
	return Key;
}
module.exports.grabKey = grabkey;

function init()
{
	const chain = loadblockchain();
	pokechain = new Blockchain(chain);
	console.log('loaded chain');
}
init();