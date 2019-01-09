# pokechain
A BlockChain based around pokemon, made for fun.

Blockchain module:

  //Create a block chain by requiring the blockchain.js file
  const blockchain = require('./src/blockchain.js');

  //populate the block chain 
  var pokecoins = new blockchain();
	
Block module:
  //require the block module
  const block = require('./src/block.js');
  
  //Create a block
  var NewBlock = block.CreateBlock("Any Sort of Data You Want", pokecoins.chain.length, 0)
  
Communication between the two:
  //Add a block to the block chain
  pokecoins.addBlock(NewBlock);
  
  //Check if the block chain is valid
  pokecoins.checkValid() //returns true or false
  
  //Fix blockchain
  //you can either remove the latest one, if that's whats broken with 
  pokecoins.chain.pop();
  
  //or iterate on each block and update as needed
  pokecoins.fixChain();
  
