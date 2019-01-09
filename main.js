const blockchain = require('./src/blockchain.js');
const block = require('./src/block.js');
const pokegen = require('./src/pokemongenerator.js');
const config = require('./config/config.json');
var pokecoins;
var fs = require('fs');

function addblock(data)
{
	pokecoins.addBlock(block.CreateBlock(data, pokecoins.chain.length, 0));
	validatechain();
}

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
		pokecoins = new blockchain(null);
	}
}

loadblockchain();

addblock(pokegen.createblockdata());
addblock(pokegen.createblockdata());
addblock(pokegen.createblockdata());
addblock(pokegen.createblockdata());

updatejsonfile(pokecoins.chain);