/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require("crypto-js/sha256");
const LevelDBClass = require("../data/levelDB.js");
const db = new LevelDBClass.LevelDB();
const Block = require("../model/Block.js");

class Blockchain {
  
  constructor() {

  }

  /**
   * initialize blockchain with genesis block
   */
  async initialize() {
    let self = this;
    // check if genesis block (index=0) exists
    await self.getBlockHeight().catch(async function(err) {
        // create genesis block on init
        await self.addGenesisBlock().then(
          function(message) {
            console.log(message);
          },
          function(err) {});
      }
    );  
  }

  // Add new block
  addBlock(newBlock) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getBlockHeight().then(
        function(height) {
          // set height of the block
          newBlock.height = height + 1;
          // set previous block hash
          self.getBlock(newBlock.height - 1).then(function(previousBlock) {
            // previous block hash
            newBlock.previousBlockHash = previousBlock.hash;
            // UTC timestamp
            newBlock.time = new Date()
              .getTime()
              .toString()
              .slice(0, -3);
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            // Adding block object to chain
            db.addLevelDBData(
              newBlock.height,
              JSON.stringify(newBlock).toString()
            ).then(
              function(block) {
                resolve(block);
              },
              function(err) {
                reject(
                  "Error adding Block " +
                    newBlock.height +
                    " to chain! Error: " +
                    err
                );
              }
            );
          });
        },
        function(err) {
          // getBlockHeight rejects if genesis block doesn't exist
          self.addGenesisBlock().then(
            function(message) {
              // continue to add new block after genesis block has been created
              self.addBlock(newBlock);
            },
            function(err) {
            }
          );
        }
      );
    });
  }

  // Add genesis block to chain
  addGenesisBlock() {
    return new Promise((resolve, reject) => {
      let genBlock = new Block.Block(
        "First block in the chain - Genesis block"
      );
      genBlock.time = new Date()
        .getTime()
        .toString()
        .slice(0, -3);
      genBlock.hash = SHA256(JSON.stringify(genBlock)).toString();
      // Adding block object to chain
      db.addLevelDBData(
        genBlock.height,
        JSON.stringify(genBlock).toString()
      ).then(
        function(value) {
          resolve("Genesis Block successfully added to chain!");
        },
        function(err) {
          reject("Error adding Genesis Block to chain! Error: " + err);
        }
      );
    });
  }

  // Get block height
  getBlockHeight() {
    return new Promise((resolve, reject) => {
      db.getBlocksCount().then(function(count) {
        if (count == -1) { // no genesis block
          reject();
        } else {
          resolve(count);
        }
      });
    });
  }

  // Get block by height
  getBlock(blockHeight) {
    return new Promise((resolve, reject) => {
      db.getLevelDBData(blockHeight).then(
        function(value) {
          if (value) resolve(JSON.parse(value));
          else reject();
        },
        function(err) {
          reject(err);
        }
      );
    });
  }

  // Get block by hash
  getBlockByHash(blockHash) {
    return new Promise((resolve, reject) => {
      db.getLevelDBDataByHash(blockHash).then(
        function(block) {
          if (block) resolve(block);
          else reject();
        },
        function(err) {
          reject(err);
        }
      );
    });    
  }

  // Get block by hash
  getBlockByWalletAddress(walletAddress) {
    return new Promise((resolve, reject) => {
      db.getLevelDBDataByWalletAddress(walletAddress).then(
        function(blocks) {
          resolve(blocks);
        },
        function(err) {
          reject(err);
        }
      );
    });    
  }

  // Validate block
  validateBlock(blockHeight) {
    let self = this;
    return new Promise((resolve) => {
      self.getBlock(blockHeight).then(function(block) {
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = "";
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Validate blockchain
  async validateChain() {
    let self = this;
    return new Promise(async (resolve, reject) => {
      let errorLog = [];
      try {
        let height = await self.getBlockHeight();
        for (let i = 0; i <= height; i++) {
          // validate block
          let blockIsValid = await self.validateBlock(i);
          if(!blockIsValid)
            errorLog.push("Hash of Block " + i + " is invalid!");
          // check hashes of current and next block if current block is not the last one 
          if(i < height)
          {
            // compare blocks hash link
            let block = await self.getBlock(i);
            let nextBlock = await self.getBlock(block.height + 1);
            if (block.hash !== nextBlock.previousBlockHash) 
              errorLog.push("Error! Hash of block " + block.height + " and previous block hash of next block differ!");
          }
        }
      }
      catch(err) {
        errorLog.push(err);
      }
      resolve(errorLog);
    });
  }
}

module.exports.Blockchain = Blockchain;
