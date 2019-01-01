/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
// Importing the module 'level'
const level = require('level');
// Declaring the folder path that store the data
const chainDB = './chaindata';
// Declaring a class
class LevelDB {
	// Declaring the class constructor
    constructor() {
    	this.db = level(chainDB);
    }
  
  	// Get data from levelDB with a key (Promise)
  	getLevelDBData(key){
        let self = this; // Because we are returning a promise, we will need this to be able to reference 'this' inside the Promise constructor
        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                    resolve(value);
                }
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
                resolve(value);
            });
        });
    }
  
  	// Implement this method
    getBlocksCount() {
        let self = this;

        return new Promise(function(resolve) {
                let count = 0;
                self.db.createReadStream()
                    .on('data', data => { count++ })
                    .on('end', () => { resolve(count); })
            });

        /*
            let count = 0;
            var batch = []
            var keys = self.db.createKeyStream().then;
            keys.on('data', function(key) {
                batch.push({ type: "del", key: key });
            });
            //self.db.createKeyStream().on('data', function (data) {
            //    console.log("count: " + count++);
            //});
            resolve(batch.length);
            */
    }
}

// Export the class
module.exports.LevelDB = LevelDB;