class Transaction{
   constructor(fromAddress, toAddress, amount){
       this.fromAddress = fromAddress;
       this.toAddress = toAddress;
       this.pokemon = [];
   }
}

module.exports = Transaction;