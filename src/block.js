const hasher = require('../src/calculatehash.js');
module.exports.CreateBlock = function (data, index = -1, transactions = "") {
	var block = {
		index: index,
		timestamp: Date().toLocaleString(),
		data: data,
		previousHash: "0",
		nonce: 0,
		hash: "",
		transactions: transactions;
	}
	block.hash = hasher.calculateHash(block);
	return block;
}

module.exports.mineBlock = function(difficulty)
{
	while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
		this.nonce++;
		block.hash = hasher.calculateHash(block);
	}
	console.log('block mined ' + this.index);
}