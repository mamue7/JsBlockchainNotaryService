/* ===== Block Class ==============================
|  Class with a constructor for RequestObject 	   |
|  ===============================================*/

class RequestObject {
    constructor(data) {
        (this.walletAddress = ""),
        (this.requestTimeStamp = ""),
        (this.message = ""),
        (this.validationWindow = 0);
    }
  }
  
  module.exports.RequestObject = RequestObject;
  