const Block = require('./Block.js');
const Blockchain = require('./Blockchain.js');

let myBlockChain = new Blockchain.Blockchain();
(function theLoop (i) {
  setTimeout(function () {
      let blockTest = new Block.Block("Test Block - " + (i + 1));
      myBlockChain.addNewBlock(blockTest).then((result) => {
          console.log(result);
          i++;
          if (i < 10) theLoop(i);
      });
  }, 10000);
})(0);

/*
console.log("Validate single blocks:");

(function validateBlocks (v) {
  myBlockChain.validateBlock(v).then((result) => {
      console.log(result);
      v++;
      if (v < 10) validateBlocks(v);
  });
})(0);
*/

/*
console.log("Validate chain:");

myBlockChain.validateChain().then(function(result) {
  console.log("Chain is valid!");
}, function (err) {
  console.log("Chain is not valid!");
  console.log(err); 
});
*/