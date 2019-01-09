const hasher = require('../src/calculatehash.js');
var nanoid = require('nanoid');
module.exports.CreateBlock = function (data, index = -1) {
	var block = {
		index: index,
		timestamp: Date().toLocaleString(),
		data: data,
		previousHash: "0",
		nonce: nanoid(),
		hash: ""
	}
	block.hash = hasher.calculateHash(block);
	return block;
}

module.exports.mineBlock = function(difficulty)
{
	
}