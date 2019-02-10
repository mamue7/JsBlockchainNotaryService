/* ===== MempoolEntry Class ==============================
|  Class with a constructor for a mempool entry 	   |
|  ===============================================*/

class MempoolEntry {
    constructor(data) {
        (this.address = ""),
        (this.timeStamp = 0)
    }
  }
  
  module.exports.MempoolEntry = MempoolEntry;
  