const SHA256 = require('crypto-js/sha256');
module.exports.calculateHash = function (block) {
	return SHA256(block.index + block.previousHash + block.timestamp + block.data + block.nonce).toString();
}