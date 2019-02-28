const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const pokegen = require('./pokemongenerator.js');
const config = require('../config/config.json');

class Transaction {
	constructor(fromAddr, toAddr, pokemon) {
		this.fromAddr = fromAddr;
		this.toAddr = toAddr;
		this.pokemon = pokemon;
		this.timeStamp = Date.now();
	}
	
	calculateHash() {
		return SHA256(this.fromAddr, this.toAddr, this.pokemon, this.timeStamp).toString();
	}
	
	signTransaction(key) {
		if (key.getPublic('hex') !== this.fromAddr) {
			throw new Error('Incorrect wallet signing transaction!');
		}
		const hash = this.calculateHash();
		const sig = key.sign(hash, 'base64');
		this.signature = sig.toDER('hex');
	}
	
	isValid() {
		//if there is no from addr, then it's a reward and valid
		if (this.fromAddr == null)
		{
			return true;
		}
		if (!this.signature || this.signature.length == 0)
		{
			throw new Error('Unable to find signature for transaction!');
		}
		const key = ec.keyFromPublic(this.fromAddr, 'hex');
		return key.verify(this.calculateHash(), this.signature);
	}
	
}

class Block {
	constructor(transactions, previousHash = '', id = 0, timeStamp = Date.now(), nonce = 0, hash = this.calculateHash()) {
		this.id = id;
		this.previousHash = previousHash;
		this.timestamp = timeStamp;
		this.transactions = transactions;
		this.nonce = nonce;
		this.hash = hash;
	}
	
	calculateHash() {
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}
	
	mineBlock(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0'))
		{
			this.nonce++;
			this.hash = this.calculateHash();
		}
		return this.hash;
	}
    
    validateMineChallenge(nonce, difficulty){
        if (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            return false;
        }
        return true;
    }
	
	hasValidTransactions()
	{
		for (const t of this.transactions) {
			if (tx.isValid() == false) {
				return false;
			}
		}
		return true;
	}
}

class Blockchain {
	constructor(chain = null) {
		this.chain = this.createchain(chain);
		this.difficulty = config.Main.difficulty;
		this.pendingTransactions = [];
		this.miningReward = 6;
		this.challengeBlock = null;
	}
	
	createchain(chain = null) {
		if (chain == null)
		{
			return [this.createGenesisBlock()];
		}
		else
		{
			var passchain = [];
			for (var c = 0; c < chain.length; c++)
			{
				var block = new Block(chain[c].transactions, chain[c].previousHash, passchain.length, chain[c].timestamp, chain[c].nonce, chain[c].hash);
				passchain.push(block);
			}
			return passchain;
		}
	}
	
	setReward(numberOfPokemon)
	{
		if (numberOfPokemon <=0)
		{
			throw new Error('Can\'t have a reward less than 1!');
		}
		else
		{
			if (numberOfPokemon > 100)
			{
				numberOfPokemon = 100;
			}
			this.miningReward = numberOfPokemon;
		}
	}
	
	createGenesisBlock() {
		return new Block([], '0', 0, Date.parse('2018-01-02'),0);
	}
	
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
    
    getNonceData() {
        var nonces = [];
        for (const block of this.chain) {
            var nonce = block.nonce;
            nonces.push(nonce)
        }
        return nonces;
    }
    
    getPendingTransactions() {
        return this.pendingTransactions;
    }
	
	minePendingTransactions(rewardAddr, nonce = 0) {
		const pokereward = this.getminingreward(this.miningReward, rewardAddr);
		const rewardTrans = new Transaction(null, rewardAddr, pokereward);
		this.pendingTransactions.push(rewardTrans);
		
		let block = new Block(this.pendingTransactions, this.getLatestBlock().hash, this.chain.length, Date.now(), nonce);
		var hash = block.mineBlock(this.difficulty);
		
		this.chain.push(block);
		this.pendingTransactions = [];
		return hash;
	}
    
    presentMiningChallenge() {
    	if (this.challengeBlock == null)
    	{
    		let block = new Block(this.pendingTransactions, this.getLatestBlock().hash, this.chain.length, Date.now(), 0);
    		this.challengeBlock = block;
        	return block;
    	}
    	else
    	{
    		return this.challengeBlock;
    	}
        
    }
    
