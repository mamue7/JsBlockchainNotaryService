/* ===== MempoolEntry Class ==============================
|  Class with a constructor for a mempool valid entry 	   |
|  ===============================================*/

class MempoolValidEntry {
    constructor(data) {
        (this.registerStar = false),
        (this.status = {
            address: "",
            requestTimeStamp = "",
            message = "",
            validationWindow = "",
            messageSignature = false
        })
    }
  }
  
  module.exports.MempoolValidEntry = MempoolValidEntry;
  