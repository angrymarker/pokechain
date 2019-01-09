const hasher = require('../src/calculatehash.js');
module.exports.CreateBlock = function (data, index = -1, nonce = 0) {
	var block = {
		index: index,
		timestamp: Date().toLocaleString(),
		data: data,
		previousHash: "0",
		nonce: 0,
		hash: ""
	}
	block.hash = hasher.calculateHash(block);
	return block;
}

module.exports.mineBlock = function(difficulty)
{
	
}