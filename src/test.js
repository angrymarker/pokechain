//Create the blockchain
const pokechain = require('./main.js');

var key;
var key2;
var addr;
var addr2;

//basictest();

testclientmining();

function testwallet()
{
	key = pokechain.grabKey('test');
	key2 = pokechain.grabKey('test2');
	addr2 = key2.getPublic('hex');
	addr = key.getPublic('hex');
}

function testmining(address)
{
	//Mine a block
	var blockmined = pokechain.mineTransactions(addr);
	console.log("mined " +blockmined);
}

function testtrade(toaddr,fromaddr)
{
	//Grab user content
	var userbox = pokechain.getUserbox(addr);
	//Test a trade
	var pokemonid = JSON.parse(userbox[0]);
	pokemonid = pokemonid.id;
	console.log('first pokemon id before trade ' + pokemonid);
	var result = pokechain.addTransaction(addr, addr2, pokemonid, key);
	console.log(result);
	userbox = pokechain.getUserbox(addr);
	pokemonid = JSON.parse(userbox[0]);
	pokemonid = pokemonid.id;
	console.log('first pokemon id after trade ' + pokemonid);
}

function testtraderecieving(fromaddr,toaddr)
{
	var otherbox = pokechain.getUserbox(addr2);
	try
	{
		pokemonid = JSON.parse(otherbox[0]);
	}
	catch
	{
		pokemonid = otherbox[0];
	}
	pokemonid = pokemonid.id;
	console.log("amount of pokemon in recieving " + otherbox.length);

	//ensure you are passing key and not just the private key
	var result = pokechain.addTransaction(addr2, addr, pokemonid, key2);
	console.log(result);
}

function testkeygen()
{
	var newkey = pokechain.generatekey();
	console.log(newkey);
}

function testnoncedata()
{
	//how many hashes were generated to mine each block in the blockchain, in order.
	var nonces = pokechain.getNonceData();
	console.log(nonces);
}

function testpendingdata()
{
	var pt = pokechain.getPendingTransactions();
	console.log("number of pending transactions " + pt.length);
}

function basictest()
{
	testkeygen();

	testwallet();

	testmining(addr);

	testtrade(addr, addr2);

	testmining(addr);

	testtraderecieving(addr2, addr);

	testnoncedata();

	testpendingdata();
}

function testclientmining()
{
	var challengeblock = pokechain.presentMiningChallenge();
	var challengeblockid = JSON.parse(challengeblock);
	challengeblockid = challengeblockid.id;

	var challengeresult = pokechain.validateMiningChallenge(challengeblockid, 56);
	console.log('challeged pass? ' + challengeresult);
}