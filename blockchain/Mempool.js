/* ===== Blockchain Class ==========================
|  Class with a constructor for a Mempool    		|
|  ================================================*/

const MempoolEntryClass = require("../model/MempoolEntry.js");
const MempoolValidEntryClass = require("../model/MempoolValidEntry.js");
const RequestObjectClass = require("../model/RequestObject.js");
const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {
  
  constructor() {
    this.mempool = [];
    this.mempoolValid = [];
    this.timeoutRequests = [];
  }

  // Add request validation
  addRequestValidation(walletAddress) {
    let self = this;
    return new Promise (
        function(resolve) {
            
            let mempoolEntry = self.mempool[walletAddress];
            if(!mempoolEntry) // element exists
            {
                mempoolEntry = new MempoolEntryClass.MempoolEntry();
                mempoolEntry.address = walletAddress;
                // UTC timestamp
                mempoolEntry.timeStamp = new Date()
                    .getTime()
                    .toString()
                    .slice(0, -3);
                mempoolEntry.message = `${mempoolEntry.address}:${mempoolEntry.timeStamp}:starRegistry`;
                self.mempool[walletAddress] = mempoolEntry;
                self.setTimeOut(mempoolEntry);
            }

            let requestObject = new RequestObjectClass.RequestObject();
            requestObject.walletAddress = mempoolEntry.address;
            requestObject.requestTimeStamp = mempoolEntry.timeStamp;
            requestObject.message = mempoolEntry.message;

            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestObject.requestTimeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            requestObject.validationWindow = timeLeft;            
            resolve(requestObject);
        },
        function(err) {
            reject(err);
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
            let isMessageValid = bitcoinMessage.verify(mempoolEntry.message, mempoolEntry.address, signature);
            let isInTimeWindow = timeLeft >= 0;

            if(isMessageValid && isInTimeWindow) {
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
                self.removeValidationRequest(walletAddress);
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

  // verify address request
  verifyAddressRequest(walletAddress) {
      let self = this;
      return new Promise(
          function(resolve, reject) {
              if(self.mempoolValid[walletAddress])
              {
                delete self.mempoolValid[walletAddress];
                resolve();
              }
              else
                reject();
          }
      );
  }

  // set timeout function
  setTimeOut(mempoolEntry) {
    let self = this;
    self.timeoutRequests[mempoolEntry.address] = 
        setTimeout(function(){ self.removeValidationRequest(mempoolEntry.address) }, TimeoutRequestsWindowTime );

  }

  // remove validation request
  removeValidationRequest(address) {
    let self = this;
    // remove from mempool
    if(self.mempool[address])
        delete self.mempool[address];

    // remove from timout requests
    if(self.timeoutRequests[address])
        delete self.timeoutRequests[address];
  }
}

module.exports.Mempool = Mempool;
