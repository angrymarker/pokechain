//Create the blockchain
const pokechain = require('./main.js');

var key = pokechain.grabKey('test');
const curraddr = key.getPublic('hex');

//Mine a block
var blockmined = pokechain.mineTransactions(curraddr);
console.log("mined " +blockmined);

//Grab user content
var userbox = pokechain.getUserbox(curraddr);

//Test a trade
var pokemonid = JSON.parse(userbox[0]);
pokemonid = pokemonid.id;
var result = pokechain.addTransaction(curraddr, "recieving", pokemonid, key);
console.log(result);

var newkey = pokechain.generatekey();
console.log(newkey);
