/* ===== Blockchain Class ==========================
|  Class with a constructor for a Mempool    		|
|  ================================================*/

const LevelDBClass = require("../data/levelDB.js");
//const mempoolDb = new LevelDBClass.LevelDB("mempool");
//const timeoutRequestsDb = new LevelDBClass.LevelDB("timeoutRequests");
const MempoolEntryClass = require("../model/MempoolEntry.js");
const MempoolValidEntryClass = require("../model/MempoolValidEntry.js");

const RequestObjectClass = require("../model/RequestObject.js");

const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {
  
  constructor() {
    this.mempool = [];
    this.timeoutRequests = [];
    this.mempoolValid = [];
  }

  /**
   * initialize blockchain with genesis block
   */
  async initialize() {
    let self = this;
  }

  // Add request validation
  addRequestValidation(walletAddress) {
    let self = this;
    return new Promise (
        function(resolve, reject) {
            
            let index = self.mempool.indexOf(walletAddress);
            let mempoolEntry = new MempoolEntryClass.MempoolEntry();
            if(index > -1) // element exists
            {
                mempoolEntry = self.mempool[walletAddress];
            }
            else 
            {
                mempoolEntry.address = walletAddress;
                // UTC timestamp
                mempoolEntry.timeStamp = new Date()
                    .getTime()
                    .toString()
                    .slice(0, -3);
                self.mempool[walletAddress] = mempoolEntry;
                self.setTimeOut(mempoolEntry);
            }

            var requestObject = new RequestObjectClass.RequestObject();
            requestObject.walletAddress = mempoolEntry.address;
            requestObject.requestTimeStamp = mempoolEntry.timeStamp;
            requestObject.message = `${requestObject.walletAddress}:${requestObject.requestTimeStamp}:starRegistry`;

            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestObject.requestTimeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            requestObject.validationWindow = timeLeft;
            
            resolve(requestObject);
            // Adding block object to chain
            /*
            mempoolDb.addLevelDBData(
              mempoolEntry.address,
              JSON.stringify(mempoolEntry).toString()
            ).then(
              function(value) {
                resolve(
                  "Mempool entry successfully added!"
                );
              },
              function(err) {
                reject(
                  "Error adding mempool entry " +
                    mempoolEntry.address +
                    "! Error: " +
                    err
                );
              }
            );
            */
        },
        function(err) {
        }
    );
  }

  // Validate request by wallet
  validateRequestByWallet(walletAddress, signature) {
    let self = this;
    return new Promise (
        function(resolve, reject) {

            let mempoolEntry = self.mempool[walletAddress];
            if(!mempoolEntry) {
                reject("Error! No existing mempool entry for given wallet address!");
            }

            // verify window time
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - mempoolEntry.timeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;

            // verify signature
            const bitcoinMessage = require('bitcoinjs-message'); 
            let isMessageValid = bitcoinMessage.verify(mempoolEntry.message, walletAddress, signature);
            let isInTimeWindow = timeLeft >= 0;

            if(isValid) {
                let mempoolValidEntry = new MempoolValidEntryClass.MempoolValidEntry();
                mempoolValidEntry.registerStar = true;
                mempoolValidEntry.status = {
                    address: walletAddress,
                    requestTimeStamp: mempoolEntry.timeStamp,
                    message: mempoolEntry.message,
                    validationWindow: timeLeft > 0 ? timeLeft : 0,
                    messageSignature: isMessageValid
                };
                self.mempoolValid[walletAddress] = mempoolValidEntry;
                // remove validation request
                self.removeValidationRequest(request.walletAddress)
                resolve(mempoolValidEntry);
            }
            else {
                reject("Error! The given request could not be verified!");
            }

        },
        function(err) {
        }
    );
  }

  // set timeout function
  setTimeOut(mempoolEntry) {
    let self = this;
    self.timeoutRequests[mempoolEntry.address] = 
        setTimeout(function(){ self.removeValidationRequest(request.walletAddress) }, TimeoutRequestsWindowTime );

  }

  // remove validation request
  removeValidationRequest(address) {
    let self = this;
    // remove from mempool
    var index = self.mempool.indexOf(address);
    if(index > -1)
        self.mempool.splice(index, 1);

    // remove from timout requests
    index = self.timeoutRequests.indexOf(address);
    if(index > -1)
        self.timeoutRequests.splice(index, 1);
  }
}

module.exports.Mempool = Mempool;
