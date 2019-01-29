//Create the blockchain
const pokechain = require('./main.js');

var key = pokechain.grabKey('test');
const curraddr = key.getPublic('hex');

//Mine a block
pokechain.mineTransactions(curraddr);

//Grab user content
var userbox = pokechain.getUserbox(curraddr);

//Test a trade
var pokemonid = JSON.parse(userbox[0]);
pokemonid = pokemonid.id;
pokechain.addTransaction(curraddr, "recieving", pokemonid, key);
