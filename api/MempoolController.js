const MempoolClass = require("../blockchain/Mempool.js");

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class MempoolController {

    /**
     * Constructor to create a new MempoolController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.initialize();
    }

    /**
     * set up blockchain data and api methods
     */
    async initialize() {
        let self = this;
        self.mempool = new MempoolClass.Mempool();
        self.addRequestValidation();
    }

    /**
     * Implement a POST Endpoint to request validation, url: "/mempool/requestValidation"
     */
    addRequestValidation() {
        let self = this;
        this.app.post("/api/mempool/addRequestValidation", (req, res) => {
            if(!req.body.data || req.body.data == "")
            {
                res.status(500). send('Error! Block contained no data!');
            }
            else 
            {
                let mempoolEntry = new MempoolClass.Mempool();
                mempoolEntry.address = req.body.address;
                self.mempool.addMempoolEntry(mempoolEntry).then(
                    res.send('Mempool entry successfully added!')
                );
            }
        });
    }
}

/*
* Exporting the MempoolController class
* @param {*} app 
*/
module.exports = (app) => { return new MempoolController(app);}