const hasher = require('../src/calculatehash.js');
class BlockChain{
	constructor(chain = null) {
		if (chain == null)
		{
			this.chain = [this.createGenesis()];
		}
		else
		{
			this.chain = chain;
		}
		
	}
	
	createGenesis() {
		var genesisblock = {
			index: 0,
			timestamp: Date().toLocaleString(),
			data: "Genesis Block",
			previousHash: "0",
			nonce: 0,
			hash: "placeholder"
		}
		genesisblock.hash = hasher.calculateHash(genesisblock);
		return genesisblock;
	}
	latestBlock() {
		return this.chain[this.chain.length - 1];
	}
	addBlock(newBlock) {
		newBlock.previousHash = this.latestBlock().hash;
		newBlock.hash = hasher.calculateHash(newBlock);
		this.chain.push(newBlock);
	}
	checkValid() {
		for (var b = 1; b < this.chain.length; b++)
		{
			const currblock = this.chain[b];
			const prevblock = this.chain[b - 1];
			if (currblock.hash !== hasher.calculateHash(currblock)) {
				return false;
			}
			if (currblock.previousHash !== prevblock.hash)
			{
				return false
			}
		}
		return true;
	}
	fixChain() {
		for (var b = 1; b < this.chain.length; b++)
		{
			this.chain[b].previousHash = this.chain[b - 1].hash;
			this.chain[b].hash = hasher.calculateHash(this.chain[b]);
		}
	}
}

module.exports = BlockChain;
