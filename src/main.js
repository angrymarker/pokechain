const { Blockchain, Transaction } = require('./blockchain');
const keygenerator = require('./keygenerator');
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
	else
	{
		json = JSON.stringify(json);
		try
		{
			//fs.writeFile(config.Main.blockchainfile, json, 'utf8', function(data){}); // write it back 
			fs.writeFileSync(config.Main.blockchainfile, json); // write it back 
		}
		catch (err)
		{
			console.log(err);
		}
	}
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

function mineTransactions(rewardaddr, nonce = 0) {
	var result = pokechain.minePendingTransactions(rewardaddr, nonce);
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

module.exports.getUserTransactions = function(addr)
{
	var txs = pokechain.getUserTransactions(addr);
	return txs;
}

module.exports.getPokemonTransactions = function(pid)
{
	var txs = pokechain.getPokemonTransactions(pid);
	return txs;
}

module.exports.getPendingTransactions = function()
{
    var pt = pokechain.getPendingTransactions();
    return pt;
}

module.exports.getNonceData = function()
{
    var nonces = pokechain.getNonceData();
    return nonces;
}

function addTransaction(fromaddr, toaddr, pokemon, key)
{
	console.log(pokemon);
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

function renamePokemon(owner, pokemon, key, newname)
{
	if (pokemon == null || owner == null || key == null || newname == null)
	{
		throw new Error('Unable to rename! Please make sure all data is entered.');
	}
	var userbox = pokechain.getUserPokebox(owner);
	pokemon = selectfrompokebox(pokemon, userbox);
	var oo = pokemon[0].OriginalOwner;
	if (oo == owner)
	{
		pokemon[0].Nickname = newname;
		const tx1 = new Transaction(owner, owner, pokemon);
		tx1.signTransaction(key);
		pokechain.addTransaction(tx1);
		return "Renamed Pokemon!";
	}
	else
	{
		console.log(oo);
		console.log(owner);
		throw new Error('Only the Original Owner can change the nickname!');
	}
}

module.exports.renamePokemon = renamePokemon;


function addNoteToNotechain(owner, pokemon, key, note)
{
	if (pokemon == null || owner == null || key == null || note == null)
	{
		throw new Error('Unable to add note! Please make sure all data is entered.');
	}
	console.log(pokemon);
	var userbox = pokechain.getUserPokebox(owner);
	pokemon = selectfrompokebox(pokemon, userbox);
	
	if (pokemon[0].Notechain == null)
	{
		pokemon[0].Notechain = [];
	}
	pokemon[0].Notechain.push(note);
	const tx1 = new Transaction(owner, owner, pokemon);
	tx1.signTransaction(key);
	pokechain.addTransaction(tx1);
	return "Added note!";
}

module.exports.addNoteToNotechain = addNoteToNotechain;

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

function generatekey(curve = 'secp256k1')
{
	var key = keygenerator.generatekey(curve);
	var keyc = this.grabKey(key.privateKey);
	return keyc;
}

module.exports.generatekey = generatekey;

function presentMiningChallenge()
{
	var block = pokechain.presentMiningChallenge();
	block = JSON.stringify(block);
	return block;
}

module.exports.presentMiningChallenge = presentMiningChallenge;

function validateMiningChallenge(blockid, nonce)
{
	var result = pokechain.validateMiningChallenge(blockid, nonce);
	return result;
}

module.exports.validateMiningChallenge = validateMiningChallenge;

function setReward()
{
	var reward = calculateReward();
	pokechain.setReward(6);
}

function calculateReward(nonce, pendingTransactions)
{
	var reward = 1;
	if (nonce > 500)
	{
		reward = reward + 1;
	}
	if (nonce > 5000)
	{
		reward = reward + 1;
	}
	if (nonce > 50000)
	{
		reward = reward + 1;
	}
	if (pendingTransactions > 10)
	{
		reward = reward + 1;
	}
	if (pendingTransactions > 100)
	{
		reward = reward + 1;
	}
	if (pendingTransactions > 1000)
	{
		reward = reward + 1;
	}
}

function init()
{
	const chain = loadblockchain();
	pokechain = new Blockchain(chain);
	console.log('loaded chain');
}

init();
