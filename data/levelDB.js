/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
// Importing the module 'level'
const level = require("level");
// Declaring a class
class LevelDB {

  // Declaring the class constructor
  constructor(dbName) {
    this.db = level("./db/" + dbName);
  }

  // Get data from levelDB by key (Promise)
  getLevelDBData(key) {
    let self = this; // Because we are returning a promise, we will need this to be able to reference 'this' inside the Promise constructor
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if (err) {
          if (err.type == "NotFoundError") {
            resolve(undefined);
          } else {
            reject(err);
          }
        } else {
          resolve(value);
        }
      });
    });
  }

  // Get data from levelDB by block hash
  getLevelDBDataByHash(hash) {
    let self = this; // Because we are returning a promise, we will need this to be able to reference 'this' inside the Promise constructor
    let block;
    return new Promise(function(resolve, reject) {
      self.db.createReadStream()
      .on('data', function (data) {
          var valueObject = JSON.parse(data.value);
          if(valueObject.hash === hash){
              block = valueObject;
          }
      })
      .on('error', function (err) {
          reject(err)
      })
      .on('close', function () {
          resolve(block);
      });
    });
  }

  // Get data from levelDB by block hash
  getLevelDBDataByWalletAddress(walletAddress) {
    let self = this; // Because we are returning a promise, we will need this to be able to reference 'this' inside the Promise constructor
    let blocks = [];
    return new Promise(function(resolve, reject) {
      self.db.createReadStream()
      .on('data', function (data) {
          var valueObject = JSON.parse(data.value);
          if(valueObject.body.address === walletAddress){
              blocks.push(valueObject);
          }
      })
      .on('error', function (err) {
          reject(err)
      })
      .on('close', function () {
          resolve(blocks);
      });
    });
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.put(key, value, function(err) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(value));
      });
    });
  }

  // Implement this method
  getBlocksCount() {
    let self = this;
    return new Promise(function(resolve) {
      let count = 0;
      self.db
        .createReadStream()
        .on("data", data => {
          count++;
        })
        .on("end", () => {
          // return count-1 as genesis block doesnt count
          resolve(count-1);
        });
    });
  }
}

// Export the class
module.exports.LevelDB = LevelDB;
