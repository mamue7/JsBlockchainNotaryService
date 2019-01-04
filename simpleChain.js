const Block = require("./Block.js");
const Blockchain = require("./Blockchain.js");

let myBlockChain = new Blockchain.Blockchain();
/*
(function theLoop(i) {
  setTimeout(function() {
    let blockTest = new Block.Block("Test Block - " + (i + 1));
    myBlockChain.addBlock(blockTest).then(result => {
      console.log(result);
      i++;
      if (i < 10) theLoop(i);
    });
  }, 10000);
})(0);
*/

console.log("Validate single blocks and complete chain:");

(function validateBlocks (v) {
  bc.validateBlock(v).then((result) => {
      console.log(result ? "Block " + v + " is valid" : "Block " + v + " is not valid");
      v++;
      if (v < 10) validateBlocks(v);
  });
})(0);

bc.validateChain().then(function(result) {
  if(result.length > 0)
    console.log(result); 
  else 
    console.log("The chain is valid!");
});

