const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const config = require('../config/config.json');
var fs = require('fs');
var pokechain;

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



module.exports = function() {
	const chain = loadblockchain();
	pokechain = new Blockchain(chain);
	console.log('loaded chain');
}

function mineTransactions(rewardaddr) {
	pokechain.minePendingTransactions(rewardaddr);
	updatejsonfile(pokechain.chain);
}
module.exports.mineTransactions = mineTransactions;

module.exports.getUserbox = function(addr)
{
	var userbox = pokechain.getUserPokebox(addr);
	return userbox;
}

function testme(fromaddr, toaddr, pokemon, key)
{
	var userbox = pokechain.getUserPokebox(fromaddr);
	console.log(pokemon);
	pokemon = selectfrompokebox(pokemon, userbox);
	console.log('tested');
	if (pokemon == -1)
	{
		throw new Error('You can\'t trade a pokemon you don\'t have!');
	}
	else
	{
		const tx1 = new Transaction(fromaddr, toaddr, pokemon);
		tx1.signTransaction(key);
		pokechain.addTransaction(tx1);
	}
}
module.exports.addTransaction = testme;

function grabkey(privatekey)
{
	const Key = ec.keyFromPrivate(privatekey);
	return Key;
}
module.exports.grabKey = grabkey;