    validateMiningChallenge(blockid, numpendingtrans, nonce){
    	console.log("passed " + blockid);
    	console.log("chain " + this.challengeBlock.id);
    	if (this.challengeBlock == null)
    	{
    		throw new Error('No challenge block present!');
    	}
    	else if (blockid == this.challengeBlock.id)
    	{
    		if (numpendingtrans == this.challengeBlock.transactions.length)
    		{
    			var result = this.challengeBlock.validateMineChallenge(nonce, this.difficulty);
    			return result;
    		}
    		else
    		{
    			throw new Error('Transactions on challenge block do not match!');
    		}
    	}
    	else
    	{
    		throw new Error('You don\'t have the current challenge block!');
    	}
    }
	
	addTransaction(transaction) {
		if (!transaction.fromAddr || !transaction.toAddr) {
	      throw new Error('Transaction is missing to and from addr!');
    	}

    // Verify the transactiion
	    if (!transaction.isValid()) {
    	  throw new Error('Transaction invalid! Unable to add to chain!');
	    }

    	this.pendingTransactions.push(transaction);
	}
	
	getUserPokebox(address) {
		let pokebox = [];
		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddr === address) {
					for (var p = 0; p < trans.pokemon.length; p++)
					{
						pokebox = this.removefromarray(pokebox, trans.pokemon[p]);
					}
				}
				if (trans.toAddr === address) {
					for (var p = 0; p < trans.pokemon.length; p++)
					{
						pokebox.push(trans.pokemon[p]);
					}
				}
			}
			for (const trans of this.pendingTransactions) {
                if (trans.fromAddr === address) {
                    for (var p = 0; p < trans.pokemon.length; p++)
					{
						console.log('removed via pending');
						pokebox = this.removefromarray(pokebox, trans.pokemon[p]);
					}
                }
            
      		}
    	}
    	pokebox.sort(function(a, b){
    		try{
			a = JSON.parse(a);
			b = JSON.parse(b);
			}
			catch (err)
			{
			}
			return a.Pokemon.id - b.Pokemon.id;
		});
    	return pokebox;
	}
	
	getUserTransactions(address) {
		var transactions = [];
		for (const block of this.chain) {
			for (const tx of block.transactions) {
				if (tx.fromAddr === address || tx.toAddr === address) {
					transactions.push(tx);
				}
			}
		}
		return transactions;
	}
	
	getPokemonTransactions(pid) {
		var transactions = [];
		for (const block of this.chain) {
			for (const tx of block.transactions) {
				var pokemon = tx.pokemon;
				if (pid == pokemon.id)
				{
					transactions.push(tx);
				}
			}
		}
		return transactions;
	}
	
	isValid(){
		const genesisref = JSON.stringify(this.createGenesisBlock());
		if (genesisref != JSON.stringify(this.chain[0])) {
			console.log('genesiserr');
			return false;
		}
		for (let b = 2; b < this.chain.length; b++)
		{
			const currBlock = this.chain[b];
			const prevBlock = this.chain[b - 1];
			
			if (prevBlock.hash != currBlock.previousHash)
			{
				console.log('prevfail');
				return b;
			}
			if (prevBlock.calculateHash() != currBlock.previousHash)
			{
				console.log('prevfail2');
				return b;
			}
			if (currBlock.hash != currBlock.calculateHash()) {
				console.log('currfail');
				return b;
			}
		}
		return -1;
	}
	
	removefromarray(array, search_term) {
		for (var y = array.length - 1; y >= 0; y--) {
			var currpoke = JSON.parse(array[y]);
			if (currpoke.id == search_term.id)
			{
				array.splice(y, 1);
				return array;
			}
			
		}
		return array;
	}
	
	getminingreward(quantity, rewardAddr = null) {
		var reward = [];
		for (var q = 0; q < quantity; q++)
		{
			reward.push(pokegen.createpokemon(rewardAddr));
		}
		return reward;
	}
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;
